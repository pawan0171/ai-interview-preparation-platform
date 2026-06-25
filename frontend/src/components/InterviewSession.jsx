import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Terminal,
  Code
} from 'lucide-react';

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if accessed directly without category setup
  useEffect(() => {
    if (!location.state || !location.state.questions) {
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  if (!location.state || !location.state.questions) {
    return null;
  }

  const { category, difficulty, questions, company, role } = location.state;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [loading, setLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [error, setError] = useState('');

  // Voice Interaction state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Coding workspace state
  const [editorMode, setEditorMode] = useState('text'); // 'text' or 'code'
  const [codeLanguage, setCodeLanguage] = useState('JavaScript');
  const [runningCode, setRunningCode] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');

  const loadingTexts = [
    'Evaluating response vocabulary...',
    'Analyzing semantic logic trees...',
    'Comparing with senior developer standards...',
    'Assembling strength and weakness profiles...',
    'Generating constructive code feedback...',
    'Writing model replies...'
  ];

  // Rotate loading text for engaging user experience
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Prevent accidental page reload/exit
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your active interview progress will be discarded.';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Web Speech Recognition initializer
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setAnswers(prev => {
          const updated = [...prev];
          const currentAns = updated[currentIdx] || '';
          updated[currentIdx] = currentAns ? `${currentAns} ${transcript}` : transcript;
          return updated;
        });
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [currentIdx]);

  // Cancel speaking when switching questions
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    // Also reset console output when switching questions
    setConsoleOutput('');
  }, [currentIdx]);

  const speakQuestion = () => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(questions[currentIdx].questionText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleAnswerChange = (val) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIdx] = val;
    setAnswers(updatedAnswers);
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmit = async () => {
    // Check if the user left everything blank
    const answeredCount = answers.filter((ans) => ans.trim().length > 0).length;
    if (answeredCount === 0) {
      setError('You must answer at least one question before submitting.');
      return;
    }

    if (
      answeredCount < questions.length &&
      !window.confirm(`You have only answered ${answeredCount}/${questions.length} questions. Submit anyway?`)
    ) {
      return;
    }

    setLoading(true);
    setError('');

    // Combine questions and user answers
    const formattedQuestions = questions.map((q, idx) => ({
      questionText: q.questionText,
      userAnswer: answers[idx]
    }));

    try {
      const response = await api.post('/api/interviews/evaluate', {
        category,
        difficulty,
        questions: formattedQuestions
      });

      if (response.data.success) {
        // Navigate to evaluation report details
        navigate('/interview-evaluation', {
          state: { interview: response.data.data }
        });
      } else {
        setError('Submission failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error submitting answers:', err);
      setError(
        err.response?.data?.message || 'Server error. Failed to evaluate answers.'
      );
      setLoading(false);
    }
  };

  // Tab Key intercept for Code Editor
  const handleTabKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const newVal = val.substring(0, start) + '  ' + val.substring(end);
      handleAnswerChange(newVal);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const getDefaultCodeTemplate = (lang) => {
    switch (lang) {
      case 'JavaScript':
        return `// JavaScript code goes here\nfunction solution() {\n  console.log("Hello, World!");\n}\nsolution();`;
      case 'Python':
        return `# Python code goes here\ndef solution():\n    print("Hello, World!")\n\nsolution()`;
      case 'C++':
        return `// C++ code goes here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`;
      case 'Java':
        return `// Java code goes here\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`;
      default:
        return '';
    }
  };

  const runMockCode = () => {
    setRunningCode(true);
    setConsoleOutput('');

    setTimeout(() => {
      setRunningCode(false);
      const codeToRun = answers[currentIdx] || '';
      let output = '';

      if (codeLanguage === 'JavaScript') {
        output = `[Sandbox Exec] Running JavaScript code...\n`;
        if (codeToRun.includes('console.log')) {
          const logs = [];
          const matches = codeToRun.matchAll(/console\.log\(([^)]+)\)/g);
          for (const match of matches) {
            logs.push(match[1].replace(/['"`]/g, ''));
          }
          output += logs.length > 0 ? logs.join('\n') : 'Code executed with no stdout output.';
        } else {
          output += 'Execution success: script completed with exit code 0.';
        }
      } else {
        output = `[Sandbox Exec] Compilation success (${codeLanguage})...\nExecuting script...\n\nProgram Output:\n`;
        if (codeLanguage === 'Python') {
          if (codeToRun.includes('print')) {
            const prints = [];
            const matches = codeToRun.matchAll(/print\(([^)]+)\)/g);
            for (const match of matches) {
              prints.push(match[1].replace(/['"`]/g, ''));
            }
            output += prints.length > 0 ? prints.join('\n') : 'Script returned exit code 0.';
          } else {
            output += `Active environment: Python 3.10.2\nOutput: Code returned exit code 0.`;
          }
        } else if (codeLanguage === 'C++') {
          output += `Compiled via g++ (GCC) 11.2.0\nOutput: Process returned 0 (0x0)`;
        } else if (codeLanguage === 'Java') {
          output += `JVM: OpenJDK 17.0.1\nOutput: Process finished with exit code 0`;
        }
      }
      setConsoleOutput(output);
    }, 1200);
  };

  const currentQuestion = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  const currentCode = answers[currentIdx] || '';
  const codeLinesCount = currentCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(10, codeLinesCount) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-12 px-6 md:px-12 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col lg:flex-row gap-8 items-stretch mb-8">
        
        {/* Left Side: Progress & Info */}
        <div className="lg:w-1/3 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between h-fit lg:sticky lg:top-24">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-800/20">
                {company ? `${company} - ${role}` : category}
              </span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
                {difficulty}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-6">Interview Live Stream</h2>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
                <span>Progress</span>
                <span>Question {currentIdx + 1} of {questions.length}</span>
              </div>
              <div className="w-full bg-gray-950 rounded-full h-1.5 border border-gray-800">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Questions Step List */}
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const isActive = currentIdx === idx;
                const isAnswered = answers[idx].trim().length > 0;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-950/15 text-white font-bold'
                        : 'border-gray-850 bg-gray-950/30 text-gray-400 hover:bg-gray-900/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-900 text-gray-500 border border-gray-800'
                    }`}>
                      {isAnswered && !isActive ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : idx + 1}
                    </div>
                    <span className="text-xs truncate block">{q.questionText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800/40 text-xs text-gray-500 flex gap-2 items-center bg-gray-950/20 p-3 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Do not refresh this page. Doing so will abort the interview state.</span>
          </div>
        </div>

        {/* Right Side: Active Question Workspace */}
        <div className="lg:w-2/3 flex flex-col justify-between glass-panel p-6 md:p-8 rounded-2xl border border-gray-800 flex-grow min-h-[400px]">
          <div>
            {error && (
              <div className="bg-red-950/30 border border-red-800/40 text-red-300 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Question {currentIdx + 1}
              </span>
            </div>

            {/* Question Text & TTS Speaker Icon */}
            <div className="flex justify-between items-start gap-4 mb-6">
              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed flex-1">
                {currentQuestion.questionText}
              </h3>
              <button
                onClick={speakQuestion}
                className={`p-2 rounded-xl border shrink-0 transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 animate-pulse border-rose-500'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
                title={isSpeaking ? 'Mute' : 'Speak Question'}
              >
                {isSpeaking ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
              </button>
            </div>

            {/* Answer Mode selection and character counts */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 bg-gray-950 p-1 rounded-xl border border-gray-850">
                <button
                  onClick={() => setEditorMode('text')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editorMode === 'text'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Conceptual Explanation
                </button>
                <button
                  onClick={() => {
                    setEditorMode('code');
                    if (!answers[currentIdx].trim()) {
                      handleAnswerChange(getDefaultCodeTemplate(codeLanguage));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    editorMode === 'code'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Code className="h-3.5 w-3.5" />
                  Coding Workspace
                </button>
              </div>

              <div className="flex items-center gap-3">
                {editorMode === 'text' && (
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
                      isListening
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-400 animate-pulse border-rose-500'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                    title={isListening ? 'Stop recording' : 'Transcribe via Microphone'}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-3.5 w-3.5" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                        <span>Speak Answer</span>
                      </>
                    )}
                  </button>
                )}
                <span className="text-xs text-indigo-400 font-semibold bg-indigo-950/20 px-2.5 py-1 rounded-md border border-indigo-850/30">
                  Characters: {answers[currentIdx].length}
                </span>
              </div>
            </div>

            {/* Answer Workspaces */}
            {editorMode === 'code' ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-gray-950 p-2.5 rounded-xl border border-gray-850">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Language:</label>
                    <select
                      value={codeLanguage}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setCodeLanguage(newLang);
                        // Optional prompt reset
                        if (window.confirm('Prepopulate editor with the new language template? This will clear current code.')) {
                          handleAnswerChange(getDefaultCodeTemplate(newLang));
                        }
                      }}
                      className="bg-gray-900 border border-gray-800 rounded-lg text-xs font-bold text-indigo-400 p-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="C++">C++</option>
                      <option value="Java">Java</option>
                    </select>
                  </div>
                  <button
                    onClick={runMockCode}
                    disabled={runningCode}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow shadow-emerald-600/10"
                  >
                    {runningCode ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Compiling...
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-white text-white" />
                        Run Code
                      </>
                    )}
                  </button>
                </div>

                {/* Editor Box */}
                <div className="flex border border-gray-850 rounded-xl overflow-hidden bg-gray-950/80 font-mono text-sm leading-relaxed">
                  {/* Line Numbers */}
                  <div className="w-12 bg-gray-950/45 py-4 border-r border-gray-850 text-right select-none pr-3 text-gray-600 text-xs">
                    {lineNumbers.map((num) => (
                      <div key={num} className="h-[21px]">{num}</div>
                    ))}
                  </div>
                  {/* Code Textarea */}
                  <textarea
                    value={answers[currentIdx]}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    onKeyDown={handleTabKeyDown}
                    placeholder={getDefaultCodeTemplate(codeLanguage)}
                    className="flex-1 bg-transparent py-4 px-4 text-emerald-400 placeholder-gray-700 focus:outline-none resize-none min-h-[300px] font-mono focus:ring-0 border-0"
                  />
                </div>

                {/* Terminal Console */}
                {consoleOutput && (
                  <div className="bg-black/90 rounded-xl border border-gray-850 p-4 font-mono text-xs text-gray-300">
                    <div className="flex justify-between items-center border-b border-gray-850 pb-2 mb-2">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                        <Terminal className="h-3.5 w-3.5 text-gray-500" />
                        Console Output
                      </span>
                      <button
                        onClick={() => setConsoleOutput('')}
                        className="text-[10px] text-gray-500 hover:text-gray-350 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed">{consoleOutput}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  placeholder="Type your detailed answer here. Try to explain key terms, write code examples if relevant, and describe production use-cases. Alternatively, click 'Speak Answer' above to dictate your response."
                  value={answers[currentIdx]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-full bg-gray-950/60 border border-gray-850 hover:border-gray-750 focus:border-indigo-500 rounded-xl p-4 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-0 min-h-[300px] resize-y transition-all leading-relaxed"
                ></textarea>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800/40">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 bg-gray-900 border border-gray-800 hover:border-gray-700 disabled:opacity-30 disabled:pointer-events-none text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.01] cursor-pointer"
              >
                Submit Interview
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InterviewSession;
