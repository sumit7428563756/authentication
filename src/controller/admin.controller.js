const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Note = require("../models/note.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/*------- admin profile Section ----------*/
//admin login
exports.adminLogin = async (req,res) => {

    try {

        const { username , password } = req.body;

        const admin = await Admin.findOne({ username });

        if(!admin){
            return res.status(401).json({
                message : "Invalid Username"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if(!isMatch){
            return res.status(401).json({
                message : "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                adminId : admin._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        );

        res.status(200).json({
            message : "login successfull",
            token,
             admin: {
                id: admin._id,
                username: admin.username
            }
        });
        
    } catch (error) {
        res.status(500).json({
            message : "server error" + error.message
        })
        
    }

}


// dashboard
exports.dashboard = async (req,res) => {


    try {

        //total user
        const totalUser = await User.countDocuments({
            isProfileCompleted : true
        });

        //total notes
        const totalNotes = await Note.countDocuments();

        //active user last 7 days
        const sevenDays = new Date();
        sevenDays.setDate(sevenDays.getDate() -7 );    

        const activeUser = await User.countDocuments({
            updatedAt : { $gte : sevenDays},
            isProfileCompleted : true
        });

        // today user
        const today = new Date();
        today.setHours(0,0,0,0);

        const newUserToday = await User.countDocuments({
            createdAt : { $gte : today},
            isProfileCompleted : true
        });

        //recent notes
        const recentNotes = await Note.find().sort({createdAt : -1 }).limit(10);

          res.status(200).json({
            message : "success",
            dashboard : {
                totalUser,
                totalNotes,
                activeUser,
                newUserToday,
                recentNotes : recentNotes.map((note) => ({
                    id : note.noteId,
                    title : note.title,
                    description : note.description,
                    img : note.img,
                    createdAt: note.date,
                    updatedAt: note.updateDate
                }))
            }
          })
        
    } catch (error) {
          res.status(500).json({
            message : "server error" + error.message
        })
    }

}

//get admin profile 

exports.getAdminProfile = async (req,res) => {

    try {

       const adminId = req.adminId;

       const admin = await Admin.findById(adminId);

       if(!admin){
        res.status(404).json({
            message : "admin not found"
        });
       }

       res.status(200).json({
        message : "admin profile fetch successfully",
        admin : {
            name : admin.name,
            username : admin.username,
            password : admin.password
        }
       })
  
        
    } catch (error) {

        res.status(500).json({
            message : "server error" + error.message
        })
        
    }



}


// update admin profile
exports.updateAdmin = async (req,res) => {

    try {

        const adminId = req.adminId;

        const { name, username, password} = req.body;

        if(!name || !username || !password){
            return res.status(400).json({
                message : "required fields are missing"
            });
        }

        const admin = await Admin.findById(adminId);

         if(!admin){
            return res.status(404).json({
                message : "admin not found"
            });
         }

         if(name){
            admin.name = name;
         }

         if(username){
            
            admin.username = username;

         }


         if(password){
            const hashedPassword = await bcrypt.hash(
                password,
                10
            );

            admin.password = hashedPassword;
         }

         res.status(200).json({
            message : "admin profile update successfully",
            admin : {
                name : name,
                username : username,
                password : password
            }
         })

    
        
    } catch (error) {
         res.status(500).json({
            message : "server error" + error.message
        })
        
    }

}

/*------- Notes Section ----------*/

// get All Notes
exports.getAllNotes = async (req,res) => {

    try {

         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 10;

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

//edit Notes

exports.adminUpdateNote = async (req,res) => {

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

// delete note
exports.adminDeleteNote = async (req,res) => {

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

/* --------- User Section -------- */
 
//get All User

exports.getAllUser = async (req,res) => {


    try {


       const page = Number(req.query.page) || 1;
       const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;


      const users = await User.find().sort({userId : -1}).skip(skip).limit(limit);

       if(users.length === 0){

            return res.status(400).json({
                message : "Users Not found",
                users : []
            });
        }


         res.status(200).json({
            message : "users fetched successfully",
            users: users.map((user) => ({
               id : user.userId,
               pic : user.pic,
               name : user.name,
               username : user.username,
               age : user.age,
               phone : user.phone,
               email : user.email,
               gender : user.gender
            }))
        })

        
    } catch (error) {
           res.status(500).json({
        message : "server error" + error.message
    }) 
    }


}

//edit users

exports.adminEditUser = async (req,res) => {

    try {

        const { id, pic, name, username, age, phone, email, gender } = req.body;

        const user = await User.findOne({ userId: id });

        if(!user){
            res.status(404).json({
                message : "user not found"
            });
        }

        if(!name || !username || !age || !email || !gender ){
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        user.name = name;

        user.username = username;

        user.age = age;

        user.gender = gender;

        user.email = email;

        // user.pic = pic;

        user.isProfileCompleted = true;

        await user.save();



        res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user.userId,
        phone: user.phone,
        name: user.name,
        username: user.username,
        age: user.age,
        email: user.email,
        gender: user.gender,
        pic: user.pic
      }
    });
        
    } catch (error) {
        
        res.status(500).json({
            message : "server error" + error.message
        })

    }
}


    // delete user
    exports.adminDeleteUser = async (req,res) => {

        try {

            const { id } = req.body;

          const user = await User.findOneAndDelete({ userId: id });

            if(!user){
              res.status(404).json({
                message : "user not found"
              });
            }

            res.status(200).json({
                message : "user deleted successfully",
            })

            
        } catch (error) {
            res.status(500).json({
                message : "server error" + error.message
            })
        }
    }










  






