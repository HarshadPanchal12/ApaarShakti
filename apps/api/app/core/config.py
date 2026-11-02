"""APAAR-Verify application configuration."""
from __future__ import annotations

import os
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    APP_NAME: str = "APAAR-Verify"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # URLs
    APP_URL: str = "http://localhost:3000"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Supabase
    SUPABASE_URL: str = "http://localhost:54321"
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_DB_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:54322/postgres"

    # Security
    APAAR_PEPPER: str = "demo-pepper-change-in-production-32bytes!!"
    JWT_SECRET: str = "demo-jwt-secret-change-in-production!"

    # Optional LLM
    GROQ_API_KEY: str = ""

    # Email
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@apaar-verify.dev"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"

    # Demo
    DEMO_MODE: bool = True
    SEED_RNG_SEED: int = 42


settings = Settings()

