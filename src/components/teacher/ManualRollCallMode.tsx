import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, Clock, XCircle, Shuffle, Users, Send } from 'lucide-react';
import { toast } from 'sonner';

interface StudentAttendance {
  id: string;
  rollNumber: string;
  name: string;
  status: 'present' | 'late' | 'absent' | null;
  time: string | null;
}

export const ManualRollCallMode = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentAttendance[]>([
    { id: '1', rollNumber: 'CS2024001', name: 'Alex Chen', status: 'present', time: '9:02 AM' },
    { id: '2', rollNumber: 'CS2024002', name: 'Jordan Lee', status: 'present', time: '9:03 AM' },
    { id: '3', rollNumber: 'CS2024003', name: 'Sam Taylor', status: 'late', time: '9:08 AM' },
    { id: '4', rollNumber: 'CS2024004', name: 'Riley Morgan', status: null, time: null },
    { id: '5', rollNumber: 'CS2024005', name: 'Casey Brooks', status: 'absent', time: null },
    { id: '6', rollNumber: 'CS2024006', name: 'Drew Anderson', status: null, time: null },
    { id: '7', rollNumber: 'CS2024007', name: 'Morgan Davis', status: 'present', time: '9:04 AM' },
    { id: '8', rollNumber: 'CS2024008', name: 'Quinn Wilson', status: null, time: null },
  ]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markStudent = (studentId: string, status: 'present' | 'late' | 'absent') => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, status, time: status !== 'absent' ? new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null }
          : s
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'present',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }))
    );
    toast.success('All students marked present');
  };

  const randomizeOrder = () => {
    setStudents((prev) => [...prev].sort(() => Math.random() - 0.5));
    toast.info('Order randomized to avoid bias');
  };

  const handleSubmit = () => {
    const unmarked = students.filter((s) => s.status === null).length;
    if (unmarked > 0) {
      toast.error(`${unmarked} students not marked yet`);
      return;
    }
    toast.success('Attendance submitted successfully!');
  };

  const presentCount = students.filter((s) => s.status === 'present').length;
  const lateCount = students.filter((s) => s.status === 'late').length;
  const absentCount = students.filter((s) => s.status === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-secondary/30"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="glass" onClick={randomizeOrder}>
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Randomize</span>
            </Button>
            <Button variant="success" onClick={markAllPresent}>
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Mark All Present</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-border/30 text-sm font-medium text-muted-foreground bg-secondary/20">
          <div className="col-span-2">Roll No</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-4">Status</div>
          <div className="col-span-2">Time</div>
        </div>

        <div className="divide-y divide-border/20 max-h-[400px] overflow-y-auto">
          {filteredStudents.map((student, index) => (
            <div 
              key={student.id} 
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 hover:bg-secondary/30 transition-all duration-300 animate-slide-up items-center"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Roll Number */}
              <div className="sm:col-span-2 font-mono text-sm text-primary">
                {student.rollNumber}
              </div>

              {/* Name */}
              <div className="sm:col-span-4 font-medium flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                  {student.name.split(' ').map((n) => n[0]).join('')}
                </div>
                {student.name}
              </div>

              {/* Status Buttons */}
              <div className="sm:col-span-4 flex gap-2">
                <button
                  onClick={() => markStudent(student.id, 'present')}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    student.status === 'present'
                      ? 'bg-success text-success-foreground shadow-lg shadow-success/25'
                      : 'bg-success/10 text-success hover:bg-success/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Present
                </button>
                <button
                  onClick={() => markStudent(student.id, 'late')}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    student.status === 'late'
                      ? 'bg-warning text-warning-foreground shadow-lg shadow-warning/25'
                      : 'bg-warning/10 text-warning hover:bg-warning/20'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Late
                </button>
                <button
                  onClick={() => markStudent(student.id, 'absent')}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    student.status === 'absent'
                      ? 'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25'
                      : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Absent
                </button>
              </div>

              {/* Time */}
              <div className="sm:col-span-2 text-sm text-muted-foreground font-mono">
                {student.time || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm">Present: <span className="font-bold">{presentCount}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-sm">Late: <span className="font-bold">{lateCount}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm">Absent: <span className="font-bold">{absentCount}</span></span>
            </div>
          </div>
          <Button variant="gradient" size="lg" onClick={handleSubmit}>
            <Send className="w-5 h-5" />
            Submit Attendance
          </Button>
        </div>
      </div>
    </div>
  );
};
