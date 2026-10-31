const mockQuestions = {
  JavaScript: {
    Easy: [
      { questionText: "What is the difference between 'let', 'const', and 'var'?" },
      { questionText: "What is the difference between double equals '==' and triple equals '===' in JavaScript?" },
      { questionText: "Explain the concept of 'hoisting' in JavaScript." },
      { questionText: "What are the basic data types in JavaScript?" },
      { questionText: "What is the difference between null and undefined?" }
    ],
    Medium: [
      { questionText: "Explain closures in JavaScript and describe a practical use case for them." },
      { questionText: "Explain how the JavaScript Event Loop works and how it handles asynchronous code." },
      { questionText: "What is the difference between call(), apply(), and bind() methods?" },
      { questionText: "What is a Promise in JavaScript? How does it help handle callback hell?" },
      { questionText: "Explain prototype-based inheritance and the prototype chain in JavaScript." }
    ],
    Hard: [
      { questionText: "How would you write a custom polyfill for Promise.all()?" },
      { questionText: "Explain the difference between Microtasks and Macrotasks in the JavaScript execution cycle." },
      { questionText: "Describe the differences between Map/Set and WeakMap/WeakSet, and explain memory leak implications." },
      { questionText: "What is currying in JavaScript? Write a function that curries a function of arbitrary arity." },
      { questionText: "Implement a custom debounce function and explain how it differs from a throttle function." }
    ]
  },
  React: {
    Easy: [
      { questionText: "What is React, and what is the difference between the Virtual DOM and Real DOM?" },
      { questionText: "What are React functional components and class components? Which one is preferred today?" },
      { questionText: "What are props in React and how do they differ from state?" },
      { questionText: "Explain the use of the useState hook with a simple example." },
      { questionText: "What is the significance of 'keys' in React lists?" }
    ],
    Medium: [
      { questionText: "Explain the React Component Lifecycle. How do useEffect hooks replace lifecycle methods in functional components?" },
      { questionText: "What is the Context API in React, and when should it be used instead of passing props?" },
      { questionText: "Explain React.memo, useMemo, and useCallback. How do they optimize application performance?" },
      { questionText: "What are controlled and uncontrolled components in React forms?" },
      { questionText: "Describe custom hooks in React. Why would you write one, and how do they share logic?" }
    ],
    Hard: [
      { questionText: "Explain the React Fiber architecture. How does it enable concurrent rendering?" },
      { questionText: "Describe the diffing algorithm used by React during reconciliation. What is its time complexity?" },
      { questionText: "How does React handle state batching in React 18? How does it differ from older versions?" },
      { questionText: "Explain the concept of Higher-Order Components (HOCs) and compare them with Render Props and Hooks." },
      { questionText: "How would you optimize a large React application experiencing rendering delays due to deep component trees?" }
    ]
  },
  'Node.js': {
    Easy: [
      { questionText: "What is Node.js, and how does it differ from a browser JavaScript environment?" },
      { questionText: "What is npm, and what is the purpose of the package.json file?" },
      { questionText: "Explain the difference between require() and import (CommonJS vs ES Modules) in Node.js." },
      { questionText: "What is the path module in Node.js and how do you use it?" },
      { questionText: "What is the purpose of the fs (File System) module in Node.js?" }
    ],
    Medium: [
      { questionText: "Explain the Event Loop in Node.js. What are its phases (timers, poll, check, etc.)?" },
      { questionText: "What are Node.js Streams? Explain the difference between Readable, Writable, and Duplex streams." },
      { questionText: "Explain how Middleware works in Express.js. How do you implement a global error-handling middleware?" },
      { questionText: "What is the difference between process.nextTick() and setImmediate()?" },
      { questionText: "How does Node.js handle concurrency despite being single-threaded?" }
    ],
    Hard: [
      { questionText: "Explain Node.js clustering and the Worker Threads module. When should you use one over the other?" },
      { questionText: "Describe memory management in V8. How do you debug memory leaks in a production Node.js application?" },
      { questionText: "How would you implement backpressure when piping streams in Node.js, and why is it important?" },
      { questionText: "Explain how the buffer class is used in Node.js to handle raw binary data. How does V8 allocate memory for buffers?" },
      { questionText: "Design a high-throughput Express.js middleware system that implements token-bucket rate limiting without external databases." }
    ]
  },
  DBMS: {
    Easy: [
      { questionText: "What is a Database Management System (DBMS), and how does a relational database differ from a non-relational database?" },
      { questionText: "Explain Primary Keys, Foreign Keys, and Unique Keys in a relational database." },
      { questionText: "What is SQL? Write a query to fetch all records from a table named 'Users' where age is greater than 18." },
      { questionText: "What is the difference between INNER JOIN and LEFT JOIN in SQL?" },
      { questionText: "What is MongoDB, and what are collections and documents?" }
    ],
    Medium: [
      { questionText: "Explain ACID properties in relational databases and how they ensure data integrity." },
      { questionText: "What is database normalization? Explain 1NF, 2NF, and 3NF with simple examples." },
      { questionText: "What are database indexes? How do they speed up queries, and what are the trade-offs of having too many indexes?" },
      { questionText: "Explain transactions in MongoDB. How do they compare to SQL transactions?" },
      { questionText: "Explain SQL injection and list three distinct ways to prevent it." }
    ],
    Hard: [
      { questionText: "Explain the CAP Theorem and explain how it applies to distributed databases (like Cassandra vs MongoDB vs relational databases)." },
      { questionText: "Describe the differences between locking mechanisms: Optimistic Concurrency Control (OCC) vs Pessimistic Concurrency Control (PCC)." },
      { questionText: "How does Mongoose manage connection pooling under the hood, and how would you optimize connection configurations for high-volume serverless functions?" },
      { questionText: "Explain B-Trees and B+ Trees and why they are preferred structures for database indexes." },
      { questionText: "Design a database schema for a real-time messaging application. Explain how you would optimize queries for chat retrieval." }
    ]
  },
  OOP: {
    Easy: [
      { questionText: "What is Object-Oriented Programming (OOP) and what are its four main pillars?" },
      { questionText: "What is a class and what is an object? Explain the constructor method." },
      { questionText: "What is inheritance in OOP, and how does it promote code reusability?" },
      { questionText: "What is encapsulation, and how do public, private, and protected modifiers enforce it?" },
      { questionText: "What is polymorphism? Provide a simple real-world example." }
    ],
    Medium: [
      { questionText: "Explain the difference between Method Overloading and Method Overriding. Does JavaScript support both natively?" },
      { questionText: "What is the difference between an Abstract Class and an Interface? When would you use which?" },
      { questionText: "Explain the concept of Composition vs. Inheritance. Why do design principles favor composition?" },
      { questionText: "What are SOLID principles in OOP? Name and briefly explain each one." },
      { questionText: "What is the 'this' keyword in JavaScript? How does it behave differently inside arrow functions compared to regular functions?" }
    ],
    Hard: [
      { questionText: "Explain the Dependency Inversion Principle (DIP) and demonstrate how to implement Dependency Injection in a Node.js project." },
      { questionText: "Explain the Open/Closed Principle. Design a payment processing module that adheres strictly to this principle." },
      { questionText: "Describe the Singleton design pattern. What are its pros and cons, and how do you implement a thread-safe Singleton in modern JS/TS?" },
      { questionText: "Explain how Javascript implements OOP using prototype delegation under the hood, compared to class-based languages like Java." },
      { questionText: "What is the Liskov Substitution Principle (LSP)? Provide a code example of a violation of LSP and show how you would refactor it." }
    ]
  },
  HR: {
    Easy: [
      { questionText: "Tell me about yourself. What are your core technical strengths?" },
      { questionText: "Why do you want to join our company?" },
      { questionText: "What is your understanding of the role you are applying for?" },
      { questionText: "What are your short-term and long-term career goals?" },
      { questionText: "How do you handle deadline pressure?" }
    ],
    Medium: [
      { questionText: "Describe a situation where you had a conflict with a team member. How did you resolve it?" },
      { questionText: "Tell me about a challenging project you worked on. What were the obstacles and how did you overcome them?" },
      { questionText: "How do you prioritize your tasks when managing multiple urgent deadlines?" },
      { questionText: "Describe a time you failed to meet an expectation or deadline. What did you learn?" },
      { questionText: "What do you do when you are assigned a task using a technology you have never worked with before?" }
    ],
    Hard: [
      { questionText: "Describe a time when you had to make a critical technical decision with very limited information or conflicting opinions in the team. What was the outcome?" },
      { questionText: "How do you handle a situation where a manager pushes for a feature deployment that you believe contains high technical debt or security vulnerabilities?" },
      { questionText: "Tell me about a time you mentored someone or helped build a strong engineering culture. What was your approach and the results?" },
      { questionText: "How do you stay updated with emerging technologies, and how do you decide when a new tool or framework is worth adopting in a production environment?" },
      { questionText: "Describe a complex engineering trade-off you had to make (e.g. speed vs quality, consistency vs availability). What parameters did you measure to validate the choice?" }
    ]
  }
};

const getMockQuestions = (category, difficulty = 'Medium') => {
  // Check if predefined in mock dataset
  const cat = mockQuestions[category];
  if (cat && cat[difficulty]) {
    return cat[difficulty];
  }

  // Dynamic question generator for any student-chosen domain/topic
  const levelPrefix = difficulty === 'Easy' 
    ? 'fundamental concepts and beginner principles'
    : difficulty === 'Hard'
    ? 'advanced internals, scalability, and complex edge cases'
    : 'core mechanics, best practices, and architecture';

  return [
    { questionText: `Explain the fundamental architecture and core principles of ${category}. How does it solve problems in modern software engineering?` },
    { questionText: `In the context of ${difficulty} level expertise, what are the key performance optimizations and best practices when working with ${category}?` },
    { questionText: `Describe a scenario where you would choose ${category} over competing technologies or alternative patterns. What are the key trade-offs?` },
    { questionText: `Explain how state management, error handling, or asynchronous operations are designed in ${category}.` },
    { questionText: `Walk me through how you would architect and deploy a robust, production-grade application utilizing ${category} at scale.` }
  ];
};

const evaluateMockAnswers = (category, difficulty, questionsAndAnswers) => {
  let totalScore = 0;
  const evaluations = questionsAndAnswers.map(qa => {
    const answerLen = (qa.userAnswer || "").trim().length;
    let score = 0;
    let feedback = "";
    let modelAnswer = "";

    // Generate basic rating
    if (answerLen === 0) {
      score = 0;
      feedback = "You did not provide an answer. A complete response should explain the concept, define key terms, and ideally show a short example.";
    } else if (answerLen < 15) {
      score = Math.floor(Math.random() * 3) + 2; // 2 to 4
      feedback = "Your answer is too short and lacks explanation. Try to explain the concept in detail, mention its advantages/disadvantages, and provide examples.";
    } else if (answerLen < 50) {
      score = Math.floor(Math.random() * 3) + 5; // 5 to 7
      feedback = "A reasonable attempt. You captured the basic definition, but could improve by detailing practical use cases, edge cases, and showing code snippet examples.";
    } else {
      score = Math.floor(Math.random() * 3) + 8; // 8 to 10
      feedback = "Excellent answer! You covered the core concepts accurately, provided clear explanations, and showed structured insights.";
    }

    totalScore += score;

    // Set sample model answer based on category
    modelAnswer = `For "${qa.questionText}": A model answer starts by defining the term clearly. It then explains the mechanism (e.g. event-driven or OOP syntax), provides code examples, lists advantages, and details edge cases or potential pitfalls. For instance, in JS, reference memory allocation and scope bindings.`;

    return {
      questionText: qa.questionText,
      userAnswer: qa.userAnswer || "",
      score: score,
      feedback: feedback,
      modelAnswer: modelAnswer
    };
  });

  const overallScore = Math.round((totalScore / (questionsAndAnswers.length * 10)) * 100);
  
  let summary = "";
  let strengths = [];
  let weaknesses = [];

  if (overallScore >= 80) {
    summary = `Excellent performance! The candidate demonstrated high technical competency in ${category} (${difficulty} level). The answers showed deep understanding, clean conceptual clarity, and practical knowledge.`;
    strengths = ["Strong conceptual understanding", "Good details and structure", "Practical perspective"];
    weaknesses = ["Could outline more production optimization details", "Can touch upon memory management aspects"];
  } else if (overallScore >= 50) {
    summary = `Moderate performance. The candidate understands the core concepts of ${category} at a ${difficulty} level, but the answers lack depth, code examples, or explanations of edge cases.`;
    strengths = ["Understands basic definitions", "Attempts all questions", "Clear written communication"];
    weaknesses = ["Answers lack concrete code examples", "Lacks coverage of edge cases and performance trade-offs"];
  } else {
    summary = `Needs Improvement. The candidate struggled with the questions in ${category} (${difficulty} level). Answers were either missing, incomplete, or demonstrated fundamental misunderstandings.`;
    strengths = ["Basic participation", "Identified core keywords"];
    weaknesses = ["Fundamental conceptual gaps", "Extremely brief responses", "Lack of practical application understanding"];
  }

  return {
    overallScore,
    summary,
    strengths,
    weaknesses,
    evaluations
  };
};

const analyzeMockResume = (resumeText) => {
  const text = (resumeText || '').toLowerCase();
  
  const skillBank = [
    { name: 'JavaScript', keywords: ['javascript', 'js', 'es6'] },
    { name: 'React.js', keywords: ['react', 'reactjs', 'redux'] },
    { name: 'Node.js', keywords: ['node', 'nodejs', 'express'] },
    { name: 'MongoDB', keywords: ['mongodb', 'mongo', 'mongoose'] },
    { name: 'SQL', keywords: ['sql', 'mysql', 'postgres', 'postgresql'] },
    { name: 'HTML & CSS', keywords: ['html', 'css', 'sass', 'tailwind'] },
    { name: 'TypeScript', keywords: ['typescript', 'ts'] },
    { name: 'Docker', keywords: ['docker', 'container'] },
    { name: 'AWS', keywords: ['aws', 'amazon', 'cloud', 's3', 'ec2'] },
    { name: 'Git', keywords: ['git', 'github', 'gitlab'] },
    { name: 'Python', keywords: ['python', 'py'] },
    { name: 'Java', keywords: ['java', 'spring'] }
  ];

  const extractedSkills = [];
  skillBank.forEach(skill => {
    const hasKeyword = skill.keywords.some(kw => text.includes(kw));
    if (hasKeyword) {
      extractedSkills.push(skill.name);
    }
  });

  // Calculate dynamic ATS Score
  let score = 55; // Base score
  if (text.length < 100) {
    score = 25; // Too brief
  } else {
    score += extractedSkills.length * 4;
    if (text.includes('education') || text.includes('degree') || text.includes('university')) score += 5;
    if (text.includes('experience') || text.includes('work') || text.includes('intern')) score += 5;
    if (score > 95) score = 95; // cap at 95 for mock
  }

  // Find missing skills from a standard modern full stack developer profile
  const standardSkills = ['TypeScript', 'Node.js', 'Docker', 'AWS', 'MongoDB', 'SQL', 'Git'];
  const missingSkills = standardSkills.filter(s => !extractedSkills.includes(s));

  // Dynamic suggestions
  const suggestions = [];
  if (extractedSkills.length < 4) {
    suggestions.push('Add more technical skills to your skills section. The list of technologies is currently brief.');
  }
  if (!text.includes('education')) {
    suggestions.push('Add an "Education" section to state your academic history.');
  }
  if (!text.includes('experience') && !text.includes('work')) {
    suggestions.push('Incorporate a clear "Work Experience" or "Projects" section to highlight hands-on work.');
  }
  if (text.length > 0 && !/\d+/.test(text)) {
    suggestions.push('Quantify your contributions (e.g. "reduced latency by 30%", "managed a team of 4 engineers").');
  }
  suggestions.push('Format your resume using clear sections (Skills, Experience, Education, Projects) for better ATS parsing.');
  suggestions.push('Incorporate industry keywords matching your target job description to pass keyword filters.');

  // Recommended Tech to learn
  const recommendedTech = [];
  if (!extractedSkills.includes('TypeScript')) recommendedTech.push('TypeScript (highly demanded for modern React/Node development)');
  if (!extractedSkills.includes('Docker')) recommendedTech.push('Docker & Containers (critical for devops and microservices)');
  if (!extractedSkills.includes('AWS')) recommendedTech.push('AWS or Cloud Hosting platforms (S3, EC2, Lambda)');
  if (!extractedSkills.includes('Node.js')) recommendedTech.push('Node.js & Express (to transition to Full Stack developer)');
  if (recommendedTech.length === 0) {
    recommendedTech.push('Kubernetes (for scaling containerized services)');
    recommendedTech.push('Next.js (for server-side rendering in React)');
  }

  return {
    atsScore: score,
    extractedSkills,
    missingSkills,
    suggestions: suggestions.slice(0, 4), // max 4
    recommendedTech: recommendedTech.slice(0, 3) // max 3
  };
};

const generateMockRoadmap = (weakTopics, missingSkills) => {
  const topics = [...(weakTopics || []), ...(missingSkills || [])];
  const uniqueTopics = [...new Set(topics)];
  const targetRole = uniqueTopics.includes('Node.js') || uniqueTopics.includes('MongoDB') ? 'Full-Stack Software Engineer' : 'Frontend Engineer';

  const phases = [
    {
      phaseName: "Phase 1: Fundamental Concepts & Diagnostics",
      description: "Strengthen gaps in core syntax, logic frameworks, and primary technical constructs.",
      duration: "Weeks 1-2",
      topics: uniqueTopics.slice(0, 2).concat(['Language Syntax Mastery', 'Core Paradigms']),
      resources: ["MDN Web Docs", "JavaScript Info", "PrepAI Mock Practice sessions"]
    },
    {
      phaseName: "Phase 2: Architectural Setup & Development Tools",
      description: "Build robust, scalable developer tooling configurations, and understand advanced API designs.",
      duration: "Weeks 3-4",
      topics: uniqueTopics.slice(2, 4).concat(['Modern Toolchains', 'Version Controls']),
      resources: ["Architectural Blueprints Guide", "Tailwind Docs", "Refactoring Guru"]
    },
    {
      phaseName: "Phase 3: Integration, Databases & Deployment",
      description: "Understand database management, pipeline integrations, containers, and serverless options.",
      duration: "Weeks 5-6",
      topics: uniqueTopics.slice(4, 6).concat(['Data Structures', 'REST/GraphQL API Mappings']),
      resources: ["MongoDB Academy", "Docker Getting Started Guide", "AWS Developer Path Docs"]
    },
    {
      phaseName: "Phase 4: Advanced Systems & Mock Assessments",
      description: "Optimize server performance, handle distributed states, and practice complex code problems.",
      duration: "Weeks 7-8",
      topics: ['System Design Patterns', 'Production Scaling', 'Mock Behavioral Prep'],
      resources: ["System Design Primer", "Gemini Real-time Interview Assessments"]
    }
  ];

  return {
    targetRole,
    weakTopicsAnalyzed: uniqueTopics,
    phases
  };
};

const getMockDailyChallenge = (category) => {
  const list = {
    JavaScript: "Explain the differences between JavaScript closures and higher-order functions. Provide a simple code example showing a closure returning a function.",
    React: "What is React state batching? Explain how React 18 batches state updates inside asynchronous events like fetch or setTimeout.",
    'Node.js': "Describe how the Node.js event loop handles process.nextTick() versus setImmediate(). Which queue takes priority?",
    DBMS: "What is database normalization? Explain the difference between Second Normal Form (2NF) and Third Normal Form (3NF) using a brief schema example.",
    OOP: "Explain the Liskov Substitution Principle (LSP) in SOLID design. Provide an example of how inheritance can violate LSP and how to solve it.",
    HR: "How do you handle a scenario where a product manager requests a feature shortcut that compromises backend security or quality? Detail your communication strategy."
  };
  return list[category] || list['JavaScript'];
};

const evaluateMockChallengeAnswer = (questionText, userAnswer) => {
  const len = (userAnswer || '').trim().length;
  let score = 0;
  let feedback = '';

  if (len === 0) {
    score = 0;
    feedback = 'You did not submit an answer. A model response should define the terms and provide a code snippet/example.';
  } else if (len < 20) {
    score = 3;
    feedback = 'Your response is too brief. Try to flesh out the explanation, detail how the mechanism works, and include code/logic blocks.';
  } else if (len < 60) {
    score = 6;
    feedback = 'Good response, but it lacks depth. To reach proficiency, outline edge cases, mention performance trade-offs, and illustrate with code.';
  } else {
    score = 8;
    feedback = 'Excellent answer! You covered the core principles clearly, gave structured insights, and explained how to implement it in production.';
  }

  const modelAnswer = `Expected answer details:
1. Define the core term clearly (e.g. event queue priorities or SOLID subclass substitutability).
2. Write a clear syntax implementation showing variable constraints.
3. Compare performance metrics and explain V8 engine or DB indexing behavior.
4. Conclude with industry standards and lint rules.`;

  return {
    score,
    feedback,
    modelAnswer
  };
};

const companyMockQuestions = {
  Google: [
    { questionText: "Design a search autocomplete system using Tries and describe how you would distribute the index over multiple machines." },
    { questionText: "Implement a custom Least Recently Used (LRU) Cache in your choice of language, explaining time complexity of get/put operations." },
    { questionText: "Given a large stream of integers, how would you find the median in real-time? Explain the Heap approach." },
    { questionText: "Explain how Google handles high-concurrency crawl scheduling for web pages using distributed queues." },
    { questionText: "Explain the differences between TCP and UDP, and why Google created the QUIC protocol." }
  ],
  Amazon: [
    { questionText: "Describe a situation where you had a conflict with a stakeholder on a technical design direction. How did you disagree and commit?" },
    { questionText: "Design a system that handles order placement during a Black Friday high-volume flash sale on Amazon. Include connections, queues, and DB locks." },
    { questionText: "Tell me about a time you took ownership of a critical production outage that was outside your direct team scope. What did you do?" },
    { questionText: "How would you design a distributed rate limiter to prevent DDoS attacks on Amazon's API Gateway?" },
    { questionText: "What is the difference between SQL transactions and DynamoDB transactional write guarantees?" }
  ],
  Microsoft: [
    { questionText: "Design the back-end API interface for a collaborative document editor like Office 365, focusing on operational transformation." },
    { questionText: "Explain the differences between memory management in V8 and .NET CLR. How do their garbage collection phases compare?" },
    { questionText: "Design a file synchronization backend (like OneDrive) to track file modifications and upload delta updates securely." },
    { questionText: "What are WebSockets? Design a microservice backend that supports 1 million concurrent connection nodes." },
    { questionText: "Explain how active directory handles distributed authentication protocols across federated cloud services." }
  ],
  Meta: [
    { questionText: "Design a real-time newsfeed system like Facebook Feed. Detail caching layers, user fan-out write strategies, and ranking mechanisms." },
    { questionText: "How would you write a custom function to implement a deep clone of an object with circular references in JavaScript?" },
    { questionText: "Design Meta Messenger's online/offline indicator service to scale for 2 billion active accounts." },
    { questionText: "Explain React concurrent rendering and the diffing mechanisms React uses to reconcile the Fiber tree." },
    { questionText: "Design a distributed key-value store (like Memcached/Cassandra) to achieve high consistency and low read latencies." }
  ],
  Netflix: [
    { questionText: "Design a resilient video streaming delivery pipeline that dynamically adapts video quality based on consumer bandwidth constraints." },
    { questionText: "Explain how Chaos Engineering (like Chaos Monkey) works, and how to build system architectures that degrade gracefully." },
    { questionText: "Design a microservice service discovery registry (like Eureka) to route requests dynamically across 10,000 servers." },
    { questionText: "Explain how database sharding works, and how Netflix handles cross-shard queries without blocking read streams." },
    { questionText: "How would you implement token bucket rate limiting to protect Netflix streaming servers from rogue API requests?" }
  ]
};

const getMockCompanyQuestions = (company, role, difficulty) => {
  return companyMockQuestions[company] || companyMockQuestions['Google'];
};

module.exports = {
  getMockQuestions,
  evaluateMockAnswers,
  analyzeMockResume,
  generateMockRoadmap,
  getMockDailyChallenge,
  evaluateMockChallengeAnswer,
  getMockCompanyQuestions
};
