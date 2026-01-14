import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useTeams from "../hooks/useTeams";
import useUsers from "../hooks/useUsers";
import { Team } from "../types/teams";
import TeamModal from "../components/teamsPage/TeamModal";
import DeleteDialog from "../components/DeleteDialog";

import TeamDetailList from "../components/teamsDetailPage/TeamDetailList";
import TeamDetailAddMember from "../components/teamsDetailPage/TeamDetailAddMember";
import TeamDetailHeader from "../components/teamsDetailPage/TeamDetailHeader";
import TeamDetailLeaderInfo from "../components/teamsDetailPage/TeamDetailLeaderInfo";

const TeamsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {  loading,fetchTeams, fetchTeamById, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam } = useTeams();
  const { users } = useUsers();
  const [team, setTeam] = useState<Team | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  useEffect(() => {
    fetchTeamById(id!).then(fetchedTeam => {
      setTeam(fetchedTeam);
    }).catch(() => {
      toast.error("Erro ao buscar detalhes da equipe");
      navigate("/teams");
    });
  }, [id]);


  const availableUsers = users.filter((user) => {
    const isFree = !user.team_id;
    const isCurrentLeader = team?.leader_id === user.id;
    return isFree || isCurrentLeader;
  });

  const availableMembersToAdd = users.filter((user) => {
    const isFree = !user.team_id;
    const isNotInTeam = !team?.members?.some(member => member.id === user.id);
    const isNotLeader = user.id !== team?.leader_id;
    return isFree && isNotInTeam && isNotLeader;
  });

  const handleDeleteTeam = async () => {
    if (!team) return;
    
    try {
      setIsSubmitting(true);
      await deleteTeam(team.id);
      toast.success("Equipe excluída com sucesso!");
      navigate("/teams");
    } catch (error) {
      toast.error("Erro ao excluir equipe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTeam = async (teamData: { name: string; leader_id: string }) => {
    if (!team) return;
    
    try {
      setIsSubmitting(true);
      await updateTeam(team.id, teamData);
      toast.success("Equipe atualizada com sucesso!");
      setIsEditModalOpen(false);
      await fetchTeams();
    } catch (error) {
      toast.error("Erro ao atualizar equipe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId || !team) return;
    
    try {
      setIsSubmitting(true);
      await addMemberToTeam(team.id, selectedUserId);
      toast.success("Membro adicionado com sucesso!");
      setSelectedUserId("");
      await fetchTeams();
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
    if (!removingMemberId || !team) return;
    
    try {
      setIsSubmitting(true);
      await removeMemberFromTeam(removingMemberId, team.id);
      toast.success("Membro removido com sucesso!");
      setIsRemoveDialogOpen(false);
      await fetchTeams();
    } catch (error) {
      toast.error("Erro ao remover membro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !team) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <TeamDetailHeader navigate={navigate} setIsEditModalOpen={setIsEditModalOpen} setIsDeleteDialogOpen={setIsDeleteDialogOpen} team={team} />

      {/* Team Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leader Info */}
        <TeamDetailLeaderInfo team={team} />

        {/* Add Member */}
        <TeamDetailAddMember 
          availableMembersToAdd={availableMembersToAdd} 
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          handleAddMember={handleAddMember}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Members List */}
      <TeamDetailList team={team} handleRemoveMemberDialog={handleRemoveMemberDialog} />

      {/* Modals */}
      <TeamModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveTeam}
        team={team}
        isSaving={isSubmitting}
        availableUsers={availableUsers}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTeam}
        isDeleting={isSubmitting}
        title="Excluir Equipe"
        description="Tem certeza que deseja excluir esta equipe? Os usuários não serão excluídos, apenas removidos desta equipe."
        itemName={team.name}
      />

      <DeleteDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
        onConfirm={handleRemoveMember}
        isDeleting={isSubmitting}
        title="Remover Membro"
        description="Tem certeza que deseja remover este membro da equipe?"
        itemName={team.members?.find(m => m.id === removingMemberId)?.name}
      />
    </div>
  );
};

export default TeamsDetails;
