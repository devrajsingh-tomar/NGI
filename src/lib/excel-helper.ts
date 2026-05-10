import ExcelJS from "exceljs";

export async function parseExcelQuestions(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) throw new Error("Worksheet not found");

  const questions: any[] = [];
  const errors: any[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    try {
      const rowData: any = {
        examName: row.getCell(1).value?.toString(),
        type: row.getCell(2).value?.toString(),
        question_en: row.getCell(3).value?.toString(),
        question_hi: row.getCell(4).value?.toString(),
        optionA: row.getCell(5).value?.toString(),
        optionB: row.getCell(6).value?.toString(),
        optionC: row.getCell(7).value?.toString(),
        optionD: row.getCell(8).value?.toString(),
        correctAnswer: row.getCell(9).value?.toString(),
        difficulty: row.getCell(10).value?.toString() || "MEDIUM",
        language: row.getCell(11).value?.toString() || "en",
        explanation: row.getCell(12).value?.toString(),
        match_pairs: row.getCell(13).value?.toString(),
        assertion: row.getCell(14).value?.toString(),
        reason: row.getCell(15).value?.toString(),
        typing_passage: row.getCell(16).value?.toString(),
      };

      const transformed = transformRowToQuestion(rowData, rowNumber);
      questions.push(transformed);
    } catch (error: any) {
      errors.push({ row: rowNumber, message: error.message });
    }
  });

  return { questions, errors };
}

function transformRowToQuestion(row: any, rowNumber: number) {
  if (!row.type) throw new Error("Missing question type");
  if (!row.question_en) throw new Error("Missing English question content");

  const base: any = {
    type: row.type,
    difficulty: row.difficulty,
    content: {
      en: row.question_en,
      hi: row.question_hi || "",
    },
    marks: 4,
    negativeMarks: 1,
    explanation: {
      en: row.explanation || "",
    },
    topic: row.examName || "General",
    subject: row.examName || "General",
    examCode: "M1-R5.1", // Default or map from examName
  };

  switch (row.type) {
    case "SINGLE_MCQ":
    case "MCQ_SINGLE": {
      if (!row.optionA || !row.optionB) throw new Error("MCQ requires at least Option A and B");
      if (!row.correctAnswer) throw new Error("MCQ requires correctAnswer (A, B, C, or D)");
      
      const options = [
        { text: { en: row.optionA }, isCorrect: row.correctAnswer === "A" },
        { text: { en: row.optionB }, isCorrect: row.correctAnswer === "B" },
        { text: { en: row.optionC || "" }, isCorrect: row.correctAnswer === "C" },
        { text: { en: row.optionD || "" }, isCorrect: row.correctAnswer === "D" },
      ].filter(o => o.text.en);
      
      base.type = "MCQ_SINGLE";
      base.options = options;
      break;
    }

    case "MULTI_MCQ":
    case "MCQ_MULTIPLE": {
      if (!row.optionA || !row.optionB) throw new Error("MCQ requires at least Option A and B");
      if (!row.correctAnswer) throw new Error("MULTI_MCQ requires correctAnswer (e.g., A,C)");
      
      const correctOptions = row.correctAnswer.split(",").map((s: string) => s.trim());
      const options = [
        { text: { en: row.optionA }, isCorrect: correctOptions.includes("A") },
        { text: { en: row.optionB }, isCorrect: correctOptions.includes("B") },
        { text: { en: row.optionC || "" }, isCorrect: correctOptions.includes("C") },
        { text: { en: row.optionD || "" }, isCorrect: correctOptions.includes("D") },
      ].filter(o => o.text.en);
      
      base.type = "MCQ_MULTIPLE";
      base.options = options;
      break;
    }

    case "TRUE_FALSE": {
      if (!row.correctAnswer) throw new Error("TRUE_FALSE requires correctAnswer (A or B)");
      base.type = "TRUE_FALSE";
      base.options = [
        { text: { en: "True" }, isCorrect: row.correctAnswer === "A" || row.correctAnswer.toLowerCase() === "true" },
        { text: { en: "False" }, isCorrect: row.correctAnswer === "B" || row.correctAnswer.toLowerCase() === "false" },
      ];
      break;
    }

    case "NUMERIC": {
      if (!row.correctAnswer) throw new Error("NUMERIC requires correctAnswer (number)");
      base.type = "NUMERIC";
      base.numericAnswer = parseFloat(row.correctAnswer);
      break;
    }

    case "SHORT":
    case "SHORT_ANSWER": {
      base.type = "SHORT_ANSWER";
      base.shortAnswer = row.correctAnswer || "";
      break;
    }

    case "DESCRIPTIVE": {
      base.type = "DESCRIPTIVE";
      break;
    }

    case "MATCH":
    case "MATCH_THE_FOLLOWING": {
      if (!row.match_pairs) throw new Error("MATCH requires match_pairs JSON");
      base.type = "MATCH_THE_FOLLOWING";
      try {
        const pairs = typeof row.match_pairs === 'string' ? JSON.parse(row.match_pairs) : row.match_pairs;
        // Map pairs to options
        base.options = Object.entries(pairs).map(([key, val]) => ({
          text: { en: key },
          pair: { en: val.toString() },
          isCorrect: true
        }));
      } catch (e) {
        throw new Error("Invalid match_pairs JSON format");
      }
      break;
    }

    case "ASSERTION_REASON": {
      if (!row.assertion || !row.reason) throw new Error("ASSERTION_REASON requires assertion and reason columns");
      base.type = "ASSERTION_REASON";
      base.assertion = { en: row.assertion };
      base.reason = { en: row.reason };
      // Map A=0, B=1, C=2, D=3
      const answerMap: any = { "A": 0, "B": 1, "C": 2, "D": 3 };
      base.numericAnswer = answerMap[row.correctAnswer] !== undefined ? answerMap[row.correctAnswer] : 0;
      break;
    }

    case "TYPING": {
      if (!row.typing_passage) throw new Error("TYPING requires typing_passage");
      base.type = "TYPING";
      base.shortAnswer = row.typing_passage;
      break;
    }

    default:
      throw new Error(`Unsupported question type: ${row.type}`);
  }

  return base;
}

export async function generateSampleTemplate() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Questions");

  worksheet.columns = [
    { header: "examName", key: "examName", width: 15 },
    { header: "type", key: "type", width: 15 },
    { header: "question_en", key: "question_en", width: 30 },
    { header: "question_hi", key: "question_hi", width: 30 },
    { header: "optionA", key: "optionA", width: 15 },
    { header: "optionB", key: "optionB", width: 15 },
    { header: "optionC", key: "optionC", width: 15 },
    { header: "optionD", key: "optionD", width: 15 },
    { header: "correctAnswer", key: "correctAnswer", width: 15 },
    { header: "difficulty", key: "difficulty", width: 15 },
    { header: "language", key: "language", width: 15 },
    { header: "explanation", key: "explanation", width: 30 },
    { header: "match_pairs", key: "match_pairs", width: 30 },
    { header: "assertion", key: "assertion", width: 30 },
    { header: "reason", key: "reason", width: 30 },
    { header: "typing_passage", key: "typing_passage", width: 30 },
  ];

  // Add examples for each type
  worksheet.addRow(["O Level", "SINGLE_MCQ", "What is CPU?", "CPU क्या है?", "Processor", "Memory", "Storage", "Input", "A", "EASY", "en", "Central Processing Unit"]);
  worksheet.addRow(["O Level", "MULTI_MCQ", "Select Input Devices", "", "Mouse", "Keyboard", "Monitor", "Printer", "A,B", "MEDIUM", "en"]);
  worksheet.addRow(["General", "TRUE_FALSE", "Is HTML a programming language?", "", "True", "False", "", "", "B", "EASY", "en"]);
  worksheet.addRow(["Maths", "NUMERIC", "5 + 5 = ?", "", "", "", "", "", "10", "EASY", "en"]);
  worksheet.addRow(["English", "SHORT", "Synonym of 'Happy'", "", "", "", "", "", "Joyful", "MEDIUM", "en"]);
  worksheet.addRow(["O Level", "MATCH", "Match Hardware", "", "", "", "", "", "", "HARD", "en", "", '{"Mouse":"Input", "Monitor":"Output"}']);
  worksheet.addRow(["Science", "ASSERTION_REASON", "Assertion content", "", "", "", "", "", "A", "MEDIUM", "en", "", "", "Water is liquid", "It has hydrogen"]);
  worksheet.addRow(["Typing", "TYPING", "Type this paragraph", "", "", "", "", "", "", "MEDIUM", "en", "", "", "", "", "The quick brown fox jumps over the lazy dog."]);

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
