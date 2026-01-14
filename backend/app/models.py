from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship, Column, ForeignKey
import uuid
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
# Arquivo base para criação de todos os modelos necessários
# Serve como base para User e Team models
# Através dele a exportação para o alembic deve ser executada

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    is_active: bool = Field(default=True)

    team_id: Optional[uuid.UUID] = Field(
    default=None,
    sa_column=Column(
        PG_UUID(as_uuid=True),
        ForeignKey("teams.id", ondelete="SET NULL"),
        nullable=True,
    ),
)

    team: Optional["Team"] = Relationship(
        back_populates="members",
        sa_relationship_kwargs={
            "foreign_keys": "User.team_id"
        }
    )

    leader_of: Optional["Team"] = Relationship(
        back_populates="leader",
        sa_relationship_kwargs={
            "foreign_keys": "Team.leader_id",
            "uselist": False
        }
    )


class Team(SQLModel, table=True):
    __tablename__ = "teams"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str

    leader_id: uuid.UUID = Field(
        foreign_key="users.id",
        unique=True
    )

    members: List[User] = Relationship(
        back_populates="team",
        sa_relationship_kwargs={
            "foreign_keys": "User.team_id"
        }
    )

    leader: User = Relationship(
        back_populates="leader_of",
        sa_relationship_kwargs={
            "foreign_keys": "Team.leader_id",
            "uselist": False
        }
    )