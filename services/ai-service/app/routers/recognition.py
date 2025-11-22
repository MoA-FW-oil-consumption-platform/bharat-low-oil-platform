from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import random

router = APIRouter()

@router.post("/food", summary="Analyze food image for oil content")
async def analyze_food_image(file: UploadFile = File(...)):
    """
    Analyze an uploaded food image to estimate oil content and calories.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Mock AI Analysis Logic
    # In a real implementation, this would pass the image to a TensorFlow/PyTorch model
    
    # Simulated results
    dishes = [
        {"name": "Paneer Butter Masala", "oil_content": "30ml", "calories": 450, "health_score": 65},
        {"name": "Aloo Paratha", "oil_content": "15ml", "calories": 320, "health_score": 70},
        {"name": "Samosa", "oil_content": "25ml", "calories": 280, "health_score": 40},
        {"name": "Vegetable Salad", "oil_content": "5ml", "calories": 150, "health_score": 95},
        {"name": "Chicken Curry", "oil_content": "35ml", "calories": 500, "health_score": 60}
    ]
    
    result = random.choice(dishes)
    
    return {
        "success": True,
        "analysis": {
            "dish_name": result["name"],
            "estimated_oil_content": result["oil_content"],
            "calories": result["calories"],
            "health_score": result["health_score"],
            "confidence": 0.85 + (random.random() * 0.1)
        },
        "recommendation": "Consider using an air fryer or reducing oil by 50% for a healthier version."
    }
