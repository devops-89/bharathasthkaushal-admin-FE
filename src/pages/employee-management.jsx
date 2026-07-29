import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  X,
  Info,
  Phone,
  Calendar,
  User,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Pencil,
} from "lucide-react";
import { authControllers } from "../api/auth";
import { userControllers } from "../api/user";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isValidPhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import countryCodes from "../utils/countryCodes.json";
import { Switch } from "@headlessui/react";
import DisableModal from "../components/DisableModal";
import SecureImage from "../components/SecureImage";

const formatAadhaar = (number) => {
  if (!number) return "";
  const cleaned = number.toString().replace(/\D/g, "");
  return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const ArtisanManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    countryCode: "+91",
    user_group: "EMPLOYEE",
    location: "",
    aadhaarNumber: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    location: "",
    aadhaarNumber: "",
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [isUpdatingEmployee, setIsUpdatingEmployee] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [editCountryDropdownOpen, setEditCountryDropdownOpen] = useState(false);
  const [editCountrySearchTerm, setEditCountrySearchTerm] = useState("");
  const dropdownRef = React.useRef(null);
  const editDropdownRef = React.useRef(null);

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.dial_code.includes(countrySearchTerm),
  );

  const editFilteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(editCountrySearchTerm.toLowerCase()) ||
      country.dial_code.includes(editCountrySearchTerm),
  );

  const [partnersData, setPartnersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchArtisans = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const response = await userControllers.getUserListGroup(
        "EMPLOYEE",
        page,
        limit,
        null,
        search
      );
      // console.log("API Response:", response.data);
      let artisans = response.data?.data?.docs || [];
      if (!Array.isArray(artisans)) {
        toast.dismiss();
        toast.error("Expected docs to be an array, got:", artisans);
        toast.dismiss();
        toast.error("Unexpected data format from API: docs is not an array");
        return;
      }
      const mappedData = artisans.map((user, index) => ({
        ...user,
        id: user._id || user.id || index + 1,
        joinedDate: user.createdAt
          ? new Date(user.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        name:
          user.name ||
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Unknown",
        email: user.email || "No email",
        phoneNo: user.phoneNo || "",
        countryCode: user.countryCode || "+91",
        location: user.location || "",
        latitude: user.latitude || 0,
        longitude: user.longitude || 0,
        status: user.status || "ACTIVE",
        avatar: user.avatar || null,
        aadhaarNumber: user.aadhaarNumber || "",
      }));
      setPartnersData(mappedData);
      setTotalDocs(response.data?.data?.totalDocs || 0);
      setTotalPages(response.data?.data?.totalPages || 1);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch employee data.";
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans(currentPage, rowsPerPage, debouncedSearch);
  }, [currentPage, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, locationFilter]);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showAddForm || showDetailsModal || showStatusModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddForm, showDetailsModal, showStatusModal]);

  const handleToggleStatus = (employee) => {
    setSelectedEmployee(employee);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const newStatus =
        selectedEmployee.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

      await userControllers.updateUserStatus(selectedEmployee.id, newStatus);
      setPartnersData((prev) =>
        prev.map((a) =>
          a.id === selectedEmployee.id ? { ...a, status: newStatus } : a,
        ),
      );

      toast.dismiss();
      toast.success(
        `Employee ${newStatus === "BLOCKED" ? "Blocked" : "Activated"
        } Successfully!`,
      );
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong!");
    }

    setShowStatusModal(false);
  };

  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setEditFormData({
      firstName: partner.firstName || "",
      lastName: partner.lastName || "",
      email: partner.email || "",
      phoneNo: partner.phoneNo || "",
      countryCode: partner.countryCode || "+91",
      location: partner.location || "",
      aadhaarNumber: partner.aadhaarNumber ? formatAadhaar(partner.aadhaarNumber.toString().replace(/\D/g, "")) : "",
    });
    setEditErrors({});
    setIsEditingDetails(false);
    setShowDetailsModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "firstName" || name === "lastName") {
      newValue = newValue.replace(/[^a-zA-Z\s]/g, "");
    }
    if (name === "email") {
      newValue = newValue.toLowerCase();
    }
    if (
      name === "firstName" ||
      name === "lastName" ||
      name === "email" ||
      name === "location"
    ) {
      newValue = newValue.replace(/^\s+/, "");
      newValue = newValue.replace(/\s{2,}/g, " ");
    }

    let newErrors = { ...editErrors };
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = newValue.trim() === "" ? "Email is required" : !emailRegex.test(newValue) ? "Enter a valid email address" : "";
    }
    if (name === "firstName") {
      newErrors.firstName = newValue.trim() === "" ? "First name is required" : "";
    }
    if (name === "lastName") {
      newErrors.lastName = newValue.trim() === "" ? "Last name is required" : "";
    }
    if (name === "location") {
      const locationRegex = /^[a-zA-Z0-9,\s]*$/;
      newErrors.location = newValue.trim() === ""
        ? "Location is required"
        : !locationRegex.test(newValue)
          ? "Invalid location format. Only alphanumeric characters and commas are allowed"
          : "";
    }

    if (name === "aadhaarNumber") {
      let unformatted = newValue.replace(/\D/g, "");
      if (unformatted.length > 12) unformatted = unformatted.slice(0, 12);
      newValue = formatAadhaar(unformatted);
      if (unformatted.length !== 12 && unformatted.length > 0) {
        newErrors.aadhaarNumber = "Aadhaar Number must be 12 digits";
      } else {
        newErrors.aadhaarNumber = "";
      }
    }

    setEditErrors(newErrors);
    setEditFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleUpdateEmployee = async () => {
    if (isUpdatingEmployee) return;
    toast.dismiss();

    let newErrors = {};

    if (!editFormData.firstName?.trim()) newErrors.firstName = "First Name is required";
    if (!editFormData.lastName?.trim()) newErrors.lastName = "Last Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editFormData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(editFormData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!editFormData.phoneNo) {
      newErrors.phoneNo = "Phone Number is required";
    } else {
      const selectedCountry = countryCodes.find(c => c.dial_code === editFormData.countryCode);
      const countryIso = selectedCountry ? selectedCountry.code : undefined;
      try {
        if (countryIso) {
          if (!isValidPhoneNumber(editFormData.phoneNo, countryIso)) {
            newErrors.phoneNo = "Invalid phone number for the selected country";
          }
        } else {
          const fullNumber = editFormData.countryCode + editFormData.phoneNo;
          if (!isValidPhoneNumber(fullNumber)) {
            newErrors.phoneNo = "Invalid phone number format";
          }
        }
      } catch (e) {
        newErrors.phoneNo = "Invalid phone number";
      }
    }

    const unformattedAadhaar = editFormData.aadhaarNumber ? editFormData.aadhaarNumber.replace(/\D/g, "") : "";
    if (unformattedAadhaar && unformattedAadhaar.length !== 12) {
      newErrors.aadhaarNumber = "Aadhaar Number must be 12 digits";
    }

    const locationRegex = /^[a-zA-Z0-9,\s]*$/;
    if (!editFormData.location?.trim()) {
      newErrors.location = "Location is required";
    } else if (!locationRegex.test(editFormData.location)) {
      newErrors.location = "Invalid location format. Only alphanumeric characters and commas are allowed";
    }

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsUpdatingEmployee(true);
    try {
      const payload = {
        firstName: editFormData.firstName.trim(),
        lastName: editFormData.lastName.trim(),
        name: `${editFormData.firstName.trim()} ${editFormData.lastName.trim()}`,
        email: editFormData.email.trim(),
        phoneNo: editFormData.phoneNo,
        countryCode: editFormData.countryCode,
        location: editFormData.location?.trim() || "",
        aadhaarNumber: editFormData.aadhaarNumber ? editFormData.aadhaarNumber.replace(/\D/g, "") : "",
      };
      const response = await userControllers.updateArtisan(selectedPartner.id, payload);
      if (response.status === 200 || response.status === 201) {
        toast.success("Employee updated successfully!");
        fetchArtisans(currentPage, rowsPerPage, debouncedSearch);
        setIsEditingDetails(false);
        setShowDetailsModal(false);
      } else {
        toast.error(response.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating employee");
    } finally {
      setIsUpdatingEmployee(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Allow only alphabetic characters and spaces for name fields
    if (name === "firstName" || name === "lastName") {
      newValue = newValue.replace(/[^a-zA-Z\s]/g, "");
    }

    // Convert email to lowercase automatically
    if (name === "email") {
      newValue = newValue.toLowerCase();
    }

    // Validation for Name, Email and Location fields
    if (
      name === "firstName" ||
      name === "lastName" ||
      name === "email" ||
      name === "location"
    ) {
      // Actively remove leading spaces
      newValue = newValue.replace(/^\s+/, "");
      // Actively remove multiple consecutive spaces
      newValue = newValue.replace(/\s{2,}/g, " ");
    }

    let newErrors = { ...errors };

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email =
        newValue.trim() === "" ? "Email is required" :
          !emailRegex.test(newValue) ? "Enter a valid email address" : "";
    }

    if (name === "firstName") {
      newErrors.firstName =
        newValue.trim() === "" ? "First name is required" : "";
    }

    if (name === "lastName") {
      newErrors.lastName =
        newValue.trim() === "" ? "Last name is required" : "";
    }

    if (name === "location") {
      const locationRegex = /^[a-zA-Z0-9,\s]*$/;
      newErrors.location = newValue.trim() === ""
        ? "Location is required"
        : !locationRegex.test(newValue)
          ? "Invalid location format. Only alphanumeric characters and commas are allowed"
          : "";
    }

    setErrors(newErrors);
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };
  const handleAddEmployee = async () => {
    if (isRegistering) return;
    toast.dismiss();
    let newErrors = {};

    // Validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.phoneNo) {
      newErrors.phoneNo = "Phone Number is required";
    } else {
      const selectedCountry = countryCodes.find(c => c.dial_code === formData.countryCode);
      const countryIso = selectedCountry ? selectedCountry.code : undefined;

      try {
        if (countryIso) {
          if (!isValidPhoneNumber(formData.phoneNo, countryIso)) {
            newErrors.phoneNo = "Invalid phone number for the selected country";
          }
        } else {
          const fullNumber = formData.countryCode + formData.phoneNo;
          if (!isValidPhoneNumber(fullNumber)) {
            newErrors.phoneNo = "Invalid phone number format";
          }
        }
      } catch (e) {
        newErrors.phoneNo = "Invalid phone number";
      }
    }

    const aadhaarRegex = /^[0-9]{12}$/;
    const unformattedAadhaar = formData.aadhaarNumber ? formData.aadhaarNumber.replace(/\D/g, "") : "";
    if (!unformattedAadhaar || !aadhaarRegex.test(unformattedAadhaar)) {
      newErrors.aadhaarNumber = "Aadhaar Number must be 12 digits";
    }
    const locationRegex = /^[a-zA-Z0-9,\s]*$/;
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (!locationRegex.test(formData.location)) {
      newErrors.location = "Invalid location format. Only alphanumeric characters and commas are allowed";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsRegistering(true);
    try {
      const payload = {
        email: formData.email.trim(),
        phoneNo: formData.phoneNo.trim(),
        user_group: "EMPLOYEE",
        countryCode: formData.countryCode,
        location: formData.location.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        aadhaarNumber: unformattedAadhaar,
      };
      const response = await authControllers.addEmployee(payload);

      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success("Employee registered successfully!");
        fetchArtisans(currentPage, rowsPerPage);
        handleCloseAddForm();
      } else {
        toast.dismiss();
        toast.error(response.data?.message || "Something went wrong.");
      }
      // } catch (error) {
      //   toast.dismiss();
      //   toast.error(
      //     error.response?.data?.message ||
      //     error.message ||
      //     "Error registering employee",
      //   );
      // } 
    } catch (error) {
      toast.dismiss();
      if (
        error.response?.status === 422 &&
        error.response?.data?.message?.includes("Invalid email format")
      ) {
        setErrors((prev) => ({
          ...prev,
          email: "Invalid email format",
        }));
        return;
      }

      toast.dismiss();
      toast.error(
        Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join(", ")
          : error.response?.data?.message ||
          error.message ||
          "Error registering employee"
      );
    } finally {
      setIsRegistering(false);
    }
  };
  const handleCloseAddForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      countryCode: "+91",
      user_group: "EMPLOYEE",
      location: "",
      aadhaarNumber: "",
    });
    setErrors({});
    setShowAddForm(false);
  };

  /*
  const filteredPartners = partnersData.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter ||
      partner.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesTab = partner.user_group === "EMPLOYEE";

    return matchesSearch && matchesLocation && matchesTab;
  });
  */

  const currentPartners = partnersData;
  const uniqueLocations = [
    ...new Set(partnersData.map((p) => p.location.split(",")[0])),
  ];

  const isFormChanged = selectedPartner ? (
    (editFormData.firstName || "").trim() !== (selectedPartner.firstName || "").trim() ||
    (editFormData.lastName || "").trim() !== (selectedPartner.lastName || "").trim() ||
    (editFormData.email || "").trim() !== (selectedPartner.email || "").trim() ||
    (editFormData.phoneNo || "").trim() !== (selectedPartner.phoneNo || "").trim() ||
    (editFormData.countryCode || "").trim() !== (selectedPartner.countryCode || "+91").trim() ||
    (editFormData.location || "").trim() !== (selectedPartner.location || "").trim() ||
    (editFormData.aadhaarNumber || "").replace(/\D/g, "") !== (selectedPartner.aadhaarNumber || "").toString().replace(/\D/g, "")
  ) : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Employee Management
              </h1>
              <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? "text-orange-600 font-semibold" : ""
                  }
                >
                  Dashboard
                </NavLink>
                <span>•</span>
                <NavLink
                  to="/employee-management"
                  className={({ isActive }) =>
                    isActive ? "text-orange-600 font-semibold" : ""
                  }
                >
                  Employee Management
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Search and Action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" /> Register Employee
            </button>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setLocationFilter("");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-gray-900">
                  Register New Employee
                </h2>
                <button
                  onClick={handleCloseAddForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                        }`}
                      placeholder="Enter First Name"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1 font-medium">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                        }`}
                      placeholder="Enter Last Name"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1 font-medium">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                      }`}
                    placeholder="Enter Email Address"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="w-30 relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country Code
                    </label>
                    <div
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 cursor-pointer bg-white flex items-center justify-between"
                      onClick={() =>
                        setIsCountryDropdownOpen(!isCountryDropdownOpen)
                      }
                    >
                      <div className="flex items-center gap-2 truncate">
                        {(() => {
                          const selected = countryCodes.find(c => c.dial_code === formData.countryCode);
                          return selected && selected.code ? (
                            <img
                              src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                              alt={selected.code}
                              className="w-5 h-auto rounded-sm object-cover shadow-sm"
                            />
                          ) : null;
                        })()}
                        <span>{formData.countryCode}</span>
                      </div>
                      <ChevronDown className="ml-2 text-gray-400 w-4 h-4" />
                    </div>

                    {isCountryDropdownOpen && (
                      <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearchTerm}
                              onChange={(e) =>
                                setCountrySearchTerm(e.target.value)
                              }
                              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto flex-1">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <div
                                key={country.code}
                                className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    countryCode: country.dial_code,
                                  });
                                  setIsCountryDropdownOpen(false);
                                  setCountrySearchTerm("");
                                }}
                              >
                                {country.code && (
                                  <img
                                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                    alt={country.code}
                                    className="w-5 h-auto rounded-sm object-cover shadow-sm flex-shrink-0"
                                  />
                                )}
                                <span className="font-medium text-gray-900 w-12">
                                  {country.dial_code}
                                </span>
                                <span className="text-gray-600 truncate">
                                  {country.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No countries found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      maxLength={
                        countryCodes.find((c) => c.dial_code === formData.countryCode)?.max_length || 15
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        const selectedCountry = countryCodes.find(c => c.dial_code === formData.countryCode);
                        const countryIso = selectedCountry ? selectedCountry.code : undefined;

                        if (countryIso) {
                          // Only block if we are ADDING characters
                          if (value.length > (formData.phoneNo || "").length) {
                            let isTooLong = false;
                            // Strict limit for India (10 digits for standard mobile numbers)
                            if (countryIso === 'IN' && value.length > 10) {
                              isTooLong = true;
                            } else if (validatePhoneNumberLength(value, countryIso) === 'TOO_LONG') {
                              isTooLong = true;
                            }

                            if (isTooLong) return; // Block typing
                          }

                          setFormData((prev) => ({ ...prev, phoneNo: value }));

                          // Start digit / validity validation using libphonenumber-js
                          const maxLength = selectedCountry.max_length;
                          if (value.length > 0 && maxLength && value.length === maxLength) {
                            if (!isValidPhoneNumber(value, countryIso)) {
                              setErrors((prev) => ({ ...prev, phoneNo: "Invalid phone number for selected country" }));
                            } else {
                              if (errors.phoneNo) setErrors((prev) => ({ ...prev, phoneNo: "" }));
                            }
                          } else {
                            if (errors.phoneNo) setErrors((prev) => ({ ...prev, phoneNo: "" }));
                          }
                        } else {
                          if (value.length <= 15) {
                            setFormData((prev) => ({ ...prev, phoneNo: value }));
                            if (errors.phoneNo) setErrors((prev) => ({ ...prev, phoneNo: "" }));
                          }
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.phoneNo ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                        }`}
                      placeholder="Enter Phone Number"
                    />
                    {errors.phoneNo && (
                      <p className="text-red-400 text-xs mt-1 font-medium">{errors.phoneNo}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    maxLength={14}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 12) {
                        const formattedValue = formatAadhaar(value);
                        setFormData((prev) => ({
                          ...prev,
                          aadhaarNumber: formattedValue,
                        }));
                        if (errors.aadhaarNumber) {
                          setErrors((prev) => ({ ...prev, aadhaarNumber: "" }));
                        }
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.aadhaarNumber ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                      }`}
                    placeholder="Enter Aadhaar Number"
                    required
                  />
                  {errors.aadhaarNumber && (
                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.aadhaarNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.location ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                      }`}
                    placeholder="Enter Location"
                  />
                  {errors.location && (
                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.location}</p>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCloseAddForm}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    disabled={isRegistering}
                    className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {isRegistering ? "Registering employee..." : "Register Employee"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Details Modal */}
        {showDetailsModal && selectedPartner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Employee Details
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className={isEditingDetails ? "space-y-4" : "space-y-6"}>
                  <div className={`flex items-center space-x-4 ${isEditingDetails ? "mb-4" : "mb-6"}`}>
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-100">
                        <SecureImage
                          src={
                            selectedPartner.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              selectedPartner.name,
                            )}&background=random`
                          }
                          alt={selectedPartner.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {!isEditingDetails ? (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                          {selectedPartner.name}
                        </h3>
                        <p className="text-gray-500">{selectedPartner.email}</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${selectedPartner.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {selectedPartner.status || "ACTIVE"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                          <input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditFormChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${editErrors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`} />
                          {editErrors.firstName && <p className="text-red-400 text-xs mt-1 font-medium">{editErrors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                          <input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditFormChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${editErrors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`} />
                          {editErrors.lastName && <p className="text-red-400 text-xs mt-1 font-medium">{editErrors.lastName}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  {!isEditingDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-medium">
                            {selectedPartner.countryCode}{" "}
                            {selectedPartner.phoneNo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">
                            {selectedPartner.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Joined Date</p>
                          <p className="font-medium">
                            {selectedPartner.joinedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Aadhaar Number</p>
                          <p className="font-medium">
                            {selectedPartner.aadhaarNumber ? formatAadhaar(selectedPartner.aadhaarNumber) : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${editErrors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`} />
                        {editErrors.email && <p className="text-red-400 text-xs mt-1 font-medium">{editErrors.email}</p>}
                      </div>
                      <div className="flex gap-2">
                        <div className="w-30 relative" ref={editDropdownRef}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                          <div
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 cursor-pointer bg-white flex items-center justify-between"
                            onClick={() => setEditCountryDropdownOpen(!editCountryDropdownOpen)}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {(() => {
                                const selected = countryCodes.find(c => c.dial_code === editFormData.countryCode);
                                return selected && selected.code ? (
                                  <img
                                    src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
                                    alt={selected.code}
                                    className="w-5 h-auto rounded-sm object-cover shadow-sm"
                                  />
                                ) : null;
                              })()}
                              <span>{editFormData.countryCode}</span>
                            </div>
                            <ChevronDown className="ml-2 text-gray-400 w-4 h-4" />
                          </div>

                          {editCountryDropdownOpen && (
                            <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                              <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                                <div className="relative">
                                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <input
                                    type="text"
                                    placeholder="Search country..."
                                    value={editCountrySearchTerm}
                                    onChange={(e) => setEditCountrySearchTerm(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                              <div className="overflow-y-auto flex-1">
                                {editFilteredCountries.length > 0 ? (
                                  editFilteredCountries.map((country) => (
                                    <div
                                      key={country.code}
                                      className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2"
                                      onClick={() => {
                                        setEditFormData({ ...editFormData, countryCode: country.dial_code });
                                        setEditCountryDropdownOpen(false);
                                        setEditCountrySearchTerm("");
                                      }}
                                    >
                                      {country.code && (
                                        <img
                                          src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                          alt={country.code}
                                          className="w-5 h-auto rounded-sm object-cover shadow-sm flex-shrink-0"
                                        />
                                      )}
                                      <span className="font-medium text-gray-900 w-12">{country.dial_code}</span>
                                      <span className="text-gray-600 truncate">{country.name}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-sm text-gray-500 text-center">No countries found</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            name="phoneNo"
                            value={editFormData.phoneNo}
                            maxLength={countryCodes.find((c) => c.dial_code === editFormData.countryCode)?.max_length || 15}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              const selectedCountry = countryCodes.find(c => c.dial_code === editFormData.countryCode);
                              const countryIso = selectedCountry ? selectedCountry.code : undefined;

                              if (countryIso) {
                                if (value.length > (editFormData.phoneNo || "").length) {
                                  let isTooLong = false;
                                  if (countryIso === 'IN' && value.length > 10) isTooLong = true;
                                  else if (validatePhoneNumberLength(value, countryIso) === 'TOO_LONG') isTooLong = true;
                                  if (isTooLong) return;
                                }

                                setEditFormData((prev) => ({ ...prev, phoneNo: value }));

                                const maxLength = selectedCountry.max_length;
                                if (value.length > 0 && maxLength && value.length === maxLength) {
                                  if (!isValidPhoneNumber(value, countryIso)) {
                                    setEditErrors((prev) => ({ ...prev, phoneNo: "Invalid phone number for selected country" }));
                                  } else {
                                    if (editErrors.phoneNo) setEditErrors((prev) => ({ ...prev, phoneNo: "" }));
                                  }
                                } else {
                                  if (editErrors.phoneNo) setEditErrors((prev) => ({ ...prev, phoneNo: "" }));
                                }
                              } else {
                                if (value.length <= 15) {
                                  setEditFormData((prev) => ({ ...prev, phoneNo: value }));
                                  if (editErrors.phoneNo) setEditErrors((prev) => ({ ...prev, phoneNo: "" }));
                                }
                              }
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${editErrors.phoneNo ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`}
                          />
                          {editErrors.phoneNo && <p className="text-red-400 text-xs mt-1 font-medium">{editErrors.phoneNo}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                        <input type="text" name="location" value={editFormData.location} onChange={handleEditFormChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${editErrors.location ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`} />
                        {editErrors.location && <p className="text-red-400 text-xs mt-1 font-medium">{editErrors.location}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                        <input type="text" name="aadhaarNumber" value={editFormData.aadhaarNumber} maxLength={14} onChange={handleEditFormChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${editErrors.aadhaarNumber ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`} />
                        {editErrors.aadhaarNumber && <p className="text-red-400 text-xs mt-1 font-medium">{editErrors.aadhaarNumber}</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  {!isEditingDetails && (
                    <button
                      onClick={() => {
                        setEditErrors({});
                        setIsEditingDetails(true);
                      }}
                      className="px-4 py-2 text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Details
                    </button>
                  )}
                  {isEditingDetails && (
                    <button
                      onClick={handleUpdateEmployee}
                      disabled={isUpdatingEmployee || !isFormChanged}
                      className={`px-4 py-2 text-white rounded-xl transition-colors ${isUpdatingEmployee || !isFormChanged
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-600 hover:bg-orange-700"
                        }`}
                    >
                      {isUpdatingEmployee ? "Saving..." : "Save"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (isEditingDetails) setIsEditingDetails(false);
                      else setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Artisans Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentPartners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? "No employees found matching your search criteria." : "No employees found."}
                    </td>
                  </tr>
                ) : (
                  currentPartners.map((partner) => (
                    <tr
                      key={partner.id}
                      onClick={() => handleViewDetails(partner)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <SecureImage
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                partner.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  `${partner.firstName} ${partner.lastName}`,
                                )}&background=random`
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {`${partner.firstName} ${partner.lastName}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined: {partner.joinedDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {partner.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {partner.countryCode} {partner.phoneNo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={partner.status === "ACTIVE"}
                            onChange={() => handleToggleStatus(partner)}
                            className={`${partner.status === "ACTIVE"
                              ? "bg-orange-600"
                              : "bg-gray-300"
                              } relative inline-flex h-[22px] w-[45px] rounded-full transition`}
                          >
                            <span className="sr-only">Toggle Status</span>
                            <span
                              className={`${partner.status === "ACTIVE"
                                ? "translate-x-6"
                                : "translate-x-1"
                                } absolute top-1/2 -translate-y-1/2 inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                          </Switch>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(partner);
                            }}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Info size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalDocs > 0 && (
              <div className="grid grid-cols-3 items-center p-6 border-t bg-white mt-4 rounded-b-xl">
                <div className="flex items-center gap-4 text-base font-medium justify-self-start">
                  <span className="text-gray-700">Rows per page:</span>
                  <div className="relative">
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-orange-500 bg-white"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="text-base text-gray-600 font-medium justify-self-center">
                  {(currentPage - 1) * rowsPerPage + 1}–
                  {Math.min(currentPage * rowsPerPage, totalDocs)} of{" "}
                  {totalDocs}
                </div>

                <div className="flex items-center gap-4 justify-self-end">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                      }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                      }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>


        {showStatusModal && (
          <DisableModal
            onClose={() => setShowStatusModal(false)}
            onConfirm={confirmStatusChange}
            title={
              selectedEmployee?.status === "ACTIVE"
                ? "Disable Profile"
                : "Activate Profile"
            }
            message={
              selectedEmployee?.status === "ACTIVE"
                ? "Are you sure you want to disable this user's profile?"
                : "Are you sure you want to activate this user's profile?"
            }
          />
        )}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </div>
  );
};

export default ArtisanManagement;
