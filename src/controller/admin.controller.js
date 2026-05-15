const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Note = require("../models/note.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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




