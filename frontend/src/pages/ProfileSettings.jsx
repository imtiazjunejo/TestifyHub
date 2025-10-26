import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Camera,
} from 'lucide-react';

const ProfileSettings = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    testReminders: true,
    resultNotifications: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
        <Header onMenuClick={() => setSidebarOpen(true)} title="Profile Settings" />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Settings
                </h1>

                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
                  <div className="relative">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {authUser?.name}
                    </h3>
                    <p className="text-gray-600">{authUser?.email}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {authUser?.role}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" /> Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Change Password */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Lock className="h-5 w-5 mr-2" /> Change Password
                    </h2>
                    <div className="space-y-4">
                      {['currentPassword', 'newPassword', 'confirmPassword'].map(
                        (field, index) => {
                          const labelMap = {
                            currentPassword: 'Current Password',
                            newPassword: 'New Password',
                            confirmPassword: 'Confirm New Password',
                          };
                          const showKey =
                            field === 'currentPassword'
                              ? 'current'
                              : field === 'newPassword'
                              ? 'new'
                              : 'confirm';

                          return (
                            <div key={index} className="relative">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {labelMap[field]}
                              </label>
                              <input
                                type={
                                  showPasswords[showKey] ? 'text' : 'password'
                                }
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Enter ${labelMap[field].toLowerCase()}`}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(showKey)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords[showKey] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>

                  {/* Notification Settings */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Bell className="h-5 w-5 mr-2" /> Notification Preferences
                    </h2>
                    <div className="space-y-4">
                      {[
                        {
                          key: 'emailNotifications',
                          title: 'Email Notifications',
                          desc: 'Receive notifications via email',
                        },
                        {
                          key: 'testReminders',
                          title: 'Test Reminders',
                          desc: 'Get reminded about upcoming tests',
                        },
                        {
                          key: 'resultNotifications',
                          title: 'Result Notifications',
                          desc: 'Get notified when results are available',
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.key]}
                              onChange={() =>
                                handleNotificationChange(item.key)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Privacy & Security */}
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2" /> Privacy & Security
                    </h2>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Account Privacy
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Control who can see your profile and activity
                        </p>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Public</option>
                          <option>Friends Only</option>
                          <option>Private</option>
                        </select>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Add an extra layer of security to your account
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;
