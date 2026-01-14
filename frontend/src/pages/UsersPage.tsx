import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Loader2 } from "lucide-react"; 
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { CreateUserDTO, User } from "../types/users";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import axios from "axios"; 
import UserModal from "../components/usersPage/UserModal";
import UsersTable from "../components/usersPage/UsersTable";
import UsersCards from "../components/usersPage/UsersCards";
import useUsers from "../hooks/useUsers";
import DeleteDialog from "../components/DeleteDialog";

const UserPage = () => {
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false); 
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({}); 

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, []); 

  const handleOpenModal = (user?: User) => {
    setValidationErrors({}); 
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteDialog = (userId: string) => {
    setIsDeleteDialogOpen(true);
    setDeletingUserId(userId);
  };

  const handleDeleteUser = async () => {
    if (!deletingUserId) return;
    
    try {
      setIsSubmitting(true);
      await deleteUser(deletingUserId);
      toast.success("Usuário excluído com sucesso!");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao excluir usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveUser = async (user: CreateUserDTO) => {
    setValidationErrors({}); 
    
    try {
      setIsSubmitting(true);
      if (editingUser) {
        await updateUser(editingUser.id, user);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await createUser(user);
        toast.success("Usuário criado com sucesso!");
      }
      setIsDialogOpen(false);
    } catch (error) {

      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 422 && Array.isArray(data.detail)) {
            const newErrors: Record<string, string> = {};
            
            data.detail.forEach((err: any) => {
                const fieldName = err.loc[err.loc.length - 1];
                const msg = err.msg.replace('Value error, ', '');
                newErrors[fieldName] = msg;
            });

            setValidationErrors(newErrors);
            toast.error("Verifique os campos em vermelho.");
            return;
        }
                if (data.detail && typeof data.detail === 'string') {
             toast.error("Já existe um usuário com este email.");
             return;
        }
      }
      toast.error("Erro ao salvar informações.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
         <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <Button onClick={() => handleOpenModal()} data-cy="add-user-button" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome ou email..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <UsersTable 
                  users={filteredUsers} 
                  handleOpenModal={handleOpenModal} 
                  handleDelete={handleDeleteDialog} 
                />
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <UsersCards 
                    key={user.id} 
                    user={user} 
                    handleOpenModal={handleOpenModal} 
                    handleDelete={handleDeleteDialog} 
                  />
                ))}
              </div>

              {!loading && filteredUsers.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  {searchTerm ? "Nenhum resultado para a busca." : "Nenhum usuário cadastrado."}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <DeleteDialog
        title="Excluir Usuário"
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen} 
        onConfirm={handleDeleteUser}
        isDeleting={isSubmitting} 
        description="Tem certeza que deseja excluir este usuário?"
        itemName={users.find(user => user.id === deletingUserId)?.name}
      />      
      <UserModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={editingUser}
        onSave={handleSaveUser}
        isSaving={isSubmitting} 
        validationErrors={validationErrors} 
      />
    </div>
  );
}
export default UserPage;