/**
 * Migration Script: Add Bengali and Telugu multilingual fields
 * 
 * This script updates existing Recipe and Campaign documents to include
 * Bengali (bn) and Telugu (te) translation fields.
 * 
 * Run: node scripts/migrate-multilingual.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB connection URLs
// For Atlas: Use MONGODB_URI with different database names
// For local: Fall back to localhost with auth
const MONGODB_URI = process.env.MONGODB_URI;

let RECIPE_DB_URI, CAMPAIGN_DB_URI;

if (MONGODB_URI && MONGODB_URI.includes('mongodb+srv://')) {
  // MongoDB Atlas - replace database name in connection string
  RECIPE_DB_URI = MONGODB_URI.replace(/\/[^/?]+(\?|$)/, '/bloc-recipes$1');
  CAMPAIGN_DB_URI = MONGODB_URI.replace(/\/[^/?]+(\?|$)/, '/bloc-campaigns$1');
} else if (MONGODB_URI) {
  // Use provided MONGODB_URI (could be local or Atlas)
  RECIPE_DB_URI = MONGODB_URI.replace(/\/[^/?]+(\?|$)/, '/bloc-recipes$1');
  CAMPAIGN_DB_URI = MONGODB_URI.replace(/\/[^/?]+(\?|$)/, '/bloc-campaigns$1');
} else {
  // Local MongoDB with Docker credentials
  RECIPE_DB_URI = 'mongodb://admin:password123@localhost:27017/bloc-recipes?authSource=admin';
  CAMPAIGN_DB_URI = 'mongodb://admin:password123@localhost:27017/bloc-campaigns?authSource=admin';
}

// Sample translations (placeholder - will be replaced with actual translations)
const sampleTranslations = {
  recipes: [
    {
      nameEnglish: 'Grilled Paneer Salad',
      nameBengali: '[AUTO_TRANSLATED] গ্রিল করা পনির সালাদ',
      nameTelugu: '[AUTO_TRANSLATED] గ్రిల్డ్ పన్నీర్ సలాడ్',
      descriptionBengali: '[AUTO_TRANSLATED] কম তেলে তৈরি স্বাস্থ্যকর গ্রিল পনির সালাদ',
      descriptionTelugu: '[AUTO_TRANSLATED] తక్కువ నూనెతో తయారు చేసిన ఆరోగ్యకరమైన గ్రిల్డ్ పన్నీర్ సలాడ్'
    },
    {
      nameEnglish: 'Steamed Momos',
      nameBengali: '[AUTO_TRANSLATED] স্টিমড মোমোস',
      nameTelugu: '[AUTO_TRANSLATED] ఆవిరితో వండిన మోమోస్',
      descriptionBengali: '[AUTO_TRANSLATED] কোনো তেল ছাড়াই বাষ্পে রান্ন করা সুস্বাদু মোমোস',
      descriptionTelugu: '[AUTO_TRANSLATED] నూనె లేకుండా ఆవిరితో వండిన రుచికరమైన మోమోస్'
    },
    {
      nameEnglish: 'Air Fried Chicken',
      nameBengali: '[AUTO_TRANSLATED] এয়ার ফ্রাইড চিকেন',
      nameTelugu: '[AUTO_TRANSLATED] ఎయిర్ ఫ్రైడ్ చికెన్',
      descriptionBengali: '[AUTO_TRANSLATED] সামান্য তেল ব্যবহার করে এয়ার ফ্রায়ারে তৈরি মুচমুচে চিকেন',
      descriptionTelugu: '[AUTO_TRANSLATED] తక్కువ నూనెతో ఎయిర్ ఫ్రైయర్‌లో తయారు చేసిన క్రిస్పీ చికెన్'
    }
  ],
  campaigns: [
    {
      titleEnglish: '30-Day Oil Reduction Challenge',
      titleBengali: '[AUTO_TRANSLATED] ৩০ দিনের তেল হ্রাস চ্যালেঞ্জ',
      titleTelugu: '[AUTO_TRANSLATED] 30 రోజుల నూనె తగ్గింపు ఛాలెంజ్',
      descriptionBengali: '[AUTO_TRANSLATED] ৩০ দিনে আপনার তেলের ব্যবহার ২০% কমান এবং পুরস্কার জিতুন',
      descriptionTelugu: '[AUTO_TRANSLATED] 30 రోజుల్లో మీ నూనె వినియోగాన్ని 20% తగ్గించి బహుమతులు గెలుచుకోండి'
    },
    {
      titleEnglish: 'Healthy Cooking Month',
      titleBengali: '[AUTO_TRANSLATED] স্বাস্থ্যকর রান্নার মাস',
      titleTelugu: '[AUTO_TRANSLATED] ఆరోగ్యకరమైన వంట నెల',
      descriptionBengali: '[AUTO_TRANSLATED] কম তেলের রান্নার পদ্ধতি শিখুন এবং সুস্থ থাকুন',
      descriptionTelugu: '[AUTO_TRANSLATED] తక్కువ నూనె వంట పద్ధతులు నేర్చుకుని ఆరోగ్యంగా ఉండండి'
    }
  ]
};

async function migrateRecipes() {
  console.log('🔄 Starting Recipe migration...');
  
  const connection = await mongoose.createConnection(RECIPE_DB_URI).asPromise();
  const Recipe = connection.model('Recipe', new mongoose.Schema({}, { strict: false }));

  try {
    // Add fields to all recipes (set to null initially for manual translation)
    const result = await Recipe.updateMany(
      {},
      {
        $set: {
          nameBengali: null,
          nameTelugu: null,
          descriptionBengali: null,
          descriptionTelugu: null
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} recipes with new language fields`);

    // Seed sample translations
    for (const sample of sampleTranslations.recipes) {
      await Recipe.updateOne(
        { name: sample.nameEnglish },
        {
          $set: {
            nameBengali: sample.nameBengali,
            nameTelugu: sample.nameTelugu,
            descriptionBengali: sample.descriptionBengali,
            descriptionTelugu: sample.descriptionTelugu
          }
        },
        { upsert: false }
      );
    }

    console.log(`✅ Seeded ${sampleTranslations.recipes.length} sample recipe translations`);
  } catch (error) {
    console.error('❌ Recipe migration error:', error);
  } finally {
    await connection.close();
  }
}

async function migrateCampaigns() {
  console.log('🔄 Starting Campaign migration...');
  
  const connection = await mongoose.createConnection(CAMPAIGN_DB_URI).asPromise();
  const Campaign = connection.model('Campaign', new mongoose.Schema({}, { strict: false }));

  try {
    // Add fields to all campaigns
    const result = await Campaign.updateMany(
      {},
      {
        $set: {
          titleBengali: null,
          titleTelugu: null,
          descriptionBengali: null,
          descriptionTelugu: null
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} campaigns with new language fields`);

    // Seed sample translations
    for (const sample of sampleTranslations.campaigns) {
      await Campaign.updateOne(
        { title: sample.titleEnglish },
        {
          $set: {
            titleBengali: sample.titleBengali,
            titleTelugu: sample.titleTelugu,
            descriptionBengali: sample.descriptionBengali,
            descriptionTelugu: sample.descriptionTelugu
          }
        },
        { upsert: false }
      );
    }

    console.log(`✅ Seeded ${sampleTranslations.campaigns.length} sample campaign translations`);
  } catch (error) {
    console.error('❌ Campaign migration error:', error);
  } finally {
    await connection.close();
  }
}

async function seedSampleRecipes() {
  console.log('🌱 Seeding sample low-oil recipes...');
  
  const connection = await mongoose.createConnection(RECIPE_DB_URI).asPromise();
  const Recipe = connection.model('Recipe', new mongoose.Schema({}, { strict: false }));

  const sampleRecipes = [
    {
      name: 'Grilled Paneer Salad',
      nameHindi: 'ग्रिल्ड पनीर सलाद',
      nameTamil: 'கிரில்டு பன்னீர் சாலட்',
      nameBengali: 'গ্রিল করা পনির সালাদ',
      nameTelugu: 'గ్రిల్డ్ పన్నీర్ సలాడ్',
      description: 'Healthy grilled cottage cheese salad with minimal oil',
      descriptionHindi: 'न्यूनतम तेल के साथ स्वस्थ ग्रिल्ड पनीर सलाद',
      descriptionTamil: 'குறைந்த எண்ணெயுடன் ஆரோக்கியமான கிரில்டு பன்னீர் சாலட்',
      descriptionBengali: 'কম তেলে তৈরি স্বাস্থ্যকর গ্রিল পনির সালাদ',
      descriptionTelugu: 'తక్కువ నూనెతో తయారు చేసిన ఆరోగ్యకరమైన గ్రిల్డ్ పన్నీర్ సలాడ్',
      oilAmount: 8,
      cuisine: 'Indian',
      difficulty: 'easy',
      prepTime: 15,
      cookTime: 10,
      servings: 2,
      ingredients: [
        { name: 'Paneer', amount: '200', unit: 'grams' },
        { name: 'Mixed vegetables', amount: '1', unit: 'cup' },
        { name: 'Olive oil', amount: '8', unit: 'ml' }
      ],
      instructions: [
        'Cut paneer into cubes',
        'Marinate with spices',
        'Grill without additional oil',
        'Toss with fresh vegetables'
      ],
      nutritionInfo: {
        calories: 180,
        protein: 12,
        carbohydrates: 8,
        fat: 10,
        fiber: 3,
        sodium: 200
      },
      tags: ['low-oil', 'healthy', 'vegetarian', 'protein'],
      isLowOil: true,
      ratings: 4.5,
      views: 0
    },
    {
      name: 'Steamed Momos',
      nameHindi: 'स्टीम्ड मोमोस',
      nameTamil: 'நீராவியில் வேகவைத்த மோமோஸ்',
      nameBengali: 'স্টিমড মোমোস',
      nameTelugu: 'ఆవిరితో వండిన మోమోస్',
      description: 'Delicious steamed dumplings without any oil',
      descriptionHindi: 'बिना तेल के स्वादिष्ट स्टीम्ड डम्पलिंग',
      descriptionTamil: 'எண்ணெய் இல்லாமல் சுவையான நீராவியில் வேகவைத்த மோமோஸ்',
      descriptionBengali: 'কোনো তেল ছাড়াই বাষ্পে রান্ন করা সুস্বাদু মোমোস',
      descriptionTelugu: 'నూనె లేకుండా ఆవిరితో వండిన రుచికరమైన మోమోస్',
      oilAmount: 0,
      cuisine: 'Asian',
      difficulty: 'medium',
      prepTime: 30,
      cookTime: 20,
      servings: 4,
      ingredients: [
        { name: 'All-purpose flour', amount: '2', unit: 'cups' },
        { name: 'Vegetables', amount: '1.5', unit: 'cups' },
        { name: 'Spices', amount: '2', unit: 'tbsp' }
      ],
      instructions: [
        'Prepare dough for wrapper',
        'Make vegetable filling',
        'Wrap momos',
        'Steam for 15-20 minutes'
      ],
      nutritionInfo: {
        calories: 150,
        protein: 5,
        carbohydrates: 28,
        fat: 2,
        fiber: 2,
        sodium: 300
      },
      tags: ['zero-oil', 'steamed', 'healthy', 'snack'],
      isLowOil: true,
      ratings: 4.8,
      views: 0
    },
    {
      name: 'Air Fried Chicken',
      nameHindi: 'एयर फ्राइड चिकन',
      nameTamil: 'காற்றில் பொரித்த சிக்கன்',
      nameBengali: 'এয়ার ফ্রাইড চিকেন',
      nameTelugu: 'ఎయిర్ ఫ్రైడ్ చికెన్',
      description: 'Crispy chicken made in air fryer with minimal oil',
      descriptionHindi: 'एयर फ्रायर में न्यूनतम तेल के साथ बनाया गया कुरकुरा चिकन',
      descriptionTamil: 'குறைந்த எண்ணெயுடன் ஏர் ஃப்ரையரில் செய்யப்பட்ட மொறுமொறுப்பான சிக்கன்',
      descriptionBengali: 'সামান্য তেল ব্যবহার করে এয়ার ফ্রায়ারে তৈরি মুচমুচে চিকেন',
      descriptionTelugu: 'తక్కువ నూనెతో ఎయిర్ ఫ్రైయర్‌లో తయారు చేసిన క్రిస్పీ చికెన్',
      oilAmount: 12,
      cuisine: 'Continental',
      difficulty: 'easy',
      prepTime: 10,
      cookTime: 25,
      servings: 3,
      ingredients: [
        { name: 'Chicken breast', amount: '500', unit: 'grams' },
        { name: 'Olive oil', amount: '12', unit: 'ml' },
        { name: 'Spices', amount: '3', unit: 'tbsp' }
      ],
      instructions: [
        'Marinate chicken with spices and oil',
        'Preheat air fryer to 180°C',
        'Air fry for 20-25 minutes',
        'Serve hot with salad'
      ],
      nutritionInfo: {
        calories: 220,
        protein: 28,
        carbohydrates: 3,
        fat: 11,
        fiber: 0,
        sodium: 400
      },
      tags: ['low-oil', 'air-fryer', 'protein', 'non-veg'],
      isLowOil: true,
      ratings: 4.6,
      views: 0
    }
  ];

  try {
    for (const recipe of sampleRecipes) {
      await Recipe.updateOne(
        { name: recipe.name },
        { $set: recipe },
        { upsert: true }
      );
    }
    console.log(`✅ Seeded ${sampleRecipes.length} multilingual recipes`);
  } catch (error) {
    console.error('❌ Seed recipes error:', error);
  } finally {
    await connection.close();
  }
}

async function main() {
  console.log('🚀 Starting Multilingual Migration...\n');
  
  try {
    await migrateRecipes();
    console.log('');
    await migrateCampaigns();
    console.log('');
    await seedSampleRecipes();
    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Review auto-translated content marked with [AUTO_TRANSLATED]');
    console.log('2. Replace with professional translations');
    console.log('3. Update mobile app to use new language options');
    console.log('4. Test language switching in frontend');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run migration
if (require.main === module) {
  main();
}

module.exports = { migrateRecipes, migrateCampaigns, seedSampleRecipes };
