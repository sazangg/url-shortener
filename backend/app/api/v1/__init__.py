from fastapi import APIRouter

from . import urls
from . import auth

router_api_v1 = APIRouter(prefix="/v1")
router_api_v1.include_router(urls.router)
router_api_v1.include_router(auth.router)
