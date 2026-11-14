import os

SECRET_KEY = os.environ.get("SECRET_KEY", "troque-esta-chave")

DB = dict(
    host=os.environ.get("DB_HOST", "localhost"),
    user=os.environ.get("DB_USER", "root"),
    password=os.environ.get("DB_PASSWORD", "12345"),
    database=os.environ.get("DB_NAME", "reassocia"),
    charset="utf8mb4",
)

# Troque pelos dados reais da ONG (WhatsApp com DDI + DDD, só números)
WHATSAPP = os.environ.get("WHATSAPP", "5521999999999")
INSTAGRAM = os.environ.get("INSTAGRAM", "https://www.instagram.com/")
FACEBOOK = os.environ.get("FACEBOOK", "https://www.facebook.com/")
ENDERECO = "ONG Reassocia, Lote 02, Quadra 35, R. Américo Miranda, S/N - Jardim Catarina, São Gonçalo - RJ, 24716-455"
