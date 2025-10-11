import React, { useState } from "react";
import { MessageCircle, Settings, User, Menu, X, Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";

const MessagesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chats = [
    { id: 1, name: "Aisha", lastMsg: "See you tomorrow!" },
    { id: 2, name: "Rahul", lastMsg: "Got it, thanks!" },
    { id: 3, name: "Fatima", lastMsg: "Meeting at 5?" },
    { id: 4, name: "John", lastMsg: "Sure, I’ll check it." },
  ];

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
            active
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<User size={20} />}
            label="Profile"
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            sidebarOpen={sidebarOpen}
          />
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-6 bg-white text-gray-800 rounded-l-3xl shadow-inner">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-700 mb-6">
          Messages
        </h2>

        <div className="flex flex-1 gap-6">
          {/* Chat list */}
          <Card className="w-1/3 bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-2xl">
            <CardContent className="p-4 overflow-y-auto max-h-[70vh]">
              <h3 className="font-semibold text-gray-700 mb-3">Chats</h3>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center rounded-full font-semibold">
                    {chat.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{chat.name}</p>
                    <p className="text-xs text-gray-500">{chat.lastMsg}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat window */}
          <Card className="flex-1 bg-white shadow-lg rounded-2xl flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white flex items-center justify-center font-semibold">
                A
              </div>
              <h3 className="font-semibold text-gray-800">Aisha</h3>
            </div>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="self-start bg-gray-100 px-4 py-2 rounded-xl max-w-[70%] text-gray-800 shadow-sm">
                Hi, how’s your preparation going?
              </div>
              <div className="self-end bg-gradient-to-r from-blue-700 to-purple-700 text-white px-4 py-2 rounded-xl max-w-[70%] shadow-md">
                Pretty good! Thanks for asking 😊
              </div>
            </CardContent>

            <div className="p-4 border-t border-gray-200 flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="bg-gradient-to-r from-blue-700 to-purple-700 text-white hover:opacity-90">
                <Send size={18} className="mr-1" /> Send
              </Button>
            </div>
          </Card>
        </div>
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

export default MessagesPage;
