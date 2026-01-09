from pydantic import BaseModel,Field
from typing import Optional
import uuid
class UserBase(BaseModel):
    name:str = Field(..., min_length=2,description="Nome do usuário")

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    name: Optional[str] = Field(None, min_length=2,description="Nome do usuário")

class UserRead(UserBase):
    id: uuid.UUID
    team_id: Optional[uuid.UUID] = None