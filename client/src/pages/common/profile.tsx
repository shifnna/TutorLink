import React from "react";
import { useAuthStore } from "../../store/authStore";
import TutorProfile from "../tutors/tutorProfile";
import ClientProfile from "../client/clientProfile";
import { IUser } from "../../types/IUser";


const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const role = (user as IUser)?.role;

  if (role === "tutor") {
    return <TutorProfile />;
  }

  return <ClientProfile />;
};

export default ProfilePage;