const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
                dexpiresIn : "7d"
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