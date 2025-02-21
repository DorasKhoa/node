const jwt = require("jsonwebtoken");
require('dotenv').config()

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role.nameRole },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null; 
    }
};
module.exports = {generateAccessToken, generateRefreshToken, verifyToken}