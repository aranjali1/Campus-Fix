import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import axios from "axios";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Generic fetch function
  const fetchData = async (url, setter, keyName) => {
    try {
      setLoading(true);
      const { data } = await axios.get(url, getConfig());
      setter(data[keyName] || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setter([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAdmins = () =>
    fetchData(
      "http://localhost:5001/api/admin/pending",
      setPendingAdmins,
      "pendingAdmins"
    );

  const fetchApprovedAdmins = () =>
    fetchData(
      "http://localhost:5001/api/admin/approved",
      setApprovedAdmins,
      "approvedAdmins"
    );

  const fetchComplaints = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get(
      "http://localhost:5001/api/complaints/all",
      getConfig()
    );

    setComplaints(data.complaints || []);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    setComplaints([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (activeTab === "pending") fetchPendingAdmins();
    if (activeTab === "approved") fetchApprovedAdmins();
    if (activeTab === "complaints") fetchComplaints();
  }, [activeTab]);

  // Approve or reject pending admin
  const handleAdminAction = async (id, action) => {
    try {
      setProcessingId(id);
      const url = `http://localhost:5001/api/admin/${action}/${id}`;

      if (action === "approve") {
        await axios.put(url, {}, getConfig());
      } else {
        await axios.delete(url, getConfig());
      }

      setPendingAdmins((prev) => prev.filter((a) => a._id !== id));

      if (action === "approve") fetchApprovedAdmins();
    } catch (error) {
      console.error(`Failed to ${action} admin:`, error);
    } finally {
      setProcessingId(null);
    }
  };

  // Remove an already approved admin
  const handleRemoveApprovedAdmin = async (id) => {
    try {
      setProcessingId(id);

      await axios.delete(
        `http://localhost:5001/api/admin/remove/${id}`,
        getConfig()
      );

      setApprovedAdmins((prev) => prev.filter((admin) => admin._id !== id));
    } catch (error) {
      console.error("Failed to remove admin:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // ----------------------------------------------------------------
  // RENDER COMPLAINTS
  // ----------------------------------------------------------------
  const renderComplaints = () => {
  if (complaints.length === 0) {
    return <p className="text-sm text-gray-500">No complaints found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {complaints.map((c) => (
        <div
          key={c._id}
          className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition"
        >
          <p className="font-semibold text-gray-900 text-lg">{c.title}</p>

          {/* Complaint ID */}
          <p className="text-xs text-gray-500 mb-1">
            Complaint ID: <span className="font-mono">{c._id.slice(-6).toUpperCase()}</span>
          </p>

          <p className="text-sm text-gray-600">Location: {c.location}</p>
          <p className="text-sm text-gray-600">Category: {c.category}</p>

          <p
            className={`text-sm mt-2 ${
              c.status === "resolved"
                ? "text-green-600"
                : c.status === "in-progress"
                ? "text-blue-600"
                : "text-yellow-600"
            }`}
          >
            Status: {c.status}
          </p>
        </div>
      ))}
    </div>
  );
};


  // ----------------------------------------------------------------
  // RENDER PENDING ADMINS
  // ----------------------------------------------------------------
  const renderPendingAdmins = () => {
    if (pendingAdmins.length === 0) {
      return <p className="text-sm text-gray-500">No pending admin requests.</p>;
    }

    return pendingAdmins.map((admin) => (
      <div
        key={admin._id}
        className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition 
                   flex flex-col md:flex-row justify-between gap-6"
      >
        <div className="flex-1 space-y-2">
          <p className="text-gray-900 font-semibold text-xl">{admin.fullName}</p>
          <p className="text-gray-700 text-sm">Staff ID: {admin.staffId}</p>
          <p className="text-gray-700 text-sm">Email: {admin.email}</p>
          <p className="text-gray-700 text-sm">Location: {admin.location}</p>
          <p className="text-xs text-gray-500">
            Requested: {new Date(admin.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <p className="text-sm font-medium text-gray-700 mb-1">ID Proof:</p>

          {admin.idProof?.match(/\.(jpg|jpeg|png)$/i) ? (
            <>
              <img
                src={`http://localhost:5001/${admin.idProof}`}
                className="w-40 h-40 object-cover rounded border cursor-pointer"
                alt="ID Proof"
                onClick={() =>
                  window.open(`http://localhost:5001/${admin.idProof}`, "_blank")
                }
              />
              <button
                onClick={() =>
                  window.open(`http://localhost:5001/${admin.idProof}`, "_blank")
                }
                className="text-blue-600 underline text-sm mt-1"
              >
                View Full Image
              </button>
            </>
          ) : admin.idProof?.match(/\.pdf$/i) ? (
            <a
              href={`http://localhost:5001/${admin.idProof}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              Open PDF Document
            </a>
          ) : (
            <p className="text-gray-500 text-sm">No document</p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleAdminAction(admin._id, "approve")}
              disabled={processingId === admin._id}
              className={`px-4 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition 
                ${
                  processingId === admin._id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
            >
              {processingId === admin._id ? "Processing..." : "Approve"}
            </button>

            <button
              onClick={() => handleAdminAction(admin._id, "reject")}
              disabled={processingId === admin._id}
              className={`px-4 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition 
                ${
                  processingId === admin._id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    ));
  };

  // ----------------------------------------------------------------
  // RENDER APPROVED ADMINS
  // ----------------------------------------------------------------
  const renderApprovedAdmins = () => {
    if (approvedAdmins.length === 0) {
      return <p className="text-sm text-gray-500">No approved admins yet.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {approvedAdmins.map((admin) => (
          <div
            key={admin._id}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition
                       flex flex-col justify-between aspect-square"
          >
            <div className="space-y-1">
              <p className="font-semibold text-gray-900 text-lg">{admin.fullName}</p>
              <p className="text-sm text-gray-700">Staff ID: {admin.staffId}</p>
              <p className="text-sm text-gray-700">Email: {admin.email}</p>
              <p className="text-sm text-gray-500">Location: {admin.location}</p>
            </div>

            <button
              onClick={() => handleRemoveApprovedAdmin(admin._id)}
              disabled={processingId === admin._id}
              className={`px-4 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition 
                ${
                  processingId === admin._id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
            >
              {processingId === admin._id ? "Removing..." : "Remove Admin"}
            </button>
          </div>
        ))}
      </div>
    );
  };

  

  // ----------------------------------------------------------------
  // MAIN UI
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen px-4 py-6 mt-14 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <Title
          title="Super Admin Dashboard"
          subtitle="Manage admin approvals and monitor campus complaints"
        />

        <div className="flex flex-wrap gap-3">
          {[
            { label: "Pending Requests", key: "pending" },
            { label: "Approved Admins", key: "approved" },
            { label: "All Complaints", key: "complaints" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-[#0f172a] text-white shadow-md"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-900 rounded-full"></div>
            </div>
          )}

          {!loading && activeTab === "pending" && renderPendingAdmins()}
          {!loading && activeTab === "approved" && renderApprovedAdmins()}
          {!loading && activeTab === "complaints" && renderComplaints()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
