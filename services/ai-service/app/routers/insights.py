"""
Insights Router
Provides AI-driven insights and analytics
"""

from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
import statistics

from app.schemas import InsightRequest, InsightResponse
from app.database import get_database

router = APIRouter()

ICMR_MONTHLY_LIMIT = 1000  # ml per person per month

@router.post("/user", response_model=InsightResponse)
async def get_user_insights(request: InsightRequest):
    """
    Get AI-driven insights for a user's consumption patterns
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
        
        family_size = user.get("familySize", 1)
        
        # Calculate date range based on period
        end_date = datetime.now()
        if request.period == "week":
            start_date = end_date - timedelta(days=7)
            days_in_period = 7
        elif request.period == "month":
            start_date = end_date - timedelta(days=30)
            days_in_period = 30
        elif request.period == "quarter":
            start_date = end_date - timedelta(days=90)
            days_in_period = 90
        else:  # year
            start_date = end_date - timedelta(days=365)
            days_in_period = 365
        
        # Fetch oil logs for period
        oil_logs = await db.oil_logs.find({
            "userId": request.userId,
            "date": {"$gte": start_date, "$lte": end_date}
        }).sort("date", 1).to_list(length=None)
        
        if len(oil_logs) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No consumption data found for the {request.period}"
            )
        
        # Calculate total consumption
        total_consumption = sum(log["amount"] for log in oil_logs)
        average_daily = total_consumption / days_in_period
        
        # Calculate ICMR comparison
        icmr_daily_limit = (ICMR_MONTHLY_LIMIT / 30) * family_size
        comparison_percentage = ((average_daily - icmr_daily_limit) / icmr_daily_limit) * 100
        
        # Determine health status
        if comparison_percentage > 60:
            health_status = "high_risk"
        elif comparison_percentage > 20:
            health_status = "moderate"
        else:
            health_status = "healthy"
        
        # Calculate trend
        if len(oil_logs) >= 14:
            mid_point = len(oil_logs) // 2
            first_half_avg = sum(log["amount"] for log in oil_logs[:mid_point]) / mid_point
            second_half_avg = sum(log["amount"] for log in oil_logs[mid_point:]) / (len(oil_logs) - mid_point)
            
            change_percentage = ((second_half_avg - first_half_avg) / first_half_avg) * 100
            
            if change_percentage > 10:
                trend = "increasing"
            elif change_percentage < -10:
                trend = "decreasing"
            else:
                trend = "stable"
        else:
            trend = "stable"
        
        # Find peak consumption days
        daily_consumption = {}
        for log in oil_logs:
            date_str = log["date"].strftime("%Y-%m-%d") if hasattr(log["date"], "strftime") else str(log["date"])[:10]
            if date_str not in daily_consumption:
                daily_consumption[date_str] = 0
            daily_consumption[date_str] += log["amount"]
        
        peak_days = sorted(daily_consumption.items(), key=lambda x: x[1], reverse=True)[:3]
        peak_consumption_days = [f"{day[0]} ({day[1]:.0f}ml)" for day in peak_days]
        
        # Generate recommendations
        recommendations = []
        
        if health_status == "high_risk":
            recommendations.append("🚨 Your oil consumption is significantly above recommended levels")
            recommendations.append("💡 Consider switching to cooking methods that use less oil (steaming, grilling, air frying)")
            recommendations.append("📚 Explore our low-oil recipe collection for healthier alternatives")
        elif health_status == "moderate":
            recommendations.append("⚠️ Your oil consumption is slightly elevated")
            recommendations.append("💡 Try reducing oil by 20% in your current recipes")
            recommendations.append("🥗 Add more salads and raw vegetables to your diet")
        else:
            recommendations.append("✅ Excellent! You're maintaining healthy oil consumption")
            recommendations.append("💡 Keep exploring new low-oil recipes to maintain variety")
        
        if trend == "increasing":
            recommendations.append("📈 Your consumption has been increasing. Review your cooking habits.")
        elif trend == "decreasing":
            recommendations.append("📉 Great progress! You're successfully reducing oil consumption.")
        
        # Fetch user achievements
        rewards = await db.rewards.find_one({"userId": request.userId})
        achievements = []
        
        if rewards:
            for badge in rewards.get("badges", []):
                achievements.append(f"🏆 {badge['name']}: {badge['description']}")
            
            if rewards.get("currentStreak", 0) >= 7:
                achievements.append(f"🔥 {rewards['currentStreak']}-day logging streak!")
        
        return InsightResponse(
            userId=request.userId,
            period=request.period,
            total_consumption=round(total_consumption, 2),
            average_daily=round(average_daily, 2),
            trend=trend,
            health_status=health_status,
            comparison_to_average=round(comparison_percentage, 2),
            peak_consumption_days=peak_consumption_days,
            recommendations=recommendations,
            achievements=achievements,
            generated_at=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate insights: {str(e)}"
        )

@router.get("/national")
async def get_national_insights():
    """
    Get national-level consumption insights
    Admin endpoint
    """
    try:
        db = get_database()
        
        # Get total users
        total_users = await db.users.count_documents({})
        
        # Get consumption data from last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        pipeline = [
            {"$match": {"date": {"$gte": thirty_days_ago}}},
            {"$group": {
                "_id": None,
                "total_consumption": {"$sum": "$amount"},
                "avg_consumption": {"$avg": "$amount"},
                "log_count": {"$sum": 1}
            }}
        ]
        
        result = await db.oil_logs.aggregate(pipeline).to_list(length=1)
        
        if not result:
            return {
                "message": "No consumption data available",
                "total_users": total_users
            }
        
        stats = result[0]
        
        # Get regional breakdown
        regional_pipeline = [
            {"$match": {"date": {"$gte": thirty_days_ago}}},
            {"$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "userId",
                "as": "user"
            }},
            {"$unwind": "$user"},
            {"$group": {
                "_id": "$user.region",
                "total_consumption": {"$sum": "$amount"},
                "user_count": {"$addToSet": "$userId"}
            }},
            {"$project": {
                "region": "$_id",
                "total_consumption": 1,
                "user_count": {"$size": "$user_count"},
                "avg_per_user": {"$divide": ["$total_consumption", {"$size": "$user_count"}]}
            }},
            {"$sort": {"total_consumption": -1}}
        ]
        
        regional_data = await db.oil_logs.aggregate(regional_pipeline).to_list(length=None)
        
        return {
            "total_users": total_users,
            "last_30_days": {
                "total_consumption_liters": round(stats["total_consumption"] / 1000, 2),
                "average_per_log_ml": round(stats["avg_consumption"], 2),
                "total_logs": stats["log_count"]
            },
            "regional_breakdown": [
                {
                    "region": region["region"],
                    "total_consumption_ml": round(region["total_consumption"], 2),
                    "active_users": region["user_count"],
                    "avg_per_user_ml": round(region["avg_per_user"], 2)
                }
                for region in regional_data
            ],
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate national insights: {str(e)}"
        )
