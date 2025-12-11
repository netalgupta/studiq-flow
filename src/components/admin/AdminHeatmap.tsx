import { BarChart3 } from 'lucide-react';

export const AdminHeatmap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeSlots = ['8AM', '9AM', '10AM', '11AM', '12PM', '2PM', '3PM', '4PM'];

  // Mock heatmap data (attendance percentage)
  const heatmapData: Record<string, Record<string, number>> = {
    'Mon': { '8AM': 65, '9AM': 58, '10AM': 78, '11AM': 85, '12PM': 72, '2PM': 88, '3PM': 82, '4PM': 75 },
    'Tue': { '8AM': 70, '9AM': 75, '10AM': 88, '11AM': 92, '12PM': 68, '2PM': 85, '3PM': 90, '4PM': 78 },
    'Wed': { '8AM': 62, '9AM': 68, '10AM': 82, '11AM': 88, '12PM': 65, '2PM': 90, '3PM': 85, '4PM': 72 },
    'Thu': { '8AM': 72, '9AM': 78, '10AM': 85, '11AM': 90, '12PM': 70, '2PM': 92, '3PM': 88, '4PM': 80 },
    'Fri': { '8AM': 55, '9AM': 52, '10AM': 75, '11AM': 82, '12PM': 60, '2PM': 78, '3PM': 72, '4PM': 58 },
  };

  const getColor = (value: number) => {
    if (value >= 85) return 'bg-success';
    if (value >= 70) return 'bg-success/60';
    if (value >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const getTextColor = (value: number) => {
    if (value >= 85) return 'text-success-foreground';
    if (value >= 70) return 'text-success-foreground';
    if (value >= 60) return 'text-warning-foreground';
    return 'text-destructive-foreground';
  };

  // Department comparison data
  const departments = [
    { name: 'Computer Science', attendance: 88, color: 'bg-primary' },
    { name: 'Electronics', attendance: 82, color: 'bg-accent' },
    { name: 'Mechanical', attendance: 79, color: 'bg-success' },
    { name: 'Civil', attendance: 75, color: 'bg-warning' },
    { name: 'Chemical', attendance: 85, color: 'bg-destructive' },
  ];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/30 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Attendance Analytics</h3>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Heatmap */}
        <div>
          <h4 className="font-medium mb-4 text-sm text-muted-foreground">Attendance by Day & Time</h4>
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              {/* Time Header */}
              <div className="flex mb-2">
                <div className="w-12" />
                {timeSlots.map((time) => (
                  <div key={time} className="flex-1 text-center text-xs text-muted-foreground">
                    {time}
                  </div>
                ))}
              </div>

              {/* Heatmap Grid */}
              {days.map((day, dayIndex) => (
                <div key={day} className="flex mb-1 animate-slide-up" style={{ animationDelay: `${dayIndex * 50}ms` }}>
                  <div className="w-12 flex items-center text-sm font-medium">{day}</div>
                  {timeSlots.map((time) => {
                    const value = heatmapData[day][time];
                    return (
                      <div key={`${day}-${time}`} className="flex-1 px-0.5">
                        <div 
                          className={`h-10 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-105 cursor-pointer ${getColor(value)} ${getTextColor(value)}`}
                          title={`${day} ${time}: ${value}%`}
                        >
                          {value}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive" />
              <span>&lt;60%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-warning" />
              <span>60-70%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-success/60" />
              <span>70-85%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-success" />
              <span>&gt;85%</span>
            </div>
          </div>
        </div>

        {/* Department Comparison */}
        <div>
          <h4 className="font-medium mb-4 text-sm text-muted-foreground">Department Comparison</h4>
          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={dept.name} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{dept.name}</span>
                  <span className="text-sm font-bold">{dept.attendance}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${dept.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${dept.attendance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold gradient-text">84%</p>
              <p className="text-xs text-muted-foreground">Average Across All</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-success">+3.2%</p>
              <p className="text-xs text-muted-foreground">vs Last Month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
