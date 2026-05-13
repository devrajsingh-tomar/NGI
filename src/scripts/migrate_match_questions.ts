import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../lib/db';
import Question, { QuestionType } from '../models/Question';

dotenv.config({ path: '.env.local' });

async function migrate() {
    try {
        await connectDB();
        console.log('Connected to database...');

        const questions = await Question.find({ type: QuestionType.MATCH_THE_FOLLOWING });
        console.log(`Found ${questions.length} Match the Following questions.`);

        for (const q of questions) {
            // Check if matchMatrix is empty and options have pairs
            if ((!q.matchMatrix || q.matchMatrix.length === 0) && q.options && q.options.length > 0) {
                const matrix = q.options.filter(o => o.pair && o.pair.en).map(o => ({
                    left: { en: o.text.en, hi: o.text.hi },
                    right: { en: o.pair?.en, hi: o.pair?.hi }
                }));

                if (matrix.length > 0) {
                    console.log(`Migrating matrix for question: ${q._id}`);
                    q.matchMatrix = matrix;
                    
                    // We keep the options for now so they don't lose data, 
                    // but they should add actual A/B/C/D options in the UI.
                    // Actually, if we leave them in options, they will show up as A, B, C choices.
                    // That's what the user complained about. 
                    // But we don't know the correct sequences yet.
                    
                    await q.save();
                }
            }
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
