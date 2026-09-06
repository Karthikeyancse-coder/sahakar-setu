from pydantic import BaseModel, EmailStr
from typing import Optional
from .user import UserRole

class UserCreate(BaseModel):
    full_name: str
    phone: str
    email: Optional[EmailStr] = None
    password: str
    role: UserRole = UserRole.TRAINEE

class Token(BaseModel):
    access_token: str
    token_type: str
