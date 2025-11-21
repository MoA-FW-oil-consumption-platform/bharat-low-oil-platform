"""
Recommendations Router
Handles personalized recipe recommendations
"""

from fastapi import APIRouter, HTTPException, status
from datetime import datetime

from app.schemas import RecommendationRequest, RecommendationResponse, Recipe
from app.database import get_database
from app.models.ml_models import MLModels

router = APIRouter()
ml_models = MLModels()

@router.post("/recipes", response_model=RecommendationResponse)
async def recommend_recipes(request: RecommendationRequest):
    """
    Get personalized recipe recommendations for a user
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
        
        # Build recipe query
        recipe_query = {}
        
        # Apply filters if provided
        if request.filters:
            if "cuisine" in request.filters:
                recipe_query["cuisine"] = request.filters["cuisine"]
            if "difficulty" in request.filters:
                recipe_query["difficulty"] = request.filters["difficulty"]
            if "maxOilAmount" in request.filters:
                recipe_query["oilAmount"] = {"$lte": float(request.filters["maxOilAmount"])}
        
        # Apply dietary preference filter
        dietary_habit = user.get("dietaryHabit", "vegetarian")
        if dietary_habit in ["vegetarian", "vegan"]:
            recipe_query["tags"] = {"$in": [dietary_habit]}
        
        # Fetch recipes
        recipes = await db.recipes.find(recipe_query).to_list(length=100)
        
        if len(recipes) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No recipes found matching criteria"
            )
        
        # Convert MongoDB documents to dicts
        recipes = [
            {
                "id": str(recipe["_id"]),
                "name": recipe["name"],
                "nameHindi": recipe.get("nameHindi", ""),
                "nameTamil": recipe.get("nameTamil", ""),
                "description": recipe["description"],
                "oilAmount": recipe["oilAmount"],
                "cuisine": recipe["cuisine"],
                "difficulty": recipe["difficulty"],
                "cookingTime": recipe["cookingTime"],
                "servings": recipe["servings"],
                "tags": recipe.get("tags", []),
                "ingredients": recipe.get("ingredients", []),
                "instructions": recipe.get("instructions", []),
                "nutritionInfo": recipe.get("nutritionInfo", {}),
                "imageUrl": recipe.get("imageUrl")
            }
            for recipe in recipes
        ]
        
        # Get user profile for recommendation
        user_profile = {
            "dietaryHabit": user.get("dietaryHabit", "vegetarian"),
            "healthConditions": user.get("healthConditions", []),
            "cuisinePreference": user.get("preferences", {}).get("cuisinePreference", [])
        }
        
        # Get recommendations
        recommended_recipes = await ml_models.recommend_recipes(
            request.userId,
            user_profile,
            recipes,
            request.limit
        )
        
        # Convert to Recipe schema
        recipe_objects = [
            Recipe(**recipe)
            for recipe in recommended_recipes
        ]
        
        # Generate reason
        reason = "Personalized recommendations based on your dietary preferences, health goals, and cooking habits."
        if user_profile.get("healthConditions"):
            reason += f" Optimized for: {', '.join(user_profile['healthConditions'])}."
        
        return RecommendationResponse(
            userId=request.userId,
            recipes=recipe_objects,
            reason=reason,
            generated_at=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recommendation failed: {str(e)}"
        )

@router.get("/popular")
async def get_popular_recipes(limit: int = 10):
    """
    Get most popular low-oil recipes
    """
    try:
        db = get_database()
        
        # Get recipes with low oil amount, sorted by popularity (view count)
        recipes = await db.recipes.find(
            {"oilAmount": {"$lte": 40}}
        ).sort("viewCount", -1).limit(limit).to_list(length=limit)
        
        if len(recipes) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No recipes found"
            )
        
        return {
            "recipes": [
                {
                    "id": str(recipe["_id"]),
                    "name": recipe["name"],
                    "nameHindi": recipe.get("nameHindi", ""),
                    "nameTamil": recipe.get("nameTamil", ""),
                    "description": recipe["description"],
                    "oilAmount": recipe["oilAmount"],
                    "cuisine": recipe["cuisine"],
                    "difficulty": recipe["difficulty"],
                    "cookingTime": recipe["cookingTime"],
                    "imageUrl": recipe.get("imageUrl"),
                    "viewCount": recipe.get("viewCount", 0)
                }
                for recipe in recipes
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch popular recipes: {str(e)}"
        )
