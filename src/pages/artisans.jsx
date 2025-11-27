import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  X,
  Eye,
  MoreVertical,
  Phone,
  Calendar,
  User,
  Mail,
  MapPin,
} from "lucide-react";
import { authControllers } from "../api/auth";
import { userControllers } from "../api/user";
import { categoryControllers } from "../api/category";
import { Switch } from "@headlessui/react";
import DisableModal from "../components/DisableModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countryCodes from "../utils/countryCodes.json";
const ArtisanManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const aadhaarRegex = /^[0-9]{12}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phoneNo: "",
    expertizeField: "",
    location: "",
    aadhaarNumber: "",
    user_caste_category: "",
    subCaste: "",
    introVideo: "",
    gstNumber: "",
  });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.dial_code.includes(countrySearchTerm)
  );

  const [partnersData, setPartnersData] = useState(() => {
    const savedData = localStorage.getItem("partnersData");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [subCategories, setSubCategories] = useState([]);
  const casteCategories = {
    GENERAL: ["Brahmin", "Kshatriya", "Vaishya", "Shudra"],
    OBC: ["Yadav", "Kurmi", "Jat", "Gujjar"],
    SC: ["Chamar", "Pasi", "Dhobi", "Kori"],
    ST: ["Gond", "Bhil", "Santhal", "Munda"],
  };
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const handleToggleStatus = (artisan) => {
    setSelectedArtisan(artisan);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const newStatus =
        selectedArtisan.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

      await userControllers.updateUserStatus(selectedArtisan.id, newStatus);
      setPartnersData((prev) =>
        prev.map((a) =>
          a.id === selectedArtisan.id ? { ...a, status: newStatus } : a
        )
      );

      toast.success(
        `Artisan ${newStatus === "BLOCKED" ? "Blocked" : "Activated"
        } Successfully!`
      );
    } catch (error) {
      toast.error("Something went wrong!");
    }

    setShowStatusModal(false);
  };

  const getallSubcategory = async (categoryId) => {
    try {
      const resultData = await categoryControllers.getallSubcategory(
        categoryId
      );

      setSubCategories(resultData.data.data.docs);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    }
  };
  const handleVerifyArtisan = async (id) => {
    try {
      const partner = partnersData.find((p) => p.id === id);
      if (partner.verify_status === "VERIFIED") {
        toast.info("This artisan is already verified ");
        return;
      }
      const response = await userControllers.verifyArtisan(id);
      toast.success("Artisan Verified Successfully ");
      fetchArtisans(currentPage, rowsPerPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying artisan");
    }
  };
  const fetchArtisans = async (page = 1, limit = 10) => {
    try {
      const response = await userControllers.getUserListGroup(
        "ARTISAN",
        page,
        limit
      );
      const responseData = response.data?.data || response.data || {};
      let artisans = responseData.docs || responseData || [];

      const mappedData = artisans.map((user, index) => ({
        id: user._id || user.id || `temp-id-${index + 1}`,
        firstName:
          user.firstName || (user.email ? user.email.split("@")[0] : "—"),
        lastName: user.lastName || "—",
        email: user.email || "—",
        phoneNo: user.phoneNo || "—",
        countryCode: user.countryCode || "+91",
        expertizeField: user.expertizeField || "Not Specified",
        location: user.location || "—",
        gstNumber: user.gstNumber || "—",
        user_caste_category: user.user_caste_category || "—",
        joinedDate: user.createdAt
          ? new Date(user.createdAt).toISOString().split("T")[0]
          : "—",
        aadhaarNumber: user.aadhaarNumber || "N/A",
        subCaste: user.subCaste || "_",
        // verify_status: user.verify_status,
        verify_status: user.verifyStatus,

        status: user.status || "Approved Artisan",
        user_group: user.user_group || "ARTISAN",
        introVideo: user.introVideo || null,
      }));

      setPartnersData(mappedData);
      setTotalDocs(responseData.totalDocs || 0);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Failed to load artisans", error);
    }
  };

  useEffect(() => {
    fetchArtisans(currentPage, rowsPerPage);
    getallSubcategory("categoryId");
  }, [currentPage, rowsPerPage]);

  console.log("hdwjhed", subCategories);
  const toggleDropdown = (partnerId) => {
    setDropdownOpen(dropdownOpen === partnerId ? null : partnerId);
  };
  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setShowDetailsModal(true);
    setDropdownOpen(null);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === "user_caste_category") {
        newFormData.subCaste = "";
      }
      return newFormData;
    });
  };

  const handleAddEmployee = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log("Starting Add Artisan process. Checking validations...");

    const handleValidationError = (message) => {
      toast.error(message);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 4000);
    };

    // Validation
    if (!formData.firstName.trim()) {
      console.log("Validation Error: First Name is missing");
      handleValidationError("First Name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      console.log("Validation Error: Last Name is missing");
      handleValidationError("Last Name is required");
      return;
    }
    if (!formData.phoneNo || formData.phoneNo.length !== 10) {
      console.log("Validation Error: Invalid Phone Number");
      handleValidationError("Phone Number must be 10 digits");
      return;
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      console.log("Validation Error: Invalid Email");
      handleValidationError("Please enter a valid email address");
      return;
    }
    if (!formData.aadhaarNumber || !aadhaarRegex.test(formData.aadhaarNumber)) {
      console.log("Validation Error: Invalid Aadhaar Number");
      handleValidationError("Aadhaar Number must be 12 digits");
      return;
    }
    if (formData.gstNumber && !gstRegex.test(formData.gstNumber)) {
      console.log("Validation Error: Invalid GST Number");
      handleValidationError("Invalid GST Number Format");
      return;
    }

    try {
      console.log("All validations passed. Preparing API payload...");
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        phoneNo: formData.phoneNo,
        expertizeField: formData.expertizeField,
        location: formData.location,
        aadhaarNumber: formData.aadhaarNumber,
        user_caste_category: formData.user_caste_category,
        subCaste: formData.subCaste,
        gstNumber: formData.gstNumber,
        user_group: "ARTISAN",
      };
      console.log("Sending API request to addArtisan...", payload);
      const response = await authControllers.addArtisan(payload);
      console.log("API Response received:", response);
      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Artisan registered successfully! Login credentials sent to email."
        );
        setShowAddForm(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "+91",
          phoneNo: "",
          expertizeField: "",
          location: "",
          aadhaarNumber: "",
          user_caste_category: "",
          subCaste: "",
          gstNumber: "",
        });
        await fetchArtisans(currentPage, rowsPerPage);
      } else {
        console.warn("API returned error status:", response);
        toast.error(response.data?.message || "Error registering artisan");
      }
    } catch (error) {
      console.error("API Request Failed (Catch Block):", error);
      toast.error(
        error.response?.data?.message || error.message || "Error registering artisan"
      );
      console.error("Error registering artisan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPartners = partnersData.filter((partner) => {
    const matchesSearch =
      partner.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter || partner.expertizeField === locationFilter;
    const matchesTab =
      !partner.user_group || partner.user_group.toUpperCase() === "ARTISAN";
    return matchesSearch && matchesLocation && matchesTab;
  });

  console.log("Filtered Partners:", filteredPartners);
  const uniqueLocations = [
    ...new Set(partnersData.map((p) => p.expertizeField)),
  ].filter((field) => field && field !== "Not Specified");

  const indexOfFirstItem = (currentPage - 1) * rowsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * rowsPerPage, totalDocs);
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Artisan Management
              </h1> */}
              <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Artisan Management
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
                  to="/artisans"
                  className={({ isActive }) =>
                    isActive ? "text-orange-600 font-semibold" : ""
                  }
                >
                  Artisans
                </NavLink>
              </nav>
            </div>
          </div>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" /> Register Artisan
            </button>
          </div>
          {showFilter && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Fields</option>
                    {uniqueLocations.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setLocationFilter("")}
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
                    Register New Artisan
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      onBlur={() => {
                        if (!emailRegex.test(formData.email)) {
                          toast.error("Please enter a valid email address");
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter email address"
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
                      placeholder=" Enter your location"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-40 relative" ref={dropdownRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code
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
                            setFormData({ ...formData, phoneNo: value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter phone Number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expertise Field
                    </label>
                    <select
                      name="expertizeField"
                      value={formData.expertizeField}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Expertise</option>
                      {subCategories.map((subCategory, index) => (
                        <option key={index} value={subCategory.category_name}>
                          {subCategory.category_name}
                        </option>
                      ))}
                    </select>
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
                          setFormData({ ...formData, aadhaarNumber: value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter Aadhar Number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Caste Category
                    </label>
                    <select
                      name="user_caste_category"
                      value={formData.user_caste_category}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Caste Category</option>
                      {Object.keys(casteCategories).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Caste
                    </label>
                    <select
                      name="subCaste"
                      value={formData.subCaste}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Sub Caste</option>
                      {formData.user_caste_category && casteCategories[formData.user_caste_category]?.map(
                        (subCaste) => (
                          <option key={subCaste} value={subCaste}>
                            {subCaste}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gst Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber.toUpperCase()}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          gstNumber: e.target.value.toUpperCase(),
                        });
                      }}
                      onBlur={() => {
                        if (
                          formData.gstNumber &&
                          !gstRegex.test(formData.gstNumber)
                        ) {
                          toast.error("Invalid GST Number Format");
                        }
                      }}
                      maxLength={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder=" Enter GST Number"
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
                      disabled={isSubmitting}
                      className={`flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Register Artisan"
                      )}
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
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Artisan Details
                    {selectedPartner.verify_status === "VERIFIED" && (
                      <span className="text-green-600 text-sm font-semibold px-3 py-1 border border-green-500 rounded-full">
                        Verified Artisan
                      </span>
                    )}
                  </h2>

                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">First Name</p>
                        <p className="font-medium">
                          {selectedPartner.firstName || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Last Name</p>
                        <p className="font-medium">
                          {selectedPartner.lastName || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {selectedPartner.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{`${selectedPartner.countryCode || ""
                          } ${selectedPartner.phoneNo || "N/A"}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Expertise Field</p>
                        <p className="font-medium">
                          {selectedPartner.expertizeField || "Not Specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Joined Date</p>
                        <p className="font-medium">
                          {selectedPartner.joinedDate || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Aadhaar Number</p>
                        <p className="font-medium">
                          {selectedPartner.aadhaarNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Caste Category</p>
                        <p className="font-medium">
                          {selectedPartner.user_caste_category || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Sub Caste</p>
                        <p className="font-medium">
                          {selectedPartner.subCaste || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">GST Number</p>
                        <p className="font-medium">
                          {selectedPartner.gstNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">
                          {selectedPartner.location || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">
                          {selectedPartner.status || "Approved Artisan"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {selectedPartner?.introVideo && (
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="px-5 py-2.5 bg-orange-600 text-white font-medium rounded-lg shadow-sm hover:bg-orange-700 transition-all"
                    >
                      View Intro Video
                    </button>
                  )}
                  {selectedPartner?.user_group === "ARTISAN" &&
                    selectedPartner?.verify_status !== "VERIFIED" && (
                      <button
                        onClick={() => handleVerifyArtisan(selectedPartner.id)}
                        className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 transition-all"
                      >
                        Verify Artisan
                      </button>
                    )}
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
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expertise Field
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {[partner.firstName, partner.lastName]
                          .join(" ")
                          .slice(0, 20) +
                          ([partner.firstName, partner.lastName].join(" ")
                            .length > 20
                            ? "..."
                            : "")}
                      </div>

                      <div className="text-xs text-gray-500">
                        Joined: {partner.joinedDate || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{`${partner.countryCode || ""
                        } ${partner.phoneNo || "N/A"}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(partner.expertizeField || "Not Specified").slice(
                          0,
                          20
                        ) +
                          ((partner.expertizeField || "").length > 20
                            ? "..."
                            : "")}
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

                    <th className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {partner.status || "Approved Artisan"}
                      </div>
                    </th>

                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <button
                        onClick={() => toggleDropdown(partner.id)}
                        className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {dropdownOpen === partner.id && (
                        <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                          <button
                            onClick={() => handleViewDetails(partner)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredPartners.length === 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">
              No artisans found matching your search criteria.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 border-t bg-white mt-4 rounded-b-xl">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-700">Rows per page:</span>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setRowsPerPage(newLimit);
              setCurrentPage(1);

              fetchArtisans(1, newLimit);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {indexOfFirstItem}–{indexOfLastItem} of {totalDocs}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
              }`}
          >
            ‹
          </button>

          <button
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded ${currentPage === totalPages ? "text-gray-400" : "hover:bg-gray-100"
              }`}
          >
            ›
          </button>
        </div>
        {showStatusModal && (
          <DisableModal
            onClose={() => setShowStatusModal(false)}
            onConfirm={confirmStatusChange}
            title={selectedArtisan?.status === "ACTIVE" ? "Disable Profile" : "Activate Profile"}
            message={
              selectedArtisan?.status === "ACTIVE"
                ? "Are you sure you want to disable this user's profile?"
                : "Are you sure you want to activate this user's profile?"
            }
          />
        )}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-4 relative shadow-xl">
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold mb-3 text-center">
                Intro Video
              </h2>

              <video
                src={selectedPartner.introVideo}
                controls
                className="w-full h-[250px] rounded-lg object-cover"
              ></video>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </div>
  );
};
export default ArtisanManagement;
