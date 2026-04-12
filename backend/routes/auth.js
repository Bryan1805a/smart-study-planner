const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {PrismaClient} = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

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
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({message: "User registered successfully", userId: newUser.id});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error during registration"});
    }
});

module.exports = router;