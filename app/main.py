from fastapi import FastAPI



app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello World! Welcome to my currency conversion API! 💸"}