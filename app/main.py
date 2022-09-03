from fastapi import FastAPI, status

from app.routers import quote



app = FastAPI()

app.include_router(quote.router)


@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {"message": "Hello World! Welcome to my currency conversion API! 💸"}