const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");


//  auth route define
const {
    sendOtp,
    verifyOtp,
    signUp,
    login,
    forgot_otp,
    forgotPassword,
    getProfile,
    editProfile
} = require("../controller/auth.controller");


//note route define
const { createNote, getNotes, updateNote, deleteNote } = require("../controller/note.controller");

//admin route define
const { adminLogin ,getAdminProfile, dashboard, updateAdmin,getAllNotes,adminUpdateNote,adminDeleteNote, getAllUser,adminEditUser,adminDeleteUser } = require("../controller/admin.controller");
const { route } = require('../app');

// auth route endpoints
router.post("/send-otp",sendOtp);

router.post("/verify-otp",verifyOtp);

router.post(
    "/signUp",
    authMiddleware,
    signUp
);

router.post("/login",login);

router.post("/forgot-request-otp", forgot_otp);

router.post("/forgotPassword",forgotPassword);

// user profile endpoints

router.get("/getProfile",authMiddleware,getProfile);

router.patch("/edit-profile",authMiddleware,editProfile);


// note route endpoints
router.post("/create-note", authMiddleware, createNote);   

router.get("/getNotes",authMiddleware,getNotes);

router.patch("/updateNote",authMiddleware,updateNote);

router.delete("/deleteNote",authMiddleware,deleteNote);

// admin route endpoints
router.post("/admin-login",adminLogin);

router.get("/getAdminProfile",adminMiddleware,getAdminProfile);

router.get("/dashboard",adminMiddleware,dashboard);

router.patch("/admin-update",adminMiddleware,updateAdmin);

// admin note endpoints

router.get("/getAllNotes",adminMiddleware,getAllNotes);

router.patch("/editNote",adminMiddleware,adminUpdateNote);

router.delete("/deleteNote",adminMiddleware,adminDeleteNote);

//admin user route

router.get("/getAllUser",adminMiddleware,getAllUser);

router.patch("/editUser",adminMiddleware,adminEditUser);   

router.delete("/deleteUser",adminMiddleware,adminDeleteUser);



module.exports = router;