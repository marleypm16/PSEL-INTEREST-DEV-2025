# app/schemas/common.py
from pydantic import BaseModel, Field
import uuid
from typing import Optional

# --- USER BASIC ---
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, description="Nome do usuário")
    email: str = Field(..., description="Email do usuário") # Use EmailStr é melhor

class UserReadSimple(UserBase):
    """User apenas com ID, sem time aninhado"""
    id: uuid.UUID
    team_id: Optional[uuid.UUID] = None

# --- TEAM BASIC ---
class TeamBase(BaseModel):
    name: str = Field(..., min_length=2, description="Nome do time")
    leader_id: Optional[uuid.UUID] = Field(None, description="ID do líder")

class TeamReadSimple(TeamBase):
    """Team apenas com ID, sem membros aninhados"""
    id: uuid.UUID