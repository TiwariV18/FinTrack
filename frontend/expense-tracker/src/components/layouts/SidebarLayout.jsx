import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  LogOut,
  Settings,
} from "lucide-react";

export default function SidebarLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "User" });

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setUser(storedUser);
    } else {
      setUser({
        name: "Guest User",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Income", path: "/income", icon: <Wallet className="h-5 w-5" /> },
    { name: "Expense", path: "/expenses", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900 text-white shadow-xl flex flex-col justify-between">
      
      
      <div className="p-6 text-center border-b border-purple-500/40">
        
    
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl font-bold 
                        bg-gradient-to-br from-purple-300 to-purple-500 text-purple-900 shadow-lg">
          ₹
        </div>

        <h2 className="mt-3 text-lg font-semibold capitalize">{user.name}</h2>
        <p className="text-purple-300 text-sm">Admin</p>
      </div>

      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-white text-purple-700 shadow-lg scale-105"
                  : "hover:bg-purple-600/40"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      
      <div className="p-6 border-t border-purple-500/40">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-center text-purple-400 mt-4">
          © 2025 Expense Tracker
        </p>
      </div>
    </aside>
  );
}
