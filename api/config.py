import os
from dotenv import load_dotenv

load_dotenv()

# Local Docker/development can continue using this.
DATABASE_URL = os.getenv("DATABASE_URL")

# AWS ECS production configuration.
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 1440