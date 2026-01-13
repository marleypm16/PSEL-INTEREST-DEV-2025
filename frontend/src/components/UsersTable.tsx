import { User } from "@/types/users";
import  {Button}  from "./button/Button"; "./button/Button";
interface UsersTableProps {
    users:User[];
    handleOpenModal: (user?: User) => void;
    handleDelete: (userId: string) => void;
}
const UsersTable = ({ users, handleOpenModal, handleDelete }: UsersTableProps) => {
    return (
        <table className="users-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td style={{ fontWeight: 500 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div className="member-avatar">{user.name.charAt(0).toUpperCase()}</div>
                              {user.name}
                            </div>
                          </td>
                          <td>
                            {user.team_id ? (
                              <span className="status-badge status-busy">Em Equipe</span>
                            ) : (
                              <span className="status-badge status-free">Disponível</span>
                            )}
                          </td>
                          <td>
                            <div className="actions-cell">
                              <Button variant="outline" onClick={() => handleOpenModal(user)} title="Editar">
                                Editar
                              </Button>
                              <Button variant="danger" onClick={() => handleDelete(user.id)} title="Excluir">
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            Nenhum usuário cadastrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
    );
}

export default UsersTable;