import uuid
from fastapi.testclient import TestClient

# ==========================================
# 1. TESTES DE CRIAÇÃO (POST)
# ==========================================

def test_create_user_success(client: TestClient):
    """
    Caminho Feliz: Deve criar um usuário e retornar ID e Status 201.
    """
    payload = {"name": "Desenvolvedor Python"}
    response = client.post("/users/", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert "id" in data
    assert "team_id" in data
    assert data["team_id"] is None  # Usuário nasce sem time

def test_create_user_validation_error(client: TestClient):
    """
    Caminho de Insucesso: Tentar criar sem nome deve retornar 422 (Unprocessable Entity).
    Isso valida se o Schema Pydantic está funcionando.
    """
    # Payload vazio
    response = client.post("/users/", json={})
    assert response.status_code == 422
    
    # Payload com tipo errado (ex: nome sendo um número)
    response = client.post("/users/", json={"name": 12345}) 
    # Dependendo da config do Pydantic ele pode coagir int para str, 
    # mas enviar um dict ou list quebraria certeza.
    response_error = client.post("/users/", json={"name": ["lista", "invalida"]})
    assert response_error.status_code == 422

# ==========================================
# 2. TESTES DE LEITURA (GET)
# ==========================================

def test_read_users_list(client: TestClient):
    """
    Caminho Feliz: Deve listar usuários cadastrados.
    """
    # Cria 2 usuários para ter o que listar
    client.post("/users/", json={"name": "User A"})
    client.post("/users/", json={"name": "User B"})

    response = client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2 # Pode ter sujeira de outros testes se não limparmos, então >= é seguro

def test_read_user_by_id_success(client: TestClient):
    """
    Caminho Feliz: Busca um usuário específico pelo ID.
    """
    # 1. Cria
    create_resp = client.post("/users/", json={"name": "Busca ID"})
    user_id = create_resp.json()["id"]

    # 2. Busca
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["id"] == user_id
    assert response.json()["name"] == "Busca ID"

def test_read_user_not_found(client: TestClient):
    """
    Caminho de Insucesso: Busca ID inexistente deve dar 404.
    """
    random_id = uuid.uuid4()
    response = client.get(f"/users/{random_id}")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

# ==========================================
# 3. TESTES DE ATUALIZAÇÃO (PATCH)
# ==========================================

def test_update_user_success(client: TestClient):
    """
    Caminho Feliz: Atualiza o nome de um usuário.
    """
    # 1. Cria
    create_resp = client.post("/users/", json={"name": "Nome Antigo"})
    user_id = create_resp.json()["id"]

    # 2. Atualiza (PUT)
    payload = {"name": "Nome Novo"}
    response = client.put(f"/users/{user_id}", json=payload)
    
    assert response.status_code == 200
    assert response.json()["name"] == "Nome Novo"

    # 3. Verifica persistência (Busca de novo para garantir que salvou)
    check_resp = client.get(f"/users/{user_id}")
    assert check_resp.json()["name"] == "Nome Novo"

def test_update_user_not_found(client: TestClient):
    """
    Caminho de Insucesso: Tentar atualizar usuário que não existe.
    """
    random_id = uuid.uuid4()
    response = client.put(f"/users/{random_id}", json={"name": "Hacker"})
    assert response.status_code == 404

def test_update_user_validation_ignores_extra_fields(client: TestClient):
    """
    Caminho de Segurança: Se enviar campos extras, a API deve ignorar ou validar,
    mas não pode quebrar ou salvar lixo.
    """
    create_resp = client.post("/users/", json={"name": "Teste Extra"})
    user_id = create_resp.json()["id"]

    # Envia campo "admin: true" que não existe no Schema
    response = client.put(f"/users/{user_id}", json={"name": "Teste Extra", "admin": True})
    
    # Deve funcionar (200) mas ignorar o admin, OU dar 422 se configurado 'extra="forbid"'
    # No padrão do FastAPI ele ignora o extra e atualiza o resto.
    assert response.status_code == 200 
    
    # Verifica se não salvou sujeira (se o response model filtrou)
    data = response.json()
    assert "admin" not in data

# ==========================================
# 4. TESTES DE REMOÇÃO (DELETE)
# ==========================================

def test_delete_user_success(client: TestClient):
    """
    Caminho Feliz: Deleta usuário e garante que ele sumiu.
    """
    # 1. Cria
    create_resp = client.post("/users/", json={"name": "Vou ser deletado"})
    user_id = create_resp.json()["id"]

    # 2. Deleta
    response = client.delete(f"/users/{user_id}")
    assert response.status_code == 204
    assert response.content == b"" # Status 204 não tem corpo

    # 3. Tenta buscar (Deve dar 404 agora)
    check_resp = client.get(f"/users/{user_id}")
    assert check_resp.status_code == 404

def test_delete_user_not_found(client: TestClient):
    """
    Caminho de Insucesso: Tentar deletar quem não existe.
    """
    random_id = uuid.uuid4()
    response = client.delete(f"/users/{random_id}")
    assert response.status_code == 404