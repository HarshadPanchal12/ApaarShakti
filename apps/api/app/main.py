"""
APAAR-Verify — FastAPI Application Entry Point
SIH26263 | Smart India Hackathon 2026
"""
from __future__ import annotations

import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import setup_logging

setup_logging()
logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("startup", app=settings.APP_NAME, version=settings.APP_VERSION, env=settings.ENVIRONMENT)
    yield
    logger.info("shutdown")


app = FastAPI(
    title=f"{settings.APP_NAME} API",
    description="Smart Student Data Management & Verification Platform for AICTE-Approved Institutions",
    version=settings.APP_VERSION,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request ID & logging middleware ───────────────────────────────────────────
@app.middleware("http")
async def request_middleware(request: Request, call_next) -> Response:
    request_id = str(uuid.uuid4())
    start = time.perf_counter()
    request.state.request_id = request_id

    response = await call_next(request)

    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    logger.info(
        "http_request",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration_ms=duration_ms,
        request_id=request_id,
    )
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time"] = f"{duration_ms}ms"
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# ── Health & metrics ──────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"], summary="Health check")
async def health():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/metrics", tags=["meta"], summary="Prometheus metrics (text/plain)")
async def metrics():
    # Minimal placeholder; replace with prometheus_client exposition in Phase 8
    return Response(
        content="# APAAR-Verify metrics placeholder\napaar_verify_up 1\n",
        media_type="text/plain",
    )


# ── API routers (registered as phases are built) ──────────────────────────────
# from app.modules.ingestion.router import router as ingestion_router
# app.include_router(ingestion_router, prefix="/api/v1/ingest", tags=["Ingestion"])

# Phase 0: skeleton only
@app.get("/api/v1/status", tags=["meta"])
async def api_status():
    return {
        "phase": 0,
        "message": "APAAR-Verify API skeleton — Phase 0 complete. Auth, ingestion, validation and more coming in subsequent phases.",
        "modules": {
            "ingestion": "pending",
            "validation": "pending",
            "apaar_mock": "pending",
            "matching": "pending",
            "anomaly": "pending",
            "automation": "pending",
            "credentials": "pending",
            "consent": "pending",
            "reports": "pending",
            "admin": "pending",
        },
    }

