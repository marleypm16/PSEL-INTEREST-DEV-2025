import { useEffect, useState } from "react";
import { CreateUserDTO, User } from "../types/users";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../services/userService";

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (user: CreateUserDTO) => {
    const newUser = await createUser(user);
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = async (id: string, user: CreateUserDTO) => {
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
export default useUsers;