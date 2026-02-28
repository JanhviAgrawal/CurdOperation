const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

mongoose.connect(URI).then(() => {
    console.log("MongoDB is connected..");
}).catch((error) => {
    console.log("MongoDB is not connected..", error);
});