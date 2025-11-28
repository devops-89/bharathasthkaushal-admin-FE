import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productControllers } from "../../api/product";
import { categoryControllers } from "../../api/category";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    categoryId: "",
    subCategoryId: "",
    productPricePerPiece: "",
    quantity: "",
    material: "",
    weightValue: "",
    weightUnit: "gm",
    length: "",
    breadth: "",
    height: "",
    dimensionUnit: "cm",
    description: "",
    timeToMake: "",
    texture: "",
    finish: "",
    washCare: "",
    artUsed: "",
    pattern: "",
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_name.trim()) newErrors.product_name = "Product Name is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (!formData.subCategoryId) newErrors.subCategoryId = "SubCategory is required";
    if (!formData.productPricePerPiece) newErrors.productPricePerPiece = "Price is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.material.trim()) newErrors.material = "Material is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "At least one product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      const errorMessage = "only jpeg ,jpg and png format are allowed";
      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, images: errorMessage }));
      e.target.value = null; // Reset input
      setImages([]);
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.images;
      return newErrors;
    });
    setImages(files);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

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
      data.append("material", formData.material);
      data.append("description", formData.description);
      data.append("timeToMake", formData.timeToMake);
      data.append("texture", formData.texture);
      data.append("finish", formData.finish);
      data.append("washCare", formData.washCare);
      data.append("artUsed", formData.artUsed);
      data.append("pattern", formData.pattern);
      data.append("dimension", dimension);
      data.append("netWeight", netWeight);

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
      toast.success("Product added successfully!");
      console.log("Product Response:", res.data);
      navigate("/product-management", { state: { refresh: true } });
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Something went wrong!");
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.product_name ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter product name"
              />
              {errors.product_name && (
                <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>
              )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.categoryId ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.subCategoryId ? "border-red-500" : "border-gray-300"
                  }`}
                disabled={!subCategories.length}
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((sub) => (
                  <option key={sub.category_id} value={sub.category_id}>
                    {sub.category_name}
                  </option>
                ))}
              </select>
              {errors.subCategoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.subCategoryId}</p>
              )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.productPricePerPiece ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="0.00"
              />
              {errors.productPricePerPiece && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productPricePerPiece}
                </p>
              )}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
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
                Material *
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.material ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Cotton, Silk, etc."
              />
              {errors.material && (
                <p className="text-red-500 text-sm mt-1">{errors.material}</p>
              )}
            </div>

            {/* Finish/Texture */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Finish / Texture
              </label>
              <select
                name="finish"
                value={formData.finish}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Finish</option>
                <option value="Matte">Matte</option>
                <option value="Glossy">Glossy</option>
                <option value="Handwoven">Handwoven</option>
                <option value="Rough">Rough</option>
                <option value="Smooth">Smooth</option>
              </select>
            </div>

            {/* Wash Care */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Wash Care
              </label>
              <select
                name="washCare"
                value={formData.washCare}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Wash Care</option>
                <option value="Dry Clean Only">Dry Clean Only</option>
                <option value="Hand Wash">Hand Wash</option>
                <option value="Machine Wash">Machine Wash</option>
                <option value="Do Not Wash">Do Not Wash</option>
              </select>
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

            {/* Pattern Used */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pattern Used
              </label>
              <input
                type="text"
                name="pattern"
                value={formData.pattern}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Floral, Geometric, Striped, etc."
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
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Describe your product..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
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
                className={`w-full ${errors.images ? "text-red-500" : ""}`}
              />
              {errors.images ? (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              ) : (
                <p className="text-gray-500 text-sm mt-1">Only JPEG, JPG, and PNG formats are allowed.</p>
              )}
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
