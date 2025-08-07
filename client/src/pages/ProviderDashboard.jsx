import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VITE_SERVER_URL from '../utils/api';

const ProviderDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [costInputs, setCostInputs] = useState({});
  const [hasStripeAccount, setHasStripeAccount] = useState(false);

  useEffect(() => {
    const fetchProviderData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch complaints
        const complaintRes = await axios.get(`${VITE_SERVER_URL}/api/provider/assigned`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const complaintsData = Array.isArray(complaintRes.data.complaints) ? complaintRes.data.complaints : [];
        setComplaints(complaintsData);
        
        // Initialize cost inputs
        const initialCosts = {};
        complaintsData.forEach(complaint => {
          if (complaint.providerCost !== undefined && complaint.providerCost !== null) {
            initialCosts[complaint._id] = complaint.providerCost.toString();
          }
        });
        setCostInputs(initialCosts);

        // Fetch provider profile
        const profileRes = await axios.get(`${VITE_SERVER_URL}/api/provider/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setProvider(profileRes.data);
        setHasStripeAccount(!!profileRes.data.stripeAccountId);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, []);

  const updateProviderStatus = async (complaintId, providerStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${VITE_SERVER_URL}/api/provider/update-status`,
        { complaintId, providerStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints(prev =>
        prev.map(comp => (comp._id === complaintId ? { ...comp, providerStatus } : comp))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCostChange = (complaintId, value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCostInputs(prev => ({
        ...prev,
        [complaintId]: value
      }));
    }
  };

  const updateProviderCost = async (complaintId) => {
    const token = localStorage.getItem('token');
    const providerCost = costInputs[complaintId];
    
    if (!providerCost || isNaN(providerCost)) {
      alert('Please enter a valid cost amount');
      return;
    }

    try {
      const response = await axios.put(
        `${VITE_SERVER_URL}/api/provider/update-cost`,
        { complaintId, providerCost: parseFloat(providerCost) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setComplaints(prev =>
          prev.map(comp => 
            comp._id === complaintId 
              ? { ...comp, providerCost: parseFloat(providerCost) } 
              : comp
          )
        );
        alert('Cost updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update cost');
      }
    } catch (err) {
      console.error('Error updating cost:', err);
      alert(err.message || 'Failed to update cost. Please try again.');
    }
  };

  const onboardStripe = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${VITE_SERVER_URL}/api/provider/create-stripe-account`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Stripe onboarding failed:', err);
      alert('Stripe onboarding failed. Please try again.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="mt-20 p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#0f172a]">
        🛠️ My Assigned Complaints
      </h2>

      {/* Fixed Stripe button rendering */}
      {!loading && provider && !hasStripeAccount && (
        <div className="text-center mb-8">
          <button
            onClick={onboardStripe}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            💳 Setup Stripe Payment
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-lg text-[#334155] animate-pulse">Loading complaints...</p>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
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
            const fullImageUrl = imageUrl ? `${VITE_SERVER_URL}/${imageUrl}` : null;
            
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

                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-700">Cost (₹):</label>
                  <input
                    type="text"
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