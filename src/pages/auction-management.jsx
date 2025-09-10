import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

const AuctionManagement = () => {
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      title: "Traditional Banarasi Saree",
      artisan: "Rajesh Kumar",
      category: "Handloom",
      subcategory: "Silk Weaving",
      startingBid: 5000,
      currentBid: 7500,
      startDate: "2025-08-15",
      endDate: "2025-08-22",
      status: "Active",
      bidders: 12,
      location: "Varanasi",
      description: "Beautiful traditional Banarasi saree made with pure silk and gold threads. This handwoven masterpiece showcases intricate patterns and traditional motifs.",
      dimensions: "6 meters length",
      weight: "800 grams",
      materials: "Pure Silk, Gold Thread",
      artisanContact: "+91 9876543210",
      artisanExperience: "15 years",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Hand Carved Wooden Elephant",
      artisan: "Amit Singh",
      category: "Handicraft",
      subcategory: "Wood Carving",
      startingBid: 3000,
      currentBid: 4200,
      startDate: "2025-08-14",
      endDate: "2025-08-21",
      status: "Active",
      bidders: 8,
      location: "Jaipur",
      description: "Exquisite hand-carved wooden elephant featuring intricate details and traditional Rajasthani craftsmanship.",
      dimensions: "12 inches height x 10 inches length",
      weight: "2.5 kg",
      materials: "Sheesham Wood",
      artisanContact: "+91 9876543212",
      artisanExperience: "20 years",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Kashmiri Pashmina Shawl",
      artisan: "Priya Sharma",
      category: "Handloom",
      subcategory: "Pashmina Weaving",
      startingBid: 8000,
      currentBid: 12000,
      startDate: "2025-08-10",
      endDate: "2025-08-17",
      status: "Ended",
      bidders: 25,
      location: "Srinagar",
      description: "Luxurious Kashmiri Pashmina shawl woven from the finest cashmere wool, featuring traditional Kashmiri patterns.",
      dimensions: "2 meters x 1 meter",
      weight: "200 grams",
      materials: "Pure Cashmere Wool",
      artisanContact: "+91 9876543211",
      artisanExperience: "12 years",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Terracotta Pottery Set",
      artisan: "Meera Patel",
      category: "Handicraft",
      subcategory: "Pottery",
      startingBid: 2500,
      currentBid: 2500,
      startDate: "2025-08-16",
      endDate: "2025-08-23",
      status: "Scheduled",
      bidders: 0,
      location: "Ahmedabad",
      description: "Traditional terracotta pottery set including decorative vases and serving bowls with authentic tribal designs.",
      dimensions: "Various sizes (Set of 5 pieces)",
      weight: "3 kg total",
      materials: "Natural Terracotta Clay",
      artisanContact: "+91 9876543213",
      artisanExperience: "18 years",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68433?w=400&h=400&fit=crop"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const categories = {
    'Handloom': ['Silk Weaving', 'Cotton Weaving', 'Wool Weaving', 'Pashmina Weaving', 'Khadi Weaving'],
    'Handicraft': ['Wood Carving', 'Pottery', 'Metal Work', 'Stone Carving', 'Bamboo Craft', 'Leather Work']
  };

  const [newAuction, setNewAuction] = useState({
    title: '',
    artisan: '',
    category: 'Handloom',
    subcategory: '',
    startingBid: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    image: ''
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'bg-green-100 text-green-800',
      'Ended': 'bg-gray-100 text-gray-800',
      'Scheduled': 'bg-blue-100 text-blue-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`;
  };

  const filteredAuctions = auctions.filter(auction => {
    const categoryMatch = filterCategory === 'All' || auction.category === filterCategory;
    const statusMatch = filterStatus === 'All' || auction.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const handleAddAuction = () => {
    const auction = {
      ...newAuction,
      id: auctions.length + 1,
      currentBid: parseInt(newAuction.startingBid),
      status: 'Scheduled',
      bidders: 0
    };
    setAuctions([...auctions, auction]);
    setNewAuction({
      title: '',
      artisan: '',
      category: 'Handloom',
      subcategory: '',
      startingBid: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleCategoryChange = (category) => {
    setNewAuction({
      ...newAuction,
      category: category,
      subcategory: ''
    });
  };

  const handleViewDetails = (auction) => {
    setSelectedAuction(auction);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-6 bg-white min-h-screen ml-64 pt-20  flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">Auction Management</h1>
          <p className="text-gray-600">Dashboard • Auctions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <span>+</span>
          Add Auction
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Handloom">Handloom</option>
            <option value="Handicraft">Handicraft</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Ended">Ended</option>
          </select>
        </div>
      </div>
      
      {/* Auctions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auction Details
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
            {filteredAuctions.map((auction) => (
              <tr key={auction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{auction.title}</div>
                    <div className="text-sm text-gray-500">by {auction.artisan}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{auction.category}</div>
                    <div className="text-sm text-gray-500">{auction.subcategory}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">₹{auction.currentBid.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Start: ₹{auction.startingBid.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{auction.bidders} bidders</div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewDetails(auction)}
                    className="text-blue-600 hover:text-blue-900 flex items-center justify-center p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Auction Details</h2>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h3>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={selectedAuction.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'} 
                      alt={selectedAuction.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Middle Column - Basic Info & Description */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAuction.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Artisan</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAuction.artisan}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAuction.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAuction.category} - {selectedAuction.subcategory}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Auction Description</h3>
                  <div className="bg-white p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedAuction.description || 'No description available for this auction.'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dimensions</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAuction.dimensions || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAuction.weight || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Materials</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAuction.materials || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Auction & Artisan Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">Auction Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-orange-700">Status</label>
                      <span className={getStatusBadge(selectedAuction.status)}>
                        {selectedAuction.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700">Starting Bid</label>
                      <p className="mt-1 text-lg font-semibold text-orange-900">₹{selectedAuction.startingBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700">Current Bid</label>
                      <p className="mt-1 text-lg font-semibold text-orange-900">₹{selectedAuction.currentBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700">Total Bidders</label>
                      <p className="mt-1 text-sm text-orange-900">{selectedAuction.bidders} bidders</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700">Auction Period</label>
                      <p className="mt-1 text-sm text-orange-900">
                        {selectedAuction.startDate} to {selectedAuction.endDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Artisan Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700">Name</label>
                      <p className="mt-1 text-sm text-blue-900">{selectedAuction.artisan}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700">Contact</label>
                      <p className="mt-1 text-sm text-blue-900">{selectedAuction.artisanContact || 'Not available'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700">Experience</label>
                      <p className="mt-1 text-sm text-blue-900">{selectedAuction.artisanExperience || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700">Specialization</label>
                      <p className="mt-1 text-sm text-blue-900">{selectedAuction.subcategory}</p>
                    </div>
                  </div>
                </div>
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

      {/* Add Auction Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Auction</h2>
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
                    Auction Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuction.title}
                    onChange={(e) => setNewAuction({...newAuction, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter auction title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Artisan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuction.artisan}
                    onChange={(e) => setNewAuction({...newAuction, artisan: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter artisan name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={newAuction.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Handloom">Handloom</option>
                    <option value="Handicraft">Handicraft</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory *
                  </label>
                  <select
                    required
                    value={newAuction.subcategory}
                    onChange={(e) => setNewAuction({...newAuction, subcategory: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select Subcategory</option>
                    {categories[newAuction.category]?.map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Bid (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newAuction.startingBid}
                    onChange={(e) => setNewAuction({...newAuction, startingBid: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter starting bid"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuction.location}
                    onChange={(e) => setNewAuction({...newAuction, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newAuction.startDate}
                    onChange={(e) => setNewAuction({...newAuction, startDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newAuction.endDate}
                    onChange={(e) => setNewAuction({...newAuction, endDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    value={newAuction.image}
                    onChange={(e) => setNewAuction({...newAuction, image: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter image URL (optional)"
                  />
                </div>
              </div>
              
              {/* Description Field - Full Width */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newAuction.description}
                  onChange={(e) => setNewAuction({...newAuction, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none"
                  placeholder="Enter detailed description of the auction item..."
                />
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
                  onClick={handleAddAuction}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Add Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionManagement;