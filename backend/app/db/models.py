from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    telefono = Column(String, nullable=True)
    devuelto = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    fecha_devolucion = Column(DateTime, nullable=True)

    # 🟩 Relación: un cliente puede tener varias paellas
    paellas = relationship("Paella", back_populates="cliente", cascade="all, delete")

class Paella(Base):
    __tablename__ = "paellas"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    personas = Column(Integer, nullable=False)
    con_fianza = Column(Boolean, default=True)
    importe_fianza = Column(Float, default=10.0)
    fecha_entrega = Column(DateTime, default=datetime.utcnow)

    # 🔗 Relación inversa
    cliente = relationship("Client", back_populates="paellas")
