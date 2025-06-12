from fastapi import APIRouter, Depends

from ...models import User
from ...schemas import UserRead
from ...api.deps import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_user)):
    return current_user
