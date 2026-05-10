const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function repair() {
    try {
        await mongoose.connect(MONGODB_URI);
        const GovExam = mongoose.models.GovExam || mongoose.model('GovExam', new mongoose.Schema({ title: String, slug: String, active: Boolean }));
        const TypingExam = mongoose.models.TypingExam || mongoose.model('TypingExam', new mongoose.Schema({ 
            title: String, 
            category: String, 
            status: String, 
            govExamId: mongoose.Schema.Types.ObjectId,
            difficulty: String,
            language: String
        }));

        console.log("Starting DB Repair...");

        await GovExam.updateMany({}, { $set: { active: true } });

        const exams = await GovExam.find();
        const examMap = {};
        exams.forEach(e => {
            if (e.title) examMap[e.title.toUpperCase()] = e._id;
        });

        const tests = await TypingExam.find();
        let updatedCount = 0;

        for (const test of tests) {
            const updates = { status: "Active" };
            
            if (test.category) {
                const govId = examMap[test.category.toUpperCase()];
                if (govId) {
                    updates.govExamId = govId;
                }
            }

            if (!test.difficulty) {
                updates.difficulty = "Medium";
            }

            if (!test.language) {
                updates.language = "English";
            }

            await TypingExam.updateOne({ _id: test._id }, { $set: updates });
            updatedCount++;
        }

        console.log(`Repaired ${updatedCount} tests.`);
        
        const TypingDifficulty = mongoose.models.TypingDifficulty || mongoose.model('TypingDifficulty', new mongoose.Schema({ 
            name: String,
            expectedWpm: String,
            wordCountRange: String,
            complexity: String,
            color: String
        }));
        
        const diffs = await TypingDifficulty.find();
        if (diffs.length === 0) {
            const defaults = [
                { name: "Easy", expectedWpm: "25-35", wordCountRange: "250-350", complexity: "Beginner", color: "emerald" },
                { name: "Medium", expectedWpm: "35-45", wordCountRange: "350-500", complexity: "Standard", color: "amber" },
                { name: "Hard", expectedWpm: "45+", wordCountRange: "500+", complexity: "Advanced", color: "rose" }
            ];
            await TypingDifficulty.insertMany(defaults);
            console.log("Seeded Difficulties.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

repair();
