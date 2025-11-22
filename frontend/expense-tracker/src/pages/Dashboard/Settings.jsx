import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SidebarLayout from "../../components/layouts/SidebarLayout";
import axios from "axios";

export default function Settings() {
  const [budget, setBudget] = useState(localStorage.getItem("budget") || "");
  const [warning, setWarning] = useState(localStorage.getItem("warning") || "80");

  // Save Settings
  const saveSettings = () => {
    localStorage.setItem("warning", warning);
    localStorage.setItem("budget", budget);

    window.dispatchEvent(new Event("storage-update"));
    alert("Settings saved!");
  };

  
  const convertToCSV = (data) => {
    if (!data.length) return "";

    const keys = Object.keys(data[0]);
    const header = keys.join(",");
    const rows = data
      .map((obj) =>
        keys
          .map((key) => `"${String(obj[key]).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    return `${header}\n${rows}`;
  };

  // Export as CSV
  const exportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const expenses = res.data.expenses || [];

      if (expenses.length === 0) {
        alert("No expenses found to export.");
        return;
      }

      const csvData = convertToCSV(expenses);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses_backup.csv";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV Export Error:", err);
      alert("Error exporting CSV.");
    }
  };

  
  const Select = ({ label, value, onChange, options }) => (
    <div className="mb-6">
      <label className="text-white text-lg mb-2 block">{label}</label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none w-full bg-[#6a0dad] text-white px-4 py-3 rounded-xl border border-purple-300 outline-none focus:ring-2 focus:ring-purple-500"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white">
          ▼
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 to-purple-600">
      <SidebarLayout />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-10 overflow-y-auto"
      >
        <h1 className="text-white text-4xl font-bold mb-102">⚙️
 Settings</h1>

        
        <div className="mb-6">
          <label className="text-white text-lg mb-2 block">Monthly Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-[#6a0dad] text-white px-4 py-3 rounded-xl border border-purple-300 outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter budget"
          />
        </div>

        
        <Select
          label="Budget Warning At (%)"
          value={warning}
          onChange={(e) => setWarning(e.target.value)}
          options={[
            { value: "50", label: "50%" },
            { value: "60", label: "60%" },
            { value: "70", label: "70%" },
            { value: "80", label: "80%" },
            { value: "90", label: "90%" },
          ]}
        />

        
        <button
          onClick={exportCSV}
          className="w-full mb-6 bg-blue-500 text-white py-3 rounded-xl text-lg hover:bg-blue-600 transition"
        >
          Export Expenses (CSV)
        </button>

        
        <button
          onClick={saveSettings}
          className="w-full bg-green-600 text-white py-4 rounded-xl text-xl font-semibold hover:bg-green-700 transition"
        >
          Save Settings
        </button>
      </motion.div>
    </div>
  );
}

