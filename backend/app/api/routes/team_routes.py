from app.models import Team
from fastapi import APIRouter,Depends,HTTPException
from app.schemas.team_schema import TeamReadWithMembers,TeamCreate,TeamUpdate
import uuid
from app.repositories.team_repository import TeamRepository
from sqlalchemy.exc import IntegrityError 

router = APIRouter(prefix="/teams", tags=["teams"])

@router.get("/",response_model=list[TeamReadWithMembers],status_code=200)
def get_teams(team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    return team_repository.get_all_teams()

@router.get("/{team_id}",response_model=TeamReadWithMembers,status_code=200,description="Get a team by their ID")
def get_team(team_id: uuid.UUID, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    team = team_repository.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.post("/",response_model=TeamReadWithMembers,status_code=201)
def create_team(team_data_create: TeamCreate, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    try:
        new_team = Team(**team_data_create.model_dump())
        return team_repository.create_team(new_team)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="This user is already leading another team.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{team_id}",response_model=TeamReadWithMembers)
def update_team(team_id: uuid.UUID, team_data_update: TeamUpdate, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    team = team_repository.get_team_by_id(team_id)
    team_data_update_dict = team_data_update.model_dump(exclude_unset=True)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team_repository.update_team(team_id, team_data_update_dict)

@router.delete("/{team_id}",status_code=204)
def delete_team(team_id: uuid.UUID, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    team = team_repository.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team_repository.delete_team(team_id)
    return None

@router.post("/{team_id}/member/{user_id}",status_code=201,response_model=TeamReadWithMembers)
def add_member_to_team(team_id: uuid.UUID, user_id: uuid.UUID, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    team = team_repository.add_member_to_team(team_id, user_id)
    if not team:
        raise HTTPException(status_code=404, detail="User not found")
    return team

@router.delete("/{team_id}/member/{user_id}" ,status_code=204)
def remove_member_from_team(team_id: uuid.UUID, user_id: uuid.UUID, team_repository: TeamRepository = Depends(TeamRepository.get_team_repository)):
    try:
        updated_team = team_repository.remove_member_from_team(team_id, user_id)
        if not updated_team:
             raise HTTPException(status_code=404, detail="Team or User not found")
        return updated_team
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))