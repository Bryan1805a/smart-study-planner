const express = require("express");
const {PrismaClient} = require("@prisma/client");
const {PrismaPg} = require("@prisma/adapter-pg");
const verifyToken = require("../middleware/verifyToken");

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter});

const router = express.Router();

// Get smart suggestion
router.get("/", verifyToken, async (req, res) => {
    try {
        // Find incomplete tasks, sort by due date (soonest first)
        const urgentTasks = await prisma.task.findMany({
            where: {
                userId: req.userId,
                isCompleted: false,
                dueDate: {not: null} // Find the tasks that have a deadline
            },
            orderBy: {dueDate: 'asc'},
            take: 3, // Need a top few for making decision
            include: {subject: true}
        });

        // If the user is all caught up
        if (urgentTasks.length === 0) {
            return res.status(200).json({message: "You have no urgent deadlines."});
        }

        // If the user has work to do. Grab the absolute most urgent task
        const mostUrgent = urgentTasks[0];
        const dueDateString = new Date(mostUrgent.dueDate).toLocaleDateString();

        const message = `Smart Suggestion: Start with "${mostUrgent.title}" for ${mostUrgent.subject?.name || "your subject"}. It's due by ${dueDateString}!`;

        res.status(200).json({message});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to generate study suggestion"});
    }
});

module.exports = router;