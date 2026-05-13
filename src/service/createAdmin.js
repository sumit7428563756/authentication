const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model");

async function createAdmin() {

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
        username : "admin",
        password : hashedPassword
    });
    
}