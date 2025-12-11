import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, RefreshCw, StopCircle, Clock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ScanEntry {
  id: string;
  name: string;
  rollNumber: string;
  time: string;
  status: 'present' | 'late';
  avatar: string;
}

export const QRAttendanceMode = () => {
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(275); // 4:35 in seconds
  const [qrCode, setQrCode] = useState('INTELLI-DS-2024-001');

  const [liveScans] = useState<ScanEntry[]>([
    { id: '1', name: 'Alex Chen', rollNumber: 'CS2024001', time: '9:02 AM', status: 'present', avatar: 'AC' },
    { id: '2', name: 'Jordan Lee', rollNumber: 'CS2024002', time: '9:03 AM', status: 'present', avatar: 'JL' },
    { id: '3', name: 'Sam Taylor', rollNumber: 'CS2024003', time: '9:07 AM', status: 'late', avatar: 'ST' },
    { id: '4', name: 'Riley Morgan', rollNumber: 'CS2024004', time: '9:04 AM', status: 'present', avatar: 'RM' },
    { id: '5', name: 'Casey Brooks', rollNumber: 'CS2024005', time: '9:08 AM', status: 'late', avatar: 'CB' },
  ]);

  useEffect(() => {
    if (!isSessionActive) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRegenerateQR = () => {
    const newCode = `INTELLI-DS-${Date.now().toString(36).toUpperCase()}`;
    setQrCode(newCode);
    setTimeRemaining(300);
    toast.success('QR Code regenerated!');
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    toast.info('Attendance session ended');
  };

  const progress = (timeRemaining / 300) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* QR Code Panel */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Live QR Code</h3>
              <p className="text-sm text-muted-foreground">Students scan to mark attendance</p>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Circular Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="8"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
            </svg>
            
            {/* QR Code Image */}
            <div className="absolute inset-6 bg-white rounded-2xl p-4 flex items-center justify-center">
              <div 
                className="w-full h-full bg-gradient-to-br from-primary/80 to-accent/80 rounded-lg"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px),
                    repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)
                  `
                }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-2xl font-mono font-bold text-primary">{formatTime(timeRemaining)}</span>
            <span className="text-muted-foreground">remaining</span>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-full mb-6">
            <Shield className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium text-warning">QR must be scanned from camera only – gallery uploads disabled</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button 
              variant="glass" 
              className="flex-1"
              onClick={handleRegenerateQR}
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate QR
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={handleEndSession}
            >
              <StopCircle className="w-4 h-4" />
              End Session
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          QR is bound to class, time and teacher to prevent sharing
        </p>
      </div>

      {/* Live Scans Panel */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <h3 className="font-semibold">Live Scans</h3>
          </div>
          <span className="text-sm text-muted-foreground">{liveScans.length} students scanned</span>
        </div>

        <div className="divide-y divide-border/20 max-h-[500px] overflow-y-auto">
          {liveScans.map((scan, index) => (
            <div 
              key={scan.id} 
              className="p-4 hover:bg-secondary/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                  {scan.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{scan.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{scan.rollNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-muted-foreground">{scan.time}</p>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    scan.status === 'present' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {scan.status === 'present' ? (
                      <><CheckCircle className="w-3 h-3" /> Present</>
                    ) : (
                      <><AlertCircle className="w-3 h-3" /> Late</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
