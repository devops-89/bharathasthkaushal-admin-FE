import React, { useState, useEffect } from "react";
import { Eye, X, Play } from "lucide-react";
import { productControllers } from "../api/product.js";
import { NavLink } from "react-router-dom";
const AuctionManagement = () => {
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
  const currentAuctions = auctions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(auctions.length / rowsPerPage);

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

  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await productControllers.getAllAuctions({
        page: 1,
        pageSize: 50,
      });

      const response = res.data.data.docs || res.data.data || [];

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
        startDate: auction.start_date?.slice(0, 10) || "Not started",
        endDate: auction.hard_close_at?.slice(0, 10),

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
  const handleAddAuction = async () => {
    if (
      !newAuction.productId ||
      !newAuction.startingBid ||
      !newAuction.reservePrice ||
      !newAuction.minBidAmount ||
      !newAuction.endDate ||
      !newAuction.startDate
    ) {
      console.log("Validation failed - Empty fields:", newAuction);
      alert("Please fill all fields");
      return;
    }
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
      alert(res.data.message || "Auction created successfully");

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
      alert(
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
      const formatDateTime = (date) => {
        if (!date) return "Not available";
        const d = new Date(date);
        return d.toLocaleString("en-IN", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      const mappedDetails = {
        ...details,
        title: details.product?.product_name || "Unknown",
        category:
          details.product?.material === "Cotton" ? "Handloom" : "Handicraft",
        subcategory: "",
        startingBid: parseFloat(details.start_price || 0),
        currentBid: parseFloat(details.leading_amount || 0),
        minBidAmount: parseFloat(details.min_bid_amount || 0),
        reservePrice: parseFloat(details.reserve_price || 0),

        startDate: formatDateTime(details.start_date),
        endDate: formatDateTime(details.hard_close_at),

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
        bids: res.data.data.bids || [],
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
      alert(res.data.message || "Auction started successfully");
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
      alert(
        "Error starting auction: " +
        (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
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
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <span>+</span>
          Add Auction
        </button>
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
                Category
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAuctions.map((auction) => (
              <tr key={auction.auction_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {auction.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {auction.category}
                    </div>
                    <div className="text-sm text-gray-500">
                      {auction.subcategory}
                    </div>
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
                    <div>End: {auction.endDate}</div>
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
                      className="text-green-600 hover:text-green-900 flex items-center justify-center p-2 rounded-lg hover:bg-green-50 transition-colors"
                      title="Start Auction"
                    >
                      <Play size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modals*/}
      {showDetailsModal && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Auction Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Product Image */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Product Image
                  </h3>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {selectedAuction.image ? (
                      <img
                        src={selectedAuction.image}
                        alt={selectedAuction.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop";
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Column - Basic Information & Description */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAuction.title}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAuction.category}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAuction.quantity || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">
                    Auction Description
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedAuction.description ||
                        "No description available for this auction."}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Product Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dimensions
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAuction.dimensions}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Weight
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAuction.weight}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Materials
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedAuction.materials}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {selectedAuction.leadBidder && (
                <div>
                  <label className="block text-sm font-medium text-orange-700">
                    Leading Bidder
                  </label>
                  <p className="mt-1 text-sm text-orange-900">
                    {selectedAuction.leadBidder.name ||
                      selectedAuction.leading_bidder}
                  </p>
                </div>
              )}

              {/* Right Column - Auction & Bids Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">
                    Auction Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-orange-700">
                        Status
                      </label>
                      <span className={getStatusBadge(selectedAuction.status)}>
                        {selectedAuction.status}
                      </span>
                    </div>
                    {selectedAuction.startingBid > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-orange-700">
                          Starting Bid
                        </label>
                        <p className="mt-1 text-lg font-semibold text-orange-900">
                          ₹{selectedAuction.startingBid.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedAuction.currentBid > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-orange-700">
                          Current Bid
                        </label>
                        <p className="mt-1 text-lg font-semibold text-orange-900">
                          ₹{selectedAuction.currentBid.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedAuction.minBidAmount > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-orange-700">
                          Minimum Bid Amount
                        </label>
                        <p className="mt-1 text-sm text-orange-900">
                          ₹{selectedAuction.minBidAmount.toLocaleString()}
                        </p>
                        X{" "}
                      </div>
                    )}
                    {selectedAuction.reservePrice > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-orange-700">
                          Reserve Price
                        </label>
                        <p className="mt-1 text-sm text-orange-900">
                          ₹{selectedAuction.reservePrice.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-orange-700">
                        Challenge Minutes
                      </label>
                      <p className="mt-1 text-sm text-orange-900">
                        {selectedAuction.challenge_minutes} minutes
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700">
                        Auction Period
                      </label>
                      <p className="mt-1 text-sm text-orange-900">
                        {selectedAuction.startDate} to {selectedAuction.endDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 h-96 flex flex-col">
                  <div className="flex justify-between items-center mb-4 shrink-0">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Bids History
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Total Bids: {selectedAuction.bids.length}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                    {selectedAuction.bids.length > 0 ? (
                      <div className="space-y-3">
                        {selectedAuction.bids.map((bid) => (
                          <div
                            key={bid.bid_id}
                            className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {bid.user?.name || `User ID: ${bid.user_id}`}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(bid.createdAt).toLocaleString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-600">
                                ₹{parseFloat(bid.bid_amount).toLocaleString()}
                              </p>
                              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${bid.status === 'LEADING' ? 'bg-green-100 text-green-800' :
                                  bid.status === 'OUTBID' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {bid.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <p>No bids placed yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={fetchWinners}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  View Winners
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showWinnersModal && (
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
      )}

      {/* Add Auction Modal */}
      {showAddForm && (
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

            <div className="space-y-4">
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
                    <option value="">Select Product</option>
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
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                    value={newAuction.startDate}
                    onChange={(e) =>
                      setNewAuction({
                        ...newAuction,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
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
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    min={newAuction.startDate || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                    value={newAuction.endDate}
                    onChange={(e) =>
                      setNewAuction({ ...newAuction, endDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
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
                  className="px-4 py-2 text-gray-700 bwworder border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAuction}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Add Auction"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, auctions.length)} of {auctions.length}
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-2 py-1 rounded ${currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"}`}
          >
            ‹
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-2 py-1 rounded ${currentPage === totalPages ? "text-gray-400" : "hover:bg-gray-100"}`}
          >
            ›
          </button>
        </div>
      </div>

    </div>
  );
};

export default AuctionManagement;
