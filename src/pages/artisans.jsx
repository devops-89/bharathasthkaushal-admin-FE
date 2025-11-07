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
import { toast } from "react-toastify";
import { authControllers } from "../api/auth";
import { userControllers } from "../api/user";
import { categoryControllers } from "../api/category";
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
  const itemsPerPage = 8;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phoneNo: "",
    expertizeField: "",
    location: "",
    aadhaarNumber: "",
    user_caste_category: "GENERAL",
    subCaste: "",
    introVideo: "",
    gstNumber: "",
  });
  
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
      fetchArtisans();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying artisan");
    }
  };

  const fetchArtisans = async () => {
  try {
    const response = await userControllers.getUserListGroup("ARTISAN");
    let artisans =
      response.data?.data?.docs || response.data?.docs || response.data || [];

    const mappedData = artisans.map((user, index) => ({
      id: user._id || user.id || `temp-id-${index + 1}`,
      firstName: user.firstName || (user.email ? user.email.split("@")[0] : "—"),
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
      verify_status: user.verify_status,
      status: user.status || "Approved Artisan",
      user_group: user.user_group || "ARTISAN",
    }));

    setPartnersData(mappedData);
    // toast.success("Artisans Loaded Successfully ");
  } catch (error) {
    // toast.error("Failed to load artisans ");
  }
};

  useEffect(() => {
    fetchArtisans();
    getallSubcategory("categoryId");
  }, []);
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
    try {
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
      const response = await authControllers.addArtisan(payload);
      console.log("smkdmk", response, payload);
      if (response.status === 200) {
        alert(
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
          user_caste_category: "GENERAL",
          subCaste: "",
          gstNumber: "",
        });
        await fetchArtisans();
      } else {
        alert("Error: " + response.data?.message);
      }
    } catch (error) {
      alert("Error registering artisan: " + error.message);
      console.log("object".error);
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
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPartners = filteredPartners.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Artisan Management
              </h1>
              <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                <NavLink
                  to="/Dashboard"
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
                    Expertise Field
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
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="example@yopmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder=" enter your location"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code
                      </label>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="9876543210"
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
                      Aadhaar Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="2376643876543240"
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
                      {casteCategories[formData.user_caste_category].map(
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
                      value={formData.gstNumber}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="BNH456fd646458674"
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
                      Register Artisan
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
                  {/* <h2 className="text-xl font-bold text-gray-900">
                    Artisan Details
                  </h2> */}
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Artisan Details
                    {selectedPartner.verify_status === "VERIFIED" && (
                      <span className="text-green-600 text-sm font-semibold px-3 py-1 border border-green-500 rounded-full">
                        ✅ Verified Artisan
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
                        <p className="font-medium">{`${
                          selectedPartner.countryCode || ""
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
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                      <div className="text-sm font-medium text-gray-900">
                        {[partner.firstName, partner.lastName].join(" ")}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined: {partner.joinedDate || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{`${
                        partner.countryCode || ""
                      } ${partner.phoneNo || "N/A"}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {partner.expertizeField || "Not Specified"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-semibold px-3 py-1 rounded-full w-fit ${
                          partner.verify_status === "VERIFIED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {partner.verify_status === "VERIFIED"
                          ? "Verified"
                          : "Pending"}
                      </div>
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

                          {/* {partner.status !== "Verified" && (
                            <button
                              onClick={() => handleVerifyArtisan(partner.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                            >
                              ✅ Verify Artisan
                            </button>
                          )} */}
                          {partner.verify_status !== "VERIFIED" ? (
                            <button
                              onClick={() => handleVerifyArtisan(partner.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                            >
                              ✅ Verify Artisan
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                toast.info(
                                  "This artisan is already verified ✅"
                                )
                              }
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              ✔ Already Verified
                            </button>
                          )}
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
      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 py-4">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Prev
    </button>

    {[...Array(totalPages).keys()].map((num) => (
      <button
        key={num}
        onClick={() => setCurrentPage(num + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === num + 1
            ? "bg-orange-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {num + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

    </div>
    
  );
};
export default ArtisanManagement;
