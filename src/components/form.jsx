import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const UserInputForm = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    interests: [],
  });
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');

  const db = getFirestore();

  useEffect(() => {
    // Fetch userEmail from local storage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
      checkUserExists(userEmail);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const checkUserExists = async (email) => {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => {
      const updatedInterests = prev.interests.includes(interest)
        ? prev.interests.filter(item => item !== interest) // Remove if already selected
        : [...prev.interests, interest]; // Add if not selected
      return { ...prev, interests: updatedInterests };
    });
  };

  const canProceed = () => {
    switch (currentPage) {
      case 1: return formData.firstName.trim() !== '' && formData.lastName.trim() !== '';
      case 2: return formData.phoneNumber.length === 10;
      case 3: return formData.interests.length > 0;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    try {
      // Create a document in the "users" collection with the userEmail as the document ID
      await setDoc(doc(db, 'users', email), {
        email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        interests: formData.interests,
      });
      navigate('/'); // Redirect after successful submission
    } catch (error) {
      console.error('Error saving user data:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save user data.' }));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-8">Personal Information</h2>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-8">Contact Information</h2>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Enter 10-digit phone number"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-sm mt-2">{errors.phoneNumber}</p>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-8">Select Your Interests</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Action', 'Horror', 'Thriller', 'Comedy', 'Drama', 'Sci-Fi', 'Romance', 'Adventure'].map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestChange(interest)}
                  className={`px-4 py-2 rounded-lg ${
                    formData.interests.includes(interest)
                      ? 'bg-[#269FB6] text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  } transition-colors`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] bg-black text-white">
    <Header/>
      
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          {renderPage()}
          
          <div className="flex justify-between mt-8">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="flex items-center px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back
              </button>
            )}
            
            <button
              onClick={currentPage === 3 ? handleSubmit : () => setCurrentPage(prev => prev + 1)}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 ml-auto rounded-lg transition-colors ${
                canProceed()
                  ? 'bg-[#269FB6]'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >

              {currentPage === 3 ? (
                <>
                  Submit
                  <FaCheck className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              {[1, 2, 3].map((page) => (
                <div
                  key={page}
                  className={`h-2 w-2 rounded-full ${
                    page === currentPage ? 'bg-[#269FB6]' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInputForm;