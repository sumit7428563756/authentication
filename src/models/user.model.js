const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

     userId: {
        type: Number,
        unique: true
    },

    phone : {
        type : String,
        unique : true,
        required : true
    },

    name : String,

    username : String,
    
    age : String,

    email : String,

    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },

    password : String,

    isProfileCompleted : {
        type: Boolean,
        default : false,
    },

    otp : String,

    otpExpiry : Date,
},{
    timestamps : true
});

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;             


