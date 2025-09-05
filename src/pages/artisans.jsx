import React, { useState } from 'react'
import { Search, Filter, Plus, X, Check, Eye, Clock, MoreVertical, Phone, Calendar, User, Award, Shield } from 'lucide-react'
const Partners = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [craftFilter, setCraftFilter] = useState('')
  const [aadharFilter, setAadharFilter] = useState('')
  //const [approvalFilter, setApprovalFilter] = useState('')
  const [dropdownOpen, setDropdownOpen]=useState(null)
  const[showDetailsModal, setShowDetailsModal]= useState(false)
  const[selectedPartner, setSelectedPartner]=useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'pending', 'approved'
// Form state for adding new artisan
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    serviceType: '',
    status: 'Active',
    aadharVerified: 'Yes',
    approvalStatus: 'Pending',
    caste: '', // 
    subcaste: '' 
  })



// Caste and Subcaste data
const casteSubcasteData = {
  'General': [
    'Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Bhumihar', 
    'Rajput', 'Marwari', 'Agarwal', 'Baniya', 'Jain'
  ],
  'OBC': [
    'Yadav', 'Kurmi', 'Kushwaha', 'Koeri', 'Teli', 'Nai', 
    'Kumhar', 'Mallah', 'Bind', 'Kewat', 'Nishad', 'Patel'
  ],
  'SC': [
    'Chamar', 'Pasi', 'Dhobi', 'Bhangi', 'Dom', 'Khatik', 
    'Nat', 'Sapera', 'Basor', 'Kanjar'
  ],
  'ST': [
    'Gond', 'Santhal', 'Munda', 'Oraon', 'Bhil', 'Kol', 
    'Tharu', 'Bhotia', 'Jaunsari', 'Kharwar'
  ]
}
// Sample partners data - with approval status
  const [partnersData, setPartnersData] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      contact: '+91 9876543210',
      serviceType: 'Handloom Weaving',
      status: 'Active',
      aadharVerified: 'Yes',
      approvalStatus: 'Approved',
      joinedDate: '2024-01-15',
      approvedDate: '2024-01-16',
      caste: 'OBC',
      subcaste: 'Yadav'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      contact: '+91 9876543211',
      serviceType: 'Embroidery',
      status: 'Active',
      aadharVerified: 'Yes',
      approvalStatus: 'Approved',
      joinedDate: '2024-01-20',
      approvedDate: '2024-01-21'
    },
    {
      id: 3,
      name: 'Amit Singh',
      contact: '+91 9876543212',
      serviceType: 'Block Printing',
      status: 'Active',
     
      aadharVerified: 'No',
      approvalStatus: 'Pending',
      joinedDate: '2024-08-18'
    },

    {
      id: 4,
      name: 'Meera Patel',
      contact: '+91 9876543213',
      serviceType: 'Pottery',
      status: 'Inactive',
     
      aadharVerified: 'Yes',
      approvalStatus: 'Rejected',
      joinedDate: '2024-07-10',
      rejectedDate: '2024-07-12'
    },
    {
      id: 5,
      name: 'Suresh Yadav',
      contact: '+91 9876543214',
      serviceType: 'Wood Carving',
      status: 'Active',
      
      aadharVerified: 'No',
      approvalStatus: 'Approved',
      joinedDate: '2023-12-05',
      approvedDate: '2023-12-07'
    },
    {
      id: 6,
      name: 'Kavita Devi',
      contact: '+91 9876543215',
      serviceType: 'Textile Dyeing',
      status: 'Active',
     
      aadharVerified: 'Yes',
      approvalStatus: 'Pending',
      joinedDate: '2024-08-20'
    },
    {
      id: 7,
      name: 'Ravi Gupta',
      contact: '+91 9876543216',
      serviceType: 'Jewelry Making',
      status: 'Active',
      
      aadharVerified: 'No',
      approvalStatus: 'Pending',
      joinedDate: '2024-08-21'
    }
  ])
// Handle dropdown toggle
const toggleDropdown = (partnerId) => {
  setDropdownOpen(dropdownOpen === partnerId ? null : partnerId)
}

// Handle view details
const handleViewDetails = (partner) => {
  setSelectedPartner(partner)
  setShowDetailsModal(true)
  setDropdownOpen(null) // Close dropdown
}

// Close dropdown when clicking outside
const closeDropdown = () => {
  setDropdownOpen(null)
}

  // Handle caste change to reset subcaste
const handleCasteChange = (e) => {
  const selectedCaste = e.target.value
  setFormData(prev => ({ 
    ...prev, 
    caste: selectedCaste,
    subcaste: '' // Reset subcaste when caste changes
  }))
}
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle adding new artisan
  const handleAddArtisan = () => {
    if (formData.name && formData.contact && formData.serviceType) {
      const newArtisan = {
        id: partnersData.length + 1,
        name: formData.name,
        contact: formData.contact,
        serviceType: formData.serviceType,
        status: formData.status,
        aadharVerified: formData.aadharVerified,
        approvalStatus: 'Pending',
        joinedDate: new Date().toISOString().split('T')[0],
        caste: formData.caste, // Add this
        subcaste: formData.subcaste // Add thi
      }
      setPartnersData(prev => [...prev, newArtisan])
      setFormData({
        name: '',
        contact: '',
        serviceType: '',
        status: 'Active',
        totalBookings: '',
        aadharVerified: 'Yes',
        approvalStatus: 'Pending',
        caste: '',
        subcaste:''
      })
      setShowAddForm(false)
    }
  }
  
  // Handle approval actions
  const handleApproval = (id, action) => {
    setPartnersData(prev => prev.map(partner => {
      if (partner.id === id) {
        const updatedPartner = { ...partner }
        if (action === 'approve') {
          updatedPartner.approvalStatus = 'Approved'
          updatedPartner.approvedDate = new Date().toISOString().split('T')[0]
          updatedPartner.status = 'Active'
        } else if (action === 'reject') {
          updatedPartner.approvalStatus = 'Rejected'
          updatedPartner.rejectedDate = new Date().toISOString().split('T')[0]
          updatedPartner.status = 'Inactive'
        }
        return updatedPartner
      }
      return partner
    }))
  }

  // Filter partners based on search term, filters, and active tab
  const filteredPartners = partnersData.filter(partner => {
    const matchesSearch =
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || partner.status === statusFilter
    const matchesCraft = !craftFilter || partner.serviceType === craftFilter
    const matchesAadhar = !aadharFilter || partner.aadharVerified === aadharFilter
    //const matchesApproval = !approvalFilter || partner.approvalStatus === approvalFilter
    
    // Tab filtering
    let matchesTab = true
    if (activeTab === 'pending') {
      matchesTab = partner.approvalStatus === 'Pending'
    } else if (activeTab === 'approved') {
      matchesTab = partner.approvalStatus === 'Approved'
    }
    
    return matchesSearch && matchesStatus && matchesCraft && matchesAadhar && matchesTab
  })
  // Get unique values for filter dropdowns
  const uniqueCrafts = [...new Set(partnersData.map(p => p.serviceType))]
  // Get counts for tabs
  const pendingCount = partnersData.filter(p => p.approvalStatus === 'Pending').length
  const approvedCount = partnersData.filter(p => p.approvalStatus === 'Approved').length
  return (
    <div className="ml-64 pt-20  flex-1">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">Artisan Management</h1>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
              <span>Dashboard</span>
              <span>•</span>
              <span>Artisans</span>
            </nav>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">
                {pendingCount} Pending Approvals
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Artisans ({partnersData.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending Approval ({pendingCount})
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'approved'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search artisans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ${
              showFilter ? 'bg-gray-200' : 'bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Artisan
          </button>
        </div>


        {/* Filter Panel */}
        {showFilter && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Craft Type
                </label>
                <select
                  value={craftFilter}
                  onChange={(e) => setCraftFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Crafts</option>
                  {uniqueCrafts.map(craft => (
                    <option key={craft} value={craft}>
                      {craft}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Verification
                </label>
                <select
                  value={aadharFilter}
                  onChange={(e) => setAadharFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="Yes">Verified</option>
                  <option value="No">Not Verified</option>
                </select>
              </div>
              
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setStatusFilter('')
                  setCraftFilter('')
                  setAadharFilter('')
                  //setApprovalFilter('')
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )} 
      </div>
      {/* Add Artisan Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Artisan</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Artisan Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter artisan name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Craft Type *
                  </label>
                  <input
                    type="text"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Handloom Weaving"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>

                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhar Verification
                  </label>
                  <select
                    name="aadharVerified"
                    value={formData.aadharVerified}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="Yes">Verified</option>
                    <option value="No">Not Verified</option>
                  </select>
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Caste *
  </label>
  <select
    name="caste"
    value={formData.caste}
    onChange={handleCasteChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  >
    <option value="">Select Caste</option>
    <option value="General">General</option>
    <option value="OBC">OBC (Other Backward Classes)</option>
    <option value="SC">SC (Scheduled Castes)</option>
    <option value="ST">ST (Scheduled Tribes)</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Subcaste {formData.caste && '*'}
  </label>
  <select
    name="subcaste"
    value={formData.subcaste}
    onChange={handleFormChange}
    disabled={!formData.caste}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
  >
    <option value="">
      {formData.caste ? 'Select Subcaste' : 'First select Caste'}
    </option>
    {formData.caste && casteSubcasteData[formData.caste]?.map(subcaste => (
      <option key={subcaste} value={subcaste}>
        {subcaste}
      </option>
    ))}
  </select>
</div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >

                    Cancel
                  </button> 
                  <button 
                    onClick={handleAddArtisan}
                    className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add Artisan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Details Modal */}
{showDetailsModal && selectedPartner && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Artisan Details</h2>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedPartner.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{selectedPartner.contact}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Craft Type</p>
                <p className="font-medium">{selectedPartner.serviceType}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">{selectedPartner.joinedDate}</p>
              </div>
            </div>
          </div>
          
          {/* Status Info */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Status Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedPartner.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedPartner.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Approval Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedPartner.approvalStatus === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : selectedPartner.approvalStatus === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedPartner.approvalStatus}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Aadhar Verification</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedPartner.aadharVerified === 'Yes'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedPartner.aadharVerified === 'Yes' ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Caste Information */}
          {(selectedPartner.caste || selectedPartner.subcaste) && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Category Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPartner.caste && (
                  <div>
                    <p className="text-sm text-gray-500">Caste</p>
                    <p className="font-medium">{selectedPartner.caste}</p>
                  </div>
                )}
                {selectedPartner.subcaste && (
                  <div>
                    <p className="text-sm text-gray-500">Subcaste</p>
                    <p className="font-medium">{selectedPartner.subcaste}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Dates */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPartner.approvedDate && (
                <div>
                  <p className="text-sm text-gray-500">Approved Date</p>
                  <p className="font-medium">{selectedPartner.approvedDate}</p>
                </div>
              )}
              {selectedPartner.rejectedDate && (
                <div>
                  <p className="text-sm text-gray-500">Rejected Date</p>
                  <p className="font-medium">{selectedPartner.rejectedDate}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={() => setShowDetailsModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Partners Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artisan Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Craft Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aadhar Verified
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                    <div className="text-xs text-gray-500">Joined: {partner.joinedDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partner.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partner.serviceType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        partner.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {partner.status}

                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        partner.aadharVerified === 'Yes'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {partner.aadharVerified === 'Yes' ? 'Verified' : 'Not Verified'}
                    </span>
                  </td>
                 <td className="px-6 py-4 whitespace-nowrap relative">
  <button
    onClick={() => toggleDropdown(partner.id)}
    className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
  >
    <MoreVertical className="w-4 h-4" />
  </button>
  
  {/* Dropdown Menu */}
  {dropdownOpen === partner.id && (
    <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
      <button
        onClick={() => handleViewDetails(partner)}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Details
      </button>
      
      {partner.approvalStatus === 'Pending' && (
        <>
          <button
            onClick={() => {
              handleApproval(partner.id, 'approve')
              setDropdownOpen(null)
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </button>
          <button
            onClick={() => {
              handleApproval(partner.id, 'reject')
              setDropdownOpen(null)
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </button>
        </>
      )}
    </div>
  )}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filteredPartners.length === 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">No artisans found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Partners