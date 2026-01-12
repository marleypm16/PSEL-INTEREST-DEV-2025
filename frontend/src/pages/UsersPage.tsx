import { useEffect, useState } from 'react';

import { Button } from '../components/Button';
import { User } from '../types/users';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState(""); // Apenas o nome

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setUsers([
        { id: 'u1', name: 'Alice', team_id: '1' },
        { id: 'u2', name: 'Bob', team_id: '' },
      ]);
    } catch (error) {
      alert("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user.name);
    } else {
      setEditingUser(null);
      setFormData("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trim()) return;

    try {
      if (editingUser) {
        // Editar
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, name: formData } : u));
      } else {
        // Criar
        const newUser = { id: `u${users.length + 1}`, name: formData, team_id: '' };
        setUsers([...users, newUser]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Erro ao salvar usuário.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      alert("Erro ao excluir. Verifique se ele não é líder de uma equipe.");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">
          Usuários
        </h1>
        <Button onClick={() => handleOpenModal()}>
           Novo Usuário
        </Button>
      </header>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {/* VISÃO DESKTOP: TABELA */}
          <table className="users-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="member-avatar">{user.name.charAt(0).toUpperCase()}</div>
                      {user.name}
                    </div>
                  </td>
                  <td>
                    {user.team_id ? (
                      <span className="status-badge status-busy">Em Equipe</span>
                    ) : (
                      <span className="status-badge status-free">Disponível</span>
                    )}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Button variant="outline" onClick={() => handleOpenModal(user)} title="Editar">
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(user.id)} title="Excluir">
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* VISÃO MOBILE: CARDS */}
          <div className="mobile-user-list">
            {users.map((user) => (
              <div key={user.id} className="mobile-user-card">
                <div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {user.name}
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    {user.team_id ? (
                      <span className="status-badge status-busy">Em Equipe</span>
                    ) : (
                      <span className="status-badge status-free">Disponível</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="outline" onClick={() => handleOpenModal(user)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(user.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </h2>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Nome Completo</label>
                <input 
                  autoFocus
                  className="form-select" // Reutilizando estilo de input
                  placeholder="Ex: João da Silva"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UsersPage;