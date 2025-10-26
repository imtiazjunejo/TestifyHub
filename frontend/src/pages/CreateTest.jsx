import { useState } from 'react';
import { useTestStore } from '../store/useTestStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Plus, Trash2, Save, BookOpen, Clock, Target, HelpCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTest = () => {
  const { createTest, addQuestion } = useTestStore();
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [testData, setTestData] = useState({
    title: '',
    subject: '',
    duration: 60,
  });

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      type: 'MCQ',
      marks: 1,
    },
  ]);

  const handleTestChange = (field, value) => {
    setTestData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addNewQuestion = () => {
    setQuestions(prev => [...prev, {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      type: 'MCQ',
      marks: 1,
    }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate test data
    if (!testData.title || !testData.subject || !testData.duration) {
      toast.error('Please fill all test details');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.correctAnswer) {
        toast.error(`Please fill question ${i + 1} details`);
        return;
      }
      if (q.type === 'MCQ' && q.options.some(opt => !opt.trim())) {
        toast.error(`Please fill all options for question ${i + 1}`);
        return;
      }
    }

    try {
      const test = await createTest({
        ...testData,
        questions: questions.map(q => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          type: q.type,
          marks: q.marks,
        })),
      });

      toast.success('Test created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create test');
    }
  };



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
        <Header onMenuClick={() => setSidebarOpen(true)} title="Create New Test" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Test</h1>
                <p className="text-gray-600 text-lg">Design comprehensive assessments with ease</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
          {/* Test Details Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Test Configuration</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <BookOpen className="w-4 h-4" />
                    Test Title
                  </label>
                  <input
                    type="text"
                    value={testData.title}
                    onChange={(e) => handleTestChange('title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                    placeholder="Enter test title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Target className="w-4 h-4" />
                    Subject
                  </label>
                  <input
                    type="text"
                    value={testData.subject}
                    onChange={(e) => handleTestChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                    placeholder="Enter subject"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock className="w-4 h-4" />
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={testData.duration}
                    onChange={(e) => handleTestChange('duration', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Questions</h2>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addNewQuestion}
                  className="bg-white text-green-600 px-6 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus size={20} />
                  Add Question
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:border-blue-200 transition-all duration-200">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Question {index + 1}</h3>
                      </div>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Question Type</label>
                        <select
                          value={question.type}
                          onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
                        >
                          <option value="MCQ">Multiple Choice</option>
                          <option value="True/False">True/False</option>
                          <option value="Short Answer">Short Answer</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Marks</label>
                        <input
                          type="number"
                          value={question.marks}
                          onChange={(e) => handleQuestionChange(index, 'marks', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <label className="block text-sm font-semibold text-gray-700">Question Text</label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none resize-none"
                        rows="3"
                        placeholder="Enter your question here..."
                        required
                      />
                    </div>

                    {question.type === 'MCQ' && (
                      <div className="space-y-3 mb-6">
                        <label className="block text-sm font-semibold text-gray-700">Answer Options</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="relative">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                placeholder={`Option ${optionIndex + 1}`}
                                required
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <CheckCircle className="w-4 h-4" />
                        Correct Answer
                      </label>
                      {question.type === 'True/False' ? (
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none bg-white"
                          required
                        >
                          <option value="">Select correct answer</option>
                          <option value="True">True</option>
                          <option value="False">False</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={question.correctAnswer}
                          onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                          placeholder="Enter the correct answer"
                          required
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Save size={24} />
                    Create Test
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateTest;