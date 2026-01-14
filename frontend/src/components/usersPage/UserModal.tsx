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
import { CreateUserDTO, User } from "../../types/users";
import { Loader2 } from "lucide-react";
interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSave: (user: CreateUserDTO) => void;
  isSaving?: boolean;
  validationErrors?: Record<string, string>;
}

const  UserModal = ({ open, onOpenChange, user, onSave, isSaving, validationErrors }: UserDialogProps) => {
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    } else {
      setFormData({
        name: "",
        email: "",
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuário" : "Adicionar Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                data-cy="name"
                disabled={isSaving}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João Silva"
                required
              />
              {validationErrors?.name && (
                <span className="text-red-500 text-sm">{validationErrors.name}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-cy="email"
                disabled={isSaving}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao.silva@company.com"
                required
              />
              {validationErrors?.email && (
                <span className="text-red-500 text-sm">{validationErrors.email}</span>
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
            <Button type="submit" disabled={isSaving} data-cy="save">
              {user ? "Salvar Alterações" : "Adicionar Usuário"}
              {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default UserModal;