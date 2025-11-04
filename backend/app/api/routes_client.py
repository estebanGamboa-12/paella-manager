from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import SessionLocal
from app.schemas.client_schema import ClientCreate, ClientResponse
from app.crud import client_crud

router = APIRouter(prefix="/clients", tags=["Clients"])

# 🔧 Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📋 Obtener todos los clientes
@router.get("/", response_model=List[ClientResponse])
def list_clients(db: Session = Depends(get_db)):
    return client_crud.get_all_clients(db)

# 🆕 Crear cliente con varias paellas
@router.post("/", response_model=ClientResponse)
def add_client(client: ClientCreate, db: Session = Depends(get_db)):
    return client_crud.create_client_with_paellas(db, client)

# 🔍 Buscar clientes
@router.get("/search/", response_model=List[ClientResponse])
def search_clients(q: str, db: Session = Depends(get_db)):
    return client_crud.search_clients(db, q)

# ♻️ Marcar cliente como devuelto
@router.put("/{client_id}/return")
def return_client(client_id: int, db: Session = Depends(get_db)):
    client = client_crud.mark_as_returned(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": "Fianza devuelta ✅", "client": client}
