import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Mail, Shield, Lock, Camera, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: '',
        avatar: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({
                    name: parsedUser.name || 'ADMIN',
                    email: parsedUser.email || parsedUser.identity || 'admin@handloom.com',
                    role: parsedUser.role || 'Administrator',
                    avatar: parsedUser.avatar || ''
                });
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    const handleChangePassword = () => {
        toast.info("Change Password functionality will be implemented here");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 ml-64 pt-20 flex-1">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                        My Profile
                    </h1>
                    <nav className="flex items-center space-x-2 text-sm text-orange-600 mt-2">
                        <NavLink to="/dashboard" className="hover:text-orange-800">Dashboard</NavLink>
                        <span>•</span>
                        <span className="font-semibold">Profile</span>
                    </nav>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                            <div className="px-6 pb-6">
                                <div className="relative -mt-16 mb-4 flex justify-center">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden relative group">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-16 h-16 text-gray-400" />
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-sm text-gray-500">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1">
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-50 rounded-lg">
                                        <User className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                                        <p className="text-base font-semibold text-gray-900">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                                        <p className="text-base font-semibold text-gray-900">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <Shield className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Role</p>
                                        <p className="text-base font-semibold text-gray-900">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Security</h3>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        <Lock className="w-5 h-5 text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Password</p>
                                        <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleChangePassword}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
