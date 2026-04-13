import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Map, BarChart3, Clock, LogOut, Menu, X, User } from 'lucide-react';
import authService from '../services/authService';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getStoredUser();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 size={18} /> },
    { name: 'Mismatch Map', path: '/mismatch-map', icon: <Map size={18} /> },
    { name: 'Stress Lag', path: '/stress-lag', icon: <Activity size={18} /> },
    { name: 'Log Activity', path: '/log-activity', icon: <Clock size={18} /> }
  ];

  if (!isAuthenticated && location.pathname === '/') return null;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-navy-900/80 backdrop-blur-xl shadow-lg shadow-black/20 py-3 border-b border-white/5' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group cursor-pointer">
          <div className="bg-gradient-to-br from-cyan-400 to-indigo-500 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">STMA</span>
        </Link>
        
        {isAuthenticated && (
          <>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${
                    location.pathname === link.path 
                      ? 'text-cyan-400 bg-white/[0.06]' 
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-white/[0.04]'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] rounded-full border border-white/[0.08]">
                <User size={16} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-300">{user?.display_name || user?.username || 'User'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-rose-500/10"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>

            <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </>
        )}

        {!isAuthenticated && location.pathname !== '/' && (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-cyan-300 transition-colors">Login</Link>
            <Link to="/signup" className="btn-accent px-5 py-2.5 rounded-full text-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && isAuthenticated && (
        <div className="absolute top-full left-0 w-full glass-card border-t-0 rounded-t-none p-6 flex flex-col gap-3 md:hidden">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`flex items-center gap-3 text-lg font-medium p-3 rounded-xl transition-all ${
                location.pathname === link.path 
                  ? 'bg-cyan-500/10 text-cyan-400' 
                  : 'text-slate-300 hover:bg-white/[0.04]'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="h-[1px] bg-white/[0.06] my-2"></div>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
            className="flex items-center gap-3 text-lg font-bold text-rose-400 p-3 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
