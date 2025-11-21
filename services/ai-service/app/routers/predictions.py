"""
Predictions Router
Handles oil consumption predictions
"""

from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from typing import List

from app.schemas import PredictionRequest, PredictionResponse
from app.database import get_database
from app.models.ml_models import MLModels

router = APIRouter()
ml_models = MLModels()

@router.post("/consumption", response_model=PredictionResponse)
async def predict_consumption(request: PredictionRequest):
    """
    Predict future oil consumption for a user
    """
    try:
        db = get_database()
        
        # Fetch user profile
        user = await db.users.find_one({"userId": request.userId})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Fetch oil logs
        oil_logs = await db.oil_logs.find(
            {"userId": request.userId}
        ).sort("date", -1).limit(90).to_list(length=90)
        
        if len(oil_logs) < 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient data for prediction. Need at least 3 days of oil logs."
            )
        
        # Convert MongoDB documents to dicts
        oil_logs = [
            {
                "userId": log["userId"],
                "amount": log["amount"],
                "date": log["date"].isoformat() if hasattr(log["date"], "isoformat") else log["date"],
                "oilType": log.get("oilType", "other")
            }
            for log in oil_logs
        ]
        
        user_profile = {
            "familySize": user.get("familySize", 1),
            "age": user.get("age", 30),
            "dietaryHabit": user.get("dietaryHabit", "vegetarian"),
            "healthConditions": user.get("healthConditions", [])
        }
        
        # Make prediction
        predictions, confidence = await ml_models.predict_consumption(
            request.userId,
            oil_logs,
            user_profile,
            request.days_ahead
        )
        
        # Generate recommendations based on prediction
        total_predicted = sum(p["predicted_amount"] for p in predictions)
        avg_daily = total_predicted / len(predictions)
        
        recommendations = []
        
        # ICMR recommendation: 1000ml per person per month
        icmr_daily = 1000 / 30 / user_profile["familySize"]
        
        if avg_daily > icmr_daily * 1.5:
            recommendations.append("⚠️ Your predicted consumption is 50% higher than recommended. Consider cooking methods that use less oil.")
            recommendations.append("💡 Try air frying, steaming, or grilling instead of deep frying")
        elif avg_daily > icmr_daily * 1.2:
            recommendations.append("⚠️ Your consumption is slightly elevated. Small changes can make a big difference!")
            recommendations.append("💡 Use spray bottles for oil distribution")
        else:
            recommendations.append("✅ Great! Your predicted consumption is within healthy limits")
            recommendations.append("💡 Keep up the good work!")
        
        return PredictionResponse(
            userId=request.userId,
            predictions=predictions,
            confidence=round(confidence, 2),
            recommendations=recommendations,
            generated_at=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@router.post("/train")
async def train_model():
    """
    Train the consumption prediction model with all available data
    Admin endpoint - should be protected in production
    """
    try:
        db = get_database()
        
        # Fetch all users
        users = await db.users.find().to_list(length=None)
        user_profiles = {user["userId"]: user for user in users}
        
        # Fetch all oil logs grouped by user
        training_data = {}
        for user_id in user_profiles.keys():
            logs = await db.oil_logs.find(
                {"userId": user_id}
            ).sort("date", 1).to_list(length=None)
            
            if len(logs) >= 7:  # Need at least a week of data
                training_data[user_id] = [
                    {
                        "userId": log["userId"],
                        "amount": log["amount"],
                        "date": log["date"].isoformat() if hasattr(log["date"], "isoformat") else log["date"],
                        "oilType": log.get("oilType", "other")
                    }
                    for log in logs
                ]
        
        if len(training_data) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient training data. Need at least 10 users with 7+ days of logs. Found: {len(training_data)}"
            )
        
        # Train model
        metrics = await ml_models.train_consumption_model(training_data, user_profiles)
        
        return {
            "status": "success",
            "message": "Model trained successfully",
            "metrics": metrics,
            "training_samples": sum(len(logs) for logs in training_data.values()),
            "users_count": len(training_data),
            "trained_at": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Training failed: {str(e)}"
        )
