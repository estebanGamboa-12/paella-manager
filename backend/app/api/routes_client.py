from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import SessionLocal
from app.schemas.client_schema import ClientCreate, ClientResponse, ClientUpdate
from app.crud import client_crud

router = APIRouter(prefix="/clients", tags=["clients"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[ClientResponse])
def list_clients(db: Session = Depends(get_db)):
    return client_crud.get_all_clients(db)


@router.get("/{client_id}", response_model=ClientResponse)
def get_one(client_id: int, db: Session = Depends(get_db)):
    client = client_crud.get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client


@router.get("/search/", response_model=List[ClientResponse])
def search_clients(q: str, db: Session = Depends(get_db)):
    return client_crud.search_clients(db, q)


@router.post("/", response_model=ClientResponse)
def add_client(client: ClientCreate, db: Session = Depends(get_db)):
    return client_crud.create_client(db, client)


@router.put("/{client_id}", response_model=ClientResponse)
def update_client(client_id: int, new_data: ClientUpdate, db: Session = Depends(get_db)):
    updated = client_crud.update_client(db, client_id, new_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return updated


@router.put("/{client_id}/return")
def return_client(client_id: int, db: Session = Depends(get_db)):
    client = client_crud.mark_as_returned(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": "Fianza devuelta ✅", "client": client}


@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    deleted = client_crud.delete_client(db, client_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": "Cliente eliminado ✅"}
