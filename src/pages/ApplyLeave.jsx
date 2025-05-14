import { useState } from "react";
import axios from "axios";
import { Calendar, User, FileText, Clock, Send } from "lucide-react";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setMessage("End date cannot be before start date");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/leave/apply",
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
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) return null;

    // Calculate the difference in days (including both start and end dates)
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };

  const leaveDuration = calculateDuration();

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Left Side - Leave Form */}
      <div className="bg-gradient-to-br from-white to-blue-50 shadow-2xl rounded-2xl border border-blue-100 p-8 transform transition-all hover:shadow-blue-200/50 hover:-translate-y-1">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-md">
            <Calendar className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold ml-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            Leave Application
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee ID */}
          <div className="relative group">
            <label className="block mb-2 font-medium text-gray-700">
              <div className="flex items-center">
                <User size={18} className="mr-2 text-blue-600" />
                Employee ID
              </div>
            </label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 bg-white shadow-sm"
              placeholder="Enter your employee ID"
              required
            />
          </div>

          {/* Leave Type */}
          <div className="relative group">
            <label className="block mb-2 font-medium text-gray-700">
              <div className="flex items-center">
                <FileText size={18} className="mr-2 text-blue-600" />
                Leave Type
              </div>
            </label>
            <div className="relative">
              <select
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm appearance-none"
                required
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Personal Leave">Personal Leave</option>
                <option value="Bereavement Leave">Bereavement Leave</option>
              </select>
              <div className="absolute inset-y-0 right-3 top-9 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-5">
            <div className="relative group">
              <label className="block mb-2 font-medium text-gray-700">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-600" />
                  Start Date
                </div>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
                required
              />
            </div>

            <div className="relative group">
              <label className="block mb-2 font-medium text-gray-700">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-600" />
                  End Date
                </div>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                min={
                  formData.startDate || new Date().toISOString().split("T")[0]
                }
                className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Duration */}
          {leaveDuration && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-inner">
              <p className="text-blue-800 font-medium flex items-center">
                <Clock size={16} className="mr-2" />
                Duration: {leaveDuration} day{leaveDuration !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="relative group">
            <label className="block mb-2 font-medium text-gray-700">
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-blue-600" />
                Reason for Leave
              </div>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
              rows="4"
              placeholder="Please explain the reason for your leave request"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-semibold shadow-lg flex items-center justify-center ${
              isLoading
                ? "opacity-80 cursor-not-allowed"
                : "hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Send size={18} className="mr-3" />
                Submit Application
              </>
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl text-center font-medium shadow-inner transition-all duration-300 ${
              message.includes("Error")
                ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200"
                : "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Right Side - Visual / Quote */}
      <div className="hidden md:flex flex-col justify-center items-center text-center p-6">
        <img
          src="https://illustrations.popsy.co/gray/work-from-home.svg"
          alt="Leave illustration"
          className="w-72 h-auto mb-6"
        />
        <h3 className="text-2xl font-semibold text-blue-800 mb-2">
          Take a Break!
        </h3>
        <p className="text-gray-600">
          Everyone deserves rest. Submit your leave and recharge yourself!
        </p>
      </div>
    </div>
  );
};

export default ApplyLeave;
