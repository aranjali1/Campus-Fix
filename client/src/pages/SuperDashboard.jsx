import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import axios from 'axios';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Consistent axios config
  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });

  // Enhanced data fetching
  const fetchData = async (url, setter) => {
    try {
      setLoading(true);
      const { data } = await axios.get(url, getConfig());
      // Handle both array and object responses
      const resultData = Array.isArray(data) ? data : data?.pendingAdmins || data?.approvedAdmins || [];
      setter(resultData);
    } catch (error) {
      console.error('Fetch error:', error);
      setter([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAdmins = () => fetchData(
    'http://localhost:5001/api/admin/pending',
    setPendingAdmins
  );

  const fetchApprovedAdmins = () => fetchData(
    'http://localhost:5001/api/admin/approved',
    setApprovedAdmins
  );

  const fetchComplaints = () => {
    // Temporary mock data - replace with actual API call
    setComplaints([
      { id: 1, title: '🚰 Leaky pipe', location: 'Hostel A', status: 'Pending' },
      { id: 2, title: '🪑 Broken chair', location: 'Classroom 4', status: 'Resolved' },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    const fetchTabData = async () => {
      switch (activeTab) {
        case 'pending': await fetchPendingAdmins(); break;
        case 'approved': await fetchApprovedAdmins(); break;
        case 'complaints': fetchComplaints(); break;
        default: break;
      }
    };

    fetchTabData();
  }, [activeTab]);

  const handleAdminAction = async (id, action) => {
    try {
      setProcessingId(id);
      const url = `http://localhost:5001/api/admin/${action}/${id}`;
      
      if (action === 'approve') {
        await axios.put(url, {}, getConfig());
      } else {
        await axios.delete(url, getConfig());
      }

      setPendingAdmins(prev => prev.filter(admin => admin._id !== id));
      
      if (action === 'approve') {
        await fetchApprovedAdmins();
      }
    } catch (error) {
      console.error(`Failed to ${action} admin:`, error);
    } finally {
      setProcessingId(null);
    }
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

    switch (activeTab) {
      case 'pending':
        return (
          <div className="space-y-4">
            {pendingAdmins.length === 0 ? (
              <p className="text-sm text-gray-500">🎉 No pending admin requests!</p>
            ) : (
              pendingAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div className="space-y-1">
                    <p className="text-gray-800 font-medium">📧 {admin.email}</p>
                    <p className="text-sm text-gray-500">📍 {admin.location}</p>
                    <p className="text-xs text-gray-400">
                      Requested: {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdminAction(admin._id, 'approve')}
                      disabled={processingId === admin._id}
                      className={`px-4 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition ${
                        processingId === admin._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingId === admin._id ? 'Processing...' : '✅ Approve'}
                    </button>
                    <button
                      onClick={() => handleAdminAction(admin._id, 'reject')}
                      disabled={processingId === admin._id}
                      className={`px-4 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition ${
                        processingId === admin._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'approved':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {approvedAdmins.length === 0 ? (
              <p className="text-sm text-gray-500">No approved admins yet.</p>
            ) : (
              approvedAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <p className="font-medium text-gray-800">📧 {admin.email}</p>
                  <p className="text-sm text-gray-500">📍 {admin.location}</p>
                  <p className="text-xs text-gray-400">
                    Approved on: {new Date(admin.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        );

      case 'complaints':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800">{complaint.title}</p>
                <p className="text-sm text-gray-500">📍 {complaint.location}</p>
                <p className={`text-sm ${
                  complaint.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  🏷️ Status: {complaint.status}
                </p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 mt-14 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <Title
          title="👑 Super Admin Dashboard"
          subtitle="Manage admin approvals and monitor campus complaints"
        />

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: '📝 Pending Requests', key: 'pending' },
            { label: '✅ Approved Admins', key: 'approved' },
            { label: '📋 All Complaints', key: 'complaints' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-[#0f172a] text-white shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;