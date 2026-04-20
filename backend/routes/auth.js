const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const verifyToken = require("../middleware/verifyToken");

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter});

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Register route
router.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return res.status(400).json({error: "User already exists"});
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the new user to the database
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        // Create JWT
        const token = jwt.sign(
            {userId: newUser.id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        // Send token via HTTP Only cookie
        res.cookie("token", token, cookieOptions);

        res.status(201).json({message: "User registered successfully", userId: newUser.id});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error during registration"});
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        // Find the user in the database
        const user = await prisma.user.findUnique({ where: {email} });
        if (!user) {
            return res.status(400).json({error: "Invalid email or password"});
        }

        // Compare provided password with the hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({error: "Invalid email or password"});
        }

        // Create a new JWT token
        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        // Send the token in HTTP only cookie
        res.cookie("token", token, cookieOptions);

        res.status(200).json({message: "Logged in successfully!", userId: user.id});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error during login"});
    }
});

// Logout route
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({message: "Logged out successfully"});
});

// Get current user (Protected Route)
router.get("/me", verifyToken, async (req, res) => {
    try {
        // Get req.userId from verifyToken middleware
        const user = await prisma.user.findUnique({
            where: {id: req.userId},
            select: {id: true, email: true}
        });

        if (!user) {
            return res.status(404).json({error: "User not found."});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;