# PrepAI - AI Interview Preparation & Career Accelerator Platform

PrepAI is a high-fidelity, production-ready mock assessment and career acceleration platform built on the **MERN (MongoDB, Express, React, Node.js) Stack**, integrated with the **Google Gemini 1.5 API**, and styled with a modern glassmorphic theme.

It provides developers with realistic, target-specific whiteboard, conceptual, and behavioral mock interviews, parses and grades resumes for ATS compatibility, tracks learning analytics, and compiles personalized study roadmaps.

---

## 🌟 Key Features

### 🎙️ 1. Interactive Assessment live workspace
*   **Speech-to-Text (STT) Transcription**: Dictate answers verbally using the Web Speech Recognition API.
*   **Text-to-Speech (TTS) Read-Aloud**: Listen to questions read aloud with natural synthesizer pacing.
*   **Monospaced Coding Editor Canvas**: Toggle conceptual typing into a code workspace supporting:
    *   Syntax templates for **JavaScript, Python, C++, and Java**.
    *   Interactive line numbers and native Tab indent captures.
    *   **In-Browser Compiler**: Mock terminal execution outputs running in safe, isolated client sandboxes.
*   **AI Evaluation Engine**: Gemini evaluates submissions to calculate scores (0-10), highlight technical strengths/weaknesses, and write senior-level model replies.

### 🏢 2. Company-wise Whiteboard Assessments
*   Configure custom test profiles targeting hiring models of **Google, Amazon, Microsoft, Meta, and Netflix**.
*   Select targeted engineering roles: Software Engineer, Frontend Developer, Backend Developer, Systems Architect.

### 📊 3. Gamified Growth Dashboard & Analytics
*   **Custom SVG Area & Bar Charts**: Visualize your performance averages across subjects and track score trends over time.
*   **Gamified Levels & Streaks**: Earn XP for every mock attempt or quest, level up, and maintain daily habit streaks.
*   **Global Community Leaderboard**: Rank among global candidates on levels and active streak standings.
*   **AI Study Roadmap Builder**: Triggers Gemini to analyze your performance logs and compile an 8-week structured study syllabus.

### 📄 4. ATS Resume Checker
*   Drag-and-drop PDF resume uploader.
*   Extracts skill tags, lists missing critical technologies, provides detailed textual resume corrections, and calculates an ATS compatibility score.

### 🔔 5. Platform Administration & Notifications
*   **Admin Panel Dashboard**: Access aggregated stats (total active users, sessions, global averages) and instantly manage user administrative privileges.
*   **Alert Notifications Dropdown**: Live bell alerts tracking level-ups, streak milestones, and achievements.
*   **Smooth Theme Switcher**: Toggle between beautiful dark glassmorphism and clear light glassmorphic backgrounds.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS v4, Lucide Icons, Axios.
*   **Backend**: Node.js, Express.js, JWT, Bcrypt.js, Multer.
*   **Database**: MongoDB Atlas, Mongoose ODM.
*   **AI Engine**: Google Generative AI (Gemini 1.5 Flash).
*   **PDF Parser**: pdf-parse.

---

## 📂 Project Architecture

```
├── backend/
│   ├── config/          # Database connection setup
│   ├── controllers/     # MVC controller logic
│   ├── middleware/      # JWT guards, upload filters, admin checks
│   ├── models/          # Mongoose collections
│   ├── routes/          # RESTful endpoints routing
│   ├── utils/           # Gemini core prompts and local fallback datasets
│   └── server.js        # Entry-point initialization
├── frontend/
│   ├── src/
│   │   ├── components/  # User interfaces & workspaces
│   │   ├── context/     # Auth global states
│   │   ├── utils/       # Axios client-side configurations
│   │   ├── index.css    # Tailwind styling and light mode classes
│   │   └── App.jsx      # Navigation routers
└── .gitignore           # Excludes heavy dependencies and private API keys
```

---

## 🚀 Local Installation & Setup

### Prerequisites
*   Node.js (v16.0.0 or higher)
*   MongoDB running locally or a MongoDB Atlas URI connection string

### Step 1: Clone and Configure Environment

Initialize your project and configure environment variables in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-interview-db
JWT_SECRET=your_jwt_signing_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```
*(If you leave `GEMINI_API_KEY` blank or set to a placeholder, the server automatically degrades to built-in mock fallback models so you can test all screens instantly).*

### Step 2: Install and Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
The server will boot up in development mode on `http://localhost:5000`.

### Step 3: Install and Run the Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```
The client will start on `http://localhost:5173`. Open it in your browser to begin practicing!

---

## 🛡️ Robust Security & Fail-Safes
1.  **Client-Side Sandboxing**: Runs JavaScript scripts inside safe browser evaluation boundaries and uses mock environments for compiled languages (Python, Java, C++), preventing server execution of untrusted scripts.
2.  **Graceful Degrades**: Automatically manages failures. If the Gemini API is blocked or limits are reached, the system defaults to keywords scanning and local mock templates to ensure zero downtime.
