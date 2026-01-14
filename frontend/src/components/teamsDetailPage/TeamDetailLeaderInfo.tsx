import { Mail, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Team } from "../../types/teams";

interface TeamDetailLeaderInfoProps {
  team: Team;
}
const TeamDetailLeaderInfo = ({ team }: TeamDetailLeaderInfoProps) => {
    return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Líder da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {team.leader ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Nome</p>
                  <p className="font-medium text-slate-900">{team.leader.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-sm text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {team.leader.email}
                  </p>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Líder
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Sem líder atribuído</p>
            )}
          </CardContent>
        </Card>
    )
}

export default TeamDetailLeaderInfo;