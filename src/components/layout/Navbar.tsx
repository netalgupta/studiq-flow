import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  GraduationCap,
  QrCode,
  LayoutDashboard,
  LogOut,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  userType: "student" | "faculty" | "admin" | "teacher";
  userName: string;
}

export const Navbar = ({ userType, userName }: NavbarProps) => {
  const location = useLocation();

  const studentLinks = [
    { path: "/student", label: "Dashboard", icon: LayoutDashboard },
    { path: "/student/schedule", label: "Schedule", icon: Calendar },
    { path: "/student/attendance", label: "Mark Attendance", icon: QrCode },
  ];

  const facultyLinks = [
    { path: "/faculty", label: "Dashboard", icon: LayoutDashboard },
    { path: "/faculty/attendance", label: "Take Attendance", icon: Users },
    { path: "/faculty/schedule", label: "Schedule", icon: Calendar },
  ];

  const teacherLinks = [
    { path: "/teacher", label: "Dashboard", icon: LayoutDashboard },
    { path: "/timetable", label: "Timetable", icon: Calendar },
  ];

  const adminLinks = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/timetable", label: "Timetable", icon: Calendar }, // admin-scoped
    { path: "/admin/reports", label: "Reports", icon: BarChart3 },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const links =
    userType === "student"
      ? studentLinks
      : userType === "admin"
      ? adminLinks
      : userType === "teacher"
      ? teacherLinks
      : facultyLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg font-mono gradient-text">HackTrack</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              // highlight for nested routes as well
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + "/") || (link.path !== "/" && location.pathname.startsWith(link.path));
              return (
                <Link key={link.path} to={link.path} aria-current={isActive ? "page" : undefined}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-2 transition-all duration-300",
                      isActive && "bg-primary/10 text-primary border border-primary/20"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground">{userName}</span>
            </div>
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
