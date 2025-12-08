import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DisableModal from "../components/DisableModal";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Eye, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { userControllers } from "../api/user";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let response = await userControllers.getUserListGroup("USER");
      if (response?.data?.data?.docs) {
        setUsers(response.data.data.docs);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    }
  };

  const handleToggle = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const dash = (v) =>
    v === null || v === undefined || (typeof v === "string" && v.trim() === "")
      ? "—"
      : v;

  const fullName = (u) => {
    const f = dash(u?.firstName);
    const l = dash(u?.lastName);
    if (f === "—" && l === "—") return "—";
    if (f === "—") return l;
    if (l === "—") return f;
    return `${u.firstName} ${u.lastName}`;
  };

  const confirmDisable = async () => {
    try {
      const newStatus = selectedUser.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
      await userControllers.updateUserStatus(selectedUser.id, newStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, status: newStatus } : u
        )
      );
      toast.success(
        `User ${newStatus === "BLOCKED" ? "Blocked" : "Activated"} Successfully!`
      );
    } catch (err) {
      toast.error("Something went wrong!");
    }

    setOpenModal(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
      <ToastContainer />

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                User Management
              </h1>

              <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                <NavLink to="/dashboard">dashboard</NavLink>
                <span>•</span>
                <NavLink to="/user-management" className="font-semibold">
                  User Management
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white min-w-[150px]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">User Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">Mobile Number</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-[20%]">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-[20%]">View Details</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id || user._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              fullName(user)
                            )}&background=random`
                          }
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {fullName(user)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.countryCode ? `${user.countryCode} ` : ""}
                    {dash(user?.phoneNo)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Switch
                      checked={user?.status === "ACTIVE"}
                      onChange={() => handleToggle(user)}
                      className={`${user?.status === "ACTIVE"
                        ? "bg-orange-600"
                        : "bg-gray-300"
                        } relative inline-flex h-[22px] w-[45px] rounded-full transition cursor-pointer`}
                    >
                      <span className="sr-only">Toggle Status</span>
                      <span
                        className={`${user?.status === "ACTIVE"
                          ? "translate-x-6"
                          : "translate-x-1"
                          } inline-block h-[18px] w-[18px] transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          navigate(`/user-profile/${user.id || user._id}`)
                        }
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        aria-label="View profile"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid grid-cols-3 items-center p-6 border-t bg-white rounded-b-xl">
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
              {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length}
            </div>

            <div className="flex items-center gap-4 justify-self-end">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                  }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
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

        {openModal && (
          <DisableModal
            onClose={() => setOpenModal(false)}
            onConfirm={confirmDisable}
            title={selectedUser?.status === "ACTIVE" ? "Disable Profile" : "Activate Profile"}
            message={
              selectedUser?.status === "ACTIVE"
                ? "Are you sure you want to disable this user's profile?"
                : "Are you sure you want to activate this user's profile?"
            }
          />
        )}
      </div>
    </div>
  );
}

export default UserManagement;
