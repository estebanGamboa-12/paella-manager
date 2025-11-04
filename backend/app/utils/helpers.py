from datetime import datetime       

def format_datetime(dt:datetime)-> str:
    """Convierte una fecha a formato legible (dd/mm/yyyy HH:MM)."""
    return dt.strftime("%d/%m/%Y %H:%M") if dt else "-" 