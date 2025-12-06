import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Grid, List, X, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryControllers } from "../api/category";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubcategoryManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("Loading...");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    category_name: "",
    category_logo: null,
    parent_id: id,
    description: "",
    type: "Sub-Category",
  });

  // Server-side pagination: subcategories contains only current page items
  const currentSubcategories = subcategories;
  const indexOfFirstItem = (currentPage - 1) * rowsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * rowsPerPage, totalDocs);

  const getSubcategories = () => {
    categoryControllers
      .getSubCategory(id, currentPage, rowsPerPage)
      .then((res) => {
        console.log("Subcategories API response:", res.data.data);
        const data = res.data.data;
        if (data && Array.isArray(data.docs)) {
          setSubcategories(
            data.docs.map((sub) => ({
              id: sub.category_id || sub.id,
              name: sub.category_name || sub.name,
              image: sub.category_logo || sub.image,
              status: sub.isActive ? "Active" : "Inactive",
              products: sub.productCount || sub.products || 0,
              description: sub.description || "No description available",
            }))
          );
          setTotalDocs(data.totalDocs || 0);
          setTotalPages(data.totalPages || 1);
        } else {
          setSubcategories([]);
          console.log("No subcategories data found in response");
        }
      })
      .catch((err) => {
        console.log("Error fetching subcategories:", err);
        setSubcategories([]);
      });
  };
  const getCategoryName = () => {
    categoryControllers
      .getCategory()
      .then((res) => {
        if (Array.isArray(res?.data?.data?.docs)) {
          const foundCategory = res.data.data.docs.find(
            (cat) => cat.category_id === parseInt(id)
          );
          setCategoryName(foundCategory?.category_name || "Unknown Category");
        }
      })
      .catch((err) => {
        console.log("Error fetching category name:", err);
        setCategoryName("Unknown Category");
      });
  };
  useEffect(() => {
    getSubcategories();
    getCategoryName();
  }, [id, currentPage, rowsPerPage]);

  // Note: Client-side search will only search within the current page. 
  // For full search, backend search API is needed.
  const filteredSubcategories = currentSubcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("category_name", formData.category_name);
    formDataToSend.append("category_logo", formData.category_logo);
    formDataToSend.append("parent_id", formData.parent_id);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type", formData.type);
    console.log("FormData being sent:", Object.fromEntries(formDataToSend));
    try {
      const response = await categoryControllers.addCategory(formDataToSend);
      console.log("API Response:", response.data);
      toast.success("Subcategory added successfully!");
      setFormData({
        category_name: "",
        category_logo: null,
        parent_id: id,
        description: "",
        type: "Sub-Category",
      });
      setShowAddForm(false);
      getSubcategories();
    } catch (err) {
      console.error("API Error:", err.response ? err.response.data : err.message);
      toast.error("Failed to add subcategory");
    }
  };

  const resetForm = () => {
    setFormData({
      category_name: "",
      category_logo: null,
      parent_id: id,
      description: "",
      type: "Sub-Category",
    });
    setShowAddForm(false);
  };

  return (
    <div className="ml-64 pt-20 p-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              {categoryName} Subcategories
            </h1>
            <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:font-semibold transition-colors"
              >
                Dashboard
              </button>
              <span>•</span>
              <button
                onClick={() => navigate("/category-management")}
                className="hover:font-semibold transition-colors"
              >
                Categories
              </button>
              <span>•</span>
              <span className="font-semibold">{categoryName}</span>
            </nav>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Subcategory
          </button>
        </div>
      </div>

      {/* Add Subcategory Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Subcategory
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Category Name (Parent) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-100"
                    readOnly
                  />
                </div>

                {/* Subcategory Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter subcategory name"
                    required
                  />
                </div>

                {/* Subcategory Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Image <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                    <input
                      type="file"
                      name="category_logo"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                      required
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-orange-600 hover:text-orange-500">
                          Upload JPG, JPEG, and PNG format
                        </span>
                      </div>
                    </label>
                    {formData.category_logo && (
                      <div className="mt-2 text-sm text-green-600">
                        Selected: {formData.category_logo.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter description"
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategories */}
      {filteredSubcategories.length === 0 && !searchTerm ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No subcategories available
          </h3>
          <p className="text-gray-500 mb-4">
            Add subcategories to organize your {categoryName.toLowerCase()} products
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} />
            Add First Subcategory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubcategories.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <img
                src={sub.image}
                alt={sub.name}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/160";
                }}
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{sub.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalDocs > 0 && (
        <div className="grid grid-cols-3 items-center p-6 border-t bg-white rounded-lg shadow-sm mt-6">
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
      <ToastContainer />
    </div>

  );
};

export default SubcategoryManagement;
