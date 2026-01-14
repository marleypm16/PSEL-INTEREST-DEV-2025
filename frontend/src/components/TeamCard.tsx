import { Team } from "../types/teams";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { NavLink } from "react-router-dom";
interface TeamCardProps {
    team:Team
    handleOpenModal: (team?: Team) => void
    handleDeleteTeam: (team: Team) => void
}
const TeamCard = ({team, handleOpenModal, handleDeleteTeam}: TeamCardProps) => {
  return (
   <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{team.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {team.members?.length} {team.members?.length === 1 ? "membro" : "membros"}
                    </Badge>
                  </div>
                        <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleOpenModal(team)}
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteTeam(team)}
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Team Members */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-700 mb-2">
                    Líder: <span className="text-blue-600">{team.leader?.name}</span>
                  </div>
                  {team.members?.length! > 0 ? (
                    <>
                      <div className="text-sm font-medium text-slate-700">
                        Membros:
                      </div>
                      <div className="space-y-2">
                        {team.members?.slice(0, 3).map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-slate-700 truncate">
                              {user.name}
                            </span>
                          </div>
                        ))}
                        {team.members?.length! > 3 && (
                          <div className="text-xs text-slate-500 pl-8">
                            +{team.members?.length! - 3} mais
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-slate-500 py-4 text-center">
                      Nenhum membro adicionado
                    </div>
                  )}
                </div>
                <NavLink to={`/teams/${team.id}`}>
                  <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => handleOpenModal(team)}
                >
                  Gerenciar Equipe
                </Button>
                </NavLink>
                
              </CardContent>
            </Card>
  )
}

export default TeamCard;