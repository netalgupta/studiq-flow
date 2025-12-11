import { Activity, Users, Clock, MapPin } from 'lucide-react';

interface LiveSession {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  mode: 'QR' | 'Selfie' | 'Manual';
  startTime: string;
}

export const AdminLiveSession = () => {
  const liveSessions: LiveSession[] = [
    { id: '1', subject: 'Data Structures', faculty: 'Dr. Sarah Wilson', room: 'Lab 101', present: 42, absent: 5, late: 3, total: 50, mode: 'QR', startTime: '9:00 AM' },
    { id: '2', subject: 'Machine Learning', faculty: 'Dr. John Smith', room: 'Room 205', present: 38, absent: 8, late: 2, total: 48, mode: 'Selfie', startTime: '9:00 AM' },
    { id: '3', subject: 'Web Development', faculty: 'Prof. Emily Brown', room: 'Lab 102', present: 35, absent: 10, late: 0, total: 45, mode: 'Manual', startTime: '9:30 AM' },
    { id: '4', subject: 'Database Systems', faculty: 'Dr. Michael Lee', room: 'Room 301', present: 28, absent: 2, late: 5, total: 35, mode: 'QR', startTime: '10:00 AM' },
  ];

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'QR': return 'bg-primary/10 text-primary';
      case 'Selfie': return 'bg-accent/10 text-accent';
      case 'Manual': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Live Sessions</h3>
        </div>
        <span className="text-sm text-muted-foreground">{liveSessions.length} active</span>
      </div>

      <div className="divide-y divide-border/20">
        {liveSessions.map((session, index) => {
          const attendancePercent = Math.round((session.present / session.total) * 100);
          return (
            <div 
              key={session.id} 
              className="p-4 hover:bg-secondary/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="font-medium">{session.subject}</h4>
                  <p className="text-sm text-muted-foreground">{session.faculty}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModeColor(session.mode)}`}>
                  {session.mode}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {session.room}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {session.startTime}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {session.total} students
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <div className="h-full flex">
                  <div 
                    className="bg-success transition-all duration-500" 
                    style={{ width: `${(session.present / session.total) * 100}%` }} 
                  />
                  <div 
                    className="bg-warning transition-all duration-500" 
                    style={{ width: `${(session.late / session.total) * 100}%` }} 
                  />
                  <div 
                    className="bg-destructive transition-all duration-500" 
                    style={{ width: `${(session.absent / session.total) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-4">
                  <span className="text-success">{session.present} present</span>
                  <span className="text-warning">{session.late} late</span>
                  <span className="text-destructive">{session.absent} absent</span>
                </div>
                <span className="font-bold text-primary">{attendancePercent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
