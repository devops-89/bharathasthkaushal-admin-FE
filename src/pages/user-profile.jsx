import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { userControllers } from "../api/user";
import { productControllers } from "../api/product";
import { ToastContainer, toast } from "react-toastify";
import { Phone, Calendar, Mail, User, ShieldCheck } from "lucide-react";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auctionStats, setAuctionStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchAuctionStats();
  }, []);

  const fetchProfile = async () => {
    try {
      let res = await userControllers.getUserProfile(id);
      setUser(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load user profile");
    }
    setLoading(false);
  };

  const fetchAuctionStats = async () => {
    try {
      const res = await productControllers.getUserAuctionStats(id);
      setAuctionStats(res.data.data);
    } catch (error) {
      console.error("Error fetching auction stats:", error);
      // Don't show error toast here to avoid clutter if just stats fail
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading profile...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        No data found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      {/* Header / Back Button */}
      <div className="max-w-4xl mx-auto mb-6 px-4 md:px-0">
        <NavLink
          to="/user-management"
          className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors font-medium"
        >
          <span className="mr-2 text-xl">←</span> Back to User Management
        </NavLink>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg p-8 rounded-2xl border border-gray-100 max-w-4xl mx-auto mb-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-100 shadow-sm">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || `${user.firstName} ${user.lastName}`
                  )}&background=random`
                }
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {user.name || `${user.firstName} ${user.lastName}`}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center text-gray-500 text-sm">
                <Mail className="w-4 h-4 mr-1.5" />
                {user.email || "—"}
              </div>
              <span className="text-gray-300">|</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                  }`}
              >
                {user.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-8">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Contact Number</p>
              <p className="font-semibold text-gray-900">
                {user.countryCode ? `${user.countryCode} ` : ""}
                {user.phoneNo || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Joined Date</p>
              <p className="font-semibold text-gray-900">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Role</p>
              <p className="font-semibold text-gray-900">
                {user.roleName || "User"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Aadhaar Number</p>
              <p className="font-semibold text-gray-900">
                {user.aadhaarNumber || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Stats Section */}
      <div className="bg-white shadow-lg p-8 rounded-2xl border border-gray-100 max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Auction Activity</h3>

        {statsLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : auctionStats ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-blue-800 font-semibold">Participated</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">Total</span>
                </div>
                <p className="text-3xl font-bold text-blue-900">{auctionStats.totalParticipated}</p>
                <p className="text-sm text-gray-500 mt-1">Auctions entered</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-green-800 font-semibold">Won Auctions</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Total</span>
                </div>
                <p className="text-3xl font-bold text-green-900">{auctionStats.totalWon}</p>
                <p className="text-sm text-gray-500 mt-1">Auctions won successfully</p>
              </div>
            </div>

            {/* Won Auctions List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">🏆</span> Won Auctions History
                </h4>
              </div>

              <div className="p-4">
                {auctionStats.wonAuctions && auctionStats.wonAuctions.length > 0 ? (
                  <div className="space-y-4">
                    {auctionStats.wonAuctions.map((auction, index) => (
                      <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                          {auction.product?.images?.[0]?.imageUrl ? (
                            <img
                              src={auction.product.images[0].imageUrl}
                              alt={auction.product.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h5 className="font-semibold text-gray-900 truncate pr-2">
                              {auction.product?.product_name || "Unknown Product"}
                            </h5>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(auction.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {auction.product?.description || "No description"}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Won: ₹{parseFloat(auction.leading_amount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No auctions won yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-xl border">
            No auction data available.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
