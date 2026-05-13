const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({

      noteId: {
        type: Number,
        unique: true
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
        default : Date
    }

    
});

module.exports = mongoose.model("note", noteSchema);