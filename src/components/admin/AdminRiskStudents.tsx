import { Button } from '@/components/ui/button';
import { AlertTriangle, Mail, Eye, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface RiskStudent {
  id: string;
  name: string;
  rollNumber: string;
  attendance: number;
  department: string;
  avatar: string;
}

export const AdminRiskStudents = () => {
  const riskStudents: RiskStudent[] = [
    { id: '1', name: 'John Doe', rollNumber: 'CS2024012', attendance: 58, department: 'CSE', avatar: 'JD' },
    { id: '2', name: 'Jane Smith', rollNumber: 'EC2024008', attendance: 62, department: 'ECE', avatar: 'JS' },
    { id: '3', name: 'Mike Johnson', rollNumber: 'ME2024015', attendance: 65, department: 'ME', avatar: 'MJ' },
    { id: '4', name: 'Sarah Davis', rollNumber: 'CS2024023', attendance: 68, department: 'CSE', avatar: 'SD' },
    { id: '5', name: 'Tom Wilson', rollNumber: 'CE2024011', attendance: 72, department: 'CE', avatar: 'TW' },
  ];

  const handleSendReminder = (name: string) => {
    toast.success(`Reminder sent to ${name}`);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden h-full">
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold">Students at Risk</h3>
        </div>
        <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full font-medium">
          &lt;75% attendance
        </span>
      </div>

      <div className="divide-y divide-border/20 max-h-[400px] overflow-y-auto">
        {riskStudents.map((student, index) => (
          <div 
            key={student.id} 
            className="p-4 hover:bg-secondary/30 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-destructive/20 to-warning/20 flex items-center justify-center text-sm font-bold">
                {student.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{student.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{student.rollNumber} · {student.department}</p>
              </div>
              <div className={`text-lg font-bold ${
                student.attendance < 65 ? 'text-destructive' : 'text-warning'
              }`}>
                {student.attendance}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full transition-all duration-500 ${
                  student.attendance < 65 ? 'bg-destructive' : 'bg-warning'
                }`}
                style={{ width: `${student.attendance}%` }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 h-8 text-xs"
                onClick={() => handleSendReminder(student.name)}
              >
                <Mail className="w-3 h-3" />
                Email
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
                <Eye className="w-3 h-3" />
                View
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
                <MessageSquare className="w-3 h-3" />
                Note
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
