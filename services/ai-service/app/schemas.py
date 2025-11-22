"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class OilType(str, Enum):
    sunflower = "sunflower"
    coconut = "coconut"
    mustard = "mustard"
    olive = "olive"
    groundnut = "groundnut"
    sesame = "sesame"
    rice_bran = "rice-bran"
    palm = "palm"
    other = "other"

class DietaryHabit(str, Enum):
    vegetarian = "vegetarian"
    non_vegetarian = "non-vegetarian"
    vegan = "vegan"
    eggetarian = "eggetarian"

class PredictionRequest(BaseModel):
    userId: str = Field(..., min_length=1)
    days_ahead: int = Field(default=30, ge=1, le=90, description="Number of days to predict ahead")

class PredictionResponse(BaseModel):
    userId: str
    predictions: List[Dict[str, float]]  # List of {date, predicted_amount}
    confidence: float
    recommendations: List[str]
    generated_at: datetime

class RecommendationRequest(BaseModel):
    userId: str = Field(..., min_length=1)
    limit: int = Field(default=10, ge=1, le=50)
    filters: Optional[Dict[str, str]] = None

class Recipe(BaseModel):
    id: str
    name: str
    nameHindi: str
    nameTamil: str
    description: str
    oilAmount: float
    cuisine: str
    difficulty: str
    cookingTime: int
    servings: int
    tags: List[str]
    ingredients: List[str]
    instructions: List[str]
    nutritionInfo: Dict[str, float]
    imageUrl: Optional[str] = None
    score: float  # Recommendation score

class RecommendationResponse(BaseModel):
    userId: str
    recipes: List[Recipe]
    reason: str
    generated_at: datetime

class InsightRequest(BaseModel):
    userId: str = Field(..., min_length=1)
    period: str = Field(default="month", pattern="^(week|month|quarter|year)$")

class InsightResponse(BaseModel):
    userId: str
    period: str
    total_consumption: float
    average_daily: float
    trend: str  # "increasing", "decreasing", "stable"
    health_status: str  # "healthy", "moderate", "high_risk"
    comparison_to_average: float  # Percentage difference from ICMR guidelines
    peak_consumption_days: List[str]
    recommendations: List[str]
    achievements: List[str]
    generated_at: datetime

class TrainingRequest(BaseModel):
    model_type: str = Field(..., pattern="^(consumption|recommendation)$")
    force_retrain: bool = False
    
    model_config = {
        "protected_namespaces": ()
    }

class TrainingResponse(BaseModel):
    model_type: str
    status: str
    metrics: Dict[str, float]
    trained_at: datetime
    
    model_config = {
        "protected_namespaces": ()
    }
