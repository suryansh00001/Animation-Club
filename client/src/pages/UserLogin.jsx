import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/appContext';

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading } = useAppContext();
  
  // Check if signup mode from URL parameter
  const searchParams = new URLSearchParams(location.search);
  const isSignupMode = searchParams.get('mode') === 'signup';
  
  const [isLoginMode, setIsLoginMode] = useState(!isSignupMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    studentId: '',
    year: '',
    department: '',
    institution: '',
    experience: '',
    confirmPassword: ''
  });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        const registrationData = {
          name: formData.name,
          email: formData.email,
          password: formData.password, // This was missing!
          phone: formData.phone,
          studentId: formData.studentId,
          year: formData.year,
          department: formData.department,
          institution: formData.institution,
          experience: formData.experience
        };
        
        await register(registrationData);
      }
      
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in the context
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      studentId: '',
      year: '',
      department: '',
      institution: '',
      experience: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLoginMode ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              {isLoginMode ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLoginMode && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                      Student ID
                    </label>
                    <div className="mt-1">
                      <input
                        id="studentId"
                        name="studentId"
                        type="text"
                        required
                        value={formData.studentId}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Your student ID"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                      Academic Year
                    </label>
                    <div className="mt-1">
                      <select
                        id="year"
                        name="year"
                        required
                        value={formData.year}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Alumni">Alumni/Passout</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <div className="mt-1">
                      <input
                        id="department"
                        name="department"
                        type="text"
                        required
                        value={formData.department}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Your department/major"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                      Institution/University
                    </label>
                    <div className="mt-1">
                      <input
                        id="institution"
                        name="institution"
                        type="text"
                        required
                        value={formData.institution}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Your institution/university name"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Animation Experience Level
                  </label>
                  <div className="mt-1">
                    <select
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select experience level</option>
                      <option value="Beginner">Beginner (0-1 years)</option>
                      <option value="Intermediate">Intermediate (1-3 years)</option>
                      <option value="Advanced">Advanced (3+ years)</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLoginMode ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLoginMode ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Continue as guest
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
