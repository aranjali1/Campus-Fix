import React, { useState, useEffect, useRef } from "react";
import Title from "../components/Title";

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    adminLocation: "",
    detailedLocation: "",
    description: "",
    photos: [],
  });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load admin locations
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/admin/location");
        const data = await response.json();
        if (data.success) setLocations(data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();

    // Load draft complaint data if present
    const saved = localStorage.getItem("draftComplaint");
    if (saved) {
      const { description } = JSON.parse(saved);

      const uploaded = window.uploadBuffer || [];

      setFormData((prev) => ({
        ...prev,
        description: description || "",
        photos: uploaded,
      }));

      localStorage.removeItem("draftComplaint");
      delete window.uploadBuffer;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photos") {
      setFormData({ ...formData, photos: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("location", formData.adminLocation);
    form.append("detailedLocation", formData.detailedLocation);

    formData.photos.forEach((photo) => {
      form.append("images", photo);
    });

    try {
      setLoading(true);

      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed");

      alert("Complaint submitted successfully");
      handleReset();
    } catch (error) {
      alert("Failed to submit complaint: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      category: "",
      adminLocation: "",
      detailedLocation: "",
      description: "",
      photos: [],
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-36 mb-20">
      <Title
        title="Submit a Complaint"
        subtitle="Help us improve your campus by reporting issues"
      />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">

        <div>
          <label className="block text-sm mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="Fan not working in Room 203"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Location *</label>
          <select
            name="adminLocation"
            value={formData.adminLocation}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
          >
            <option value="" disabled>
              Select Location
            </option>
            {locations.map((loc, i) => (
              <option key={i} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Detailed Location *</label>
          <input
            type="text"
            name="detailedLocation"
            value={formData.detailedLocation}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            placeholder="Room 203, Block A"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Electricity">Electricity</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Furniture">Furniture</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            required
            rows="4"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Images (optional)</label>
          <input
            type="file"
            name="photos"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />

          {/* Image Preview */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {formData.photos.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0f172a] text-white px-6 py-2 rounded-lg hover:bg-[#1e293b]"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="border border-gray-400 px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaint;
