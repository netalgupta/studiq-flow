import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, CheckCircle, XCircle, Eye, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface PendingApproval {
  id: string;
  name: string;
  rollNumber: string;
  distance: number;
  time: string;
  confidence: number;
  status: 'auto-verified' | 'needs-review';
  avatar: string;
}

export const SelfieAttendanceMode = () => {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([
    { id: '1', name: 'Alex Chen', rollNumber: 'CS2024001', distance: 12, time: '9:02 AM', confidence: 98, status: 'auto-verified', avatar: 'AC' },
    { id: '2', name: 'Jordan Lee', rollNumber: 'CS2024002', distance: 28, time: '9:03 AM', confidence: 92, status: 'auto-verified', avatar: 'JL' },
    { id: '3', name: 'Sam Taylor', rollNumber: 'CS2024003', distance: 45, time: '9:05 AM', confidence: 67, status: 'needs-review', avatar: 'ST' },
    { id: '4', name: 'Riley Morgan', rollNumber: 'CS2024004', distance: 8, time: '9:04 AM', confidence: 96, status: 'auto-verified', avatar: 'RM' },
    { id: '5', name: 'Casey Brooks', rollNumber: 'CS2024005', distance: 52, time: '9:06 AM', confidence: 58, status: 'needs-review', avatar: 'CB' },
  ]);

  const handleApprove = (id: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    toast.success('Attendance approved!');
  };

  const handleReject = (id: string) => {
    setPendingApprovals(prev => prev.filter(p => p.id !== id));
    toast.error('Attendance rejected');
  };

  const autoVerified = pendingApprovals.filter(p => p.status === 'auto-verified').length;
  const needsReview = pendingApprovals.filter(p => p.status === 'needs-review').length;

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent/10">
            <Camera className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Student Self-Attendance Mode</h3>
            <p className="text-muted-foreground text-sm">
              Students mark themselves present by taking a selfie near the classroom; 
              validated by face match + geofence location.
            </p>
          </div>
        </div>

        {/* Geofence Info */}
        <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-primary/10 rounded-lg">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="font-medium">Lab 101</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">50m radius geofence active</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-success">Active</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{autoVerified}</p>
              <p className="text-sm text-muted-foreground">Auto-verified</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{needsReview}</p>
              <p className="text-sm text-muted-foreground">Needs review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <h3 className="font-semibold">Pending Approvals</h3>
        </div>

        <div className="divide-y divide-border/20">
          {pendingApprovals.map((approval, index) => (
            <div 
              key={approval.id} 
              className="p-4 hover:bg-secondary/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Avatar / Selfie Preview */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-bold overflow-hidden">
                    {approval.avatar}
                  </div>
                  {approval.status === 'needs-review' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-warning-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{approval.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{approval.rollNumber}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className={approval.distance <= 50 ? 'text-success' : 'text-destructive'}>
                        {approval.distance}m
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{approval.time}</span>
                  </div>
                </div>

                {/* Confidence & Actions */}
                <div className="flex flex-col items-end gap-2">
                  {/* Confidence Badge */}
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    approval.confidence >= 90 
                      ? 'bg-success/10 text-success' 
                      : approval.confidence >= 70 
                        ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                  }`}>
                    {approval.confidence}% match
                  </div>

                  {/* Status Chip */}
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    approval.status === 'auto-verified' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {approval.status === 'auto-verified' ? 'Auto-verified' : 'Needs review'}
                  </div>

                  {/* Action Buttons */}
                  {approval.status === 'needs-review' && (
                    <div className="flex gap-2 mt-1">
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleApprove(approval.id)}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(approval.id)}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {pendingApprovals.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending approvals</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
