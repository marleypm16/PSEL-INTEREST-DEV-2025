import uuid
from app.models import User
from fastapi import Depends
from sqlmodel import Session,select
from app.core.db import get_session
class UserRepository:
    def __init__(self, db_session : Session):
        self.db_session = db_session

    def get_user_by_id(self, user_id):
        return self.db_session.get(User, user_id)
    
    def get_all_users(self):
        return self.db_session.exec(select(User)).all()

    def create_user(self, user: User):
        self.db_session.add(user)
        self.db_session.commit()
        self.db_session.refresh(user)
        return user

    def update_user(self, user_id: uuid.UUID, new_data_user: dict[str, any]):
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        for key, value in new_data_user.items():
            setattr(user, key, value)
       
        self.db_session.add(user)
        self.db_session.commit()
        self.db_session.refresh(user)
        return user
    
    def delete_user(self, user_id):
        user = self.get_user_by_id(user_id)
        if user:
            if user.leader_of:
                raise Exception("Cannot delete a user who is a team leader.")
            self.db_session.delete(user)
            self.db_session.commit()
        return user
    
    def get_user_repository(db_session : Session = Depends(get_session)):
        return UserRepository(db_session)