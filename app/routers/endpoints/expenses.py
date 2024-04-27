from typing import Any, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from routers import depends


router = APIRouter()


@router.get("/", response_model=List[schemas.Expense])
def read_expenses(
    db: Session = Depends(depends.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(depends.get_current_active_user),
) -> Any:
    """
    Retrieve expenses.
    """
    expenses = crud.expense.get_multi_by_owner(db=db, owner_id=current_user.id, skip=skip, limit=limit)
    return expenses


@router.post("/", response_model=schemas.Expense)
def create_expense(
    *,
    db: Session = Depends(depends.get_db),
    expense_in: schemas.ExpenseCreate,
    current_user: models.User = Depends(depends.get_current_active_user),
) -> Any:
    """
    Create new expense.
    """
    expense = crud.expense.create_with_owner(db=db, obj_in=expense_in, owner_id=current_user.id)
    return expense


@router.put("/{id}", response_model=schemas.Expense)
def update_expense(
    *,
    db: Session = Depends(depends.get_db),
    id: UUID,
    expense_in: schemas.ExpenseUpdate,
    current_user: models.User = Depends(depends.get_current_active_user),
) -> Any:
    """
    Update an expense.
    """
    expense = crud.expense.get(db=db, id=id)

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if (expense.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")

    expense = crud.expense.update(db=db, db_obj=expense, obj_in=expense_in)
    return expense


@router.get("/{id}", response_model=schemas.Expense)
def read_expense(
    *,
    db: Session = Depends(depends.get_db),
    id: UUID,
    current_user: models.User = Depends(depends.get_current_active_user),
) -> Any:
    """
    Get expense by ID.
    """
    expense = crud.expense.get(db=db, id=id)

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if (expense.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")

    return expense


@router.delete("/{id}", response_model=schemas.Expense)
def delete_expense(
    *,
    db: Session = Depends(depends.get_db),
    id: UUID,
    current_user: models.User = Depends(depends.get_current_active_user),
) -> Any:
    """
    Delete an expense.
    """
    expense = crud.expense.get(db=db, id=id)

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    if (expense.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    expense = crud.expense.remove(db=db, id=id)
    return expense
