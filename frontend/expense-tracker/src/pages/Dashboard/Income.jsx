import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, Edit2, X } from "lucide-react";

export default function Income() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [incomes, setIncomes] = useState([]);

  //EDIT STATES
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all incomes
  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(res.data.incomes || []);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Add income
  const handleAddIncome = async () => {
    if (!title || !amount || !category || !date)
      return alert("Please fill all fields!");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/income/add",
        { title, amount: Number(amount), category, date: new Date(date) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      fetchIncomes();
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  // Delete income
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/income/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIncomes();
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  //OPEN EDIT MODAL
  const openEdit = (income) => {
    setEditing({
      ...income,
      date: new Date(income.date).toISOString().slice(0, 10),
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
        `http://localhost:5000/api/income/${editing._id}`,
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
      fetchIncomes();
    } catch (error) {
      console.error("Error updating income:", error);
      alert("Failed to update income");
    } finally {
      setSaving(false);
    }
  };

  const totalIncome = incomes.reduce(
    (sum, inc) => sum + Number(inc.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-fuchsia-800 flex flex-col items-center p-6">

      <motion.h1
        className="text-4xl font-extrabold text-white mb-8 flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💰 Income Tracker
      </motion.h1>

     
      <motion.div
        className="bg-purple-900/50 p-6 rounded-2xl shadow-xl w-full max-w-4xl backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <input
            className="p-3 rounded-lg border border-purple-500 bg-transparent text-white"
            placeholder="Income Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="p-3 rounded-lg border border-purple-500 bg-transparent text-white"
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            className="p-3 rounded-lg border border-purple-500 bg-transparent text-white"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            className="p-3 rounded-lg border border-purple-500 bg-transparent text-white"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          onClick={handleAddIncome}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          <PlusCircle size={22} /> Add Income
        </button>
      </motion.div>

      
      <div className="mt-10 w-full max-w-4xl space-y-4">
        {incomes.length === 0 ? (
          <p className="text-gray-300 text-center">No incomes added yet 💭</p>
        ) : (
          incomes.map((income) => (
            <motion.div
              key={income._id}
              className="bg-gradient-to-r from-fuchsia-700 to-purple-900 text-white p-4 rounded-2xl shadow-md flex justify-between items-center hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <h4 className="font-semibold">{income.title}</h4>
                <p className="text-sm opacity-80">
                  {income.category} | {new Date(income.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-yellow-400">
                  ₹{Number(income.amount).toFixed(2)}
                </span>

                
                <button
                  onClick={() => openEdit(income)}
                  className="text-white hover:text-blue-300 p-2 rounded-md bg-white/5 hover:bg-white/10"
                >
                  <Edit2 size={18} />
                </button>

                
                <button
                  onClick={() => handleDelete(income._id)}
                  className="text-red-400 hover:text-red-600 p-2 rounded-md bg-white/5 hover:bg-white/10"
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
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 rounded-2xl bg-gradient-to-br from-purple-800 to-fuchsia-700 text-white shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">Edit Income</h3>
              <button
                onClick={() => setEditOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <label>Title</label>
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
              />

              <label>Amount</label>
              <input
                type="number"
                value={editing.amount}
                onChange={(e) =>
                  setEditing({ ...editing, amount: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
              />

              <label>Category</label>
              <input
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
              />

              <label>Date</label>
              <input
                type="date"
                value={editing.date}
                onChange={(e) =>
                  setEditing({ ...editing, date: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
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
                onClick={() => setEditOpen(false)}
                className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}

      
      <motion.div
        className="mt-10 bg-purple-900/60 py-4 px-8 rounded-2xl text-white text-xl font-semibold shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Total Income:{" "}
        <span className="text-yellow-400">₹{totalIncome.toFixed(2)}</span>
      </motion.div>
    </div>
  );
}
