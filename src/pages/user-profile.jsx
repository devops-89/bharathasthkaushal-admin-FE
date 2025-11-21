//  import React, { useEffect, useState } from "react";
// import { useParams, NavLink } from "react-router-dom";
// import { userControllers } from "../api/user";
// import { ToastContainer, toast } from "react-toastify";
// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { userControllers } from "../api/user";
import { ToastContainer, toast } from "react-toastify";



function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
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
      <ToastContainer />
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
          User Profile
        </h1>

        <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <span>•</span>
          <NavLink to="/user-management">User Management</NavLink>
        </nav>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow p-6 rounded-xl border max-w-3xl mx-auto">

        {/* Avatar + Name */}
        <div className="flex items-center gap-5 mb-6">
          <img
            src={
              user.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-semibold">
              {user.name || `${user.firstName} ${user.lastName}`}
            </h2>
            <p className="text-gray-600">{user.roleName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <p>
            <b>Email:</b> {user.email || "—"}
          </p>

          <p>
            <b>Phone:</b> {user.countryCode} {user.phoneNo || "—"}
          </p>

          <p>
            <b>Status:</b> {user.status}
          </p>
          <p>
            <b>Aadhaar Number:</b> {user.aadhaarNumber || "—"}
          </p>
          {/* <p>
            <b>GST Number:</b> {user.gstNumber || "—"}
          </p> */}

          {/* <p>
            <b>Address Added:</b> {user.hasAddress ? "Yes" : "No"}
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
