import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

import TeamModal  from "../components/teamsPage/TeamModal";
import  DeleteDialog  from "../components/DeleteDialog";
import { CreateTeamDTO, Team } from "../types/teams";
import { toast } from "sonner";
import useTeams from "../hooks/useTeams";
import TeamCard from "../components/TeamCard";
import useUsers from "../hooks/useUsers";


const TeamsPage = () => {
  const { teams, fetchTeams, createTeam, updateTeam, deleteTeam } = useTeams();
  const {users,fetchUsers} = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() =>{
    fetchTeams();
  }, [])
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleOpenModal = (team?: Team) => {
    setEditingTeam(team);
    setIsDialogOpen(true);
  }
  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;
    
    try {
      setIsSubmitting(true);
      await deleteTeam(teamToDelete.id); 
      await fetchUsers();
      toast.success("Equipe excluída com sucesso!");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao excluir equipe.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTeam = async (team: CreateTeamDTO) => {
    try{
      setIsSubmitting(true);
      if (editingTeam) {
      await updateTeam(editingTeam.id, team);     
      await fetchUsers();
      toast.success("Equipe atualizada com sucesso!"); 
    } else {
      await createTeam(team);
      await fetchUsers();
      toast.success("Equipe criada com sucesso!");
    }
      setIsDialogOpen(false);

    } catch (error) {
      toast.error("Erro ao salvar equipe.");

    } finally{
      setIsSubmitting(false);
    }
    
  };

 

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Gerenciamento de Equipes</CardTitle>
            <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Criar Equipe
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar equipes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team}  handleOpenModal={handleOpenModal} handleDeleteTeam={handleDeleteTeam} />
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            Nenhuma equipe encontrada.
          </CardContent>
        </Card>
      )}

      <TeamModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveTeam}
        team={editingTeam}
        isSaving={isSubmitting}
        availableUsers={users}
        existingTeams={teams}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteTeam}
        isDeleting={isSubmitting}
        title="Excluir Equipe"
        description="Tem certeza que deseja excluir esta equipe? Os usuários não serão excluídos, apenas removidos desta equipe."
        itemName={teamToDelete?.name}
      />
    </div>
  );
}

export default TeamsPage;