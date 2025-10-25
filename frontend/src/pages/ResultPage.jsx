import { useEffect } from 'react';
import { useTestStore } from '../store/useTestStore';
import { Award, Clock, Target, TrendingUp } from 'lucide-react';

const ResultPage = () => {
  const { results, fetchUserResults } = useTestStore();

  useEffect(() => {
    fetchUserResults();
  }, []);

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Test Results</h1>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <Award className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Results Yet</h2>
          <p className="text-gray-500">Take some tests to see your results here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(result => {
            const grade = getGrade(result.percentage);
            return (
              <div key={result._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{result.testId.title}</h3>
                  <div className={`text-2xl font-bold ${grade.color}`}>
                    {grade.grade}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="text-blue-600" size={20} />
                    <span className="text-gray-700">
                      Score: {result.score}/{result.totalMarks}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-green-600" size={20} />
                    <span className="text-gray-700">
                      Percentage: {result.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-600" size={20} />
                    <span className="text-gray-700">
                      Time Taken: {result.timeTaken} minutes
                    </span>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500">
                      Completed on {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {result.percentage}% correct
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Statistics */}
      {results.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{results.length}</div>
              <p className="text-gray-600">Tests Taken</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)}%
              </div>
              <p className="text-gray-600">Average Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {results.filter(r => r.percentage >= 70).length}
              </div>
              <p className="text-gray-600">Passed Tests</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.round(results.reduce((sum, r) => sum + r.timeTaken, 0) / results.length)} min
              </div>
              <p className="text-gray-600">Avg Time</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;