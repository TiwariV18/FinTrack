import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, AlertTriangle, Edit2, X } from "lucide-react";

export default function Expense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(Number(localStorage.getItem("budget") || 0));
  const [showWarning, setShowWarning] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  const handleAddExpense = async () => {
    if (!title || !amount || !category || !date) return alert("Please fill all fields!");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/expense",
        { title, amount: Number(amount), category, date: new Date(date) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      fetchExpenses();
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  //OPEN EDIT MODAL
  const openEdit = (exp) => {
    setEditing({
      ...exp,
      date: new Date(exp.date).toISOString().slice(0, 10),
    });
    setEditOpen(true);
  };

  // SAVE EDIT 
  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/expense/${editing._id}`,
        {
          title: editing.title,
          amount: Number(editing.amount),
          category: editing.category,
          date: new Date(editing.date),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditOpen(false);
      setEditing(null);
      fetchExpenses();
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update expense");
    } finally {
      setSaving(false);
    }
  };

  // Totals
  const totalExpense = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const remaining = budget - totalExpense;
  const percentage = budget > 0 ? Math.min((totalExpense / budget) * 100, 100) : 0;

  useEffect(() => {
    if (budget > 0 && remaining <= budget * 0.2) setShowWarning(true);
    else setShowWarning(false);
  }, [totalExpense, budget]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-fuchsia-800 flex flex-col items-center p-6">
      <motion.h1
        className="text-4xl font-extrabold text-white mb-8 flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💸 Expense Tracker
      </motion.h1>

      
      <motion.div
        className="bg-purple-900/50 p-6 rounded-2xl shadow-xl w-full max-w-4xl backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <input
            className="p-3 rounded-lg border border-purple-500 bg-transparent text-white focus:ring-2 focus:ring-fuchsia-400"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="p-3 rounded-lg border border-purple-500 bg-transparent text-white focus:ring-2 focus:ring-fuchsia-400"
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            className="p-3 rounded-lg border border-purple-500 bg-transparent text-white focus:ring-2 focus:ring-fuchsia-400"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            className="p-3 rounded-lg border border-purple-500 bg-transparent text-white focus:ring-2 focus:ring-fuchsia-400 cursor-pointer"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          onClick={handleAddExpense}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          <PlusCircle size={22} />
          Add Expense
        </button>
      </motion.div>

      
      <div className="mt-10 w-full max-w-4xl space-y-4">
        {expenses.length === 0 ? (
          <p className="text-gray-300 text-center">No expenses added yet 💭</p>
        ) : (
          expenses.map((expense) => (
            <motion.div
              key={expense._id}
              className="bg-gradient-to-r from-fuchsia-700 to-purple-900 text-white flex justify-between items-center p-4 rounded-2xl shadow-md hover:shadow-xl transition"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <h4 className="font-semibold">{expense.title}</h4>
                <p className="text-sm opacity-80">
                  {expense.category} | {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-bold text-lg text-yellow-400">
                  ₹{Number(expense.amount).toFixed(2)}
                </span>

                
                <button
                  onClick={() => openEdit(expense)}
                  className="text-white hover:text-blue-300 p-2 rounded-md bg-white/5 hover:bg-white/10"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>

                <button
                  onClick={() => handleDelete(expense._id)}
                  className="text-red-400 hover:text-red-600 p-2 rounded-md bg-white/5 hover:bg-white/10"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

     
      {editOpen && editing && (
        <>
          
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setEditOpen(false)}
          />

       
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 rounded-2xl bg-gradient-to-br from-purple-800 to-fuchsia-700 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">Edit Expense</h3>
              <button
                onClick={() => {
                  setEditOpen(false);
                  setEditing(null);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm opacity-90">Title</label>
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/70"
                placeholder="Expense title"
              />

              <label className="text-sm opacity-90">Amount</label>
              <input
                type="number"
                value={editing.amount}
                onChange={(e) => setEditing({ ...editing, amount: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/70"
                placeholder="Amount"
              />

              <label className="text-sm opacity-90">Category</label>
              <input
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/70"
                placeholder="Category"
              />

              <label className="text-sm opacity-90">Date</label>
              <input
                type="date"
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/70"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={saveEdit}
                disabled={saving}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  saving ? "bg-indigo-400/60" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => {
                  setEditOpen(false);
                  setEditing(null);
                }}
                className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}

      
      {budget > 0 && (
        <motion.div
          className="mt-10 w-full max-w-4xl bg-purple-900/50 rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className={`h-4 transition-all duration-500 ${
              percentage >= 100 ? "bg-red-600" : percentage >= 80 ? "bg-yellow-400" : "bg-green-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </motion.div>
      )}

  
      <motion.div
        className="mt-6 bg-purple-900/60 py-4 px-8 rounded-2xl text-white text-xl font-semibold shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Total Expense: <span className="text-yellow-400">₹{totalExpense.toFixed(2)}</span>
        {budget > 0 && (
          <span className="ml-4 text-fuchsia-300 text-sm">
            (Budget: ₹{budget} | Remaining: ₹{remaining >= 0 ? remaining.toFixed(2) : 0})
          </span>
        )}
      </motion.div>

      {showWarning && (
        <motion.div
          className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={22} />
          <span>
            {remaining <= 0 ? "🚨 You’ve exceeded your budget!" : `⚠️ Only ₹${remaining.toFixed(2)} left in your budget!`}
          </span>
        </motion.div>
      )}
    </div>
  );
}
