import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { dummyStudentData, complaintData } from '../assets/assets';
import SummaryCards from '../components/SummaryCards';
import ComplaintList from '../components/ComplaintList';

const UserDashboard = () => {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [complaints, setComplaints] = useState([]);


  useEffect(() => {
    const fetchUserDataAndComplaints = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user); // Assumes backend returns { name, email, role }


        // Fetch complaints for the user
        const complaintResponse = await fetch('/api/complaints/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!complaintResponse.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const complaintData = await complaintResponse.json();
        setComplaints(complaintData); // Assumes backend returns { complaints: [...] }
      } catch (error) {
        console.error('Error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndComplaints();
  },[]);
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredComplaints =
    filterStatus === 'All'
      ? complaints
      : complaints.filter((item) => item.status === filterStatus);

  const statusOptions = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

  return (
    <div className="px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-32 mt-32">
      <Title
        title={`🎓Welcome ${user?.name || 'User'}`}
        subtitle="Track and manage your submitted complaints"
      />

      <SummaryCards complaints={complaints} user={user}/>

      {/* Complaints Section */}
      <section className="mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
            📝 Your Complaints
          </h2>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="statusFilter"
              className="text-sm font-medium text-gray-700"
            >
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

              {/* Custom Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a1 1 0 01-.7-.3l-4-4a1 1 0 111.4-1.4L10 9.58l3.3-3.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-.7.3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <ComplaintList complaints={filteredComplaints} user={user}/>
      </section>
    </div>
  );
};

export default UserDashboard;
