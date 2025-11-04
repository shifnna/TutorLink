import Home from "../pages/common/home";
import Signup from "../pages/auth/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import ExploreTutors from "../pages/common/exploreTutors";
import VerifyOtp from "../pages/auth/verifyOtp";
import ForgotPassword from "../pages/auth/forgotPassword";
import ResetPassword from "../pages/auth/resetPassword";
import AdminDashboard from "../pages/admin/dashboard";
import TutorApplications from "../pages/admin/applicaions";
import ClientsPage from "../pages/admin/clients";
import TutorsPage from "../pages/admin/tutors";
import GuestRoute from "./guestRoute";
import ProtectedRoute from "./protectedRoute";
import Unauthorized from "../pages/security/unAuthorized";
import Blocked from "../pages/security/blocked";
import TutorSessionManagement from "../pages/tutors/sessionManagement";
import UserProfile from "../pages/common/userProfile";
import SlotManagement from "../pages/tutors/slotManagement";
import ClientSessionManagement from "../pages/client/sessionManagement";


function AppRoutes() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/unauthorized" element={<Unauthorized/>} />
            <Route path="/blocked" element={<Blocked/>} />
           
            <Route path="/signup" element={<GuestRoute><Signup/></GuestRoute> } />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/login" element={<GuestRoute><Login/></GuestRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />

            <Route path="/explore-tutors" element={<ProtectedRoute><ExploreTutors/></ProtectedRoute>} />
            <Route path="/user-profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
            <Route path="/tutor/session-management" element={<ProtectedRoute role="tutor"><TutorSessionManagement/></ProtectedRoute>} />
            <Route path="/client/session-management" element={<ProtectedRoute role="client"><ClientSessionManagement/></ProtectedRoute>} />
            <Route path="/slot-management" element={<ProtectedRoute><SlotManagement/></ProtectedRoute>} />

            <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>} />
            <Route path="/admin-dashboard/applications" element={<ProtectedRoute role="admin"><TutorApplications/></ProtectedRoute>} />
            <Route path="/admin-dashboard/clients" element={<ProtectedRoute role="admin"><ClientsPage/></ProtectedRoute>} />
            <Route path="/admin-dashboard/tutors" element={<ProtectedRoute role="admin"><TutorsPage/></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRoutes;
