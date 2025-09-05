import React, { useState, useEffect } from 'react';
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
  Star
} from 'lucide-react';

const PermissionManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@handloom.com',
      role: 'Admin',
      permissions: ['create', 'read', 'update', 'delete', 'manage_users'],
      status: 'active',
      lastLogin: '2024-03-01',
      department: 'Management'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@handloom.com',
      role: 'Manager',
      permissions: ['create', 'read', 'update', 'manage_inventory'],
      status: 'active',
      lastLogin: '2024-03-02',
      department: 'Production'
    },
    {
      id: 3,
      name: 'Amit Singh',
      email: 'amit@handloom.com',
      role: 'Artisan',
      permissions: ['read', 'update'],
      status: 'inactive',
      lastLogin: '2024-02-28',
      department: 'Craft'
    },
    {
      id: 4,
      name: 'Sunita Devi',
      email: 'sunita@handloom.com',
      role: 'Designer',
      permissions: ['create', 'read', 'update'],
      status: 'active',
      lastLogin: '2024-03-03',
      department: 'Design'
    }
  ]);

  const [roles] = useState([
    {
      name: 'Admin',
      description: 'Full system access',
      permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_inventory', 'view_reports'],
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Manager',
      description: 'Department management',
      permissions: ['create', 'read', 'update', 'manage_inventory', 'view_reports'],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Designer',
      description: 'Product design access',
      permissions: ['create', 'read', 'update'],
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Artisan',
      description: 'Production access',
      permissions: ['read', 'update'],
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Viewer',
      description: 'Read-only access',
      permissions: ['read'],
      color: 'bg-gray-100 text-gray-800'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('edit'); // 'edit', 'add', 'view'
  const [editingUser, setEditingUser] = useState(null);
  const permissionsList = [
    { id: 'create', name: 'Create', description: 'Create new items' },
    { id: 'read', name: 'Read', description: 'View existing items' },
    { id: 'update', name: 'Update', description: 'Edit existing items' },
    { id: 'delete', name: 'Delete', description: 'Remove items' },
    { id: 'manage_users', name: 'User Management', description: 'Manage user accounts' },
    { id: 'manage_inventory', name: 'Inventory Management', description: 'Manage stock and inventory' },
    { id: 'view_reports', name: 'View Reports', description: 'Access analytics and reports' }
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
      role: 'Viewer',
      permissions: ['read'],
      status: 'active',
      department: ''
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
      case 'Admin': return <Crown className="w-4 h-4" />;
      case 'Manager': return <Star className="w-4 h-4" />;
      case 'Designer': return <Edit3 className="w-4 h-4" />;
      case 'Artisan': return <Settings className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    const roleData = roles.find(r => r.name === role);
    return roleData ? roleData.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 ml-64 pt-20  flex-1">
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
              <p className="text-gray-600 mt-1">Manage user roles and permissions for your handloom & handcraft business</p>
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
                  <p className="text-sm text-gray-600">Roles</p>
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
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'Admin').length}</p>
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
                  <option value="all">All Roles</option>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
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
                    <td className="px-6 py-4 text-sm text-gray-600">{user.department}</td>
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
                        {user.permissions.slice(0, 3).map((permission) => (
                          <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                            {permission}
                          </span>
                        ))}
                        {user.permissions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{user.permissions.length - 3}
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
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(editingUser?.role)}`}>
                          {editingUser?.role}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <p className="text-gray-900">{editingUser?.department}</p>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-700"
                          value={editingUser?.department || ''}
                          onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                        >
                          <option value="">Select Department</option>
                          <option value="Management">Management</option>
                          <option value="Production">Production</option>
                          <option value="Design">Design</option>
                          <option value="Craft">Craft</option>
                          <option value="Sales">Sales</option>
                          <option value="Quality">Quality</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {permissionsList.map((permission) => (
                          <label key={permission.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-orange-500 focus:ring-orange-700"
                              checked={editingUser?.permissions?.includes(permission.id) || false}
                              onChange={(e) => {
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
      </div>
    </div>
  );
};

export default PermissionManagement;