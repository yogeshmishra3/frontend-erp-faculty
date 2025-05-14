import React, { useState, useEffect } from "react";

const FacultyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    employeeId: "", // Will be generated based on faculty type
    name: "",
    email: "",
    gender: "",
    designation: "",
    mobile: "",
    dateOfBirth: "",
    dateOfJoining: "",
    department: "",
    address: "",
    aadhaar: "",
    employmentType: "",
    status: "Active",
    type: "teaching",
    teachingExperience: "",
    subjectsTaught: "",
    classIncharge: "",
    researchPublications: "",
    technicalSkills: "",
    workExperience: "",
    reportingOfficer: "",
    shiftTiming: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastEmployeeId, setLastEmployeeId] = useState(null);
  const [fetching, setFetching] = useState(true);

  // Fetch the last employee ID when component mounts
  useEffect(() => {
    const fetchLastEmployeeId = async () => {
      try {
        const response = await fetch(
          "https://backend-erp-faculty.vercel.app/api/faculty/faculties"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch faculty data");
        }
        const data = await response.json();

        if (data.length > 0) {
          // Find the highest employee ID
          const lastId = data.reduce((max, faculty) => {
            const currentId = parseInt(faculty.employeeId.replace(/\D/g, ""));
            return currentId > max ? currentId : max;
          }, 0);

          setLastEmployeeId(lastId);
        } else {
          setLastEmployeeId(0); // No faculty records yet
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setErrors({ server: "Failed to load faculty data. Please refresh." });
      } finally {
        setFetching(false);
      }
    };

    fetchLastEmployeeId();
  }, []);

  // Generate employee ID based on faculty type and last ID
  const generateEmployeeId = (type) => {
    if (fetching) return "Loading...";

    let prefix = "NC"; // College prefix
    let departmentCode = type === "non-teaching" ? "NT" : "AT"; // Department code

    // Start from last ID + 1 or 1001 if no records exist
    const nextId = (lastEmployeeId || 1000) + 1;

    // Format the ID with leading zeros (4 digits)
    const number = nextId.toString().padStart(4, "0");

    // Construct the employee ID
    return `${prefix}${departmentCode}${number}`;
  };

  // Update employee ID whenever type changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      employeeId: generateEmployeeId(prevData.type),
    }));
  }, [formData.type, lastEmployeeId, fetching]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArrayInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleTypeChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      type: type,
      // Reset type-specific fields when switching types
      teachingExperience:
        type === "teaching" ? prevData.teachingExperience : "",
      subjectsTaught: type === "teaching" ? prevData.subjectsTaught : "",
      classIncharge: type === "teaching" ? prevData.classIncharge : "",
      researchPublications:
        type === "teaching" ? prevData.researchPublications : "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.aadhaar) {
      newErrors.aadhaar = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(formData.aadhaar)) {
      newErrors.aadhaar = "Aadhaar number must be 12 digits";
    }

    // Common required fields for both teaching and non-teaching
    const requiredFields = [
      "gender",
      "designation",
      "dateOfBirth",
      "dateOfJoining",
      "department",
      "address",
      "employmentType",
      "workExperience",
      "reportingOfficer",
      "shiftTiming",
    ];

    // Only add teaching-specific required fields when type is teaching
    if (formData.type === "teaching") {
      requiredFields.push("teachingExperience", "classIncharge");
    }

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, " $1")
        } is required`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data for faculty API
      const dataToSubmit = {
        ...formData,
        subjectsTaught: Array.isArray(formData.subjectsTaught)
          ? formData.subjectsTaught
          : formData.subjectsTaught
          ? formData.subjectsTaught.split(",").map((item) => item.trim())
          : [],
        researchPublications: Array.isArray(formData.researchPublications)
          ? formData.researchPublications
          : formData.researchPublications
          ? formData.researchPublications.split(",").map((item) => item.trim())
          : [],
        technicalSkills: Array.isArray(formData.technicalSkills)
          ? formData.technicalSkills
          : formData.technicalSkills
          ? formData.technicalSkills.split(",").map((item) => item.trim())
          : [],
      };

      // Send to faculty registration API
      const facultyResponse = await fetch(
        "https://backend-erp-faculty.vercel.app/api/faculty/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      const facultyData = await facultyResponse.json();
      if (!facultyResponse.ok) {
        throw new Error(facultyData.message || "Faculty registration failed");
      }

      // Prepare data for salary API (only required fields)
      const salaryData = {
        employeeId: formData.employeeId,
        name: formData.name,
        department: formData.department,
        designation: formData.designation,
        type: formData.type,
      };

      // Send to salary record API
      const salaryResponse = await fetch(
        "https://backend-erp-faculty.vercel.app/api/salary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(salaryData),
        }
      );

      const salaryDataResponse = await salaryResponse.json();
      if (!salaryResponse.ok) {
        throw new Error(
          salaryDataResponse.message || "Salary record creation failed"
        );
      }

      // Show success message
      setSuccess(true);

      // Reset form data but keep type
      setFormData({
        employeeId: generateEmployeeId(formData.type), // Generate new ID immediately
        name: "",
        email: "",
        gender: "",
        designation: "",
        mobile: "",
        dateOfBirth: "",
        dateOfJoining: "",
        department: "",
        address: "",
        aadhaar: "",
        employmentType: "",
        status: "Active",
        type: formData.type, // Preserve the current type
        teachingExperience: "",
        subjectsTaught: "",
        classIncharge: "",
        researchPublications: "",
        technicalSkills: "",
        workExperience: "",
        reportingOfficer: "",
        shiftTiming: "",
      });

      // Update the last employee ID
      const currentIdNum = parseInt(formData.employeeId.replace(/\D/g, ""));
      setLastEmployeeId(currentIdNum);

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        server:
          error.message ||
          "An error occurred while registering. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Department and designation options
  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
  ];

  const teachingDesignations = [
    "Associate Professor",
    "Assistant Professor",
    "Professor",
    "Head of Department",
  ];

  const nonTeachingDesignations = [
    "Student Management",
    "Account Management",
    "Document Management",
    "Notification System",
    "Library Management",
    "Bus Management",
    "Hostel Management",
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-xl font-semibold text-blue-800 mb-4 pb-2 border-b">
        Faculty Registration Form
      </h1>

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                Faculty registration and salary record created successfully.
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setSuccess(false)}
                className="text-green-500"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {errors.server && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{errors.server}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setErrors({ ...errors, server: null })}
                className="text-red-500"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Faculty Type Selection */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                formData.type === "teaching"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-300 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-500`}
              onClick={() => handleTypeChange("teaching")}
            >
              Teaching Faculty
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                formData.type === "non-teaching"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-300 rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500`}
              onClick={() => handleTypeChange("non-teaching")}
            >
              Non-Teaching Faculty
            </button>
          </div>
        </div>

        {/* Employee ID Display */}
        <div className="mb-4 bg-blue-50 p-3 rounded-md">
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Employee ID (Auto-generated)
          </label>
          <div className="text-lg font-semibold text-blue-800">
            {formData.employeeId || "Will be generated after selection"}
          </div>
        </div>

        {/* Section 1: Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
              placeholder="10-digit mobile number"
            />
            {errors.mobile && (
              <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Aadhaar Number *
            </label>
            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.aadhaar ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
              placeholder="12-digit Aadhaar number"
            />
            {errors.aadhaar && (
              <p className="mt-1 text-xs text-red-500">{errors.aadhaar}</p>
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className={`w-full px-3 py-2 border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            ></textarea>
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Section 2: Employment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Designation *
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.designation ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            >
              <option value="">Select Designation</option>
              {formData.type === "teaching"
                ? teachingDesignations.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                : nonTeachingDesignations.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
            </select>
            {errors.designation && (
              <p className="mt-1 text-xs text-red-500">{errors.designation}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.department ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-xs text-red-500">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date of Joining *
            </label>
            <input
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.dateOfJoining ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            />
            {errors.dateOfJoining && (
              <p className="mt-1 text-xs text-red-500">
                {errors.dateOfJoining}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Employment Type *
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.employmentType ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            >
              <option value="">Select Type</option>
              <option value="Permanent">Permanent</option>
              <option value="Contract">Contract</option>
              <option value="Visiting">Visiting</option>
              <option value="Part-time">Part-time</option>
            </select>
            {errors.employmentType && (
              <p className="mt-1 text-xs text-red-500">
                {errors.employmentType}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Reporting Officer *
            </label>
            <input
              type="text"
              name="reportingOfficer"
              value={formData.reportingOfficer}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.reportingOfficer ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            />
            {errors.reportingOfficer && (
              <p className="mt-1 text-xs text-red-500">
                {errors.reportingOfficer}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Shift Timing *
            </label>
            <input
              type="text"
              name="shiftTiming"
              value={formData.shiftTiming}
              onChange={handleChange}
              placeholder="e.g., 9:00 AM - 5:00 PM"
              className={`w-full px-3 py-2 border ${
                errors.shiftTiming ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            />
            {errors.shiftTiming && (
              <p className="mt-1 text-xs text-red-500">{errors.shiftTiming}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Work Experience (Years) *
            </label>
            <input
              type="number"
              name="workExperience"
              value={formData.workExperience}
              onChange={handleChange}
              placeholder="previous work experience in years"
              className={`w-full px-3 py-2 border ${
                errors.workExperience ? "border-red-500" : "border-gray-300"
              } rounded-md text-sm`}
            />
            {errors.workExperience && (
              <p className="mt-1 text-xs text-red-500">
                {errors.workExperience}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Technical Skills
            </label>
            <input
              type="text"
              name="technicalSkills"
              value={formData.technicalSkills}
              onChange={handleArrayInput}
              placeholder="e.g., Python, SQL, Data Analysis"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Section 3: Teaching Information - Only for teaching faculty */}
        {formData.type === "teaching" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Teaching Experience (Years) *
              </label>
              <input
                type="text"
                name="teachingExperience"
                value={formData.teachingExperience}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.teachingExperience
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md text-sm`}
              />
              {errors.teachingExperience && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.teachingExperience}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Class Incharge *
              </label>
              <input
                type="text"
                name="classIncharge"
                value={formData.classIncharge}
                onChange={handleChange}
                placeholder="e.g., CSE-A 2nd Year"
                className={`w-full px-3 py-2 border ${
                  errors.classIncharge ? "border-red-500" : "border-gray-300"
                } rounded-md text-sm`}
              />
              {errors.classIncharge && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.classIncharge}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Subjects Taught
              </label>
              <input
                type="text"
                name="subjectsTaught"
                value={formData.subjectsTaught}
                onChange={handleArrayInput}
                placeholder="e.g., Database, Programming, Networks"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Research Publications
              </label>
              <input
                type="text"
                name="researchPublications"
                value={formData.researchPublications}
                onChange={handleArrayInput}
                placeholder="Enter titles of publications, separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-6 border-t pt-4">
          <button
            type="submit"
            disabled={loading || fetching}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {fetching
              ? "Loading data..."
              : loading
              ? "Submitting..."
              : "Register Faculty"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyRegistrationForm;
