import { addMember, createTeam, deleteTeam, getTeams, removeMember, updateTeam } from "../services/teamService";
import { CreateTeamDTO, Team } from "@/types/teams";
import { useState } from "react";
import { toast } from "sonner";

const useTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchTeams = async () => {
        setLoading(true);
       try {
            const data = await getTeams();
            setTeams(data);
            
       } catch (error) {
            toast.error("Erro ao buscar equipes");
       }finally{
            setLoading(false);
       }
    };
    const handleCreateTeam = async (team: CreateTeamDTO) => {
        const newTeam = await createTeam(team);
        setTeams(prev => [...prev, newTeam]);
        fetch
        return newTeam;
    }
    const handleUpdateTeam = async (id: string, team: CreateTeamDTO) => {
        const updated = await updateTeam(id, team);
        setTeams(prev =>
            prev.map(t => (t.id === id ? updated : t))
        );
        return updated;
    }
    const handleDeleteTeam = async (id: string) => {
        await deleteTeam(id);
        setTeams(prev => prev.filter(t => t.id !== id));
    }
   const handleAddMemberToTeam = async (teamId: string, userId: string) => {
        // Chama o service
        const updatedTeam = await addMember(teamId, userId);
        
        // Atualiza a lista localmente para refletir a mudança sem refetch
        setTeams(prev => prev.map(t => 
            t.id === teamId ? updatedTeam : t
        ));
        
        return updatedTeam;
    };
    
    const handleRemoveMemberFromTeam = async (teamId: string, userId: string) => {
    // 1. Chama a API (se der erro, vai pro catch do componente e não executa o setTeams)
    await removeMember(teamId, userId); 

    // 2. Atualiza o estado MANUALMENTE
    setTeams(prev => prev.map(team => {
        // Se não for a equipe mexida, retorna ela igual
        if (team.id !== teamId) return team;

        // Se for a equipe alvo, cria uma cópia removendo APENAS aquele membro
        return {
            ...team,
            // Assume que dentro de 'team' existe um array 'members' ou 'users'
            members: team.members?.filter(member => member.id !== userId)
        };
    }));
}
    return {
        teams,
        loading,
        fetchTeams,
        createTeam:handleCreateTeam,
        updateTeam:handleUpdateTeam,
        deleteTeam:handleDeleteTeam,
        addMemberToTeam:handleAddMemberToTeam,
        removeMemberFromTeam:handleRemoveMemberFromTeam
    };
}

export default useTeams;