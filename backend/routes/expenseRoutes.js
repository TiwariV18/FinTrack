const express = require("express");
const router = express.Router();
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const auth = require("../middleware/auth"); 

router.post("/", auth, addExpense);

router.get("/", auth, getExpenses);

router.put("/:id", auth, updateExpense);

router.delete("/:id", auth, deleteExpense);

module.exports = router;
