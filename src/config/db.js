const mongoose = require('mongoose');
require('dotenv').config();
const createAdmin = require("../service/createAdmin");


async function  connectDB() {

    try {

        await mongoose.connect(process.env.MONGO_URI + "authentication");
        console.log("database connected");

        await createAdmin();
        
    } catch (error) {
        console.error("database failed to connect",error);

    }
    
}

module.exports = connectDB;
