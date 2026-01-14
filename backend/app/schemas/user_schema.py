# app/schemas/user_schema.py
from pydantic import BaseModel, Field
from typing import Optional
from app.schemas.commom import UserBase, UserReadSimple, TeamReadSimple # Importa do Common

# Schemas de Escrita (Create/Update) ficam aqui
class UserCreate(UserBase):
    pass
class UserUpdate(UserBase):
    pass

# Schema de Leitura Rico (Com relacionamentos)
class UserReadWithTeam(UserReadSimple):
    # Usamos o TeamReadSimple que veio do common.py
    # Sem aspas, sem conflito!
    team: Optional[TeamReadSimple] = None
    leader_of: Optional[TeamReadSimple] = None