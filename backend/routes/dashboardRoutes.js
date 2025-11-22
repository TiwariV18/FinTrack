const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

// Dashboard stats
router.get("/stats", auth, async (req, res) => {
  try {
    const totalExpenses = await Expense.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = await Income.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      totalExpenses: totalExpenses[0]?.total || 0,
      totalIncome: totalIncome[0]?.total || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;
