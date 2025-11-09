import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { needAssistanceControllers } from "../api/needAssistance";
const NEED_ASSISTANCE_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
  CLOSED: "CLOSED",
};
const NEED_ASSISTANCE_ISSUE_TYPE = {
  LOGIN_ISSUE: "LOGIN_ISSUE",
  PAYMENT_QUERY: "PAYMENT_QUERY",
  TECHNICAL_ERROR: "TECHNICAL_ERROR",
  ACCOUNT_UPDATE: "ACCOUNT_UPDATE",
  OTHER: "OTHER",
};

const NeedAssistanceDashboard = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [issueTypeFilter, setIssueTypeFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const fetchNeedAssistance = async () => {
    setLoading(true);
    try {
      const response = await needAssistanceControllers.getAllNeedAssistance(
        10,
        1,
        statusFilter === "ALL" ? "" : statusFilter
      );
      console.log("API Response:", JSON.stringify(response.data, null, 2));
      let tickets =
        response.data?.data?.docs || response.data?.docs || response.data || [];
      if (!Array.isArray(tickets)) {
        console.error("Expected tickets to be an array, got:", tickets);
        alert("Unexpected data format from API: tickets is not an array");
        tickets = [];
      }
      const mappedData = tickets.map((ticket, index) => {
        const createdByUser = ticket.createdBy;
        const userName =
          createdByUser?.name ||
          `${createdByUser?.firstName || ""} ${
            createdByUser?.lastName || ""
          }`.trim() ||
          (createdByUser?.email
            ? createdByUser.email.split("@")[0]
            : "Unknown User");

        const userEmail = createdByUser?.email
          ? createdByUser.email.split("@")[0]
          : "Unknown User";
        const userId = createdByUser?.id || createdByUser?._id || "N/A";
        return {
          id: ticket._id || ticket.id || `temp-id-${index + 1}`,
          userId: userId,
          userName: userName,
          email: userEmail,
          issueType: ticket.issueType || "OTHER",
          issueDescription:
            ticket.issueDescription || "No description provided",
          status: ticket.status || "PENDING",
          createdAt: ticket.createdAt
            ? new Date(ticket.createdAt).toISOString()
            : new Date().toISOString(),
          updatedAt: ticket.updatedAt
            ? new Date(ticket.updatedAt).toISOString()
            : new Date().toISOString(),
          adminRemarks: ticket.adminRemarks || null,

          rawTicket: ticket,
        };
      });
      console.log("Mapped Data:", mappedData);
      setData(mappedData);
    } catch (error) {
      console.error("Error fetching need assistance:", error);
      alert("Error fetching need assistance data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (ticket) => {
    try {
      const response = await needAssistanceControllers.getNeedAssistanceById(
        ticket.id
      );
      let fullTicket =
        response.data?.data || response.data || ticket.rawTicket || ticket;
      const createdByUser = fullTicket.createdBy;
      const userName =
        createdByUser?.name ||
        `${createdByUser?.firstName || ""} ${
          createdByUser?.lastName || ""
        }`.trim() ||
        (createdByUser?.email
          ? createdByUser.email.split("@")[0]
          : "Unknown User");

      const userEmail = createdByUser?.email || "N/A";
      const userId = createdByUser?.id || createdByUser?._id || "N/A";

      const detailedTicket = {
        ...fullTicket,
        userName: userName,
        email: userEmail,
        userId: userId,
      };

      setSelectedTicket(detailedTicket);
      setNewStatus(detailedTicket.status || "PENDING");
      setAdminRemarks(detailedTicket.adminRemarks || "");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      setSelectedTicket(ticket);
      setNewStatus(ticket.status);
      setAdminRemarks(ticket.adminRemarks || "");
      setShowModal(true);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return;
    setUpdating(true);
    try {
      const updateData = {
        status: newStatus,
        adminRemarks: adminRemarks || `Status updated to ${newStatus}`,
      };
      await needAssistanceControllers.updateNeedAssistanceStatus(
        selectedTicket.id,
        updateData
      );
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedTicket.id
            ? {
                ...item,
                status: newStatus,
                adminRemarks: updateData.adminRemarks,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
      alert("Status updated successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating status: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchNeedAssistance();
  }, [statusFilter]);

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      IN_PROGRESS: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: AlertCircle,
      },
      RESOLVED: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      REJECTED: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
      CLOSED: { bg: "bg-gray-100", text: "text-gray-800", icon: XCircle },
    };
    const config = badges[status] || badges.CLOSED;
    const Icon = config.icon;
    return (
      <span
        className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit`}
      >
        <Icon size={14} />
        {status}
      </span>
    );
  };

  const getIssueTypeLabel = (type) => {
    return type ? type.replace(/_/g, " ") : "Other";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issueDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    const matchesIssueType =
      issueTypeFilter === "ALL" || item.issueType === issueTypeFilter;
    return matchesSearch && matchesStatus && matchesIssueType;
  });
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentTickets = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
    <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Need Assistance
          </h1>
          <nav className="mt-2 text-sm text-orange-600">
            <NavLink
              to="/Dashboard"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : ""
              }
            >
              Dashboard
            </NavLink>
            <span className="mx-1">•</span>
            <NavLink
              to="/need-assistant"
              className={({ isActive }) =>
                isActive ? "text-orange-600 font-semibold" : ""
              }
            >
              Need Assistance
            </NavLink>
          </nav>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                {Object.keys(NEED_ASSISTANCE_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 appearance-none bg-white"
                value={issueTypeFilter}
                onChange={(e) => setIssueTypeFilter(e.target.value)}
              >
                <option value="ALL">All Issue Types</option>
                {Object.keys(NEED_ASSISTANCE_ISSUE_TYPE).map((type) => (
                  <option key={type} value={type}>
                    {getIssueTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4">Loading assistance requests...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Issue Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentTickets.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            {getIssueTypeLabel(item.issueType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="text-orange-600 hover:text-orange-800 transition-colors p-2 rounded-lg hover:bg-orange-50"
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                {filteredData.length > 0 && (
                  <div className="flex items-center justify-between p-4 border-t bg-white rounded-b-lg">
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
                      {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                      {filteredData.length}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 rounded ${
                          currentPage === 1
                            ? "text-gray-400"
                            : "hover:bg-gray-100"
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
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No assistance requests found</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Ticket Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="hover:bg-orange-700 p-1 rounded"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    User Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">
                        {selectedTicket.userName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedTicket.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">User ID</p>
                      <p className="font-medium text-gray-900">
                        {selectedTicket.userId}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Issue Type</p>
                      <p className="font-medium text-orange-600">
                        {getIssueTypeLabel(selectedTicket.issueType)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Issue Description
                  </h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedTicket.issueDescription}
                  </p>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Created At</p>
                    <p className="font-medium">
                      {formatDate(selectedTicket.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="font-medium">
                      {formatDate(selectedTicket.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Current Status */}
                <div>
                  <p className="text-gray-600 text-sm mb-2">Current Status</p>
                  {getStatusBadge(selectedTicket.status)}
                </div>

                {/* Update Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Update Status
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {Object.keys(NEED_ASSISTANCE_STATUS).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Admin Remarks */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Admin Remarks
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 h-32"
                    placeholder="Enter your remarks here..."
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                  />
                </div>

                {/* Previous Remarks */}
                {selectedTicket.adminRemarks && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Previous Admin Remarks
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedTicket.adminRemarks}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="flex-1 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={updating}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedAssistanceDashboard;
