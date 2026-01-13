import { useEffect, useState } from "react";
import { User } from "../types/users";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../services/userService";

const initialUsers: User[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@company.com",
    team: "Marketing",
    team_id:"1",
    is_active: true,
  },
  {
    id: "2",
    name: "Carlos Santos",
    email: "carlos.santos@company.com",
    team: "Desenvolvimento",
    team_id:"2",
    is_active: true,
  },
  {
    id: "3",
    name: "Beatriz Costa",
    email: "beatriz.costa@company.com",
    team: "Design",
    team_id:"3",
    is_active: true,
  },
  {
    id: "4",
    name: "Daniel Oliveira",
    email: "daniel.oliveira@company.com",
    team: "Vendas",
    team_id:"4",
    is_active: false,
  },
  {
    id: "5",
    name: "Fernanda Lima",
    email: "fernanda.lima@company.com",
    team: "RH",
    team_id:"5",
    is_active: false,
  },
];
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      console.log("Fetched users:", data);
    } catch {
      setError("Erro ao buscar usuários");
      setUsers(initialUsers)
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (user: Omit<User, "id">) => {
    const newUser = await createUser(user);
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = async (id: string, user: Omit<User, "id">) => {
    const updated = await updateUser(id, user);
    setUsers(prev =>
      prev.map(u => (u.id === id ? updated : u))
    );
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
  };
}
