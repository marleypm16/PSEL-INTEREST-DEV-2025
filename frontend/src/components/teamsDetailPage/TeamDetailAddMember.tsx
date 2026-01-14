import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Card, CardHeader, CardTitle,CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { UserPlus, Loader2 } from "lucide-react";

interface TeamDetailAddMemberProps {
    availableMembersToAdd: Array<{ id: string; name: string }>;
    selectedUserId: string;
    setSelectedUserId: (id: string) => void;
    handleAddMember: () => void;
    isSubmitting: boolean;
}
const TeamDetailAddMember = ({
  availableMembersToAdd,
  selectedUserId,
  setSelectedUserId,
  handleAddMember,
  isSubmitting
}: TeamDetailAddMemberProps) => {
  return (
    <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Adicionar Membro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {availableMembersToAdd.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                  {availableMembersToAdd.length === 0 && (
                    <SelectItem value="none" disabled>
                      Nenhum usuário disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                onClick={handleAddMember}
                disabled={!selectedUserId || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
  )
}
export default TeamDetailAddMember;