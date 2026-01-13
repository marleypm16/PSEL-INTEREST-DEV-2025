import { User } from "../../types/users";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, Mail, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface UsersCardsProps {
  user: User;
  handleOpenModal: (user?: User) => void;
  handleDelete: (userId: string) => void;
}

const UsersCards = ({ user, handleOpenModal, handleDelete }: UsersCardsProps) => {
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/20"> 
      {/* Dica visual: borda lateral dá um charme "tech" */}
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          {/* Lado Esquerdo: Informações */}
          <div className="space-y-1.5 flex-1 min-w-0"> {/* min-w-0 permite truncate funcionar */}
            <h3 className="font-semibold text-lg truncate pr-2">
              {user.name}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="text-xs">
                {user.team || "Sem equipe"}
              </Badge>
              
              <Badge
                variant={user.is_active ? "default" : "secondary"}
                className={
                   user.is_active 
                     ? "bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/25 dark:bg-emerald-500/20 dark:text-emerald-400 border-0" 
                     : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }
              >
                {user.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>

          {/* Lado Direito: Ações (Botões Verticais ou Apenas Ícones) */}
          <div className="flex flex-col gap-1 sm:flex-row">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => handleOpenModal(user)}
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDelete(user.id)}
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersCards;