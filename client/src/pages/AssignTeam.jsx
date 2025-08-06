import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AssignTeam = () => {
  const { complaintId, category } = useParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5001/api/admin/providers?category=${category}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProviders(response.data);
      } catch (error) {
        console.error('Error fetching service providers:', error);
        alert('Failed to load service providers.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [category]);

  const assignProvider = async (providerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/admin/assign`,
        { complaintId, providerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Complaint successfully assigned!');
      navigate('/dashboard/admin');
    } catch (error) {
      console.error('Error assigning provider:', error);
      alert('❌ Failed to assign provider.');
    }
  };

  if (loading) {
    return <p className="mt-40 text-center text-lg text-[#334155] animate-pulse">Loading service providers...</p>;
  }

  return (
    <div className="mt-32 mb-30 px-6 sm:px-10 lg:px-20 xl:px-40 2xl:px-64">
      <h2 className="text-3xl font-bold text-[#0f172a] mb-8 text-center">
        🛠️ Assign Team for <span className="text-[#0f172a]">{category}</span>
      </h2>

      {providers.length === 0 ? (
        <p className="text-center text-[#334155] text-lg">No service providers available for this category.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div
              key={provider._id}
              className="bg-white/90 border border-gray-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-[#0f172a] mb-1">{provider.name}</h3>
                <p className="text-sm text-[#334155] mb-2">
                  📞 <span className="font-medium">Phone:</span> {provider.phone}
                </p>
                <p className="text-sm text-[#334155] mb-4">
                  🧰 <span className="font-medium">Expertise:</span>{" "}
                  {provider.categories?.join(", ") || "Not specified"}
                </p>
              </div>
              <button
                onClick={() => assignProvider(provider._id)}
                className="mt-auto bg-[#0f172a] hover:bg-[#1e293b] text-white py-2 px-4 rounded-full transition-all duration-150 text-sm font-medium"
              >
                ✅ Assign Provider
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignTeam;
