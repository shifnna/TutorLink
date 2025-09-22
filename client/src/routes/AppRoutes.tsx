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

function AppRoutes() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            
            <Route path="/signup" element={<Signup/>} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />

            <Route path="/explore-tutors" element={<ExploreTutors/>} />

            <Route path="/admin-dashboard" element={<AdminDashboard/>} />
            <Route path="/admin-dashboard/applications" element={<TutorApplications/>} />
            <Route path="/admin-dashboard/clients" element={<ClientsPage/>} />
            <Route path="/admin-dashboard/tutors" element={<TutorsPage/>} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRoutes
