import uuid
from app.models import User
from fastapi import Depends
from sqlalchemy.orm import selectinload


from sqlmodel import Session,select
from app.core.db import get_session
class UserRepository:
    def __init__(self, db_session : Session):
        self.db_session = db_session

    def get_user_by_id(self, user_id):
        statement = select(User).where(User.id == user_id).options(
            selectinload(User.team),
            selectinload(User.leader_of)
        )
        return self.db_session.exec(statement).first()
    
    def get_all_users(self):
        statement = select(User).options(
            selectinload(User.team),
            selectinload(User.leader_of)
        )
        return self.db_session.exec(statement).all()

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
                raise Exception("Não é possível deletar um usuário que é líder de um time.")
            self.db_session.delete(user)
            self.db_session.commit()
        return user
    
def get_user_repository(db_session : Session = Depends(get_session)):
        return UserRepository(db_session)