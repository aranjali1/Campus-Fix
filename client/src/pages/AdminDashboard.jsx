import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import SummaryCards from '../components/SummaryCards';
import ComplaintList from '../components/ComplaintList';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const user = { role: 'admin' };

  // Map display names to actual status values used in backend
  const statusMap = {
    All: '',
    Pending: 'pending',
    'In Progress': 'in-progress',
    Resolved: 'resolved',
    Rejected: 'rejected',
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/admin/complaints', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        setComplaints(data);
        console.log('Fetched complaints:', data);
        console.log("status:",data.map(complaint => complaint.status));
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints =
    filterStatus === 'All'
      ? complaints
      : complaints.filter(
          (item) =>
            item.status?.toLowerCase().trim() ===
            statusMap[filterStatus]
        );

  const statusOptions = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

  const navigate = useNavigate();
  const handleAssignTeam = (complaintId, category) => {
    navigate(`/admin/assign/${complaintId}/${category}`);
  };

  return (
    <div className='px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-32 mt-32'>
      <Title title="🛠️Admin Dashboard" subtitle="Track, Verify, and Respond to Student Complaints" />

      {/* SummaryCards */}
      <SummaryCards complaints={complaints} user={user} />

      {/* Filter Dropdown */}
      <div className="flex items-center gap-2 mb-6">
        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
          <span className="inline-block text-2xl mr-1">🎯</span>Filter by Status:
        </label>

        <div className="relative">
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none text-sm text-gray-700 border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ComplaintList */}
      <ComplaintList
       complaints={filteredComplaints}
        user={user}
        onAssignTeam={handleAssignTeam}
         />
    </div>
  );
};

export default AdminDashboard;
