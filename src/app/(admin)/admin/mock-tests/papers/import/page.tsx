"use client";

import React, { useState, useEffect } from "react";
import { 
    ChevronLeft, 
    FileUp, 
    Download, 
    AlertCircle, 
    CheckCircle2, 
    Database,
    Table as TableIcon,
    Loader2,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExcelJS from "exceljs";
import { bulkInsertQuestions } from "@/app/actions/questions";
import { getAllCourses } from "@/app/actions/courses";
import { createPaperSet } from "@/app/actions/paperSets";

export default function ImportPaperSetPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [importing, setImporting] = useState(false);

    // Paper Set Metadata Form
    const [formData, setFormData] = useState({
        name: "",
        courseId: "",
        examCode: "",
        subject: "",
        duration: 90,
        negativeMarking: true
    });

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getAllCourses();
            if (res.success) {
                setCourses(res.courses || []);
            }
        };
        fetchCourses();
    }, []);

    const excelToJson = async (file: File) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const buffer = await file.arrayBuffer();
            
            try {
                await workbook.xlsx.load(buffer);
            } catch (e) {
                throw new Error("Only .xlsx files are supported. Please save your file as .xlsx and try again.");
            }

            const worksheet = workbook.getWorksheet(1);
            if (!worksheet) return [];

            const data: any[] = [];
            const headers: string[] = [];
            
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                let val = cell.value;
                let headerValue = "";
                if (val && typeof val === 'object' && 'richText' in (val as any)) {
                    headerValue = (val as any).richText.map((rt: any) => rt.text).join("");
                } else if (val && typeof val === 'object' && 'result' in (val as any)) {
                    headerValue = (val as any).result?.toString() || "";
                } else {
                    headerValue = val ? val.toString().trim() : "";
                }
                headers[colNumber] = headerValue;
            });

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;
                const rowData: any = {};
                let hasData = false;
                
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    const header = headers[colNumber];
                    if (header) {
                        let value = cell.value;
                        if (value && typeof value === 'object') {
                            if ('result' in (value as any)) value = (value as any).result;
                            else if ('richText' in (value as any)) value = (value as any).richText.map((rt: any) => rt.text).join("");
                            else if ('text' in (value as any)) value = (value as any).text;
                        }
                        rowData[header] = value;
                        if (value !== null && value !== undefined && value !== '') hasData = true;
                    }
                });
                if (hasData) {
                    rowData.__rowNum = rowNumber;
                    data.push(rowData);
                }
            });
            return data;
        } catch (err: any) {
            throw new Error(err.message || "Failed to parse Excel file.");
        }
    };

    const getValueCaseInsensitive = (row: any, keys: string[]) => {
        const rowKeys = Object.keys(row);
        for (const targetKey of keys) {
            const foundKey = rowKeys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === targetKey.toLowerCase().replace(/[^a-z0-9]/g, ''));
            if (foundKey) return row[foundKey];
        }
        return undefined;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFile(selectedFile);

        try {
            const data = await excelToJson(selectedFile);
            setPreviewData(data);
            toast.success(`Successfully parsed ${data.length} questions from Excel file.`);
        } catch (err: any) {
            toast.error(err.message);
            setFile(null);
            setPreviewData([]);
        }
    };

    const mapType = (typeStr: string | undefined) => {
        if (!typeStr) return "MCQ_SINGLE";
        const t = typeStr.toUpperCase().replace(/\s+/g, "_");
        if (t.includes("SINGLE") || t.includes("MCQ")) return "MCQ_SINGLE";
        if (t.includes("MULTIPLE")) return "MCQ_MULTIPLE";
        if (t.includes("TRUE") || t.includes("BOOL")) return "TRUE_FALSE";
        if (t.includes("NUMERIC") || t.includes("NUMBER")) return "NUMERIC";
        if (t.includes("MATCH")) return "MATCH_THE_FOLLOWING";
        if (t.includes("ASSERTION")) return "ASSERTION_REASON";
        if (t.includes("SHORT")) return "SHORT_ANSWER";
        if (t.includes("DESCRIPTIVE")) return "DESCRIPTIVE";
        if (t.includes("TYPING")) return "TYPING";
        return "MCQ_SINGLE";
    };

    const checkCorrect = (row: any, label: string, providedAnswer?: any) => {
        const answer = providedAnswer || getValueCaseInsensitive(row, ["CorrectAnswer", "Correct Answer", "Answer"]);
        if (!answer) return false;
        const correctStr = String(answer).toUpperCase();
        return correctStr.includes(label) || (correctStr === label);
    };

    const handleImport = async () => {
        if (!formData.name) {
            toast.error("Please fill in the Paper Set Name.");
            return;
        }
        if (!file || previewData.length === 0) {
            toast.error("Please upload a valid Excel file containing questions.");
            return;
        }

        setImporting(true);
        try {
            const validExamCodes = ["M1-R5.1", "M2-R5.1", "M3-R5.1", "M4-R5.1", "M1-R5", "M2-R5", "M3-R5", "M4-R5"];
            let totalMarks = 0;

            const formattedQuestions = previewData.map((row) => {
                const rowNum = row.__rowNum;
                
                const questionText = getValueCaseInsensitive(row, ["Question", "Content", "Q"]);
                const typeRaw = getValueCaseInsensitive(row, ["Type", "QuestionType", "QType"]);
                let examCodeRaw = getValueCaseInsensitive(row, ["ExamCode", "Exam Code", "Code"]);
                const subject = getValueCaseInsensitive(row, ["Subject", "Sub"]);
                const topic = getValueCaseInsensitive(row, ["Topic", "Unit"]);
                const difficulty = getValueCaseInsensitive(row, ["Difficulty", "Level"]);
                const marks = getValueCaseInsensitive(row, ["Marks"]);
                const negMarks = getValueCaseInsensitive(row, ["NegativeMarks", "Negative Marks"]);
                const explanation = getValueCaseInsensitive(row, ["Explanation", "Solution"]);
                const correctAnswer = getValueCaseInsensitive(row, ["CorrectAnswer", "Correct Answer", "Answer"]);
                
                if (!questionText) throw new Error(`Row ${rowNum}: Question text is missing.`);

                let finalExamCode = formData.examCode || undefined;
                if (examCodeRaw) {
                    const cleanedCode = examCodeRaw.toString().toUpperCase().trim().replace(/[^A-Z0-9-.]/g, '');
                    const matched = validExamCodes.find(v => 
                        v === cleanedCode || 
                        v.replace('-', '') === cleanedCode || 
                        v === cleanedCode.replace(/(\D)(\d)/, '$1-$2')
                    );
                    if (matched) finalExamCode = matched;
                }

                const questType = mapType(typeRaw?.toString());
                const questionMarks = Number(marks) || 1;
                totalMarks += questionMarks;

                return {
                    courseId: formData.courseId || undefined,
                    examCode: finalExamCode,
                    subject: subject || formData.subject || "General",
                    topic: topic || "Uncategorized",
                    type: questType,
                    difficulty: (difficulty?.toString() || "MEDIUM").toUpperCase(),
                    content: { en: questionText.toString() },
                    marks: questionMarks,
                    negativeMarks: Number(negMarks) || 0,
                    explanation: { en: explanation?.toString() || "" },
                    assertion: { en: getValueCaseInsensitive(row, ["Assertion", "A_Stmt"])?.toString() || "" },
                    reason: { en: getValueCaseInsensitive(row, ["Reason", "R_Stmt"])?.toString() || "" },
                    shortAnswer: getValueCaseInsensitive(row, ["ShortAnswer", "Passage", "AnswerText"])?.toString() || "",
                    numericAnswer: Number(getValueCaseInsensitive(row, ["NumericAnswer", "Value"])) || undefined,
                    options: [
                        { 
                            text: { en: getValueCaseInsensitive(row, ["OptionA", "Option A", "A"])?.toString() }, 
                            pair: { en: getValueCaseInsensitive(row, ["MatchPairA", "PairA", "MatchA"])?.toString() },
                            isCorrect: checkCorrect(row, "A", correctAnswer) 
                        },
                        { 
                            text: { en: getValueCaseInsensitive(row, ["OptionB", "Option B", "B"])?.toString() }, 
                            pair: { en: getValueCaseInsensitive(row, ["MatchPairB", "PairB", "MatchB"])?.toString() },
                            isCorrect: checkCorrect(row, "B", correctAnswer) 
                        },
                        { 
                            text: { en: getValueCaseInsensitive(row, ["OptionC", "Option C", "C"])?.toString() }, 
                            pair: { en: getValueCaseInsensitive(row, ["MatchPairC", "PairC", "MatchC"])?.toString() },
                            isCorrect: checkCorrect(row, "C", correctAnswer) 
                        },
                        { 
                            text: { en: getValueCaseInsensitive(row, ["OptionD", "Option D", "D"])?.toString() }, 
                            pair: { en: getValueCaseInsensitive(row, ["MatchPairD", "PairD", "MatchD"])?.toString() },
                            isCorrect: checkCorrect(row, "D", correctAnswer) 
                        },
                        { 
                            text: { en: getValueCaseInsensitive(row, ["OptionE", "Option E", "E"])?.toString() }, 
                            pair: { en: getValueCaseInsensitive(row, ["MatchPairE", "PairE", "MatchE"])?.toString() },
                            isCorrect: checkCorrect(row, "E", correctAnswer) 
                        },
                    ].filter(o => o.text.en),
                };
            });

            // 1. Insert all parsed questions
            const qRes = await bulkInsertQuestions(formattedQuestions);
            if (!qRes.success || !qRes.ids) {
                throw new Error(qRes.error || "Failed to insert questions into the database.");
            }

            // 2. Create the Paper Set blueprint using the new question IDs
            const paperSetPayload = {
                name: formData.name,
                courseId: formData.courseId || undefined,
                examCode: formData.examCode || undefined,
                subject: formData.subject || "General",
                totalQuestions: qRes.count,
                totalMarks: totalMarks,
                duration: Number(formData.duration),
                negativeMarking: formData.negativeMarking,
                questions: qRes.ids
            };

            const pRes = await createPaperSet(paperSetPayload);
            if (pRes.success) {
                toast.success(`Successfully imported ${qRes.count} questions and created Paper Set Blueprint "${formData.name}"!`);
                router.push("/admin/mock-tests/papers");
            } else {
                throw new Error(pRes.error || "Failed to create Paper Set blueprint.");
            }

        } catch (err: any) {
            toast.error(err.message || "An error occurred during import.");
        } finally {
            setImporting(false);
        }
    };

    const downloadSample = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Universal Template");

        worksheet.columns = [
            { header: "Question", key: "Question", width: 40 },
            { header: "Type", key: "Type", width: 18 },
            { header: "Option A", key: "OptionA", width: 20 },
            { header: "Option B", key: "OptionB", width: 20 },
            { header: "Option C", key: "OptionC", width: 20 },
            { header: "Option D", key: "OptionD", width: 20 },
            { header: "MatchPairA", key: "MatchPairA", width: 20 },
            { header: "MatchPairB", key: "MatchPairB", width: 20 },
            { header: "MatchPairC", key: "MatchPairC", width: 20 },
            { header: "MatchPairD", key: "MatchPairD", width: 20 },
            { header: "Assertion", key: "Assertion", width: 30 },
            { header: "Reason", key: "Reason", width: 30 },
            { header: "Correct Answer", key: "CorrectAnswer", width: 15 },
            { header: "ShortAnswer", key: "ShortAnswer", width: 30 },
            { header: "NumericAnswer", key: "NumericAnswer", width: 15 },
            { header: "Explanation", key: "Explanation", width: 30 },
            { header: "Marks", key: "Marks", width: 10 },
            { header: "Negative Marks", key: "NegMarks", width: 15 },
            { header: "Subject", key: "Subject", width: 15 },
            { header: "Topic", key: "Topic", width: 15 },
            { header: "Difficulty", key: "Difficulty", width: 12 },
            { header: "Exam Code", key: "ExamCode", width: 12 },
        ];

        worksheet.addRow({
            Question: "Which of the following is an input device?",
            Type: "MCQ_SINGLE",
            OptionA: "Monitor", OptionB: "Keyboard", OptionC: "Printer", OptionD: "Speaker",
            CorrectAnswer: "B",
            Explanation: "Keyboard is used to input text and commands.",
            Marks: 1, NegMarks: 0.25, Subject: "Computer", Topic: "Hardware", Difficulty: "EASY"
        });

        worksheet.addRow({
            Question: "RAM is a volatile memory.",
            Type: "TRUE_FALSE",
            CorrectAnswer: "True",
            Explanation: "RAM loses its data when power is turned off.",
            Marks: 1, NegMarks: 0.25, Subject: "Computer", Topic: "Memory", Difficulty: "EASY"
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const saveAs = (await import("file-saver")).default;
        saveAs(blob, "paper_set_question_import_sample.xlsx");
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-500 space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/admin/mock-tests/papers">
                    <Button variant="ghost" className="rounded-xl gap-2">
                        <ChevronLeft className="w-5 h-5" /> Back to Blueprints
                    </Button>
                </Link>
                <Button variant="outline" className="rounded-xl gap-2 font-bold" onClick={downloadSample}>
                    <Download className="w-5 h-5" /> Download Sample File
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Form Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-1">
                                <Database className="w-5 h-5 text-primary" />
                                Blueprint Details
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Metadata details for your Paper Set</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Blueprint Name *</Label>
                                <Input 
                                    className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold" 
                                    placeholder="e.g. M1-R5 Mock 1"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Target Course (Optional)</Label>
                                <select 
                                    className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 font-bold text-slate-700 outline-none"
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course._id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Paper / Exam Code (Optional)</Label>
                                <select 
                                    className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 font-bold text-slate-700 outline-none"
                                    value={formData.examCode}
                                    onChange={(e) => setFormData({ ...formData, examCode: e.target.value })}
                                >
                                    <option value="">Select Exam Code</option>
                                    <option value="M1-R5.1">M1-R5.1</option>
                                    <option value="M2-R5.1">M2-R5.1</option>
                                    <option value="M3-R5.1">M3-R5.1</option>
                                    <option value="M4-R5.1">M4-R5.1</option>
                                    <option value="M1-R5">M1-R5</option>
                                    <option value="M2-R5">M2-R5</option>
                                    <option value="M3-R5">M3-R5</option>
                                    <option value="M4-R5">M4-R5</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Primary Subject (Optional)</Label>
                                <Input 
                                    className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold" 
                                    placeholder="e.g. IT Tools"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Duration (Min)</Label>
                                    <Input 
                                        type="number"
                                        className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold" 
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col justify-end pb-1">
                                    <Label className="font-bold text-slate-700 mb-2">Negative Mark?</Label>
                                    <div className="flex items-center h-12">
                                        <Switch 
                                            checked={formData.negativeMarking}
                                            onCheckedChange={(checked) => setFormData({ ...formData, negativeMarking: checked })}
                                        />
                                        <span className="text-xs font-bold text-slate-500 ml-2">
                                            {formData.negativeMarking ? "ACTIVE" : "DISABLED"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform"
                            onClick={handleImport}
                            disabled={importing || previewData.length === 0}
                        >
                            {importing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Import & Create Blueprint
                        </Button>
                    </div>
                </div>

                {/* Right Upload Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-6 flex flex-col h-[600px]">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-1">
                                <FileUp className="w-5 h-5 text-primary" />
                                Upload Questions Spreadsheet
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Format: .xlsx only</p>
                        </div>

                        {!file ? (
                            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 hover:border-primary/30 transition-colors relative cursor-pointer group">
                                <input 
                                    type="file" 
                                    accept=".xlsx, .xls"
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                    <FileUp className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="font-bold text-slate-700">Drag & Drop or Click to Upload</p>
                                <p className="text-xs text-slate-400 mt-1">Accepts standard .xlsx template sheets</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 space-y-4">
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{file.name}</p>
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{previewData.length} Questions Loaded</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => { setFile(null); setPreviewData([]); }}
                                        className="text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl"
                                    >
                                        Remove
                                    </Button>
                                </div>

                                <div className="flex-1 border border-slate-100 rounded-2xl overflow-hidden flex flex-col min-h-0">
                                    <div className="bg-slate-50 p-4 border-b flex items-center justify-between shrink-0">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <TableIcon className="w-4 h-4" />
                                            Spreadsheet Preview
                                        </p>
                                    </div>
                                    <div className="flex-1 overflow-auto p-4 custom-scrollbar space-y-3">
                                        {previewData.map((row, idx) => {
                                            const question = getValueCaseInsensitive(row, ["Question", "Content", "Q"]);
                                            const type = getValueCaseInsensitive(row, ["Type", "QuestionType", "QType"]) || "MCQ_SINGLE";
                                            const marks = getValueCaseInsensitive(row, ["Marks"]) || 1;
                                            return (
                                                <div key={idx} className="p-4 bg-slate-50 border rounded-xl space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="px-2 py-0.5 bg-primary/10 text-primary font-black uppercase text-[8px] tracking-wider rounded">
                                                            {type}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-400">
                                                            Marks: +{marks}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-700 leading-relaxed line-clamp-2">
                                                        {question}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
