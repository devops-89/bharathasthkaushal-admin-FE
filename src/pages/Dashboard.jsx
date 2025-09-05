import React from "react";
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

const Dashboard = () => {
  // Button click handlers
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
  // Sample data for charts
  const serviceData = [
    { month: "Jan", services: 25 },
    { month: "Feb", services: 20 },
    { month: "Mar", services: 40 },
    { month: "Apr", services: 30 },
    { month: "May", services: 25 },
    { month: "Jun", services: 30 },
    { month: "Jul", services: 25 },
    { month: "Aug", services: 45 },
    { month: "Sep", services: 35 },
    { month: "Oct", services: 60 },
    { month: "Nov", services: 40 },
    { month: "Dec", services: 40 },
  ];
  const pieData = [
    { name: "Completed", value: 45, color: "#d97706" },
    { name: "In Progress", value: 25, color: "#0ea5e9" },
    { name: "Pending", value: 20, color: "#6b7280" },
    { name: "Cancelled", value: 10, color: "#ef4444" },
  ];
  const stats = [
    { title: "Total Artisans", value: "150", bgColor: "bg-white" },
    { title: "Active Customers", value: "1200", bgColor: "bg-white" },
    { title: "Service Requests", value: "45", bgColor: "bg-white" },
  ];

  const actionButtons = [
    {
      title: "Add Artisan",
      icon: Plus,
      bgColor: "bg-white hover:bg-gray-50",
      onClick: handleAddArtisan,
    },
    {
      title: "View Orders",
      icon: Eye,
      bgColor: "bg-white hover:bg-gray-50",
      onClick: handleViewOrders,
    },
    {
      title: "Assign Work",
      icon: UserPlus,
      bgColor: "bg-white hover:bg-gray-50",
      onClick: handleAssignWork,
    },
    {
      title: "View Payments",
      icon: CreditCard,
      bgColor: "bg-white hover:bg-gray-50",
      onClick: handleViewPayments,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-full space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-8 shadow-sm border border-gray-200`}
            >
              <h3 className="text-base font-medium text-gray-600 mb-3">
                {stat.title}
              </h3>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Orders Requests
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
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
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Orders Status
            </h3>
            <div className="h-80">
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

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actionButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                onClick={button.onClick}
                className={`${button.bgColor} rounded-xl p-8 shadow-sm border border-gray-200 transition-colors duration-200 text-left group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-900 group-hover:text-orange-600">
                    {button.title}
                  </span>
                  <Icon className="w-6 h-6 text-gray-400 group-hover:text-orange-500" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
