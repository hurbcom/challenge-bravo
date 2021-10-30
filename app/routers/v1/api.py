from fastapi import APIRouter

from .routers import currencies

api_router = APIRouter()
api_router.include_router(currencies.router)
