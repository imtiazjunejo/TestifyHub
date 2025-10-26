import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useTestStore } from '../store/useTestStore';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import {
  Users,
  BarChart3,
  Plus,
  FileText,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
  Settings,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Activity,
  Shield,
  GraduationCap,
  PieChart,
  LineChart,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { authUser, logout } = useAuthStore();
  const { tests, results, fetchTests, fetchUserResults, getAnalytics, updateTest, deleteTest } = useTestStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();

  useEffect(() => {
    fetchTests();
    if (authUser?.role === 'Student') {
      fetchUserResults();
    }
    if (authUser?.role === 'Educator' || authUser?.role === 'Admin') {
      getAnalytics().then(setAnalytics);
    }
  }, [authUser]);



  const renderStudentDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {authUser?.name}! 👋</h1>
            <p className="text-blue-100">Ready to take on new challenges today?</p>
          </div>
          <div className="hidden md:block">
            <GraduationCap className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Tests</p>
              <p className="text-2xl font-bold text-gray-900">{tests.filter(t => t.isActive).length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TestTube className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tests</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900">0 days</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Tests
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Results
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Progress
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <>
              {tests.filter(test => test.isActive).length === 0 ? (
                <div className="text-center py-12">
                  <TestTube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No tests available</h3>
                  <p className="text-gray-600 mb-6">Check back later for new tests from your educators</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Refresh Tests
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tests.filter(test => test.isActive).map(test => (
                    <div key={test._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{test.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{test.subject}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {test.duration} min
                            </div>
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              {test.questions?.length || 0} questions
                            </div>
                          </div>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      </div>

                      <div className="flex space-x-3">
                        <Link
                          to={`/take-test/${test._id}`}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium text-center flex items-center justify-center"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Take Test
                        </Link>
                        <button className="p-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'results' && (
            <>
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No results yet</h3>
                  <p className="text-gray-600 mb-6">Complete your first test to see your performance here</p>
                  <Link
                    to="#"
                    onClick={() => setActiveTab('overview')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Available Tests
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Your Test History</h3>
                    <div className="text-sm text-gray-600">
                      {results.length} test{results.length !== 1 ? 's' : ''} completed
                    </div>
                  </div>

                  {results.map(result => (
                    <div key={result._id} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          result.percentage >= 80 ? 'bg-green-100' :
                          result.percentage >= 60 ? 'bg-blue-100' :
                          result.percentage >= 40 ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Award className={`h-6 w-6 ${
                            result.percentage >= 80 ? 'text-green-600' :
                            result.percentage >= 60 ? 'text-blue-600' :
                            result.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{result.testId.title}</h4>
                          <p className="text-sm text-gray-600">{result.testId.subject}</p>
                          <p className="text-xs text-gray-500">
                            Completed on {new Date(result.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          result.percentage >= 80 ? 'text-green-600' :
                          result.percentage >= 60 ? 'text-blue-600' :
                          result.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.percentage}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.score}/{result.totalMarks} points
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                          result.percentage >= 80 ? 'bg-green-100 text-green-800' :
                          result.percentage >= 60 ? 'bg-blue-100 text-blue-800' :
                          result.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.percentage >= 80 ? 'Excellent' :
                           result.percentage >= 60 ? 'Good' :
                           result.percentage >= 40 ? 'Average' : 'Needs Improvement'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tests Completed</span>
                      <span className="font-semibold">{results.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Score</span>
                      <span className="font-semibold">
                        {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Highest Score</span>
                      <span className="font-semibold">
                        {results.length > 0 ? Math.max(...results.map(r => r.percentage)) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Goals</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Weekly Target</span>
                      <span className="font-semibold">3 tests</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="font-semibold text-green-600">{results.filter(r => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(r.createdAt) > weekAgo;
                      }).length} completed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Next Milestone</span>
                      <span className="font-semibold">80% avg score</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {results.slice(0, 3).map(result => (
                    <div key={result._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        result.percentage >= 70 ? 'bg-green-100' : result.percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <Award className={`h-4 w-4 ${
                          result.percentage >= 70 ? 'text-green-600' : result.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Completed "{result.testId.title}"</p>
                        <p className="text-xs text-gray-600">Score: {result.percentage}% • {new Date(result.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const handleToggleTestStatus = async (testId, currentStatus) => {
    try {
      await updateTest(testId, { isActive: !currentStatus });
      // The tests state will be updated automatically by Zustand
    } catch (error) {
      console.error('Failed to update test status:', error);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      try {
        await deleteTest(testId);
      } catch (error) {
        console.error('Failed to delete test:', error);
      }
    }
  };

  const renderEducatorDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {authUser?.name}! 👨‍🏫</h1>
            <p className="text-green-100">Manage your assessments and track student progress</p>
          </div>
          <div className="hidden md:block">
            <BookOpen className="h-16 w-16 text-green-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tests</p>
              <p className="text-2xl font-bold text-gray-900">{tests.filter(t => t.isActive).length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">
                {tests.reduce((sum, test) => sum + (test.questions?.length || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Performance</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.averageScore ? Math.round(analytics.averageScore) : 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/create-test"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Create New Test</h3>
              <p className="text-blue-100 text-sm">Design and publish assessments</p>
            </div>
            <Plus className="h-8 w-8 text-blue-200 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          to="/tests"
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Manage Tests</h3>
              <p className="text-green-100 text-sm">Edit, activate, or review tests</p>
            </div>
            <Settings className="h-8 w-8 text-green-200 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
              <p className="text-purple-100 text-sm">Track student performance</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-200 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Tests
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Students
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Test Management</h3>
                  <p className="text-gray-600">Create, edit, and manage your assessments</p>
                </div>
                <Link
                  to="/create-test"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Test
                </Link>
              </div>

              {tests.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No tests created yet</h3>
                  <p className="text-gray-600 mb-6">Create your first test to start assessing your students</p>
                  <Link
                    to="/create-test"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Test
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tests.map(test => (
                    <div key={test._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">{test.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{test.subject}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {test.duration} min
                            </div>
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              {test.questions?.length || 0} questions
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {test.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(test.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Link
                            to={`/tests`}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleToggleTestStatus(test._id, test.isActive)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              test.isActive
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {test.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            <Edit className="h-4 w-4 inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTest(test._id)}
                            className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Performance Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Tests Taken</span>
                      <span className="font-semibold text-lg">{analytics?.totalResults || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Score</span>
                      <span className="font-semibold text-lg text-blue-600">
                        {analytics?.averageScore ? Math.round(analytics.averageScore) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Highest Score</span>
                      <span className="font-semibold text-lg text-green-600">
                        {analytics?.results?.length > 0 ? Math.max(...analytics.results.map(r => r.percentage)) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pass Rate</span>
                      <span className="font-semibold text-lg">
                        {analytics?.results?.length > 0 ?
                          Math.round((analytics.results.filter(r => r.percentage >= 60).length / analytics.results.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Test Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Tests</span>
                      <span className="font-semibold text-lg">{tests.filter(t => t.isActive).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Inactive Tests</span>
                      <span className="font-semibold text-lg">{tests.filter(t => !t.isActive).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Questions/Test</span>
                      <span className="font-semibold text-lg">
                        {tests.length > 0 ? Math.round(tests.reduce((sum, test) => sum + (test.questions?.length || 0), 0) / tests.length) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Duration</span>
                      <span className="font-semibold text-lg">
                        {tests.length > 0 ? Math.round(tests.reduce((sum, test) => sum + test.duration, 0) / tests.length) : 0} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Results</h3>
                <div className="space-y-3">
                  {analytics?.results?.slice(0, 5).map(result => (
                    <div key={result._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          result.percentage >= 80 ? 'bg-green-100' :
                          result.percentage >= 60 ? 'bg-blue-100' :
                          result.percentage >= 40 ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <Award className={`h-4 w-4 ${
                            result.percentage >= 80 ? 'text-green-600' :
                            result.percentage >= 60 ? 'text-blue-600' :
                            result.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{result.testId.title}</p>
                          <p className="text-xs text-gray-600">by {result.userId.name} • {new Date(result.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          result.percentage >= 80 ? 'text-green-600' :
                          result.percentage >= 60 ? 'text-blue-600' :
                          result.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.percentage}%
                        </div>
                        <div className="text-xs text-gray-600">{result.score}/{result.totalMarks}</div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-600 text-center py-4">No results available yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance</h3>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Student Management</h4>
                  <p className="text-gray-600 mb-6">Detailed student analytics and management features coming soon</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    View All Students
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard 👑</h1>
            <p className="text-purple-100">Manage the entire TestifyHub platform</p>
          </div>
          <div className="hidden md:block">
            <Shield className="h-16 w-16 text-purple-200" />
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Results</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalResults || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Health</p>
              <p className="text-2xl font-bold text-green-600">98%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin"
          className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">User Management</h3>
              <p className="text-red-100 text-sm">Manage users and permissions</p>
            </div>
            <Users className="h-8 w-8 text-red-200 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          to="/tests"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Test Analytics</h3>
              <p className="text-blue-100 text-sm">View detailed test statistics</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-200 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">System Health</h3>
              <p className="text-green-100 text-sm">Monitor platform performance</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Reports</h3>
              <p className="text-yellow-100 text-sm">Generate system reports</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-200 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              System Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Platform Analytics
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activity Logs
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                    User Distribution
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Students</span>
                      <span className="font-semibold">0 (0%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Educators</span>
                      <span className="font-semibold">0 (0%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Admins</span>
                      <span className="font-semibold">1 (100%)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-green-600" />
                    Platform Growth
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tests This Week</span>
                      <span className="font-semibold">{tests.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Results This Week</span>
                      <span className="font-semibold">{analytics?.totalResults || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Engagement</span>
                      <span className="font-semibold">High</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <Settings className="h-6 w-6 text-gray-600 mb-2" />
                    <h4 className="font-medium text-gray-900">System Settings</h4>
                    <p className="text-sm text-gray-600">Configure platform</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <BarChart3 className="h-6 w-6 text-gray-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Generate Report</h4>
                    <p className="text-sm text-gray-600">Export analytics</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <Users className="h-6 w-6 text-gray-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Bulk Actions</h4>
                    <p className="text-sm text-gray-600">Manage multiple users</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <Shield className="h-6 w-6 text-gray-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Security</h4>
                    <p className="text-sm text-gray-600">Security settings</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <p className="text-gray-600">Manage all platform users</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Add New User
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">User Management System</h4>
                  <p className="text-gray-600 mb-6">Complete user management features coming soon</p>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      View All Users
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Tests</span>
                      <span className="font-semibold">{tests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Tests</span>
                      <span className="font-semibold">{tests.filter(t => t.isActive).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-semibold">
                        {tests.length > 0 ? Math.round((analytics?.totalResults || 0) / tests.length * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Users</span>
                      <span className="font-semibold">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Users</span>
                      <span className="font-semibold">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg. Session</span>
                      <span className="font-semibold">15 min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="font-semibold text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="font-semibold">120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="font-semibold text-green-600">0.1%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Top Performing Tests</h4>
                    <div className="space-y-2">
                      {tests.slice(0, 3).map(test => (
                        <div key={test._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-900">{test.title}</span>
                          <span className="text-sm font-medium text-blue-600">
                            {analytics?.averageScore ? Math.round(analytics.averageScore) : 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">New test created</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">User logged in</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Test completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Activity Logs</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">System startup completed</p>
                      <p className="text-xs text-gray-600">Just now</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Success</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Database connection established</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Info</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">User authentication successful</p>
                      <p className="text-xs text-gray-600">5 minutes ago</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Warning</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} title={`Welcome back, ${authUser?.name}!`} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {location.pathname === '/dashboard' && (
              <>
                {authUser?.role === 'Student' && renderStudentDashboard()}
                {authUser?.role === 'Educator' && renderEducatorDashboard()}
                {authUser?.role === 'Admin' && renderAdminDashboard()}
              </>
            )}
            {location.pathname === '/profile' && <ProfileSettings />}
            {location.pathname === '/faq' && <FAQ />}
            {location.pathname === '/help' && <HelpSupport />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;