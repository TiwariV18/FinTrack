import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Wallet,
  CreditCard,
  DollarSign,
} from "lucide-react";
import SidebarLayout from "../../components/layouts/SidebarLayout";

export default function Dashboard() {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#7C3AED", "#EC4899"]; 

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [incomeRes, expenseRes] = await Promise.all([
        axios.get("http://localhost:5000/api/income", config),
        axios.get("http://localhost:5000/api/expense", config),
      ]);

      setIncome(incomeRes.data.incomes || []);
      setExpense(expenseRes.data.expenses || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  if (loading)
    return <p className="text-center mt-10">Loading Dashboard...</p>;

  // Totals
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expense.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  
  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

 
  const categoryTotals = {};
  expense.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const barData = Object.keys(categoryTotals).map((cat) => ({
    category: cat,
    amount: categoryTotals[cat],
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 to-white">
      {/* Sidebar */}
      <SidebarLayout />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-10 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          📊 FinTrack 
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Income */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Income</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  ₹{totalIncome.toLocaleString()}
                </h2>
              </div>
              <Wallet className="text-purple-600 w-8 h-8" />
            </div>
          </motion.div>

          {/* Total Expense */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-pink-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Expense</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  ₹{totalExpense.toLocaleString()}
                </h2>
              </div>
              <CreditCard className="text-pink-500 w-8 h-8" />
            </div>
          </motion.div>

          {/* Balance */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${
              balance >= 0
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Net Balance</p>
                <h2
                  className={`text-2xl font-bold ${
                    balance >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{balance.toLocaleString()}
                </h2>
              </div>
              <DollarSign className="text-gray-600 w-8 h-8" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Income vs Expense
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

        
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Expenses by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#EC4899"
                  name="Expense Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
