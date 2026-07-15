const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        
        const CourseSchema = new mongoose.Schema({
            title: String,
            slug: String,
            isPublished: Boolean
        }, { collection: 'courses' });
        
        const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
        
        const courses = await Course.find({}).lean();
        console.log('Courses in DB:');
        console.log(courses.map(c => ({
            id: c._id.toString(),
            title: c.title,
            slug: c.slug,
            isPublished: c.isPublished
        })));
        
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

check();
