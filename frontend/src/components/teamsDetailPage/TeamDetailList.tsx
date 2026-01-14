import { Mail, Trash2, UserIcon, Users } from "lucide-react";
import { Team } from "../../types/teams";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface TeamDetailListProps {
  team: Team;
  handleRemoveMemberDialog: (memberId: string) => void;
}
const TeamDetailList = ({ team, handleRemoveMemberDialog }: TeamDetailListProps) => {
  return (
    <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          {team.members && team.members.length > 0 ? (
            <div className="space-y-3">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.is_active ? "secondary" : "outline"}>
                      {member.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    {member.id !== team.leader_id ? (
                      <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMemberDialog(member.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Remover membro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    ) : (
                      <Badge variant="outline" className="text-sm">
                        Líder
                      </Badge>
                    )}                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p>Nenhum membro na equipe ainda.</p>
              <p className="text-sm mt-2">Adicione membros usando o card acima.</p>
            </div>
          )}
        </CardContent>
      </Card>
  )
}

export default TeamDetailList;