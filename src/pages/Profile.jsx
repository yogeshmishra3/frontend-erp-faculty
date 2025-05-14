import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Edit, Save, X, Check, FileText, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile({ userData }) {
  const navigate = useNavigate();
  const typeDisplayNames = {
    director: 'Director',
    principal: 'Principal',
    HOD: 'Head of Department',
    teaching: 'Teacher',
    nonteaching: 'Non-Teaching Staff',
  };

  const [profileData, setProfileData] = useState({
    employeeId: userData?.employeeId || '',
    name: userData?.name || '',
    gender: userData?.gender || '',
    dateOfBirth: userData?.dateOfBirth || '',
    email: userData?.email || '',
    mobile: userData?.mobile || '',
    address: userData?.address || '',
    aadhaar: userData?.aadhaar || '',
    department: userData?.department || '',
    designation: userData?.designation || '',
    dateOfJoining: userData?.dateOfJoining || '',
    employmentType: userData?.employmentType || '',
    status: userData?.status || 'Active',
    type: userData?.role || 'teaching',
    teachingExperience: userData?.teachingExperience || 0,
    subjectsTaught: userData?.subjectsTaught || [],
    classIncharge: userData?.classIncharge || '',
    researchPublications: userData?.researchPublications || [],
    technicalSkills: userData?.technicalSkills || [],
    workExperience: userData?.workExperience || 0,
  });

  const [activeSection, setActiveSection] = useState(null);
  const [tempData, setTempData] = useState({ ...profileData });
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching profile with token:', userData?.token);
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        console.log('API Response Status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('API Response Data:', data);
          const updatedProfile = {
            employeeId: data.employeeId || '',
            name: data.name || '',
            gender: data.gender || '',
            dateOfBirth: data.dateOfBirth || '',
            email: data.email || '',
            mobile: data.mobile || '',
            address: data.address || '',
            aadhaar: data.a.once || '',
            department: data.department || '',
            designation: data.designation || '',
            dateOfJoining: data.dateOfJoining || '',
            employmentType: data.employmentType || '',
            status: data.status || 'Active',
            type: data.role || 'teaching',
            teachingExperience: data.teachingExperience || 0,
            subjectsTaught: data.subjectsTaught || [],
            classIncharge: data.classIncharge || '',
            researchPublications: data.researchPublications || [],
            technicalSkills: data.technicalSkills || [],
            workExperience: data.workExperience || 0,
          };
          setProfileData(updatedProfile);
          setTempData(updatedProfile);
          console.log('Updated profileData:', updatedProfile);
          const updatedUser = { ...JSON.parse(localStorage.getItem('user')), ...updatedProfile };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          showNotification(`Failed to fetch profile: ${errorData.message || response.statusText}`);
          if (response.status === 401) {
            showNotification('Session expired. Please log in again.');
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            navigate('/login');
          }
        }
      } catch (err) {
        console.error('Fetch Profile Error:', err);
        showNotification('Failed to connect to the server');
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?.token) {
      fetchProfile();
    } else {
      console.warn('No token found in userData');
      showNotification('Please log in again');
      navigate('/login');
    }
  }, [userData?.token, navigate]);

  const handleInputChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...tempData[field]];
    updatedArray[index] = value;
    setTempData({ ...tempData, [field]: updatedArray });
  };

  const addArrayItem = (field) => {
    setTempData({ ...tempData, [field]: [...tempData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    setTempData({ ...tempData, [field]: tempData[field].filter((_, i) => i !== index) });
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify(tempData),
      });
      if (response.ok) {
        const updatedData = await response.json();
        setProfileData(updatedData);
        setTempData(updatedData);
        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...updatedData }));
        setActiveSection(null);
        showNotification('Profile section updated successfully');
      } else {
        const errorData = await response.json();
        showNotification(`Failed to update profile: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showNotification('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setTempData({ ...profileData });
    setActiveSection(null);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const profileSections = [
    {
      id: 'personal',
      title: 'Personal Details',
      fields: [
        { id: 'employeeId', label: 'Employee ID', icon: <User size={16} />, disabled: true },
        { id: 'name', label: 'Name', icon: <User size={16} /> },
        { id: 'gender', label: 'Gender', icon: <User size={16} /> },
        { id: 'dateOfBirth', label: 'Date of Birth', icon: <Calendar size={16} /> },
        { id: 'aadhaar', label: 'Aadhaar Number', icon: <FileText size={16} /> },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      fields: [
        { id: 'email', label: 'Email Address', icon: <Mail size={16} />, disabled: true },
        { id: 'mobile', label: 'Mobile Number', icon: <Phone size={16} /> },
        { id: 'address', label: 'Address', icon: <MapPin size={16} /> },
      ],
    },
    {
      id: 'employment',
      title: 'Employment Details',
      fields: [
        { id: 'department', label: 'Department', icon: <Briefcase size={16} /> },
        { id: 'designation', label: 'Designation', icon: <Briefcase size={16} /> },
        { id: 'dateOfJoining', label: 'Date of Joining', icon: <Calendar size={16} /> },
        { id: 'employmentType', label: 'Employment Type', icon: <FileText size={16} /> },
        { id: 'status', label: 'Status', icon: <FileText size={16} /> },
        { id: 'type', label: 'Type', icon: <Briefcase size={16} />, disabled: true },
      ],
    },
    {
      id: 'academic',
      title: 'Academic Details',
      fields: [
        { id: 'teachingExperience', label: 'Teaching Experience (Years)', icon: <BookOpen size={16} /> },
        { id: 'classIncharge', label: 'Class Incharge', icon: <BookOpen size={16} /> },
        { id: 'workExperience', label: 'Work Experience (Years)', icon: <Briefcase size={16} /> },
      ],
      arrays: [
        { id: 'subjectsTaught', label: 'Subjects Taught', icon: <BookOpen size={16} /> },
        { id: 'researchPublications', label: 'Research Publications', icon: <FileText size={16} /> },
        { id: 'technicalSkills', label: 'Technical Skills', icon: <FileText size={16} /> },
      ],
    },
  ];

  console.log('Rendering with profileData:', profileData);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded shadow-md flex items-center z-50 max-w-xs">
          <Check size={18} className="mr-2 text-green-500 flex-shrink-0" />
          <span className="text-sm">{notification}</span>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:h-full">
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0 md:mr-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-blue-500 shadow overflow-hidden">
              <img
                src="/api/placeholder/80/80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-800">
              {profileData.name || 'User'}
            </h2>
            <div className="flex items-center mt-1 text-gray-600 text-sm">
              <Briefcase size={14} className="mr-1" />
              <span>{typeDisplayNames[profileData.type] || profileData.type}</span>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                profileData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <span className={`w-1 h-1 rounded-full mr-1 ${
                  profileData.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {profileData.status}
              </span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="mb-3">
              <div className="flex items-center text-gray-500 mb-1">
                <Mail size={14} className="mr-1" />
                <span className="text-xs font-medium">Email</span>
              </div>
              <p className="text-sm text-gray-800 break-words">{profileData.email}</p>
            </div>
            <div className="mb-3">
              <div className="flex items-center text-gray-500 mb-1">
                <Phone size={14} className="mr-1" />
                <span className="text-xs font-medium">Mobile</span>
              </div>
              <p className="text-sm text-gray-800">{profileData.mobile || 'Not set'}</p>
            </div>
            <div className="mb-3">
              <div className="flex items-center text-gray-500 mb-1">
                <MapPin size={14} className="mr-1" />
                <span className="text-xs font-medium">Address</span>
              </div>
              <p className="text-sm text-gray-800">{profileData.address || 'Not set'}</p>
            </div>
            <div className="mb-3">
              <div className="flex items-center text-gray-500 mb-1">
                <Briefcase size={14} className="mr-1" />
                <span className="text-xs font-medium">Designation</span>
              </div>
              <p className="text-sm text-gray-800">{profileData.designation || 'Not set'}</p>
            </div>
          </div>
          <button
            onClick={saveChanges}
            className="w-full mt-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            <Save size={14} className="mr-1" />
            Update Profile
          </button>
        </div>
        <div className="flex-1 flex flex-col">
          <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <User size={20} className="mr-2 text-blue-600" />
            User Profile
          </h1>
          <div className="flex-1 grid grid-cols-1 gap-4">
            {profileSections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-gray-800">{section.title}</h3>
                    {activeSection !== section.id ? (
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                        disabled={isLoading}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={cancelEdit}
                          className="flex items-center text-xs font-medium text-gray-600 hover:text-gray-800"
                          disabled={isLoading}
                        >
                          <X size={14} className="mr-1" /> Cancel
                        </button>
                        <button
                          onClick={saveChanges}
                          className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                          disabled={isLoading}
                        >
                          <Save size={14} className="mr-1" /> Save
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {section.fields?.map((field) => (
                      <div key={field.id} className="group">
                        <div className="flex items-center mb-1 text-gray-500">
                          {field.icon}
                          <span className="ml-1 text-xs font-medium">{field.label}</span>
                        </div>
                        {activeSection === section.id && !field.disabled ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={tempData[field.id]}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full p-1 pl-2 text-sm border border-blue-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-500 outline-none"
                              disabled={isLoading}
                            />
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-gray-800 p-1 bg-gray-50 rounded">
                            {profileData[field.id] || 'Not set'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {section.arrays?.map((arrayField) => (
                    <div key={arrayField.id} className="mt-4">
                      <div className="flex items-center mb-2 text-gray-500">
                        {arrayField.icon}
                        <span className="ml-1 text-xs font-medium">{arrayField.label}</span>
                      </div>
                      {activeSection === section.id ? (
                        <div>
                          {tempData[arrayField.id].map((item, index) => (
                            <div key={index} className="flex items-center mb-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange(arrayField.id, index, e.target.value)}
                                className="w-full p-1 pl-2 text-sm border border-blue-200 rounded focus:ring-1 focus:ring-blue-300 focus:border-blue-500 outline-none"
                                disabled={isLoading}
                              />
                              <button
                                onClick={() => removeArrayItem(arrayField.id, index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                                disabled={isLoading}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem(arrayField.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            disabled={isLoading}
                          >
                            + Add {arrayField.label}
                          </button>
                        </div>
                      ) : (
                        <ul className="list-disc pl-5 text-sm text-gray-800">
                          {profileData[arrayField.id].length > 0 ? (
                            profileData[arrayField.id].map((item, index) => (
                              <li key={index}>{item || 'Not set'}</li>
                            ))
                          ) : (
                            <li>Not set</li>
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}