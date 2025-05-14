// import { useState, useEffect } from "react";
// import axios from "axios";

// export const SalaryRecords = () => {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [viewMode, setViewMode] = useState(""); // "" for list, "details" for details view, "payment" for payment view
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [detailError, setDetailError] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editFormData, setEditFormData] = useState({});
//   const [updateError, setUpdateError] = useState("");
//   const [updateSuccess, setUpdateSuccess] = useState("");
//   const [validationErrors, setValidationErrors] = useState({});

//   // Fetch all records for the list view
//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         const response = await axios.get("https://backend-erp-faculty.vercel.app/api/salary");
//         setRecords(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch records");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecords();
//   }, []);

//   // Fetch individual record when selectedEmployeeId changes
//   useEffect(() => {
//     if (selectedEmployeeId) {
//       const fetchRecord = async () => {
//         setDetailLoading(true);
//         try {
//           const response = await axios.get(
//             `https://backend-erp-faculty.vercel.app/api/salary/${selectedEmployeeId}`
//           );
//           const record = {
//             ...response.data,
//             leaveStartDate: response.data.leaveStartDate || "",
//             leaveEndDate: response.data.leaveEndDate || "",
//           };
//           setSelectedRecord(record);
//           setEditFormData(record); // Pre-fill edit form with employee data
//         } catch (err) {
//           setDetailError(
//             err.response?.data?.message || "Failed to fetch record"
//           );
//         } finally {
//           setDetailLoading(false);
//         }
//       };

//       fetchRecord();
//     }
//   }, [selectedEmployeeId]);

//   const validateForm = () => {
//     const newErrors = {};
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Reset time to midnight for date-only comparison

//     if (editFormData.leaveStartDate) {
//       const start = new Date(editFormData.leaveStartDate);
//       if (start < today) {
//         newErrors.leaveStartDate = "Leave Start Date cannot be before today";
//       }
//     }

//     if (editFormData.leaveStartDate && editFormData.leaveEndDate) {
//       const start = new Date(editFormData.leaveStartDate);
//       const end = new Date(editFormData.leaveEndDate);
//       if (start >= end) {
//         newErrors.date = "Leave Start Date must be before End Date";
//       }
//     }

//     return newErrors;
//   };

//   const handleViewDetails = (employeeId) => {
//     setSelectedEmployeeId(employeeId);
//     setViewMode("details");
//     setIsEditing(false);
//     setUpdateError("");
//     setUpdateSuccess("");
//     setValidationErrors({});
//   };

//   const handleViewPayment = (employeeId) => {
//     setSelectedEmployeeId(employeeId);
//     setViewMode("payment");
//     setIsEditing(false);
//     setUpdateError("");
//     setUpdateSuccess("");
//     setValidationErrors({});
//   };

//   const handleBackToList = () => {
//     setSelectedEmployeeId("");
//     setSelectedRecord(null);
//     setViewMode("");
//     setDetailError("");
//     setIsEditing(false);
//     setUpdateError("");
//     setUpdateSuccess("");
//     setValidationErrors({});
//   };

//   const handleEditRecord = (employeeId) => {
//     setSelectedEmployeeId(employeeId);
//     setViewMode("details");
//     setIsEditing(true);
//     setUpdateError("");
//     setUpdateSuccess("");
//     setValidationErrors({});
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setEditFormData(selectedRecord); // Reset form data to original
//     setUpdateError("");
//     setValidationErrors({});
//   };

//   const handleEditFormChange = (e) => {
//     const { name, value } = e.target;
//     let processedValue = value;

//     // Convert numeric values to numbers
//     if (
//       [
//         "basicSalary",
//         "hra",
//         "da",
//         "bonus",
//         "overtimePay",
//         "taxDeduction",
//         "pfDeduction",
//         "otherDeductions",
//         "workingHours",
//         "leaveDeduction",
//       ].includes(name)
//     ) {
//       processedValue = value === "" ? 0 : parseFloat(value);
//     }

//     setEditFormData({
//       ...editFormData,
//       [name]: processedValue,
//     });
//   };

//   const handleSaveEdit = async () => {
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setValidationErrors(formErrors);
//       return;
//     }

//     try {
//       setUpdateError("");
//       setUpdateSuccess("");
//       setValidationErrors({});

//       const response = await axios.put(
//         `https://backend-erp-faculty.vercel.app/api/salary/${selectedEmployeeId}`,
//         editFormData
//       );

//       // Update both the selected record and the record in the list
//       setSelectedRecord(response.data.record);
//       setRecords(
//         records.map((record) =>
//           record.employeeId === selectedEmployeeId
//             ? response.data.record
//             : record
//         )
//       );

//       setIsEditing(false);
//       setUpdateSuccess("Record updated successfully!");

//       // Auto-hide success message after 3 seconds
//       setTimeout(() => {
//         setUpdateSuccess("");
//       }, 3000);
//     } catch (err) {
//       setUpdateError(err.response?.data?.message || "Failed to update record");
//     }
//   };

//   const filteredRecords = Array.isArray(records)
//     ? records.filter(
//         (record) =>
//           record.employeeId?.includes(searchTerm) ||
//           record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           record.department?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];

//   // Payment Details View
//   const renderPaymentDetails = () => {
//     if (detailLoading) {
//       return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         </div>
//       );
//     }

//     if (detailError) {
//       return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//           <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg max-w-md shadow-sm">
//             <p className="font-semibold">Error</p>
//             <p>{detailError}</p>
//           </div>
//         </div>
//       );
//     }

//     if (!selectedRecord) return null;

//     return (
//       <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
//                     <span className="text-gray-600 font-semibold">Logo</span>
//                   </div>
//                   <div>
//                     <h1 className="text-2xl font-bold text-white">
//                       Payment Details
//                     </h1>
//                     <p className="text-indigo-100 text-sm">
//                       Employee ID: {selectedRecord.employeeId}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Navigation Buttons */}
//               <div className="flex justify-between items-center">
//                 <button
//                   onClick={handleBackToList}
//                   className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-200"
//                 >
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                   Back to Records
//                 </button>
//                 <button
//                   onClick={() => {
//                     setViewMode("details");
//                     setIsEditing(false);
//                   }}
//                   className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-sm"
//                 >
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     />
//                   </svg>
//                   View Full Details
//                 </button>
//               </div>

//               {/* Employee Information */}
//               <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                   Employee Information
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Name</p>
//                     <p className="text-gray-900">{selectedRecord.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Department
//                     </p>
//                     <p className="text-gray-900">{selectedRecord.department}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Designation
//                     </p>
//                     <p className="text-gray-900">
//                       {selectedRecord.designation}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Employee Type
//                     </p>
//                     <p className="text-gray-900 capitalize">
//                       {selectedRecord.type}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                   Payment Information
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Payment Date
//                     </p>
//                     <p className="text-gray-900">
//                       {new Date(
//                         selectedRecord.paymentDate
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Payment Method
//                     </p>
//                     <p className="text-gray-900">
//                       {selectedRecord.paymentMethod}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Bank Account
//                     </p>
//                     <p className="text-gray-900">
//                       {selectedRecord.bankAccount || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Status</p>
//                     <p className="text-gray-900">{selectedRecord.status}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Salary Summary */}
//               <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                   Salary Summary
//                 </h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Category
//                         </th>
//                         <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Amount (₹)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       <tr>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           Gross Salary
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900 text-right">
//                           ₹{selectedRecord.grossSalary.toFixed(2)}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           Tax Deduction
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900 text-right">
//                           ₹{selectedRecord.taxDeduction.toFixed(2)}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           PF Deduction
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900 text-right">
//                           ₹{selectedRecord.pfDeduction.toFixed(2)}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           Other Deductions
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900 text-right">
//                           ₹{selectedRecord.otherDeductions.toFixed(2)}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           Leave Deduction
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900 text-right">
//                           ₹{selectedRecord.leaveDeduction.toFixed(2)}
//                         </td>
//                       </tr>
//                       <tr className="bg-gray-50">
//                         <td className="px-4 py-2 text-sm font-medium text-gray-900">
//                           Total Deductions
//                         </td>
//                         <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
//                           ₹
//                           {(
//                             selectedRecord.taxDeduction +
//                             selectedRecord.pfDeduction +
//                             selectedRecord.otherDeductions +
//                             selectedRecord.leaveDeduction
//                           ).toFixed(2)}
//                         </td>
//                       </tr>
//                       <tr>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           Net Rupees
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900 text-right">
//                           ₹{selectedRecord.netSalary.toFixed(2)}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Edit Form View
//   const renderEditForm = () => {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         <button
//           onClick={handleCancelEdit}
//           className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition duration-200"
//         >
//           <svg
//             className="w-5 h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//           Back to record details
//         </button>

//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
//             <h1 className="text-2xl font-bold text-white">
//               Edit Salary Record
//             </h1>
//             <p className="text-indigo-100">
//               Employee ID: {editFormData.employeeId}
//             </p>
//           </div>

//           {updateError && (
//             <div className="m-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
//               <p className="font-semibold">Error</p>
//               <p>{updateError}</p>
//             </div>
//           )}

//           <form className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Employee Information */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Employee Information
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={editFormData.name || ""}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Department
//                     </label>
//                     <input
//                       type="text"
//                       name="department"
//                       value={editFormData.department || ""}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Designation
//                     </label>
//                     <input
//                       type="text"
//                       name="designation"
//                       value={editFormData.designation || ""}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Employee Type
//                     </label>
//                     <select
//                       name="type"
//                       value={editFormData.type || "teaching"}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                       <option value="teaching">Teaching</option>
//                       <option value="non-teaching">Non-Teaching</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Working Hours
//                     </label>
//                     <input
//                       type="number"
//                       name="workingHours"
//                       value={editFormData.workingHours || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Salary Information */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Salary Information
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Basic Salary (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="basicSalary"
//                       value={editFormData.basicSalary || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       HRA (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="hra"
//                       value={editFormData.hra || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       DA (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="da"
//                       value={editFormData.da || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Bonus (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="bonus"
//                       value={editFormData.bonus || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Overtime Pay (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="overtimePay"
//                       value={editFormData.overtimePay || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Deductions */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Deductions
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Tax Deduction (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="taxDeduction"
//                       value={editFormData.taxDeduction || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       PF Deduction (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="pfDeduction"
//                       value={editFormData.pfDeduction || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Other Deductions (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="otherDeductions"
//                       value={editFormData.otherDeductions || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Leave Deduction (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="leaveDeduction"
//                       value={editFormData.leaveDeduction || 0}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Leave Information */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Leave Information
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Leave Start Date
//                     </label>
//                     <input
//                       type="date"
//                       name="leaveStartDate"
//                       value={editFormData.leaveStartDate || ""}
//                       onChange={handleEditFormChange}
//                       className={`w-full p-2 border ${
//                         validationErrors.leaveStartDate || validationErrors.date
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
//                     />
//                     {validationErrors.leaveStartDate && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {validationErrors.leaveStartDate}
//                       </p>
//                     )}
//                     {validationErrors.date && (
//                       <p className="mt-1 text-xs text-red-500">
//                         {validationErrors.date}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Leave End Date
//                     </label>
//                     <input
//                       type="date"
//                       name="leaveEndDate"
//                       value={editFormData.leaveEndDate || ""}
//                       onChange={handleEditFormChange}
//                       className={`w-full p-2 border ${
//                         validationErrors.date
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Payment Information
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Payment Method
//                     </label>
//                     <select
//                       name="paymentMethod"
//                       value={editFormData.paymentMethod || "Bank Transfer"}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                       <option value="Bank Transfer">Bank Transfer</option>
//                       <option value="Cash">Cash</option>
//                       <option value="Cheque">Cheque</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Bank Account
//                     </label>
//                     <input
//                       type="text"
//                       name="bankAccount"
//                       value={editFormData.bankAccount || ""}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Status
//                     </label>
//                     <select
//                       name="status"
//                       value={editFormData.status || "Pending"}
//                       onChange={handleEditFormChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Processed">Processed</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-end space-x-4">
//               <button
//                 type="button"
//                 onClick={handleCancelEdit}
//                 className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSaveEdit}
//                 className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   // List View
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg max-w-md shadow-sm">
//           <p className="font-semibold">Error</p>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       {selectedEmployeeId && viewMode === "details" && !isEditing ? (
//         <div>
//           {/* Removed stray "REWARDS:" text to fix SyntaxError */}
//           <button
//             onClick={handleBackToList}
//             className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition duration-200"
//           >
//             <svg
//               className="w-5 h-5 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//             Back to all records
//           </button>

//           {updateSuccess && (
//             <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
//               <p className="font-semibold">Success</p>
//               <p>{updateSuccess}</p>
//             </div>
//           )}

//           <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
//               <h1 className="text-2xl font-bold text-white">
//                 Salary Record Details
//               </h1>
//               <p className="text-indigo-100">
//                 Employee ID: {selectedRecord.employeeId}
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Employee Information
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Full Name
//                     </p>
//                     <p className="text-gray-900">{selectedRecord.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Department
//                     </p>
//                     <p className="text-gray-900">{selectedRecord.department}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Designation
//                     </p>
//                     <p className="text-gray-900">
//                       {selectedRecord.designation}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Employee Type
//                     </p>
//                     <p className="text-gray-900 capitalize">
//                       {selectedRecord.type}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Working Hours
//                     </p>
//                     <p className="text-gray-900">
//                       {selectedRecord.workingHours}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Salary Breakdown
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Basic Salary
//                     </p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.basicSalary.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">HRA</p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.hra.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">DA</p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.da.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Bonus</p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.bonus.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Overtime Pay
//                     </p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.overtimePay.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Gross Salary
//                     </p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.grossSalary.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Tax Deduction
//                     </p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.taxDeduction.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       PF Deduction
//                     </p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.pfDeduction.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Other Deductions
//                     </p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.otherDeductions.toFixed(2)}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Leave Deduction
//                     </p>
//                     <p className="text-gray-900">
//                       ₹{selectedRecord.leaveDeduction.toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="pt-4 border-t border-gray-200">
//                     <p className="text-sm font-medium text-gray-500">
//                       Net Rupees
//                     </p>
//                     <p className="text-xl font-semibold text-indigo-600">
//                       ₹{selectedRecord.netSalary.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border-t border-gray-200">
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Payment Information
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Payment Date
//                     </p>
//                     <p className="text-gray-900">
//                       {new Date(
//                         selectedRecord.paymentDate
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Payment Method
//                     </p>
//                     <p className="text-gray-900">
//                       {selectedRecord.paymentMethod}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Bank Account
//                     </p>
//                     <p className="text-gray-900">
//                       {selectedRecord.bankAccount || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Status</p>
//                     <p className="text-gray-900">{selectedRecord.status}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//                   Record Metadata
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Created At
//                     </p>
//                     <p className="text-gray-900">
//                       {new Date(selectedRecord.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">
//                       Updated At
//                     </p>
//                     <p className="text-gray-900">
//                       {new Date(selectedRecord.updatedAt).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
//               <button
//                 onClick={() => handleEditRecord(selectedRecord.employeeId)}
//                 className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 flex items-center"
//               >
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                   />
//                 </svg>
//                 Edit Record
//               </button>
//               <button
//                 className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
//                 onClick={() =>
//                   alert("Print functionality would be implemented here")
//                 }
//               >
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
//                   />
//                 </svg>
//                 Print Payslip
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : selectedEmployeeId && viewMode === "payment" ? (
//         renderPaymentDetails()
//       ) : isEditing ? (
//         renderEditForm()
//       ) : (
//         <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">
//                 Salary Records
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Manage and view all employee salary information
//               </p>
//             </div>
//             <button
//               className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition duration-200"
//               onClick={() => alert("Add new record functionality placeholder")}
//             >
//               Add New Record
//             </button>
//           </div>

//           <div className="mb-6 relative">
//             <input
//               type="text"
//               placeholder="Search by ID, name or department..."
//               className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <svg
//               className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>

//           {filteredRecords.length === 0 ? (
//             <div className="text-center py-12 bg-gray-50 rounded-lg">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">
//                 No records found
//               </h3>
//               <p className="mt-1 text-gray-500">
//                 Try adjusting your search or add a new record.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-lg border border-gray-200">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Employee ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Department
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Designation
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Net Rupees
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredRecords.map((record) => (
//                     <tr
//                       key={record._id}
//                       className="hover:bg-gray-50 transition duration-150"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {record.employeeId}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {record.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {record.department}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {record.designation}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         ₹{record.netSalary.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => handleViewPayment(record.employeeId)}
//                           className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-200"
//                         >
//                           View Payment
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalaryRecords;
import { useState, useEffect } from "react";
import axios from "axios";

export const SalaryRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState(""); // "" for list, "details" for details view, "payment" for payment view
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch all records for the list view
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          "https://backend-erp-faculty.vercel.app/api/salary"
        );
        setRecords(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch records");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Fetch individual record when selectedEmployeeId changes
  useEffect(() => {
    if (selectedEmployeeId) {
      const fetchRecord = async () => {
        setDetailLoading(true);
        try {
          const response = await axios.get(
            `https://backend-erp-faculty.vercel.app/api/salary/${selectedEmployeeId}`
          );
          const record = {
            ...response.data,
            leaveStartDate: response.data.leaveStartDate || "",
            leaveEndDate: response.data.leaveEndDate || "",
          };
          setSelectedRecord(record);
          setEditFormData(record); // Pre-fill edit form with employee data
        } catch (err) {
          setDetailError(
            err.response?.data?.message || "Failed to fetch record"
          );
        } finally {
          setDetailLoading(false);
        }
      };

      fetchRecord();
    }
  }, [selectedEmployeeId]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for date-only comparison

    if (editFormData.leaveStartDate) {
      const start = new Date(editFormData.leaveStartDate);
      if (start < today) {
        newErrors.leaveStartDate = "Leave Start Date cannot be before today";
      }
    }

    if (editFormData.leaveStartDate && editFormData.leaveEndDate) {
      const start = new Date(editFormData.leaveStartDate);
      const end = new Date(editFormData.leaveEndDate);
      if (start >= end) {
        newErrors.date = "Leave Start Date must be before End Date";
      }
    }

    return newErrors;
  };

  const handleViewDetails = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setViewMode("details");
    setIsEditing(false);
    setUpdateError("");
    setUpdateSuccess("");
    setValidationErrors({});
  };

  const handleViewPayment = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setViewMode("payment");
    setIsEditing(false);
    setUpdateError("");
    setUpdateSuccess("");
    setValidationErrors({});
  };

  const handleBackToList = () => {
    setSelectedEmployeeId("");
    setSelectedRecord(null);
    setViewMode("");
    setDetailError("");
    setIsEditing(false);
    setUpdateError("");
    setUpdateSuccess("");
    setValidationErrors({});
  };

  const handleEditRecord = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setViewMode("details");
    setIsEditing(true);
    setUpdateError("");
    setUpdateSuccess("");
    setValidationErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(selectedRecord); // Reset form data to original
    setUpdateError("");
    setValidationErrors({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Convert numeric values to numbers
    if (
      [
        "basicSalary",
        "hra",
        "da",
        "bonus",
        "overtimePay",
        "taxDeduction",
        "pfDeduction",
        "otherDeductions",
        "workingHours",
        "leaveDeduction",
      ].includes(name)
    ) {
      processedValue = value === "" ? 0 : parseFloat(value);
    }

    setEditFormData({
      ...editFormData,
      [name]: processedValue,
    });
  };

  const handleSaveEdit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return;
    }

    try {
      setUpdateError("");
      setUpdateSuccess("");
      setValidationErrors({});

      const response = await axios.put(
        `https://backend-erp-faculty.vercel.app/api/salary/${selectedEmployeeId}`,
        editFormData
      );

      // Update both the selected record and the record in the list
      setSelectedRecord(response.data.record);
      setRecords(
        records.map((record) =>
          record.employeeId === selectedEmployeeId
            ? response.data.record
            : record
        )
      );

      setIsEditing(false);
      setUpdateSuccess("Record updated successfully!");

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess("");
      }, 3000);
    } catch (err) {
      setUpdateError(err.response?.data?.message || "Failed to update record");
    }
  };

  const filteredRecords = Array.isArray(records)
    ? records.filter(
        (record) =>
          record.employeeId?.includes(searchTerm) ||
          record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Payment Details View
  const renderPaymentDetails = () => {
    if (detailLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (detailError) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg max-w-md shadow-sm">
            <p className="font-semibold">Error</p>
            <p>{detailError}</p>
          </div>
        </div>
      );
    }

    if (!selectedRecord) return null;

    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-600 font-semibold">Logo</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Payment Details
                    </h1>
                    <p className="text-indigo-100 text-sm">
                      Employee ID: {selectedRecord.employeeId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Records
                </button>
                <button
                  onClick={() => {
                    setViewMode("details");
                    setIsEditing(false);
                  }}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-sm"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  View Full Details
                </button>
              </div>

              {/* Employee Information */}
              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Employee Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-gray-900">{selectedRecord.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Department
                    </p>
                    <p className="text-gray-900">{selectedRecord.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Designation
                    </p>
                    <p className="text-gray-900">
                      {selectedRecord.designation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Employee Type
                    </p>
                    <p className="text-gray-900 capitalize">
                      {selectedRecord.type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Payment Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Payment Date
                    </p>
                    <p className="text-gray-900">
                      {new Date(
                        selectedRecord.paymentDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Payment Method
                    </p>
                    <p className="text-gray-900">
                      {selectedRecord.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Bank Account
                    </p>
                    <p className="text-gray-900">
                      {selectedRecord.bankAccount || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-gray-900">{selectedRecord.status}</p>
                  </div>
                </div>
              </div>

              {/* Salary Summary */}
              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Salary Summary
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          Gross Salary
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ₹{selectedRecord.grossSalary.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          Tax Deduction
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ₹{selectedRecord.taxDeduction.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          PF Deduction
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ₹{selectedRecord.pfDeduction.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          Other Deductions
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ₹{selectedRecord.otherDeductions.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          Leave Deduction
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ₹{selectedRecord.leaveDeduction.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          Total Deductions
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                          ₹
                          {(
                            selectedRecord.taxDeduction +
                            selectedRecord.pfDeduction +
                            selectedRecord.otherDeductions +
                            selectedRecord.leaveDeduction
                          ).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          Net Rupees
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ₹{selectedRecord.netSalary.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Form View
  const renderEditForm = () => {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <button
          onClick={handleCancelEdit}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to record details
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h1 className="text-2xl font-bold text-white">
              Edit Salary Record
            </h1>
            <p className="text-indigo-100">
              Employee ID: {editFormData.employeeId}
            </p>
          </div>

          {updateError && (
            <div className="m-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
              <p className="font-semibold">Error</p>
              <p>{updateError}</p>
            </div>
          )}

          <form className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Employee Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Employee Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name || ""}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={editFormData.department || ""}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={editFormData.designation || ""}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Type
                    </label>
                    <select
                      name="type"
                      value={editFormData.type || "teaching"}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="teaching">Teaching</option>
                      <option value="non-teaching">Non-Teaching</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working Hours
                    </label>
                    <input
                      type="number"
                      name="workingHours"
                      value={editFormData.workingHours || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Salary Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Salary Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Basic Salary (₹)
                    </label>
                    <input
                      type="number"
                      name="basicSalary"
                      value={editFormData.basicSalary || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HRA (₹)
                    </label>
                    <input
                      type="number"
                      name="hra"
                      value={editFormData.hra || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DA (₹)
                    </label>
                    <input
                      type="number"
                      name="da"
                      value={editFormData.da || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bonus (₹)
                    </label>
                    <input
                      type="number"
                      name="bonus"
                      value={editFormData.bonus || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overtime Pay (₹)
                    </label>
                    <input
                      type="number"
                      name="overtimePay"
                      value={editFormData.overtimePay || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Deductions
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Deduction (₹)
                    </label>
                    <input
                      type="number"
                      name="taxDeduction"
                      value={editFormData.taxDeduction || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PF Deduction (₹)
                    </label>
                    <input
                      type="number"
                      name="pfDeduction"
                      value={editFormData.pfDeduction || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Deductions (₹)
                    </label>
                    <input
                      type="number"
                      name="otherDeductions"
                      value={editFormData.otherDeductions || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Deduction (₹)
                    </label>
                    <input
                      type="number"
                      name="leaveDeduction"
                      value={editFormData.leaveDeduction || 0}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Leave Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Leave Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Start Date
                    </label>
                    <input
                      type="date"
                      name="leaveStartDate"
                      value={editFormData.leaveStartDate || ""}
                      onChange={handleEditFormChange}
                      className={`w-full p-2 border ${
                        validationErrors.leaveStartDate || validationErrors.date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {validationErrors.leaveStartDate && (
                      <p className="mt-1 text-xs text-red-500">
                        {validationErrors.leaveStartDate}
                      </p>
                    )}
                    {validationErrors.date && (
                      <p className="mt-1 text-xs text-red-500">
                        {validationErrors.date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave End Date
                    </label>
                    <input
                      type="date"
                      name="leaveEndDate"
                      value={editFormData.leaveEndDate || ""}
                      onChange={handleEditFormChange}
                      className={`w-full p-2 border ${
                        validationErrors.date
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      value={editFormData.paymentMethod || "Bank Transfer"}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Account
                    </label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={editFormData.bankAccount || ""}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editFormData.status || "Pending"}
                      onChange={handleEditFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processed">Processed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // List View
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg max-w-md shadow-sm">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {selectedEmployeeId && viewMode === "details" && !isEditing ? (
        <div>
          <button
            onClick={handleBackToList}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all records
          </button>

          {updateSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg max-w-4xl mx-auto">
              <p className="font-semibold">Success</p>
              <p>{updateSuccess}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600">
              <h1 className="text-2xl font-bold text-white">
                Salary Record Details
              </h1>
              <p className="text-indigo-100">
                Employee ID: {selectedRecord.employeeId}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee and Salary Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
                    Employee Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-gray-900">{selectedRecord.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Department
                      </p>
                      <p className="text-gray-900">
                        {selectedRecord.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Designation
                      </p>
                      <p className="text-gray-900">
                        {selectedRecord.designation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Employee Type
                      </p>
                      <p className="text-gray-900 capitalize">
                        {selectedRecord.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Working Hours
                      </p>
                      <p className="text-gray-900">
                        {selectedRecord.workingHours}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
                    Salary Breakdown
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Basic Salary
                        </p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.basicSalary.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">HRA</p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.hra.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">DA</p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.da.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Bonus
                        </p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.bonus.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Overtime Pay
                        </p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.overtimePay.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Gross Salary
                        </p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.grossSalary.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Tax Deduction
                        </p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.taxDeduction.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          PF Deduction
                        </p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.pfDeduction.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Other Deductions
                        </p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.otherDeductions.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Leave Deduction
                        </p>
                        <p className="text-gray-900">
                          ₹{selectedRecord.leaveDeduction.toFixed(2)}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-500">
                          Net Rupees
                        </p>
                        <p className="text-lg font-semibold text-indigo-600">
                          ₹{selectedRecord.netSalary.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment and Metadata Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
                    Payment Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Payment Date
                      </p>
                      <p className="text-gray-900">
                        {new Date(
                          selectedRecord.paymentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Payment Method
                      </p>
                      <p className="text-gray-900">
                        {selectedRecord.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Bank Account
                      </p>
                      <p className="text-gray-900">
                        {selectedRecord.bankAccount || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Status
                      </p>
                      <p className="text-gray-900">{selectedRecord.status}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
                    Record Metadata
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Created At
                      </p>
                      <p className="text-gray-900">
                        {new Date(selectedRecord.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Updated At
                      </p>
                      <p className="text-gray-900">
                        {new Date(selectedRecord.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => handleEditRecord(selectedRecord.employeeId)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Record
              </button>
              <button
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
                onClick={() =>
                  alert("Print functionality would be implemented here")
                }
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Payslip
              </button>
            </div>
          </div>
        </div>
      ) : selectedEmployeeId && viewMode === "payment" ? (
        renderPaymentDetails()
      ) : isEditing ? (
        renderEditForm()
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Salary Records
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and view all employee salary information
              </p>
            </div>
            <button
              className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition duration-200"
              onClick={() => alert("Add new record functionality placeholder")}
            >
              Add New Record
            </button>
          </div>

          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search by ID, name or department..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No records found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or add a new record.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Rupees
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{record.netSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewPayment(record.employeeId)}
                          className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-200"
                        >
                          View Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalaryRecords;
