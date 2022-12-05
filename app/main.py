from fastapi import FastAPI

app = FastAPI()

@app.get("/currencies")
def root():
    return {"message": "API From Mi Rosa to HURB!"}