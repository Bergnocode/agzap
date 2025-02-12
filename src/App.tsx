import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Filter, 
  Users, 
  UserCircle, 
  Bell, 
  FileText, 
  Settings, 
  MessageSquare,
  Moon,
  Sun,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';

// Import components
import LiveChatButton from './components/LiveChatButton';

function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'agenda', icon: Calendar, label: 'Agenda', path: '/agenda' },
    { id: 'novo-agendamento', icon: Filter, label: 'Novo Agendamento', path: '/novo-agendamento' },
    { id: 'profissionais', icon: Users, label: 'Profissionais', path: '/profissionais' },
    { id: 'clientes', icon: UserCircle, label: 'Clientes', path: '/clientes' },
    { id: 'notificacoes', icon: Bell, label: 'Notificações', path: '/notificacoes' },
    { id: 'relatorios', icon: FileText, label: 'Relatórios', path: '/relatorios' },
    { id: 'configuracoes', icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
          ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
      >
        <div className="h-full flex flex-col">
          <div className={`p-6 flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <MessageSquare className="w-8 h-8 text-[#00D856]" />
            {!sidebarCollapsed && (
              <h2 className="text-2xl font-bold text-[#00D856] ml-2">AGZap</h2>
            )}
          </div>
          
          <nav className="flex-1 px-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map(({ id, icon: Icon, label, path }) => (
                <li key={id}>
                  <Link
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                      location.pathname === path
                        ? 'bg-[#00D856] text-white'
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    {!sidebarCollapsed && <span className="whitespace-nowrap">{label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {!sidebarCollapsed && (
                <button 
                  onClick={handleSignOut}
                  className={`flex items-center ${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sair
                </button>
              )}
            </div>
          </div>

          {/* Toggle Sidebar Button - Only visible on desktop */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-[#00D856] text-white rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300"
          >
            <svg
              className={`w-4 h-4 transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="min-h-screen p-4">
          <Outlet />
        </div>
      </main>

      {/* Live Chat Button */}
      <LiveChatButton darkMode={darkMode} />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;