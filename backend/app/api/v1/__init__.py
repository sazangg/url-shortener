from fastapi import APIRouter

from . import urls

router_api_v1 = APIRouter(prefix="/v1", tags=["v1"])
router_api_v1.include_router(urls.router)
