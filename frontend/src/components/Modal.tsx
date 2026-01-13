import { User } from "@/types/users";
import { Button } from "./button/Button";

interface ModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
    editingUser: User | null;
    formData: string;
    setFormData: (data: string) => void;
    handleSave: (e: React.FormEvent) => void;
}
const Modal = ({ setIsModalOpen, editingUser, formData, setFormData, handleSave }: ModalProps) => {
    return (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </h2>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Nome Completo</label>
                <input 
                  autoFocus
                  className="form-select" // Reutilizando estilo de input
                  placeholder="Ex: João da Silva"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
    )
}

export default Modal;