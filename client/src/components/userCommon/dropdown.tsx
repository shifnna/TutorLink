import { useState } from 'react'
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { toast, Toaster } from "react-hot-toast";
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import ApplicationModal from '../../pages/client/applicationModal';


const Dropdown = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAdminMsg, setShowAdminMsg] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    async function handleLogout() {
    try {
      await authService.logout();
      await logout();
      navigate("/login");
      toast.success('Logout successful');
    } catch (err) {
      console.error("Logout failed:", err);
    }
    }
  return (
          <div className="flex items-center gap-4 relative">
            <FaBell className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition" />

            <div className="relative">
              <FaUserCircle
                className="w-8 h-8 text-white cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              />

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg p-4 z-50">
                  <p className="font-bold text-gray-800">{user?.name || ""}</p>
                  <p className="font-bold tracking-tight bg-gradient-to-r from-yellow-600 via-pink-700 to-indigo-900 bg-clip-text text-transparent shining-text">{user?.role || ""}</p>

                  {/* Tutor Application Section */}
                  {user?.role === "client" && (
                    <div className="space-y-3">
                      {/* Pending */}
                      {user.tutorApplication?.status === "Pending" && (
                        <div className="p-3 bg-yellow-100 rounded-lg border-l-4 border-yellow-500 text-yellow-800 font-medium">
                          Your tutor application is pending review.
                        </div>
                      )}

                      {/* Rejected */}
                      {user.tutorApplication?.status === "Rejected" &&  (
                        <div className="p-3 bg-red-100 rounded-lg border-l-4 border-red-500 text-red-800 font-medium space-y-2">
                          <p>
                            Your tutor application was rejected by the admin.
                          </p>

                          {/* Admin Message */}
                          {user.tutorApplication?.adminMessage && (
                            <div>
                              <button
                                className="text-sm text-red-700 underline hover:text-red-900"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAdminMsg(!showAdminMsg);
                                }}
                              >
                                {showAdminMsg ? "Hide Reason" : "View Reason"}
                              </button>

                              {showAdminMsg && (
                                <div className="mt-2 p-2 bg-red-200 rounded text-sm text-red-900 shadow-inner">
                                  {user.tutorApplication.adminMessage}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Resubmit Button */}
                          <Button
                            onClick={()=>openModal()}
                            className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                          >
                            Resubmit Application
                          </Button>
                        </div>
                      )}

                      {/* No Application */}
                      {!user.tutorApplication?.status && (
                        <Button
                          onClick={(e)=>{e.stopPropagation(); openModal(); setMenuOpen(false)}}
                          className=" mb-2 w-full bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-lg font-medium"
                        >
                          Become a Tutor
                        </Button>
                      )}

                      {/* Approved */}
                      {user.tutorApplication?.status === "Approved" && (
                        <div className="p-3 bg-green-100 rounded-lg border-l-4 border-green-500 text-green-800 font-medium">
                          Your tutor application is approved! 🎉
                        </div>
                      )}
                    </div>
                  )}

                  {/* Other Options */}
                  <Button
                    variant="outline"
                    className="text-black w-full mb-2 rounded-lg border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                    onClick={()=>navigate("/user-profile")}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="text-black w-full mb-2 rounded-lg border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  >
                    Messages
                  </Button>
                  <Button
                    variant="outline"
                    className="text-black w-full mb-2 rounded-lg border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-lg border-red-400 text-red-600 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>  
            <ApplicationModal isOpen={isModalOpen} onClose={closeModal} />  
            <Toaster position="top-center" reverseOrder={false} />         
          </div>
          
  )
}

export default Dropdown
