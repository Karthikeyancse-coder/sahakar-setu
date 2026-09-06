import { useState } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('ncct_token'));
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to NCCT Dashboard</h1>
        <p className="text-slate-400 mb-6">You are successfully logged in and connected to PostgreSQL.</p>
        <button
          onClick={() => {
            localStorage.removeItem('ncct_token');
            setIsLoggedIn(false);
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition-colors"
        >
          Sign Out
        </button>
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