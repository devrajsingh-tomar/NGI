const mongoose = require('mongoose');

const uri = "mongodb+srv://dorusgame_db_user:c8ch9VhqQW8sKZr@cluster0.q1y4bfd.mongodb.net/?appName=Cluster0";

mongoose.connect(uri).then(async () => {
    const exams = await mongoose.connection.db.collection('typingexams').aggregate([
        {
            $lookup: {
                from: "typingpassages",
                localField: "passageId",
                foreignField: "_id",
                as: "passageDetails"
            }
        }
    ]).toArray();
    console.log(JSON.stringify(exams, null, 2));
    mongoose.disconnect();
}).catch(err => console.error(err));
