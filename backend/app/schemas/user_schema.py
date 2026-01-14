# app/schemas/user_schema.py
from pydantic import BaseModel, Field
from typing import Optional
from app.schemas.commom import UserBase, UserReadSimple, TeamReadSimple # Importa do Common

# Schemas de Escrita (Create/Update) ficam aqui
class UserCreate(UserBase):
    pass
class UserUpdate(UserBase):
    name: Optional[str] = None
    email: Optional[str] = None

class UserReadWithTeam(UserReadSimple):

    team: Optional[TeamReadSimple] = None
    leader_of: Optional[TeamReadSimple] = None