import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  BarChart3, 
  Clock, 
  Map, 
  ChevronRight, 
  Zap, 
  ArrowRight,
  Menu,
  X,
  Target,
  Layers,
  Sparkles,
  Brain
} from 'lucide-react';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Stress Analytics Dashboard",
      desc: "Visualize your mental and physical load with high-precision tracking.",
      icon: <BarChart3 className="text-cyan-400" size={24} />,
      gradient: "from-cyan-500/15 to-cyan-500/5"
    },
    {
      title: "Activity Logging",
      desc: "Effortlessly log work sessions, meetings, and rest periods in seconds.",
      icon: <Clock className="text-emerald-400" size={24} />,
      gradient: "from-emerald-500/15 to-emerald-500/5"
    },
    {
      title: "Mismatch Analysis",
      desc: "Identify when your stress levels don't align with your current activities.",
      icon: <Map className="text-amber-400" size={24} />,
      gradient: "from-amber-500/15 to-amber-500/5"
    },
    {
      title: "AI Stress Insights",
      desc: "Gemini-powered analysis of your patterns with actionable recommendations.",
      icon: <Brain className="text-violet-400" size={24} />,
      gradient: "from-violet-500/15 to-violet-500/5"
    }
  ];

  const steps = [
    {
      title: "Log Activities",
      desc: "Record your daily tasks and perceived effort levels.",
      icon: <Layers size={32} />
    },
    {
      title: "Analyze Stress",
      desc: "Our engine processes your data to find hidden physiological markers.",
      icon: <Target size={32} />
    },
    {
      title: "Discover Patterns",
      desc: "Receive actionable insights to optimize your recovery and performance.",
      icon: <Sparkles size={32} />
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200 font-sans selection:bg-cyan-500/20 selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-navy-900/80 backdrop-blur-xl shadow-lg shadow-black/20 py-3 border-b border-white/5' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="bg-gradient-to-br from-cyan-400 to-indigo-500 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">STMA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-cyan-300 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-400 hover:text-cyan-300 transition-colors">How it Works</a>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-cyan-300 transition-colors">Login</Link>
            <Link to="/signup" className="btn-accent px-5 py-2.5 rounded-full text-sm">
              Sign Up
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full glass-card border-t-0 rounded-t-none p-6 flex flex-col gap-4 md:hidden">
            <a href="#features" className="text-lg font-medium text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-lg font-medium text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
            <Link to="/login" className="w-full py-3 text-center border border-white/10 rounded-xl font-bold text-slate-300 hover:bg-white/[0.04] transition-colors">Login</Link>
            <Link to="/signup" className="w-full py-3 text-center btn-accent rounded-xl font-bold">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-cyan-500/[0.07] rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.06] rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-violet-500/[0.05] rounded-full blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-cyan-400 text-sm font-bold mb-8 animate-float">
            <Zap size={16} />
            <span>Now with AI-Powered Stress Analysis</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight max-w-4xl mx-auto">
            Understand the Hidden Relationship Between{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Time and Stress</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            STMA helps you analyze stress accumulation, discover delayed effects, and align your schedule with your body's natural recovery cycles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 btn-accent rounded-2xl text-lg flex items-center justify-center gap-2 group">
              Get Started for Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 glass-card hover:bg-white/[0.08] text-slate-300 rounded-2xl font-bold text-lg transition-all text-center">
              Login
            </Link>
          </div>
          
          {/* Hero Visual Mockup */}
          <div className="mt-20 max-w-5xl mx-auto rounded-2xl overflow-hidden glass-card shadow-2xl shadow-black/40">
             <div className="bg-navy-800 h-10 flex items-center px-4 gap-2 border-b border-white/[0.06]">
               <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
               <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
             </div>
             <div className="bg-navy-900/50 p-2 lg:p-4">
                <img src="/dashboard_mockup.png" alt="STMA Dashboard Interface" className="w-full h-auto rounded-xl shadow-2xl border border-white/10" />
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-cyan-400 tracking-widest uppercase mb-4">Precision Analytics</h2>
            <h3 className="text-4xl font-extrabold text-white">Designed for Deep Insight</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl glass-card glass-card-hover transition-all duration-300 transform hover:-translate-y-2">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} w-fit mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-white">Your Journey to Balance</h2>
            <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">Three simple steps to mastery over your stress-time cycles.</p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full glass-card shadow-glass-lg flex items-center justify-center text-cyan-400 mb-8 border border-white/[0.08]">
                    {step.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-white">{step.title}</h4>
                  <p className="text-slate-400 leading-relaxed font-medium max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[2rem] p-12 lg:p-20 text-center relative overflow-hidden border border-white/[0.08]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-8">Ready to align your time?</h2>
            <p className="text-slate-400 text-lg lg:text-xl mb-12 max-w-2xl mx-auto font-medium">
              Start analyzing your stress patterns today and join over 10,000 professionals optimizing their workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-10 py-5 btn-accent rounded-2xl font-bold text-lg flex items-center justify-center gap-2 group">
                Create Account Now
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2.5">
              <Activity className="text-cyan-400 w-6 h-6" />
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">STMA</span>
            </div>
            <div className="flex gap-8 text-sm font-semibold text-slate-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="text-center text-slate-600 text-sm font-medium">
            <p>© 2026 Stress-Time Misalignment Analyzer. Designed for human performance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;