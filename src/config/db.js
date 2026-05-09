const mongoose = require('mongoose');
require('dotenv').config();


async function  connectDB() {

    try {

        await mongoose.connect(process.env.MONGO_URI + "authentication");
        console.log("database connected");
        
    } catch (error) {
        console.error("database failed to connect",error);

    }
    
}

module.exports = connectDB;
