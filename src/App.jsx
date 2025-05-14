import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogOut,
  BookOpen,
  BookMarked,
  User,
  CreditCard,
  ChevronRight,
  Calendar,
  Bell,
  FileText,
  Home,
  ClipboardCheck,
  Users,
} from "lucide-react";
import {
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Original App Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import ServiceBook from "./pages/ServiceBook";
// import SendNotification from "./pages/SendNotification";
import PaySlip from "./pages/PaySlip";
import ApplyLeave from "./pages/ApplyLeave";
import ApproveLeave from "./pages/ApproveLeave";
import ApproveChargeHandover from "./pages/ApproveChargeHandover";
import ApproveODLeave from "./pages/ApproveODLeave";
// import ClassSchedule from "./pages/ClassSchedule";
// import Calender from "./pages/Calender";
// import PayrollNotice from "./pages/PayrollNotice";
import Announcement from "./pages/Announcement/Announcement";
import ApplyODLeave from "./pages/ApplyODLeave";
import ApplyChargeHandoverForm from "./pages/ApplyChargeHandover";
import Login from "./Login";
import Signup from "./Signup";
import MarkAttendance from "./pages/MarkAttendance";
import ComposeAnnouncementByPrincipal from "./pages/Announcement/ComposeAnnouncementByPrinciple";
import ComposeByHOD from "./pages/Announcement/ComposeAnnouncemtByHOD";
import NonTeachingAnnouncements from "./pages/Announcement/AnnoucementNT";

// Faculty Management Pages
import Payment from "./pages/FacultyManagement/Payment";
import FacultyListPage from "./pages/FacultyManagement/FacultyListPage";
import AddFacultyPage from "./pages/FacultyManagement/AddFacultyPage";

const rolePermissions = {
  director: [
    "dashboard",
    "profile",
    "payslip",
    "announcement",
    "approveChargeHandover",
    "approveleave",
    "approveodleave",
  ],
  principal: [
    "dashboard",
    "profile",
    "payslip",
    "ComposeAnnouncementByPrincipal",
    "approveleave",
    "applyodleave",
    "approveodleave",
  ],
  HOD: [
    "dashboard",
    "profile",
    "payslip",
    "ComposeByHOD",
    "applyChargeHandover",
    "approveChargeHandover",
    "applyleave",
    "approveleave",
    "applyodleave",
    "approveodleave",
  ],
  teaching: [
    "dashboard",
    "profile",
    "markattendance",
    "payslip",
    "announcement",
    "applyChargeHandover",
    "applyleave",
    "applyodleave",
  ],
  nonteaching: [
    "dashboard",
    "profile",
    "payslip",
    "announcementnonteaching", // Fixed: Correctly named permission for non-teaching
    "applyChargeHandover",
    "applyleave",
    "applyodleave",
  ],
  // New role for faculty management
  facultymanagement: [
    "addFaculty",
    "viewFaculties",
    "leaveRecords",
    "payment",
    "facultyProfile",
  ],
};

const globalStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ProtectedRoute = ({ children, isAuthenticated, userRole, routeName }) => {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  if (routeName && !rolePermissions[userRole]?.includes(routeName)) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-4">
            You do not have permission to access this page.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  return children;
};

const LoginPage = ({ onLogin }) => (
  <div>
    <Login onLogin={onLogin} />
  </div>
);

const SignupPage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Create Account
      </h1>
      <Signup />
      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  </div>
);

const StaffSidebar = ({ isOpen, handleMenuClick, userData }) => {
  const location = useLocation();

  const roleDisplayNames = {
    director: "Director",
    principal: "Principal",
    HOD: "Head of Department",
    teaching: "Teacher",
    nonteaching: "Non-Teaching Staff",
    facultymanagement: "Faculty Management",
  };

  // Get announcement route based on role
  const getAnnouncementRoute = (role) => {
    if (role === "HOD") {
      return "/dashboard/compose-hod-announcement";
    } else if (role === "principal") {
      return "/dashboard/compose-principal-announcement";
    } else if (role === "nonteaching") {
      return "/dashboard/announcementnonteaching";
    } else {
      return "/dashboard/announcement";
    }
  };

  // Get announcement title based on role
  const getAnnouncementTitle = (role) => {
    if (role === "HOD") {
      return "Compose Announcement";
    } else if (role === "principal") {
      return "Compose Announcement";
    } else if (role === "nonteaching") {
      return "Announcements";
    } else {
      return "Announcements";
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      href: "/dashboard",
      routeName: "dashboard",
    },
    {
      title: "Profile",
      icon: <User size={20} />,
      href: "/dashboard/profile",
      routeName: "profile",
    },
   
    {
      title: "Pay Slip",
      icon: <CreditCard size={20} />,
      href: "/dashboard/payslip",
      routeName: "payslip",
    },
    
    {
      title: getAnnouncementTitle(userData?.role),
      icon: <FileText size={20} />,
      href: getAnnouncementRoute(userData?.role),
      routeName:
        userData?.role === "HOD"
          ? "ComposeByHOD"
          : userData?.role === "principal"
          ? "ComposeAnnouncementByPrincipal"
          : userData?.role === "nonteaching"
          ? "announcementnonteaching"
          : "announcement",
    },
  
    {
      title: "Apply Charge Handover",
      icon: <FileText size={20} />,
      href: "/dashboard/applyChargeHandover",
      routeName: "applyChargeHandover",
    },
    {
      title: "Approve Charge Handover",
      icon: <BookMarked size={20} />,
      href: "/dashboard/approveChargeHandover",
      routeName: "approveChargeHandover",
    },
    {
      title: "Apply Leave",
      icon: <FileText size={20} />,
      href: "/dashboard/applyleave",
      routeName: "applyleave",
    },
    {
      title: "Approve Leave",
      icon: <BookOpen size={20} />,
      href: "/dashboard/approveleave",
      routeName: "approveleave",
    },
    {
      title: "Apply OD Leave",
      icon: <FileText size={20} />,
      href: "/dashboard/applyodleave",
      routeName: "applyodleave",
    },
    {
      title: "Approve OD Leave",
      icon: <User size={20} />,
      href: "/dashboard/approveodleave",
      routeName: "approveodleave",
    },
    {
      title: "Mark Attendance",
      icon: <User size={20} />,
      href: "/dashboard/markattendance",
      routeName: "markattendance",
    },
  
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    rolePermissions[userData?.role]?.includes(item.routeName)
  );

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:relative lg:translate-x-0 z-10 h-full transition-transform duration-300 ease-in-out bg-gradient-to-br from-indigo-700 to-purple-800 text-white shadow-xl`}
    >
      <style>{globalStyles}</style>
      <div className="flex flex-col h-full w-80">
        <div className="p-6 border-b border-indigo-600/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2">
              <BookOpen className="text-indigo-700" size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              {["teaching", "nonteaching"].includes(userData?.role)
                ? "Staff Portal"
                : "Admin Portal"}
            </h2>
          </div>
        </div>
        <nav className="flex-grow p-5 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1">
            {filteredMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 group ${
                    location.pathname === item.href
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-indigo-600/20 text-white group-hover:bg-indigo-500/30">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-indigo-600/50 pt-4">
            <button
              onClick={() => handleMenuClick({ action: "logout" })}
              className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
            >
              <div className="p-2 rounded-md bg-red-500/20 text-white group-hover:bg-red-500/30">
                <LogOut size={20} />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
        <div className="p-5 border-t border-indigo-600/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-600/20">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">{userData?.email}</p>
              <p className="text-xs text-indigo-200">
                {roleDisplayNames[userData?.role]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FacultySidebar = ({ isOpen, handleMenuClick, userData }) => {
  const location = useLocation();

  // Menu items with appropriate icons for faculty management
  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      href: "/dashboard",
      routeName: "dashboard",
    },
    {
      title: "Add Faculty",
      icon: <BookOpen size={20} />,
      href: "/dashboard/add-faculty",
      routeName: "addFaculty",
    },
    {
      title: "View Faculties",
      icon: <Users size={20} />,
      href: "/dashboard/view-faculties", // Fixed: Updated to match the route path
      routeName: "viewFaculties",
    },
    {
      title: "Leave Records",
      icon: <ClipboardCheck size={20} />,
      href: "/dashboard/leave-records",
      routeName: "leaveRecords",
    },
    {
      title: "Payment",
      icon: <CreditCard size={20} />,
      href: "/dashboard/payment",
      routeName: "payment",
    },
    {
      title: "Profile",
      icon: <User size={20} />,
      href: "/dashboard/faculty-profile",
      routeName: "facultyProfile",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    rolePermissions[userData?.role]?.includes(item.routeName)
  );

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:relative lg:translate-x-0 z-10 h-full transition-transform duration-300 ease-in-out bg-gradient-to-br from-indigo-700 to-purple-800 text-white shadow-xl`}
    >
      <style>{globalStyles}</style>
      <div className="flex flex-col h-full w-72">
        <div className="p-6 border-b border-indigo-600/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2">
              <BookOpen className="text-indigo-700" size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Faculty Management
            </h2>
          </div>
        </div>
        <nav className="flex-grow p-5 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1">
            {filteredMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 group ${
                    location.pathname === item.href
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-indigo-600/20 text-white group-hover:bg-indigo-500/30">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-indigo-600/50 pt-4">
            <button
              onClick={() => handleMenuClick({ action: "logout" })}
              className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
            >
              <div className="p-2 rounded-md bg-red-500/20 text-white group-hover:bg-red-500/30">
                <LogOut size={20} />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
        <div className="p-5 border-t border-indigo-600/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-600/20">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">{userData?.email}</p>
              <p className="text-xs text-indigo-200">Faculty Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("authToken");

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const validRoles = Object.keys(rolePermissions);
        const userRole = validRoles.includes(parsedUser.role)
          ? parsedUser.role
          : "teaching";

        setUserData({ ...parsedUser, role: userRole, token: savedToken });
        setIsAuthenticated(true);
        if (location.pathname === "/login" || location.pathname === "/") {
          navigate("/dashboard");
        }
      } catch (error) {
        localStorage.clear();
        setIsAuthenticated(false);
        setUserData(null);
        navigate("/login");
      }
    } else {
      if (!["/login", "/signup"].includes(location.pathname)) {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleMenuClick = (item) => {
    if (window.innerWidth < 1024) toggleSidebar();
    if (item?.action === "logout") {
      localStorage.clear();
      setIsAuthenticated(false);
      setUserData(null);
      navigate("/login");
    }
  };

  const handleLogin = (user) => {
    const validRoles = Object.keys(rolePermissions);
    const role = validRoles.includes(user.role) ? user.role : "teaching";
    const validatedUser = { ...user, role };
    localStorage.setItem("user", JSON.stringify(validatedUser));
    localStorage.setItem("authToken", user.token);
    setUserData(validatedUser);
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  // Determine which sidebar to show based on role
  const SidebarComponent =
    userData?.role === "facultymanagement" ? FacultySidebar : StaffSidebar;

  return (
    <>
      <style>{globalStyles}</style>
      <div className="flex h-screen w-full">
        {isAuthenticated && (
          <>
            <button
              onClick={toggleSidebar}
              className="lg:hidden fixed z-20 top-4 left-4 p-2 bg-gray-800 text-white rounded-md shadow-md"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {isOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                onClick={toggleSidebar}
              />
            )}
            <SidebarComponent
              isOpen={isOpen}
              handleMenuClick={handleMenuClick}
              userData={userData}
            />
          </>
        )}
        <div className="flex-grow p-0 overflow-auto w-full">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                >
                  {userData?.role === "facultymanagement" ? (
                    <FacultyListPage
                      userData={userData}
                      onLogout={() => handleMenuClick({ action: "logout" })}
                    />
                  ) : (
                    <Dashboard
                      userData={userData}
                      onLogout={() => handleMenuClick({ action: "logout" })}
                    />
                  )}
                </ProtectedRoute>
              }
            />
            {/* Staff Portal Routes */}
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="profile"
                >
                  <Profile userData={userData} />
                </ProtectedRoute>
              }
            />
           
            <Route
              path="/dashboard/applyChargeHandover"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="applyChargeHandover"
                >
                  <ApplyChargeHandoverForm userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/approveChargeHandover"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="approveChargeHandover"
                >
                  <ApproveChargeHandover userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applyleave"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="applyleave"
                >
                  <ApplyLeave userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/approveleave"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="approveleave"
                >
                  <ApproveLeave userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applyodleave"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="applyodleave"
                >
                  <ApplyODLeave userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/approveodleave"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="approveodleave"
                >
                  <ApproveODLeave userData={userData} />
                </ProtectedRoute>
              }
            />
           
          
           
            <Route
              path="/dashboard/payslip"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="payslip"
                >
                  <PaySlip userData={userData} />
                </ProtectedRoute>
              }
            />
            {/* Regular announcement for regular staff */}
            <Route
              path="/dashboard/announcement"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="announcement"
                >
                  <Announcement userData={userData} />
                </ProtectedRoute>
              }
            />
            {/* Fix for non-teaching announcements */}
            <Route
              path="/dashboard/announcementnonteaching"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="announcementnonteaching"
                >
                  <NonTeachingAnnouncements userData={userData} />
                </ProtectedRoute>
              }
            />
            {/* HOD announcement route */}
            <Route
              path="/dashboard/compose-hod-announcement"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="ComposeByHOD"
                >
                  <ComposeByHOD userData={userData} />
                </ProtectedRoute>
              }
            />
            {/* Principal announcement route */}
            <Route
              path="/dashboard/compose-principal-announcement"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="ComposeAnnouncementByPrincipal"
                >
                  <ComposeAnnouncementByPrincipal userData={userData} />
                </ProtectedRoute>
              }
            />
           
            <Route
              path="/dashboard/markattendance"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="markattendance"
                >
                  <MarkAttendance userData={userData} />
                </ProtectedRoute>
              }
            />
            {/* Faculty Management Routes */}
            <Route
              path="/dashboard/add-faculty"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="addFaculty"
                >
                  <AddFacultyPage userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/view-faculties"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="viewFaculties"
                >
                  <FacultyListPage userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/leave-records"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="leaveRecords"
                >
                  <ApproveLeave userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/payment"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="payment"
                >
                  <Payment userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/faculty-profile"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userData?.role}
                  routeName="facultyProfile"
                >
                  <Profile userData={userData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-full">
                  <h1 className="text-2xl font-bold">404 - Not Found</h1>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}
export default App;