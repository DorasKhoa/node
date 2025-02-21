require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization"); 
        if (!token) {
            return res.status(401).json({ message: 'Access Denied. No Token provided' });
        }
        const tokenWithoutBearer = token.replace("Bearer ", "").trim();
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message: 'Invalid Token'});
    }
};

exports.isUser = (req, res, next) => {
    if(!req.user || req.user.role !== "user") {
        return res.status(403).json({message: 'You are authorized!'});
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(!req.user || req.user.role !== "admin") {
        return res.status(403).json({message: 'You are authorized!'});
    }
    next();
}

exports.isDoctor = (req, res, next) => {
    if(!req.user || req.user.role !== "doctor") {
        return res.status(403).json({message: 'You are authorized!'});
    }
    next();
}