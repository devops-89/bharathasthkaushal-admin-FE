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
  AreaChart,
  Area,
  Tooltip
} from "recharts";
import {
  Plus,
  Eye,
  UserPlus,
  CreditCard,
  TrendingUp,
  Users,
  ShoppingBag,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Calendar,
  DollarSign
} from "lucide-react";
import { productControllers } from "../api/product";
import { userControllers } from "../api/user";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const [serviceData, setServiceData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);

  const fetchUserCount = async () => {
    try {
      const res = await userControllers.getDashboardUserCount();
      // Assuming the API returns the count in res.data.data
      // Adjust if the structure is different (e.g. res.data.count)
      setUserCount(res.data.data || 0);
    } catch (err) {
      console.error("Failed to fetch user count", err);
    }
  };

  // Mock data for stats - in a real app, fetch this from API
  const stats = [
    {
      title: "Total Revenue",
      value: "₹12,45,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Users", // Updated title to reflect the API
      value: userCount.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Orders",
      value: "3,850",
      change: "-2.4%",
      trend: "down",
      icon: ShoppingBag,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Pending Approvals",
      value: "45",
      change: "+5",
      trend: "neutral",
      icon: Activity,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Rajesh Kumar",
      action: "added a new product",
      target: "Banarasi Silk Saree",
      time: "2 hours ago",
      avatar: "R",
      color: "bg-blue-500"
    },
    {
      id: 2,
      user: "Priya Sharma",
      action: "registered as",
      target: "New Artisan",
      time: "4 hours ago",
      avatar: "P",
      color: "bg-green-500"
    },
    {
      id: 3,
      user: "System",
      action: "generated report",
      target: "Monthly Sales",
      time: "5 hours ago",
      avatar: "S",
      color: "bg-purple-500"
    },
    {
      id: 4,
      user: "Amit Singh",
      action: "updated status for",
      target: "Order #12345",
      time: "1 day ago",
      avatar: "A",
      color: "bg-orange-500"
    },
  ];

  const fetchMonthlyReport = async () => {
    try {
      const res = await productControllers.getMonthlyAuctionReport();
      const monthOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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
    } catch (err) {
      console.error("Failed to load monthly report", err);
      // Fallback data if API fails
      setServiceData([
        { month: "Jan", services: 40 },
        { month: "Feb", services: 30 },
        { month: "Mar", services: 20 },
        { month: "Apr", services: 27 },
        { month: "May", services: 18 },
        { month: "Jun", services: 23 },
        { month: "Jul", services: 34 },
      ]);
    }
  };

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
              ? "#f97316"
              : "#6b7280",
      }));
      setPieData(formatted);
    } catch (err) {
      console.error("Failed to load status summary", err);
      // Fallback data
      setPieData([
        { name: "LIVE", value: 45, color: "#0ea5e9" },
        { name: "ENDED", value: 30, color: "#f97316" },
        { name: "UPCOMING", value: 25, color: "#6b7280" },
      ]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMonthlyReport(), fetchStatusSummary(), fetchUserCount()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : ""}
                >
                  Dashboard
                </NavLink>
              </nav>
            </div>

          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' :
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> :
                    stat.trend === 'down' ? <ArrowDownRight className="w-4 h-4 mr-1" /> : null}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2">
                  <option>This Year</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={serviceData}>
                    <defs>
                      <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="services"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorServices)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <button className="text-orange-600 text-sm font-medium hover:text-orange-700">View All</button>
              </div>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-white font-bold shrink-0`}>
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium text-gray-900">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-center group">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add Product</span>
                </button>
                <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-center group">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add Artisan</span>
                </button>
                <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center group">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Payments</span>
                </button>
                <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center group">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">View Orders</span>
                </button>
              </div>
            </div>

            {/* Auction Status Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Auction Status</h3>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Categories */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-4">Top Categories</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                    <span>Handloom Sarees</span>
                  </div>
                  <span className="font-bold">45%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <span>Wooden Crafts</span>
                  </div>
                  <span className="font-bold">30%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <span>Pottery</span>
                  </div>
                  <span className="font-bold">25%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
