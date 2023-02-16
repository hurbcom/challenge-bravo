from fastapi import APIRouter, Depends, status

from app.schemas.convert import ConvertModelResponse, InputConversionSchema
from app.services.convert_service import ConvertOperator

router = APIRouter(prefix="/convert", tags=["Convert"])


@router.get("/", status_code=status.HTTP_200_OK)
async def convert(params: InputConversionSchema = Depends()):

    converter = ConvertOperator()
    converter_result = await converter.convert_currencies(params)
    return ConvertModelResponse(data=converter_result)
