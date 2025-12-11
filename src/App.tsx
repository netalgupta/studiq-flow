import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import StudentSchedule from "./pages/StudentSchedule";
import StudentAttendance from "./pages/StudentAttendance";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyAttendance from "./pages/FacultyAttendance";
import FacultySchedule from "./pages/FacultySchedule";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Timetable from "./pages/Timetable";
import NotFound from "./pages/NotFound";

// NEW imports — make sure these files exist (create them if not)
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Student */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/schedule" element={<StudentSchedule />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />

          {/* Faculty */}
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/faculty/attendance" element={<FacultyAttendance />} />
          <Route path="/faculty/schedule" element={<FacultySchedule />} />

          {/* Teacher */}
          <Route path="/teacher" element={<TeacherDashboard />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />         {/* new */}
          <Route path="/admin/reports" element={<AdminReports />} />     {/* new */}
          <Route path="/admin/timetable" element={<Timetable />} />

          {/* Backwards-compatible shortcut */}
          <Route path="/reports" element={<AdminReports />} />          {/* alias to avoid 404s */}

          {/* Timetable (global) */}
          <Route path="/timetable" element={<Timetable />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
