import Home from "../pages/home";
import Signup from "../pages/auth/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import ExploreTutors from "../pages/tutors/explore";
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
import SessionManagement from "../pages/tutors/sessionManagement";
import UserProfile from "../pages/tutors/userProfile";


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
            <Route path="/session-management" element={<ProtectedRoute><SessionManagement/></ProtectedRoute>} />

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
