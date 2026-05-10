import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        const GovExam = mongoose.models.GovExam || mongoose.model('GovExam', new mongoose.Schema({ title: String, slug: String, active: Boolean, description: String }));
        
        const requestedGovExams = ["AHC", "SSC", "UP Police", "UPSSSC", "KVS", "Railways", "CPCT", "Court Typing", "Steno"];
        for (const title of requestedGovExams) {
            const slug = title.toLowerCase().replace(/\s+/g, '-');
            const exists = await GovExam.findOne({ slug });
            if (!exists) {
                await GovExam.create({ 
                    title, 
                    slug,
                    active: true,
                    description: `Official typing pattern tests for ${title}.`
                });
                console.log(`Seeded: ${title}`);
            } else {
                console.log(`Exists: ${title}`);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
