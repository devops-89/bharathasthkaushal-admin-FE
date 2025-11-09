import React, { useState, useEffect } from "react";
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
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
const ArtisanManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    countryCode: "+91",
    user_group: "EMPLOYEE",
    location: "",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    location: "",
  });
  const [partnersData, setPartnersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fetchArtisans = async () => {
    try {
      const response = await userControllers.getUserListGroup("EMPLOYEE");
      console.log("API Response:", response.data);
      let artisans = response.data?.data?.docs || [];
      if (!Array.isArray(artisans)) {
        console.error("Expected docs to be an array, got:", artisans);
        alert("Unexpected data format from API: docs is not an array");
        return;
      }
      const mappedData = artisans.map((user, index) => ({
        ...user,
        id: user._id || user.id || index + 1,
        joinedDate: user.createdAt
          ? new Date(user.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        name: user.name || user.fullName || "Unknown",
        email: user.email || "No email",
        phoneNo: user.phoneNo || "",
        countryCode: user.countryCode || "+91",
        location: user.location || "",
        latitude: user.latitude || 0,
        longitude: user.longitude || 0,
      }));
      setPartnersData(mappedData);
    } catch (error) {
      console.error("Error fetching artisans:", error);
      alert("Error fetching employee data: " + error.message);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  const toggleDropdown = (partnerId) => {
    setDropdownOpen(dropdownOpen === partnerId ? null : partnerId);
  };
  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setShowDetailsModal(true);
    setDropdownOpen(null);
  };

  const closeDropdown = () => {
    setDropdownOpen(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    let newErrors = { ...errors };

    if (name === "email") {
      newErrors.email =
        !value.includes("@") || !value.includes(".com")
          ? "Enter a valid email"
          : "";
    }

    if (name === "phoneNo") {
      newErrors.phoneNo =
        value.length !== 10 ? "Phone number must be 10 digits" : "";
    }

    if (name === "firstName") {
      newErrors.firstName = value.trim() === "" ? "First name is required" : "";
    }

    if (name === "lastName") {
      newErrors.lastName = value.trim() === "" ? "Last name is required" : "";
    }

    if (name === "location") {
      newErrors.location = value.trim() === "" ? "Location is required" : "";
    }

    setErrors(newErrors);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddEmployee = async () => {
    if (
      errors.email ||
      errors.phoneNo ||
      errors.firstName ||
      errors.lastName ||
      errors.location
    ) {
      return toast.error("Please fill correct data .");
    }
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNo ||
      !formData.location
    ) {
      return toast.error("All required fields must be filled.");
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
        latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
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
          latitude: "",
          longitude: "",
        });
        setErrors({});
      } else {
        toast.error(response.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error.message);
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
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentPartners = filteredPartners.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPartners.length / rowsPerPage);
  const uniqueLocations = [
    ...new Set(partnersData.map((p) => p.location.split(",")[0])),
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Employee Management
              </h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
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
                    to="/employee-management"
                    className={({ isActive }) =>
                      isActive ? "text-orange-600 font-semibold" : ""
                    }
                  >
                    Employee Management
                  </NavLink>
                </nav>
              </nav>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Search and Filter */}
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
              <Plus className="w-4 h-4 mr-2" /> Register Employee
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
                        placeholder="Aadil"
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
                        placeholder="Ansari"
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
                      placeholder="example@yopmail.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
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
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="9876543210"
                      />
                      {errors.phoneNo && (
                        <p className="text-red-500 text-xs">{errors.phoneNo}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Mumbai, India"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="12.356784"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="12.345634"
                      />
                    </div>
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
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{selectedPartner.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedPartner.email}</p>
                      </div>
                    </div>
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
                  </div>

                  {/* Coordinates */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Coordinates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Latitude</p>
                        <p className="font-medium">
                          {selectedPartner.latitude}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Longitude</p>
                        <p className="font-medium">
                          {selectedPartner.longitude}
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
                    Location
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
                        {`${partner.firstName} ${partner.lastName}`}
                      </div>

                      <div className="text-xs text-gray-500">
                        Joined: {partner.joinedDate}
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
                      <div className="text-sm text-gray-900">
                        {partner.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative">
                      <button
                        onClick={() => toggleDropdown(partner.id)}
                        className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
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
            {/* Pagination Controls */}
            {filteredPartners.length > 0 && (
              <div className="flex items-center justify-between p-4 border-t bg-white rounded-b-xl shadow-sm mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
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
                  {indexOfFirstItem + 1}–
                  {Math.min(indexOfLastItem, filteredPartners.length)} of{" "}
                  {filteredPartners.length}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded ${
                      currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
                    }`}
                  >
                    ‹
                  </button>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded ${
                      currentPage === totalPages
                        ? "text-gray-400"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
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
    </div>
  );
};

export default ArtisanManagement;
