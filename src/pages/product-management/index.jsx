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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { productControllers } from "../../api/product";
import { toast } from "react-toastify";
export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filteredProducts = products?.docs || [];
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const fetchProducts = async () => {
    productControllers
      .getAllProducts()
      .then((res) => {
        const response = res.data.data;
        setProducts(response);
      })
      .catch((err) => {
        console.log("sdsds", err);
        toast.error("Failed to fetch products");
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
              <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Product Management
              </h1>
              <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? "text-orange-600 font-semibold" : ""
                  }
                >
                  Dashboard
                </NavLink>

                <span>•</span>
                <NavLink
                  to="/product-management"
                  className={({ isActive }) =>
                    isActive ? "text-orange-600 font-semibold" : ""
                  }
                >
                  Product Management
                </NavLink>
              </nav>
            </div>
          </div>
          {/* SearchBar*/}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <Link to={"/product-management/add-product"}>
              <button className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
                <span className="text-xl"> + </span> Add New Product
              </button>
            </Link>
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
              {currentProducts.map((product) => (
                <div
                  key={product.id}

                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative mb-4">
                    {product.images && product.images.length ? (
                      <img
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : null}

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
          {/* Pagination Controls */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t mt-4 bg-white rounded-b-xl">
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
                {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
                {filteredProducts.length}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
                    }`}
                >
                  ‹
                </button>

                <button
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded ${currentPage === totalPages
                      ? "text-gray-400"
                      : "hover:bg-gray-100"
                    }`}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
