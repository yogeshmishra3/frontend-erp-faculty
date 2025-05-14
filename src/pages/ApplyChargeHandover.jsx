import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ApplyChargeHandoverForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    designation: "",
    department: "",
    reportingManager: "",
    handoverStartDate: "",
    handoverEndDate: "",
    handoverReason: "",
    receiverName: "",
    receiverDesignation: "",
    documents: [],
    assets: [],
    pendingTasks: [],
    remarks: "",
    status: "pending",
  });
  const [tempItem, setTempItem] = useState("");
  const [itemType, setItemType] = useState("documents");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    if (tempItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        [itemType]: [...prev[itemType], tempItem.trim()],
      }));
      setTempItem("");
    }
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      [itemType]: prev[itemType].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (
        !formData.employeeName ||
        !formData.employeeId ||
        !formData.designation ||
        !formData.department ||
        !formData.reportingManager ||
        !formData.handoverStartDate ||
        !formData.handoverEndDate ||
        !formData.handoverReason ||
        !formData.receiverName ||
        !formData.receiverDesignation
      ) {
        throw new Error("Please fill all required fields");
      }

      // Validate dates
      const startDate = new Date(formData.handoverStartDate);
      const endDate = new Date(formData.handoverEndDate);
      if (startDate > endDate) {
        throw new Error("End date must be after start date");
      }

      // Prepare data for API
      const payload = {
        ...formData,
        handoverStartDate: startDate,
        handoverEndDate: endDate,
      };

      await axios.post(
        "https://backend-erp-faculty.vercel.app/api/tasks",
        payload
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/tasks"); // Redirect to tasks list after submission
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
            Charge Handover Form
          </h1>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Form submitted successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Details Section */}
            <section className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">
                🔸 Basic Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name / ID
                  </label>
                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      type="text"
                      name="employeeName"
                      placeholder="Employee Name"
                      value={formData.employeeName}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded-md w-full"
                      required
                    />
                    <input
                      type="text"
                      name="employeeId"
                      placeholder="Employee ID"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className="px-3 py-2 border rounded-md w-full md:w-1/3"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation / Department
                  </label>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="w-full">
                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="px-3 py-2 border rounded-md w-full"
                        required
                      >
                        <option value="">Select Designation</option>
                        <option value="Principal">Principal</option>
                        <option value="Vice Principal">Vice Principal</option>
                        <option value="Head of Department (HOD)">
                          Head of Department (HOD)
                        </option>
                        <option value="Assistant Professor">
                          Assistant Professor
                        </option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Lab Assistant">Lab Assistant</option>
                        <option value="Clerk">Clerk</option>
                        <option value="Office Assistant">
                          Office Assistant
                        </option>
                        <option value="System Administrator">
                          System Administrator
                        </option>
                        <option value="Peon">Peon</option>
                        <option value="Security Guard">Security Guard</option>
                      </select>
                    </div>
                    <div className="w-full">
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="px-3 py-2 border rounded-md w-full"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Computer Science Engineering (CSE)">
                          Computer Science Engineering (CSE)
                        </option>
                        <option value="Electrical Engineering (EE)">
                          Electrical Engineering (EE)
                        </option>
                        <option value="Civil Engineering">
                          Civil Engineering
                        </option>
                        <option value="Mechanical Engineering">
                          Mechanical Engineering
                        </option>
                        <option value="Electronics and Communication (ECE)">
                          Electronics and Communication (ECE)
                        </option>
                        <option value="Information Technology (IT)">
                          Information Technology (IT)
                        </option>
                        <option value="Administration">Administration</option>
                        <option value="Accounts">Accounts</option>
                        <option value="Library">Library</option>
                        <option value="Examination Cell">
                          Examination Cell
                        </option>
                        <option value="Hostel Department">
                          Hostel Department
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporting Manager / Supervisor
                  </label>
                  <input
                    type="text"
                    name="reportingManager"
                    placeholder="Reporting Manager Name"
                    value={formData.reportingManager}
                    onChange={handleChange}
                    className="px-3 py-2 border rounded-md w-full"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Charge Handover Details */}
            <section className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">
                🔸 Charge Handover Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Handover
                  </label>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="w-full">
                      <div className="text-xs text-gray-500 mb-1">
                        Start Date
                      </div>
                      <input
                        type="date"
                        name="handoverStartDate"
                        value={formData.handoverStartDate}
                        onChange={handleChange}
                        className="px-3 py-2 border rounded-md w-full"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <div className="text-xs text-gray-500 mb-1">End Date</div>
                      <input
                        type="date"
                        name="handoverEndDate"
                        value={formData.handoverEndDate}
                        onChange={handleChange}
                        className="px-3 py-2 border rounded-md w-full"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Handover
                  </label>
                  <select
                    name="handoverReason"
                    value={formData.handoverReason}
                    onChange={handleChange}
                    className="px-3 py-2 border rounded-md w-full"
                    required
                  >
                    <option value="">Select Reason</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Resignation">Resignation</option>
                    <option value="Leave">Leave</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name of Person Receiving Charge
                  </label>
                  <input
                    type="text"
                    name="receiverName"
                    placeholder="Receiver's Name"
                    value={formData.receiverName}
                    onChange={handleChange}
                    className="px-3 py-2 border rounded-md w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation of Receiver
                  </label>
                  <select
                    name="receiverDesignation"
                    value={formData.receiverDesignation}
                    onChange={handleChange}
                    className="px-3 py-2 border rounded-md w-full"
                    required
                  >
                    <option value="">Select Designation</option>
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Head of Department (HOD)">
                      Head of Department (HOD)
                    </option>
                    <option value="Assistant Professor">
                      Assistant Professor
                    </option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                    <option value="Clerk">Clerk</option>
                    <option value="Office Assistant">Office Assistant</option>
                    <option value="System Administrator">
                      System Administrator
                    </option>
                    <option value="Peon">Peon</option>
                    <option value="Security Guard">Security Guard</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Assets / Responsibilities Section */}
            <section className="border-b pb-4">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">
                🔸 Assets / Responsibilities Being Handed Over
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Items to Handover
                  </label>
                  <div className="flex flex-col md:flex-row gap-2 mb-2">
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="documents">Documents</option>
                      <option value="assets">Assets</option>
                      <option value="pendingTasks">Pending Tasks</option>
                    </select>
                    <input
                      type="text"
                      value={tempItem}
                      onChange={(e) => setTempItem(e.target.value)}
                      placeholder={`Add ${itemType}`}
                      className="px-3 py-2 border rounded-md flex-grow"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Add
                    </button>
                  </div>

                  {formData[itemType].length > 0 && (
                    <div className="border rounded-md p-2">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {itemType.charAt(0).toUpperCase() + itemType.slice(1)} (
                        {formData[itemType].length})
                      </h4>
                      <ul className="space-y-1">
                        {formData[itemType].map((item, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Remarks Section */}
            <section>
              <h2 className="text-xl font-semibold text-blue-700 mb-3">
                🔸Remarks [Optional]
              </h2>
              <div>
                <textarea
                  name="remarks"
                  placeholder="Any special notes or observations"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  className="px-3 py-2 border rounded-md w-full"
                ></textarea>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 md:px-8 rounded-md shadow-sm transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Form"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
