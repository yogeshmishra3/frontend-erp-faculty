import React, { useState, useEffect } from "react";

const FacultyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
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
    subjectsTaught: [],
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
  const [counterValues, setCounterValues] = useState({
    teaching: 1,
    nonTeaching: 1,
  });
  const [selectedSubject, setSelectedSubject] = useState("");

  // Subject lists for each department
  const departmentSubjects = {
    "Computer Science": [
      "Data Structures and Algorithms",
      "Operating Systems",
      "Computer Networks",
      "Database Management Systems",
      "Software Engineering",
      "Theory of Computation",
      "Compiler Design",
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Architecture",
      "Web Technologies",
      "Cloud Computing",
      "Cyber Security",
    ],
    "Information Technology": [
      "Data Structures",
      "Computer Networks",
      "Database Management Systems",
      "Software Engineering",
      "Information Security",
      "Web Technologies",
      "Operating Systems",
      "Object-Oriented Programming",
      "Mobile Computing",
      "E-Commerce and ERP",
      "Data Mining",
      "Cloud Computing",
    ],
    Electronics: [
      "Electronic Devices and Circuits",
      "Digital Electronics",
      "Signals and Systems",
      "Analog Circuits",
      "Microprocessors and Microcontrollers",
      "Communication Systems",
      "VLSI Design",
      "Embedded Systems",
      "Control Systems",
      "Antenna and Wave Propagation",
      "Wireless Communication",
      "Image Processing",
    ],
    Mechanical: [
      "Engineering Mechanics",
      "Thermodynamics",
      "Fluid Mechanics",
      "Strength of Materials",
      "Manufacturing Processes",
      "Machine Design",
      "Heat and Mass Transfer",
      "Theory of Machines",
      "CAD/CAM",
      "Automobile Engineering",
      "Robotics",
      "Industrial Engineering",
    ],
    Civil: [
      "Engineering Mechanics",
      "Surveying",
      "Strength of Materials",
      "Fluid Mechanics",
      "Structural Analysis",
      "Concrete Technology",
      "Soil Mechanics",
      "Transportation Engineering",
      "Environmental Engineering",
      "Construction Planning and Management",
      "Water Resources Engineering",
      "Estimation and Costing",
    ],
    Electrical: [
      "Electrical Circuits",
      "Electromagnetic Fields",
      "Electrical Machines",
      "Power Systems",
      "Control Systems",
      "Power Electronics",
      "Electrical Measurements",
      "Switchgear and Protection",
      "Renewable Energy Systems",
      "High Voltage Engineering",
      "Microprocessors and Applications",
      "Electric Drives",
    ],
    "Data Science": [
      "Statistics for Data Science",
      "Python and R Programming",
      "Data Structures",
      "Data Visualization",
      "Machine Learning",
      "Deep Learning",
      "Big Data Analytics",
      "Data Mining",
      "Artificial Intelligence",
      "Natural Language Processing",
      "Cloud Computing for Data Science",
      "Business Analytics",
      "Data Ethics and Governance",
      "Database Management Systems",
      "Time Series Analysis",
    ],
  };

  const generateEmployeeId = (type) => {
    let prefix = "NC";
    let departmentCode = type === "non-teaching" ? "NT" : "AT";
    let counterId = type === "non-teaching" ? "nonTeaching" : "teaching";
    const number = (1000 + counterValues[counterId]).toString().substring(1);
    return `${prefix}${departmentCode}${number}`;
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      employeeId: generateEmployeeId(prevData.type),
    }));
  }, [formData.type, counterValues]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      employeeId: generateEmployeeId(prevData.type),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      setFormData({
        ...formData,
        [name]: value,
        subjectsTaught: [], // Reset subjectsTaught when department changes
      });
      setSelectedSubject(""); // Reset selectedSubject when department changes
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleArrayInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleSingleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const addSingleSubject = () => {
    if (selectedSubject && !formData.subjectsTaught.includes(selectedSubject)) {
      setFormData({
        ...formData,
        subjectsTaught: [...formData.subjectsTaught, selectedSubject],
      });
      setSelectedSubject("");
    }
  };

  const handleTypeChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      type: type,
      teachingExperience:
        type === "teaching" ? prevData.teachingExperience : "",
      subjectsTaught: type === "teaching" ? prevData.subjectsTaught : [],
      classIncharge: type === "teaching" ? prevData.classIncharge : "",
      researchPublications:
        type === "teaching" ? prevData.researchPublications : "",
    }));
    setSelectedSubject("");
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

    if (formData.dateOfBirth && formData.dateOfJoining) {
      const dob = new Date(formData.dateOfBirth);
      const doj = new Date(formData.dateOfJoining);
      if (dob >= doj) {
        newErrors.dateOfBirth = "Date of Birth must be before Date of Joining";
      }
    }

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

    if (formData.type === "teaching") {
      requiredFields.push("teachingExperience", "classIncharge");
      if (formData.teachingExperience && formData.workExperience) {
        const teachingExp = parseFloat(formData.teachingExperience);
        const workExp = parseFloat(formData.workExperience);
        if (isNaN(teachingExp) || isNaN(workExp)) {
          newErrors.teachingExperience =
            "Teaching and Work Experience must be valid numbers";
        } else if (teachingExp > workExp) {
          newErrors.teachingExperience =
            "Teaching Experience cannot exceed Work Experience";
        }
      }
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
      const dataToSubmit = {
        ...formData,
        subjectsTaught: formData.subjectsTaught,
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

      const salaryData = {
        employeeId: formData.employeeId,
        name: formData.name,
        department: formData.department,
        designation: formData.designation,
        type: formData.type,
      };

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

      const currentType = formData.type;
      const counterId =
        currentType === "non-teaching" ? "nonTeaching" : "teaching";
      setCounterValues((prev) => ({
        ...prev,
        [counterId]: prev[counterId] + 1,
      }));

      setSuccess(true);
      setFormData({
        employeeId: generateEmployeeId(currentType),
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
        type: currentType,
        teachingExperience: "",
        subjectsTaught: [],
        classIncharge: "",
        researchPublications: "",
        technicalSkills: "",
        workExperience: "",
        reportingOfficer: "",
        shiftTiming: "",
      });
      setSelectedSubject("");

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

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Data Science",
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

        <div className="mb-4 bg-blue-50 p-3 rounded-md">
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Employee ID (Auto-generated)
          </label>
          <div className="text-lg font-semibold text-blue-800">
            {formData.employeeId || "Will be generated after selection"}
          </div>
        </div>

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

        {formData.type === "teaching" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Teaching Experience (Years) *
              </label>
              <input
                type="number"
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
                Add Subject
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedSubject}
                  onChange={handleSingleSubjectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select a subject</option>
                  {(departmentSubjects[formData.department] || []).map(
                    (subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    )
                  )}
                </select>
                <button
                  type="button"
                  onClick={addSingleSubject}
                  disabled={!selectedSubject}
                  className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              {formData.subjectsTaught.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700">
                    Selected Subjects:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {formData.subjectsTaught.map((subject, index) => (
                      <li key={index}>{subject}</li>
                    ))}
                  </ul>
                </div>
              )}
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

        <div className="flex justify-end mt-6 border-t pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Register Faculty"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacultyRegistrationForm;
