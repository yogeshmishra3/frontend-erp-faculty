import React, { useState, useEffect } from "react";
import axios from "axios";

const AnnouncementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    endDate: "",
    visibleTo: [],
  });

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const roles = ["student", "teaching_staff", "non_teaching_staff", "hod"];

  // STATIC ROLE for now - make dynamic in production
  const currentDashboard = "hod";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      visibleTo: checked
        ? [...prev.visibleTo, value]
        : prev.visibleTo.filter((role) => role !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://backend-erp-faculty.vercel.app/api/announcements",
        formData
      );
      alert("Announcement Created Successfully");
      setFormData({
        title: "",
        description: "",
        tag: "",
        endDate: "",
        visibleTo: [],
      });
      fetchAnnouncements(); // refresh after posting
    } catch (err) {
      console.error(err);
      alert("Failed to create announcement");
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(
        `https://backend-erp-faculty.vercel.app/api/announcements/${currentDashboard}`
      );
      setAnnouncements(res.data); // Already sorted from backend
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border p-2 rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Tag</label>
          <input
            type="text"
            name="tag"
            className="w-full border p-2 rounded"
            value={formData.tag}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            className="w-full border p-2 rounded"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Visible To</label>
          <div className="flex flex-wrap gap-3">
            {roles.map((role) => (
              <label key={role} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={role}
                  checked={formData.visibleTo.includes(role)}
                  onChange={handleCheckboxChange}
                />
                {role.replace("_", " ")}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-2">Recent Announcements</h2>
      {loading ? (
        <p>Loading...</p>
      ) : announcements.length === 0 ? (
        <p>No announcements found.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="p-4 border rounded shadow-sm bg-gray-50"
            >
              <h3 className="text-lg font-semibold">{announcement.title}</h3>
              <p className="text-sm text-gray-700">
                {announcement.description}
              </p>
              <div className="text-xs text-gray-500 mt-2">
                <span>Tag: {announcement.tag}</span> |{" "}
                <span>Visible To: {announcement.visibleTo.join(", ")}</span> |{" "}
                <span>
                  Expires: {new Date(announcement.endDate).toDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementForm;
