from flask_login import UserMixin
from database.engine import Connector


class UserModel(UserMixin):
    def __init__(self, id, email, password):
         self.id = int(id)
         self.email = email
         self.password = password
         self.authenticated = False

    def is_authenticated(self):
         return self.authenticated

    def selectOneByEmail(email):
        db = Connector()
        user = db.selectOne(f"SELECT * FROM auth where email = '{email}'")
        return UserModel(int(user[0]), user[1], user[2])

    def selectOneById(id):
        db = Connector()
        user = db.selectOne(f"SELECT * FROM auth where id = {id}")
        return UserModel(int(user[0]), user[1], user[2])

