from sqlalchemy import Column, String, Enum, DateTime, func
from src.config.db import Base
import uuid
import enum

class UserRole(str, enum.Enum):
    SUPER_ADMIN = 'NCCT_ADMIN'
    INST_ADMIN = 'INSTITUTION_ADMIN'
    TRAINER = 'TRAINER'
    TRAINEE = 'TRAINEE'
    EMPLOYER = 'EMPLOYER'

class User(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.TRAINEE)
    preferred_language = Column(String, default='en')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
