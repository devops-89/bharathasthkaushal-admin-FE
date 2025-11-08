import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Grid, List, X, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryControllers } from "../api/category";
const SubcategoryManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("Loading...");
  const [formData, setFormData] = useState({
    category_name: "",
    category_logo: null,
    parent_id: id,
    description: "",
    type: "Sub-Category",
  });


  const getSubcategories = () => {
    categoryControllers
      .getSubCategory(id)
      .then((res) => {
        console.log("Subcategories API response:", res.data.data.docs);
        if (Array.isArray(res?.data?.data?.docs)) {
          setSubcategories(
            res.data.data.docs.map((sub) => ({
              id: sub.category_id || sub.id,
              name: sub.category_name || sub.name,
              image: sub.category_logo || sub.image,
              status: sub.isActive ? "Active" : "Inactive",
              products: sub.productCount || sub.products || 0,
            }))
          );
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
  }, [id]);
  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);
const indexOfLastItem = currentPage * rowsPerPage;
const indexOfFirstItem = indexOfLastItem - rowsPerPage;
const currentSubcategories = filteredSubcategories.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredSubcategories.length / rowsPerPage);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      category_logo: file,
    }));
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
      alert("Subcategory added successfully!");
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
      alert("Failed to add subcategory");
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
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={() => navigate("/category-management")}
              className="text-orange-500 hover:text-orange-600 font-medium mb-2"
            >
              ← Back to Categories
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryName} Subcategories
            </h1>
            <p className="text-gray-600">Dashboard • Categories • {categoryName}</p>
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
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus size={20} />
              Add Subcategory
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Filter
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
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
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

                {/* Category Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Logo <span className="text-red-500">*</span>
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
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </div>
                    </label>
                    {formData.category_logo && (
                      <div className="mt-2 text-sm text-green-600">
                        Selected: {formData.category_logo.name}
                      </div>
                    )}
                  </div>
                </div>
                {/* Parent ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-100"
                    readOnly
                  />
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
                    placeholder="Enter detailed description of the subcategory"
                    required
                  />
                </div>

                {/* Type (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    readOnly
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
      {filteredSubcategories.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No subcategories found" : "No subcategories available"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? `No subcategories match "${searchTerm}"`
              : `Add subcategories to organize your ${categoryName.toLowerCase()} products`}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus size={16} />
              Add First Subcategory
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSubcategories.map((sub) => (
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
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          sub.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{sub.products} products</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-medium text-gray-700 text-sm border-b">
                <div>Subcategory</div>
                <div>Image</div>
                <div>Status</div>
                <div>Products</div>
              </div>
              {currentSubcategories.map((sub) => (
 
                <div
                  key={sub.id}
                  className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="font-medium text-gray-900">{sub.name}</div>
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-16 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64";
                    }}
                  />
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      sub.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sub.status}
                  </span>
                  <span className="text-gray-700">{sub.products}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {filteredSubcategories.length > 0 && (
  <div className="flex items-center justify-between p-4 border-t mt-6 bg-white rounded-lg shadow-sm">

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
      {Math.min(indexOfLastItem, filteredSubcategories.length)} of {filteredSubcategories.length}
    </div>

    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"}`}
      >
        ‹
      </button>

      <button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded ${currentPage === totalPages ? "text-gray-400" : "hover:bg-gray-100"}`}
      >
        ›
      </button>
    </div>

  </div>
)}

    </div>

  );
};

export default SubcategoryManagement;
