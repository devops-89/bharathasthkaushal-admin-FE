import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom"; // Add this import

const AddProduct = () => {
  const navigate = useNavigate(); // Add this hook

  const handleGoBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20  flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack} // Uncommented and added proper function
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
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                //   value={formData.name}
                //   onChange={handleInputChange}
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
                  name="category"
                //   value={formData.category}
                //   onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="Handloom">Handloom</option>

                  <option value="Handcraft">Handcraft</option>
                  <option value="Traditional Fabric">Traditional Fabric</option>
                  <option value="Wooden Craft">Wooden Craft</option>
                  <option value="Clay Product">Clay Product</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                //   value={formData.price}
                //   onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                //   value={formData.stock}
                //   onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              {/* Artisan Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Artisan Name
                </label>
                <input
                  type="text"
                  name="artisan"
                //   value={formData.artisan}
                //   onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Artisan name"
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
                //   value={formData.material}
                //   onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Cotton, Silk, Wood, etc."
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                //   value={formData.description}
                //   onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe your product..."
                />
              </div>

              {/* Featured */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    // checked={formData.featured}
                    // onChange={handleInputChange}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Mark as Featured Product
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handleGoBack} // Added onClick handler for Cancel button too
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                // onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                {/* <Save className="w-4 h-4" /> */}
                Save Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;