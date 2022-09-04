from fastapi import FastAPI, status

from app.routers import quote, favorite



app = FastAPI()

app.include_router(quote.router)
app.include_router(favorite.router)


@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {"message": "Hello World! Welcome to my currency conversion API! 💸"}