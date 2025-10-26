import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';

const FAQ = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create my first test?",
          answer: "To create your first test, navigate to the 'Create Test' section from the sidebar. Fill in the test details including title, subject, duration, and add questions with multiple choice or text-based answers. Once saved, you can activate the test for students to take."
        },
        {
          question: "How do I register as a student or educator?",
          answer: "Click on the 'Sign Up' button on the landing page. Choose your role (Student or Educator) and fill in your details. You'll receive a confirmation email to verify your account before you can start using TestifyHub."
        },
        {
          question: "What are the different user roles?",
          answer: "TestifyHub has three user roles: Students can take tests and view their results, Educators can create and manage tests, and Admins have full system access including user management and system analytics."
        }
      ]
    },
    {
      category: "Taking Tests",
      questions: [
        {
          question: "How do I take a test?",
          answer: "From your dashboard, browse available tests in the 'Available Tests' tab. Click 'Take Test' on any active test. Answer all questions within the time limit. Your answers are automatically saved as you progress."
        },
        {
          question: "Can I pause and resume a test?",
          answer: "Tests cannot be paused once started. Make sure you have enough time before beginning. The timer will continue running even if you navigate away from the page."
        },
        {
          question: "What happens if I don't finish a test in time?",
          answer: "If the time expires, your test will be automatically submitted with the answers you've provided so far. Make sure to answer all questions before the time runs out."
        },
        {
          question: "How do I view my test results?",
          answer: "After completing a test, you can view your results in the 'My Results' section of your dashboard. Results include your score, percentage, and detailed answer breakdown."
        }
      ]
    },
    {
      category: "Creating & Managing Tests",
      questions: [
        {
          question: "What types of questions can I create?",
          answer: "You can create multiple choice questions (single or multiple correct answers), true/false questions, and short answer questions. Each question can have different marks assigned to it."
        },
        {
          question: "How do I set the correct answers?",
          answer: "For multiple choice questions, select the correct option(s) when creating the question. For text-based questions, provide the expected answer that will be compared with student responses."
        },
        {
          question: "Can I edit a test after publishing it?",
          answer: "You can edit test details and questions as long as the test is inactive. Once activated, you cannot modify questions but can deactivate/reactivate the test. For active tests, create a new version instead."
        },
        {
          question: "How do I view student results for my tests?",
          answer: "In your dashboard, go to 'My Tests' and click on any test to view detailed analytics including individual student performances, average scores, and completion rates."
        }
      ]
    },
    {
      category: "Account & Settings",
      questions: [
        {
          question: "How do I change my password?",
          answer: "Go to Profile Settings from the sidebar, navigate to the 'Change Password' section, enter your current password and new password, then save changes."
        },
        {
          question: "How do I update my profile information?",
          answer: "Visit Profile Settings to update your name, email, and notification preferences. Changes are saved automatically and take effect immediately."
        },
        {
          question: "What notification options are available?",
          answer: "You can enable/disable email notifications for test results, upcoming tests, and system announcements through your Profile Settings."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "I'm having trouble logging in",
          answer: "Make sure you're using the correct email and password. If you've forgotten your password, use the 'Forgot Password' link on the login page. Check if your account is verified."
        },
        {
          question: "My test results aren't showing up",
          answer: "Results are calculated immediately after test submission. If you don't see results, try refreshing the page. Contact support if the issue persists."
        },
        {
          question: "The website is running slowly",
          answer: "Try clearing your browser cache and cookies. Make sure you have a stable internet connection. If issues continue, try using a different browser or device."
        },
        {
          question: "How do I report a bug or issue?",
          answer: "Use the contact information below to reach our support team. Include detailed information about the issue, steps to reproduce it, and screenshots if possible."
        }
      ]
    }
  ];

  const toggleExpanded = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const filteredFaqData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
        <Header onMenuClick={() => setSidebarOpen(true)} title="Frequently Asked Questions" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center mb-4">
                    <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Find answers to common questions about TestifyHub. Can't find what you're looking for?
                    Contact our support team.
                  </p>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* FAQ Content */}
                <div className="p-6">
                  {filteredFaqData.length === 0 ? (
                    <div className="text-center py-12">
                      <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600">Try adjusting your search terms or contact support for help.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {filteredFaqData.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            {category.category}
                          </h2>
                          <div className="space-y-3">
                            {category.questions.map((faq, questionIndex) => {
                              const isExpanded = expandedItems.has(`${categoryIndex}-${questionIndex}`);
                              return (
                                <div key={questionIndex} className="border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() => toggleExpanded(categoryIndex, questionIndex)}
                                    className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                  >
                                    <span className="font-medium text-gray-900">{faq.question}</span>
                                    {isExpanded ? (
                                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 ml-2" />
                                    )}
                                  </button>
                                  {isExpanded && (
                                    <div className="px-4 pb-4">
                                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Support */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
                    <p className="text-gray-600 mb-6">
                      Our support team is here to help you with any questions or issues.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Live Chat
                      </button>
                      <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Support
                      </button>
                      <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;