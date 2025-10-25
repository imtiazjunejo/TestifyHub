import { useState } from 'react';
import { useTestStore } from '../store/useTestStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTest = () => {
  const { createTest, addQuestion } = useTestStore();
  const navigate = useNavigate();

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Test</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Test Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={testData.title}
                onChange={(e) => handleTestChange('title', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter test title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                value={testData.subject}
                onChange={(e) => handleTestChange('subject', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter subject"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={testData.duration}
                onChange={(e) => handleTestChange('duration', parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addNewQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Type</label>
                    <select
                      value={question.type}
                      onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="MCQ">Multiple Choice</option>
                      <option value="True/False">True/False</option>
                      <option value="Short Answer">Short Answer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Marks</label>
                    <input
                      type="number"
                      value={question.marks}
                      onChange={(e) => handleQuestionChange(index, 'marks', parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Question Text</label>
                  <textarea
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Enter your question"
                    required
                  />
                </div>

                {question.type === 'MCQ' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Options</label>
                    {question.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Correct Answer</label>
                  {question.type === 'True/False' ? (
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select answer</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter correct answer"
                      required
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Save size={20} />
            Create Test
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;