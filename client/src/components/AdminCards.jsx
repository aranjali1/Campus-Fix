import React, { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from "./PaymentForm";

function AdminCard({ complaint, onStatusChange, onAssignTeam }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    title,
    description,
    location,
    image,
    status,
    category,
    _id,
    createdAt,
    user,
    detailedLocation,
    assignedToProvider,
    providerCost,
    paymentStatus,
  } = complaint;

  const imaged = image?.[0]?.replace(/\\/g, "/");
  const imageUrl = imaged ? `http://localhost:5001/${imaged}` : null;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = (newStatus) => {
    onStatusChange && onStatusChange(_id, newStatus);
  };

  const handlePaymentUpdate = async () => {
    setIsProcessingPayment(true);
    try {
      const body = {
        complaintId: _id,
        amount: providerCost,
        description: `Payment for complaint: ${title}`,
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      let data = {};
      let isJson = response.headers.get('content-type')?.includes('application/json');
      if (isJson) {
        try {
          data = await response.json();
        } catch (e) {
          // If response is not JSON, keep data as empty object
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Server error');
      }

      if (!data.clientSecret) {
        throw new Error('Payment initialization failed: Missing client secret.');
      }
      setClientSecret(data.clientSecret);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      alert(`Payment initialization failed. ${error.message || 'Please try again.'}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg text-[#0f172a]">{title}</h3>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(status)}`}>{status}</span>
          {assignedToProvider && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Provider: {complaint.providerStatus || 'Pending'}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{description}</p>

      {imageUrl && (
        <img src={imageUrl} alt="Complaint visual" className="w-full h-40 object-cover rounded-md mb-3" />
      )}

      <div className="text-xs text-gray-500 flex flex-wrap gap-3 mb-2">
        <span>📍 {location}-{detailedLocation}</span>
        <span>📅 {formattedDate}</span>
        <span>🙋 {user?.name}</span>
        <span>✉️ {user?.email}</span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs mb-4">
        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">#{category}</span>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">ID: {_id?.slice(18, 24).toUpperCase()}</span>
        {assignedToProvider && providerCost && (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Cost: ₹{providerCost}</span>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3 text-sm font-medium">
          <button onClick={() => handleStatusUpdate("in-progress")} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 shadow-sm hover:ring-1 ring-blue-200 transition">🔄 In Progress</button>
          <button onClick={() => handleStatusUpdate("resolved")} className="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 shadow-sm hover:ring-1 ring-green-200 transition">✅ Resolved</button>
          <button onClick={() => handleStatusUpdate("rejected")} className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 shadow-sm hover:ring-1 ring-red-200 transition">❌ Rejected</button>
          <button onClick={() => onAssignTeam && onAssignTeam(_id, category)} disabled={assignedToProvider} className={`px-4 py-2 rounded-lg shadow-sm transition ${assignedToProvider ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm hover:ring-1 ring-indigo-200"}`}>{assignedToProvider ? "✅ Assigned" : "🛠️ Assign Team"}</button>
          {assignedToProvider && providerCost && (
            <button onClick={handlePaymentUpdate} disabled={paymentStatus === "Paid"} className={`px-4 py-2 rounded-lg shadow-sm transition ${paymentStatus === "Paid" ? "bg-green-100 text-green-600 cursor-not-allowed" : "bg-green-50 text-green-700 hover:bg-green-100 shadow-sm hover:ring-1 ring-green-200"}`}>💰 Make Payment</button>
          )}
        </div>
      </div>

      {showPaymentModal && clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Payment</h3>
            <p className="text-sm text-gray-600 mb-4">Please complete the payment of ₹{providerCost} below:</p>
            <PaymentForm clientSecret={clientSecret} onPaymentSuccess={() => { setShowPaymentModal(false); window.location.reload(); }} />
            <button onClick={() => setShowPaymentModal(false)} className="mt-4 text-sm text-gray-500 underline">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCard;
