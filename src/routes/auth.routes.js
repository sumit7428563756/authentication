const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
    sendOtp,
    verifyOtp,
    signUp,
    login
} = require("../controller/auth.controller");

router.post("/send-otp",sendOtp);

router.post("/verify-otp",verifyOtp);

router.post(
    "/signUp",
    authMiddleware,
    signUp
);

router.post("/login",login);



module.exports = router;