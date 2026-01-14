from app.models import Team, User
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select
from fastapi import Depends
from app.core.db import get_session
from sqlalchemy.exc import IntegrityError 

import uuid

class TeamRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_team_by_id(self, team_id: uuid.UUID):
        statement = (
            select(Team)
            .where(Team.id == team_id)
            .options(
                selectinload(Team.leader),  
                selectinload(Team.members)  
            )
        )
        return self.db_session.exec(statement).first()

    def get_all_teams(self):
        statement = (
            select(Team)
            .options(selectinload(Team.leader))
        )
        return self.db_session.exec(statement).all()
    
    def create_team(self, team: Team):
        db_leader = self.db_session.get(User, team.leader_id)
        if not db_leader:
            raise Exception("Líder não encontrado")

        self.db_session.add(team)
        
        self.db_session.flush() 

        db_leader.team_id = team.id
        self.db_session.add(db_leader)

        try:
            self.db_session.commit()
        except IntegrityError:
            self.db_session.rollback()
            raise Exception("Este usuário já está liderando outro time.")
        
        self.db_session.refresh(team)
        return team

    def update_team(self, team_id: uuid.UUID, new_data_team: dict):
        db_team = self.get_team_by_id(team_id)
        if not db_team:
            return None
        
        if "leader_id" in new_data_team and new_data_team["leader_id"] != db_team.leader_id:
            new_leader_id = new_data_team["leader_id"]
            new_leader = self.db_session.get(User, new_leader_id)
            
            if new_leader:
                new_leader.team_id = team_id
                self.db_session.add(new_leader)
                

        for key, value in new_data_team.items():
            setattr(db_team, key, value)

        self.db_session.add(db_team)
        self.db_session.commit()
        self.db_session.refresh(db_team)
        return db_team

    def delete_team(self, team_id: uuid.UUID):
        team = self.get_team_by_id(team_id)
        if team:
            for member in team.members:
                member.team_id = None
                self.db_session.add(member)
            
            self.db_session.delete(team)
            self.db_session.commit()
        return team
    
    def add_member_to_team(self, team_id: uuid.UUID, user_id: uuid.UUID):
        user = self.db_session.get(User, user_id)
        team = self.db_session.get(Team, team_id)
        
        if not team or not user:
            return None
            
        user.team_id = team_id
        self.db_session.add(user)
        self.db_session.commit()
        
        return self.get_team_by_id(team_id)

    def remove_member_from_team(self, team_id: uuid.UUID, user_id: uuid.UUID):
        user = self.db_session.get(User, user_id)
        team = self.db_session.get(Team, team_id)
        if not team or not user:
            return None
        
        if team.leader_id == user_id:
            raise Exception("Não é possível remover o líder do time")
        if user.team_id != team_id:
            return None
        user.team_id = None
        self.db_session.add(user)
        self.db_session.commit()
            
        return self.get_team_by_id(team_id)

def get_team_repository(db_session: Session = Depends(get_session)):
    return TeamRepository(db_session)