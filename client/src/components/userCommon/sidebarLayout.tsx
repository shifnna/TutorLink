import { Outlet } from "react-router-dom";
import UserSidebar from "./sidebar";
import { Suspense } from "react";

export default function SidebarLayout() {
  return (
    <div className="flex min-h-screen bg-[#0E1016]">
      <UserSidebar />
      
      <div className="flex-1 min-w-0">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}