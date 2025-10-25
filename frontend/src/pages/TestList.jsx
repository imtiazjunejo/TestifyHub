import { useEffect, useState } from 'react';
import { useTestStore } from '../store/useTestStore';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Users, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const TestList = () => {
  const { authUser } = useAuthStore();
  const { tests, fetchTests, deleteTest, fetchTestResults } = useTestStore();
  const [selectedTest, setSelectedTest] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await deleteTest(testId);
        toast.success('Test deleted successfully');
      } catch (error) {
        toast.error('Failed to delete test');
      }
    }
  };

  const handleViewResults = async (testId) => {
    try {
      const results = await fetchTestResults(testId);
      setTestResults(results);
      setSelectedTest(testId);
      setShowResults(true);
    } catch (error) {
      toast.error('Failed to fetch results');
    }
  };

  const renderEducatorView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Tests</h1>
        <Link
          to="/create-test"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Test
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => (
          <div key={test._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{test.title}</h3>
                <p className="text-gray-600">{test.subject}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {test.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-500">Duration: {test.duration} minutes</p>
              <p className="text-sm text-gray-500">Questions: {test.questions?.length || 0}</p>
              <p className="text-sm text-gray-500">Total Marks: {test.totalMarks}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleViewResults(test._id)}
                className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 flex items-center justify-center gap-1"
              >
                <BarChart3 size={16} />
                Results
              </button>
              <Link
                to={`/edit-test/${test._id}`}
                className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700 flex items-center justify-center gap-1"
              >
                <Edit size={16} />
                Edit
              </Link>
              <button
                onClick={() => handleDelete(test._id)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 flex items-center justify-center gap-1"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudentView = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Tests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.filter(test => test.isActive).map(test => (
          <div key={test._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
            <p className="text-gray-600 mb-4">{test.subject}</p>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-500">Duration: {test.duration} minutes</p>
              <p className="text-sm text-gray-500">Questions: {test.questions?.length || 0}</p>
              <p className="text-sm text-gray-500">Total Marks: {test.totalMarks}</p>
            </div>

            <Link
              to={`/take-test/${test._id}`}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block text-center"
            >
              Take Test
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  if (showResults && selectedTest) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Test Results</h1>
          <button
            onClick={() => setShowResults(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Tests
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Student Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No results available yet.</p>
          ) : (
            <div className="space-y-4">
              {testResults.map(result => (
                <div key={result._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{result.userId.name}</h3>
                      <p className="text-gray-600">{result.userId.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{result.score}/{result.totalMarks}</p>
                      <p className="text-sm text-gray-600">{result.percentage}%</p>
                      <p className="text-sm text-gray-600">{result.timeTaken} min</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {authUser?.role === 'Educator' ? renderEducatorView() : renderStudentView()}
    </div>
  );
};

export default TestList;