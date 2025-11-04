from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 👈 importa CORS
from app.api import routes_client
from app.db import models, database

# Crear las tablas automáticamente al iniciar la aplicación
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="PaellaManager API")

# 👇 Añade este bloque de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes poner ["http://localhost:5173"] si prefieres restringirlo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(routes_client.router)

@app.get("/")
def root():
    return {"message": "API de PaellaManager funcionando correctamente ✅"}
