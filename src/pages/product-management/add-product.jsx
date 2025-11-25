import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productControllers } from "../../api/product";
import { categoryControllers } from "../../api/category";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    categoryId: "",
    subCategoryId: "",
    productPricePerPiece: "",
    quantity: "",
    discount: "",
    material: "",
    color: "",
    sizeInput: "",
    weightValue: "",
    weightUnit: "gm",
    length: "",
    breadth: "",
    height: "",
    dimensionUnit: "cm",
    description: "",
    timeToMake: "",
    texture: "",
    artUsed: "",
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

      // Construct composite fields
      const dimension = `${formData.length}x${formData.breadth}x${formData.height} ${formData.dimensionUnit}`;
      const netWeight = `${formData.weightValue} ${formData.weightUnit}`;

      // Append fields
      data.append("product_name", formData.product_name);
      data.append("categoryId", formData.categoryId);
      data.append("subCategoryId", formData.subCategoryId);
      data.append("productPricePerPiece", formData.productPricePerPiece);
      data.append("quantity", formData.quantity);
      data.append("discount", formData.discount);
      data.append("material", formData.material);
      data.append("color", formData.color);
      data.append("description", formData.description);
      data.append("timeToMake", formData.timeToMake);
      data.append("texture", formData.texture);
      data.append("artUsed", formData.artUsed);
      data.append("dimension", dimension);
      data.append("netWeight", netWeight);

      // Send size as array (even if single value)
      data.append("size", formData.sizeInput);

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

  const totalPrice = (parseFloat(formData.productPricePerPiece) || 0) * (parseFloat(formData.quantity) || 0);

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

            {/* Product Price Per Piece */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price Per Piece (₹) *
              </label>
              <input
                type="number"
                name="productPricePerPiece"
                value={formData.productPricePerPiece}
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

            {/* Total Price Display */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Total Price (₹)
              </label>
              <input
                type="text"
                value={totalPrice.toFixed(2)}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
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

            {/* Time to Make */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Time to Make (Days)
              </label>
              <input
                type="text"
                name="timeToMake"
                value={formData.timeToMake}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. 5 days"
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

            {/* Finish/Texture */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Finish / Texture
              </label>
              <input
                type="text"
                name="texture"
                value={formData.texture}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Smooth, Rough, Matte, etc."
              />
            </div>

            {/* Art Used */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Art Used
              </label>
              <input
                type="text"
                name="artUsed"
                value={formData.artUsed}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Madhubani, Warli, etc."
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
                name="sizeInput"
                value={formData.sizeInput}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter size (e.g. XL, 42, etc.)"
              />
            </div>

            {/* Net Weight */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Net Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="weightValue"
                  value={formData.weightValue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Weight"
                />
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="gm">gm</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            {/* Dimension */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Dimensions
              </label>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Length"
                />
                <input
                  type="number"
                  name="breadth"
                  value={formData.breadth}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Breadth"
                />
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Height"
                />
                <select
                  name="dimensionUnit"
                  value={formData.dimensionUnit}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="cm">cm</option>
                  <option value="inches">inches</option>
                </select>
              </div>
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
