from fastapi import APIRouter
from routers.endpoints import login, tests, users, expenses


api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(tests.router, prefix="/tests", tags=["tests"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
