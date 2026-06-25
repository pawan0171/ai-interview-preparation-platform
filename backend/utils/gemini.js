const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getMockQuestions, evaluateMockAnswers } = require('./mockData');

// Check if Gemini API Key is configured and not a placeholder
const isGeminiConfigured = () => {
  const key = process.env.GEMINI_API_KEY;
  return key && key !== 'your_gemini_api_key_here' && key.trim() !== '';
};

// Helper to clean JSON string from Markdown code block backticks
const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  // Strip starting ```json or ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '');
  }
  // Strip ending ```
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```$/, '');
  }
  return cleaned.trim();
};

/**
 * Generate 5 questions using Gemini or mock fallback
 */
const generateQuestions = async (category, difficulty) => {
  if (!isGeminiConfigured()) {
    console.log(`[Gemini API] API Key not configured. Using mock questions for ${category} (${difficulty}).`);
    return getMockQuestions(category, difficulty);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-flash as the standard fast and low-latency model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Generate exactly 5 technical interview questions for the category: "${category}" and difficulty level: "${difficulty}".
Each question should be relevant, practical, and test the candidate's understanding of the concepts.
Return the output strictly in the following JSON format:
{
  "questions": [
    {
      "questionText": "Question description"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanJsonResponse(responseText);
    const parsedData = JSON.parse(cleanedText);

    if (parsedData && Array.isArray(parsedData.questions)) {
      return parsedData.questions;
    }
    throw new Error('Invalid JSON structure returned by Gemini');
  } catch (error) {
    console.error(`[Gemini API Error] Failed to generate questions: ${error.message}. Falling back to mock data.`);
    return getMockQuestions(category, difficulty);
  }
};

/**
 * Evaluate interview questions and answers using Gemini or mock fallback
 */
const evaluateAnswers = async (category, difficulty, questionsAndAnswers) => {
  if (!isGeminiConfigured()) {
    console.log(`[Gemini API] API Key not configured. Evaluating using mock evaluator for ${category} (${difficulty}).`);
    return evaluateMockAnswers(category, difficulty, questionsAndAnswers);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Evaluate the following technical interview answers for category: "${category}" and difficulty: "${difficulty}".
Compare the candidate's answer with the expected standard and provide a detailed assessment.

Here is the list of questions and the candidate's answers:
${JSON.stringify(questionsAndAnswers, null, 2)}

For each question, evaluate the candidate's answer and provide:
1. "score": A score from 0 to 10 based on accuracy and depth. If the answer is blank or unrelated, give a low score (e.g. 0-2).
2. "feedback": A brief explanation of what was good, what was missing, and how to improve.
3. "modelAnswer": A comprehensive and accurate model answer that a senior professional would give.

Also, calculate/provide overall metrics:
1. "overallScore": An overall score from 0 to 100 representing the user's performance.
2. "summary": A short general evaluation summary (2-3 sentences).
3. "strengths": An array of 2-3 specific areas where the candidate demonstrated good knowledge.
4. "weaknesses": An array of 2-3 specific areas where the candidate needs improvement.

Return the evaluation results strictly in the following JSON format:
{
  "overallScore": 85,
  "summary": "The candidate has a solid understanding of basic concepts...",
  "strengths": ["Clear explanation of closures", "Good use of examples"],
  "weaknesses": ["Needs deeper knowledge of asynchronous event loop mechanics"],
  "evaluations": [
    {
      "questionText": "...",
      "userAnswer": "...",
      "score": 8,
      "feedback": "...",
      "modelAnswer": "..."
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanJsonResponse(responseText);
    const parsedData = JSON.parse(cleanedText);

    if (
      parsedData &&
      typeof parsedData.overallScore === 'number' &&
      Array.isArray(parsedData.evaluations)
    ) {
      return parsedData;
    }
    throw new Error('Invalid JSON structure returned by Gemini Evaluation');
  } catch (error) {
    console.error(`[Gemini API Error] Failed to evaluate answers: ${error.message}. Falling back to mock evaluator.`);
    return evaluateMockAnswers(category, difficulty, questionsAndAnswers);
  }
};

/**
 * Analyze a resume text for ATS metrics using Gemini or mock fallback
 */
const analyzeResume = async (resumeText) => {
  if (!isGeminiConfigured()) {
    console.log('[Gemini API] API Key not configured. Analyzing resume using mock analyzer.');
    return analyzeMockResume(resumeText);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Analyze the following resume text and assess its technical quality, keyword density, and formatting standard for a generic modern software development role.
Calculate an ATS compatibility score from 0 to 100.
Extract the technical and soft skills present in the resume.
Identify key industry skills that are missing in the resume for standard modern engineering roles.
Provide concrete, actionable improvement suggestions.
Recommend top technologies, languages, or tools the candidate should learn next.

Here is the resume text:
${resumeText}

Return the analysis strictly in the following JSON format:
{
  "atsScore": 75,
  "extractedSkills": ["React", "JavaScript", "HTML", "CSS"],
  "missingSkills": ["Node.js", "Express", "MongoDB", "TypeScript", "Docker"],
  "suggestions": [
    "Add detailed bullet points describing backend scaling experiences.",
    "Quantify your metrics e.g., 'Improved load times by 20%'.",
    "List databases and system architectures you worked with."
  ],
  "recommendedTech": ["Docker", "Kubernetes", "Next.js"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanJsonResponse(responseText);
    const parsedData = JSON.parse(cleanedText);

    if (
      parsedData &&
      typeof parsedData.atsScore === 'number' &&
      Array.isArray(parsedData.extractedSkills) &&
      Array.isArray(parsedData.missingSkills) &&
      Array.isArray(parsedData.suggestions) &&
      Array.isArray(parsedData.recommendedTech)
    ) {
      return parsedData;
    }
    throw new Error('Invalid JSON structure returned by Gemini Resume Analysis');
  } catch (error) {
    console.error(`[Gemini API Error] Failed to analyze resume: ${error.message}. Falling back to mock analyzer.`);
    return analyzeMockResume(resumeText);
  }
};

/**
 * Generate a single Daily Challenge question using Gemini or mock fallback
 */
const generateDailyChallenge = async (category) => {
  if (!isGeminiConfigured()) {
    console.log(`[Gemini API] API Key not configured. Using mock daily challenge for ${category}.`);
    return getMockDailyChallenge(category);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Generate exactly ONE technical interview question for the category: "${category}".
The question should test deep conceptual understanding, practical problem-solving, or scenario-based behaviors.
Return the output strictly in the following JSON format:
{
  "questionText": "Detailed question text"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanJsonResponse(responseText);
    const parsedData = JSON.parse(cleanedText);

    if (parsedData && parsedData.questionText) {
      return parsedData.questionText;
    }
    throw new Error('Invalid JSON structure returned by Gemini for Daily Challenge');
  } catch (error) {
    console.error(`[Gemini API Error] Failed to generate daily challenge: ${error.message}. Falling back to mock.`);
    return getMockDailyChallenge(category);
  }
};

/**
 * Evaluate a single Daily Challenge answer using Gemini or mock fallback
 */
const evaluateChallengeAnswer = async (questionText, userAnswer) => {
  if (!isGeminiConfigured()) {
    console.log(`[Gemini API] API Key not configured. Evaluating challenge answer using mock evaluator.`);
    return evaluateMockChallengeAnswer(questionText, userAnswer);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Evaluate the candidate's answer for the following technical question.
Question: "${questionText}"
Candidate's Answer: "${userAnswer}"

Provide:
1. "score": A score from 0 to 10 based on accuracy and technical depth.
2. "feedback": Constructive feedback on what was good, what was missing, and how to improve.
3. "modelAnswer": A comprehensive and accurate model answer that a senior professional would give.

Return the evaluation strictly in the following JSON format:
{
  "score": 8,
  "feedback": "Your explanation of closures is accurate...",
  "modelAnswer": "A closure is the combination of a function bundled together..."
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanJsonResponse(responseText);
    const parsedData = JSON.parse(cleanedText);

    if (
      parsedData &&
      typeof parsedData.score === 'number' &&
      parsedData.feedback &&
      parsedData.modelAnswer
    ) {
      return parsedData;
    }
    throw new Error('Invalid JSON structure returned by Gemini for challenge evaluation');
  } catch (error) {
    console.error(`[Gemini API Error] Failed to evaluate challenge answer: ${error.message}. Falling back to mock.`);
    return evaluateMockChallengeAnswer(questionText, userAnswer);
  }
};

/**
 * Generate a personalized study roadmap using Gemini or mock fallback
 */
const generateRoadmap = async (weakTopics, missingSkills) => {
  if (!isGeminiConfigured()) {
    console.log('[Gemini API] API Key not configured. Generating study roadmap using mock compiler.');
    return generateMockRoadmap(weakTopics, missingSkills);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Compile a personalized 8-week technical study roadmap for a software developer based on:
1. Weak Topics identified from mock interviews: ${JSON.stringify(weakTopics)}
2. Missing Skills identified from their resume: ${JSON.stringify(missingSkills)}

Structure the roadmap into exactly 4 sequential study phases. Each phase should cover 2 weeks.
For each phase, specify:
- "phaseName": The title of the phase.
- "description": A summary of the phase goals.
- "duration": The duration (e.g. "Weeks 1-2").
- "topics": An array of 3-4 specific concepts to study.
- "resources": An array of 2-3 recommended sites, books, or documentation sites.

Also recommend a "targetRole" matching the skill profile (e.g. "Full-Stack Developer", "Backend Engineer", etc.).

Return the roadmap strictly in the following JSON format:
{
  "targetRole": "Full-Stack Developer",
  "weakTopicsAnalyzed": ["Node.js", "Docker"],
  "phases": [
    {
      "phaseName": "Phase 1: ...",
      "description": "...",
      "duration": "Weeks 1-2",
      "topics": ["Topic A", "Topic B"],
      "resources": ["Resource A", "Resource B"]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanJsonResponse(responseText);
    const parsedData = JSON.parse(cleanedText);

    if (
      parsedData &&
      parsedData.targetRole &&
      Array.isArray(parsedData.phases) &&
      parsedData.phases.length > 0
    ) {
      return parsedData;
    }
    throw new Error('Invalid JSON structure returned by Gemini for Roadmap compilation');
  } catch (error) {
    console.error(`[Gemini API Error] Failed to generate study roadmap: ${error.message}. Falling back to mock compiler.`);
    return generateMockRoadmap(weakTopics, missingSkills);
  }
};

/**
 * Generate 5 technical questions tailored for a specific company and role using Gemini
 */
const generateCompanyQuestions = async (company, role, difficulty) => {
  if (!isGeminiConfigured()) {
    console.log(`[Gemini API] API Key not configured. Using mock company questions for ${company} (${role}).`);
    return getMockCompanyQuestions(company, role, difficulty);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Generate exactly 5 technical interview questions tailored specifically for the company "${company}" in the role of "${role}" with a difficulty level of "${difficulty}".
The questions should match the historical interview style of that company (e.g. Google focuses on DSA/Algorithms, Amazon on Leadership Principles + System Design, Microsoft on API layouts & systems, Meta on fast coding & optimizations, Netflix on concurrency & scale).
Return the output strictly in the following JSON format:
{
  "questions": [
    {
      "questionText": "Detailed question text"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanJsonResponse(responseText);
    const parsedData = JSON.parse(cleanedText);

    if (parsedData && Array.isArray(parsedData.questions)) {
      return parsedData.questions;
    }
    throw new Error('Invalid JSON structure returned by Gemini for company interview questions');
  } catch (error) {
    console.error(`[Gemini API Error] Failed to generate company questions: ${error.message}. Falling back to mock.`);
    return getMockCompanyQuestions(company, role, difficulty);
  }
};

const {
  analyzeMockResume,
  generateMockRoadmap,
  getMockDailyChallenge,
  evaluateMockChallengeAnswer,
  getMockCompanyQuestions
} = require('./mockData');

module.exports = {
  generateQuestions,
  evaluateAnswers,
  analyzeResume,
  generateDailyChallenge,
  evaluateChallengeAnswer,
  generateRoadmap,
  generateCompanyQuestions
};
