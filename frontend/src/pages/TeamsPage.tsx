import { useEffect, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import axios from "axios"

import TeamModal  from "../components/teamsPage/TeamModal";
import  DeleteDialog  from "../components/DeleteDialog";
import { CreateTeamDTO, Team } from "../types/teams";
import { toast } from "sonner";
import useTeams from "../hooks/useTeams";
import TeamCard from "../components/teamsPage/TeamCard";
import useUsers from "../hooks/useUsers";


const TeamsPage = () => {
  const { teams, loading, fetchTeams, createTeam, updateTeam, deleteTeam } = useTeams();
  const { users, fetchUsers } = useUsers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() =>{
    fetchTeams();
    fetchUsers(); 
  }, [])

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (team?: Team) => {
    setValidationErrors({}); // <--- Limpa erros ao abrir
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
    setValidationErrors({}); 

    try {
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
      // Verifica se é erro do Axios
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        // ERRO DE VALIDAÇÃO (422) - Campos inválidos
        if (status === 422 && Array.isArray(data.detail)) {
            const newErrors: Record<string, string> = {};
            
            data.detail.forEach((err: any) => {
                const fieldName = err.loc[err.loc.length - 1];
                let msg = err.msg.replace('Value error, ', '');
                newErrors[fieldName] = msg;
            });

            setValidationErrors(newErrors);
            toast.error("Verifique os campos em vermelho.");
            return; // Não fecha o modal
        }
        
        // ERRO DE REGRA DE NEGÓCIO (Ex: Nome de time duplicado)
        if (data.detail && typeof data.detail === 'string') {
             toast.error(data.detail);
             return;
        }
      }

      toast.error("Erro ao salvar equipe.");

    } finally {
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
        {loading ? (
          <div className="flex justify-center items-center col-span-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team}  handleOpenModal={handleOpenModal} handleDeleteTeam={handleDeleteTeam} />
            ))}
          </>
        )}
      </div>

      {!loading && filteredTeams.length === 0 && (
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
        errors={validationErrors} 
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