const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({

      noteId: {
        type: Number,
        unique: true
    },

       userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    img : {
        type : String,
        required : true
    },
    
    title : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    date: {
        type : Date,
        default : Date.now
    },

    updateDate : {
        type : Date,
        default : Date.now
    }

    
});

module.exports = mongoose.model("note", noteSchema);