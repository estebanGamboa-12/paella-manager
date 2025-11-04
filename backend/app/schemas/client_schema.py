from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class PaellaBase(BaseModel):
    personas: int
    con_fianza: bool = True
    importe_fianza: float = 10.0

class PaellaCreate(PaellaBase):
    pass

class PaellaResponse(PaellaBase):
    id: int
    fecha_entrega: datetime

    class Config:
        from_attributes = True

class ClientBase(BaseModel):
    nombre: str
    apellidos: str
    telefono: Optional[str] = None

class ClientCreate(ClientBase):
    paellas: List[PaellaCreate]

class ClientResponse(ClientBase):
    id: int
    devuelto: bool
    fecha_creacion: datetime
    paellas: List[PaellaResponse] = []

    class Config:
        from_attributes = True
