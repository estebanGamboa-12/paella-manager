from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PaellaManager"
    DATABASE_URL: str = "sqlite:///./paellas.db"

settings = Settings()
