const express = require("express");
const {PrismaClient} = require("@prisma/client");
const {PrismaPg} = require("@prisma/adapter-pg");
const verifyToken = require("../middleware/verifyToken");

// Prisma 7 setup
const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter});

const router = express.Router();

// Get all subjects
// Fetchs only subjects that belong to the logged-in user
router.get("/", verifyToken, async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany({
            where: {userId: req.userId},
            include: {tasks: true}
        });

        res.status(200).json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to fetch subjects"});
    }
});

// Create a new subject
router.post("/", verifyToken, async (req, res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({error: "Subject name is required"});
        }

        const newSubject = await prisma.subject.create({
            data: {
                name,
                userId: req.userId,
            },
        });

        res.status(201).json(newSubject);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to create subject"});
    }
});

// Delete a subject
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const subjectId = req.params.id;

        // Verify the subject belongs to the user
        const subject = await prisma.subject.findUnique({
            where: {id: subjectId}
        });

        if (!subject || subject.userId !== req.userId) {
            return res.status(403).json({error: "Not authorized to delete this subject"});
        }

        await prisma.subject.delete({
            where: {id: subjectId}
        });

        res.status(200).json({message: "Subject deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to delete subject"});
    }
});

module.exports = router;