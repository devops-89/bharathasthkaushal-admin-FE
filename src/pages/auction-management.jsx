import React, { useState, useEffect } from "react";
import {
  Eye,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar,
} from "lucide-react";
import { productControllers } from "../api/product.js";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

const AuctionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [auctions, setAuctions] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newAuction, setNewAuction] = useState({
    productId: "",
    startingBid: "",
    reservePrice: "",
    minBidAmount: "",
    endDate: "",
    startDate: "",
    quantity: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentAuctions = filteredAuctions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAuctions.length / rowsPerPage);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productControllers.getAllProductsReady();
      console.log("Products Response:", res.data.data.docs);
      setProducts(res.data.data?.docs || []);
    } catch (err) {
      console.error(
        "Error fetching products:",
        err.response?.data || err.message
      );
      setError("Failed to fetch products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const [winners, setWinners] = useState([]);
  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const fetchWinners = async () => {
    setLoading(true);
    try {
      const res = await productControllers.getAuctionWinners(1, 20);
      setWinners(res.data.data.docs || []);
      setShowWinnersModal(true);
    } catch (err) {
      console.error("Error fetching winners:", err);
      alert("Failed to fetch winners");
    }
    setLoading(false);
  };

  // Disable body scroll when any modal is open
  useEffect(() => {
    if (showDetailsModal || showAddForm || showWinnersModal || showWinnerModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetailsModal, showAddForm, showWinnersModal, showWinnerModal]);

  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await productControllers.getAllAuctions({
        page: 1,
        pageSize: 50,
      });

      const response = res.data.data.docs || res.data.data || [];
      console.log("Raw Auction Data:", response);

      const mapped = response.map((auction) => ({
        ...auction,
        title: auction.product?.product_name || "Unknown",
        category:
          auction.product?.material === "Cotton" ? "Handloom" : "Handicraft",
        startingBid: auction.start_price || 0,
        currentBid: auction.leading_amount || 0,
        minBidAmount: auction.min_bid_amount || 0,
        reservePrice: auction.reserve_price || 0,
        quantity: auction.quantity || 1,
        startDate: formatDateForDisplay(auction.start_date) || "Not started",
        endDate: formatDateForDisplay(auction.hard_close_at || auction.end_date || auction.hardCloseAt || auction.endDate) || "Not set",

        status: auction.status || "DRAFT",

        image: auction.product?.images?.[0]?.imageUrl || null,
      }));

      setAuctions(mapped);
    } catch (err) {
      setError("Failed to fetch auctions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAuctions();
  }, []);
  const getStatusBadge = (status) => {
    const statusMap = {
      DRAFT: "bg-gray-200 text-gray-700",
      SCHEDULED: "bg-blue-200 text-blue-800",
      LIVE: "bg-green-200 text-green-800",
      CHALLENGE: "bg-yellow-200 text-yellow-800",
      ENDED: "bg-gray-300 text-gray-800",
      SETTLED: "bg-purple-200 text-purple-800",
      WON: "bg-teal-200 text-teal-800",
      ACTIVE: "bg-green-200 text-green-800",
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${statusMap[status] || "bg-gray-200 text-gray-800"
      }`;
  };


  const handleAddAuction = async (e) => {
    e.preventDefault();
    // Manual validation is no longer needed as HTML5 form validation handles required fields
    const auctionData = {
      productId: parseInt(newAuction.productId),
      start_price: parseFloat(newAuction.startingBid),
      reserve_price: parseFloat(newAuction.reservePrice),
      hard_close_at: new Date(newAuction.endDate).toISOString(),
      min_bid_amount: parseFloat(newAuction.minBidAmount),
      start_date: new Date(newAuction.startDate).toISOString(),
      quantity: parseInt(newAuction.quantity),
    };

    console.log("Sending Auction Data:", auctionData);

    setLoading(true);
    setError(null);
    try {
      const res = await productControllers.createAuction(auctionData);
      console.log("Create Auction Response:", res.data);
      toast.success(res.data.message || "Auction created successfully");

      const newAuctionData = {
        ...res.data.data,
        title:
          products.find((p) => p.productId === parseInt(newAuction.productId))
            ?.product_name || "Unknown",
        category:
          products.find((p) => p.productId === parseInt(newAuction.productId))
            ?.material === "Cotton"
            ? "Handloom"
            : "Handicraft",
        subcategory: "",
        startingBid: parseFloat(res.data.data.start_price || 0),
        currentBid: parseFloat(res.data.data.leading_amount || 0),
        minBidAmount: parseFloat(res.data.data.min_bid_amount || 0),
        reservePrice: parseFloat(res.data.data.reserve_price || 0),
        startDate: res.data.data.start_date.slice(0, 10),
        endDate: res.data.data.hard_close_at.slice(0, 10),
        status:
          res.data.data.status === "LIVE"
            ? "Active"
            : res.data.data.status.charAt(0).toUpperCase() +
            res.data.data.status.slice(1).toLowerCase(),
        description:
          products.find((p) => p.productId === parseInt(newAuction.productId))
            ?.description || "No description",
        dimensions:
          products.find((p) => p.productId === parseInt(newAuction.productId))
            ?.dimension || "Not specified",
        weight:
          products.find((p) => p.productId === parseInt(newAuction.productId))
            ?.netWeight || "Not specified",
        materials:
          products.find((p) => p.productId === parseInt(newAuction.productId))
            ?.material || "Not specified",
        image:
          products.find((p) => p.productId === parseInt(newAuction.productId))
            ?.images?.[0] || null,
      };

      setAuctions((prevAuctions) => [newAuctionData, ...prevAuctions]);
      setShowAddForm(false);
      setNewAuction({
        productId: "",
        startingBid: "",
        reservePrice: "",
        minBidAmount: "",
        endDate: "",
        startDate: "",
      });
    } catch (err) {
      console.error(
        "Error creating auction:",
        err.response?.data || err.message
      );
      setError(
        "Error creating auction: " +
        (err.response?.data?.message || err.message || "Unknown error")
      );
      toast.error(
        "Error creating auction: " +
        (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (auction) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productControllers.getAuctionDetails(
        auction.auction_id
      );
      console.log("Auction Details Response:", res.data);
      const details = res.data.data.auction;

      const mappedDetails = {
        ...details,
        title: details.product?.product_name || "Unknown",
        category: details.category?.category_name || details.product?.category?.category_name || (details.product?.material === "Cotton" ? "Handloom" : "Handicraft"),
        subcategory: details.subCategory?.category_name || details.product?.subCategory?.category_name || "N/A",
        startingBid: parseFloat(details.start_price || 0),
        currentBid: parseFloat(details.leading_amount || 0),
        minBidAmount: parseFloat(details.min_bid_amount || 0),
        reservePrice: parseFloat(details.reserve_price || 0),

        startDate: formatDateForDisplay(details.start_date),
        endDate: formatDateForDisplay(details.hard_close_at || details.end_date || details.hardCloseAt || details.endDate),

        quantity: details.quantity || details.product?.quantity || 0,

        status:
          details.status === "LIVE"
            ? "Active"
            : details.status.charAt(0).toUpperCase() +
            details.status.slice(1).toLowerCase(),
        description: details.product?.description || "No description",
        dimensions: details.product?.dimension || "Not specified",
        weight: details.product?.netWeight || "Not specified",
        materials: details.product?.material || "Not specified",
        image: details.product?.images?.[0]?.imageUrl || null,
        bids: res.data.data.bids || res.data.data.auction?.bids || [],
        winner: res.data.data.winner || res.data.data.auction?.winner || null,
        challenge_minutes: details.challenge_minutes || 15,
      };
      setSelectedAuction(mappedDetails);
      setShowDetailsModal(true);
    } catch (err) {
      console.error(
        "Error fetching auction details:",
        err.response?.data || err.message
      );
      setError("Failed to fetch auction details. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleStartAuction = async (auctionId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productControllers.startAuction(auctionId);
      console.log("Start Auction Response:", res.data);
      toast.success(res.data.message || "Auction started successfully");
      fetchAuctions();
    } catch (err) {
      console.error(
        "Error starting auction:",
        err.response?.data || err.message
      );
      setError(
        "Error starting auction: " +
        (err.response?.data?.message || err.message)
      );
      toast.error(
        "Error starting auction: " +
        (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold leading-normal bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                Auction Management
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
                  to="/auction-management"
                  className={({ isActive }) =>
                    isActive ? "text-orange-600 font-semibold" : ""
                  }
                >
                  Auction Management
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Search and Action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Auction
            </button>
          </div>
        </div>

        {/* Error and Loading States */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
            Loading...
          </div>
        )}
        {/* Auctions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bidding Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAuctions.map((auction) => (
                <tr key={auction.auction_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900" title={auction.title}>
                      {auction.title.length > 20 ? `${auction.title.substring(0, 20)}...` : auction.title}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {auction.currentBid > 0 && (
                        <div className="text-sm font-medium text-gray-900">
                          ₹{auction.currentBid.toLocaleString()}
                        </div>
                      )}
                      {auction.startingBid > 0 && (
                        <div className="text-sm text-gray-500">
                          Start: ₹{auction.startingBid.toLocaleString()}
                        </div>
                      )}
                      {auction.minBidAmount > 0 && (
                        <div className="text-sm text-gray-500">
                          Min Bid: ₹{auction.minBidAmount.toLocaleString()}
                        </div>
                      )}
                      {auction.reservePrice > 0 && (
                        <div className="text-sm text-gray-500">
                          Reserve: ₹{auction.reservePrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Start: {auction.startDate}</div>
                      <div>Hard Close: {auction.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(auction.status)}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button
                      onClick={() => handleViewDetails(auction)}
                      className="text-blue-600 hover:text-blue-900 flex items-center justify-center p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {auction.status === "Scheduled" && (
                      <button
                        onClick={() => handleStartAuction(auction.auction_id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-xs font-semibold"
                        title="Start Auction"
                      >
                        <Play size={14} /> Start
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="grid grid-cols-3 items-center p-6 border-t bg-white mt-4 rounded-xl shadow-sm">
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
            {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, auctions.length)} of {auctions.length}
          </div>

          <div className="flex items-center gap-4 justify-self-end">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Details Modal */}
        {showDetailsModal && selectedAuction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Auction Details</h2>
                  <p className="text-sm text-gray-500 mt-1">ID: #{selectedAuction.auction_id}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Product Info (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Image Card */}
                  <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                    <div className="aspect-[4/3] w-full bg-gray-200 relative overflow-hidden">
                      {selectedAuction.image ? (
                        <img
                          src={selectedAuction.image}
                          alt={selectedAuction.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <span className="text-4xl mb-2">🖼️</span>
                          <span className="text-sm font-medium">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm border border-white/20">
                          {selectedAuction.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {selectedAuction.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {selectedAuction.description || "No description provided for this item."}
                      </p>
                    </div>
                  </div>

                  {/* Specifications Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-orange-500"></span> Specifications
                      </h4>
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-2">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Dimensions</p>
                        <p className="text-sm font-medium text-gray-900">{selectedAuction.dimensions}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Weight</p>
                        <p className="text-sm font-medium text-gray-900">{selectedAuction.weight}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Material</p>
                        <p className="text-sm font-medium text-gray-900">{selectedAuction.materials}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Quantity</p>
                        <p className="text-sm font-medium text-gray-900">{selectedAuction.quantity || "1"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Category</p>
                        <p className="text-sm font-medium text-gray-900">{selectedAuction.category}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Subcategory</p>
                        <p className="text-sm font-medium text-gray-900">{selectedAuction.subcategory || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Auction Details (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Status & Timer Banner */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className={`flex-1 p-5 rounded-2xl border flex items-center justify-between ${selectedAuction.status === 'Active' ? 'bg-green-50 border-green-100' :
                      selectedAuction.status === 'Ended' ? 'bg-gray-100 border-gray-200' :
                        'bg-orange-50 border-orange-100'
                      }`}>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${selectedAuction.status === 'Active' ? 'bg-green-500 animate-pulse' :
                            selectedAuction.status === 'Ended' ? 'bg-gray-500' :
                              'bg-orange-500'
                            }`}></span>
                          <span className={`text-xl font-bold ${selectedAuction.status === 'Active' ? 'text-green-700' :
                            selectedAuction.status === 'Ended' ? 'text-gray-700' :
                              'text-orange-700'
                            }`}>{selectedAuction.status}</span>
                        </div>
                      </div>
                      {selectedAuction.status === 'Active' && (
                        <div className="text-right">
                          <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Live Now</p>
                          <p className="text-sm text-green-700 font-medium">Accepting Bids</p>
                        </div>
                      )}
                    </div>


                  </div>

                  {/* Pricing Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3 sm:col-span-1 bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💰</div>
                      <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">Highest Bid</p>
                      <p className="text-2xl font-bold text-white">
                        ₹{(selectedAuction.currentBid || selectedAuction.startingBid || 0).toLocaleString()}
                      </p>
                      {selectedAuction.leadBidder && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">👤</div>
                          <p className="text-xs text-orange-50 truncate max-w-[100px]">
                            {selectedAuction.leadBidder.name || selectedAuction.leading_bidder}
                          </p>
                        </div>
                      )}
                    </div>


                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Start Price</p>
                      <p className="text-xl font-bold text-gray-900">₹{selectedAuction.startingBid.toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Reserve</p>
                      <p className="text-xl font-bold text-gray-900">₹{selectedAuction.reservePrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Timeline */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        Auction Timeline
                      </h4>
                      <div className="relative pl-6 border-l-2 border-gray-100 space-y-8">
                        <div className="relative">
                          <div className="absolute -left-[29px] top-1 h-4 w-4 rounded-full bg-green-100 border-4 border-white shadow-sm flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Start Date</p>
                            <p className="text-sm font-semibold text-gray-900">{selectedAuction.startDate}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[29px] top-1 h-4 w-4 rounded-full bg-red-100 border-4 border-white shadow-sm flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Hard Close</p>
                            <p className="text-sm font-semibold text-gray-900">{selectedAuction.endDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bids History */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[320px]">
                      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                        <h4 className="font-bold text-gray-900">Recent Bids</h4>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                          {selectedAuction.bids.length}
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {selectedAuction.bids.length > 0 ? (
                          selectedAuction.bids.map((bid, idx) => (
                            <div key={bid.bid_id || idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                  {(bid.user?.name || bid.user?.FirstName || "U")[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-900">
                                    {bid.user?.name || bid.user?.FirstName || `User #${bid.user_id}`}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {bid.createdAt || bid.created_at ? new Date(bid.createdAt || bid.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">₹{parseFloat(bid.bid_amount).toLocaleString()}</p>
                                {idx === 0 && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Leading</span>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <span className="text-2xl mb-2 opacity-50">🏷️</span>
                            <p className="text-sm font-medium">No bids yet</p>
                          </div>
                        )}
                      </div>

                      <div className="p-3 border-t border-gray-50 bg-gray-50/30">
                        <button
                          onClick={() => setShowWinnerModal(true)}
                          disabled={!selectedAuction.winner}
                          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${selectedAuction.winner
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            }`}
                        >
                          {selectedAuction.winner ? (
                            <> View Winner Details</>
                          ) : (
                            "Winner Not Declared"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >
        )}
        {
          showWinnerModal && selectedAuction?.winner && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
              <div className="bg-white p-5 rounded-xl w-full max-w-sm shadow-2xl transform transition-all border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Winner Details</h2>
                  <button
                    onClick={() => setShowWinnerModal(false)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Compact Winner Profile */}
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border-2 border-orange-100 shrink-0">
                      🏆
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-gray-900 truncate">
                        {selectedAuction.winner.name || `${selectedAuction.winner.firstName} ${selectedAuction.winner.lastName}`}
                      </h3>
                      <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">Auction Winner</p>
                    </div>
                  </div>

                  {/* Compact Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Winning Bid</p>
                      <p className="text-sm font-bold text-gray-900">
                        ₹{(selectedAuction.currentBid || selectedAuction.winning_bid || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedAuction.winner.createdAt ? new Date(selectedAuction.winner.createdAt).toLocaleDateString("en-IN") : "N/A"}
                      </p>
                    </div>

                    <div className="col-span-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shrink-0">

                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{selectedAuction.winner.email}</p>
                      </div>
                    </div>

                    <div className="col-span-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shrink-0">

                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedAuction.winner.phoneNo || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowWinnerModal(false)}
                    className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )
        }
        {
          showWinnersModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Auction Winners</h2>
                  <button onClick={() => setShowWinnersModal(false)}>
                    <X size={24} />
                  </button>
                </div>

                {winners.length > 0 ? (
                  winners.map((w) => (
                    <div key={w.id} className="border p-3 rounded mb-3">
                      <p>
                        <strong>Product:</strong> {w.product?.product_name}
                      </p>
                      <p>
                        <strong>Winner:</strong> {w.user?.name}
                      </p>
                      <p>
                        <strong>Winning Amount:</strong> ₹{w.amount}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No winners yet.</p>
                )}
              </div>
            </div>
          )
        }

        {/* Add Auction Modal */}
        {
          showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Add New Auction
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddAuction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Product *
                      </label>
                      <select
                        required
                        value={newAuction.productId}
                        onChange={(e) =>
                          setNewAuction({
                            ...newAuction,
                            productId: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="" disabled>Select Product</option>
                        {Array.isArray(products) && products.length > 0 ? (
                          products.map((product) => (
                            <option
                              key={product.productId}
                              value={product.productId}
                            >
                              {product.product_name || "Unnamed Product"}
                            </option>
                          ))
                        ) : (
                          <option disabled>No products available</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date & Time *
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-full">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                          <input
                            type="date"
                            required
                            min={new Date().toLocaleDateString('en-CA')}
                            value={newAuction.startDate ? newAuction.startDate.split("T")[0] : ""}
                            onChange={(e) => {
                              const date = e.target.value;
                              const time = newAuction.startDate && newAuction.startDate.includes("T") ? newAuction.startDate.split("T")[1] : "00:00";
                              setNewAuction({
                                ...newAuction,
                                startDate: `${date}T${time}`,
                              });
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <input
                          type="time"
                          required
                          value={newAuction.startDate && newAuction.startDate.includes("T") ? newAuction.startDate.split("T")[1] : ""}
                          onChange={(e) => {
                            const time = e.target.value;
                            const date = newAuction.startDate ? newAuction.startDate.split("T")[0] : new Date().toLocaleDateString('en-CA');
                            setNewAuction({
                              ...newAuction,
                              startDate: `${date}T${time}`,
                            });
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Starting Bid (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newAuction.startingBid}
                        onChange={(e) =>
                          setNewAuction({
                            ...newAuction,
                            startingBid: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Enter starting bid"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reserve Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newAuction.reservePrice}
                        onChange={(e) =>
                          setNewAuction({
                            ...newAuction,
                            reservePrice: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Enter reserve price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Bid Amount (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newAuction.minBidAmount}
                        onChange={(e) =>
                          setNewAuction({
                            ...newAuction,
                            minBidAmount: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Enter min bid amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hard Close Date & Time *
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-full">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                          <input
                            type="date"
                            required
                            min={newAuction.startDate ? newAuction.startDate.split("T")[0] : new Date().toLocaleDateString('en-CA')}
                            value={newAuction.endDate ? newAuction.endDate.split("T")[0] : ""}
                            onChange={(e) => {
                              const date = e.target.value;
                              const time = newAuction.endDate && newAuction.endDate.includes("T") ? newAuction.endDate.split("T")[1] : "00:00";
                              setNewAuction({
                                ...newAuction,
                                endDate: `${date}T${time}`,
                              });
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <input
                          type="time"
                          required
                          value={newAuction.endDate && newAuction.endDate.includes("T") ? newAuction.endDate.split("T")[1] : ""}
                          onChange={(e) => {
                            const time = e.target.value;
                            const date = newAuction.endDate ? newAuction.endDate.split("T")[0] : (newAuction.startDate ? newAuction.startDate.split("T")[0] : new Date().toLocaleDateString('en-CA'));
                            setNewAuction({
                              ...newAuction,
                              endDate: `${date}T${time}`,
                            });
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        value={newAuction.quantity}
                        onChange={(e) =>
                          setNewAuction({ ...newAuction, quantity: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Add Auction"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
        <ToastContainer />
      </div >
    </div >
  );
};

export default AuctionManagement;
