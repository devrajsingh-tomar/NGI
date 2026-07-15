const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        
        const QuizSchema = new mongoose.Schema({
            title: String,
            isMockTest: Boolean,
            courseId: mongoose.Schema.Types.ObjectId,
            isPublished: Boolean,
            pricing: {
                type: String,
                amount: Number
            },
            questions: Array
        }, { collection: 'quizzes' });
        
        const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
        
        const quizzes = await Quiz.find({}).lean();
        console.log('Quizzes in DB:');
        console.log(quizzes.map(q => ({
            id: q._id.toString(),
            title: q.title,
            isMockTest: q.isMockTest,
            courseId: q.courseId ? q.courseId.toString() : null,
            isPublished: q.isPublished,
            pricing: q.pricing,
            questionsCount: q.questions ? q.questions.length : 0
        })));
        
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

check();
