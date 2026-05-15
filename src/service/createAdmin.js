const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model");


async function createAdmin() {

    try {

        const existingAdmin = await Admin.findOne({
            username : "admin"
        });

        if(existingAdmin){
            return;
        }

        const hashedPassword = await bcrypt.hash(
            "admin123",
            10
        );

          await Admin.create({
            username: "admin",
            password: hashedPassword
        });
        
    } catch (error) {
        message : "server error"
    }
   
}


module.exports = createAdmin;