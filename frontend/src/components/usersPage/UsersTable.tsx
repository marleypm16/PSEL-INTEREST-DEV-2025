import { Edit, Trash2, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { User } from "../../types/users";

interface UsersTableProps {
  users: User[];
  handleOpenModal: (user?: User) => void;
  handleDelete: (userId: string) => void;
}

const UsersTable = ({ users, handleOpenModal, handleDelete }: UsersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Equipe</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name}
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {user.team?.name || "Sem equipe"}
                </Badge>
              </TableCell>
              
              
              
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleOpenModal(user)}
                    title="Editar usuário"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.id)}
                    data-cy="delete-user-button"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="Excluir usuário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;