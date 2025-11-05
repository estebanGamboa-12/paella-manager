from sqlalchemy.orm import Session
from datetime import datetime
from app.db import models
from app.schemas.client_schema import ClientCreate, ClientUpdate

def get_all_clients(db: Session):
    return db.query(models.Client).order_by(models.Client.fecha_creacion.desc()).all()

def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def search_clients(db: Session, search_term: str):
    return db.query(models.Client).filter(
        models.Client.nombre.ilike(f"%{search_term}%") |
        models.Client.apellidos.ilike(f"%{search_term}%") |
        models.Client.telefono.ilike(f"%{search_term}%")
    ).all()

def create_client(db: Session, client: ClientCreate):
    db_client = models.Client(
        nombre=client.nombre,
        apellidos=client.apellidos,
        telefono=client.telefono,
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)

    for p in client.paellas:
        db.add(models.Paella(
            client_id=db_client.id,
            personas=p.personas,
            con_fianza=p.con_fianza,
            importe_fianza=p.importe_fianza,
        ))

    db.commit()
    db.refresh(db_client)
    return db_client

def update_client(db: Session, client_id: int, data: ClientUpdate):
    db_client = get_client(db, client_id)
    if not db_client:
        return None

    db_client.nombre = data.nombre
    db_client.apellidos = data.apellidos
    db_client.telefono = data.telefono

    db.query(models.Paella).filter(models.Paella.client_id == client_id).delete()

    for p in data.paellas:
        db.add(models.Paella(
            client_id=client_id,
            personas=p.personas,
            con_fianza=p.con_fianza,
            importe_fianza=p.importe_fianza,
        ))

    db.commit()
    db.refresh(db_client)
    return db_client

def mark_as_returned(db: Session, client_id: int):
    client = get_client(db, client_id)
    if client:
        client.devuelto = True
        client.fecha_devolucion = datetime.utcnow()
        db.commit()
        db.refresh(client)
    return client

def delete_client(db: Session, client_id: int):
    client = get_client(db, client_id)
    if client:
        db.delete(client)
        db.commit()
        return True
    return False
