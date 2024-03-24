from fastapi import (
    APIRouter,
    status,
)
from fastapi.responses import (
    JSONResponse,
    RedirectResponse,
)

router = APIRouter(tags=["Health Checker"])


@router.get(
    path="/health",
    response_class=JSONResponse,
    status_code=status.HTTP_200_OK,
)
def check_health() -> JSONResponse:
    return JSONResponse(content={"status": "OK"})


@router.get("/", include_in_schema=False)
def return_docs():
    return RedirectResponse(url="/docs")
