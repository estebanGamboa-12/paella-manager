from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# =======================
#   PAELLAS
# =======================

class PaellaBase(BaseModel):
    personas: int            # Tamaño 2-12
    con_fianza: bool = True  # Si deja fianza
    importe_fianza: float = 10.0  # Importe de fianza


class PaellaCreate(PaellaBase):
    pass


class PaellaResponse(PaellaBase):
    id: int

    class Config:
        from_attributes = True


# =======================
#   CLIENTES
# =======================

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
    fecha_devolucion: Optional[datetime]
    paellas: List[PaellaResponse]

    class Config:
        from_attributes = True


class ClientUpdate(ClientBase):
    paellas: List[PaellaCreate]
