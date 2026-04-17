const express = require("express");
const {PrismaClient} = require("@prisma/client");
const {PrismaPg} = require("@prisma/adapter-pg");
const verifyToken = require("../middleware/verifyToken");

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter});

const router = express.Router();

// Get all tasks
router.get("/", verifyToken, async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: {userId: req.userId},
            orderBy: {dueDate: 'asc'},
            include: {subject: true}
        });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch tasks"});
    }
});

// Create a task
router.post("/", verifyToken, async (req, res) => {
    try {
        const {title, subjectId, dueDate} = req.body;

        if (!title || !subjectId) {
            return res.status(400).json({error: "Title and Subject are required"});
        }

        // Verify the subject belongs to the user
        const subject = await prisma.subject.findUnique({
            where: {id: subjectId}
        });

        if (!subject || subject.userId !== req.userId) {
            return res.status(403).json({error: "Invalid subject"});
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                subjectId,
                userId: req.userId,
                dueDate: dueDate ? new Date(dueDate) : null
            },
            include: {subject: true}
        });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({error: "Failed to create task"});
    }
});

// Toggle task completion (UPDATE)
router.patch("/:id/complete", verifyToken, async (req, res) => {
    try {
        const taskId = req.params.id;
        const {isCompleted} = req.body;

        // Verify ownership
        const task = await prisma.task.findUnique({where: {id: taskId}});
        if (!task || task.userId !== req.userId) {
            return res.status(403).json({error: "Not authorized"});
        }

        const updatedTask = await prisma.task.update({
            where: {id: taskId},
            data: {isCompleted},
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({error: "Failed to update task"});
    }
});

// Delete a task
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const taskId = req.params.id;

        // Verify owner ship
        const task = await prisma.task.findUnique({where: {id: taskId}});
        if (!task || task.userId !== req.userId) {
            return res.status(403).json({error: "Not authorized"});
        }

        await prisma.task.delete({where: {id: taskId}});
        res.status(200).json({message: "Task deleted"});
    } catch (error) {
        res.status(500).json({error: "Failed to delete task"});
    }
});


module.exports = router;