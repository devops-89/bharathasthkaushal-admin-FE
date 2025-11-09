
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Check,
  X,
  Eye,
  Settings,
  UserPlus,
  Crown,
  Star,
  MapPin,
  Globe,
  Building,
  Target,
  TrendingUp,
  
} from 'lucide-react';
const PermissionManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@handloom.com',
      role: 'Country Head',
      permissions: ['view_all_data', 'manage_all_users', 'create_reports', 'modify_all_data', 'delete_records', 'view_financials', 'strategic_planning'],
      status: 'active',
      lastLogin: '2024-03-01',
      department: 'Country Head',
      territory: 'India'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@handloom.com',
      role: 'Zonal Manager',
      permissions: ['view_zonal_data', 'manage_zone_users', 'create_zone_reports', 'modify_zone_data', 'view_zone_financials'],
      status: 'active',
      lastLogin: '2024-03-02',
      department: 'Zonal Manager',
      territory: 'North Zone'
    },
    {
      id: 3,
      name: 'Amit Singh',
      email: 'amit@handloom.com',
      role: 'State Manager',
      permissions: ['view_state_data', 'manage_state_users', 'create_state_reports', 'modify_state_data'],
      status: 'active',
      lastLogin: '2024-02-28',
      department: 'State Manager',
      territory: 'Punjab'
    },
    {
      id: 4,
      name: 'Sunita Devi',
      email: 'sunita@handloom.com',
      role: 'Area Manager',
      permissions: ['view_area_data', 'manage_area_users', 'create_area_reports'],
      status: 'active',
      lastLogin: '2024-03-03',
      department: 'Area Manager',
      territory: 'Ludhiana Area'
    },
    {
      id: 5,
      name: 'Vikram Gupta',
      email: 'vikram@handloom.com',
      role: 'Territory Manager',
      permissions: ['view_territory_data', 'manage_territory_team', 'create_territory_reports'],
      status: 'active',
      lastLogin: '2024-03-04',
      department: 'Territory Manager',
      territory: 'Central Territory'
    },
    {
      id: 6,
      name: 'Anjali Mehta',
      email: 'anjali@handloom.com',
      role: 'Sales Manager',
      permissions: ['view_sales_data', 'manage_sales_team', 'view_customer_data'],
      status: 'active',
      lastLogin: '2024-03-05',
      department: 'Sales Manager',
      territory: 'District 1'
    }
  ]);

  const [roles] = useState([
    {
      name: 'Country Head',
      description: 'National level management - Complete access',
      permissions: ['view_all_data', 'manage_all_users', 'create_reports', 'modify_all_data', 'delete_records', 'view_financials', 'strategic_planning', 'policy_management'],
      color: 'bg-red-100 text-red-800',
      level: 1
    },
    {
      name: 'Zonal Manager',
      description: 'Zone level management - Multi-state access',
      permissions: ['view_zonal_data', 'manage_zone_users', 'create_zone_reports', 'modify_zone_data', 'view_zone_financials', 'zone_planning'],
      color: 'bg-purple-100 text-purple-800',
      level: 2
    },
    {
      name: 'State Manager',
      description: 'State level management - State-wide access',
      permissions: ['view_state_data', 'manage_state_users', 'create_state_reports', 'modify_state_data', 'view_state_financials'],
      color: 'bg-blue-100 text-blue-800',
      level: 3
    },
    {
      name: 'Area Manager',
      description: 'Area level management - Multi-district access',
      permissions: ['view_area_data', 'manage_area_users', 'create_area_reports', 'modify_area_data'],
      color: 'bg-green-100 text-green-800',
      level: 4
    },
    {
      name: 'Territory Manager',
      description: 'Territory level management - District level access',
      permissions: ['view_territory_data', 'manage_territory_team', 'create_territory_reports', 'territory_planning'],
      color: 'bg-yellow-100 text-yellow-800',
      level: 5
    },
    {
      name: 'Sales Manager',
      description: 'Sales team management - Local area access',
      permissions: ['view_sales_data', 'manage_sales_team', 'view_customer_data', 'sales_reporting'],
      color: 'bg-orange-100 text-orange-800',
      level: 6
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('edit'); 
  const [editingUser, setEditingUser] = useState(null);
  const permissionsList = [
    { id: 'view_all_data', name: 'View All Data', description: 'Access to all national data', level: 1 },
    { id: 'manage_all_users', name: 'Manage All Users', description: 'Manage all user accounts nationwide', level: 1 },
    { id: 'strategic_planning', name: 'Strategic Planning', description: 'Access to strategic planning tools', level: 1 },
    { id: 'policy_management', name: 'Policy Management', description: 'Create and modify company policies', level: 1 },
    { id: 'view_financials', name: 'View All Financials', description: 'Access to complete financial data', level: 1 },
    { id: 'delete_records', name: 'Delete Records', description: 'Permission to delete any records', level: 1 },
    { id: 'view_zonal_data', name: 'View Zonal Data', description: 'Access to zone-specific data', level: 2 },
    { id: 'manage_zone_users', name: 'Manage Zone Users', description: 'Manage users within the zone', level: 2 },
    { id: 'view_zone_financials', name: 'View Zone Financials', description: 'Access to zonal financial data', level: 2 },
    { id: 'zone_planning', name: 'Zone Planning', description: 'Zone-level planning and strategy', level: 2 },
    { id: 'view_state_data', name: 'View State Data', description: 'Access to state-specific data', level: 3 },
    { id: 'manage_state_users', name: 'Manage State Users', description: 'Manage users within the state', level: 3 },
    { id: 'view_state_financials', name: 'View State Financials', description: 'Access to state financial data', level: 3 },
    { id: 'view_area_data', name: 'View Area Data', description: 'Access to area-specific data', level: 4 },
    { id: 'manage_area_users', name: 'Manage Area Users', description: 'Manage users within the area', level: 4 }, 
    { id: 'view_territory_data', name: 'View Territory Data', description: 'Access to territory-specific data', level: 5 },
    { id: 'manage_territory_team', name: 'Manage Territory Team', description: 'Manage territory team members', level: 5 },
    { id: 'territory_planning', name: 'Territory Planning', description: 'Territory-level planning', level: 5 },
    { id: 'view_sales_data', name: 'View Sales Data', description: 'Access to sales performance data', level: 6 },
    { id: 'manage_sales_team', name: 'Manage Sales Team', description: 'Manage direct sales team', level: 6 },
    { id: 'view_customer_data', name: 'View Customer Data', description: 'Access to customer information', level: 6 },
  
    { id: 'create_reports', name: 'Create Reports', description: 'Generate reports for assigned level', level: 0 },
    { id: 'modify_all_data', name: 'Modify All Data', description: 'Edit data at assigned level', level: 0 },
    { id: 'modify_zone_data', name: 'Modify Zone Data', description: 'Edit zone-specific data', level: 2 },
    { id: 'modify_state_data', name: 'Modify State Data', description: 'Edit state-specific data', level: 3 },
    { id: 'modify_area_data', name: 'Modify Area Data', description: 'Edit area-specific data', level: 4 },
    { id: 'create_zone_reports', name: 'Create Zone Reports', description: 'Generate zone-level reports', level: 2 },
    { id: 'create_state_reports', name: 'Create State Reports', description: 'Generate state-level reports', level: 3 },
    { id: 'create_area_reports', name: 'Create Area Reports', description: 'Generate area-level reports', level: 4 },
    { id: 'create_territory_reports', name: 'Create Territory Reports', description: 'Generate territory reports', level: 5 },
    { id: 'sales_reporting', name: 'Sales Reporting', description: 'Generate sales reports', level: 6 }
  ];
  const departments = [
    'Country Head',
    'Zonal Manager', 
    'State Manager',
    'Area Manager',
    'Territory Manager',
    'Sales Manager'
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const openModal = (type, user = null) => {
    setModalType(type);
    setEditingUser(user ? { ...user } : {
      name: '',
      email: '',
      role: 'Sales Manager',
      permissions: ['view_sales_data', 'manage_sales_team', 'view_customer_data'],
      status: 'active',
      department: 'Sales Manager',
      territory: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = () => {
    if (modalType === 'add') {
      const newUser = {
        ...editingUser,
        id: users.length + 1,
        lastLogin: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    } else if (modalType === 'edit') {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
    }
    closeModal();
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'Country Head': return <Globe className="w-4 h-4" />;
      case 'Zonal Manager': return <Building className="w-4 h-4" />;
      case 'State Manager': return <MapPin className="w-4 h-4" />;
      case 'Area Manager': return <Target className="w-4 h-4" />;
      case 'Territory Manager': return <TrendingUp className="w-4 h-4" />;
      case 'Sales Manager': return <Users className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    const roleData = roles.find(r => r.name === role);
    return roleData ? roleData.color : 'bg-gray-100 text-gray-800';
  };

  const getHierarchyLevel = (role) => {
    const roleData = roles.find(r => r.name === role);
    return roleData ? roleData.level : 6;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                 Permission Management
              </h1>
              <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                <NavLink
                  to="/Dashboard"
                  className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : ""} >
                          Dashboard
                        </NavLink>
                        <span>•</span>
                        <NavLink
                          to="/permission-management"
                          className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : ""}
                        >
                          Permission  Management 
                        </NavLink>
                  </nav>
      
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hierarchy Levels</p>
                  <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Crown className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Country Heads</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'Country Head').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-700"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  {roles.map(role => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => openModal('add')}
              className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-500 hover:to-orange-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Territory</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Login</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Permissions</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.territory}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 2).map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                            {permissionsList.find(p => p.id === permission)?.name?.split(' ')[0] || permission}
                          </span>
                        ))}
                        {user.permissions.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{user.permissions.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal('view', user)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', user)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {modalType === 'add' ? 'Add New User' : modalType === 'edit' ? 'Edit User' : 'User Details'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {modalType === 'view' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {editingUser?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{editingUser?.name}</h3>
                        <p className="text-gray-600">{editingUser?.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(editingUser?.role)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(editingUser?.role)}`}>
                            {editingUser?.role}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Territory</label>
                        <p className="text-gray-900">{editingUser?.territory}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          editingUser?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {editingUser?.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                        <p className="text-gray-900">{editingUser?.lastLogin}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                      <div className="flex flex-wrap gap-2">
                        {editingUser?.permissions?.map((permission) => (
                          <span key={permission} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">
                            {permissionsList.find(p => p.id === permission)?.name || permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-700"
                          value={editingUser?.name || ''}
                          onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-700"
                          value={editingUser?.email || ''}
                          onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-700"
                          value={editingUser?.role || ''}
                          onChange={(e) => {
                            const selectedRole = roles.find(r => r.name === e.target.value);
                            setEditingUser({
                              ...editingUser, 
                              role: e.target.value,
                              department: e.target.value,
                              permissions: selectedRole ? selectedRole.permissions : []
                            });
                          }}
                        >
                          {roles.map(role => (
                            <option key={role.name} value={role.name}>{role.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Territory/Area</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-700"
                          value={editingUser?.territory || ''}
                          onChange={(e) => setEditingUser({...editingUser, territory: e.target.value})}
                          placeholder="e.g., North Zone, Punjab, Central Territory"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions
                        <span className="text-sm text-gray-500 ml-2">
                          (Auto-assigned based on role hierarchy)
                        </span>
                      </label>
                      <div className="space-y-3 max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-4">
                        {/* Show permissions grouped by hierarchy level */}
                        {[1, 2, 3, 4, 5, 6, 0].map(level => {
                          const levelPermissions = permissionsList.filter(p => p.level === level);
                          const userRole = roles.find(r => r.name === editingUser?.role);
                          const canAccessLevel = userRole ? userRole.level <= level || level === 0 : false;
                          
                          if (levelPermissions.length === 0) return null;
                          
                          return (
                            <div key={level} className={`${!canAccessLevel ? 'opacity-50' : ''}`}>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                {level === 0 ? 'Common Permissions' : 
                                 level === 1 ? 'Country Level' :
                                 level === 2 ? 'Zonal Level' :
                                 level === 3 ? 'State Level' :
                                 level === 4 ? 'Area Level' :
                                 level === 5 ? 'Territory Level' :
                                 'Sales Level'}
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {levelPermissions.map((permission) => (
                                  <label key={permission.id} className={`flex items-center gap-2 p-2 rounded-lg hover:bg-white ${!canAccessLevel ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <input
                                      type="checkbox"
                                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-700"
                                      checked={editingUser?.permissions?.includes(permission.id) || false}
                                      disabled={!canAccessLevel}
                                      onChange={(e) => {
                                        if (!canAccessLevel) return;
                                        const newPermissions = e.target.checked
                                          ? [...(editingUser?.permissions || []), permission.id]
                                          : editingUser?.permissions?.filter(p => p !== permission.id) || [];
                                        setEditingUser({...editingUser, permissions: newPermissions});
                                      }}
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                                      <p className="text-xs text-gray-600">{permission.description}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Permission Summary */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">Selected Permissions Summary:</p>
                        <div className="flex flex-wrap gap-1">
                          {editingUser?.permissions?.map((permission) => (
                            <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                              {permissionsList.find(p => p.id === permission)?.name || permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hierarchy Information */}
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <h4 className="text-sm font-medium text-orange-800 mb-2">Hierarchy Information:</h4>
                      <div className="text-xs text-orange-700">
                        <p><strong>Current Role:</strong> {editingUser?.role}</p>
                        <p><strong>Hierarchy Level:</strong> {getHierarchyLevel(editingUser?.role)}</p>
                        <p><strong>Access Level:</strong> {
                          editingUser?.role === 'Country Head' ? 'National Access' :
                          editingUser?.role === 'Zonal Manager' ? 'Multi-State Access' :
                          editingUser?.role === 'State Manager' ? 'State-wide Access' :
                          editingUser?.role === 'Area Manager' ? 'Multi-District Access' :
                          editingUser?.role === 'Territory Manager' ? 'District Level Access' :
                          'Local Area Access'
                        }</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {modalType !== 'view' && (
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-500 hover:to-orange-700 text-white rounded-lg transition-all duration-200"
                  >
                    {modalType === 'add' ? 'Add User' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hierarchy Overview Card */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-orange-600" />
            Sales Hierarchy Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div key={role.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  {getRoleIcon(role.name)}
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                    Level {role.level}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Key Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {permissionsList.find(p => p.id === permission)?.name?.split(' ')[0] || permission}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md">
                        +{role.permissions.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Users: {users.filter(u => u.role === role.name).length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManagement;