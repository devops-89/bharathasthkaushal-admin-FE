import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Upload,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { categoryControllers } from "../api/category";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category_name: "",
    category_logo: null,
    description: "",
  });

  const currentCategories = categories?.docs || [];
  const totalDocs = categories?.totalDocs || 0;
  const totalPages = categories?.totalPages || 1;

  const indexOfFirstItem = (currentPage - 1) * rowsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * rowsPerPage, totalDocs);

  const fetchCategories = async (page, limit, search = "") => {
    setLoading(true);
    try {
      const fetchLimit = search ? 1000 : limit;
      const fetchPage = search ? 1 : page;

      const res = await categoryControllers.getCategory(fetchPage, fetchLimit);
      let response = res.data.data;

      if (search) {
        const filteredDocs = response.docs.filter((c) =>
          c.category_name?.toLowerCase().includes(search.toLowerCase())
        );

        response = {
          ...response,
          docs: filteredDocs,
          totalDocs: filteredDocs.length,
          totalPages: Math.ceil(filteredDocs.length / limit),
          page: 1,
        };
      }

      setCategories(response);
    } catch (err) {
      console.log("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
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
    fetchCategories(currentPage, rowsPerPage, debouncedSearch);
  }, [currentPage, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleViewDetails = (id) => {
    navigate(`/category-management/sub-category/${id}`);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const validExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!validTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
        toast.error("Invalid file format. Please upload a JPEG, JPG, or PNG image.");
        e.target.value = null;
        return;
      }
      setFormData((prev) => ({
        ...prev,
        category_logo: file,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await categoryControllers.addCategory(formData);
      toast.success("Category added successfully!");
      resetForm();
      fetchCategories(currentPage, rowsPerPage, debouncedSearch);
    } catch (err) {
      toast.error("Failed to add category!");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      category_name: "",
      category_logo: null,
      description: "",
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Category Management
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
                  to="/category-management"
                  className={({ isActive }) =>
                    isActive ? "text-orange-600 font-semibold" : ""
                  }
                >
                  Category Management
                </NavLink>
              </nav>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Category
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : !currentCategories.length ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCategories.map((cat) => (
                <div
                  key={cat.category_id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative mb-4">
                    <img
                      src={cat.category_logo}
                      alt={cat.category_name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1" title={cat.category_name}>
                      {cat.category_name}
                    </h3>
                    <button
                      onClick={() => handleViewDetails(cat.category_id)}
                      className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Show Details
                    </button>
                  </div>
                </div>
              ))}
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
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Add Category</h2>
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
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleFormChange}
                    placeholder="Enter category name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Logo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                    <input
                      type="file"
                      id="category_logo"
                      name="category_logo"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                      className="hidden"
                    />
                    <label htmlFor="category_logo" className="cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-sm text-gray-600">
                        {formData.category_logo
                          ? formData.category_logo.name
                          : "Upload JPG, JPEG, and PNG format"}
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter description"
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
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
                    Add Category
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
