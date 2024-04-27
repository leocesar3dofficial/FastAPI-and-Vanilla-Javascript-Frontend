from typing import Optional
from uuid import UUID

from pydantic import BaseModel


# Shared properties
class ExpenseBase(BaseModel):
    title: str
    description: Optional[str] = None
    income: float = 0.0
    food: float = 0.0 
    clothing: float = 0.0 
    housing: float = 0.0 
    healthcare: float = 0.0 
    transportation: float = 0.0 
    education: float = 0.0 
    entertainment: float = 0.0 
    

# Properties to receive on item creation
class ExpenseCreate(ExpenseBase):
    pass


# Properties to receive on item update
class ExpenseUpdate(ExpenseBase):
    pass


# Properties shared by models stored in DB
class ExpenseInDBBase(ExpenseBase):
    id: UUID
    owner_id: UUID

    class Config:
        orm_mode = True


# Properties to return to client
class Expense(ExpenseInDBBase):
    pass


# Properties properties stored in DB
class ExpenseInDB(ExpenseInDBBase):
    pass