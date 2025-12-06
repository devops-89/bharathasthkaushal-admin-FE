import React, { useState, useEffect } from "react";
import {
    Search,
    Warehouse,
    Plus,
    ChevronLeft,
    ChevronRight,
    X,
    MapPin,
    Globe,
    Eye,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { warehouseControllers } from "../api/warehouse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { countries } from "../constants/countries";

export default function WarehouseManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [warehouses, setWarehouses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const handleViewDetails = (id) => {
        navigate(`/warehouse-management/details/${id}`);
    };

    const [formData, setFormData] = useState({
        warehouse_name: "",
        origin_country: "",
        longitude: "",
        latitude: "",
        address: "",
    });
    const [countrySearch, setCountrySearch] = useState("");
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

    const filteredCountries = countries.filter((country) =>
        country.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const currentWarehouses = warehouses?.docs || [];
    const totalDocs = warehouses?.totalDocs || 0;
    const totalPages = warehouses?.totalPages || 1;

    const indexOfFirstItem = (currentPage - 1) * rowsPerPage + 1;
    const indexOfLastItem = Math.min(currentPage * rowsPerPage, totalDocs);

    const fetchWarehouses = async (page, limit, search = "") => {
        setLoading(true);
        try {
            const res = await warehouseControllers.getWarehouses(page, limit, search);
            setWarehouses(res.data.data);
        } catch (err) {
            console.log("Error fetching warehouses:", err);
            // toast.error("Failed to fetch warehouses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchWarehouses(currentPage, rowsPerPage, debouncedSearch);
    }, [currentPage, rowsPerPage, debouncedSearch]);

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

    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showForm]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.warehouse_name.trim()) {
            toast.error("Warehouse Name is required");
            return;
        }
        if (!formData.origin_country.trim()) {
            toast.error("Origin Country is required");
            return;
        }

        const isValidCountry = countries.some(
            (country) => country.toLowerCase() === formData.origin_country.trim().toLowerCase()
        );

        if (!isValidCountry) {
            toast.error("This is not a valid country");
            return;
        }

        if (!formData.address.trim()) {
            toast.error("Address is required");
            return;
        }

        try {
            const payload = {
                name: formData.warehouse_name,
                country: formData.origin_country,
                location: formData.address,
                latitude: formData.latitude,
                longitude: formData.longitude
            };
            await warehouseControllers.addWarehouse(payload);
            toast.success("Warehouse added successfully!");
            resetForm();
            fetchWarehouses(currentPage, rowsPerPage, debouncedSearch);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add warehouse!");
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({
            warehouse_name: "",
            origin_country: "",
            longitude: "",
            latitude: "",
            address: "",
        });
        setCountrySearch("");
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                                Warehouse Management
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
                                    to="/warehouse-management"
                                    className={({ isActive }) =>
                                        isActive ? "text-orange-600 font-semibold" : ""
                                    }
                                >
                                    Warehouse Management
                                </NavLink>
                            </nav>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search warehouses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Add Warehouse
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    ) : !currentWarehouses.length ? (
                        <div className="text-center py-16">
                            <Warehouse className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No warehouses found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-4 px-4 font-semibold text-gray-700">
                                            Name
                                        </th>
                                        <th className="py-4 px-4 font-semibold text-gray-700">
                                            Country
                                        </th>
                                        <th className="py-4 px-4 font-semibold text-gray-700">
                                            Address
                                        </th>
                                        <th className="py-4 px-4 font-semibold text-gray-700">
                                            Coordinates
                                        </th>
                                        <th className="py-4 px-4 font-semibold text-gray-700 text-right">
                                            View Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentWarehouses.map((warehouse) => (
                                        <tr
                                            key={warehouse._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-4 px-4 font-medium text-gray-800" title={warehouse.name || warehouse.warehouse_name || 'N/A'}>
                                                {(warehouse.name || warehouse.warehouse_name || 'N/A').length > 25
                                                    ? `${(warehouse.name || warehouse.warehouse_name || 'N/A').substring(0, 25)}...`
                                                    : (warehouse.name || warehouse.warehouse_name || 'N/A')}
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    {warehouse.country || warehouse.origin_country || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">
                                                <div className="flex items-center gap-2" title={(() => {
                                                    const addr = warehouse.location || warehouse.address;
                                                    if (!addr) return 'N/A';
                                                    if (typeof addr === 'string') return addr;
                                                    return [addr.houseNo, addr.street, addr.city, addr.state, addr.country, addr.postalCode].filter(Boolean).join(', ');
                                                })()}>
                                                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    {(() => {
                                                        const addr = warehouse.location || warehouse.address;
                                                        let displayAddr = 'N/A';
                                                        if (addr) {
                                                            if (typeof addr === 'string') {
                                                                displayAddr = addr;
                                                            } else {
                                                                displayAddr = [addr.houseNo, addr.street, addr.city, addr.state, addr.country, addr.postalCode].filter(Boolean).join(', ');
                                                            }
                                                        }
                                                        return displayAddr.length > 30 ? `${displayAddr.substring(0, 30)}...` : displayAddr;
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600 text-sm">
                                                {warehouse.latitude && warehouse.longitude ? (
                                                    <span>
                                                        {warehouse.latitude}, {warehouse.longitude}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">N/A</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => handleViewDetails(warehouse.id)}
                                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

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
                    )}
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Add Warehouse
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Warehouse Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="warehouse_name"
                                        value={formData.warehouse_name}
                                        onChange={handleFormChange}
                                        placeholder="Enter warehouse name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Origin Country *
                                    </label>
                                    <div className="relative" ref={dropdownRef}>
                                        <input
                                            type="text"
                                            placeholder="Select origin country"
                                            value={countrySearch}
                                            onChange={(e) => {
                                                setCountrySearch(e.target.value);
                                                setIsCountryDropdownOpen(true);
                                                if (e.target.value === "") {
                                                    handleFormChange({ target: { name: 'origin_country', value: '' } });
                                                }
                                            }}
                                            onClick={() => {
                                                setIsCountryDropdownOpen(true);
                                                setCountrySearch(""); // Reset search to show all countries
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        {isCountryDropdownOpen && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {filteredCountries.length > 0 ? (
                                                    filteredCountries.map((country) => (
                                                        <div
                                                            key={country}
                                                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
                                                            onClick={() => {
                                                                handleFormChange({ target: { name: 'origin_country', value: country } });
                                                                setCountrySearch(country);
                                                                setIsCountryDropdownOpen(false);
                                                            }}
                                                        >
                                                            {country}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-gray-500 text-sm">No countries found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleFormChange}
                                        placeholder="Enter full address"
                                        required
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            type="text"
                                            name="latitude"
                                            value={formData.latitude}
                                            onChange={handleFormChange}
                                            placeholder="Optional"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            type="text"
                                            name="longitude"
                                            value={formData.longitude}
                                            onChange={handleFormChange}
                                            placeholder="Optional"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Add Warehouse
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <ToastContainer />
            </div>
        </div>
    );
}
