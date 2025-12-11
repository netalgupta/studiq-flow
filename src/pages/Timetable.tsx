import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Play, CheckCircle, AlertCircle, QrCode, Camera, ClipboardList } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface TimetableSlot {
  id: string;
  subject: string;
  batch: string;
  room: string;
  status: 'scheduled' | 'completed' | 'pending' | 'active';
  faculty: string;
  studentCount: number;
}

type TimeSlot = '8:00-9:00' | '9:00-10:00' | '10:00-11:00' | '11:00-12:00' | '12:00-1:00' | '2:00-3:00' | '3:00-4:00' | '4:00-5:00';
type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

const Timetable = () => {
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);
  const [userType] = useState<'admin' | 'teacher'>('admin');

  const timeSlots: TimeSlot[] = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'];
  const days: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Mock timetable data
  const timetableData: Record<Day, Record<TimeSlot, TimetableSlot | null>> = {
    'Mon': {
      '8:00-9:00': null,
      '9:00-10:00': { id: '1', subject: 'Data Structures', batch: 'CSE-A', room: 'Lab 101', status: 'active', faculty: 'Dr. Sarah Wilson', studentCount: 50 },
      '10:00-11:00': { id: '2', subject: 'Algorithms', batch: 'CSE-A', room: 'Room 205', status: 'scheduled', faculty: 'Dr. Sarah Wilson', studentCount: 50 },
      '11:00-12:00': null,
      '12:00-1:00': null,
      '2:00-3:00': { id: '3', subject: 'Machine Learning', batch: 'CSE-B', room: 'Lab 102', status: 'pending', faculty: 'Dr. John Smith', studentCount: 48 },
      '3:00-4:00': null,
      '4:00-5:00': { id: '4', subject: 'Web Development', batch: 'CSE-A', room: 'Lab 103', status: 'completed', faculty: 'Prof. Emily Brown', studentCount: 45 },
    },
    'Tue': {
      '8:00-9:00': { id: '5', subject: 'Database Systems', batch: 'CSE-B', room: 'Room 301', status: 'scheduled', faculty: 'Dr. Michael Lee', studentCount: 52 },
      '9:00-10:00': null,
      '10:00-11:00': { id: '6', subject: 'Computer Networks', batch: 'CSE-A', room: 'Room 202', status: 'scheduled', faculty: 'Prof. David Chen', studentCount: 50 },
      '11:00-12:00': { id: '7', subject: 'Operating Systems', batch: 'CSE-B', room: 'Lab 101', status: 'scheduled', faculty: 'Dr. Lisa Anderson', studentCount: 48 },
      '12:00-1:00': null,
      '2:00-3:00': null,
      '3:00-4:00': { id: '8', subject: 'Software Engineering', batch: 'CSE-A', room: 'Room 305', status: 'scheduled', faculty: 'Prof. James Wilson', studentCount: 50 },
      '4:00-5:00': null,
    },
    'Wed': {
      '8:00-9:00': null,
      '9:00-10:00': { id: '9', subject: 'Data Structures', batch: 'CSE-B', room: 'Lab 101', status: 'completed', faculty: 'Dr. Sarah Wilson', studentCount: 48 },
      '10:00-11:00': null,
      '11:00-12:00': { id: '10', subject: 'Algorithms', batch: 'CSE-B', room: 'Room 205', status: 'completed', faculty: 'Dr. Sarah Wilson', studentCount: 48 },
      '12:00-1:00': null,
      '2:00-3:00': { id: '11', subject: 'AI & ML', batch: 'CSE-A', room: 'Lab 102', status: 'scheduled', faculty: 'Dr. John Smith', studentCount: 50 },
      '3:00-4:00': { id: '12', subject: 'Cloud Computing', batch: 'CSE-B', room: 'Room 401', status: 'scheduled', faculty: 'Prof. Mark Davis', studentCount: 52 },
      '4:00-5:00': null,
    },
    'Thu': {
      '8:00-9:00': { id: '13', subject: 'Compiler Design', batch: 'CSE-A', room: 'Room 302', status: 'scheduled', faculty: 'Dr. Robert Taylor', studentCount: 50 },
      '9:00-10:00': null,
      '10:00-11:00': { id: '14', subject: 'Theory of Computation', batch: 'CSE-B', room: 'Room 203', status: 'scheduled', faculty: 'Dr. Anna White', studentCount: 48 },
      '11:00-12:00': null,
      '12:00-1:00': null,
      '2:00-3:00': { id: '15', subject: 'Data Structures Lab', batch: 'CSE-A', room: 'Lab 101', status: 'pending', faculty: 'Dr. Sarah Wilson', studentCount: 25 },
      '3:00-4:00': { id: '16', subject: 'Data Structures Lab', batch: 'CSE-A', room: 'Lab 101', status: 'scheduled', faculty: 'Dr. Sarah Wilson', studentCount: 25 },
      '4:00-5:00': null,
    },
    'Fri': {
      '8:00-9:00': null,
      '9:00-10:00': { id: '17', subject: 'Machine Learning', batch: 'CSE-A', room: 'Lab 102', status: 'scheduled', faculty: 'Dr. John Smith', studentCount: 50 },
      '10:00-11:00': { id: '18', subject: 'Web Development', batch: 'CSE-B', room: 'Lab 103', status: 'scheduled', faculty: 'Prof. Emily Brown', studentCount: 48 },
      '11:00-12:00': null,
      '12:00-1:00': null,
      '2:00-3:00': null,
      '3:00-4:00': { id: '19', subject: 'Project Work', batch: 'CSE-A', room: 'Lab 104', status: 'scheduled', faculty: 'Various', studentCount: 50 },
      '4:00-5:00': { id: '20', subject: 'Project Work', batch: 'CSE-B', room: 'Lab 104', status: 'scheduled', faculty: 'Various', studentCount: 48 },
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-l-success bg-success/5';
      case 'completed': return 'border-l-primary bg-primary/5';
      case 'pending': return 'border-l-warning bg-warning/5';
      default: return 'border-l-muted bg-secondary/30';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success animate-pulse';
      case 'completed': return 'bg-primary';
      case 'pending': return 'bg-warning';
      default: return 'bg-muted-foreground';
    }
  };

  const handleStartAttendance = (mode: 'QR' | 'Selfie' | 'Manual') => {
    toast.success(`${mode} attendance started for ${selectedSlot?.subject}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType={userType} userName={userType === 'admin' ? 'Admin User' : 'Dr. Sarah Wilson'} />

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Weekly <span className="gradient-text">Timetable</span>
              </h1>
              <p className="text-muted-foreground">View and manage class schedules</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="glass-card rounded-xl overflow-hidden animate-slide-up delay-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border/30 bg-secondary/20">
                  <th className="p-4 text-left font-medium text-muted-foreground w-24">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Time
                  </th>
                  {days.map((day) => (
                    <th key={day} className="p-4 text-center font-medium">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, timeIndex) => (
                  <tr key={time} className="border-b border-border/20">
                    <td className="p-4 text-sm font-mono text-muted-foreground whitespace-nowrap">
                      {time}
                    </td>
                    {days.map((day, dayIndex) => {
                      const slot = timetableData[day][time];
                      return (
                        <td 
                          key={`${day}-${time}`} 
                          className="p-2"
                        >
                          {slot ? (
                            <Sheet>
                              <SheetTrigger asChild>
                                <button
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`w-full p-3 rounded-lg border-l-4 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer animate-slide-up ${getStatusColor(slot.status)}`}
                                  style={{ animationDelay: `${(timeIndex * 5 + dayIndex) * 30}ms` }}
                                >
                                  <div className="flex items-start justify-between mb-1">
                                    <p className="font-medium text-sm truncate">{slot.subject}</p>
                                    <div className={`w-2 h-2 rounded-full ${getStatusDot(slot.status)}`} />
                                  </div>
                                  <p className="text-xs text-muted-foreground">{slot.batch}</p>
                                  <p className="text-xs text-muted-foreground">{slot.room}</p>
                                </button>
                              </SheetTrigger>
                              <SheetContent className="w-[400px] sm:w-[540px]">
                                <SheetHeader>
                                  <SheetTitle className="text-left">Session Details</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-6">
                                  {/* Session Info */}
                                  <div className="glass-card p-4 rounded-xl">
                                    <h3 className="text-xl font-bold gradient-text mb-2">{slot.subject}</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{day}, {time}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{slot.room}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>{slot.studentCount} students expected</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status */}
                                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/30">
                                    {slot.status === 'active' && <><div className="w-2 h-2 rounded-full bg-success animate-pulse" /><span className="text-success font-medium">Session Active</span></>}
                                    {slot.status === 'completed' && <><CheckCircle className="w-4 h-4 text-primary" /><span className="text-primary font-medium">Attendance Completed</span></>}
                                    {slot.status === 'pending' && <><AlertCircle className="w-4 h-4 text-warning" /><span className="text-warning font-medium">Attendance Pending</span></>}
                                    {slot.status === 'scheduled' && <><Clock className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground font-medium">Scheduled</span></>}
                                  </div>

                                  {/* Start Attendance Buttons */}
                                  {(slot.status === 'scheduled' || slot.status === 'pending') && (
                                    <div className="space-y-3">
                                      <p className="text-sm font-medium">Start Attendance</p>
                                      <Button 
                                        variant="gradient" 
                                        className="w-full justify-start"
                                        onClick={() => handleStartAttendance('QR')}
                                      >
                                        <QrCode className="w-5 h-5" />
                                        QR Code Scan Mode
                                      </Button>
                                      <Button 
                                        variant="glass" 
                                        className="w-full justify-start"
                                        onClick={() => handleStartAttendance('Selfie')}
                                      >
                                        <Camera className="w-5 h-5" />
                                        Selfie + Geo Mode
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        className="w-full justify-start"
                                        onClick={() => handleStartAttendance('Manual')}
                                      >
                                        <ClipboardList className="w-5 h-5" />
                                        Manual Roll Call
                                      </Button>
                                    </div>
                                  )}

                                  {/* View Report for completed */}
                                  {slot.status === 'completed' && (
                                    <Button variant="gradient" className="w-full">
                                      <Play className="w-5 h-5" />
                                      View Attendance Report
                                    </Button>
                                  )}
                                </div>
                              </SheetContent>
                            </Sheet>
                          ) : (
                            <div className="h-20 rounded-lg border border-dashed border-border/30" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Timetable;
