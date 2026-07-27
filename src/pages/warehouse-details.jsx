import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { warehouseControllers } from "../api/warehouse";
import {
    ArrowLeft,
    MapPin,
    Globe,
    Package,
    Calendar,
    Clock,
    Warehouse,
    CheckCircle,
    Search,

    ChevronLeft,
    ChevronRight,
    Navigation,
    ChevronDown,
    XCircle,
    Play,
    FileText,
    Info,
    Pencil,
    X,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { countries } from "../constants/countries";

export default function WarehouseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warehouse, setWarehouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [errors, setErrors] = useState({});
    const [editFormData, setEditFormData] = useState({
        name: "",
        country: "",
        location: "",
        latitude: "",
        longitude: "",
        status: "ACTIVE"
    });
    const [countrySearch, setCountrySearch] = useState("");
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredCountries = countries.filter((country) =>
        country.toLowerCase().includes(countrySearch.toLowerCase())
    );

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
    useEffect(() => {
        if (isEditModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isEditModalOpen]);

    const [initialEditFormData, setInitialEditFormData] = useState(null);

    const hasChanges = React.useMemo(() => {
        return JSON.stringify(editFormData) !== JSON.stringify(initialEditFormData);
    }, [editFormData, initialEditFormData]);

    const handleEditClick = () => {
        const initialData = {
            name: warehouse.warehouse_name || warehouse.name || "",
            country: warehouse.origin_country || warehouse.country || "",
            location: warehouse.address || warehouse.location || "",
            latitude: warehouse.latitude || "",
            longitude: warehouse.longitude || "",
            status: warehouse.status || "ACTIVE"
        };
        // Ensure complex address objects are strings for editing
        if (typeof initialData.location === "object" && initialData.location !== null) {
            const addr = initialData.location;
            initialData.location = [addr.houseNo, addr.street, addr.city, addr.state, addr.country, addr.postalCode].filter(Boolean).join(', ');
        }

        setEditFormData(initialData);
        setInitialEditFormData(initialData);
        setCountrySearch(initialData.country);
        setErrors({});
        setIsEditModalOpen(true);
    };

    const handleUpdateWarehouse = async () => {
        if (!hasChanges) return;

        let newErrors = {};

        if (!editFormData.name.trim()) {
            newErrors.name = "Warehouse Name is required";
        } else if (!/^[a-zA-Z0-9-',\s&()./]+$/.test(editFormData.name)) {
            newErrors.name = "Only -, ', &, (, ), ., ,, and / are allowed as special characters.";
        }

        if (!editFormData.location.trim()) {
            newErrors.location = "Address is required";
        }

        if (!editFormData.latitude) {
            newErrors.latitude = "Latitude is required";
        } else if (isNaN(editFormData.latitude)) {
            newErrors.latitude = "Invalid latitude format";
        } else if (Number(editFormData.latitude) < -90 || Number(editFormData.latitude) > 90) {
            newErrors.latitude = "Latitude must be between -90 and 90";
        }

        if (!editFormData.longitude) {
            newErrors.longitude = "Longitude is required";
        } else if (isNaN(editFormData.longitude)) {
            newErrors.longitude = "Invalid longitude format";
        } else if (Number(editFormData.longitude) < -180 || Number(editFormData.longitude) > 180) {
            newErrors.longitude = "Longitude must be between -180 and 180";
        }

        if (!editFormData.country.trim()) {
            newErrors.country = "Origin Country is required";
        } else {
            const isValidCountry = countries.some(
                (c) => c.toLowerCase() === editFormData.country.trim().toLowerCase()
            );
            if (!isValidCountry) newErrors.country = "This is not a valid country.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsUpdating(true);
        try {
            const payload = {
                ...editFormData,
                latitude: editFormData.latitude ? Number(editFormData.latitude) : null,
                longitude: editFormData.longitude ? Number(editFormData.longitude) : null,
            };
            const response = await warehouseControllers.updateWarehouse(id, payload);
            toast.dismiss();
            toast.success("Warehouse updated successfully");
            setWarehouse(prev => ({ ...prev, ...response.data.data }));
            setIsEditModalOpen(false);
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Failed to update warehouse");
        } finally {
            setIsUpdating(false);
        }
    };

    const formatStatus = (str) => {
        if (!str) return "N/A";
        return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const getStatusBadge = (status) => {
        if (!status) return null;
        const badges = {
            APPROVED: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
            PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
            REJECTED: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
            READY_FOR_AUCTION: { bg: "bg-blue-100", text: "text-blue-800", icon: Play },
            IN_BUILD: { bg: "bg-orange-100", text: "text-orange-800", icon: Package },
            DRAFT: { bg: "bg-gray-100", text: "text-gray-800", icon: FileText },
        };
        const upperStatus = status.toUpperCase();
        const config = badges[upperStatus] || { bg: "bg-gray-100", text: "text-gray-800", icon: Info };
        const Icon = config.icon;
        return (
            <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit`}>
                <Icon size={14} />
                {formatStatus(status)}
            </span>
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchWarehouseDetails = async () => {
            setLoading(true);
            try {
                const res = await warehouseControllers.getWarehouseDetails(id, currentPage, rowsPerPage, debouncedSearch);
                if (res.data?.data) {
                    setWarehouse(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching warehouse details:", err);
                toast.dismiss();
                toast.error("Failed to fetch warehouse details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWarehouseDetails();
        }
    }, [id, currentPage, rowsPerPage, debouncedSearch]);

    if (loading && !warehouse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!warehouse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Warehouse Not Found</h2>
                <button
                    onClick={() => navigate("/warehouse-management")}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Back to Warehouses
                </button>
            </div>
        );
    }

    // Filter and Pagination Logic
    const productsData = warehouse?.products || {};
    const currentProducts = Array.isArray(productsData) ? productsData : (productsData.docs || []);
    const totalPages = productsData.totalPages || 1;
    const totalProducts = productsData.totalDocs || currentProducts.length;
    const indexOfFirstItem = (currentPage - 1) * rowsPerPage;
    const indexOfLastItem = Math.min(currentPage * rowsPerPage, totalProducts);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 px-4 md:px-0">
                    <button
                        onClick={() => navigate("/warehouse-management")}
                        className="flex items-center text-gray-600 hover:text-orange-600 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Warehouse Management
                    </button>
                </div>
                {/* Header */}
                <div className="bg-white rounded-2xl p-5 mb-8 shadow-lg">

                    <div className="flex justify-between items-start">
                        <div className="w-full">
                            <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent break-all">
                                {warehouse.warehouse_name || warehouse.name || 'Warehouse Details'}
                            </h1>
                            <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                                <NavLink to="/dashboard" className="hover:text-orange-800 transition-colors">Dashboard</NavLink>
                                <span>•</span>
                                <NavLink to="/warehouse-management" className="hover:text-orange-800 transition-colors">Warehouse Management</NavLink>
                                <span>•</span>
                                <span className="font-semibold">Details</span>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Warehouse Info - Full Width Horizontal */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/30">
                                    <Warehouse className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Information</h2>
                            </div>
                            <button
                                onClick={handleEditClick}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                            >
                                <Pencil className="w-4 h-4" /> Edit Details
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Origin Country */}
                            <div className="group">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Origin Country</label>
                                <div className="flex items-start gap-4 bg-gray-100/80 px-4 pt-4 pb-2 rounded-2xl group-hover:bg-orange-50/50 transition-colors duration-300 border border-transparent group-hover:border-orange-100 h-full">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                        <Globe className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-800 pt-1">{warehouse.origin_country || warehouse.country || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="group md:col-span-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Location</label>
                                <div className="flex items-start gap-4 bg-gray-100/80 px-4 pt-4 pb-2 rounded-2xl group-hover:bg-orange-50/50 transition-colors duration-300 border border-transparent group-hover:border-orange-100 h-full">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                                        <MapPin className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="text-base font-medium text-gray-700 leading-relaxed break-all pt-1">
                                        {(() => {
                                            const addr = warehouse.address || warehouse.location;
                                            if (!addr) return 'N/A';
                                            if (typeof addr === 'string') return addr;
                                            return [addr.houseNo, addr.street, addr.city, addr.state, addr.country, addr.postalCode].filter(Boolean).join(', ');
                                        })()}
                                    </p>
                                </div>
                            </div>

                            {/* Coordinates */}
                            <div className="group md:col-span-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Coordinates</label>
                                <div className="flex items-start gap-4 bg-gray-100/80 px-4 pt-4 pb-2 rounded-2xl group-hover:bg-orange-50/50 transition-colors duration-300 border border-transparent group-hover:border-orange-100 h-full">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                                        <Navigation className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div className="flex flex-col gap-1.5 pt-1">
                                        <p className="text-sm font-medium text-gray-700 leading-none">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider mr-2 font-bold">Lat</span>
                                            {warehouse.latitude || 'N/A'}
                                        </p>
                                        <p className="text-sm font-medium text-gray-700 leading-none">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider mr-2 font-bold">Lng</span>
                                            {warehouse.longitude || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Table with Search & Pagination */}
                    <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Inventory List
                            </h2>

                            <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 justify-end w-full sm:w-auto">
                                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-orange-50 text-orange-600 border border-orange-200 shadow-sm whitespace-nowrap">
                                    Total Products: {totalProducts}
                                </span>
                                <div className="w-full sm:max-w-md relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search by Product Name"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1); // Reset to first page on search
                                        }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {loading && warehouse ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            </div>
                        ) : currentProducts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Build Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentProducts.map((product, index) => (
                                            product ? (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 capitalize" title={product.product_name}>
                                                            {product.product_name || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.quantity || 0}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(product.admin_approval_status || product.status || product.product_status || 'UNKNOWN')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(product.build_status || 'UNKNOWN')}
                                                    </td>
                                                </tr>
                                            ) : null
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">
                                    {searchTerm ? "No products found" : "No products found in this warehouse"}
                                </p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalProducts > 0 && (
                            <div className="grid grid-cols-3 items-center p-6 border-t border-gray-200 bg-white">
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
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="text-base text-gray-600 font-medium justify-self-center">
                                    {indexOfFirstItem + 1}–{indexOfLastItem} of {totalProducts}
                                </div>

                                <div className="flex items-center gap-4 justify-self-end">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage === 1
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                                            }`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage === totalPages
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                                            }`}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity duration-300">
                        <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900">Edit Warehouse Details</h3>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => {
                                                setEditFormData({ ...editFormData, name: e.target.value });
                                                if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                                            }}
                                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                                }`}
                                        />
                                        {errors.name && <p className="text-red-400 text-xs mt-1 font-medium">{errors.name}</p>}
                                    </div>
                                    <div ref={dropdownRef} className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Origin Country <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={countrySearch}
                                            onChange={(e) => {
                                                setCountrySearch(e.target.value);
                                                setIsCountryDropdownOpen(true);
                                                setEditFormData({ ...editFormData, country: e.target.value });
                                                if (errors.country) setErrors(prev => ({ ...prev, country: "" }));
                                            }}
                                            onClick={() => {
                                                setIsCountryDropdownOpen(true);
                                                setCountrySearch("");
                                                setEditFormData({ ...editFormData, country: "" });
                                            }}
                                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${errors.country ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                                }`}
                                        />
                                        {errors.country && <p className="text-red-400 text-xs mt-1 font-medium">{errors.country}</p>}
                                        {isCountryDropdownOpen && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {filteredCountries.length > 0 ? (
                                                    filteredCountries.map((country) => (
                                                        <div
                                                            key={country}
                                                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
                                                            onClick={() => {
                                                                setEditFormData({ ...editFormData, country });
                                                                setCountrySearch(country);
                                                                setIsCountryDropdownOpen(false);
                                                            }}
                                                        >
                                                            {country}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-gray-500 text-sm">
                                                        No countries found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="relative">
                                            <select
                                                value={editFormData.status}
                                                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm bg-white appearance-none"
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="INACTIVE">Inactive</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={editFormData.location}
                                            onChange={(e) => {
                                                setEditFormData({ ...editFormData, location: e.target.value });
                                                if (errors.location) setErrors(prev => ({ ...prev, location: "" }));
                                            }}
                                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${errors.location ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                                }`}
                                        />
                                        {errors.location && <p className="text-red-400 text-xs mt-1 font-medium">{errors.location}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={editFormData.latitude}
                                            onChange={(e) => {
                                                setEditFormData({ ...editFormData, latitude: e.target.value });
                                                if (errors.latitude) setErrors(prev => ({ ...prev, latitude: "" }));
                                            }}
                                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${errors.latitude ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                                }`}
                                        />
                                        {errors.latitude && <p className="text-red-400 text-xs mt-1 font-medium">{errors.latitude}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={editFormData.longitude}
                                            onChange={(e) => {
                                                setEditFormData({ ...editFormData, longitude: e.target.value });
                                                if (errors.longitude) setErrors(prev => ({ ...prev, longitude: "" }));
                                            }}
                                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm ${errors.longitude ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                                }`}
                                        />
                                        {errors.longitude && <p className="text-red-400 text-xs mt-1 font-medium">{errors.longitude}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end border-t border-gray-100">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateWarehouse}
                                    disabled={isUpdating || !hasChanges}
                                    className={`px-5 py-2 text-sm font-medium text-white rounded-xl transition-colors shadow-sm ${isUpdating || !hasChanges
                                        ? "bg-orange-400 cursor-not-allowed opacity-70"
                                        : "bg-orange-600 hover:bg-orange-700"
                                        }`}
                                >
                                    {isUpdating ? "Updating..." : "Update Warehouse"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer />
            </div >
        </div >
    );
}
