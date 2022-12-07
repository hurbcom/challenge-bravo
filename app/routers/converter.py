from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.converter import ConverterModelResponse, InputConversionSchema
from app.services.converter import ConvertOperator

router = APIRouter(prefix="/converter", tags=["Converter"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=ConverterModelResponse)
async def converter(
    params: InputConversionSchema = Depends(), db: Session = Depends(get_db)
):

    converter = ConvertOperator(**params.dict(), db=db)
    converter_result = converter.convert_currencies()
    return ConverterModelResponse(data=converter_result)
