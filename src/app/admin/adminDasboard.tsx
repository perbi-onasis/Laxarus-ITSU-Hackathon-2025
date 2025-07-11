"use client";
import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingCount: 0,
    todayCount: 0,
    recentActivity: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      setStats(data);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">System Logo</div>
          <nav className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Requests</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Documents</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Settings</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Logout</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Pending Requests</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Total Requests Today</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">System Alerts</h2>
            <p className="text-gray-600 mt-2">Important Message</p>
          </div>
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <ul>
            {stats.recentActivity.map((activity: any) => (
              <li key={activity.id} className="border-b py-2">
                {activity.user.email} submitted a {activity.type} request
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;