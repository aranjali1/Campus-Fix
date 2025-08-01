import React from "react";

function SummaryCards({ complaints, user }) {
  // ✅ Gracefully handle if complaints are not yet loaded or are invalid
  if (!Array.isArray(complaints)) {
    return (
      <div className="px-4 py-8 text-gray-500 text-sm">
        📊 Loading summary...
      </div>
    );
  }

  const summary = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inprogress: complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    rejected: complaints.filter(c => c.status === "rejected").length,
  };

  const stats = [
    { label: "Total Complaints", value: summary.total, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Pending", value: summary.pending, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "In Progress", value: summary.inprogress, color: "text-green-600", bg: "bg-green-50" },
    { label: "Resolved", value: summary.resolved, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Rejected", value: summary.rejected, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="mb-10 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${stat.bg}`}
          >
            <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SummaryCards;
