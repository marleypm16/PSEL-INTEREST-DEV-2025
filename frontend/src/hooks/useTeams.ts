import {
  addMember,
  createTeam,
  deleteTeam,
  getTeamById,
  getTeams,
  removeMember,
  updateTeam
} from "../services/teamService";

import { CreateTeamDTO, Team } from "@/types/teams";
import { useState } from "react";
import { toast } from "sonner";

const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  const removeUserFromAllTeams = (teams: Team[], userId: string) =>
    teams.map(team => ({
      ...team,
      members: team.members?.filter(m => m.id !== userId)
    }));

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await getTeams();
      setTeams(data);
    } catch {
      toast.error("Erro ao buscar equipes");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamById = async (id: string) => {
    return await getTeamById(id);
  };

  const handleCreateTeam = async (teamData: CreateTeamDTO) => {
    const newTeam = await createTeam(teamData);
    const leaderId = newTeam.leader_id;

    setTeams(prev => {
      const cleaned = leaderId
        ? removeUserFromAllTeams(prev, leaderId)
        : prev;

      return [...cleaned, newTeam];
    });

    return newTeam;
  };

  const handleUpdateTeam = async (id: string, teamData: CreateTeamDTO) => {
    const updatedTeam = await updateTeam(id, teamData);
    const leaderId = updatedTeam.leader_id;

    setTeams(prev => {
      const cleaned = leaderId
        ? removeUserFromAllTeams(prev, leaderId)
        : prev;

      return cleaned.map(team =>
        team.id === id ? updatedTeam : team
      );
    });

    return updatedTeam;
  };

  const handleDeleteTeam = async (id: string) => {
    await deleteTeam(id);
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const transferMember = async (
    fromTeamId: string,
    toTeamId: string,
    userId: string
  ) => {
    // backend: remove + add
    await removeMember(fromTeamId, userId);
    const updatedTargetTeam = await addMember(toTeamId, userId);

    setTeams(prev => {
      const cleaned = removeUserFromAllTeams(prev, userId);

      return cleaned.map(team =>
        team.id === toTeamId ? updatedTargetTeam : team
      );
    });
  };

  const handleAddMemberToTeam = async (teamId: string, userId: string) => {
    const updatedTeam = await addMember(teamId, userId);

    setTeams(prev => {
      const cleaned = removeUserFromAllTeams(prev, userId);

      return cleaned.map(team =>
        team.id === teamId ? updatedTeam : team
      );
    });

    return updatedTeam;
  };

  const handleRemoveMemberFromTeam = async (
    teamId: string,
    userId: string
  ) => {
    await removeMember(teamId, userId);

    setTeams(prev =>
      prev.map(team =>
        team.id === teamId
          ? {
              ...team,
              members: team.members?.filter(m => m.id !== userId)
            }
          : team
      )
    );
  };
  return {
    teams,
    loading,
    fetchTeams,
    fetchTeamById,
    createTeam: handleCreateTeam,
    updateTeam: handleUpdateTeam,
    deleteTeam: handleDeleteTeam,
    addMemberToTeam: handleAddMemberToTeam,
    removeMemberFromTeam: handleRemoveMemberFromTeam,
    transferMember
  };
};

export default useTeams;
