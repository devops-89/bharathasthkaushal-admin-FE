import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Plus, Eye, UserPlus, CreditCard } from "lucide-react";
import { productControllers } from "../api/product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
const Dashboard = () => {
  const handleAddArtisan = () => {
    alert("Add Artisan functionality will be implemented here");
  };
  const handleViewOrders = () => {
    alert("View Orders functionality will be implemented here");
  };
  const handleAssignWork = () => {
    alert("Assign Work functionality will be implemented here");
  };
  const handleViewPayments = () => {
    alert("View Payments functionality will be implemented here");
  };
  const [serviceData, setServiceData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const fetchMonthlyReport = async () => {
    try {
      const res = await productControllers.getMonthlyAuctionReport();
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      let apiData = res.data.data.map((item) => ({
        month: item.month,
        services: item.endedCount || 0,
      }));
      const completeData = monthOrder.map((m) => {
        const found = apiData.find((i) => i.month === m);
        return found || { month: m, services: 0 };
      });
      setServiceData(completeData);
      console.log("FINAL GRAPH DATA:", completeData);
    } catch (err) {
      toast.error("Failed to load monthly auction report ");
    }
  };

  useEffect(() => {
    fetchMonthlyReport();
    fetchStatusSummary();
  }, []);
  const fetchStatusSummary = async () => {
    try {
      const res = await productControllers.getAuctionStatusSummary();
      const formatted = res.data.data.map((item) => ({
        name: item.status,
        value: item.percentage,
        color:
          item.status === "LIVE"
            ? "#0ea5e9"
            : item.status === "ENDED"
            ? "#d97706"
            : "#6b7280",
      }));
      setPieData(formatted);
    } catch (err) {
      toast.error("Failed to load status summary ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Dashboard
          </h1>

          <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
            <NavLink to="/Dashboard">Dashboard</NavLink>
          </nav>
        </div>
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Orders Requests
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" allowDecimals={false} />
                  <Line
                    type="monotone"
                    dataKey="services"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ fill: "#d97706", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center mt-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-600 rounded mr-3"></div>
                <span className="text-base text-gray-600">No. of Orders</span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Orders Status
            </h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded mr-3`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-base text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-base font-medium text-gray-900">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
