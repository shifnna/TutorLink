import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import Header from "../../components/userCommon/Header";
import { ITutor } from "../../types/ITutor";
import { useAuthStore } from "../../store/authStore";
import { tutorService } from "../../services/tutorService";

const ExploreTutors: React.FC = () => {
  //// const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [tutors, setTutors] = useState<ITutor[]>([]);
  const { search } = useAuthStore();

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTutors = async () => {
    try {
      const response = await tutorService.getAllTutors();
      if (response.success && response.data) setTutors(response.data);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    } finally {
      setLoading(false);
    }
  };
  fetchTutors();
}, []);

if (loading) return <p className="text-center mt-10">Loading tutors...</p>;



  // const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Biology", "Computer Science"];

  // const toggleFilter = (subject: string) => {
  //   setSelectedFilters(prev =>
  //     prev.includes(subject) ? prev.filter(f => f !== subject) : [...prev, subject]
  //   );
  // };

  const filteredTutors = tutors.filter((tutor) => {
    const name = typeof tutor.tutorId === "object" && tutor.tutorId?.name? tutor.tutorId.name : "Tutor";
    return name.toLowerCase().startsWith(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900">
      
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

      {/* Main content: Sidebar + Tutors Grid */}
      <div className="flex w-full mt-6 px-4 md:px-8 gap-6">

        {/* Sidebar Filters */}
        {/* <aside className="w-64 bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-md flex flex-col gap-6 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Filter by Subject</h3>
          <div className="flex flex-col gap-2">
            {subjects.map(subject => (
              <Button
                key={subject}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedFilters.includes(subject)
                    ? "bg-blue-900 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-200"
                }`}
                // onClick={() => toggleFilter(subject)}
              >
                • {subject}
              </Button>
            ))}
          </div>
        </aside> */}

        {/* Tutors Grid */}
        <section className="flex-1  max-h-[calc(100vh-120px)] grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor._id}
              className="flex flex-col justify-between bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 h-44"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={tutor.profileImage}
                  alt={typeof tutor.tutorId === "object" ? tutor.tutorId?.name : "Tutor"}
                  className="w-24 h-24 object-cover rounded-xl shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-bold">
                    {typeof tutor.tutorId === "object" && tutor.tutorId?.name ? tutor.tutorId.name : "Tutor"}
                  </h3>
                  <p className="text-gray-500 text-sm">{tutor.occupation}</p>
                  <p className="text-yellow-500 font-semibold mt-1 text-sm">⭐</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button className="bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-full px-4 py-1 text-sm hover:scale-105 transition">
                  Connect
                </Button>
                <Button className="bg-gray-100 text-gray-800 rounded-full px-4 py-1 text-sm hover:bg-gray-200 transition">
                  View
                </Button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ExploreTutors;
