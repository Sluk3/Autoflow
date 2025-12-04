import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Phone,
  Menu,
  X,
  LogOut,
  Database
} from "lucide-react";
import { useAuth } from "./src/context/AuthContext";
import { Button } from "./src/components/ui/button";
import logo from "./components/shared/logo.png";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Vehicles", url: "/vehicles", icon: Car },
  { title: "Work Orders", url: "/workorders", icon: Wrench },
  { title: "Call Logs", url: "/calllogs", icon: Phone },
  { title: "Vehicle Catalog", url: "/vehiclecatalog", icon: Database }
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LDEzMCwyNDYsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none z-0" />

      <style>{`
        .glass-morphism {
          background: rgba(30, 41, 59, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.3);
        }
        .glass-morphism-card {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(148, 163, 184, 0.15);
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
        }
        .glass-hover {
          transition: all 0.2s ease;
        }
        .glass-hover:hover {
          background: rgba(51, 65, 85, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.4);
        }
      `}</style>

      {/* ========== DESKTOP SIDEBAR - SEMPRE VISIBILE SU DESKTOP ========== */}
      <aside className="hidden lg:flex w-64 flex-col glass-morphism border-r border-slate-700 relative z-10">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <img src={logo} alt="BC Performance" className="w-full h-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="glass-morphism-card rounded-xl p-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs truncate text-slate-400">{user?.email || ''}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT AREA ========== */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* MOBILE HEADER - SOLO SU MOBILE, NASCOSTO SU DESKTOP */}
        <header className="lg:hidden glass-morphism border-b border-slate-700">
          <div className="flex items-center justify-between p-4">
            <img src={logo} alt="BC Performance" className="h-8" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </header>

        {/* MOBILE MENU OVERLAY - SOLO SU MOBILE */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <div className="fixed top-[65px] left-0 right-0 bottom-0 z-50 lg:hidden">
              <div className="glass-morphism h-full overflow-y-auto">
                <nav className="p-4 space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="p-4 mt-4">
                  <div className="glass-morphism-card rounded-xl p-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}