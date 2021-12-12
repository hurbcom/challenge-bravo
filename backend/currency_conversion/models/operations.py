from logging import ERROR
from sqlalchemy.orm import Session
from . import models
from validators import schema
from database import SessionLocal
from fastapi import HTTPException

class dbUsers():
    def __init__(self, db: Session, user: schema.User):
        self.db = db
        self.user = user

    def create_user(self):
        db_user = models.User(username=self.user.username, 
                            password=self.user.password, 
                            name=self.user.name)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        return db_user

    def getUsers(self, username: str):
        return self.db.query(models.User).filter(models.User.username == username).first()
    
class dbCurrencys():
    def __init__(self, db: Session, currencys: schema.Currencys = None):
        self.db = db
        self.currencys = currencys

    def createCurrencys(self):
        if not self.getCurrencys(self.currencys.currency):
            print('entrou aqui')
            try:
                db_currencys = models.Currencys(currency=self.currencys.currency, 
                                                for_buy=self.currencys.for_buy, 
                                                for_send=self.currencys.for_send)
                self.db.add(db_currencys)
                self.db.commit()
                self.db.refresh(db_currencys)
                return db_currencys
            except Exception as e:
                raise HTTPException(status_code=401,detail=e)
        raise HTTPException(status_code=401,detail="currency alredy exist")
    
    def getCurrencys(self, currency: str):
        return self.db.query(models.Currencys).filter(models.Currencys.currency == currency).first()

    def deleteCurrencys(self, currency: str):
        db_currencys = self.getCurrencys(currency)
        if db_currencys:
            self.db.delete(db_currencys)
            self.db.commit()
            return True
        
        raise HTTPException(status_code=401,detail="currency not exist")


class ficCurrencys():
    pass