from fastapi import APIRouter, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from validators import schema
from datetime import  timedelta
from models.operations import dbUsers, dbCurrencys
from sqlalchemy.orm import Session
from middlewares import jwt
from integrations import api_conversion
import database
from views.views import interfaceConversions, interfaceCurrencys, checkCurrencysAvailable

routers = APIRouter()

@routers.put("/user/create_user", response_model=schema.User)
def create_user(user: schema.User, 
                db: Session = Depends(database.get_db)):
    
    db_user = dbUsers(db, user)
    
    if db_user.getUsers(user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    return db_user.create_user()


@routers.post('/login')
def login(login: schema.Login, Authorize: AuthJWT = Depends(), 
          db: Session = Depends(database.get_db)):
    
    db_user = dbUsers(db, login)
    user = db_user.getUsers(login.username)
    
    if not user:
        raise HTTPException(status_code=400,detail="User doesn't not exist!!")
    
    if login.username != user.username or login.password != user.password:
        raise HTTPException(status_code=401,detail="Bad username or password")

    access_token = Authorize.create_access_token(subject=user.username,expires_time=timedelta(minutes=30))
    return {"access_token": access_token}


@routers.get('/currency/available')
def currencys(db: Session = Depends(database.get_db)):
        
    return checkCurrencysAvailable(db)


@routers.put("/currencys/create")
def createCurrencys(currencys: schema.Currencys, 
                    db: Session = Depends(database.get_db), 
                    Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    db_currency = dbCurrencys(db, currencys)
    
    if db_currency.createCurrencys():
        return db_currency

    return db_currency

@routers.delete("/currencys/delete")
async def deleteCurrencys(currency: str, 
                   db: Session = Depends(database.get_db),
                   Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    db_currencys = dbCurrencys(db)
    db_currencys.deleteCurrencys(currency)
    
    return {"Message":f"Currency {currency} deleted succefuly"}


@routers.get('/currency/conversion')
async def currencyConversion(From: str, To:str, Amount:float, Authorize: AuthJWT = Depends(), db: Session = Depends(database.get_db)):
    Authorize.jwt_required()
    
    response = interfaceConversions(db,currencyfrom=From, currencyto=To, valueAmount=Amount)

    return response