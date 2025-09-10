import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Grid, List, X, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import handloomImage from "/src/assets/Handloom.jpg";
import handicraftsImage from "/src/assets/Handicraft.jpg";
import { categoryControllers } from "../api/category";
const CategoryManagement = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category_name: "",
    category_logo: null,
    description: "",
  });

  const [categories] = useState([
    {
      id: 1,
      name: "Handloom",
      image: handloomImage,
      status: "Active",
      products: 25,
      subcategories: [
        {
          id: 1,
          name: "Sarees",
          image: "https://via.placeholder.com/150",
          status: "Active",
          products: 12,
        },
        {
          id: 2,
          name: "Shawls",
          image: "https://via.placeholder.com/150",
          status: "Inactive",
          products: 7,
        },
      ],
    },
    {
      id: 2,
      name: "Handicrafts",
      image: handicraftsImage,
      status: "Active",
      products: 18,
      subcategories: [
        {
          id: 1,
          name: "Wooden Toys",
          image: "https://via.placeholder.com/150",
          status: "Active",
          products: 8,
        },
        {
          id: 2,
          name: "Clay Pots",
          image: "https://via.placeholder.com/150",
          status: "Active",
          products: 10,
        },
      ],
    },
  ]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoriesList = () => {
    categoryControllers
      .getCategory()
      .then((res) => {
        console.log("res", res);
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
      alert("Category added successfully!");
      setFormData({
        category_name: "",
        category_logo: null,
        description: "",
      });
      setShowForm(false);
    } catch (err) {
      alert(" Failed to add category");
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
  }, []);

  return (
    <div className="ml-64 pt-20 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              Category Management
            </h1>
            <p className="text-gray-600">Dashboard • Categories</p>
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
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search categories..."
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

      {/* Add Category Form Modal */}
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
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
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
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-auto max-h-50 object-contain "
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.products} products</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-medium text-gray-700 text-sm border-b">
            <div>Category</div>
            <div>Image</div>
            <div>Status</div>
            <div>Products</div>
          </div>
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="grid grid-cols-4 gap-4 p-4 border-b cursor-pointer hover:bg-gray-50 transition"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div>{cat.name}</div>
              <img
                src={cat.image}
                alt={cat.name}
                className="w-16 h-12 rounded-lg object-cover"
              />
              <span>{cat.status}</span>
              <span>{cat.products}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
