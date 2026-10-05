import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, BadgeCheck, IndianRupee, ArrowRight } from "lucide-react";
import { adminService } from "../../services/adminService";
import { IAdminDashboardStats } from "../../types/IAdminDashboard";
import { ITutorApplication } from "../../types/ITutorApplication";
import Header from "../../components/adminCommon/header";
import StatCard from "../../components/adminCommon/statCard";
import StatusBadge from "../../components/adminCommon/statusBadge";
import { Button } from "../../components/ui/button";
import { Column, DataTable, TableCard, UserCell } from "../../components/adminCommon/dataTable";

const emptyStats: IAdminDashboardStats = {
  totalUsers: 0,
  totalTutors: 0,
  subscriptions: 0,
  revenue: 0,
  pendingApplications: [],
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<IAdminDashboardStats>(emptyStats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.success && res.data ? res.data : emptyStats);
      } catch {
        setStats(emptyStats);
      }
    };
    fetchStats();
  }, []);

  const columns: Column<ITutorApplication>[] = [
    {
      key: "tutor",
      header: "Tutor",
      render: (a) => <UserCell name={a.tutorId?.name} sub={a.tutorId?.email} image={a.profileImage} />,
    },
    { key: "education", header: "Education", render: (a) => a.education || "—" },
    { key: "experience", header: "Experience", render: (a) => a.experienceLevel || "—" },
    {
      key: "applied",
      header: "Applied on",
      render: (a) =>
        a.createdAt
          ? new Date(a.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          : "—",
    },
    { key: "status", header: "Status", render: () => <StatusBadge label="Pending" tone="amber" /> },
  ];

  return (
    <div className="space-y-6">
      <Header title="Admin Dashboard" eyebrow="Overview" subtitle="Monitor platform performance and activity" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total users" value={stats.totalUsers} icon={Users} tone="blue" />
        <StatCard label="Total tutors" value={stats.totalTutors} icon={GraduationCap} tone="purple" />
        <StatCard label="Subscriptions" value={stats.subscriptions} icon={BadgeCheck} tone="amber" />
        <StatCard label="Revenue" value={`₹${Number(stats.revenue).toLocaleString("en-IN")}`} icon={IndianRupee} tone="green" />
      </div>

      <TableCard
        title="Pending tutor applications"
        subtitle={`${stats.pendingApplications.length} waiting for review`}
      >
        <DataTable
          columns={columns}
          rows={stats.pendingApplications.slice(0, 5)}
          rowKey={(a) => a._id}
          emptyTitle="No pending applications"
          emptyText="New tutor applications will show up here."
        />
        {stats.pendingApplications.length > 0 && (
          <div className="px-6 py-4 border-t border-[#2A2E3D] flex justify-end">
            <Button
              onClick={() => navigate("/admin-dashboard/applications")}
              className="flex items-center gap-2 bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] rounded-xl font-semibold hover:scale-[1.02] transition"
            >
              Review applications <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </TableCard>
    </div>
  );
};

export default AdminDashboard;