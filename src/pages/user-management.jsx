import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DisableModal from "../components/DisableModal";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Eye } from "lucide-react";
import { userControllers } from "../api/user";
function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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
        `Profile ${
          newStatus === "BLOCKED" ? "Blocked" : "Activated"
        } Successfully!`
      );
    } catch (err) {
      toast.error("Something went wrong!");
    }

    setOpenModal(false);
  };
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <ToastContainer />

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            User Management
          </h1>

          <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
            <NavLink to="/Dashboard">Dashboard</NavLink>
            <span>•</span>
            <NavLink to="/user-management" className="font-semibold">
              UserManagement
            </NavLink>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id || user._id} className="border-b">
                  <td className="p-3">{fullName(user)}</td>
                  <td className="p-3">{dash(user?.email)}</td>

                  <td className="p-3">
                    <Switch
                      checked={user?.status === "ACTIVE"}
                      onChange={() => handleToggle(user)}
                      className={`${
                        user?.status === "ACTIVE"
                          ? "bg-orange-600"
                          : "bg-gray-300"
                      } relative inline-flex h-[22px] w-[45px] rounded-full transition`}
                    >
                      <span className="sr-only">Toggle Status</span>
                      <span className="translate-x-1 inline-block h-[18px] w-[18px] bg-white rounded-full transition" />
                    </Switch>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        navigate(`/user-profile/${user.id || user._id}`)
                      }
                      className="text-orange-700 hover:text-orange-500 transition"
                      aria-label="View profile"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination UI */}
          <div className="flex justify-center items-center py-3 space-x-3">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === num + 1
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num + 1}
              </button>
            ))}
          </div>
        </div>

        {openModal && (
          <DisableModal
            onClose={() => setOpenModal(false)}
            onConfirm={confirmDisable}
          />
        )}
      </div>
    </div>
  );
}
export default UserManagement;
