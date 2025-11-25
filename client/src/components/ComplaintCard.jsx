import React from "react";

function ComplaintCard({ complaint }) {
  const {
    title,
    description,
    location,
    image = [],
    status,
    category,
    _id,
    createdAt,
  } = complaint;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Convert all images into full URLs
  const imageUrls = image.map((imgPath) => {
    const cleaned = imgPath.replace(/\\/g, "/");
    return `http://localhost:5001/${cleaned}`;
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg text-[#0f172a]">{title}</h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(
            status
          )}`}
        >
          {status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
        {description}
      </p>

      {/* Multiple Images Section */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Complaint image ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 flex flex-wrap gap-3 mb-2">
        <span>{location}</span>
        <span>{formattedDate}</span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs mt-1">
        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
          #{category}
        </span>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          ID: {_id?.slice(18, 24).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default ComplaintCard;
