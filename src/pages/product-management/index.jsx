import React, { useState } from "react";
import {
  Search,
  Package,
  Users,
  Star,
  TrendingUp,
  Filter,
  ArrowLeft,
  Upload,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Name");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "Handloom",
    price: "",
    description: "",
    stock: "",
    artisan: "",
    material: "",
    featured: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      ...formData,
      dateAdded: new Date().toLocaleDateString(),
    };
    setProducts((prev) => [...prev, newProduct]);
    setFormData({
      name: "",
      category: "Handloom",
      price: "",
      description: "",
      stock: "",
      artisan: "",
      material: "",
      featured: false,
    });
    setShowAddProduct(false);
    alert("Product added successfully!");
  };

  const getStats = () => {
    const total = products.length;
    const handloom = products.filter((p) => p.category === "Handloom").length;
    const handcraft = products.filter((p) => p.category === "Handcraft").length;
    const featured = products.filter((p) => p.featured).length;
    const lowStock = products.filter((p) => parseInt(p.stock) < 10).length;
    return { total, handloom, handcraft, featured, lowStock };
  };

  const stats = getStats();

  //   if (showAddProduct) {
  //     return (
  //       <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
  //         <div className="max-w-4xl mx-auto">
  //           {/* Header */}
  //           <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
  //             <div className="flex items-center gap-4">
  //               <button
  //                 onClick={() => setShowAddProduct(false)}
  //                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  //               >
  //                 <ArrowLeft className="w-6 h-6 text-gray-600" />
  //               </button>
  //               <div>
  //                 <h1 className="text-3xl font-bold text-gray-800">
  //                   Add New Product
  //                 </h1>
  //                 <p className="text-gray-600">
  //                   Enter product details for your handloom/handcraft item
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //           {/* Form */}
  //           <div className="bg-white rounded-2xl p-8 shadow-lg">
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //               {/* Product Name */}
  //               <div className="md:col-span-2">
  //                 <label className="block text-gray-700 font-medium mb-2">
  //                   Product Name *
  //                 </label>
  //                 <input
  //                   type="text"
  //                   name="name"
  //                   value={formData.name}
  //                   onChange={handleInputChange}
  //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  //                   placeholder="Enter product name"
  //                   required
  //                 />
  //               </div>

  //               {/* Category */}
  //               <div>
  //                 <label className="block text-gray-700 font-medium mb-2">
  //                   Category *
  //                 </label>
  //                 <select
  //                   name="category"
  //                   value={formData.category}
  //                   onChange={handleInputChange}
  //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  //                   required
  //                 >
  //                   <option value="Handloom">Handloom</option>

  //                   <option value="Handcraft">Handcraft</option>
  //                   <option value="Traditional Fabric">Traditional Fabric</option>
  //                   <option value="Wooden Craft">Wooden Craft</option>
  //                   <option value="Clay Product">Clay Product</option>
  //                 </select>
  //               </div>

  //               {/* Price */}
  //               <div>
  //                 <label className="block text-gray-700 font-medium mb-2">
  //                   Price (₹) *
  //                 </label>
  //                 <input
  //                   type="number"
  //                   name="price"
  //                   value={formData.price}
  //                   onChange={handleInputChange}
  //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  //                   placeholder="0.00"
  //                   required
  //                 />
  //               </div>

  //               {/* Stock */}
  //               <div>
  //                 <label className="block text-gray-700 font-medium mb-2">
  //                   Stock Quantity *
  //                 </label>
  //                 <input
  //                   type="number"
  //                   name="stock"
  //                   value={formData.stock}
  //                   onChange={handleInputChange}
  //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  //                   placeholder="0"
  //                   required
  //                 />
  //               </div>

  //               {/* Artisan Name */}
  //               <div>
  //                 <label className="block text-gray-700 font-medium mb-2">
  //                   Artisan Name
  //                 </label>
  //                 <input
  //                   type="text"
  //                   name="artisan"
  //                   value={formData.artisan}
  //                   onChange={handleInputChange}
  //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  //                   placeholder="Artisan name"
  //                 />
  //               </div>

  //               {/* Material */}
  //               <div>
  //                 <label className="block text-gray-700 font-medium mb-2">
  //                   Material
  //                 </label>
  //                 <input
  //                   type="text"
  //                   name="material"
  //                   value={formData.material}
  //                   onChange={handleInputChange}
  //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  //                   placeholder="Cotton, Silk, Wood, etc."
  //                 />
  //               </div>

  //               {/* Description */}
  //               <div className="md:col-span-2">
  //                 <label className="block text-gray-700 font-medium mb-2">
  //                   Description
  //                 </label>
  //                 <textarea
  //                   name="description"
  //                   value={formData.description}
  //                   onChange={handleInputChange}
  //                   rows="4"
  //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  //                   placeholder="Describe your product..."
  //                 />
  //               </div>

  //               {/* Featured */}
  //               <div className="md:col-span-2">
  //                 <label className="flex items-center gap-2">
  //                   <input
  //                     type="checkbox"
  //                     name="featured"
  //                     checked={formData.featured}
  //                     onChange={handleInputChange}
  //                     className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
  //                   />
  //                   <span className="text-gray-700 font-medium">
  //                     Mark as Featured Product
  //                   </span>
  //                 </label>
  //               </div>
  //             </div>

  //             {/* Submit Buttons */}
  //             <div className="flex gap-4 mt-8 pt-6 border-t">
  //               <button
  //                 type="button"
  //                 onClick={() => setShowAddProduct(false)}
  //                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
  //               >
  //                 Cancel
  //               </button>
  //               <button
  //                 type="button"
  //                 onClick={handleSubmit}
  //                 className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
  //               >
  //                 <Save className="w-4 h-4" />
  //                 Save Product
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20  flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your handloom and handcraft products
              </p>
            </div>
            <Link to={"/product-management/add-product"}>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors">
                <span className="text-xl">+</span> Add New Product
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Products</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Handloom</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.handloom}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Handcraft</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.handcraft}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Featured</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.featured}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.lowStock}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, artisans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option>All Categories</option>
                <option>Handloom</option>
                <option>Handcraft</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option>Name</option>
                <option>Price</option>
                <option>Date</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategory("All Categories");
                  setSortBy("Name");
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Filter className="w-4 h-4" /> Clear Filters
              </button>
            </div>
          </div>

          {/* Products List or Empty State */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-xl p-6 border"
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Category: {product.category}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Price: ₹{product.price}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Stock: {product.stock}
                  </p>
                  {product.artisan && (
                    <p className="text-sm text-gray-600 mb-1">
                      Artisan: {product.artisan}
                    </p>
                  )}
                  {product.featured && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-2">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
