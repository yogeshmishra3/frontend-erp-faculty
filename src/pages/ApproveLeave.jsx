import { useState, useEffect } from "react";
import axios from "axios";

const ApproveLeave = () => {
  const [department, setDepartment] = useState("Computer Science");
  const [hodEmployeeId, setHodEmployeeId] = useState("EMP456");
  const [leaves, setLeaves] = useState([]);
  const [decision, setDecision] = useState({
    leaveId: "",
    decision: "Approved",
    comment: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(
          `https://backend-erp-faculty.vercel.app/api/leave/hod/${encodeURIComponent(
            department
          )}`
        );
        console.log("Fetched leaves:", response.data); // Debug log
        setLeaves(Array.isArray(response.data) ? response.data : []);
        setMessage("");
      } catch (error) {
        setMessage(error.response?.data?.message || "Error fetching leaves");
      }
    };
    if (department) fetchLeaves();
  }, [department]);

  const handleDecision = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://backend-erp-faculty.vercel.app/api/leave/hod/${decision.leaveId}`,
        {
          hodEmployeeId,
          decision: decision.decision,
          comment: decision.comment,
        }
      );
      setMessage(response.data.message);
      setDecision({ leaveId: "", decision: "Approved", comment: "" });
      const leavesResponse = await axios.get(
        `/api/leave/hod/${encodeURIComponent(department)}`
      );
      setLeaves(leavesResponse.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error processing decision");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">HOD Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Department:</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">HOD Employee ID:</label>
          <input
            type="text"
            value={hodEmployeeId}
            onChange={(e) => setHodEmployeeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Pending Leave Requests</h3>
      {Array.isArray(leaves) && leaves.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Employee ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Leave Type</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Reason</th>
                <th className="px-4 py-2 border">Days</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{leave.employeeId}</td>
                  <td className="px-4 py-2 border">{leave.name}</td>
                  <td className="px-4 py-2 border">{leave.leaveType}</td>
                  <td className="px-4 py-2 border">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{leave.reason}</td>
                  <td className="px-4 py-2 border">{leave.leaveDays}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() =>
                        setDecision({ ...decision, leaveId: leave._id })
                      }
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No pending requests.</p>
      )}

      {decision.leaveId && (
        <form onSubmit={handleDecision} className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Make Decision</h3>
          <div>
            <label className="block mb-1 font-medium">Decision:</label>
            <select
              value={decision.decision}
              onChange={(e) =>
                setDecision({ ...decision, decision: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="Approved">Approve</option>
              <option value="Rejected">Reject</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Comment:</label>
            <textarea
              value={decision.comment}
              onChange={(e) =>
                setDecision({ ...decision, comment: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Decision
          </button>
        </form>
      )}

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ApproveLeave;
