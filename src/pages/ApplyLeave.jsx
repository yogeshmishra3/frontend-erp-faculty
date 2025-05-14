import { useState } from "react";
import axios from "axios";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for date-only comparison

    if (formData.startDate) {
      const start = new Date(formData.startDate);
      if (start < today) {
        newErrors.startDate = "Start Date cannot be before today";
      }
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.date = "Start Date must be before End Date";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setMessage("");

    try {
      const response = await axios.post(
        "https://backend-erp-faculty.vercel.app/api/leave/apply",
        formData
      );
      setMessage(response.data.message);
      setFormData({
        employeeId: "",
        leaveType: "Sick Leave",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error applying for leave");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Apply for Leave
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Employee ID:</label>
          <input
            type="text"
            value={formData.employeeId}
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Leave Type:</label>
          <select
            value={formData.leaveType}
            onChange={(e) =>
              setFormData({ ...formData, leaveType: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          >
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Earned Leave">Earned Leave</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Start Date:</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className={`w-full px-3 py-2 border ${
              errors.startDate || errors.date
                ? "border-red-500"
                : "border-gray-300"
            } rounded`}
            required
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
          )}
          {errors.date && (
            <p className="mt-1 text-xs text-red-500">{errors.date}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date:</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className={`w-full px-3 py-2 border ${
              errors.date ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Reason:</label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ApplyLeave;
