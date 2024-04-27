from typing import Any
from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr
import models, schemas
from routers import depends
from support.email import send_test_email


router = APIRouter()


@router.post("/test-email/", response_model=schemas.Msg, status_code=201)
def test_email(
    email_to: EmailStr,
    current_user: models.User = Depends(depends.get_current_active_superuser),
) -> Any:
    """
    Test emails.
    """
    send_test_email(email_to=email_to)
    return {"msg": "Test email sent"}
