const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

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


const { createNote, getNotes, updateNote, deleteNote } = require("../controller/note.controller");

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

router.get("/getPorifle",authMiddleware,getProfile);

router.patch("/edit-profile",authMiddleware,editProfile);

router.post("/create-note", authMiddleware, createNote);

router.get("/getNotes",authMiddleware,getNotes);

router.patch("/updateNote",authMiddleware,updateNote);

router.delete("/deleteNote",authMiddleware,deleteNote);




module.exports = router;