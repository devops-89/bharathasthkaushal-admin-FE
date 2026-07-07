import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { paymentControllers } from "../api/payment";
import { toast, ToastContainer } from "react-toastify";
import SecureImage from "../components/SecureImage";
import {
  Search,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  Phone as PhoneIcon,
  User,
  User as UserIcon,
  Calendar,
  Calendar as CalendarIcon,
  CreditCard,
  CreditCard as CreditCardIcon,
  Package,
  Package as PackageIcon,
  Hash,
  Info,
  ChevronDown,
  Download,
} from "lucide-react";

const formatPaymentType = (type) => {
  if (!type) return "N/A";
  const words = type.toLowerCase().split("_");
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFromDate, setExportFromDate] = useState("");
  const [exportToDate, setExportToDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await paymentControllers.getPayments(
          currentPage,
          limit,
          sortBy,
          "desc",
          debouncedSearch
        );
        if (res.data?.data) {
          setPayments(res.data.data.docs || []);
          setTotalPages(res.data.data.totalPages || 1);
          setTotalDocs(res.data.data.totalDocs || 0);
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to fetch payments";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, limit, sortBy, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = async (id) => {
    setModalLoading(true);
    setShowModal(true);
    try {
      const res = await paymentControllers.getPaymentDetails(id);
      if (res.data?.data) {
        setSelectedPayment(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      toast.error("Failed to fetch payment details");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await paymentControllers.exportPayments(exportFromDate, exportToDate);
      
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payments_Export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success("Payments exported successfully!");
      setShowExportModal(false);
      setExportFromDate("");
      setExportToDate("");
    } catch (err) {
      // console.error("Error exporting payments:", err);
      toast.error("Failed to export payments");
    } finally {
      setIsExporting(false);
    }
  };

  // Variables for pagination display
  const indexOfFirstItem = (currentPage - 1) * limit + 1;
  const indexOfLastItem = Math.min(currentPage * limit, totalDocs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Payment Management
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
                  to="/payment-management"
                  className={({ isActive }) =>
                    isActive ? "text-orange-600 font-semibold" : ""
                  }
                >
                  Payment Management
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Customer Name, Email, Phone Number, Payment ID or Date"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors whitespace-nowrap"
              >
                <Download className="w-5 h-5" /> Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Payments
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Info
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {payment.user?.firstName
                              ? payment.user.firstName.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {/* {payment.user?.name || "Unknown User"} */}
                              {payment.user?.firstName + " " + payment.user?.lastName || payment.user?.firstName || payment.user?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.user?.email || "No Email"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {payment.user?.phoneNo || "No Phone"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          ID:{" "}
                          {payment.receiptNumber ||
                            payment.razorpayPaymentId ||
                            "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Type: {formatPaymentType(payment.paymentType)}
                        </div>
                        {/*{payment.auctions && payment.auctions.length > 0 && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            Auctions:{" "}
                            {payment.auctions
                              .map((a) => a.auction_id)
                              .join(", ")}
                          </div>
                        )}*/}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          ₹{parseFloat(payment.amount).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.paymentDate || payment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(payment.id)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && payments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No payments found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="grid grid-cols-3 items-center p-6 border-t bg-white rounded-b-xl">
            <div className="flex items-center gap-4 text-base font-medium justify-self-start">
              <span className="text-gray-700">Rows per page:</span>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
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

      {/* Payment Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Payment Transaction
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Reference:{" "}
                  {selectedPayment?.receiptNumber || selectedPayment?.id}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8">
              {modalLoading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  <p className="mt-4 text-gray-500 font-medium">
                    Fetching details...
                  </p>
                </div>
              ) : selectedPayment ? (
                <div className="space-y-8">
                  {/* Status & Amount Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${getStatusColor(selectedPayment.status)} bg-opacity-10`}
                      >
                        <CreditCard size={32} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </p>
                        <h4 className="text-3xl font-extrabold text-gray-900">
                          {selectedPayment.currency === "INR"
                            ? "₹"
                            : selectedPayment.currency}
                          {parseFloat(selectedPayment.amount).toLocaleString()}
                        </h4>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getStatusColor(selectedPayment.status)}`}
                      >
                        {selectedPayment.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-2 text-right">
                        Type: {formatPaymentType(selectedPayment.paymentType)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Transaction Details */}
                    <div className="space-y-6">
                      <h5 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-orange-500" />
                        Transaction Information
                      </h5>
                      <div className="grid grid-cols-1 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <DetailItem
                          label="Razorpay Payment ID"
                          value={selectedPayment.razorpayPaymentId}
                        />
                        <DetailItem
                          label="Razorpay Order ID"
                          value={selectedPayment.razorpayOrderId}
                        />
                        <DetailItem
                          label="Receipt Number"
                          value={selectedPayment.receiptNumber}
                        />
                        <DetailItem
                          label="Payment Date"
                          value={formatDate(selectedPayment.paymentDate)}
                        />
                        {selectedPayment.failureReason && (
                          <DetailItem
                            label="Failure Reason"
                            value={selectedPayment.failureReason}
                            isError
                          />
                        )}
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-6">
                      <h5 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-orange-500" />
                        Customer Profile
                      </h5>
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-100">
                            <SecureImage
                              src={selectedPayment.user?.avatar}
                              alt={selectedPayment.user?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h6 className="text-lg font-bold text-gray-900">
                              {selectedPayment.user?.firstName + " " + selectedPayment.user?.lastName || selectedPayment.user?.firstName || selectedPayment.user?.name || "Unknown User"}
                            </h6>
                            <p className="text-sm text-gray-500">
                              ID: #{selectedPayment.user?.id}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <IconDetailItem
                            icon={<Mail size={16} />}
                            label="Email"
                            value={selectedPayment.user?.email}
                          />
                          <IconDetailItem
                            icon={<PhoneIcon size={16} />}
                            label="Phone"
                            value={`${selectedPayment.user?.countryCode} ${selectedPayment.user?.phoneNo}`}
                          />
                          <IconDetailItem
                            icon={<CreditCardIcon size={16} />}
                            label="Aadhaar"
                            value={selectedPayment.user?.aadhaarNumber}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Associated Auctions/Products */}
                  {selectedPayment.auctions &&
                    selectedPayment.auctions.length > 0 && (
                      <div className="space-y-6">
                        <h5 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <PackageIcon className="w-5 h-5 text-orange-500" />
                          Associated Products
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedPayment.auctions.map((auction, idx) => (
                            <div
                              key={idx}
                              className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                <SecureImage
                                  src={auction.product?.images?.[0]?.imageUrl}
                                  alt={auction.product?.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="text-sm font-bold text-gray-900 truncate">
                                  {auction.product?.product_name || "N/A"}
                                </h6>
                                <p className="text-xs text-gray-500 mt-1">
                                  BHK ID: {auction.product?.bhkProductId}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm font-bold text-orange-600">
                                    ₹
                                    {parseFloat(
                                      auction.leading_amount,
                                    ).toLocaleString()}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase font-medium">
                                    Qty: {auction.product?.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Info className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">
                    No detailed records found for this transaction.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-bold transition-all shadow-sm active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setShowExportModal(false)}
          ></div>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100">
                    <Download className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Export Payments
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Select date range (optional)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={exportFromDate}
                    onChange={(e) => setExportFromDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={exportToDate}
                    onChange={(e) => setExportToDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl mt-auto">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-bold transition-all shadow-sm active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

// Helper components for Modal
const DetailItem = ({ label, value, isError = false }) => (
  <div className="flex flex-col">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <p
      className={`text-sm font-semibold mt-0.5 break-all ${isError ? "text-red-600" : "text-gray-900"}`}
    >
      {value || "Not available"}
    </p>
  </div>
);

const IconDetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-orange-500">{icon}</div>
    <div className="flex flex-col">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">
        {label}
      </label>
      <p className="text-sm font-semibold text-gray-900">{value || "N/A"}</p>
    </div>
  </div>
);

export default PaymentManagement;
