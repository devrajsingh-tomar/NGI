import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        
        const TypingExam = mongoose.models.TypingExam || mongoose.model('TypingExam', new mongoose.Schema({ language: String, difficulty: String, govExamId: mongoose.Schema.Types.ObjectId }));
        const TypingPassage = mongoose.models.TypingPassage || mongoose.model('TypingPassage', new mongoose.Schema({ language: String }));
        
        const exams = await TypingExam.find().limit(5);
        const passages = await TypingPassage.find().limit(5);
        
        const languages = await TypingExam.distinct('language');
        const diffs = await TypingExam.distinct('difficulty');
        const passageLangs = await TypingPassage.distinct('language');
        
        console.log('Languages in Exams:', languages);
        console.log('Difficulties in Exams:', diffs);
        console.log('Languages in Passages:', passageLangs);
        
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

check();
