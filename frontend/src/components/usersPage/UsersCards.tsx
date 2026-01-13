import { User } from "../../types/users";
import { Card, CardContent } from "../ui/card";
import {Button}  from "../ui/button"; 
import { Edit, Mail, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
interface UsersCardsProps {
    user: User;
    handleOpenModal: (user?: User) => void;
    handleDelete: (userId: string) => void;
}
const UsersCards = ({ user, handleOpenModal, handleDelete }: UsersCardsProps) => {
    return (
        <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                    
                          <Button onClick={() => handleOpenModal(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </Button>
                    
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {user.email}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary">{user.team}</Badge>
                      <Badge
                        variant={user.is_active ? "default" : "secondary"}
                        className={
                          user.is_active
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : ""
                        }
                      >
                        {user.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
    )
}
export default UsersCards;