import React from "react";
import { ModernTypingEngineModule } from "@/modules/typing/ModernTypingEngineModule";
import { Question } from "./types";

interface Props {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  userName: string;
}

export default function TypingTestPanel({ question, value, onChange, userName }: Props) {
  const handleComplete = (results: any) => {
    onChange({
      typedText: results.typedText,
      wpm: results.wpm,
      accuracy: results.accuracy,
      errors: results.errors
    });
  };

  // Mocking the exam object expected by the module
  const mockExam = {
    title: "Typing Test",
    duration: question.typingConfig?.duration || 10,
    ...question.typingConfig
  };

  const engineConfig = {
    ...mockExam,
    language: question.typingConfig?.language || "English",
    layout: question.typingConfig?.layout || "English"
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
      <ModernTypingEngineModule 
        exam={mockExam}
        passage={question.shortAnswer || ""} 
        config={engineConfig}
        onComplete={handleComplete}
        userName={userName}
      />
    </div>
  );
}
