# app/schemas/team_schema.py
from typing import List, Optional
import uuid
from app.schemas.commom import TeamBase, TeamReadSimple, UserReadSimple # Importa do Common

# Schemas de Escrita
class TeamCreate(TeamBase):
    pass

class TeamUpdate(TeamBase):
    name: Optional[str] = None
    leader_id: Optional[uuid.UUID] = None

class TeamReadWithMembers(TeamReadSimple):
    members: List[UserReadSimple] = []
    leader: Optional[UserReadSimple] = None