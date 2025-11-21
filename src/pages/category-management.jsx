import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Grid, List, X, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import handloomImage from "/src/assets/Handloom.jpg";
import handicraftsImage from "/src/assets/Handicraft.jpg";
import { categoryControllers } from "../api/category";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CategoryManagement = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const { page: paramPage, pageSize: paramPageSize } = useParams();
  const page = paramPage ? parseInt(paramPage, 10) : 1;
  const pageSize = paramPageSize ? parseInt(paramPageSize, 10) : 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    category_name: "",
    category_logo: null,
    description: "",
  });

  const filteredCategories = categories.filter((cat) =>
    (cat.category_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  
  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const getCategoriesList = () => {
    categoryControllers
      .getCategory(page, pageSize)
      .then((res) => {
        console.log("API response:", res);

        if (Array.isArray(res?.data?.data?.docs)) {
          setCategories(res.data.data.docs);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        console.log("errr", err);
      });
  };

  const handleCategoryClick = (id) => {
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
    setFormData((prev) => ({
      ...prev,
      category_logo: file,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await categoryControllers.addCategory(formData);
      toast.success("Category added successfully!");
      setFormData({
        category_name: "",
        category_logo: null,
        description: "",
      });
      setShowForm(false);
      getCategoriesList();
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

  useEffect(() => {
    getCategoriesList();
  }, [page, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-5xl mx-auto">
        {/* <div className="ml-64 pt-20 p-6"> */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
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
            </div>
            <div className="flex gap-3">
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus size={20} />
                Add Category
              </button>
            </div>
          </div>
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Add Category Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  Add Category
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleFormChange}
                    placeholder="e.g., Fly Shuttle Loom"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Category Logo */}
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
                      <Upload
                        className="mx-auto mb-2 text-gray-400"
                        size={32}
                      />
                      <p className="text-sm text-gray-600">
                        {formData.category_logo
                          ? formData.category_logo.name
                          : "Click to upload image"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="e.g., Handicrafts in ancient India embodied creativity, tradition, and utility. Crafted by skilled artisans, they included pottery, jewelry, woodwork, metalwork, and textiles."
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>
                {/* Form Actions */}
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

        {/* Categories */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategories.map((cat) => (
              <div
                key={cat.category_id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => handleCategoryClick(cat.category_id)}
              >
                <img
                  src={cat.category_logo}
                  alt={cat.category_name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">
                    {cat.category_name}
                  </h3>
                  <p className="text-sm text-gray-600">{cat.description}</p>
                  <p className="text-xs text-gray-400">
                    Status: {cat.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white  rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-medium text-gray-700 text-sm border-b">
              <div>Category</div>
              <div>Image</div>
              <div>Status</div>
              <div>Description</div>{" "}
              {/* Changed from Products since data doesn't have it */}
            </div>
            {currentCategories.map((cat) => (
              <div
                key={cat.category_id}
                className="grid grid-cols-4 gap-4 p-4 border-b cursor-pointer hover:bg-gray-50 transition"
                onClick={() => handleCategoryClick(cat.category_id)}
              >
                <div>{cat.category_name}</div>
                <img
                  src={cat.category_logo}
                  alt={cat.category_name}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <span>{cat.isActive ? "Active" : "Inactive"}</span>
                <span>{cat.description}</span> {/* Changed from products */}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      {filteredCategories.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t mt-6 bg-white rounded-b-xl shadow-sm">
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
            {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
            {filteredCategories.length}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded ${
                currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
              }`}
            >
              ‹
            </button>

            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
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
  );
};

export default CategoryManagement;
