from fastapi import APIRouter, status



router = APIRouter(
    prefix="/convert",
    tags=["convert"]
)

@router.get("/", status_code=status.HTTP_200_OK)
def convert():
    """ Converts two currencies """
    pass