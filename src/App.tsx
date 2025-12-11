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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/schedule" element={<StudentSchedule />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/faculty/attendance" element={<FacultyAttendance />} />
          <Route path="/faculty/schedule" element={<FacultySchedule />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/admin/timetable" element={<Timetable />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
