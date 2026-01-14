import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Team } from "../../types/teams";
interface TeamDetailHeaderProps {
  team: Team;
  navigate: (path:string) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}
const TeamDetailHeader = ({ team, navigate, setIsEditModalOpen, setIsDeleteDialogOpen }: TeamDetailHeaderProps) => {
    return (
        <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/teams")}
              className="h-8 w-8"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-2xl">{team.name}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
                className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="Editar Equipe"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Excluir Equipe"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
}
export default TeamDetailHeader;