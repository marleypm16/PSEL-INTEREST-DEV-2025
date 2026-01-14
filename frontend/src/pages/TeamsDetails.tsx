import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios"; // <--- 1. IMPORT AXIOS
import useTeams from "../hooks/useTeams";
import useUsers from "../hooks/useUsers";
import { Team } from "../types/teams";
import { User } from "../types/users";
import TeamModal from "../components/teamsPage/TeamModal";
import DeleteDialog from "../components/DeleteDialog";
import TeamDetailList from "../components/teamsDetailPage/TeamDetailList";
import TeamDetailAddMember from "../components/teamsDetailPage/TeamDetailAddMember";
import TeamDetailHeader from "../components/teamsDetailPage/TeamDetailHeader";
import TeamDetailLeaderInfo from "../components/teamsDetailPage/TeamDetailLeaderInfo";
import TeamDetailTransferMember from "../components/teamsDetailPage/TeamDetailTransferMember";

const TeamsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { teams, fetchTeams, loading, fetchTeamById, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam,transferMember } = useTeams();
  const { users } = useUsers();
  
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferringMember, setTransferringMember] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    fetchTeamById(id!).then(fetchedTeam => {
      setCurrentTeam(fetchedTeam);
    }).catch(() => {
      toast.error("Erro ao buscar detalhes da equipe");
      navigate("/teams");
    });
  }, [id]);

  useEffect(() => {
    if (isEditModalOpen) {
      setValidationErrors({});
    }
  }, [isEditModalOpen]);

  const filteredUsers = users.filter(user => {
    const isLeader = user.leader_of !== null;
    const isMemberOfCurrentTeam = currentTeam?.members?.some(
      member => member.id === user.id
    );
    return !isLeader && !isMemberOfCurrentTeam;
  });

  const handleTransferMemberDialog = (member: User) => {
    setTransferringMember(member);
    setIsTransferDialogOpen(true);
  };

  const handleTransferMember = async (memberId: string, newTeamId: string) => {
    if (!currentTeam) return;
    
    try {
      setIsSubmitting(true);
      await transferMember(currentTeam.id, newTeamId, memberId);
      setCurrentTeam(prevTeam => {
        if (!prevTeam) return prevTeam;
        return {
          ...prevTeam,
          members: prevTeam.members?.filter(m => m.id !== memberId)
        };
      });
      
      toast.success("Membro transferido com sucesso!");
      setIsTransferDialogOpen(false);
      setTransferringMember(null);
    } catch (error) {
      toast.error("Erro ao transferir membro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!currentTeam) return;
    
    try {
      setIsSubmitting(true);
      await deleteTeam(currentTeam.id);
      toast.success("Equipe excluída com sucesso!");
      navigate("/teams");
    } catch (error) {
      toast.error("Erro ao excluir equipe.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSaveTeam = async (teamData: { name: string; leader_id: string }) => {
    if (!currentTeam) return;
    
    setValidationErrors({}); // Limpa erros antigos

    try {
      setIsSubmitting(true);
      const updatedTeam = await updateTeam(currentTeam.id, teamData);
      setCurrentTeam(updatedTeam);
      toast.success("Equipe atualizada com sucesso!");
      setIsEditModalOpen(false); 
    } catch (error) {

      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        // ERRO DE VALIDAÇÃO (422)
        if (status === 422 && Array.isArray(data.detail)) {
            const newErrors: Record<string, string> = {};
            
            data.detail.forEach((err: any) => {
                const fieldName = err.loc[err.loc.length - 1];
                let msg = err.msg.replace('Value error, ', '');
                newErrors[fieldName] = msg;
            });

            setValidationErrors(newErrors);
            toast.error("Verifique os campos em vermelho.");
            return; 
        }
        
        // ERRO DE REGRA DE NEGÓCIO (Ex: Nome duplicado)
        if (data.detail && typeof data.detail === 'string') {
             toast.error(data.detail);
             return;
        }
      }

      toast.error("Erro ao atualizar equipe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId || !currentTeam) return;
    
    try {
      setIsSubmitting(true);
      const updatedTeam = await addMemberToTeam(currentTeam.id, selectedUserId);
      setCurrentTeam(updatedTeam);
      toast.success("Membro adicionado com sucesso!");
      setSelectedUserId("");
    } catch (error) {
      toast.error("Erro ao adicionar membro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMemberDialog = (memberId: string) => {
    setRemovingMemberId(memberId);
    setIsRemoveDialogOpen(true);
  };

  const handleRemoveMember = async () => {
    if (!removingMemberId || !currentTeam) return;
    
    try {
      setIsSubmitting(true);
      await removeMemberFromTeam(removingMemberId, currentTeam.id);
      setCurrentTeam(prevTeam => {
        if (!prevTeam) return prevTeam;
        return {
          ...prevTeam,
          members: prevTeam.members?.filter(m => m.id !== removingMemberId)
        };
      });
      toast.success("Membro removido com sucesso!");
      setIsRemoveDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao remover membro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !currentTeam) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <TeamDetailHeader navigate={navigate} setIsEditModalOpen={setIsEditModalOpen} setIsDeleteDialogOpen={setIsDeleteDialogOpen} team={currentTeam} />

      {/* Team Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leader Info */}
        <TeamDetailLeaderInfo team={currentTeam} />

        {/* Add Member */}
        <TeamDetailAddMember 
          availableMembersToAdd={filteredUsers} 
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          handleAddMember={handleAddMember}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Members List */}
      <TeamDetailList 
        team={currentTeam} 
        handleRemoveMemberDialog={handleRemoveMemberDialog}
        handleTransferMemberDialog={handleTransferMemberDialog}
      />

      {/* Modals */}
      <TeamModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveTeam}
        team={currentTeam}
        isSaving={isSubmitting}
        availableUsers={users}
        existingTeams={teams}
        errors={validationErrors} // <--- 3. PASSANDO OS ERROS
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTeam}
        isDeleting={isSubmitting}
        title="Excluir Equipe"
        description="Tem certeza que deseja excluir esta equipe? Os usuários não serão excluídos, apenas removidos desta equipe."
        itemName={currentTeam.name}
      />

      <DeleteDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        onConfirm={handleRemoveMember}
        isDeleting={isSubmitting}
        title="Remover Membro"
        description="Tem certeza que deseja remover este membro da equipe?"
        itemName={currentTeam.members?.find(m => m.id === removingMemberId)?.name}
      />

      <TeamDetailTransferMember
        open={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
        currentTeam={currentTeam}
        member={transferringMember}
        availableTeams={teams.filter(t => t.id !== currentTeam.id)}
        onTransfer={handleTransferMember}
      />
    </div>
  );
};

export default TeamsDetails;