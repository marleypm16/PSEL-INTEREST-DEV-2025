from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
import uuid

from app.models import Team
from app.schemas.team_schema import TeamReadWithMembers, TeamCreate, TeamUpdate
from app.repositories.team_repository import TeamRepository, get_team_repository

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("/", response_model=list[TeamReadWithMembers], status_code=200)
def get_teams(team_repository: TeamRepository = Depends(get_team_repository)):
    return team_repository.get_all_teams()


@router.get(
    "/{team_id}",
    response_model=TeamReadWithMembers,
    status_code=200,
    description="Lista um time pelo ID",
)
def get_team(team_id: uuid.UUID, team_repository: TeamRepository = Depends(get_team_repository)):
    team = team_repository.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Time não encontrado")
    return team


@router.post("/", response_model=TeamReadWithMembers, status_code=201)
def create_team(team_data: TeamCreate, team_repository: TeamRepository = Depends(get_team_repository)):
    new_team = Team(**team_data.model_dump())

    try:
        return team_repository.create_team(new_team)

    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Este usuário já está liderando outro time.",
        )
    except Exception as e:
        msg = str(e).strip()

        if "Leader not found" in msg:
            raise HTTPException(status_code=404, detail="líder não encontrado")

        raise HTTPException(status_code=400, detail=msg)

@router.put("/{team_id}", response_model=TeamReadWithMembers, status_code=200)
def update_team(
    team_id: uuid.UUID,
    team_data: TeamUpdate,
    team_repository: TeamRepository = Depends(get_team_repository),
):
    existing = team_repository.get_team_by_id(team_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Time não encontrado")

    payload = team_data.model_dump(exclude_unset=True)

    try:
        updated = team_repository.update_team(team_id, payload)
        return updated
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Este usuário já está liderando outro time.",
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{team_id}", status_code=204)
def delete_team(team_id: uuid.UUID, team_repository: TeamRepository = Depends(get_team_repository)):
    deleted = team_repository.delete_team(team_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Time não encontrado")
    return None


@router.post(
    "/{team_id}/member/{user_id}",
    status_code=200,
    response_model=TeamReadWithMembers,
)
def add_member_to_team(
    team_id: uuid.UUID,
    user_id: uuid.UUID,
    team_repository: TeamRepository = Depends(get_team_repository),
):
    updated_team = team_repository.add_member_to_team(team_id, user_id)

    if not updated_team:
        raise HTTPException(
            status_code=404,
            detail="Time ou Usuário não encontrado",
        )

    return updated_team


@router.delete(
    "/{team_id}/member/{user_id}",
    status_code=200,
    response_model=TeamReadWithMembers,
)
def remove_member_from_team(
    team_id: uuid.UUID,
    user_id: uuid.UUID,
    team_repository: TeamRepository = Depends(get_team_repository),
):
    try:
        updated_team = team_repository.remove_member_from_team(team_id, user_id)

        if not updated_team:
            raise HTTPException(
                status_code=404,
                detail="Time ou Usuário não encontrado",
            )

        return updated_team

    except Exception as e:
        msg = str(e).strip()

        if "Cannot remove the leader" in msg:
            raise HTTPException(status_code=409, detail=msg)

        raise HTTPException(status_code=400, detail=msg)