const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { generateQuestions } = require('./utils/gemini');

// Load environment variables
dotenv.config();

const testServices = async () => {
  console.log('--- Starting Integration Connection Test ---');

  // 1. Test MongoDB Connection
  console.log(`Connecting to MongoDB at: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-interview-db'}...`);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-interview-db', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connection Successful! Host: ${conn.connection.host}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log('Please ensure MongoDB is running on your machine (e.g. net start MongoDB).');
  }

  // 2. Test Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(`Checking GEMINI_API_KEY environment variable...`);
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log(`⚠️  GEMINI_API_KEY is not configured or is a placeholder. API requests will fallback to mock data.`);
  } else {
    console.log(`Found GEMINI_API_KEY starting with: ${apiKey.substring(0, 6)}...`);
    console.log('Sending test prompt to Google Gemini API (JavaScript, Easy level)...');
    try {
      const start = Date.now();
      const questions = await generateQuestions('JavaScript', 'Easy');
      const duration = ((Date.now() - start) / 1000).toFixed(2);
      console.log(`✅ Gemini API Test Successful (took ${duration}s)!`);
      console.log('Generated questions:');
      questions.forEach((q, idx) => console.log(`  ${idx + 1}. ${q.questionText}`));
    } catch (error) {
      console.error(`❌ Gemini API Call Failed: ${error.message}`);
    }
  }

  // 3. Test pdf-parse loading
  console.log('Testing pdf-parse module...');
  try {
    const pdfParse = require('pdf-parse');
    const mockPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
    await pdfParse(mockPdfBuffer).catch(() => {}); // Verify it calls without loading errors
    console.log('✅ pdf-parse loaded successfully!');
  } catch (error) {
    console.error(`❌ pdf-parse verification failed: ${error.message}`);
  }

  console.log('--- Test Completed ---');
  process.exit(0);
};

testServices();
