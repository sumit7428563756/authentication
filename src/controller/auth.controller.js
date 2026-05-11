const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const generateOtp = require("../service/generateOtp");
const bcrypt = require("bcryptjs");


// send otp
exports.sendOtp = async (req, res) => {

    try {

        const { phone } = req.body;

      
        if(!phone){
            return res.status(400).json({
                message : "phone number required"
            })
        }

         let user = await User.findOne({ phone });

         if (user && user.isProfileCompleted) {
            return res.status(400).json({
                message: "Mobile number already exists"
            });
        }

        const otp = generateOtp();

        console.log("Generated OTP:", otp);

        const otpExpiry = new Date(Date.now() + 5*60*1000);

       

        if(user){

            user.otp = otp;
            user.otpExpiry = otpExpiry;

            await user.save();
        }else{

            user = await User.create({
                phone,
                otp,
                otpExpiry
            })
        }


        res.status(200).json({
            message : "otp sent successfully",
            otp
        });    



    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


//verify otp
exports.verifyOtp = async (req, res) => {

    try {

        const { phone, otp } = req.body;

       const user = await User.findOne({ phone });

       if(!user){
        return res.status(404).json({
            message : "User not found"
        });
       }

       if (String(user.otp) !== String(otp)){
        return res.status(400).json({
            message : "Invalid Otp"
        });
       }

        if(user.otpExpiry < new Date()){
            return res.status(400).json({
                message : "Otp expired"
            });
        }

        const token = jwt.sign(
            {
                id : user._id, phone : user.phone
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d",
            }
        );

        user.otp = null;  
        user.otpExpiry = null;

        await user.save();

        res.status(200).json({
            message : "otp verify successfully",
            token : token
        })

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



// signup
exports.signUp = async (req,res) => {


    try {

        const { name, username,age, email,gender,password,confirmPassword } = req.body;

        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({
              message: "User not found"
            })
        }


         if (password !== confirmPassword) {

            return res.status(400).json({
                message: "Passwords do not match"
            });
        }


        if (password.length < 6 || password.length > 10) {

               return res.status(400).json({
                message: "Password must be between 6 and 10 characters"
              });
          }


         const hashedPassword = await bcrypt.hash(password, 10);

        const lastUser = await User.findOne().sort({ userId: -1 });

            const newUserId = lastUser && !isNaN(lastUser.userId)
               ? Number(lastUser.userId) + 1
                 : 1;

        user.userId = newUserId;

        user.name = name;

        user.age = age;

        user.username = username;

        user.email = email;

        user.gender = gender;

         user.password = hashedPassword;

    

        user.isProfileCompleted  = true;

        await user.save();

        res.status(200).json({
            message : "register successfully",
           user: {  
       id: user.userId,
        name: user.name,
        phone: user.phone,
        username: user.username,
        email: user.email,
        gender: user.gender
    }
        })
        
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }

}


//login
exports.login = async (req,res) => {


    try {

        const { phone, password} = req.body;

        const user = await User.findOne({ phone });


        if(!user){
            return res.status(404).json({
                message : "Mobile Number not exist"
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        if (!isMatch) {

            return res.status(400).json({
                message: "Wrong Password"
            });
        }

         const token = jwt.sign(
            {
                id: user._id,
                phone: user.phone
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
         user: {  
       id: user.userId,
        name: user.name,
        phone: user.phone,
        username: user.username,
        email: user.email,
        gender: user.gender

        },
    });
        
    } catch (error) {

        res.status(500).json({
            message : error.message
        })
        
    }

}


//forgot request otp

exports.forgot_otp = async (req,res) => {

    try {

        const { phone } = req.body;

        if(!phone){
            return res.status(400).json({
                message : "phone number required"
            })
        }
        
        let user = await User.findOne({
            phone
        });

        if(user && user.isProfileCompleted){
           
         const otp = generateOtp();

         const otpExpiry = new Date(Date.now() + 5*60*1000);

          user.otp = otp;

          user.otpExpiry = otpExpiry;

        await user.save();

          res.status(200).json({
            message : " otp sent successfully",
            otp
          })

        }else{
            return res.status(400).json({
                message : "phone number not exist"
            })
        }

    } catch (error) {
        res.status(500).json({
            message : error.message
        });
    }

}

exports.forgotPassword = async (req, res) => {

    try {

        const { phone, otp,  newPassword } = req.body;

         if (!phone || !otp || !newPassword) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        const user = await User.findOne( {  phone } );

        if(!user){
            return res.status(400).json({
                message : "user not found"
            });
        }

        
         if (String(user.otp) !== String(otp)){
        return res.status(400).json({
            message : "Invalid Otp"
        });
       }

        if(user.otpExpiry < new Date()){
            return res.status(400).json({
                message : "Otp expired"
            });
        }



        const hashedPassword = await bcrypt.hash(newPassword , 10);

        user.password = hashedPassword;


          user.otp = null;

         user.otpExpiry = null;

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });
        
    } catch (error) {
        res.status(500).json({
            message : error.message
        })

    }

}


