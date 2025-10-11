
import React, { useState } from "react";
import {
  Bell,
  MessageCircle,
  Settings,
  User,
  Menu,
  X,
  Camera,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent } from "../../components/ui/card";

const ProfilePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState({
    name: "Shifna Majeed",
    email: "shifna@example.com",
    phone: "+91 9876543210",
    bio: "Passionate tutor specialized in web development, helping students master full-stack JavaScript.",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen text-gray-100 bg-gradient-to-br from-[#0B1120] via-[#1a2040] to-[#0B1120]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-[#11182a]/90 backdrop-blur-md shadow-lg border-r border-white/10 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h1
            className={`text-lg font-bold bg-gradient-to-r from-yellow-300 to-pink-500 bg-clip-text text-transparent transition-all ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            TutorLink
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex flex-col mt-4">
          <SidebarItem
            icon={<MessageCircle size={20} />}
            label="Messages"
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<Bell size={20} />}
            label="Notifications"
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<User size={20} />}
            label="Profile"
            active
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            sidebarOpen={sidebarOpen}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white text-gray-800 rounded-l-3xl shadow-inner">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-700 mb-6">
          My Profile
        </h2>

        <Card className="max-w-3xl mx-auto shadow-md border-none">
          <CardContent className="p-6">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
                  <Camera size={16} />
                  <input type="file" className="hidden" />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            {/* Editable Info */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  active = false,
  sidebarOpen,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  sidebarOpen: boolean;
}) => (
  <button
    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
      active
        ? "bg-gradient-to-r from-blue-700 to-purple-700 text-white font-semibold"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    } ${!sidebarOpen && "justify-center"}`}
  >
    {icon}
    {sidebarOpen && <span>{label}</span>}
  </button>
);

export default ProfilePage;
