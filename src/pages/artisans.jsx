import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, X, Eye, MoreVertical, Phone, Calendar, User, Mail, MapPin } from 'lucide-react';
import { authControllers } from "../api/auth";
import { userControllers } from "../api/user";

const ArtisanManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+91',
    phoneNo: '',
    expertizeField: '',
    latitude: '',
    longitude: '',
    aadhaarNumber: '',
    user_caste_category: 'GENERAL',
    subCaste: '',
    introVideo: '',
    instNumber: ''
  });
  const [partnersData, setPartnersData] = useState(() => {
    const savedData = localStorage.getItem('partnersData');
    return savedData ? JSON.parse(savedData) : [];
  });

  const casteCategories = {
    GENERAL: ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra'],
    OBC: ['Yadav', 'Kurmi', 'Jat', 'Gujjar'],
    SC: ['Chamar', 'Pasi', 'Dhobi', 'Kori'],
    ST: ['Gond', 'Bhil', 'Santhal', 'Munda']
  };

   
  const fetchArtisans = async () => {
    try {
      const response = await userControllers.getUserListGroup('ARTISAN');
      console.log("API Response:", JSON.stringify(response.data, null, 2)); 

      // Handle different
      let artisans = response.data?.data?.docs || response.data?.docs || response.data || [];
      

      if (!Array.isArray(artisans)) {
        console.error("Expected artisans to be an array, got:", artisans);
        alert("Unexpected data format from API: artisans is not an array");
        return;
      }  
      const mappedData = artisans.map((user, index) => ({
        id: user._id || user.id || `temp-id-${index + 1}`,
        firstName: user.firstName || (user.email ? user.email.split('@')[0] : 'N/A'),
        lastName: user.lastName || 'N/A',
        email: user.email || 'N/A',
        phoneNo: user.phoneNo || 'N/A',
        countryCode: user.countryCode || '+91',
        expertizeField: user.expertizeField || 'Not Specified',
        latitude: user.latitude ?? 'N/A',
        longitude: user.longitude ?? 'N/A',
        aadhaarNumber: user.aadhaarNumber || 'N/A',
        user_caste_category: user.user_caste_category || 'GENERAL',
        subCaste: user.subCaste || 'N/A',
        introVideo: user.introVideo || 'N/A',
        instNumber: user.instNumber || 'N/A',
        joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : 'N/A',
        status: user.status || 'Approved Artisan',
        user_group: user.user_group || 'ARTISAN'
      }));
      console.log("Mapped Data:", mappedData);
      setPartnersData(mappedData);
      localStorage.setItem('partnersData', JSON.stringify(mappedData));
    } catch (error) {
      console.error("Error fetching artisans:", error);
      alert("Error fetching artisan data: " + error.message);
    }
  };
  useEffect(() => {
    fetchArtisans();
  }, []);
  const toggleDropdown = (partnerId) => {
    setDropdownOpen(dropdownOpen === partnerId ? null : partnerId);
  };
  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setShowDetailsModal(true);
    setDropdownOpen(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'user_caste_category') {
        newFormData.subCaste = '';
      }
      return newFormData;
    });
  };

  const handleAddEmployee = async () => {
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        phoneNo: formData.phoneNo,
        expertizeField: formData.expertizeField,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        aadhaarNumber: formData.aadhaarNumber,
        user_caste_category: formData.user_caste_category,
        subCaste: formData.subCaste,
        introVideo: formData.introVideo,
        instNumber: formData.instNumber,
        user_group: 'ARTISAN'
      };
      const response = await authControllers.addEmployee(payload);
      console.log("smkdmk", response,payload)
      if (response.status === 200) {
        alert("Artisan registered successfully! Login credentials sent to email.");
        setShowAddForm(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          countryCode: '+91',
          phoneNo: '',
          expertizeField: '',
          latitude: '',
          longitude: '',
          aadhaarNumber: '',
          user_caste_category: 'GENERAL',
          subCaste: '',
          introVideo: '',
          instNumber: ''
        });
        await fetchArtisans();
      } else {
        alert("Error: " + response.data?.message);
      }
    } catch (error) {
      alert("Error registering artisan: " + error.message);
    }
  };
  const filteredPartners = partnersData.filter(partner => {
    const matchesSearch = 
      (partner.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       partner.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       partner.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !locationFilter || partner.expertizeField === locationFilter;
    const matchesTab = !partner.user_group || partner.user_group.toUpperCase() === 'ARTISAN';
    return matchesSearch && matchesLocation && matchesTab;
  });

  console.log("Filtered Partners:", filteredPartners);  
  const uniqueLocations = [...new Set(partnersData.map(p => p.expertizeField))].filter(field => field && field !== 'Not Specified');

  return (
    <div className="ml-64 pt-20 flex-1">
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
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Artisans
          </button>
        </div>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email..."
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
            <Plus className="w-4 h-4 mr-2" /> Register Artisan
          </button>
        </div>
        {showFilter && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expertise Field</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Fields</option>
                  {uniqueLocations.map(field => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setLocationFilter('')}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Register Artisan Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Register New Artisan</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter first name"
                    
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="example@yopmail.com"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expertise Field *</label>
                  <input
                    type="text"
                    name="expertizeField"
                    value={formData.expertizeField}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Designer"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="24.234"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="67.7999"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number (Optional)</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="2376643876543240"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Caste Category *</label>
                  <select
                    name="user_caste_category"
                    value={formData.user_caste_category}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {Object.keys(casteCategories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Caste *</label>
                  <select
                    name="subCaste"
                    value={formData.subCaste}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Sub Caste</option>
                    {casteCategories[formData.user_caste_category].map(subCaste => (
                      <option key={subCaste} value={subCaste}>{subCaste}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intro Video *</label>
                  <input
                    type="text"
                    name="introVideo"
                    value={formData.introVideo}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="qasdfghjikolp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inst Number *</label>
                  <input
                    type="text"
                    name="instNumber"
                    value={formData.instNumber}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="BNH456fd646458674"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Register Artisan
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
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="font-medium">{selectedPartner.firstName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="font-medium">{selectedPartner.lastName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedPartner.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{`${selectedPartner.countryCode || ''} ${selectedPartner.phoneNo || 'N/A'}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Expertise Field</p>
                      <p className="font-medium">{selectedPartner.expertizeField || 'Not Specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Joined Date</p>
                      <p className="font-medium">{selectedPartner.joinedDate || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Aadhaar Number</p>
                      <p className="font-medium">{selectedPartner.aadhaarNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Caste Category</p>
                      <p className="font-medium">{selectedPartner.user_caste_category || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Sub Caste</p>
                      <p className="font-medium">{selectedPartner.subCaste || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Intro Video</p>
                      <p className="font-medium">{selectedPartner.introVideo || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Inst Number</p>
                      <p className="font-medium">{selectedPartner.instNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{selectedPartner.status || 'Approved Artisan'}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Coordinates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Latitude</p>
                      <p className="font-medium">{selectedPartner.latitude || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Longitude</p>
                      <p className="font-medium">{selectedPartner.longitude || 'N/A'}</p>
                    </div>
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
      {/* Artisans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise Field</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhaar Number</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{partner.firstName || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Joined: {partner.joinedDate || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{partner.lastName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partner.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{`${partner.countryCode || ''} ${partner.phoneNo || 'N/A' }`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partner.expertizeField || 'Not Specified'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partner.aadhaarNumber || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{partner.status || 'Approved Artisan'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <button
                      onClick={() => toggleDropdown(partner.id)}
                      className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {dropdownOpen === partner.id && (
                      <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                        <button
                          onClick={() => handleViewDetails(partner)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
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
  );
};

export default ArtisanManagement;
