import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
function UserProfile() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
          User Profile
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
            to="/user-management"
            className={({ isActive }) =>
              isActive ? "text-orange-600 font-semibold" : ""
            }
          >
            UserManagement
          </NavLink>
        </nav>
      </div>
      <div className="bg-white shadow p-5 rounded-lg border">
        <p className="mb-2">
          <b>User ID:</b> {id}
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
