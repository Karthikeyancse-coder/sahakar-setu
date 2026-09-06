import { useState } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { LogOut, LayoutDashboard, Database, CheckCircle2 } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('ncct_token'));
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
        {/* Top Navbar */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">NCCT Portal</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('ncct_token');
              setIsLoggedIn(false);
            }}
            className="flex items-center px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400 rounded-xl font-medium text-sm transition-all"
          >
            <LogOut size={16} className="mr-2" /> Sign Out
          </button>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">Welcome to Dashboard</h1>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Your authentication token is active, and your frontend is successfully wired into your backend and PostgreSQL database.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center space-x-3">
                <Database className="text-blue-400 shrink-0" size={22} />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Database</h4>
                  <p className="text-sm font-medium text-white mt-0.5">PostgreSQL Connected</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center space-x-3">
                <CheckCircle2 className="text-emerald-400 shrink-0" size={22} />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security</h4>
                  <p className="text-sm font-medium text-white mt-0.5">JWT Token Active</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return currentView === 'login' ? (
    <Login
      onLoginSuccess={() => setIsLoggedIn(true)}
      onSwitchToRegister={() => setCurrentView('register')}
    />
  ) : (
    <Register
      onRegisterSuccess={() => setCurrentView('login')}
      onSwitchToLogin={() => setCurrentView('login')}
    />
  );
}

export default App;