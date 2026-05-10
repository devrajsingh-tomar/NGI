import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb://localhost:27017/ngit-new'; // Assuming this is the URI

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        const GovExam = mongoose.model('GovExam', new mongoose.Schema({ title: String }));
        const TypingExam = mongoose.model('TypingExam', new mongoose.Schema({ govExamId: mongoose.Schema.Types.ObjectId, status: String }));
        
        const govs = await GovExam.find();
        console.log('Gov Exams:', JSON.stringify(govs, null, 2));
        
        const tests = await TypingExam.find();
        console.log('Typing Exams:', JSON.stringify(tests, null, 2));
        
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

check();
