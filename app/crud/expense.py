from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from uuid import UUID

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from models.expense import Expense
from schemas.expense import ExpenseCreate, ExpenseUpdate

from .base import CRUDBase


class CRUDExpense(CRUDBase[Expense, ExpenseCreate, ExpenseUpdate]):
    def create_with_owner(self, db: Session, *, obj_in: ExpenseCreate, owner_id: UUID) -> Expense:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, owner_id=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


    def update(self, db: Session, *, db_obj: Expense, obj_in: Union[ExpenseUpdate, Dict[str, Any]]) -> Expense:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
            
        return super().update(db, db_obj=db_obj, obj_in=update_data)
        
        
    def get_multi_by_owner(
        self, db: Session, *, owner_id: UUID, skip: int = 0, limit: int = 100) -> List[Expense]:
        return (
            db.query(self.model)
            .filter(Expense.owner_id == owner_id)
            .order_by(self.model.created)
            .offset(skip)
            .limit(limit)
            .all()
        )


expense = CRUDExpense(Expense)