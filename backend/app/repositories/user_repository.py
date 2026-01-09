from app.models import User
from sqlmodel import Session,select
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

    def update_user(self, user: User):
       user = self.get_user_by_id(user.id)
       if user:
           self.db_session.add(user)
           self.db_session.commit()
           self.db_session.refresh(user)
           return user
    
    def delete_user(self, user_id):
        user = self.get_user_by_id(user_id)
        if user:
            self.db_session.delete(user)
            self.db_session.commit()
        return user