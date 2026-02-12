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
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { productControllers } from "../../api/product";
import { toast } from "react-toastify";
import axios from "axios";
import SecureImage from "../../components/SecureImage";

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // When using server-side pagination, 'docs' contains only the current page's items
  const currentProducts = products?.docs || [];
  const totalDocs = products?.totalDocs || 0;
  const totalPages = products?.totalPages || 1;

  // Calculate the range for "X-Y of Z"
  const indexOfFirstItem = (currentPage - 1) * rowsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * rowsPerPage, totalDocs);

  const fetchProducts = async (page, limit, search = "") => {
    setLoading(true);
    try {
      // If searching, fetch more items to ensure we can filter client-side if backend search fails
      const fetchLimit = search ? 1000 : limit;
      const fetchPage = search ? 1 : page;

      const res = await productControllers.getAllProducts(
        fetchPage,
        fetchLimit,
        search,
      );
      let response = res.data.data;

      if (search) {
        // Client-side filtering fallback
        const filteredDocs = response.docs.filter((p) =>
          p.product_name?.toLowerCase().includes(search.toLowerCase()),
        );

        response = {
          ...response,
          docs: filteredDocs,
          totalDocs: filteredDocs.length,
          totalPages: Math.ceil(filteredDocs.length / limit),
          page: 1,
        };
      }

      setProducts(response);
    } catch (err) {
      console.log("Error fetching products:", err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts(currentPage, rowsPerPage, debouncedSearch);
  }, [currentPage, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleViewDetails = (id) => {
    navigate(`/product-management/product-details/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-24 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
                <Plus className="w-5 h-5 mr-2" /> Add New Product
              </button>
            </Link>
          </div>
        </div>
        {/* Products List  */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : !currentProducts.length ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <div className="relative mb-4">
                    {product.images && product.images.length > 0 ? (
                      <SecureImage
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                        <div className="text-center">
                          <Package className="w-10 h-10 text-gray-300 mx-auto mb-1" />
                          <span className="text-xs text-gray-400 font-medium">
                            No Image
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 flex flex-col flex-1">
                    <h3
                      className="font-semibold text-lg text-gray-800 line-clamp-1"
                      title={product.product_name}
                    >
                      {product.product_name}
                    </h3>
                    {product.artisan ? (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                            {product.artisan.avatar ? (
                              <SecureImage
                                src={product.artisan.avatar}
                                alt="Artisan"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-medium text-sm text-gray-900 truncate"
                              title={`${product.artisan.firstName || product.artisan.name} ${product.artisan.lastName}`}
                            >
                              {product.artisan.firstName ||
                                product.artisan.name}{" "}
                              {product.artisan.lastName}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              {product.artisan.phoneNo || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden border border-orange-200 flex-shrink-0">
                            <User className="w-4 h-4 text-orange-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              Admin
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Platform Managed
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="w-full mt-auto bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
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
          {totalDocs > 0 && (
            <div className="grid grid-cols-3 items-center p-6 border-t bg-white mt-4 rounded-b-xl">
              <div className="flex items-center gap-4 text-base font-medium justify-self-start">
                <span className="text-gray-700">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="text-base text-gray-600 font-medium justify-self-center">
                {indexOfFirstItem}–{indexOfLastItem} of {totalDocs}
              </div>

              <div className="flex items-center gap-4 justify-self-end">
                <button
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border border-gray-200 transition-colors ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border border-gray-200 transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
