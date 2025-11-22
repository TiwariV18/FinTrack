const Expense = require("../models/Expense");


// Add New Expense

exports.addExpense = async (req, res) => {
  try {
  
    const expense = await Expense.create({
      ...req.body,
      user: req.user.id, // use 'user' for consistency with Income model
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error("Error in addExpense:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


// Get All Expenses

exports.getExpenses = async (req, res) => {
  try {
    // Fetch only the expenses belonging to the logged-in user
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error("Error in getExpenses:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.user.id },  
      { title, amount, category, date },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating expense", error });
  }
};



// Delete Expense

exports.deleteExpense = async (req, res) => {
  try {

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
