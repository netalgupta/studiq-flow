// src/pages/AdminReports.tsx
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

const AdminReports = () => {
  const [loading, setLoading] = useState(false);

  const downloadCSV = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/attendance?from=&to=");
      if (!res.ok) throw new Error("Failed to fetch report");
      const text = await res.text();
      const blob = new Blob([text], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_report.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Could not download report. Check console.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="admin" userName="Admin" />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <div className="bg-card p-4 rounded-lg">
          <p className="mb-4">Download attendance CSV reports for courses and date ranges.</p>
          <div className="flex gap-2">
            <Button onClick={downloadCSV} disabled={loading}>{loading ? "Preparing..." : "Download Attendance CSV"}</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
