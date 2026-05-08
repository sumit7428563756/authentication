const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone : {
        type : String,
        unique : true,
        require : true
    },

    otp : String,
    otpExpiry : Date,
},{
    timestamps : true
});

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;             


