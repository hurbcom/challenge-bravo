from fastapi import FastAPI
from app.routers import currencies

app = FastAPI()


app.include_router(currencies.router)

@app.get("/currencies")
def root():
    return {"message": "API From Mi Rosa to HURB!"}