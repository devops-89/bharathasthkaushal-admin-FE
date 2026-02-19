import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { User, Mail, Shield, Lock, Camera, Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import { userControllers } from "../api/user";
import { authControllers } from "../api/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await userControllers.getUserDetails();
        const userData = response.data.data;
        setUser({
          name: userData.name || "User",
          email: userData.email || "N/A",
          role: userData.roleName || "N/A",
          avatar: userData.avatar || "",
        });
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching user details", error);
        toast.error("Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, []);

  const handleChangePasswordClick = () => {
    setIsChangePasswordOpen(true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (passwordData.newPassword === passwordData.oldPassword) {
      toast.error(
        "Old password is same as new password. Please choose a different one.",
      );
      return;
    }

    try {
      await authControllers.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setIsChangePasswordOpen(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await userControllers.updateUserProfile(formData);
      setUser((prev) => ({
        ...prev,
        name: formData.name,
        email: formData.email,
      }));

      // Update localStorage to persist changes across the app if used elsewhere
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = {
          ...parsedUser,
          name: formData.name,
          email: formData.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG formats are allowed");
      // clear input
      e.target.value = null;
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      await userControllers.updateUserProfile(formData);

      const response = await userControllers.getUserDetails();
      const userData = response.data.data;
      setUser((prev) => ({ ...prev, avatar: userData.avatar }));

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture", error);
      const errMsg =
        error.response?.data?.message || "Failed to update profile picture";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            My Profile
          </h1>
          <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
            <NavLink to="/dashboard" className="hover:text-orange-800">
              Dashboard
            </NavLink>
            <span>•</span>
            <span className="font-semibold">Profile</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
              <div className="px-6 pb-6">
                <div className="relative -mt-16 mb-4 flex justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden relative group">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                    <div
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".jpg,.jpeg,.png"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-orange-500 sm:text-sm border p-2"
                      />
                    ) : (
                      <p className="text-base font-semibold text-gray-900">
                        {user.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      Email Address
                    </p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-orange-500 sm:text-sm border p-2"
                      />
                    ) : (
                      <p className="text-base font-semibold text-gray-900">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-base font-semibold text-gray-900">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Security</h3>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Lock className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">
                      Change Your Password
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleChangePasswordClick}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Change Password
            </h2>
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 999999 }}
      />
    </div>
  );
};

export default Profile;
