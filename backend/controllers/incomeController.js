const Income = require("../models/Income");
const jwt = require("jsonwebtoken");

// Add new income 
exports.addIncome = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Decode token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Create income with user reference
    const income = await Income.create({ ...req.body, user: userId });
    res.status(201).json({ success: true, income });
  } catch (error) {
    console.error("Error in addIncome:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all incomes for logged-in user
exports.getIncomes = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ success: true, incomes });
  } catch (error) {
    console.error("Error in getIncomes:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update income

exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Income.findOneAndUpdate(
      { _id: id, user: req.user.id }, 
      {
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        date: req.body.date,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Income not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Income updated successfully",
      income: updated,
    });
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({ success: false, message: "Error updating income" });
  }
};


// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

  
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!income) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error in deleteIncome:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
