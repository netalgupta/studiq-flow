import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { 
  Users, TrendingUp, AlertTriangle, Calendar, BarChart3, 
  UserPlus, Download, Settings, ArrowRight, Clock,
  Building, GraduationCap, BookOpen, Activity
} from 'lucide-react';
import { AdminLiveSession } from '@/components/admin/AdminLiveSession';
import { AdminHeatmap } from '@/components/admin/AdminHeatmap';
import { AdminRiskStudents } from '@/components/admin/AdminRiskStudents';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="admin" userName="Admin User" />

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-muted-foreground">Overview of all attendance metrics</p>
            </div>
            <div className="flex gap-2">
              <Button variant="glass">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Link to="/admin/users">
                <Button variant="gradient">
                  <UserPlus className="w-4 h-4" />
                  Manage Users
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Overall Attendance"
            value="87.2%"
            trend="up"
            trendValue="+2.3% this month"
            icon={TrendingUp}
            variant="primary"
            className="animate-slide-up delay-100"
          />
          <StatCard
            title="Below 75%"
            value={23}
            subtitle="Students at risk"
            icon={AlertTriangle}
            variant="destructive"
            className="animate-slide-up delay-200"
          />
          <StatCard
            title="Avg by Dept"
            value="84%"
            subtitle="Across 5 departments"
            icon={Building}
            variant="accent"
            className="animate-slide-up delay-300"
          />
          <StatCard
            title="Most Skipped"
            value="Mon 9AM"
            subtitle="Data Structures"
            icon={Clock}
            variant="warning"
            className="animate-slide-up delay-400"
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 rounded-xl animate-slide-up delay-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl animate-slide-up delay-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-muted-foreground">Faculty Members</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl animate-slide-up delay-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-muted-foreground">Active Courses</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl animate-slide-up delay-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Live Sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Live Sessions */}
          <div className="lg:col-span-2">
            <AdminLiveSession />
          </div>

          {/* At Risk Students */}
          <div>
            <AdminRiskStudents />
          </div>
        </div>

        {/* Heatmap / Charts */}
        <div className="animate-slide-up">
          <AdminHeatmap />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link to="/admin/users" className="glass-card p-4 rounded-xl hover:border-primary/30 transition-all duration-300 group animate-slide-up delay-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">User Management</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          <Link to="/admin/timetable" className="glass-card p-4 rounded-xl hover:border-primary/30 transition-all duration-300 group animate-slide-up delay-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="font-medium">Timetable</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          <Link to="/admin/reports" className="glass-card p-4 rounded-xl hover:border-primary/30 transition-all duration-300 group animate-slide-up delay-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-success" />
                <span className="font-medium">Reports</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          <Link to="/admin/settings" className="glass-card p-4 rounded-xl hover:border-primary/30 transition-all duration-300 group animate-slide-up delay-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-warning" />
                <span className="font-medium">Settings</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
