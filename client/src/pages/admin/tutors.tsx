import { useEffect, useState } from "react";
import Header from "../../components/adminCommon/header";
import TableList from "../../components/adminCommon/tableList";
import { IUser } from "../../types/IUser";
import { adminService } from "../../services/adminService";
import SearchBar from "../../components/adminCommon/searchBar";

const TutorsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [tutors, setTutors] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await adminService.getAllTutors();
        if (res.success && res.data) {
          setTutors(
            res.data.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              isBlocked: u.isBlocked || false,
              isVerified: u.isVerified,
              joinedDate: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString()
                : "Unknown",
              profileImage: u.profileImage || null,
              tutorProfile: u.tutorProfile || null,
            }))
          );
        } else {
          console.error(res.message || "Failed to load tutors");
          setTutors([]);
        }
      } catch (error) {
        console.error("Failed to load tutors:", error);
        setTutors([]);
      }
    };

    fetchTutors();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      console.log('id:',id)
      if (window.confirm("Are you sure?")) {
        const updatedUser = await adminService.toggleUserStatus(id);
        if (updatedUser.success && updatedUser.data) {
          setTutors((prev) =>
            prev.map((u) =>
              u.id === id ? { ...u, isBlocked: updatedUser.data!.isBlocked } : u
            )
          );
        }
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const filteredUsers = tutors.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      tutor.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-8">
      <Header name={"Tutors"} />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
      />

      <TableList users={filteredUsers} handleToggleStatus={handleToggleStatus} />
    </div>
  );
};

export default TutorsPage;
