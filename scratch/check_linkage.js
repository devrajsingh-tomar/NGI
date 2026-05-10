import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        const TypingExam = mongoose.models.TypingExam || mongoose.model('TypingExam', new mongoose.Schema({ govExamId: mongoose.Schema.Types.ObjectId }));
        const GovExam = mongoose.models.GovExam || mongoose.model('GovExam', new mongoose.Schema({ title: String }));
        
        const exams = await TypingExam.find();
        const govs = await GovExam.find();
        
        console.log('Total Tests:', exams.length);
        console.log('Total Gov Exams:', govs.length);
        
        const linkedTests = exams.filter(e => e.govExamId);
        console.log('LinkedTests Count:', linkedTests.length);
        
        if (linkedTests.length > 0) {
            console.log('First linked test govExamId:', linkedTests[0].govExamId);
        }
        
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

check();
