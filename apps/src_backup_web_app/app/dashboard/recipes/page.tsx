'use client';

import { useState } from 'react';
import { Search, Filter, ChefHat } from 'lucide-react';
import Image from 'next/image';
import { useRecipeRecommendations } from '@/hooks/api/useAI';

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [maxOil, setMaxOil] = useState(30);

  const { data: recipes = [], isLoading } = useRecipeRecommendations({
    cuisine: selectedCuisine === 'all' ? undefined : selectedCuisine,
    maxOilAmount: maxOil,
  });

  const filteredRecipes = recipes.filter((recipe: any) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Low-Oil Recipes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Discover delicious recipes with minimal oil
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Cuisine Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Cuisines</option>
                <option value="Indian">Indian</option>
                <option value="Continental">Continental</option>
                <option value="Asian">Asian</option>
              </select>
            </div>

            {/* Max Oil Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Oil: {maxOil}ml
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={maxOil}
                onChange={(e) => setMaxOil(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe: any) => (
              <RecipeCard key={recipe._id || recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recipes found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🍽️
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.name}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>{recipe.cuisine}</span>
          <span className="font-medium text-green-600">{recipe.oilAmount}ml oil</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>⏱️ {recipe.cookTime} min</span>
          <span>👥 {recipe.servings} servings</span>
        </div>
        <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          View Recipe
        </button>
      </div>
    </div>
  );
}
