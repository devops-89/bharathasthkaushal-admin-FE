import React, { useState } from "react";
import { Plus, Search, Filter, Grid, List, X, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryControllers } from "../api/category";
const SubcategoryManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category_name: "",
    category_logo: null,
    parent_id: "",
    description: "",
    type: "Sub-Category"
  });

  
  const categories = [
    {
      id: 1,
      name: "Handloom",
      image: "/src/assets/Handloom.jpg",
      status: "Active",
      products: 25,
      subcategories: [
        { id: 1, name: "Sarees", image: "https://media.istockphoto.com/id/2072342092/photo/handmade-indian-sari-saree-with-golden-details-woman-wear-on-festival-ceremony-and-weddings.jpg?s=612x612&w=is&k=20&c=tRqhOJPKfE9WQD6RMB2ZSWp6KgkLRZDiidt---w0iWI=", status: "Active", products: 12 },
        { id: 2, name: "Shawls", image: "https://media.istockphoto.com/id/155015608/photo/kullu-shawl-himachal-pradesh-india.jpg?s=612x612&w=is&k=20&c=wOchwbWMBxw2St7CMfTbDu3BRtOYiLq0RSvlwYeiwXg=", status: "Active", products: 7 },
        { id: 3, name: "Dupattas", image: "https://media.istockphoto.com/id/2148418924/photo/hand-with-white-traditional-kashmiri-stitch-embroidery-scarf.jpg?s=1024x1024&w=is&k=20&c=DgPLKDP4thwH3PR4x_T8wFXUsjrTsbtFPT3eAMhUTHk=", status: "Active", products: 6 },
        { id: 4, name: "Fabric", image: "https://media.istockphoto.com/id/1034983274/photo/background-of-decorative-tiles.jpg?s=1024x1024&w=is&k=20&c=KT7qAvxt7KKSj3zDaIPWJlayxaOG93Fq-DBBPm9zKgY=", status: "Inactive", products: 0 },
      ],
    },
    {
      id: 2,
      name: "Handicrafts",
      image: "/src/assets/Handicraft.jpg",
      status: "Active",
      products: 18,
      subcategories: [
        { id: 1, name: "Wooden Toys", image: "https://media.istockphoto.com/id/184659330/photo/child-playing-with-wooden-toy-bus-on-wooden-floor.jpg?s=612x612&w=is&k=20&c=fBgoiE2N0PeaYEjR59qKoDFeug-R-PspANS6-c4EznU=", status: "Active", products: 8 },
        { id: 2, name: "Clay Pots", image: "https://media.istockphoto.com/id/1061226104/photo/pottery-making-stock-image.jpg?s=612x612&w=is&k=20&c=6JfLklKDxemf9rq-lRx7fgk1UwkNDziVhcLxcga3Qb0=", status: "Active", products: 10 },
        { id: 3, name: "Metal Crafts", image: "https://media.istockphoto.com/id/1273447930/photo/jeweler-making-handmade-jewelry-on-vintage-bench-the-art-of-jewelry-jeweler-making-handmade.jpg?s=612x612&w=is&k=20&c=GpMhKmb2SsWokG5mjQrZNq0m3JcCHZg0kDx8YnOnbzA=", status: "Active", products: 5 },
        { id: 4, name: "Bamboo Products", image: "https://media.istockphoto.com/id/1201679843/photo/handmade-bamboo-baskets-for-sale.jpg?s=612x612&w=is&k=20&c=ilHy-L1So4rNbZZvcpjJ6W1lnIKKjldDfUoyz8cBz2Y=", status: "Active", products: 3 },
      ],
    },
  ];
  const category = categories.find(cat => cat.id === parseInt(id));
  if (!category) {
    return (
      <div className="ml-64 pt-20 p-6">
        <h1 className="text-xl font-bold">Category not found</h1>
        <button
          onClick={() => navigate("/CategoryManagement")}
          className="text-orange-500 mt-4 hover:text-orange-600"
        >
          ← Back to Categories
        </button>
      </div>
    );
  }
  const filteredSubcategories = category.subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      category_logo: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category_name.trim()) {
      alert("Category name is required");
      return;
    }
    if (!formData.category_logo) {
      alert("Category logo is required");
      return;
    }
    if (!formData.parent_id) {
      alert("Parent category is required");
      return;
    }
    if (!formData.description.trim()) {
      alert("Description is required");
      return;
    }

    console.log("Form submitted:", formData);
    
    setFormData({
      category_name: "",
      category_logo: null,
      parent_id: "",
      description: "",
      type: "Sub-Category"
    });
    setShowAddForm(false);
  };
  const resetForm = () => {
    setFormData({
      category_name: "",
      category_logo: null,
      parent_id: "",
      description: "",
      type: "Sub-Category"
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
              onClick={() => navigate("/CategoryManagement")}
              className="text-orange-500 hover:text-orange-600 font-medium mb-2"
            >
              ← Back to Categories
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {category.name} Subcategories
            </h1>
            <p className="text-gray-600">
              Dashboard • Categories • {category.name}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700"}`}
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
              <h2 className="text-xl font-semibold text-gray-900">AddNew Subcategory</h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
           >
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
                        </span> or drag and drop
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
                  <select
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select parent category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the main category this subcategory belongs to
                  </p>
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
                  <p className="text-xs text-gray-500 mt-1">
                    This is automatically set to Sub-Category for subcategories
                  </p>
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

      {/* No subcategories message */}
      {filteredSubcategories.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No subcategories found' : 'No subcategories available'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No subcategories match "${searchTerm}"`
              : `Add subcategories to organize your ${category.name.toLowerCase()} products`
            }
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
          {/* Subcategories */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubcategories.map((sub) => (
                <div key={sub.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">
                  <img src={sub.image} alt={sub.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        sub.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
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
              {filteredSubcategories.map((sub) => (
                <div key={sub.id} className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50 transition cursor-pointer">
                  <div className="font-medium text-gray-900">{sub.name}</div>
                  <img src={sub.image} alt={sub.name} className="w-16 h-12 rounded-lg object-cover" />
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    sub.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sub.status}
                  </span>
                  <span className="text-gray-700">{sub.products}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubcategoryManagement;