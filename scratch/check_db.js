import mongoose from 'mongoose';
import connectDB from './src/lib/db.js';
import TypingExam from './src/models/TypingExam.js';
import GovExam from './src/models/GovExam.js';

async function check() {
    await connectDB();
    const govExams = await GovExam.find();
    console.log('Gov Exams:', govExams.map(g => ({ id: g._id, title: g.title })));
    
    const typingExams = await TypingExam.find();
    console.log('Typing Exams:', typingExams.map(t => ({ id: t._id, govExamId: t.govExamId, status: t.status })));
    
    process.exit(0);
}

check();
