"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { 
    Play, 
    RotateCcw, 
    Settings, 
    Code2, 
    Terminal, 
    Sparkles, 
    Cpu, 
    Globe, 
    ShieldCheck, 
    ChevronDown,
    Layout,
    Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
    { id: "python", label: "Python", version: "3.10.0", defaultCode: "def fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\n# Print the first 10 Fibonacci numbers\nfor i in range(10):\n    print(f\"Fibonacci({i}) = {fibonacci(i)}\")", monaco: "python" },
    { id: "javascript", label: "JavaScript", version: "18.15.0", defaultCode: "function fibonacci(n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n// Print the first 10 Fibonacci numbers\nfor (let i = 0; i < 10; i++) {\n    console.log(`Fibonacci(${i}) = ${fibonacci(i)}`);\n}", monaco: "javascript" },
    { id: "java", label: "Java", version: "17.0.2", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 10; i++) {\n            System.out.println(\"Fibonacci(\" + i + \") = \" + fibonacci(i));\n        }\n    }\n\n    public static int fibonacci(int n) {\n        if (n <= 1) return n;\n        return fibonacci(n - 1) + fibonacci(n - 2);\n    }\n}", monaco: "java" },
    { id: "cpp", label: "C++", version: "10.2.0", defaultCode: "#include <iostream>\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nint main() {\n    for (int i = 0; i < 10; i++) {\n        std::cout << \"Fibonacci(\" << i << \") = \" << fibonacci(i) << std::endl;\n    }\n    return 0;\n}", monaco: "cpp" },
    { id: "c", label: "C", version: "10.2.0", defaultCode: "#include <stdio.h>\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nint main() {\n    for (int i = 0; i < 10; i++) {\n        printf(\"Fibonacci(%d) = %d\\n\", i, fibonacci(i));\n    }\n    return 0;\n}", monaco: "c" },
    { id: "html", label: "HTML/CSS", version: "latest", defaultCode: "<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f4f8; }\n        .card { background: white; padding: 2rem; border-radius: 1rem; shadow: 0 4px 6px rgba(0,0,0,0.1); }\n        h1 { color: #2563eb; }\n    </style>\n</head>\n<body>\n    <div class=\"card\">\n        <h1>Hello NGI!</h1>\n        <p>This is a live HTML/CSS preview.</p>\n    </div>\n</body>\n</html>", monaco: "html" }
];

export default function CodeCompiler() {
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [code, setCode] = useState(LANGUAGES[0].defaultCode);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [activeTab, setActiveTab] = useState<"editor" | "output">("editor");

    useEffect(() => {
        setCode(selectedLang.defaultCode);
        setOutput("");
        setShowPreview(false);
    }, [selectedLang]);

    const runCode = async () => {
        if (selectedLang.id === "html") {
            setShowPreview(true);
            setActiveTab("output");
            return;
        }

        setIsRunning(true);
        setOutput("Compiling and executing...");
        setActiveTab("output");

        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: selectedLang.id,
                    version: selectedLang.version,
                    files: [{ content: code }],
                }),
            });

            const data = await response.json();
            
            if (data.run) {
                const result = data.run.output || (data.run.stderr ? `Error: ${data.run.stderr}` : "Code executed successfully with no output.");
                setOutput(result);
            } else {
                setOutput("Execution failed. Please try again.");
            }
        } catch (error) {
            setOutput("Network error: Unable to connect to the execution server.");
        } finally {
            setIsRunning(false);
        }
    };

    const resetCode = () => {
        setCode(selectedLang.defaultCode);
        setOutput("");
        setShowPreview(false);
    };

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-20">
            {/* Control Panel */}
            <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <select 
                            value={selectedLang.id}
                            onChange={(e) => setSelectedLang(LANGUAGES.find(l => l.id === e.target.value) || LANGUAGES[0])}
                            className="w-full md:w-auto appearance-none bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-2.5 md:py-3.5 pr-10 md:pr-12 text-[12px] md:text-sm font-black text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all hover:bg-white"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.id} value={lang.id}>{lang.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-3.5 md:w-4 h-3.5 md:h-4 text-slate-400 pointer-events-none group-hover:text-primary transition-colors" />
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

                    <div className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                        <Cpu className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Env:</span>
                        <span className="text-[9px] md:text-[10px] font-black text-slate-900">{selectedLang.version}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                    <button 
                        onClick={resetCode}
                        className="p-3 md:p-3.5 rounded-xl md:rounded-2xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all flex items-center gap-2 group"
                        title="Reset Code"
                    >
                        <RotateCcw className="w-4 md:w-5 h-4 md:h-5 group-hover:-rotate-180 transition-transform duration-500" />
                    </button>
                    
                    <button 
                        onClick={runCode}
                        disabled={isRunning}
                        className={cn(
                            "flex-1 md:flex-none h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 shadow-xl shadow-primary/20",
                            selectedLang.id === "html" 
                                ? "bg-amber-500 text-white hover:bg-amber-600" 
                                : "bg-slate-950 text-white hover:bg-slate-800"
                        )}
                    >
                        {isRunning ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            selectedLang.id === "html" ? <Eye className="w-4 md:w-5 h-4 md:h-5" /> : <Play className="w-4 md:w-5 h-4 md:h-5" />
                        )}
                        <span className="hidden sm:inline">{selectedLang.id === "html" ? "Preview Layout" : "Execute Code"}</span>
                        <span className="sm:hidden">{selectedLang.id === "html" ? "Preview" : "Run"}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                <button 
                    onClick={() => setActiveTab("editor")}
                    className={cn(
                        "flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                        activeTab === "editor" ? "bg-white text-primary shadow-sm" : "text-slate-500"
                    )}
                >
                    <Code2 className="w-4 h-4" /> Editor
                </button>
                <button 
                    onClick={() => setActiveTab("output")}
                    className={cn(
                        "flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                        activeTab === "output" ? "bg-white text-primary shadow-sm" : "text-slate-500"
                    )}
                >
                    <Terminal className="w-4 h-4" /> Output
                </button>
            </div>

            {/* Editor & Output Grid */}
            <div className="grid lg:grid-cols-5 gap-6 md:gap-8 items-start">
                {/* Editor Surface */}
                <div className={cn("lg:col-span-3 space-y-4", activeTab !== "editor" && "hidden lg:block")}>
                    <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-4">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="flex gap-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                </div>
                                <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 md:ml-4">
                                    {selectedLang.label} Editor
                                </span>
                            </div>
                            <Code2 className="w-4 md:w-5 h-4 md:h-5 text-slate-700" />
                        </div>

                        <div className="h-[450px] md:h-[600px] rounded-[1.25rem] md:rounded-[1.5rem] overflow-hidden border border-white/5 bg-slate-950">
                            <Editor
                                height="100%"
                                language={selectedLang.monaco}
                                theme="vs-dark"
                                value={code}
                                loading={
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-950">
                                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing IDE...</p>
                                    </div>
                                }
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 14,
                                    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 20 },
                                    cursorSmoothCaretAnimation: "on",
                                    smoothScrolling: true,
                                    lineNumbersMinChars: 3,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Output Console / Preview */}
                <div className={cn("lg:col-span-2 space-y-4 h-full", activeTab !== "output" && "hidden lg:block")}>
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 border border-slate-100 shadow-xl h-full flex flex-col min-h-[500px] md:min-h-[700px]">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                                    {selectedLang.id === "html" ? <Layout className="w-4 md:w-5 h-4 md:h-5" /> : <Terminal className="w-4 md:w-5 h-4 md:h-5" />}
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase italic">
                                    {selectedLang.id === "html" ? "Live Preview" : "Console"}
                                </h3>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-4 md:p-6 font-mono text-[12px] md:text-sm overflow-hidden relative">
                            {showPreview && selectedLang.id === "html" ? (
                                <iframe 
                                    srcDoc={code}
                                    title="HTML Preview"
                                    className="w-full h-full border-none rounded-xl bg-white"
                                />
                            ) : (
                                <pre className={cn(
                                    "w-full h-full overflow-auto scrollbar-hide whitespace-pre-wrap leading-relaxed",
                                    output.includes("Error:") ? "text-rose-500" : "text-slate-600"
                                )}>
                                    {output || "No output to display. Click 'Execute Code' to run your program."}
                                </pre>
                            )}
                        </div>

                        {/* Status Footer */}
                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Cloud Backend</span>
                                </div>
                                <div className="w-[1px] h-3 bg-slate-200" />
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    <Globe className="w-3 h-3" />
                                    <span>v2.1.0</span>
                                </div>
                            </div>
                            <ShieldCheck className="w-5 h-5 text-slate-200" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
