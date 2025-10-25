import React from "react";
import { Input } from "../ui/input";
import { FaGraduationCap } from "react-icons/fa";
import { HiOutlineAdjustments } from "react-icons/hi";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import Dropdown from "./dropdown";

const Header: React.FC = () => {
  const { search, setSearch,} = useAuthStore();


  return (
    <div className="w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-purple-950 to-black shadow-md rounded-b-2xl">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <FaGraduationCap className="w-8 h-8 text-amber-400 animate-bounce" />
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-400 to-indigo-600">
              TutorLink
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-center items-center relative">
            <div className="w-full max-w-3xl relative">
              <Input
                placeholder="Search tutors by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full px-6 py-3 text-white bg-white/10 focus:ring-2 focus:ring-indigo-400 shadow-sm"
              />
              <HiOutlineAdjustments className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white cursor-pointer hover:text-gray-200 transition" />
            </div>
          </div>

          <Dropdown />
        </div>
      </header>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Header;
