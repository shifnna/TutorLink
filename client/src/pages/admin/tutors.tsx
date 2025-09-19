import { useState } from "react";
import { FaSearch } 
from "react-icons/fa";
import Header from "../../components/admin/header";
import TableList from "../../components/admin/tableList";

const TutorsPage: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white p-8">
      {/* Header */}
      <Header name={"Tutors"} />

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-purple-800/40 mb-6">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-white flex-1 placeholder-gray-400"
        />
      </div>

      {/* Users List */}
      <TableList/>
    </div>
  );
};

export default TutorsPage;
