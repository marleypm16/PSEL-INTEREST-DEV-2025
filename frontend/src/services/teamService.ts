import api from "../api/api";
import { Team,CreateTeamDTO } from "../types/teams";
export const createTeam = async (teamData: CreateTeamDTO): Promise<Team> => {
    const response = await api.post<Team>("/teams", teamData);
    return response.data;
}

export const getTeams = async (): Promise<Team[]> => {
    const response = await api.get<Team[]>("/teams");
    return response.data;
}
export const updateTeam = async (teamId: string, teamData: CreateTeamDTO): Promise<Team> => {
    const response = await api.put<Team>(`/teams/${teamId}`, teamData);
    return response.data;
}
export const deleteTeam = async (teamId: string): Promise<void> => {
    await api.delete(`/teams/${teamId}`);
}

export const transferMember = async (memberId: string, newTeamId: string): Promise<void> => {
    await api.post(`/{${newTeamId}/member/{${memberId}`, { member_id: memberId, new_team_id: newTeamId });
}

export const removeMember = async (memberId: string, teamId: string): Promise<void> => {
    await api.delete(`/teams/${teamId}/member/${memberId}`);
}