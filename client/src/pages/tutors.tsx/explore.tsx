import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaGraduationCap, FaUserCircle } from "react-icons/fa";
import { HiOutlineAdjustments } from "react-icons/hi"; // professional filter icon
import { useState } from "react";

interface Tutor {
  id: number;
  name: string;
  subject: string;
  rating: number;
  image: string;
}

const tutors: Tutor[] = [
  { id: 1, name: "John Doe", subject: "Mathematics", rating: 4.8, image: "/tutor1.jpg" },
  { id: 2, name: "Jane Smith", subject: "Physics", rating: 4.6, image: "/tutor2.jpg" },
  { id: 3, name: "Alice Johnson", subject: "Chemistry", rating: 4.7, image: "/tutor3.jpg" },
  { id: 4, name: "Bob Brown", subject: "English", rating: 4.5, image: "/tutor4.jpg" },
  { id: 5, name: "Eve Williams", subject: "Biology", rating: 4.9, image: "/tutor5.jpg" },
  { id: 6, name: "Mark Taylor", subject: "Computer Science", rating: 4.8, image: "/tutor6.jpg" },
  { id: 7, name: "Lily Adams", subject: "Mathematics", rating: 4.7, image: "/tutor7.jpg" },
  { id: 8, name: "Tom Harris", subject: "Physics", rating: 4.6, image: "/tutor8.jpg" },
];

const ExploreTutors: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Biology", "Computer Science"];

  const toggleFilter = (subject: string) => {
    setSelectedFilters(prev =>
      prev.includes(subject) ? prev.filter(f => f !== subject) : [...prev, subject]
    );
  };

  const filteredTutors = tutors.filter(
    t =>
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())) &&
      (selectedFilters.length === 0 || selectedFilters.includes(t.subject))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900">

  {/* Navbar */}
  <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 shadow-md rounded-b-2xl">
    <div className="flex items-center justify-between px-6 md:px-12 py-4">
      <div className="flex items-center gap-3">
        <FaGraduationCap className="w-8 h-8 text-amber-400" />
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-400 to-indigo-600 shining-text">
          TutorLink
        </h1>
      </div>

      {/* Search Bar */}
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

      <FaUserCircle className="w-10 h-10 text-white cursor-pointer" />
    </div>
  </header>

  {/* Caption Section: full width, above the flex container */}
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
    <aside className="w-64 bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-md flex flex-col gap-6 flex-shrink-0">
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
            onClick={() => toggleFilter(subject)}
          >
            • {subject}
          </Button>
        ))}
      </div>
    </aside>

    {/* Tutors Grid */}
    <section className="flex-1 max-h-[calc(100vh-120px)] grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredTutors.map((tutor) => (
        <div
          key={tutor.id}
          className="flex flex-col justify-between bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 h-44"
        >
          <div className="flex gap-4 items-center">
            <img
              src={tutor.image}
              alt={tutor.name}
              className="w-24 h-24 object-cover rounded-xl shadow-sm"
            />
            <div>
              <h3 className="text-lg font-bold">{tutor.name}</h3>
              <p className="text-gray-500 text-sm">{tutor.subject}</p>
              <p className="text-yellow-500 font-semibold mt-1 text-sm">⭐ {tutor.rating}</p>
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
