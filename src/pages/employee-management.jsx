import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  X,
  Eye,
  Phone,
  Calendar,
  User,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { authControllers } from "../api/auth";
import { userControllers } from "../api/user";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countryCodes from "../utils/countryCodes.json";
import { Switch } from "@headlessui/react";
import DisableModal from "../components/DisableModal";

const ArtisanManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const dropdownRef = React.useRef(null);

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.dial_code.includes(countrySearchTerm)
  );


  const [partnersData, setPartnersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArtisans = async (page = 1, limit = 10) => {
    try {
      const response = await userControllers.getUserListGroup("EMPLOYEE", page, limit);
      console.log("API Response:", response.data);
      let artisans = response.data?.data?.docs || [];
      if (!Array.isArray(artisans)) {
        toast.error("Expected docs to be an array, got:", artisans);
        toast.error("Unexpected data format from API: docs is not an array");
        return;
      }
      const mappedData = artisans.map((user, index) => ({
        ...user,
        id: user._id || user.id || index + 1,
        joinedDate: user.createdAt
          ? new Date(user.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        name: user.name || user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown",
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
      toast.error("Error fetching artisans:", error);
      toast.error("Error fetching employee data: " + error.message);
    }
  };

  useEffect(() => {
    fetchArtisans(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter]);

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
          a.id === selectedEmployee.id ? { ...a, status: newStatus } : a
        )
      );

      toast.success(
        `Employee ${newStatus === "BLOCKED" ? "Blocked" : "Activated"
        } Successfully!`
      );
    } catch (error) {
      toast.error("Something went wrong!");
    }

    setShowStatusModal(false);
  };

  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setShowDetailsModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validation for Name, Email and Location fields
    if (name === "firstName" || name === "lastName" || name === "email" || name === "location") {
      // Actively remove leading spaces
      newValue = newValue.replace(/^\s+/, "");
      // Actively remove multiple consecutive spaces
      newValue = newValue.replace(/\s{2,}/g, " ");
    }

    let newErrors = { ...errors };

    if (name === "email") {
      newErrors.email =
        !newValue.includes("@") || !newValue.includes(".com")
          ? "Enter a valid email"
          : "";
    }

    if (name === "phoneNo") {
      newErrors.phoneNo =
        newValue.length !== 10 ? "Phone number must be 10 digits" : "";
    }

    if (name === "firstName") {
      newErrors.firstName = newValue.trim() === "" ? "First name is required" : "";
    }

    if (name === "lastName") {
      newErrors.lastName = newValue.trim() === "" ? "Last name is required" : "";
    }

    if (name === "location") {
      newErrors.location = newValue.trim() === "" ? "Location is required" : "";
    }

    setErrors(newErrors);
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };
  const handleAddEmployee = async () => {
    // Validation
    if (!formData.firstName.trim()) {
      return toast.error("First Name is required");
    }
    if (!formData.lastName.trim()) {
      return toast.error("Last Name is required");
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      return toast.error("Enter a valid email address");
    }
    if (!formData.phoneNo || formData.phoneNo.length !== 10) {
      return toast.error("Phone Number must be 10 digits");
    }

    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      return toast.error("Aadhaar Number must be 12 digits");
    }
    if (!formData.location.trim()) {
      return toast.error("Location is required");
    }

    try {
      const payload = {
        email: formData.email.trim(),
        phoneNo: formData.phoneNo.trim(),
        user_group: "EMPLOYEE",
        countryCode: formData.countryCode,
        location: formData.location.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        aadhaarNumber: formData.aadhaarNumber.trim(),
      };
      const response = await authControllers.addEmployee(payload);

      if (response.status === 200) {
        toast.success("Employee registered successfully!");
        setPartnersData((prev) => [
          ...prev,
          {
            ...payload,
            name: `${payload.firstName} ${payload.lastName}`.trim(),
            id: prev.length + 1,
            joinedDate: new Date().toISOString().split("T")[0],
          },
        ]);
        setShowAddForm(false);
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
      } else {
        toast.error(response.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Error registering employee");
    }
  };
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

  const currentPartners = filteredPartners;
  const uniqueLocations = [
    ...new Set(partnersData.map((p) => p.location.split(",")[0])),
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
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
        {/* Register Artisan Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Register New Employee
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter First Name"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter Last Name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter Email Address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="w-40 relative" ref={dropdownRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country Code
                      </label>
                      <div
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer bg-white flex items-center justify-between"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      >
                        <span className="truncate">
                          {formData.countryCode}
                        </span>
                        <span className="ml-2 text-gray-400">▼</span>
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
                                onChange={(e) => setCountrySearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
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
                                    setFormData({ ...formData, countryCode: country.dial_code });
                                    setIsCountryDropdownOpen(false);
                                    setCountrySearchTerm("");
                                  }}
                                >
                                  <span className="font-medium text-gray-900 w-12">{country.dial_code}</span>
                                  <span className="text-gray-600 truncate">{country.name}</span>
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
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNo"
                        value={formData.phoneNo}
                        maxLength={10}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) {
                            setFormData((prev) => ({ ...prev, phoneNo: value }));
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter Phone Number"
                      />
                      {errors.phoneNo && (
                        <p className="text-red-500 text-xs">{errors.phoneNo}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Number *
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      maxLength={12}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 12) {
                          setFormData((prev) => ({ ...prev, aadhaarNumber: value }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter Aadhaar Number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter Location"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddEmployee}
                      className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Register Employee
                    </button>
                  </div>
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
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-100">
                        <img
                          src={
                            selectedPartner.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              selectedPartner.name
                            )}&background=random`
                          }
                          alt={selectedPartner.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
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
                  </div>

                  {/* Basic Info */}
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
                          {selectedPartner.aadhaarNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              partner.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                `${partner.firstName} ${partner.lastName}`
                              )}&background=random`
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
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
                            } inline-block h-[18px] w-[18px] transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <button
                        onClick={() => handleViewDetails(partner)}
                        className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalDocs > 0 && (
              <div className="grid grid-cols-3 items-center p-6 border-t bg-white mt-4 rounded-b-xl">
                <div className="flex items-center gap-4 text-base font-medium justify-self-start">
                  <span className="text-gray-700">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
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

        {filteredPartners.length === 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">
              No employees found matching your search criteria.
            </p>
          </div>
        )}
        {showStatusModal && (
          <DisableModal
            onClose={() => setShowStatusModal(false)}
            onConfirm={confirmStatusChange}
            title={selectedEmployee?.status === "ACTIVE" ? "Disable Profile" : "Activate Profile"}
            message={
              selectedEmployee?.status === "ACTIVE"
                ? "Are you sure you want to disable this user's profile?"
                : "Are you sure you want to activate this user's profile?"
            }
          />
        )}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </div >

  );
};

export default ArtisanManagement;
