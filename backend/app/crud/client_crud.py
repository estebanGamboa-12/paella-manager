from sqlalchemy.orm import Session
from datetime import datetime
from app.db import models
from app.schemas.client_schema import ClientCreate

# 🧩 Obtener todos los clientes con sus paellas asociadas
def get_all_clients(db: Session):
    return (
        db.query(models.Client)
        .order_by(models.Client.fecha_creacion.desc())
        .all()
    )

# 🔍 Buscar por nombre, apellidos o teléfono
def search_clients(db: Session, search_term: str):
    return (
        db.query(models.Client)
        .filter(
            (models.Client.nombre.ilike(f"%{search_term}%")) |
            (models.Client.apellidos.ilike(f"%{search_term}%")) |
            (models.Client.telefono.ilike(f"%{search_term}%"))
        )
        .all()
    )

# 🆕 Crear cliente con varias paellas
def create_client_with_paellas(db: Session, client: ClientCreate):
    # 1️⃣ Crear el cliente base
    db_client = models.Client(
        nombre=client.nombre,
        apellidos=client.apellidos,
        telefono=client.telefono,
    )

    # 2️⃣ Crear paellas asociadas
    total_importe = 0
    for p in client.paellas:
        importe_fianza = p.importe_fianza if p.con_fianza else 0
        total_importe += importe_fianza

        paella = models.Paella(
            personas=p.personas,
            con_fianza=p.con_fianza,
            importe_fianza=importe_fianza,
        )
        db_client.paellas.append(paella)

    # 3️⃣ Guardar en la base de datos
    db.add(db_client)
    db.commit()
    db.refresh(db_client)

    # 4️⃣ Agregar un campo virtual total (no se guarda, solo se devuelve)
    db_client.importe_total = total_importe
    return db_client

# 🔁 Marcar cliente como devuelto (todas sus paellas)
def mark_as_returned(db: Session, client_id: int):
    db_client = db.query(models.Client).get(client_id)
    if db_client:
        db_client.devuelto = True
        db_client.fecha_devolucion = datetime.utcnow()
        db.commit()
        db.refresh(db_client)
    return db_client
