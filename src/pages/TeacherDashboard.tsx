import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { StatCard } from '@/components/dashboard/StatCard';
import { QRAttendanceMode } from '@/components/teacher/QRAttendanceMode';
import { SelfieAttendanceMode } from '@/components/teacher/SelfieAttendanceMode';
import { ManualRollCallMode } from '@/components/teacher/ManualRollCallMode';
import { Users, UserCheck, Clock, AlertTriangle, QrCode, Camera, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('qr');

  const currentClass = {
    course: 'B.Tech CSE – 3rd Sem',
    subject: 'Data Structures',
    time: '9:00–10:00',
    room: 'Lab 101',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="faculty" userName="Dr. Sarah Wilson" />

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Class Header */}
        <div className="mb-6 animate-slide-up">
          <div className="glass-card p-4 rounded-xl border-l-4 border-l-primary">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-xl font-bold gradient-text">{currentClass.course}</h1>
                <p className="text-muted-foreground">{currentClass.subject} · {currentClass.time}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">Session Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Registered"
            value={50}
            subtitle="Total students"
            icon={Users}
            variant="primary"
            className="animate-slide-up delay-100"
          />
          <StatCard
            title="Present"
            value={42}
            subtitle="Marked today"
            icon={UserCheck}
            variant="success"
            className="animate-slide-up delay-200"
          />
          <StatCard
            title="Late Arrivals"
            value={3}
            subtitle="After 9:05"
            icon={Clock}
            variant="warning"
            className="animate-slide-up delay-300"
          />
          <StatCard
            title="Suspicious"
            value={2}
            subtitle="Patterns detected"
            icon={AlertTriangle}
            variant="accent"
            className="animate-slide-up delay-400"
          />
        </div>

        {/* Attendance Mode Tabs */}
        <div className="animate-slide-up delay-500">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-14 bg-card/60 backdrop-blur-xl border border-border/30 p-1 rounded-xl mb-6">
              <TabsTrigger 
                value="qr" 
                className="h-full rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                <QrCode className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">QR Code Scan</span>
                <span className="sm:hidden">QR</span>
              </TabsTrigger>
              <TabsTrigger 
                value="selfie" 
                className="h-full rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-purple-500 data-[state=active]:text-accent-foreground transition-all duration-300"
              >
                <Camera className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Selfie + Geo</span>
                <span className="sm:hidden">Selfie</span>
              </TabsTrigger>
              <TabsTrigger 
                value="manual" 
                className="h-full rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-success data-[state=active]:to-emerald-500 data-[state=active]:text-success-foreground transition-all duration-300"
              >
                <ClipboardList className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Manual Roll Call</span>
                <span className="sm:hidden">Manual</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="mt-0">
              <QRAttendanceMode />
            </TabsContent>

            <TabsContent value="selfie" className="mt-0">
              <SelfieAttendanceMode />
            </TabsContent>

            <TabsContent value="manual" className="mt-0">
              <ManualRollCallMode />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
