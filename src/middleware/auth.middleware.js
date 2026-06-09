const jwt = require("jsonwebtoken");



module.exports = async (req,res,next) => {

    try {

        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                Message : "Unauthorization",
            });
        }

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED TOKEN:", decode);

        req.user = {
            _id: decode.id   // 👈 IMPORTANT FIX
        };

        next();

        
    } catch (error) {

        res.status(401).json({
           message : "invalid token"
        })
        
    }
}