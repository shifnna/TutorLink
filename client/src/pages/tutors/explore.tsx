import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import Header from "../../components/common/header";
import Sidebar from "../../components/common/sidebar";
import ApplicationModal from "./applicationModal";

const ExploreTutors: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900"
      onClick={closeModal} // 👈 clicking anywhere closes modal
    >
      {/* Navbar */}
      <Header />

      {/* Caption */}
      <div className="w-full text-center mt-4 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-purple-700 to-pink-600 drop-shadow-md">
          Explore Verified Tutors
        </h2>
        <p className="text-gray-700 mt-1 text-sm md:text-base">
          Connect with skilled and verified tutors to achieve your learning goals.
        </p>
      </div>

      {/* Sidebar + Tutors Grid */}
      <div className="flex w-full mt-6 px-4 md:px-8 gap-6">
        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Example button to open modal */}
      <div className="mt-6 flex justify-center">
      </div>

      {/* Modal */}
      <ApplicationModal isOpen={isModalOpen} onClose={closeModal} />

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ExploreTutors;
