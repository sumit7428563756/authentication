const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");


// auth routes define
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


// notes routes define
const { createNote, getNotes, updateNote, deleteNote } = require("../controller/note.controller");

// admin routes define
const {
    adminLogin
} = require("../controller/admin.controller");


// auth route endpoitnts
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

// profile route endpoints

router.get("/getPorifle",authMiddleware,getProfile);

router.patch("/edit-profile",authMiddleware,editProfile);

// note route endpoints

router.post("/create-note", authMiddleware, createNote);

router.get("/getNotes",authMiddleware,getNotes);

router.patch("/updateNote",authMiddleware,updateNote);

router.delete("/deleteNote",authMiddleware,deleteNote);

//admin route endpoint

router.post("/admin-login",adminMiddleware,adminLogin);




module.exports = router;