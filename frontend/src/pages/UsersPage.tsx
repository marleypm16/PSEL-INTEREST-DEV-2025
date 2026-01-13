import { useEffect, useState } from 'react';

import { Button } from '../components/button/Button';
import { User } from '../types/users';
import UsersTable from '../components/UsersTable';
import UsersCards from '../components/UsersCards';
import Modal from '../components/Modal';

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
          <UsersTable users={users} handleOpenModal={handleOpenModal} handleDelete={handleDelete} />

          {/* VISÃO MOBILE: CARDS */}
          <UsersCards users={users} handleOpenModal={handleOpenModal} handleDelete={handleDelete} />
        </>
      )}
      {isModalOpen && (
        <Modal 
          editingUser={editingUser} 
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};
export default UsersPage;