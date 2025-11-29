import { LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import logo from '../assets/image.png';
import { useNavigate } from "react-router-dom";
import { authControllers } from "../api/auth";
import { toast } from "react-toastify";

const Header = () => {
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
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo"
            className="w-8 h-8 object-cover rounded-full" />
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
              Bharathastkaushal
            </span>
          </h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div
              className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={handleProfile}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
              >
                <User className="w-4 h-4 mr-3 text-orange-600" />
                Profile
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3 text-orange-600" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;