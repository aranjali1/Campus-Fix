import React, { useState, useEffect } from 'react';
import Title from '../components/Title';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    adminLocation: '',
    detailedLocation: '',
    description: '',
    photos: [],
  });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch approved admin locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/admin/location');
        const data = await response.json();
        if (data.success) {
          setLocations(data.locations);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photos') {
      setFormData({ ...formData, photos: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('category', formData.category);
    form.append('description', formData.description);
    form.append('location', formData.adminLocation); // For backend routing
    form.append('detailedLocation', formData.detailedLocation); // For reference

    formData.photos.forEach((photo) => {
      form.append('images', photo);
    });

    try {
      setLoading(true);

      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      alert('Complaint submitted successfully!');
      handleReset();
    } catch (error) {
      console.log('Error submitting complaint:', error);
      alert(`Failed to submit complaint: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      category: '',
      adminLocation: '',
      detailedLocation: '',
      description: '',
      photos: [],
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-36 mb-20">
      <Title
        title="📩 Submit a Complaint"
        subtitle="Help us improve your Campus by reporting issues"
      />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="E.g., Fan not working in Room 203"
          />
        </div>

        {/* Admin Location Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location<span className="text-red-500"> *</span>
          </label>
          <select
            name="adminLocation"
            required
            value={formData.adminLocation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Location
            </option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Detailed Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detailed Location<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            name="detailedLocation"
            required
            value={formData.detailedLocation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="E.g., Room 203, Block A, 2nd Floor"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category<span className="text-red-500"> *</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description<span className="text-red-500"> *</span>
          </label>
          <textarea
            name="description"
            required
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe the issue in detail..."
          ></textarea>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Photos <span className="text-gray-400 text-xs">(optional, max 5)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            name="photos"
            multiple
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0f172a] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1e293b] transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="border border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaint;
