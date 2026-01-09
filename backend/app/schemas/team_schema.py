from pydantic import BaseModel,Field
from typing import Optional
import uuid
from app.schemas.user_schema import UserRead
class TeamBase(BaseModel):
    name: str = Field(..., min_length=2, description="Nome do time")


class TeamCreate(TeamBase):
    leader_id: uuid.UUID = Field(..., description="ID do líder do time")

class TeamUpdate(TeamBase):
    name: Optional[str] = Field(None, min_length=2, description="Nome do time")
    leader_id: Optional[uuid.UUID] = Field(None, description="ID do líder do time")

class TeamRead(TeamBase):
    id: uuid.UUID
    leader_id: uuid.UUID
    members: list[UserRead] = []  
