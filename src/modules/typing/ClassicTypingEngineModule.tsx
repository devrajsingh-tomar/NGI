"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { useTimer } from './hooks/useTimer';
import { useTypingEngine } from './hooks/useTypingEngine';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { mapKeyToHindi } from './utils/hindiMapping';
import { LiveDashboard, TimerDisplay } from './components/LiveDashboard';
import { Speedometer } from './components/Speedometer';
import { cn } from '@/lib/utils';
import { normalizeChar } from './utils/calculations';

interface ClassicTypingEngineModuleProps {
  exam?: any;
  passage: string;
  config: {
    title: string;
    duration: number;
    backspaceMode?: 'full' | 'word' | 'disabled';
    highlightMode?: 'word' | 'word_error' | 'letter' | 'none';
    wordLimit?: number;
    language?: string;
    layout?: 'English' | 'Remington Gail' | 'Inscript' | 'Phonetic';
    autoScroll?: boolean;
    showScrollbar?: boolean;
    sourcePosition?: 'top' | 'left' | 'right' | 'bottom';
    disableCopyPaste?: boolean;
    disableRightClick?: boolean;
  };
  onComplete: (results: any) => void;
  userName?: string;
  userImage?: string;
  /** When true (default), shows the Duration & Exercise switcher bar.
   *  Set to false for practice sessions (Word/Special/Current) where
   *  the passage is already pre-selected from the selection screen. */
  showExerciseSwitcher?: boolean;
}

export const ClassicTypingEngineModule: React.FC<ClassicTypingEngineModuleProps> = ({
  exam,
  passage,
  config,
  onComplete,
  userName = "STUDENT",
  userImage,
  showExerciseSwitcher = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const {
    setPassage,
    updateSettings,
    isFinished,
    wpm,
    accuracy,
    errorCount,
    typedText,
    setTypedText,
    settings,
    rawWpm,
    backspaceCount,
    resetTest,
    endTest,
    isActive,
    startTest,
    timeLeft,
    isFullScreen,
    toggleFullScreen
  } = useTypingStore();

  const { resetIdleTimer } = useTimer();
  useTypingEngine();

  const passageContainerRef = useRef<HTMLDivElement>(null);

  const [passagesList, setPassagesList] = useState<any[]>([]);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [internalPassage, setInternalPassage] = useState(passage);
  const [internalDuration, setInternalDuration] = useState(config.duration);
  const [internalLanguage, setInternalLanguage] = useState(config.language || 'English');
  const [internalLayout, setInternalLayout] = useState(config.layout || 'English');
  const [currentExam, setCurrentExam] = useState(exam);

  const isBookPractice = exam?.section === 'Book' || exam?.category === 'BOOK';

  // Load available exams/passages matching current criteria
  useEffect(() => {
    if (!showExerciseSwitcher) return;

    if (isBookPractice && exam?.bookId) {
      // For Book Practice: fetch sibling chapters from the passages API
      const bId = typeof exam.bookId === 'object' ? exam.bookId._id : exam.bookId;
      const langParam = internalLanguage ? `&lang=${internalLanguage}` : '';
      fetch(`/api/typing/practice?type=BOOK&bookId=${bId}${langParam}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const sorted = data.sort((a: any, b: any) => a.title.localeCompare(b.title));
            setPassagesList(sorted);
            const foundIdx = sorted.findIndex((p: any) => p._id?.toString() === exam._id?.toString());
            if (foundIdx !== -1) {
              setCurrentPassageIndex(foundIdx);
              setCurrentExam(sorted[foundIdx]);
            }
          }
        })
        .catch(e => console.error("Failed to load book chapters", e));
      return;
    }

    // For Gov / Special exams: fetch from exams API
    let query = '';
    if (exam) {
      const queryLang = exam.language || config.language;
      if (exam.govExamId) {
        query = `?govExamId=${exam.govExamId}&language=${queryLang}`;
        if (exam.difficulty) query += `&difficulty=${exam.difficulty}`;
      } else if (exam.category === 'SPECIAL') {
        query = `?category=SPECIAL&language=${queryLang}`;
      }
    }

    fetch(`/api/typing/exams${query}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => a.title.localeCompare(b.title));
          setPassagesList(sorted);
          const foundIdx = sorted.findIndex(e => e._id === exam?._id);
          if (foundIdx !== -1) {
            setCurrentPassageIndex(foundIdx);
            setCurrentExam(sorted[foundIdx]);
          }
        }
      })
      .catch(e => console.error("Failed to load related exercises", e));
  }, [showExerciseSwitcher, isBookPractice, exam, config.language]);


  // Sync internal state with props if they change
  useEffect(() => {
    setInternalPassage(passage);
    setInternalDuration(config.duration);
    setInternalLanguage(config.language || 'English');
    setInternalLayout(config.layout || 'English');
    setCurrentExam(exam);
  }, [passage, config.duration, config.language, config.layout, exam]);

  // Handle Fullscreen natively
  useEffect(() => {
    if (!containerRef.current) return;
    if (isFullScreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => { });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }
    }
  }, [isFullScreen]);

  // Sync state if user exits fullscreen via ESC key
  useEffect(() => {
    const handleFsChange = () => {
      const isCurrentlyFs = !!document.fullscreenElement;
      if (!isCurrentlyFs && isFullScreen) {
        useTypingStore.setState({ isFullScreen: false });
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [isFullScreen]);

  // Prevent accidental page leave during official exams
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentExam && isActive && !isFinished) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentExam, isActive, isFinished]);

  // Calculate current word based on spaces typed
  const typedWordsArray = typedText.split(/\s+/);
  const activeWordIndex = typedText === '' ? 0 : typedWordsArray.length - 1;

  // Auto-scroll passage area and textarea
  useEffect(() => {
    if (settings.autoScroll && passageContainerRef.current) {
      const activeElement = passageContainerRef.current.querySelector('.active-word') as HTMLElement;
      if (activeElement) {
        const offsetTop = activeElement.offsetTop;
        const containerHalfHeight = passageContainerRef.current.clientHeight / 2;
        passageContainerRef.current.scrollTo({
          top: offsetTop - containerHalfHeight + 20,
          behavior: 'smooth'
        });
      }
    }
  }, [activeWordIndex, settings.autoScroll]);

  // Initialize
  useEffect(() => {
    resetTest();
    setPassage(internalPassage);
    updateSettings({
      duration: internalDuration,
      language: internalLanguage,
      layout: internalLayout,
      backspaceMode: config.backspaceMode || 'full',
      highlightMode: config.highlightMode || 'word',
      autoScroll: config.autoScroll !== undefined ? config.autoScroll : true,
      showScrollbar: config.showScrollbar !== undefined ? config.showScrollbar : true,
      sourcePosition: config.sourcePosition || 'top',
    });
    // Scroll window to top so the exam starts from the top area
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [internalPassage, internalDuration, internalLanguage, internalLayout, config]);

  // Handle Completion
  useEffect(() => {
    if (isFinished) {
      toast.success("Examination Completed!");
      onComplete({
        wpm,
        rawWpm,
        accuracy,
        errorCount,
        totalCharacters: typedText.length,
        backspaces: backspaceCount,
        submittedText: typedText,
        timeTaken: (settings.duration * 60) - timeLeft,
        examId: currentExam?._id,
        passageId: isBookPractice ? currentExam?._id : currentExam?.passageId?._id
      });
    }
  }, [isFinished, currentExam, wpm, rawWpm, accuracy, errorCount, typedText.length, backspaceCount, settings.duration, timeLeft, isBookPractice, onComplete]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive && !isFinished && timeLeft > 0) {
      startTest();
    }
    resetIdleTimer();

    let val = e.target.value;
    const isDeletion = val.length < typedText.length;

    // 0. HINDI MAPPING LOGIC
    const isHindi = settings.language === 'Hindi' || settings.language === 'Unicode Hindi';
    if (isHindi && !isDeletion && val.length > typedText.length) {
      const lastChar = val.slice(-1);
      if (/[\x00-\x7F]/.test(lastChar) && lastChar !== ' ' && lastChar !== '\n') {
        const mapped = mapKeyToHindi(lastChar, settings.layout);
        val = val.slice(0, -1) + mapped;
      }
    }

    setTypedText(val);

    // Auto-scroll typing textarea
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace') {
      if (settings.backspaceMode === 'disabled') {
        e.preventDefault();
        return;
      }

      if (settings.backspaceMode === 'word') {
        // Prevent deleting the space that committed the previous word
        if (typedText.endsWith(' ')) {
          e.preventDefault();
          return;
        }
      }
    }

    // Prevent paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [fontSize, setFontSize] = useState(16);
  const [bgColor, setBgColor] = useState('#a1c984');

  const isHindi = settings.language === 'Hindi' || settings.language === 'Unicode Hindi' || settings.layout === 'Remington Gail' || settings.layout === 'Inscript' || settings.layout === 'Phonetic';

  const typingFont = isHindi
    ? "'Mangal', 'Mangal Regular', 'Arial Unicode MS', sans-serif"
    : "'Times New Roman', Times, serif";

  const passageWords = internalPassage.split(' ');

  return (
    <div ref={containerRef} className={cn(
      "flex flex-col bg-slate-50 font-sans selection:bg-primary/20 transition-all duration-500",
      isFullScreen ? 'h-screen' : 'min-h-screen'
    )}>
      {/* Precision Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-50">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
              ngit <span className="text-primary not-italic">EXAM ENGINE</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5">
              Protocol: {currentExam?.title || 'Standardized Typing Assessment'}
            </p>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden md:block" />
          <div className="hidden md:flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Resource Identifier</p>
            <p className="text-sm font-bold text-slate-600 mt-1">Ref_{currentExam?.passageId?._id?.substring(0, 8) || 'GLOBAL_31848'}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Temporal Registry</p>
            <div className="flex items-center gap-3">
              <TimerDisplay className="text-2xl font-black text-slate-900 tabular-nums" />
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                timeLeft < 60 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-slate-100 text-slate-600"
              )}>
                {timeLeft < 60 ? "Critical" : "Stable"}
              </div>
            </div>
          </div>
          <div className="h-12 w-px bg-slate-200" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 leading-none uppercase">{userName}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Candidate</p>
            </div>
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white overflow-hidden">
              {userImage ? (
                <img src={userImage} alt="Candidate" className="w-full h-full object-cover" />
              ) : (
                userName[0]
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Controls Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex justify-between items-center shadow-inner">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleFullScreen}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all flex items-center gap-2 border",
              isFullScreen
                ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", isFullScreen ? "bg-rose-500 animate-pulse" : "bg-slate-400")} />
            {isFullScreen ? "Deactivate Exam Mode" : "Activate Exam Mode"}
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Typeface</span>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
              <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 rounded-md text-slate-600">-</button>
              <span className="text-xs font-black w-8 text-center text-slate-900 tabular-nums">{fontSize}</span>
              <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 rounded-md text-slate-600">+</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</span>
            <div className="flex gap-1.5 p-1 bg-white border border-slate-200 rounded-xl">
              {['#ffffff', '#f8fafc', '#f1f5f9', '#fefce8', '#f0f9ff', '#fff7ed'].map(color => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={cn(
                    "w-6 h-6 rounded-lg border transition-all hover:scale-110",
                    bgColor === color ? "border-primary ring-2 ring-primary/20" : "border-slate-200"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {settings.layout}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {settings.language}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise and Duration Controls – only in official exam mode */}
      {showExerciseSwitcher && (
        <div className="bg-slate-900 border-b border-slate-800 p-2.5 flex flex-wrap items-center gap-8 text-sm font-bold text-white shadow-xl relative z-10 px-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration Profile</span>
            <select
              value={internalDuration}
              onChange={(e) => setInternalDuration(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer text-xs font-black tracking-widest"
              disabled={isActive && !isFinished && typedText.length > 0}
            >
              {[1, 2, 3, 4, 5, 10, 15, 20].map(min => (
                <option key={min} value={min}>{min} MIN CYCLE</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Exercise</span>
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => {
                  if (currentPassageIndex > 0) {
                    const newIdx = currentPassageIndex - 1;
                    setCurrentPassageIndex(newIdx);
                    const newItem = passagesList[newIdx];
                    setCurrentExam(newItem);
                    setInternalPassage(isBookPractice ? (newItem.content || '') : (newItem.passageId?.content || 'No content found'));
                    setInternalLanguage(newItem.language || config.language || 'English');
                    updateSettings({ duration: internalDuration, language: newItem.language || config.language });
                  }
                }}
                disabled={currentPassageIndex <= 0 || (isActive && !isFinished && typedText.length > 0)}
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-20 transition-all flex items-center justify-center font-black"
              >{"<"}</button>
              <select
                value={currentPassageIndex}
                onChange={(e) => {
                  const newIdx = Number(e.target.value);
                  setCurrentPassageIndex(newIdx);
                  const newItem = passagesList[newIdx];
                  setCurrentExam(newItem);
                  setInternalPassage(isBookPractice ? (newItem.content || '') : (newItem.passageId?.content || 'No content found'));
                  setInternalLanguage(newItem.language || config.language || 'English');
                  updateSettings({ duration: internalDuration, language: newItem.language || config.language });

                }}
                disabled={isActive && !isFinished && typedText.length > 0}
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none flex-1 focus:ring-2 focus:ring-primary/40 min-w-0 truncate cursor-pointer text-xs font-black tracking-widest uppercase"
              >
                {passagesList.length > 0 ? (
                  passagesList.map((p, i) => (
                    <option key={p._id || i} value={i}>
                      {isBookPractice ? `Ch. ${i + 1}/${passagesList.length} • ${p.title?.substring(0, 40)}` : `X_${i + 1} • ${p.title?.substring(0, 30)}`}
                    </option>
                  ))
                ) : (
                  <option value={0}>SYNCHRONIZING EXERCISES...</option>
                )}
              </select>
              <button
                onClick={() => {
                  if (currentPassageIndex < passagesList.length - 1) {
                    const newIdx = currentPassageIndex + 1;
                    setCurrentPassageIndex(newIdx);
                    const newItem = passagesList[newIdx];
                    setCurrentExam(newItem);
                    setInternalPassage(isBookPractice ? (newItem.content || '') : (newItem.passageId?.content || 'No content found'));
                    setInternalLanguage(newItem.language || config.language || 'English');
                    updateSettings({ duration: internalDuration, language: newItem.language || config.language });
                  }
                }}
                disabled={currentPassageIndex >= passagesList.length - 1 || (isActive && !isFinished && typedText.length > 0)}
                className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-20 transition-all flex items-center justify-center font-black"
              >{">"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Execution Area */}
      <div className="flex-1 p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full min-h-0">
        {/* Source Text Buffer */}
        <div
          ref={passageContainerRef}
          className="flex-1 relative bg-white border border-slate-200 rounded-[2.5rem] p-10 overflow-y-auto text-slate-800 leading-[1.8] break-words scroll-smooth shadow-sm"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: typingFont,
            minHeight: '220px',
            scrollbarWidth: settings.showScrollbar ? 'auto' : 'none'
          }}
          onCopy={(e) => config.disableCopyPaste !== false && e.preventDefault()}
        >
          {settings.highlightMode !== 'none' ? (
            passageWords.map((word, index) => {
              let className = "transition-all duration-200 ";

              if (settings.highlightMode === 'word') {
                if (index === activeWordIndex) {
                  className += "text-blue-600 font-bold active-word underline decoration-blue-300 decoration-2 underline-offset-4";
                } else if (index < activeWordIndex) {
                  const typedWord = typedWordsArray[index];
                  const normTypedWord = typedWord.split('').map(normalizeChar).join('');
                  const normOriginalWord = word.split('').map(normalizeChar).join('');
                  if (normTypedWord !== normOriginalWord) {
                    className += "text-red-600 font-bold underline decoration-red-400";
                  }
                }
              }
              else if (settings.highlightMode === 'word_error') {
                if (index < activeWordIndex) {
                  className += typedWordsArray[index] === word ? "text-emerald-600 font-bold" : "text-rose-600 font-bold underline decoration-rose-400";
                } else if (index === activeWordIndex) {
                  const currentTyped = typedWordsArray[index] || "";
                  return (
                    <span key={index} className="active-word text-blue-600 underline decoration-blue-300 decoration-4 underline-offset-8 font-bold">
                      {word.split('').map((char, charIdx) => {
                        let charClass = "";
                        if (charIdx < currentTyped.length) {
                          charClass = normalizeChar(char) === normalizeChar(currentTyped[charIdx]) ? "text-emerald-600" : "text-rose-600 bg-rose-50";
                        }
                        return <span key={charIdx} className={charClass}>{char}</span>;
                      })}
                      {" "}
                    </span>
                  );
                }
              }
              else if (settings.highlightMode === 'letter') {
                if (index < activeWordIndex) {
                  className += "opacity-40 ";
                } else if (index === activeWordIndex) {
                  const currentTyped = typedWordsArray[index] || "";
                  return (
                    <span key={index} className="active-word font-bold">
                      {word.split('').map((char, charIdx) => {
                        let charClass = "text-gray-400";
                        if (charIdx < currentTyped.length) {
                          charClass = normalizeChar(char) === normalizeChar(currentTyped[charIdx]) ? "text-emerald-600" : "text-rose-600 underline";
                        } else if (charIdx === currentTyped.length) {
                          charClass = "text-white bg-blue-600 rounded-sm ring-2 ring-blue-300";
                        }
                        return <span key={charIdx} className={charClass}>{char}</span>;
                      })}
                      {" "}
                    </span>
                  );
                }
              }

              return (
                <span key={index} className={className}>
                  {word}{" "}
                </span>
              );
            })
          ) : (
            internalPassage
          )}
        </div>

        {/* Data Input Stream */}
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onPaste={(e) => config.disableCopyPaste !== false && e.preventDefault()}
          disabled={isFinished}
          spellCheck={false}
          autoComplete="off"
          className="flex-1 border-4 border-slate-200 rounded-[3rem] p-10 overflow-y-auto outline-none focus:border-primary/40 text-slate-900 font-bold leading-[1.8] resize-none shadow-2xl transition-all duration-500"
          style={{
            fontSize: `${fontSize + 2}px`,
            fontFamily: typingFont,
            minHeight: '220px',
            backgroundColor: bgColor,
            scrollbarWidth: settings.showScrollbar ? 'auto' : 'none'
          }}
        />
      </div>

      {/* Footer Authorization Area */}
      <div className="bg-white p-6 border-t border-slate-200 flex justify-center items-center relative h-24">
        <div className="flex items-center gap-6 max-w-7xl mx-auto w-full justify-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 px-8 py-4 rounded-2xl text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Terminal Exit
          </button>

          <button
            onClick={() => endTest()}
            className="bg-primary text-white px-16 py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0"
          >
            Authorize Submission
          </button>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to reset the test? Current progress will be lost.")) {
                resetTest();
              }
            }}
            className="absolute right-0 w-12 h-12 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer text-slate-400 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
            title="Reset Protocol"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
