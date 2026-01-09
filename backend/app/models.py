from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship, Column, ForeignKey
import uuid
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
# Arquivo base para criação de todos os modelos necessários
# Serve como base para User e Team models
# Através dele a exportação para o alembic deve ser executada

class User(SQLModel, table=True):
    __tablename__ = "users"
    id:uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str
    team_id: Optional[uuid.UUID] = Field(default=None, foreign_key="teams.id")
    team: Optional["Team"] = Relationship(back_populates="members")
    leader_of: Optional["Team"] = Relationship(
        sa_relationship_kwargs={"uselist": False},
        back_populates="leader"
    )

class Team(SQLModel, table=True):
    __tablename__ = "teams"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str

    leader_id: uuid.UUID = Field(
        sa_column=Column(
            PG_UUID(as_uuid=True), 
            ForeignKey("users.id", use_alter=True, name="fk_team_leader"), 
            unique=True, 
            nullable=False
        )
    )

    members: List[User] = Relationship(back_populates="team")
    
    leader: User = Relationship(back_populates="leader_of")