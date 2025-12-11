import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  GraduationCap, Users, Shield, QrCode, Camera, MapPin, 
  BarChart3, Calendar, ArrowRight, Check, Eye, EyeOff,
  Fingerprint, Smartphone, Clock
} from 'lucide-react';
import { toast } from 'sonner';

type Role = 'student' | 'teacher' | 'admin' | null;

const Landing = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { id: 'student' as Role, icon: GraduationCap, label: 'Student', color: 'from-primary to-blue-500' },
    { id: 'teacher' as Role, icon: Users, label: 'Teacher', color: 'from-accent to-purple-500' },
    { id: 'admin' as Role, icon: Shield, label: 'Admin', color: 'from-success to-emerald-500' },
  ];

  const features = [
    { icon: Camera, title: 'Face / Selfie Verification', description: 'AI-powered identity confirmation' },
    { icon: QrCode, title: 'QR & NFC Ready', description: 'Instant scan-to-mark attendance' },
    { icon: Calendar, title: 'Timetable-linked Sessions', description: 'Auto-synced class schedules' },
    { icon: BarChart3, title: 'Insightful Reports', description: 'Real-time analytics dashboard' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('Please select a role first');
      return;
    }
    
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Login successful!');
      if (selectedRole === 'student') navigate('/student');
      else if (selectedRole === 'teacher') navigate('/teacher');
      else if (selectedRole === 'admin') navigate('/admin');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    if (!selectedRole) {
      toast.error('Please select a role first');
      return;
    }
    toast.info('Google SSO integration coming soon');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'linear-gradient(to right, hsl(222 47% 15% / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(222 47% 15% / 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success/10 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Login */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
          {/* Logo & Brand */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center glow-primary animate-glow">
                <Fingerprint className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-3xl font-mono gradient-text">IntelliAttend</h1>
                <p className="text-sm text-muted-foreground">Secure, smart & tamper-proof attendance</p>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="mb-8 animate-slide-up delay-100">
            <Label className="text-sm font-medium text-muted-foreground mb-3 block">Select your role</Label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 group ${
                      isSelected 
                        ? 'border-primary bg-primary/10 scale-105' 
                        : 'border-border/50 bg-card/40 hover:border-primary/50 hover:bg-card/60'
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className={`text-sm font-medium text-center ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {role.label}
                    </p>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 animate-slide-up delay-200">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">College Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-12 bg-card/60 border-border/50 focus:border-primary"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-card/60 border-border/50 focus:border-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In<ArrowRight className="w-5 h-5" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 animate-slide-up delay-300">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-background text-muted-foreground">or continue with</span>
            </div>
          </div>

          {/* SSO Button */}
          <Button 
            variant="glass" 
            size="lg" 
            className="w-full animate-slide-up delay-300"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with College SSO
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6 animate-slide-up delay-400">
            Protected by enterprise-grade security
          </p>
        </div>

        {/* Right Side - Hero Illustration */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 bg-gradient-to-br from-card/40 to-card/20 border-l border-border/30">
          {/* Hero Visual */}
          <div className="relative w-full max-w-md animate-slide-up">
            {/* Main Card */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">B.Tech CSE - 3rd Sem</h3>
                  <p className="text-sm text-muted-foreground">Data Structures · 9:00-10:00</p>
                </div>
              </div>
              
              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-2xl font-bold text-success">42</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <p className="text-2xl font-bold text-warning">3</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
                <div className="text-center p-3 bg-destructive/10 rounded-lg">
                  <p className="text-2xl font-bold text-destructive">5</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>

              {/* QR Preview */}
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl">
                <div className="w-20 h-20 bg-white rounded-lg p-2">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded opacity-80" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, hsl(222 47% 6% / 0.1) 4px, hsl(222 47% 6% / 0.1) 8px), repeating-linear-gradient(90deg, transparent, transparent 4px, hsl(222 47% 6% / 0.1) 4px, hsl(222 47% 6% / 0.1) 8px)'
                  }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Live QR Session</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-mono">04:35 remaining</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 glass-card p-3 rounded-xl animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Face Verified</p>
                  <p className="text-xs text-muted-foreground">98% match</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 glass-card p-3 rounded-xl animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Lab 101 · 12m away</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-md">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="flex items-start gap-3 p-4 glass-card rounded-xl animate-slide-up"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
