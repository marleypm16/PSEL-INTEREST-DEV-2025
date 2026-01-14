from pydantic import BaseModel,Field
from typing import Optional
import uuid
class UserBase(BaseModel):
    name:str = Field(..., min_length=2,description="Nome do usuário")
    email: str = Field(..., description="Email do usuário")
    is_active: bool = Field(default=True, description="Indica se o usuário está ativo")

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    name: Optional[str] = Field(None, min_length=2,description="Nome do usuário")
    email: Optional[str] = Field(None, description="Email do usuário")
    is_active: Optional[bool] = Field(None, description="Indica se o usuário está ativo")

class UserRead(UserBase):
    id: uuid.UUID
    team_id: Optional[uuid.UUID] = None