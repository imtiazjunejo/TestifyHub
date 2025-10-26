import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  BookOpen,
  Home,
  TestTube,
  User,
  HelpCircle,
  MessageCircle,
  Plus,
  Settings,
  BarChart3,
  Award,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { authUser } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">TestifyHub</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 mt-8 px-4 overflow-y-auto">
        <div className="space-y-2">
          {/* Main Navigation */}
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
              isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </Link>

          {authUser?.role === 'Student' && (
            <>
              <Link
                to="/tests"
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive('/tests') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <TestTube className="h-5 w-5 mr-3" />
                Available Tests
              </Link>
              <Link
                to="/results"
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive('/results') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Award className="h-5 w-5 mr-3" />
                My Results
              </Link>
            </>
          )}

          {authUser?.role === 'Educator' && (
            <>
              <Link
                to="/create-test"
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive('/create-test') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Plus className="h-5 w-5 mr-3" />
                Create Test
              </Link>
              <Link
                to="/tests"
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive('/tests') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <TestTube className="h-5 w-5 mr-3" />
                My Tests
              </Link>
            </>
          )}

          {authUser?.role === 'Admin' && (
            <>
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive('/admin') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Admin Panel
              </Link>
              <Link
                to="/tests"
                className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                  isActive('/tests') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Analytics
              </Link>
            </>
          )}

          {/* Separator */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Account & Support */}
          <Link
            to="/profile"
            className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
              isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <User className="h-5 w-5 mr-3" />
            Profile Settings
          </Link>

          <Link
            to="/faq"
            className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
              isActive('/faq') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <HelpCircle className="h-5 w-5 mr-3" />
            FAQ
          </Link>

          <Link
            to="/help"
            className={`flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
              isActive('/help') ? 'bg-blue-50 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <MessageCircle className="h-5 w-5 mr-3" />
            Help & Support
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;