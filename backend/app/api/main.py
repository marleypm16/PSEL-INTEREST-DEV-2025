from fastapi import APIRouter

from app.api.routes import utils
from app.api.routes import user_routes
from app.api.routes import team_routes

api_router = APIRouter()
api_router.include_router(utils.router)
api_router.include_router(user_routes.router) 
api_router.include_router(team_routes.router)