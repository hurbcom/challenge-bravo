from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.schemas.convert import ConversionInput, ConversionResponse
from app.database import get_db
from app.operators.convert import ConvertOperator



router = APIRouter(
    prefix="/convert",
    tags=["convert"]
)

@router.get("/", status_code=status.HTTP_200_OK, response_model=ConversionResponse)
def convert(params: ConversionInput = Depends(), db: Session = Depends(get_db)):
    """ Converts two currencies """

    converter = ConvertOperator(**params.dict(), db=db)
    converter_result = converter.convert()
    # converter_output =
    return ConversionResponse(data=converter_result)