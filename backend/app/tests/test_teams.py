import uuid
from fastapi.testclient import TestClient

# ==========================================
# 1. TESTES DE CRIAÇÃO (POST)
# ==========================================

def test_create_team_success(client: TestClient):
    """
    Caminho Feliz: Deve criar um time, desde que tenha um líder válido.
    """
    # 1. Cria um usuário para ser líder
    user_resp = client.post("/users/", json={"name": "Capitão"})
    leader_id = user_resp.json()["id"]

    # 2. Cria o time
    payload = {"name": "Time Alpha", "leader_id": leader_id}
    response = client.post("/teams/", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Time Alpha"
    assert data["leader_id"] == leader_id
    assert "id" in data

def test_create_team_validation_error(client: TestClient):
    """
    Caminho de Insucesso: Tentar criar time sem leader_id (Schema Pydantic bloqueia).
    """
    response = client.post("/teams/", json={"name": "Time Sem Líder"})
    assert response.status_code == 422  # Unprocessable Entity

def test_create_team_duplicate_leader_failure(client: TestClient):
    """
    Caminho de Insucesso (Regra de Negócio): 
    Um usuário não pode liderar dois times. O Banco deve bloquear.
    """
    # 1. Setup: Cria Líder e Time A
    u_resp = client.post("/users/", json={"name": "Líder Ocupado"})
    leader_id = u_resp.json()["id"]
    client.post("/teams/", json={"name": "Time A", "leader_id": leader_id})

    # 2. Tenta criar Time B com MESMO líder
    response = client.post("/teams/", json={"name": "Time B", "leader_id": leader_id})
    
    # O status pode ser 500 (IntegrityError não tratado) ou 400/409 se tratado.
    # O importante é que NÃO seja 201.
    assert response.status_code != 201

# ==========================================
# 2. TESTES DE LEITURA (GET)
# ==========================================

def test_read_teams_list(client: TestClient):
    """
    Caminho Feliz: Listar times.
    """
    # Setup rápido
    u1 = client.post("/users/", json={"name": "L1"}).json()["id"]
    client.post("/teams/", json={"name": "T1", "leader_id": u1})
    
    response = client.get("/teams/")
    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_read_team_by_id_not_found(client: TestClient):
    """
    Caminho de Insucesso: ID inexistente.
    """
    random_id = uuid.uuid4()
    response = client.get(f"/teams/{random_id}")
    assert response.status_code == 404

# ==========================================
# 3. TESTES DE ATUALIZAÇÃO (PATCH)
# ==========================================

def test_update_team_name_success(client: TestClient):
    """
    Caminho Feliz: Mudar apenas o nome do time.
    """
    # Setup
    u1 = client.post("/users/", json={"name": "L1"}).json()["id"]
    t1 = client.post("/teams/", json={"name": "Nome Velho", "leader_id": u1}).json()
    team_id = t1["id"]

    # Action
    response = client.put(f"/teams/{team_id}", json={"name": "Nome Novo"})
    
    assert response.status_code == 200
    assert response.json()["name"] == "Nome Novo"
    assert response.json()["leader_id"] == u1 # Líder não mudou

def test_update_team_not_found(client: TestClient):
    """
    Caminho de Insucesso: Atualizar time fantasma.
    """
    random_id = uuid.uuid4()
    response = client.put(f"/teams/{random_id}", json={"name": "Nada"})
    assert response.status_code == 404

# ==========================================
# 4. TESTES DE REMOÇÃO (DELETE)
# ==========================================

def test_delete_team_success(client: TestClient):
    """
    Caminho Feliz: Apagar time existente.
    """
    u1 = client.post("/users/", json={"name": "L1"}).json()["id"]
    t1 = client.post("/teams/", json={"name": "T1", "leader_id": u1}).json()
    team_id = t1["id"]

    response = client.delete(f"/teams/{team_id}")
    assert response.status_code == 204
    assert response.content == b""

    # Verifica se sumiu
    assert client.get(f"/teams/{team_id}").status_code == 404

def test_delete_team_not_found(client: TestClient):
    """
    Caminho de Insucesso: Apagar time inexistente.
    """
    random_id = uuid.uuid4()
    response = client.delete(f"/teams/{random_id}")
    assert response.status_code == 404

# ==========================================
# 5. TESTES DE MEMBROS (A Lógica Complexa)
# ==========================================

def test_add_member_to_team_success(client: TestClient):
    """
    Caminho Feliz: Adicionar um usuário livre a um time.
    """
    # 1. Setup: Time e Usuário
    leader_id = client.post("/users/", json={"name": "Lider"}).json()["id"]
    team_id = client.post("/teams/", json={"name": "Time X", "leader_id": leader_id}).json()["id"]
    
    member_id = client.post("/users/", json={"name": "Membro Novo"}).json()["id"]

    # 2. Adiciona
    response = client.post(f"/teams/{team_id}/member/{member_id}")
    assert response.status_code == 201
    
    # 3. Valida no User se o team_id foi atualizado
    check_user = client.get(f"/users/{member_id}").json()
    assert check_user["team_id"] == team_id

def test_move_member_between_teams(client: TestClient):
    """
    Caminho Feliz (Regra Crítica): Mover usuário do Time A para o Time B.
    """
    # Setup: 2 Times
    l1 = client.post("/users/", json={"name": "L1"}).json()["id"]
    t1_id = client.post("/teams/", json={"name": "T1", "leader_id": l1}).json()["id"]

    l2 = client.post("/users/", json={"name": "L2"}).json()["id"]
    t2_id = client.post("/teams/", json={"name": "T2", "leader_id": l2}).json()["id"]

    member_id = client.post("/users/", json={"name": "Viajante"}).json()["id"]

    # 1. Entra no Time 1
    client.post(f"/teams/{t1_id}/member/{member_id}")
    assert client.get(f"/users/{member_id}").json()["team_id"] == t1_id

    # 2. Muda para Time 2 (Endpoint de adicionar no T2 deve sobrescrever o T1)
    response = client.post(f"/teams/{t2_id}/member/{member_id}")
    assert response.status_code == 201

    # 3. Verifica mudança
    user_final = client.get(f"/users/{member_id}").json()
    assert user_final["team_id"] == t2_id
    assert user_final["team_id"] != t1_id

def test_add_member_not_found(client: TestClient):
    """
    Caminho de Insucesso: Usuário ou Time inexistente.
    """
    # Debug: Vamos ver o que está acontecendo na criação do usuário
    resp = client.post("/users/", json={"name": "L1"})
    
    # SE ISSO IMPRIMIR ALGO DIFERENTE DE 201, SABEREMOS O ERRO
    print(f"\nSTATUS: {resp.status_code}")
    print(f"BODY: {resp.json()}")

    # A linha que dava erro:
    u1 = resp.json()["id"]
    print(f"USER ID CRIADO: {u1}")
    t1_id = client.post("/teams/", json={"name": "T1", "leader_id": u1}).json()["id"]
    fake_id = uuid.uuid4()

    # Caso 1: Time existe, Usuário não
    resp1 = client.post(f"/teams/{t1_id}/membro/{fake_id}")
    print(f"RESP1 STATUS: {resp1.status_code}")
    assert resp1.status_code == 404

    # Caso 2: Usuário existe, Time não
    valid_user = client.post("/users/", json={"name": "U2"}).json()["id"]
    resp2 = client.post(f"/teams/{fake_id}/member/{valid_user}")
    print(f"RESP2 STATUS: {resp2.status_code}")
    assert resp2.status_code == 404 # Ou 500 dependendo do FK, mas nossa rota trata isso

def test_remove_member_success(client: TestClient):
    """
    Caminho Feliz: Remover membro do time.
    """
    # Setup
    l1 = client.post("/users/", json={"name": "L1"}).json()["id"]
    t1_id = client.post("/teams/", json={"name": "T1", "leader_id": l1}).json()["id"]
    m1 = client.post("/users/", json={"name": "Membro"}).json()["id"]
    
    # Adiciona primeiro
    client.post(f"/teams/{t1_id}/member/{m1}")

    # Remove
    response = client.delete(f"/teams/{t1_id}/member/{m1}")
    assert response.status_code == 204

    # Verifica se team_id ficou null
    user_check = client.get(f"/users/{m1}").json()
    assert user_check["team_id"] is None

def test_remove_member_not_in_team(client: TestClient):
    """
    Caminho de Insucesso: Tentar remover um usuário que não faz parte daquele time.
    """
    l1 = client.post("/users/", json={"name": "L1"}).json()["id"]
    t1_id = client.post("/teams/", json={"name": "T1", "leader_id": l1}).json()["id"]
    m1 = client.post("/users/", json={"name": "Solteiro"}).json()["id"]

    # Usuário existe, Time existe, mas eles não têm relação
    response = client.delete(f"/teams/{t1_id}/member/{m1}")
    
    # Nossa regra de negócio na rota diz que deve retornar 404 
    # se o usuário não pertencer ao time especificado na URL.
    assert response.status_code == 404