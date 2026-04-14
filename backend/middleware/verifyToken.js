const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({error: "Access Denied. Please log in."});
    }

    try {
        // Verify token using secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user's ID to the request
        req.userId = verified.userId;
        next();
    } catch (err) {
        res.status(401).json({error: "Invalid Token."});
    }
};

module.exports = verifyToken;