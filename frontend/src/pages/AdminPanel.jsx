import { useEffect, useState } from 'react';
import { useTestStore } from '../store/useTestStore';
import { Users, BookOpen, FileText, BarChart3, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { getAnalytics } = useTestStore();
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    }
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {['overview', 'tests', 'results', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Results</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalResults}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageScore.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Tests</h2>
          </div>
          <div className="p-6">
            {analytics.results.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tests available</p>
            ) : (
              <div className="space-y-4">
                {analytics.results.map(result => (
                  <div key={result.testId._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{result.testId.title}</h3>
                        <p className="text-gray-600">{result.testId.subject}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(result.testId.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Questions: {result.testId.questions?.length || 0}</p>
                        <p className="text-sm text-gray-600">Duration: {result.testId.duration} min</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          result.testId.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.testId.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Test Results</h2>
          </div>
          <div className="p-6">
            {analytics.results.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No results available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Student</th>
                      <th className="text-left py-2">Test</th>
                      <th className="text-left py-2">Score</th>
                      <th className="text-left py-2">Percentage</th>
                      <th className="text-left py-2">Time Taken</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.results.map(result => (
                      <tr key={result._id} className="border-b">
                        <td className="py-2">{result.userId.name}</td>
                        <td className="py-2">{result.testId.title}</td>
                        <td className="py-2">{result.score}/{result.totalMarks}</td>
                        <td className="py-2">{result.percentage}%</td>
                        <td className="py-2">{result.timeTaken} min</td>
                        <td className="py-2">{new Date(result.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">
              User management features coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;