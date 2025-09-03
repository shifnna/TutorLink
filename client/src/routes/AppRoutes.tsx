import Home from "../pages/home";
import Signup from "../pages/auth/signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import ExploreTutors from "../pages/tutors.tsx/explore";
import { VerifyOtp } from "../pages/auth/verifyOtp";

function AppRoutes() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/exploreTutors" element={<ExploreTutors/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRoutes
