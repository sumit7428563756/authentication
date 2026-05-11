const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
    sendOtp,
    verifyOtp,
    signUp,
    login,
    forgot_otp,
    forgotPassword
} = require("../controller/auth.controller");

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



module.exports = router;