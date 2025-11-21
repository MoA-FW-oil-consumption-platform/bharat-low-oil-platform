"""
Machine Learning Models Manager
Handles loading, training, and prediction for consumption and recommendation models
"""

import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import Ridge, LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict, List, Tuple, Optional
import asyncio

class MLModels:
    """Manager for all ML models"""
    
    def __init__(self):
        self.consumption_model = None
        self.scaler = None
        self.recipe_features = None
        self.model_path = os.getenv("MODEL_PATH", "./models")
        self._loaded = False
        
        # Create model directory if it doesn't exist
        os.makedirs(self.model_path, exist_ok=True)
    
    def is_loaded(self) -> bool:
        """Check if models are loaded"""
        return self._loaded
    
    async def load_models(self):
        """Load pre-trained models from disk"""
        try:
            consumption_model_path = os.path.join(self.model_path, "consumption_model.pkl")
            scaler_path = os.path.join(self.model_path, "scaler.pkl")
            recipe_features_path = os.path.join(self.model_path, "recipe_features.pkl")
            
            if os.path.exists(consumption_model_path):
                self.consumption_model = joblib.load(consumption_model_path)
                print("✅ Consumption prediction model loaded")
            else:
                print("⚠️  Consumption model not found, initializing new model")
                self.consumption_model = Ridge(alpha=1.0)
            
            if os.path.exists(scaler_path):
                self.scaler = joblib.load(scaler_path)
                print("✅ Scaler loaded")
            else:
                print("⚠️  Scaler not found, initializing new scaler")
                self.scaler = StandardScaler()
            
            if os.path.exists(recipe_features_path):
                self.recipe_features = joblib.load(recipe_features_path)
                print("✅ Recipe features loaded")
            else:
                print("⚠️  Recipe features not found, will compute on demand")
                self.recipe_features = None
            
            self._loaded = True
            
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            # Initialize default models
            self.consumption_model = Ridge(alpha=1.0)
            self.scaler = StandardScaler()
            self.recipe_features = None
            self._loaded = True
    
    async def save_models(self):
        """Save trained models to disk"""
        try:
            consumption_model_path = os.path.join(self.model_path, "consumption_model.pkl")
            scaler_path = os.path.join(self.model_path, "scaler.pkl")
            recipe_features_path = os.path.join(self.model_path, "recipe_features.pkl")
            
            joblib.dump(self.consumption_model, consumption_model_path)
            joblib.dump(self.scaler, scaler_path)
            if self.recipe_features is not None:
                joblib.dump(self.recipe_features, recipe_features_path)
            
            print("✅ Models saved successfully")
            
        except Exception as e:
            print(f"❌ Error saving models: {e}")
    
    def prepare_consumption_features(self, oil_logs: List[Dict], user_profile: Dict) -> pd.DataFrame:
        """
        Prepare features for consumption prediction
        Features: day_of_week, day_of_month, month, family_size, age, is_weekend, 
                 previous_day_consumption, 7_day_avg, 30_day_avg
        """
        df = pd.DataFrame(oil_logs)
        
        if len(df) == 0:
            return pd.DataFrame()
        
        # Convert date strings to datetime
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Extract time features
        df['day_of_week'] = df['date'].dt.dayofweek
        df['day_of_month'] = df['date'].dt.day
        df['month'] = df['date'].dt.month
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        
        # User features
        df['family_size'] = user_profile.get('familySize', 1)
        df['age'] = user_profile.get('age', 30)
        
        # Lagging features
        df['prev_day_consumption'] = df['amount'].shift(1).fillna(df['amount'].mean())
        df['7_day_avg'] = df['amount'].rolling(window=7, min_periods=1).mean()
        df['30_day_avg'] = df['amount'].rolling(window=30, min_periods=1).mean()
        
        return df
    
    async def train_consumption_model(self, training_data: List[Dict], user_profiles: Dict) -> Dict[str, float]:
        """
        Train consumption prediction model
        Returns metrics: MAE, RMSE, R2
        """
        all_features = []
        all_targets = []
        
        # Prepare features for all users
        for user_id, logs in training_data.items():
            user_profile = user_profiles.get(user_id, {})
            features_df = self.prepare_consumption_features(logs, user_profile)
            
            if len(features_df) > 0:
                feature_cols = ['day_of_week', 'day_of_month', 'month', 'family_size', 
                               'age', 'is_weekend', 'prev_day_consumption', '7_day_avg', '30_day_avg']
                
                X = features_df[feature_cols].values
                y = features_df['amount'].values
                
                all_features.append(X)
                all_targets.append(y)
        
        if len(all_features) == 0:
            raise ValueError("No training data available")
        
        # Combine all data
        X_train = np.vstack(all_features)
        y_train = np.concatenate(all_targets)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Train model
        self.consumption_model.fit(X_train_scaled, y_train)
        
        # Calculate metrics
        y_pred = self.consumption_model.predict(X_train_scaled)
        metrics = {
            "mae": float(mean_absolute_error(y_train, y_pred)),
            "rmse": float(np.sqrt(mean_squared_error(y_train, y_pred))),
            "r2": float(r2_score(y_train, y_pred))
        }
        
        # Save models
        await self.save_models()
        
        return metrics
    
    async def predict_consumption(self, user_id: str, oil_logs: List[Dict], 
                                  user_profile: Dict, days_ahead: int = 30) -> Tuple[List[Dict], float]:
        """
        Predict future oil consumption for a user
        Returns: (predictions, confidence)
        """
        if len(oil_logs) < 7:
            # Not enough data for prediction, return average-based prediction
            avg_consumption = sum(log['amount'] for log in oil_logs) / len(oil_logs) if oil_logs else 50.0
            predictions = []
            last_date = datetime.fromisoformat(oil_logs[-1]['date'].replace('Z', '+00:00')) if oil_logs else datetime.now()
            
            for i in range(1, days_ahead + 1):
                pred_date = last_date + timedelta(days=i)
                predictions.append({
                    "date": pred_date.isoformat(),
                    "predicted_amount": round(avg_consumption, 2)
                })
            
            return predictions, 0.3  # Low confidence
        
        # Prepare features
        features_df = self.prepare_consumption_features(oil_logs, user_profile)
        
        if len(features_df) == 0:
            raise ValueError("Unable to prepare features")
        
        # Get last known values
        last_row = features_df.iloc[-1]
        last_date = last_row['date']
        
        predictions = []
        
        # Predict future days
        for i in range(1, days_ahead + 1):
            pred_date = last_date + timedelta(days=i)
            
            # Create feature vector for prediction
            features = {
                'day_of_week': pred_date.dayofweek,
                'day_of_month': pred_date.day,
                'month': pred_date.month,
                'family_size': user_profile.get('familySize', 1),
                'age': user_profile.get('age', 30),
                'is_weekend': 1 if pred_date.dayofweek in [5, 6] else 0,
                'prev_day_consumption': last_row['amount'] if i == 1 else predictions[-1]['predicted_amount'],
                '7_day_avg': last_row['7_day_avg'],
                '30_day_avg': last_row['30_day_avg']
            }
            
            X = np.array([[features[col] for col in ['day_of_week', 'day_of_month', 'month', 
                                                      'family_size', 'age', 'is_weekend', 
                                                      'prev_day_consumption', '7_day_avg', '30_day_avg']]])
            
            X_scaled = self.scaler.transform(X)
            predicted_amount = self.consumption_model.predict(X_scaled)[0]
            
            predictions.append({
                "date": pred_date.isoformat(),
                "predicted_amount": round(max(0, predicted_amount), 2)  # Ensure non-negative
            })
        
        # Calculate confidence based on recent prediction accuracy
        confidence = min(0.9, 0.5 + (len(oil_logs) / 100))  # Increases with more data
        
        return predictions, confidence
    
    def calculate_recipe_similarity(self, user_preferences: Dict, recipe: Dict) -> float:
        """
        Calculate similarity score between user preferences and recipe
        Uses content-based filtering with weighted features
        """
        score = 0.0
        
        # Oil amount preference (lower is better)
        oil_amount = recipe.get('oilAmount', 50)
        if oil_amount < 20:
            score += 30
        elif oil_amount < 40:
            score += 20
        elif oil_amount < 60:
            score += 10
        
        # Dietary habit match
        user_diet = user_preferences.get('dietaryHabit', 'vegetarian')
        recipe_tags = recipe.get('tags', [])
        
        if user_diet in ['vegetarian', 'vegan'] and 'vegetarian' in recipe_tags:
            score += 25
        elif user_diet == 'vegan' and 'vegan' in recipe_tags:
            score += 30
        
        # Cuisine preference (if provided)
        preferred_cuisines = user_preferences.get('cuisinePreference', [])
        if recipe.get('cuisine') in preferred_cuisines:
            score += 20
        
        # Health tags
        health_conditions = user_preferences.get('healthConditions', [])
        if 'diabetes' in health_conditions and 'low-sugar' in recipe_tags:
            score += 15
        if 'heart-disease' in health_conditions and 'heart-healthy' in recipe_tags:
            score += 15
        if 'low-calorie' in recipe_tags:
            score += 10
        
        # Difficulty preference (easier recipes get slight boost)
        if recipe.get('difficulty') == 'easy':
            score += 5
        
        return score
    
    async def recommend_recipes(self, user_id: str, user_profile: Dict, 
                               recipes: List[Dict], limit: int = 10) -> List[Dict]:
        """
        Recommend recipes based on user profile and preferences
        Uses content-based filtering
        """
        scored_recipes = []
        
        for recipe in recipes:
            similarity_score = self.calculate_recipe_similarity(user_profile, recipe)
            recipe['score'] = similarity_score
            scored_recipes.append(recipe)
        
        # Sort by score and return top N
        scored_recipes.sort(key=lambda x: x['score'], reverse=True)
        
        return scored_recipes[:limit]
