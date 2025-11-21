"""
MongoDB database connection for AI service
"""

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING
import os

client = None
database = None

async def connect_db():
    """Connect to MongoDB"""
    global client, database
    
    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/bharat-low-oil")
    db_name = os.getenv("MONGODB_DB_NAME", "bharat-low-oil")
    
    client = AsyncIOMotorClient(mongodb_uri)
    database = client[db_name]
    
    # Create indexes
    await database.oil_logs.create_index([("userId", ASCENDING), ("date", DESCENDING)])
    await database.users.create_index("userId", unique=True)
    await database.recipes.create_index([("tags", ASCENDING)])
    
    print("✅ Connected to MongoDB")

async def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("✅ MongoDB connection closed")

def get_database():
    """Get database instance"""
    return database
