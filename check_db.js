const mongoose = require('mongoose');

const uri = "mongodb+srv://dorusgame_db_user:c8ch9VhqQW8sKZr@cluster0.q1y4bfd.mongodb.net/?appName=Cluster0";

mongoose.connect(uri).then(async () => {
    console.log("Connected");
    const exams = await mongoose.connection.db.collection('typingexams').find().toArray();
    console.log("Exams:");
    console.log(JSON.stringify(exams, null, 2));
    
    const passages = await mongoose.connection.db.collection('typingpassages').find().toArray();
    console.log("Passages:");
    console.log(JSON.stringify(passages, null, 2));
    
    mongoose.disconnect();
}).catch(err => console.error(err));
