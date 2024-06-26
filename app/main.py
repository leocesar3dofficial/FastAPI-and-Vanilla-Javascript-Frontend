from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from db import init_db, session
from routers.api import api_router
from support.config import settings

init_db.init_db(session.SessionLocal())

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_PREFIX_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_PREFIX_STR)