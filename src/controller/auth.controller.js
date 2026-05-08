const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const client = require("../config/twilio");

exports.sendOtp = async (req, res) => {

    try {

        const { phone } = req.body;

        await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications
            .create({
                to: `+91${phone}`,
                channel: "sms",
            });

        res.status(200).json({
            message: "OTP sent successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

exports.verifyOtp = async (req, res) => {

    try {

        const { phone, otp } = req.body;

        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks
            .create({
                to: `+91${phone}`,
                code: otp,
            });

        if (verificationCheck.status !== "approved") {

            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        const token = jwt.sign(
            { phone },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};