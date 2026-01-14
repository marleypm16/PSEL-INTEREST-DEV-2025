from app.models import User
from fastapi import APIRouter, HTTPException,Depends
from app.schemas.user_schema import UserCreate,UserUpdate,UserReadWithTeam
from app.repositories.user_repository import UserRepository
import uuid
router = APIRouter(prefix="/users", tags=["users"])

@router.get("/",response_model=list[UserReadWithTeam],status_code=200)
def get_users(user_repository: UserRepository = Depends(UserRepository.get_user_repository)):
    return user_repository.get_all_users()

@router.get("/{user_id}",response_model=UserReadWithTeam,status_code=200,description="Get a user by their ID")
def get_user(user_id: uuid.UUID, user_repository: UserRepository = Depends(UserRepository.get_user_repository)):
    user = user_repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/",response_model=UserReadWithTeam,status_code=201)
def create_user(user_data_create: UserCreate, user_repository: UserRepository = Depends(UserRepository.get_user_repository)):
    new_user = User(**user_data_create.model_dump())
    return user_repository.create_user(new_user)

@router.put("/{user_id}",response_model=UserReadWithTeam,status_code=200)
def update_user(user_id: uuid.UUID, user_data_update: UserUpdate, user_repository: UserRepository = Depends(UserRepository.get_user_repository)):
    user = user_repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_data_update_dict = user_data_update.model_dump(exclude_unset=True)
    return user_repository.update_user(user_id, user_data_update_dict)
@router.delete("/{user_id}",status_code=204)
def delete_user(user_id: uuid.UUID, user_repository: UserRepository = Depends(UserRepository.get_user_repository)):
    user = user_repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_repository.delete_user(user_id)
    return None