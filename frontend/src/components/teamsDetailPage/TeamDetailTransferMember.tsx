import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { User } from "../../types/users";
import { Team } from "../../types/teams";

interface TeamDetailTransferMemberProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTeam: Team;
  member: User | null;
  availableTeams: Team[];
  onTransfer: (memberId: string, newTeamId: string) => Promise<void>;
}

const TeamDetailTransferMember = ({
  open,
  onOpenChange,
  currentTeam,
  member,
  availableTeams,
  onTransfer
}: TeamDetailTransferMemberProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!member || !selectedTeamId) return;

    try {
      setIsTransferring(true);
      await onTransfer(member.id, selectedTeamId);
      setSelectedTeamId("");
      onOpenChange(false);
    } catch (error) {
    } finally {
      setIsTransferring(false);
    }
  };

  const handleClose = () => {
    setSelectedTeamId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
<DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">        
    <DialogHeader>
          <DialogTitle>Transferir Membro de Equipe</DialogTitle>
          <DialogDescription>
            Selecione a equipe de destino para transferir o membro.
          </DialogDescription>
        </DialogHeader>

        {member && (
          <div className="space-y-6">
            {/* Informações do Membro */}
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Membro</span>
              </div>
              <p className="font-semibold text-lg text-slate-900">{member.name}</p>
              <p className="text-sm text-slate-600">{member.email}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Equipe Atual
                </label>
                <div className="p-3 border rounded-md bg-white">
                  <p className="font-medium text-slate-900">{currentTeam.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Líder: {currentTeam.leader?.name}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-slate-400" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Nova Equipe
                </label>
                <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.length > 0 ? (
                      availableTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{team.name}</span>
                            <span className="text-xs text-slate-500">
                              Líder: {team.leader?.name} • {team.members?.length || 0} membros
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-slate-500 text-center">
                        Nenhuma equipe disponível para transferência.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Atenção:</strong> Ao transferir este membro, ele será removido da equipe 
                atual e adicionado à nova equipe selecionada.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isTransferring}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!selectedTeamId || isTransferring}
          >
            {isTransferring ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Transferindo...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Transferir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamDetailTransferMember;
