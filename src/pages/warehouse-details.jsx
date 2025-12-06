import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { warehouseControllers } from "../api/warehouse";
import {
    ArrowLeft,
    MapPin,
    Globe,
    Package,
    Calendar,
    Clock
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WarehouseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warehouse, setWarehouse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarehouseDetails = async () => {
            setLoading(true);
            try {
                const res = await warehouseControllers.getWarehouseDetails(id);
                if (res.data?.data) {
                    setWarehouse(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching warehouse details:", err);
                toast.error("Failed to fetch warehouse details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWarehouseDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!warehouse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex flex-col justify-center items-center">
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
                    <button
                        onClick={() => navigate("/warehouse-management")}
                        className="flex items-center text-gray-600 hover:text-orange-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to List
                    </button>

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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Warehouse Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Information</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Origin Country</label>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <Globe className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <p className="text-base font-medium text-gray-900">{warehouse.origin_country || warehouse.country || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                                    <div className="flex items-start gap-3 mt-2">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <MapPin className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <p className="text-base font-medium text-gray-900 flex-1 break-all">
                                            {(() => {
                                                const addr = warehouse.address || warehouse.location;
                                                if (!addr) return 'N/A';
                                                if (typeof addr === 'string') return addr;
                                                return [addr.houseNo, addr.street, addr.city, addr.state, addr.country, addr.postalCode].filter(Boolean).join(', ');
                                            })()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Latitude</label>
                                        <p className="text-sm font-medium text-gray-900 mt-1 bg-gray-50 p-2 rounded-lg">
                                            {warehouse.latitude || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Longitude</label>
                                        <p className="text-sm font-medium text-gray-900 mt-1 bg-gray-50 p-2 rounded-lg">
                                            {warehouse.longitude || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Products & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Products</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {warehouse.products?.length || 0}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-full">
                                        <Package className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                            {/* Add more stats if available in the future */}
                        </div>

                        {/* Products Table */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Products Inventory</h2>
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                    {warehouse.products?.length || 0} Items
                                </span>
                            </div>

                            {Array.isArray(warehouse.products) && warehouse.products.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="py-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider">Product Name</th>
                                                <th className="py-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Quantity</th>
                                                <th className="py-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {warehouse.products.map((product, index) => (
                                                product ? (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        <td className="py-4 px-6 font-medium text-gray-900">
                                                            {product.product_name || 'N/A'}
                                                        </td>
                                                        <td className="py-4 px-6 text-gray-700 text-right font-mono">
                                                            {product.quantity || 0}
                                                        </td>
                                                        <td className="py-4 px-6 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.product_status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                                                                product.product_status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                {product.product_status || 'UNKNOWN'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ) : null
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No products found in this warehouse</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div >
        </div >
    );
}
