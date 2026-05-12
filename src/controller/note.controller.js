const Note = require("../models/note.model");


exports.createNote = async (req,res) => {

    try {

        const { img, title, description } = req.body;

        if(!img || !title || !description){
          return res.status(400).json({
            message : "Required fields are missing"
          });
        }

          const lastNote = await Note.findOne().sort({ noteId: -1 });

         const newId = lastNote ? lastNote.noteId + 1 : 1;


        const note = await Note.create({
            noteId: newId,
            img,
            title,
            description
     } )

      return res.status(201).json({
            message: "Note created successfully",
            note : {
                id : note.noteId,
                img : note.img,
                title : note.title,
                description : note.description,
                date : note.date
            }
        });
        
    } catch (error) {
        res.status(500).json({
           message : "server error" + error.message
        })
    }

}


exports.getNotes = async (req,res) => {

    try {

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        const skip = (page - 1) * limit;

        const notes = await Note.find().sort({noteId : -1}).skip(skip).limit(limit);

        if(notes.length === 0){

            return res.status(400).json({
                message : "Notes are empty",
                notes : []
            });
        }
        

        res.status(200).json({
            message : "notes fetched successfully",
            notes: notes.map((note) => ({
                id: note.noteId,
                img: note.img,
                title: note.title,
                description: note.description,
                date : note.date
            }))
        })

    } catch (error) {
        res.status(500).json(
            {
                message : "server error" + error.message
            }
        )
    }

}

exports.updateNote = async (req,res) => {

 try {

    const { id, img , title, description } = req.body;

    const note =  await Note.findOne({noteId : id});


    if(!id){
        return res.status(400).json({
            message : "Note id is required"
        });
    }

    if(!note){
        return res.status(400).json({
            message : "note not found"
        });
    }

    if(img) note.img = img;
    if(title) note.title = title;
    if(description) note.description = description;

      note.updateDate = Date.now();

      await note.save();

        res.status(200).json({
            message : " note updated successfully",
             note : {
                id : note.noteId,
                img : note.img,
                title : note.title,
                description : note.description,
                date : note.date,
                updateDate : note.updateDate
            }
        })
    } catch (error) {
    res.status(500).json({
        message : "server error" + error.message
    }) 
 }
}


exports.deleteNote = async (req,res) => {

    try {

        const { id } = req.body;

        if(!id){
             return res.status(400).json({
            message : "Note id is required"
        });
        }

        const note = await Note.findOneAndDelete({noteId : id})

        if(!note){
              return res.status(400).json({
            message : "note not found"
        });
        }

        res.status(200).json({
            message : "note deleted successfully"
        })

        
    } catch (error) {
         res.status(500).json({
        message : "server error" + error.message
    }) 
    }

}

