import React, { useEffect, useState } from "react";
import axios from "axios";

const NonTeachingAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/announcements/non_teaching_staff`
      );
      setAnnouncements(res.data.reverse()); // latest first
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Teaching Role Announcements</h1>
      {loading ? (
        <p>Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p>No announcements available for teaching roles.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="p-4 border border-gray-300 rounded shadow"
            >
              <h2 className="text-lg font-semibold">{announcement.title}</h2>
              <p className="text-gray-700">{announcement.description}</p>
              <div className="text-sm text-gray-500 mt-2">
                Tag: {announcement.tag} | Ends:{" "}
                {new Date(announcement.endDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NonTeachingAnnouncements;
