from fastapi import APIRouter

from app.api.routes import utils
from app.api.routes import user_routes

api_router = APIRouter()
api_router.include_router(utils.router)
api_router.include_router(user_routes.router) 
