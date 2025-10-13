import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Eye,
  Tag,
  Ruler,
  Palette,
  ShoppingBag,
  User,
}from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { productControllers } from "../../api/product";
export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const fetchProducts = async () => {
    
    productControllers
      .getAllProducts()
      .then((res) => {
        const response = res.data.data;
        setProducts(response);
      })
      .catch((err) => {
        console.log("sdsds", err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleViewDetails = (id) => {
    navigate(`/product-management/product-details/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-7xl mx-auto">
       {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-gray-600 text- lg">
                Manage your handloom and handcraft products
              </p>
            </div>
            <Link to={"/product-management/add-product"}>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors">
                <span className="text-xl">+</span> Add New Product
              </button>
               </Link>
          </div>
          {/* SearchBar*/}
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        {/* Products List  */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {!products?.docs.length ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.docs.map((product) => (
                <div

                  key={product.id}
                  
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative mb-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : null}
                    <div
                      className={`w-full h-48 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center ${
                        product.images && product.images.length > 0
                          ? "hidden"
                          : "flex"
                      }`}
                    >
                      <Package className="w-16 h-16 text-orange-300" />
                    </div>
                    <div className="absolute top-0 right-0">
                      {product.quantity}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                      {product.product_name} {`(${product.quantity})pcs`}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span>{product.category.category_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-orange-600">
                          ₹
                          {parseInt(product.productPricePerPiece) *
                            product.quantity}
                        </span>
                      </div>
                    </div>
                    {/* <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div> */}
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Show Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
