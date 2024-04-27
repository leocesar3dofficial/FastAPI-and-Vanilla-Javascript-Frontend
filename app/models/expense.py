import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from db.base_class import Base


if TYPE_CHECKING:
    from .user import User  # noqa: F401
    

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    created = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    income = Column(Float, nullable=False, default=0.0)
    food = Column(Float, nullable=False, default=0.0)
    clothing = Column(Float, nullable=False, default=0.0)
    housing = Column(Float, nullable=False, default=0.0)
    healthcare = Column(Float, nullable=False, default=0.0)
    transportation = Column(Float, nullable=False, default=0.0)
    education = Column(Float, nullable=False, default=0.0)
    entertainment = Column(Float, nullable=False, default=0.0)
    # must be the name of the table as defined in __tablename__
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"),  nullable=False)
    owner = relationship("User", back_populates="expenses")