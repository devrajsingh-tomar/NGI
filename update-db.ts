import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const CMSContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true, strict: false });

const CMSContent = mongoose.models.CMSContent || mongoose.model("CMSContent", CMSContentSchema);

async function run() {
    console.log("Connecting to MongoDB:", process.env.MONGODB_URI?.substring(0, 25) + "...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected.");

    // Update FOOTER
    const footer = await CMSContent.findOne({ key: "FOOTER" });
    if (footer) {
        console.log("Found FOOTER, updating contact info...");
        let data = footer.data || {};
        if (data.sections) {
            data.sections = data.sections.map((section: any) => {
                if (section.title === "Contact" || section.title === "Support" || section.title.toLowerCase().includes("contact")) {
                    section.links = [
                        { label: "Email: ngistudyzone@gmail.com", href: "mailto:ngistudyzone@gmail.com" },
                        { label: "Phone: +91 9919303047, 9919303032", href: "tel:+919919303047" }
                    ];
                }
                return section;
            });
        } else {
             data.sections = [
                 {
                     title: "Contact",
                     links: [
                         { label: "Email: ngistudyzone@gmail.com", href: "mailto:ngistudyzone@gmail.com" },
                         { label: "Phone: +91 9919303047, 9919303032", href: "tel:+919919303047" },
                     ],
                 }
             ];
        }
        footer.data = data;
        footer.markModified('data');
        await footer.save();
        console.log("FOOTER updated.");
    } else {
        console.log("FOOTER not found in DB. The default fallback will be used.");
    }

    mongoose.disconnect();
    console.log("Done.");
}

run().catch(console.error);
