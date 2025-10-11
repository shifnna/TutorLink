import React, { useState } from "react";
import {
  Bell,
  MessageCircle,
  Settings,
  User,
  Menu,
  X,
  CreditCard,
  Info,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

const NotificationsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const notifications = [
    {
      id: 1,
      type: "system",
      icon: <Info size={20} className="text-blue-600" />,
      title: "Tutor Request Approved",
      message: "Your tutor profile has been approved by the admin.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "payment",
      icon: <CreditCard size={20} className="text-green-600" />,
      title: "Payment Received",
      message: "You received ₹1500 from Student A for the session.",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 3,
      type: "system",
      icon: <Info size={20} className="text-yellow-600" />,
      title: "Password Updated",
      message: "Your password was successfully changed.",
      time: "1 day ago",
      read: true,
    },
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
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            icon={<Bell size={20} />}
            label="Notifications"
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 bg-white text-gray-800 rounded-l-3xl shadow-inner">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-700 mb-6">
          Notifications
        </h2>

        <Tabs defaultValue="all" className="mb-4">
          <TabsList className="bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {notifications.map((note) => (
            <Card
              key={note.id}
              className={`transition-all border-l-4 ${
                note.read
                  ? "border-gray-300 bg-gray-50"
                  : "border-blue-600 bg-gradient-to-r from-blue-50 to-white"
              } hover:shadow-md`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 bg-gray-100 rounded-full">{note.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{note.title}</p>
                  <p className="text-sm text-gray-600">{note.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{note.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
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

export default NotificationsPage;
