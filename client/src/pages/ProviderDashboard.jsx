import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../utils/api';

const ProviderDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [costInputs, setCostInputs] = useState({});

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/provider/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      alert('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  const updateProviderStatus = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/provider/update-status`, {
        complaintId,
        providerStatus: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint._id === complaintId 
          ? { ...complaint, providerStatus: newStatus }
          : complaint
      ));
      
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const updateProviderCost = async (complaintId) => {
    const newCost = costInputs[complaintId];
    if (!newCost) {
      alert('Please enter a cost amount.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/provider/update-cost`, {
        complaintId,
        providerCost: newCost
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint._id === complaintId 
          ? { ...complaint, providerCost: newCost }
          : complaint
      ));
      
      alert(`Cost updated to ₹${newCost}`);
    } catch (err) {
      console.error('Error updating cost:', err);
      alert('Failed to update cost.');
    }
  };

  const handleCostChange = (complaintId, value) => {
    setCostInputs(prev => ({
      ...prev,
      [complaintId]: value
    }));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-20 p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#0f172a]">
        🛠️ My Assigned Complaints
      </h2>

      {loading ? (
        <p className="text-center text-lg text-[#334155] animate-pulse">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📭</span>
          </div>
          <p className="text-lg text-gray-600">No complaints assigned yet.</p>
          <p className="text-sm text-gray-500 mt-2">You'll see assigned complaints here once an admin assigns them to you.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {complaints.map((complaint) => {
            const imageUrl = complaint.image?.[0]?.replace(/\\/g, "/");
            const fullImageUrl = imageUrl ? `${BASE_URL}/${imageUrl}` : null;
            
            return (
              <div
                key={complaint._id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#0f172a]">{complaint.title}</h3>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(complaint.providerStatus)}`}>
                      {complaint.providerStatus || 'Pending'}
                    </span>
                    {complaint.paymentStatus && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        complaint.paymentStatus === 'Paid' 
                          ? 'bg-green-100 text-green-700' 
                          : complaint.paymentStatus === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        Payment: {complaint.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Category:</span> {complaint.category}</p>
                  <p><span className="font-medium">Location:</span> {complaint.location}</p>
                  <p><span className="font-medium">Detailed Location:</span> {complaint.detailedLocation}</p>
                </div>

                <p className="text-sm text-gray-700 mb-4">{complaint.description}</p>

                {fullImageUrl && (
                  <div className="mb-4">
                    <img
                      src={fullImageUrl}
                      alt="Complaint visual"
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Status Update Buttons */}
                <div className="grid grid-cols-3 gap-2 text-xs font-medium mb-3">
                  <button
                    onClick={() => updateProviderStatus(complaint._id, 'In Progress')}
                    disabled={complaint.providerStatus === 'In Progress'}
                    className={`px-3 py-2 rounded-lg transition ${
                      complaint.providerStatus === 'In Progress'
                        ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    🔄 In Progress
                  </button>
                  <button
                    onClick={() => updateProviderStatus(complaint._id, 'Resolved')}
                    disabled={complaint.providerStatus === 'Resolved'}
                    className={`px-3 py-2 rounded-lg transition ${
                      complaint.providerStatus === 'Resolved'
                        ? 'bg-green-100 text-green-600 cursor-not-allowed'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    ✅ Resolved
                  </button>
                  <button
                    onClick={() => updateProviderStatus(complaint._id, 'Rejected')}
                    disabled={complaint.providerStatus === 'Rejected'}
                    className={`px-3 py-2 rounded-lg transition ${
                      complaint.providerStatus === 'Rejected'
                        ? 'bg-red-100 text-red-600 cursor-not-allowed'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    ❌ Rejected
                  </button>
                </div>

                {/* Cost Input */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-700">Cost (₹):</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={costInputs[complaint._id] || ''}
                    onChange={(e) => handleCostChange(complaint._id, e.target.value)}
                  />
                  <button
                    onClick={() => updateProviderCost(complaint._id)}
                    className="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
