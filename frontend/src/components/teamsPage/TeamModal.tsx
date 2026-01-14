import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CreateTeamDTO, Team } from "../../types/teams";
import { User } from "../../types/users";
import { Loader2 } from "lucide-react";

interface TeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: Team;
  onSave: (team: CreateTeamDTO) => void;
  isSaving?: boolean;
  availableUsers: User[]; // Lista de usuários para selecionar o líder
  existingTeams: Team[]; // Lista de equipes existentes para validação do líder
}

const TeamModal = ({ 
  open, 
  onOpenChange, 
  team, 
  onSave, 
  isSaving,
  availableUsers,
  existingTeams 
}: TeamModalProps) => {
    
  const isUserLeaderOfOtherTeam = (userId: string) => {
    return existingTeams.some(
      (t) => t.leader_id === userId && t.id !== team?.id
    );
  };

  // Obter o nome da equipe da qual o usuário é líder
  const getTeamWhereUserIsLeader = (userId: string) => {
    const leaderTeam = existingTeams.find(
      (t) => t.leader_id === userId && t.id !== team?.id
    );
    return leaderTeam?.name;
  };

  const [formData, setFormData] = useState<CreateTeamDTO>({
    name: "",
    leader_id: "",
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        leader_id: team.leader?.id || "", 
        
      });
    } else {
      setFormData({
        name: "",
        leader_id: "",
      });
    }
  }, [team, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {team ? "Editar Equipe" : "Adicionar Nova Equipe"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            
            {/* Campo Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Equipe</Label>
              <Input
                id="name"
                value={formData.name}
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Squad Alpha"
                required
              />
            </div>

            {/* Campo Líder (Obrigatório) */}
            <div className="space-y-2">
              <Label htmlFor="leader">Líder da Equipe</Label>
              <Select
                disabled={isSaving}
                value={formData.leader_id}
                onValueChange={(value) => setFormData({ ...formData, leader_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um líder" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => {
                    const isLeaderElsewhere = isUserLeaderOfOtherTeam(user.id);
                    const leaderTeamName = getTeamWhereUserIsLeader(user.id);
                    return (
                      <SelectItem
                        key={user.id}
                        value={user.id}
                        disabled={isLeaderElsewhere}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <span>{user.name}</span>
                            {isLeaderElsewhere && (
                              <span className="text-xs text-orange-600 ml-2">
                                (Líder de "{leaderTeamName}")
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {availableUsers.length === 0 && (
                <p className="text-xs text-red-500">
                  É necessário ter usuários livres para criar uma equipe.
                </p>
              )}
            </div>

          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving || !formData.leader_id}>
              {team ? "Salvar Alterações" : "Criar Equipe"}
              {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TeamModal;