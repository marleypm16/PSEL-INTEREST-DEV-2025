# app/schemas/team_schema.py
from typing import List, Optional
from app.schemas.commom import TeamBase, TeamReadSimple, UserReadSimple # Importa do Common

# Schemas de Escrita
class TeamCreate(TeamBase):
    pass

class TeamUpdate(TeamBase):
    pass

# Schema de Leitura Rico (Com relacionamentos)
class TeamReadWithMembers(TeamReadSimple):
    # Usamos o UserReadSimple que veio do common.py
    # Sem aspas, sem loop infinito na serialização!
    members: List[UserReadSimple] = []
    leader: Optional[UserReadSimple] = None