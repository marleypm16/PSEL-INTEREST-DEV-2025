from app.models import Team, User
from sqlmodel import Session,select
from fastapi import Depends
from app.core.db import get_session
import uuid
class TeamRepository:
    def __init__(self, db_session : Session):
        self.db_session = db_session
    def get_team_by_id(self, team_id):
        return self.db_session.get(Team, team_id)
    def get_all_teams(self):
        return self.db_session.exec(select(Team)).all()
    
    def create_team(self, team: Team):
       self.db_session.add(team)
       self.db_session.commit()
       self.db_session.refresh(team)
       return team
    def update_team(self, team_id: uuid.UUID, new_data_team: dict[str, any]):
        db_team_data = self.get_team_by_id(team_id)
        if not db_team_data:
           return None
        for key, value in new_data_team.items():
            setattr(db_team_data, key, value)
        self.db_session.add(db_team_data)
        self.db_session.commit()
        self.db_session.refresh(db_team_data)
        return db_team_data
    def delete_team(self, team_id):
        team = self.get_team_by_id(team_id)
        if team:
            self.db_session.delete(team)
            self.db_session.commit()
        return team
    
    def add_member_to_team(self, team_id: uuid.UUID, user_id: uuid.UUID):
        user = self.db_session.get(User, user_id)
        if user:
            user.team_id = team_id
            self.db_session.add(user)
            self.db_session.commit()
            self.db_session.refresh(user)
        return user
    def remove_member_from_team(self, team_id: uuid.UUID, user_id: uuid.UUID):
        user = self.db_session.get(User, user_id)
        if user and user.team_id == team_id:
            user.team_id = None
            self.db_session.add(user)
            self.db_session.commit()
            self.db_session.refresh(user)
        return user
    
    def get_team_repository(db_session : Session = Depends(get_session)):
        return TeamRepository(db_session)