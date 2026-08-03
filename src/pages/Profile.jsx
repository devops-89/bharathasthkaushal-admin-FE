import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { User, Mail, Shield, Lock, Camera, Edit2, Eye, EyeOff, X, Trash2, ImageIcon } from "lucide-react";
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
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await userControllers.getUserDetails();
        const userData = response.data.data;
        setUser({
          name: userData.name || "User",
          email: userData.email || "N/A",
          role: (userData.user_group || userData.roleName || "N/A").toString().replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
          avatar: userData.avatar || "",
        });
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching user details", error);
        toast.dismiss();
        toast.error("Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, []);

  const handleChangePasswordClick = () => {
    setIsChangePasswordOpen(true);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    const errors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordData.oldPassword) {
      errors.oldPassword = "Current password is required";
      hasErrors = true;
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
      hasErrors = true;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
      hasErrors = true;
    } else if (passwordData.newPassword === passwordData.oldPassword) {
      errors.newPassword = "Old password is same as new password. Please choose a different one.";
      hasErrors = true;
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Confirm new password is required";
      hasErrors = true;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "New passwords do not match";
      hasErrors = true;
    }

    setPasswordErrors(errors);
    if (hasErrors) return;

    try {
      await authControllers.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.dismiss();
      toast.success("Password changed successfully. Please login again.");
      setIsChangePasswordOpen(false);

      setTimeout(() => {
        localStorage.removeItem("accessToken"); sessionStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken"); sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("user"); sessionStorage.removeItem("user");
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error("Error changing password", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNameError("");
    setEmailError("");
    setFormData({
      name: user.name,
      email: user.email,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "name") {
      if (/[^a-zA-Z\s]/.test(newValue)) {
        setNameError("Full name can only contain alphabets and spaces");
      } else {
        setNameError("");
      }
      newValue = newValue.replace(/[^a-zA-Z\s]/g, "");
    }

    if (name === "email") {
      newValue = newValue.toLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (newValue.trim() === "") {
        setEmailError("Email is required");
      } else if (!emailRegex.test(newValue)) {
        setEmailError("Enter a valid email address format");
      } else {
        setEmailError("");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSave = async () => {

    const newName = formData.name.trim();
    const newEmail = formData.email.trim();

    if (newName === user.name && newEmail === user.email) {
      setIsEditing(false);
      return;
    }

    try {
      await userControllers.updateUserProfile({
        name: newName,
        email: newEmail
      });
      setUser((prev) => ({
        ...prev,
        //  name: formData.name,
        //  email: formData.email,
        name: newName,
        email: newEmail,
      }));

      // Update localStorage to persist changes across the app if used elsewhere
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = {
          ...parsedUser,
          //  name: formData.name,
          //  email: formData.email,
          name: newName,
          email: newEmail,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setIsEditing(false);
      toast.dismiss();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      const errMsg = error.response?.data?.message;
      toast.dismiss();
      toast.error(Array.isArray(errMsg) ? errMsg[0] : (errMsg || "Failed to update profile"));
    }
  };

  const handleImageClick = () => {
    if (user.avatar) {
      setIsImageModalOpen(true);
    } else {
      fileInputRef.current.click();
    }
  };

  const handleChangeImage = () => {
    setIsImageModalOpen(false);
    fileInputRef.current.click();
  };

  const handleRemoveImage = async () => {
    try {
      await userControllers.updateUserProfile({
        avatar: null
      });
      setUser(prev => ({ ...prev, avatar: "" }));

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = { ...parsedUser, avatar: "" };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setIsImageModalOpen(false);
      toast.dismiss();
      toast.success("Profile picture removed successfully");
    } catch (error) {
      console.error("Error removing profile picture", error);
      toast.dismiss();
      toast.error("Failed to remove profile picture");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.dismiss();
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

      toast.dismiss();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture", error);
      const errMsg =
        error.response?.data?.message || "Failed to update profile picture";
      toast.dismiss();
      toast.error(errMsg);
    }
  };

  const hasChanges = formData.name.trim() !== user.name || formData.email.trim() !== user.email;
  const isFormValid = !nameError && !emailError && formData.name.trim() !== "" && formData.email.trim() !== "";

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
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user.name}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 tracking-wide">
                    {user.role}
                  </span>
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
                      disabled={!hasChanges || !isFormValid}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${hasChanges && isFormValid
                        ? "bg-orange-600 text-white hover:bg-orange-700"
                        : "bg-gray-200 text-gray-700 cursor-not-allowed"
                        }`}
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
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:outline-none sm:text-sm border p-2 ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-orange-500"}`}
                        />
                        {nameError && (
                          <p className="text-red-400 text-xs mt-1">{nameError}</p>
                        )}
                      </div>
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
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md shadow-sm focus:outline-none sm:text-sm border p-2 ${emailError ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-orange-500"}`}
                        />
                        {emailError && (
                          <p className="text-red-400 text-xs mt-1">{emailError}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-base font-semibold text-gray-900">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                {/*<div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 tracking-wide">
                      {user.role}
                    </span>
                  </div>
                </div>*/}
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
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none pr-10 ${passwordErrors.oldPassword ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-orange-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.oldPassword && (
                  <p className="text-red-400 text-xs mt-1">{passwordErrors.oldPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none pr-10 ${passwordErrors.newPassword ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-orange-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-400 text-xs mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none pr-10 ${passwordErrors.confirmPassword ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-orange-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                )}
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

      {/* Image Action Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] relative transform transition-all scale-100">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-8 pb-6 px-6 flex flex-col items-center border-b border-gray-50">
              <div className="w-16 h-16 bg-gradient-to-tr from-orange-100 to-amber-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <ImageIcon className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Profile Photo</h3>
              <p className="text-sm text-gray-500 mt-1 text-center font-medium">
                Update or remove your picture
              </p>
            </div>

            <div className="p-6 flex gap-4 bg-gray-50/50">
              <button
                onClick={handleRemoveImage}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 text-red-600 font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Remove</span>
              </button>
              <button
                onClick={handleChangeImage}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-500/20 hover:shadow-lg active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm">Change</span>
              </button>
            </div>
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
