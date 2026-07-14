import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
  ChevronDown,
} from "lucide-react";
import { authControllers } from "../api/auth";
import { userControllers } from "../api/user";
import { categoryControllers } from "../api/category";
import { productControllers } from "../api/product";
import { Switch } from "@headlessui/react";
import DisableModal from "../components/DisableModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isValidPhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import countryCodes from "../utils/countryCodes.json";
import SecureImage from "../components/SecureImage";
import SecureVideo from "../components/SecureVideo";

const formatAadhaar = (number) => {
  if (!number) return "";
  const cleaned = number.toString().replace(/\D/g, "");
  return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const ArtisanManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  // const [showFilter, setShowFilter] = useState(false);
  // const [locationFilter, setLocationFilter] = useState("");
  // const [uniqueLocations, setUniqueLocations] = useState([]);
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
    expertizeField: [],
    location: "",
    aadhaarNumber: "",
    user_caste_category: "",
    subCaste: "",
    introVideo: "",
    gstNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpertiseDropdownOpen, setIsExpertiseDropdownOpen] = useState(false);
  const [showSubCasteOther, setShowSubCasteOther] = useState(false);
  const dropdownRef = React.useRef(null);
  const expertiseDropdownRef = React.useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);

  const hasChanges = React.useMemo(() => {
    return isEditMode ? JSON.stringify(formData) !== JSON.stringify(initialFormData) : true;
  }, [isEditMode, formData, initialFormData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (
        expertiseDropdownRef.current &&
        !expertiseDropdownRef.current.contains(event.target)
      ) {
        setIsExpertiseDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showAddForm || showDetailsModal || showStatusModal || showVideoModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddForm, showDetailsModal, showStatusModal, showVideoModal]);

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.dial_code.includes(countrySearchTerm),
  );

  const [partnersData, setPartnersData] = useState(() => {
    const savedData = localStorage.getItem("partnersData");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [subCategories, setSubCategories] = useState([]);
  const casteCategories = {
    GENERAL: ["Brahmin", "Kshatriya", "Vaishya", "Shudra", "Other"],
    OBC: ["Yadav", "Kurmi", "Jat", "Gujjar", "Other"],
    SC: ["Chamar", "Pasi", "Dhobi", "Kori", "Other"],
    ST: ["Gond", "Bhil", "Santhal", "Munda", "Other"],
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
          a.id === selectedArtisan.id ? { ...a, status: newStatus } : a,
        ),
      );

      toast.dismiss();
      toast.success(
        `Artisan ${newStatus === "BLOCKED" ? "Blocked" : "Activated"
        } Successfully!`,
      );
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong!");
    }

    setShowStatusModal(false);
  };

  const getallSubcategory = async (categoryId) => {
    try {
      const resultData =
        await categoryControllers.getallSubcategory(categoryId);

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
        toast.dismiss();
        toast.warning("This artisan is already verified");
        return;
      }
      const response = await userControllers.verifyArtisan(id);
      toast.dismiss();
      toast.success("Artisan Verified Successfully ");
      setSelectedPartner((prev) =>
        prev && prev.id === id ? { ...prev, verify_status: "VERIFIED" } : prev,
      );
      fetchArtisans(currentPage, rowsPerPage);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error verifying artisan");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm /*, locationFilter*/]);

  const fetchArtisans = async (page = 1, limit = 10, search = "" /*, location = ""*/) => {
    try {
      setLoading(true);
      const response = await userControllers.getUserListGroup(
        "ARTISAN",
        page,
        limit,
        null,
        search
        // location
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
        location: user.address || user.location || "—",
        gstNumber: user.gstNumber || "—",
        user_caste_category: user.user_caste_category || "—",
        joinedDate: user.createdAt
          ? new Date(user.createdAt)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-")
          : "—",
        aadhaarNumber: user.aadhaarNumber || "N/A",
        subCaste: user.subCaste || "_",
        // verify_status: user.verify_status,
        verify_status: user.verifyStatus,

        status: user.status || "Approved Artisan",
        user_group: user.user_group || "ARTISAN",
        introVideo: user.introVideo || null,
        avatar: user.avatar || null,
      }));

      setPartnersData(mappedData);
      setTotalDocs(responseData.totalDocs || 0);
      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.error("Failed to load artisans", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load artisans";
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans(currentPage, rowsPerPage, debouncedSearchTerm /*, locationFilter*/);
    getallSubcategory("categoryId");
  }, [currentPage, rowsPerPage, debouncedSearchTerm /*, locationFilter*/]);

  /*
  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const res = await productControllers.getExpertiseDropdown();
        if (res.data?.data) {
          const expertiseData = res.data.data;
          const mapped = expertiseData.map(item => item.expertise || item.name || item);
          setUniqueLocations(mapped.filter(field => field && field !== "Not Specified"));
        }
      } catch (err) {
        console.error("Failed to load expertise dropdown", err);
      }
    };
    fetchExpertise();
  }, []);
  */

  // console.log("hdwjhed", subCategories);
  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setShowDetailsModal(true);
  };

  const handleEditClick = () => {
    setShowDetailsModal(false);
    setIsEditMode(true);
    setEditId(selectedPartner.id);

    let parsedExpertise = [];
    const exp = selectedPartner.expertizeField;
    if (exp && exp !== "Not Specified") {
      parsedExpertise = typeof exp === 'string' ? exp.split(',').map(s => s.trim()) : exp;
    }

    const casteCat = selectedPartner.user_caste_category;
    const subCst = selectedPartner.subCaste;
    if (casteCat && casteCat !== "—" && casteCategories[casteCat]) {
      if (subCst && subCst !== "_" && !casteCategories[casteCat].includes(subCst)) {
        setShowSubCasteOther(true);
      }
    }

    const initialData = {
      firstName: selectedPartner.firstName !== "—" ? selectedPartner.firstName : "",
      lastName: selectedPartner.lastName !== "—" ? selectedPartner.lastName : "",
      email: selectedPartner.email !== "—" ? selectedPartner.email : "",
      countryCode: selectedPartner.countryCode || "+91",
      phoneNo: selectedPartner.phoneNo !== "—" ? selectedPartner.phoneNo : "",
      expertizeField: parsedExpertise,
      location: selectedPartner.location !== "—" ? selectedPartner.location : "",
      aadhaarNumber: selectedPartner.aadhaarNumber !== "N/A" ? selectedPartner.aadhaarNumber : "",
      user_caste_category: casteCat !== "—" ? casteCat : "",
      subCaste: subCst !== "_" ? subCst : "",
      introVideo: selectedPartner.introVideo || "",
      gstNumber: selectedPartner.gstNumber !== "—" ? selectedPartner.gstNumber : "",
    };

    setFormData(initialData);
    setInitialFormData(initialData);

    setShowAddForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

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

    if (name === "firstName" || name === "lastName") {
      newValue = newValue.replace(/[^a-zA-Z\s]/g, "");
    }

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: newValue };
      if (name === "user_caste_category") {
        newFormData.subCaste = "";
        setShowSubCasteOther(false);
      }
      return newFormData;
    });

    // Clear error for the field being typed in
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Also clear Sub Caste error if Category changes
    if (name === "user_caste_category" && errors.subCaste) {
      setErrors((prev) => ({ ...prev, subCaste: "" }));
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91",
      phoneNo: "",
      expertizeField: [],
      location: "",
      aadhaarNumber: "",
      user_caste_category: "",
      subCaste: "",
      introVideo: "",
      gstNumber: "",
    });
    setShowSubCasteOther(false);
    setErrors({});
  };

  const handleAddEmployee = async () => {
    if (isSubmitting) return;
    toast.dismiss();
    setIsSubmitting(true);
    // console.log("Starting Add Artisan process. Checking validations...");

    {/*const handleValidationError = (message) => {
      toast.dismiss();
      toast.error(message);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 4000);
    };

    // Validation
    if (!formData.firstName.trim()) {
      // console.log("Validation Error: First Name is missing");
      handleValidationError("First Name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      // console.log("Validation Error: Last Name is missing");
      handleValidationError("Last Name is required");
      return;
    }
    if (!formData.email || !formData.email.trim()) {
      // console.log("Validation Error: Email is missing");
      handleValidationError("Email is required");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      // console.log("Validation Error: Invalid Email");
      handleValidationError("Please enter a valid email address");
      return;
    }
    {/*if (!formData.location || !formData.location.trim()) {
      // console.log("Validation Error: Address is missing");
      handleValidationError("Address is required");
      return;
    }
    if (!formData.phoneNo || formData.phoneNo.length !== 10) {
      // console.log("Validation Error: Invalid Phone Number");
      handleValidationError("Phone Number must be 10 digits");
      return;
    }
    if (!formData.expertizeField || formData.expertizeField.length === 0) {
      // console.log("Validation Error: Expertise Field is missing");
      handleValidationError("Please select at least 1 area of expertise");
      return;
    }
    if (!formData.aadhaarNumber || !aadhaarRegex.test(formData.aadhaarNumber)) {
      // console.log("Validation Error: Invalid Aadhaar Number");
      handleValidationError("Aadhaar Number must be 12 digits");
      return;
    }
    if (!formData.user_caste_category) {
      // console.log("Validation Error: Caste Category is missing");
      handleValidationError("Caste Category is required");
      return;
    }
    if (!formData.subCaste) {
      // console.log("Validation Error: Sub Caste is missing");
      handleValidationError("Sub Caste is required");
      return;
    }
    if (formData.gstNumber && !gstRegex.test(formData.gstNumber)) {
      // console.log("Validation Error: Invalid GST Number");
      handleValidationError("Invalid GST Number Format");
      return;
    }*/}
    let newErrors = {};

    // Validate all mandatory fields
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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

    if (!formData.expertizeField || formData.expertizeField.length === 0) {
      newErrors.expertizeField = "Please select at least 1 area of expertise";
    }

    if (!formData.aadhaarNumber || !aadhaarRegex.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = "Aadhaar Number must be 12 digits";
    }

    if (!formData.user_caste_category) {
      newErrors.user_caste_category = "Caste Category is required";
    }

    if (!formData.subCaste) {
      newErrors.subCaste = "Sub Caste is required";
    }

    if (formData.gstNumber && !gstRegex.test(formData.gstNumber)) {
      newErrors.gstNumber = "Invalid GST Number Format";
    }

    // Stop and show inline errors if any exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    if (isEditMode) {
      if (!hasChanges) {
        setIsSubmitting(false);
        setShowAddForm(false);
        return;
      }
    }

    try {
      // console.log("All validations passed. Preparing API payload...");
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        phoneNo: formData.phoneNo,
        expertizeField: Array.isArray(formData.expertizeField)
          ? formData.expertizeField.join(", ")
          : formData.expertizeField,
        location: formData.location,
        address: formData.location,
        aadhaarNumber: formData.aadhaarNumber,
        user_caste_category: formData.user_caste_category,
        subCaste: formData.subCaste,
        gstNumber: formData.gstNumber,
        user_group: "ARTISAN",
      };
      let response;

      if (isEditMode) {
        // console.log("Sending API request to updateArtisan...", payload);
        response = await userControllers.updateArtisan(editId, payload);
      } else {
        // console.log("Sending API request to addArtisan...", payload);
        response = await authControllers.addArtisan(payload);
      }

      // console.log("API Response received:", response);

      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success(
          isEditMode
            ? "Artisan updated successfully!"
            : "Artisan registered successfully! Login credentials sent to email."
        );
        handleCloseForm();
        await fetchArtisans(currentPage, rowsPerPage);
      } else {
        toast.dismiss();
        console.warn("API returned error status:", response);
        toast.dismiss();
        toast.error(response.data?.message || `Error ${isEditMode ? 'updating' : 'registering'} artisan`);
      }
    } catch (error) {
      toast.dismiss();
      console.error("API Request Failed (Catch Block):", error);

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
          `Error ${isEditMode ? 'updating' : 'registering'} artisan`
      );
    } finally {
      setIsSubmitting(false);
    }
    {/*console.log("Sending API request to addArtisan...", payload);
      const response = await authControllers.addArtisan(payload);
      // console.log("API Response received:", response);
      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success(
          "Artisan registered successfully! Login credentials sent to email.",
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
        toast.dismiss();
        toast.error(response.data?.message || "Error registering artisan");
      }
    } catch (error) {
      console.error("API Request Failed (Catch Block):", error);
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Error registering artisan",
      );
      console.error("Error registering artisan:", error);
    } finally {
      setIsSubmitting(false);
    }*/}
  };

  const filteredPartners = partnersData;

  // console.log("Filtered Partners:", filteredPartners);

  const indexOfFirstItem = (currentPage - 1) * rowsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * rowsPerPage, totalDocs);
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-lg">
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
                  Artisan Management
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
                placeholder="Search by Name & Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            {/*
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showFilter ? 'bg-orange-100 text-orange-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5 mr-2" /> Filters
              </button>
            */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" /> Register Artisan
            </button>
            {/* </div> */}
          </div>
          {/* showFilter && (
            <div className="mt-4 p-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
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
          ) */}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditMode ? "Edit Artisan Details" : "Register New Artisan"}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none ${errors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                      }`}
                    placeholder="Enter First Name"
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1 font-medium">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none ${errors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                      }`}
                    placeholder="Enter Last Name"
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1 font-medium">{errors.lastName}</p>}
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
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                      }`}
                    placeholder="Enter Email Address"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address {/*<span className="text-red-500">*</span>*/}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder=" Enter Your Address"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-40 relative" ref={dropdownRef}>
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
                      {/*<span className="truncate">{formData.countryCode}</span>*/}
                      {/*<span className="ml-2 text-gray-400">▼</span>*/}
                      <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
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

                          setFormData({ ...formData, phoneNo: value });

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
                            setFormData({ ...formData, phoneNo: value });
                            if (errors.phoneNo) setErrors((prev) => ({ ...prev, phoneNo: "" }));
                          }
                        }
                      }}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 ${errors.phoneNo ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                        }`}
                      placeholder="Enter Phone Number"
                    />
                    {errors.phoneNo && <p className="text-red-400 text-xs mt-1 font-medium">{errors.phoneNo}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise Field <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={expertiseDropdownRef}>
                    <div
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none cursor-pointer bg-white flex items-center justify-between ${errors.expertizeField ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`}
                      onClick={() =>
                        setIsExpertiseDropdownOpen(!isExpertiseDropdownOpen)
                      }
                    >
                      <span className="truncate">
                        {formData.expertizeField.length > 0
                          ? `${formData.expertizeField.length} selected`
                          : "Select Expertise"}
                      </span>
                      {/*<span className="ml-2 text-gray-400">▼</span>*/}
                      <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                    </div>

                    {isExpertiseDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {subCategories.map((subCategory, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm flex items-center gap-2"
                            onClick={() => {
                              const currentSelected = formData.expertizeField;
                              const isSelected = currentSelected.includes(
                                subCategory.category_name,
                              );
                              let newSelected;
                              if (isSelected) {
                                newSelected = currentSelected.filter(
                                  (item) =>
                                    item !== subCategory.category_name,
                                );
                              } else {
                                newSelected = [
                                  ...currentSelected,
                                  subCategory.category_name,
                                ];
                              }
                              setFormData({
                                ...formData,
                                expertizeField: newSelected,
                              });
                              if (errors.expertizeField) setErrors((prev) => ({ ...prev, expertizeField: "" }));
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={formData.expertizeField.includes(
                                subCategory.category_name,
                              )}
                              readOnly
                              className="rounded text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-gray-700">
                              {subCategory.category_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.expertizeField && <p className="text-red-400 text-xs mt-1 font-medium">{errors.expertizeField}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formatAadhaar(formData.aadhaarNumber)}
                    //  value={formData.aadhaarNumber}
                    maxLength={14}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 12) {
                        setFormData({ ...formData, aadhaarNumber: value });
                        if (errors.aadhaarNumber) setErrors((prev) => ({ ...prev, aadhaarNumber: "" }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.aadhaarNumber ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`}
                    placeholder="Enter Aadhar Number"
                  />
                  {errors.aadhaarNumber && <p className="text-red-400 text-xs mt-1 font-medium">{errors.aadhaarNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caste Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="user_caste_category"
                      value={formData.user_caste_category}
                      onChange={(e) => {
                        handleFormChange(e);
                        if (errors.user_caste_category) setErrors((prev) => ({ ...prev, user_caste_category: "" }));
                      }}
                      className={`w-full px-3 py-2  bg-white border rounded-lg focus:outline-none appearance-none ${errors.user_caste_category ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`}
                    >
                      <option value="" hidden>
                        Select Caste Category
                      </option>
                      {Object.keys(casteCategories).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  {errors.user_caste_category && <p className="text-red-400 text-xs mt-1 font-medium">{errors.user_caste_category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Caste <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="subCaste"
                      value={showSubCasteOther ? "Other" : formData.subCaste}
                      disabled={!formData.user_caste_category}
                      onChange={(e) => {
                        if (e.target.value === "Other") {
                          setShowSubCasteOther(true);
                          setFormData((prev) => ({ ...prev, subCaste: "" }));
                        } else {
                          setShowSubCasteOther(false);
                          handleFormChange(e);
                        }
                        if (errors.subCaste) setErrors((prev) => ({ ...prev, subCaste: "" }));
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none appearance-none ${!formData.user_caste_category ? "bg-gray-100 cursor-not-allowed text-gray-400" : "bg-white"} ${errors.subCaste ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`}
                    >
                      <option value="" hidden>
                        Select Sub Caste
                      </option>
                      {formData.user_caste_category &&
                        casteCategories[formData.user_caste_category]?.map(
                          (subCaste) => (
                            <option key={subCaste} value={subCaste}>
                              {subCaste}
                            </option>
                          ),
                        )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  {showSubCasteOther && (
                    <input
                      type="text"
                      name="subCaste"
                      value={formData.subCaste}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        setFormData({ ...formData, subCaste: value });
                        if (errors.subCaste) setErrors((prev) => ({ ...prev, subCaste: "" }));
                      }}
                      placeholder="Enter Custom Sub Caste"
                      className={`mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none ${errors.subCaste ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"}`}
                    />
                  )}
                  {errors.subCaste && <p className="text-red-400 text-xs mt-1 font-medium">{errors.subCaste}</p>}
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
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder=" Enter GST Number"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCloseForm}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    disabled={isSubmitting || (isEditMode && !hasChanges)}
                    className={`flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors ${isSubmitting || (isEditMode && !hasChanges) ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      isEditMode ? "Update Artisan" : "Register Artisan"
                    )}
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
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Artisan Details
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
                        <SecureImage
                          src={
                            selectedPartner.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              `${selectedPartner.firstName} ${selectedPartner.lastName}`,
                            )}&background=random`
                          }
                          alt={`${selectedPartner.firstName} ${selectedPartner.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {selectedPartner.verify_status === "VERIFIED" && (
                        <div className="mb-1">
                          <span className="text-green-600 text-xs font-semibold px-2 py-0.5 border border-green-500 rounded-full inline-block">
                            Verified
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 break-words capitalize">
                        {`${selectedPartner.firstName} ${selectedPartner.lastName}`}
                      </h3>
                      <p className="text-gray-500 break-words">
                        {selectedPartner.email || "N/A"}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${selectedPartner.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {selectedPartner.status ? selectedPartner.status.charAt(0).toUpperCase() + selectedPartner.status.slice(1).toLowerCase() : "Approved Artisan"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium break-words">{`${selectedPartner.countryCode || ""
                          } ${selectedPartner.phoneNo || "N/A"}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Expertise Field</p>
                        <p className="font-medium break-words">
                          {selectedPartner.expertizeField || "Not Specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Joined Date</p>
                        <p className="font-medium break-words">
                          {selectedPartner.joinedDate || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Aadhaar Number</p>
                        <p className="font-medium break-words">
                          {selectedPartner.aadhaarNumber ? formatAadhaar(selectedPartner.aadhaarNumber) : "N/A"}
                          {/* {selectedPartner.aadhaarNumber || "N/A"} */}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Caste Category</p>
                        <p className="font-medium break-words">
                          {selectedPartner.user_caste_category || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Sub Caste</p>
                        <p className="font-medium break-words">
                          {selectedPartner.subCaste || "N/A"}
                        </p>
                      </div>
                    </div>
                    {selectedPartner.gstNumber && selectedPartner.gstNumber !== "null" && selectedPartner.gstNumber !== "N/A" && selectedPartner.gstNumber !== "-" && selectedPartner.gstNumber.trim() !== "" && (
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">GST Number</p>
                          <p className="font-medium break-words">
                            {selectedPartner.gstNumber}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedPartner.location && selectedPartner.location !== "null" && selectedPartner.location !== "N/A" && selectedPartner.location !== "-" && selectedPartner.location.trim() !== "" && (
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium break-words">
                            {selectedPartner.location}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium break-words">
                          {selectedPartner.status ? selectedPartner.status.charAt(0).toUpperCase() + selectedPartner.status.slice(1).toLowerCase() : "Approved Artisan"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {selectedPartner?.introVideo ? (
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="px-5 py-2.5 bg-orange-600 text-white font-medium rounded-lg shadow-sm hover:bg-orange-700 transition-all"
                    >
                      View Intro Video
                    </button>
                  ) : (
                    <span className="px-5 py-2.5 bg-gray-50 text-gray-500 text-sm font-medium rounded-lg border border-gray-200 flex items-center shadow-sm">
                      No Intro Video Uploaded
                    </span>
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

                <div className="flex justify-end mt-6 pt-4 border-t space-x-3">
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Edit Details
                  </button>
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
                ) : (
                  filteredPartners.map((partner) => (
                    <tr
                      key={partner.id}
                      className="hover:bg-gray-50 transition-colors"
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
                          </div>
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
                            20,
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
                              } absolute top-1/2 -translate-y-1/2 inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => handleViewDetails(partner)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && filteredPartners.length === 0 && (
            <div className="p-8 text-center border-t border-gray-200">
              <p className="text-gray-500">
                {searchTerm ? "No artisans found matching your search criteria." : "No artisans found."}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 items-center p-6 border-t bg-white">
            <div className="flex items-center gap-4 text-base font-medium justify-self-start">
              <span className="text-gray-700">Rows per page:</span>

              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    const newLimit = Number(e.target.value);
                    setRowsPerPage(newLimit);
                    setCurrentPage(1);

                    fetchArtisans(1, newLimit);
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
              {indexOfFirstItem}–{indexOfLastItem} of {totalDocs}
            </div>

            <div className="flex items-center gap-4 justify-self-end">
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                  }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
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
        </div>
      </div>
      {showStatusModal && (
        <DisableModal
          onClose={() => setShowStatusModal(false)}
          onConfirm={confirmStatusChange}
          title={
            selectedArtisan?.status === "ACTIVE"
              ? "Disable Profile"
              : "Activate Profile"
          }
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

            <h2 className="text-lg font-bold mb-3 text-center">Intro Video</h2>

            <SecureVideo
              src={selectedPartner.introVideo}
              className="w-full h-[250px] rounded-lg object-cover"
            />
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};
export default ArtisanManagement;
