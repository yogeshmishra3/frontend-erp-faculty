import React from 'react';
import { LogOut } from 'lucide-react';

export default function Dashboard({ userData, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {userData.email}</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
          <p className="text-gray-600">Email: {userData.email}</p>
          <p className="text-gray-600">Role: {userData.role}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <p className="text-gray-600">This is your faculty dashboard. You can navigate to other pages using the sidebar.</p>
        </div>
      </div>
    </div>
  );
}