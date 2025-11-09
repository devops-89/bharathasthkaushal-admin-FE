import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { categoryControllers } from "../../api/category";
const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    categoryId: "",
    subCategoryId: "",
    mrp: "",
    quantity: "",
    discount: "",
    material: "",
    color: "",
    size: [],
    netWeight: "",
    dimension: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await categoryControllers.getCategory();

      console.log("CATEGORY RESPONSE:", res.data.data.docs);
      setCategories(res.data?.data?.docs || []);
    } catch (error) {
      console.log("Category Fetch Error:", error);
    }
  };
  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setFormData((prev) => ({ ...prev, categoryId: selectedCategoryId }));

    try {
      const res = await categoryControllers.getSubCategory(selectedCategoryId);
      console.log("SUBCATEGORY RESPONSE:", res.data.data.docs);

      const filteredSubs = (res.data?.data?.docs || []).filter(
        (item) => item.type === "Sub-Category"
      );

      setSubCategories(filteredSubs);
    } catch (error) {
      console.log("SubCategory Fetch Error:", error);
    }
  };

  // };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (images.length > 0) {
        images.forEach((file) => {
          data.append("images", file);
        });
      }

      console.log("Request Payload:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }
      const res = await productControllers.addProduct(data);
      alert("Product added successfully!");
      console.log("Product Response:", res.data);
      navigate("/product-management", { state: { refresh: true } });
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err);
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Add New Product
              </h1>

              <p className="text-gray-600">
                Enter product details for your handloom/handcraft item
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* SubCategory */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SubCategory *
              </label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={!subCategories.length}
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((sub) => (
                  <option key={sub.category_id} value={sub.category_id}>
                    {sub.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* MRP */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                MRP (₹) *
              </label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Cotton, Silk, etc."
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Red, Blue, etc."
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    size: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Net Weight */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Net Weight
              </label>
              <input
                type="text"
                name="netWeight"
                value={formData.netWeight}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="500g, 1kg"
              />
            </div>

            {/* Dimension */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Dimension
              </label>
              <input
                type="text"
                name="dimension"
                value={formData.dimension}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="10x20 cm"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe your product..."
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Product Images *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
