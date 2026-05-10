import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

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

        // 1. Ensure all GovExams are active
        await GovExam.updateMany({}, { $set: { active: true } });

        // 2. Fetch all GovExams for mapping
        const exams = await GovExam.find();
        const examMap = Object.fromEntries(exams.map(e => [e.title.toUpperCase(), e._id]));

        // 3. Update TypingExams
        const tests = await TypingExam.find();
        let updatedCount = 0;

        for (const test of tests) {
            const updates: any = { status: "Active" };
            
            // Link to GovExam if matching category
            if (test.category) {
                const govId = examMap[test.category.toUpperCase()];
                if (govId) {
                    updates.govExamId = govId;
                }
            }

            // Set default difficulty if missing
            if (!test.difficulty) {
                updates.difficulty = "Medium";
            }

            // Fix language if missing or old format
            if (!test.language) {
                updates.language = "English";
            }

            await TypingExam.updateOne({ _id: test._id }, { $set: updates });
            updatedCount++;
        }

        console.log(`Repaired ${updatedCount} tests.`);
        
        // 4. Force seed missing difficulties
        const TypingDifficulty = mongoose.models.TypingDifficulty || mongoose.model('TypingDifficulty', new mongoose.Schema({ name: String }));
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
