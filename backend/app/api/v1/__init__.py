from fastapi import APIRouter

from . import auth, urls, users

router_api_v1 = APIRouter(prefix="/v1")
router_api_v1.include_router(urls.router)
router_api_v1.include_router(auth.router)
router_api_v1.include_router(users.router)
