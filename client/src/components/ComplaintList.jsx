import React from 'react';
import ComplaintCard from './ComplaintCard';
import AdminCards from './AdminCards'; // this should be the AdminCard (singular) component
import axios from 'axios';

const ComplaintList = ({ complaints, user }) => {
  if (!complaints || complaints.length === 0) {
    return (
      <div className="mt-20 text-center flex flex-col items-center gap-3 px-4 mb-30">
        <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
          <span className="text-4xl text-gray-400">📭</span>
        </div>
        <h2 className="text-xl font-medium text-gray-700">No Complaints Yet</h2>
        <p className="text-sm text-gray-500 max-w-md">
          Looks like there are no complaints to show right now. You can try a different filter or go ahead and submit a new one.
        </p>
      </div>
    );
  }

  const handleStatusChange = async (id, newStatus) => {
    try{
      const token = localStorage.getItem('token');
      const response=await axios.put(`/api/complaints/${id}/status`,{
        status: newStatus,
      },
    {headers: { Authorization: `Bearer ${token}` } });
    }catch(error) {
      console.error(`Error updating complaint ${id} status:`, error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleAssignTeam = (id) => {
    // TODO: Open modal or directly assign a team
    console.log(`Assigning team for complaint ${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 mb-16">
      {complaints.map((complaint) => {
        const isAdmin = user?.role === 'admin';
        const CardComponent = isAdmin ? AdminCards : ComplaintCard;

        return (
          <CardComponent
            key={complaint.complaintId || complaint._id}
            complaint={complaint}
            {...(isAdmin && {
              onStatusChange: handleStatusChange,
              onAssignTeam: handleAssignTeam,
            })}
          />
        );
      })}
    </div>
  );
};

export default ComplaintList;
