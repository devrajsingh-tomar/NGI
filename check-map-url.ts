import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const CMSContentBlockSchema = new mongoose.Schema({
    section_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String },
    extra_data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, strict: false });

const CMSContentBlock = mongoose.models.CMSContentBlock || mongoose.model("CMSContentBlock", CMSContentBlockSchema);

async function run() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected.");

    const blocks = await CMSContentBlock.find({});
    for (const block of blocks) {
        let extra = block.extra_data;
        if (typeof extra === 'string') {
            try { extra = JSON.parse(extra); } catch(e) {}
        }
        if (extra && extra.map_url) {
            console.log("Found block with map_url:", extra.map_url);
        }
    }

    mongoose.disconnect();
    console.log("Done.");
}

run().catch(console.error);
