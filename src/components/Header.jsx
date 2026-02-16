import { LogOut, User, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import logo from '../assets/image.png';
import { useNavigate } from "react-router-dom";
import { authControllers } from "../api/auth";
import { toast } from "react-toastify";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState({ name: 'ADMIN', role: 'Administrator' });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || 'ADMIN',
          role: parsedUser.role || 'Administrator'
        });
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authControllers.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/");
      setIsDropdownOpen(false);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/0 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-100 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
              onClick={toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={logo}
                  alt="Logo"
                  className="relative w-10 h-10 object-cover rounded-full border-2 border-white"
                />
              </div>
              <h1 className="text-xs md:text-xl font-bold tracking-tight hidden sm:block">
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Bharathastkaushal
                </span>
              </h1>
            </div>
          </div>

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-4 pl-6 border-l border-gray-100 cursor-pointer group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-all duration-300 ring-2 ring-white">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 transform origin-top-right transition-all">
                <div className="px-4 py-3 border-b border-gray-100 mb-2 md:hidden">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>

                </div>

                <button
                  onClick={handleProfile}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-colors font-medium"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <div className="my-1 px-4">
                  <div className="h-px bg-gray-100"></div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;