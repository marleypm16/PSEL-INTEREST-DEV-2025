from fastapi import APIRouter,Depends,HTTPException
from app.schemas.team_schema import TeamRead,TeamCreate,TeamUpdate
import uuid
from app.repositories.team_repository import TeamRepository
router = APIRouter(prefix="/teams", tags=["teams"])

@router.get("/",response_model=list[TeamRead],status_code=200)
def get_teams(team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    return team_repository.get_all_teams()

@router.get("/{team_id}",response_model=TeamRead,status_code=200,description="Get a team by their ID")
def get_team(team_id: uuid.UUID, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    team = team_repository.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.post("/",response_model=TeamRead,status_code=201)
def create_team(team_data_create: TeamCreate, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    return team_repository.create_team(team_data_create)

@router.put("/{team_id}",response_model=TeamRead)
def update_team(team_id: uuid.UUID, team_data_update: TeamUpdate, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    team = team_repository.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team_repository.update_team(team_id, team_data_update)

@router.delete("/{team_id}",status_code=204)
def delete_team(team_id: uuid.UUID, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    team = team_repository.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team_repository.delete_team(team_id)
    return None

@router.post("/{team_id}/membro/{user_id}",status_code=201)
def add_member_to_team(team_id: uuid.UUID, user_id: uuid.UUID, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    user = team_repository.add_member_to_team(team_id, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{team_id}/membro/{user_id}" ,status_code=204)
def remove_member_from_team(team_id: uuid.UUID, user_id: uuid.UUID, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    user = team_repository.remove_member_from_team(team_id, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found or not in the team")
    return None