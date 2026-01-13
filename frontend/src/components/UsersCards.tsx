import { User } from "@/types/users";
import {Button}  from "./button/Button"; 
interface UsersCardsProps {
    users:User[];
    handleOpenModal: (user?: User) => void;
    handleDelete: (userId: string) => void;
}
const UsersCards = ({ users, handleOpenModal, handleDelete }: UsersCardsProps) => {
    return (
        <div className="mobile-user-list">
                    {users.map((user) => (
                      <div key={user.id} className="mobile-user-card">
                        <div>
                          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {user.name}
                          </div>
                          <div style={{ marginTop: '0.5rem' }}>
                            {user.team_id ? (
                              <span className="status-badge status-busy">Em Equipe</span>
                            ) : (
                              <span className="status-badge status-free">Disponível</span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button variant="outline" onClick={() => handleOpenModal(user)}>
                            Editar
                          </Button>
                          <Button variant="danger" onClick={() => handleDelete(user.id)}>
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
    )
}
export default UsersCards;