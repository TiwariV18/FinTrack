const express = require("express");
const router = express.Router();
const {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");

const auth = require("../middleware/auth"); 

router.post("/add", auth, addIncome);

router.get("/", auth, getIncomes);

router.put("/:id", auth, updateIncome);

router.delete("/:id", auth, deleteIncome);

module.exports = router;
