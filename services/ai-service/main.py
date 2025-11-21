"""
AI Service - FastAPI Application
Provides ML-based predictions and recommendations for oil consumption
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from app.routers import predictions, recommendations, insights
from app.database import connect_db, close_db
from app.models.ml_models import MLModels

load_dotenv()

# Initialize ML models
ml_models = MLModels()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for the application"""
    # Startup
    await connect_db()
    await ml_models.load_models()
    print("✅ AI Service started successfully")
    
    yield
    
    # Shutdown
    await close_db()
    print("✅ AI Service shut down gracefully")

app = FastAPI(
    title="Bharat Low Oil Platform - AI Service",
    description="Machine Learning service for consumption predictions and personalized recommendations",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-service",
        "version": "1.0.0",
        "models_loaded": ml_models.is_loaded()
    }

# Include routers
app.include_router(predictions.router, prefix="/predictions", tags=["Predictions"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc) if os.getenv("ENVIRONMENT") == "development" else "An unexpected error occurred"
        }
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3004))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )
