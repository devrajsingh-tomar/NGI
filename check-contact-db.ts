import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const CmsPageSchema = new mongoose.Schema({
    page_name: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sections: { type: Array, default: [] }
}, { timestamps: true, strict: false });

const CmsPage = mongoose.models.CmsPage || mongoose.model("CmsPage", CmsPageSchema);

async function run() {
    console.log("Connecting to MongoDB:", process.env.MONGODB_URI?.substring(0, 25) + "...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected.");

    // Update CONTACT Page
    const page = await CmsPage.findOne({ page_name: "contact" });
    if (page) {
        console.log("Found CONTACT page, checking for ContactSection...");
        let updated = false;
        
        // Find if they have a section for contact
        if (page.sections && page.sections.length > 0) {
            // We can't really reliably auto-update the contact block because it's custom blocks.
            // But if it's the standard static fallback, it's not in DB yet.
            console.log("Contact page has sections. The user should manage this in the Admin Panel.");
        } else {
            console.log("No sections found in Contact page, it's using static fallback.");
        }
    } else {
        console.log("CONTACT page not found in DB. The default fallback will be used.");
    }

    mongoose.disconnect();
    console.log("Done.");
}

run().catch(console.error);
