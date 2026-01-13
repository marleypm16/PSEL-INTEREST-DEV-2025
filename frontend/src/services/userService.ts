import api from "../api/api";
import { CreateUserDTO, User } from "../types/users";
export const createUser = async (userData: CreateUserDTO): Promise<User> => {
    const response = await api.post<User>("/users", userData);
    return response.data;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
}

export const updateUser = async (userId: string, userData: CreateUserDTO): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
}

export const deleteUser = async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
}