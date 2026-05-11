
import dbConnect from "./src/lib/db";
import CMSContent from "./src/models/CMSContent";

async function checkLayout() {
    await dbConnect();
    const footer = await CMSContent.findOne({ key: "footer" });
    console.log("FOOTER DATA:", JSON.stringify(footer, null, 2));
    process.exit(0);
}

checkLayout();
