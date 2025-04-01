import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaTimes } from 'react-icons/fa';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import PropTypes from 'prop-types';

const VERIFICATION_QUESTIONS = [
  {
    question: "When was the first Bollywood movie released?",
    answer: "1913",
    options: ["1913", "1920", "1905", "1930"]
  },
  {
    question: "When did India gain independence?",
    answer: "1947",
    options: ["1947", "1950", "1945", "1960"]
  },
  {
    question: "When was the first IPL cricket match held?",
    answer: "2008",
    options: ["2008", "2005", "2010", "2012"]
  }
];

const AgeVerificationModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FaTimes size={20} />
        </button>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">Age Verification Failed</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="bg-[#1d7283] text-white px-6 py-2 rounded-md hover:bg-[#1d7283] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d7283]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

AgeVerificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};

const AuthForm = ({ isLogin, onSubmit, onGoogleSignIn, isWebView, isSignUp, verificationQuestion }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isOver18, setIsOver18] = useState(null);
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (isSignUp) {
      if (isOver18 === null) {
        setError('Please confirm if you are 18 or older.');
        return;
      }
      if (!isOver18) {
        setModalMessage('You must be 18 or older to create an account.');
        setShowModal(true);
        return;
      }
      if (!verificationAnswer) {
        setError('Please answer the verification question.');
        return;
      }
      if (verificationAnswer !== verificationQuestion.answer) {
        setModalMessage('Based on your answer, you appear to be under 18. Please verify your age again.');
        setShowModal(true);
        return;
      }
    }

    try {
      await onSubmit(email, password);
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAgeVerification = (value) => {
    setIsOver18(value);
    if (value) {
      setShowVerification(true);
    } else {
      setModalMessage('You must be 18 or older to create an account.');
      setShowModal(true);
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="bg-zinc-700 focus:ring-[#1d7283] focus:border-[#1d7283] block w-full pl-10 sm:text-sm border-gray-600 rounded-md text-white h-10"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            {isLogin ? 'Enter password' : 'Set password'}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="bg-zinc-700 focus:ring-[#1d7283] focus:border-[#1d7283] block w-full pl-10 sm:text-sm border-gray-600 rounded-md text-white h-10"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {isSignUp && (
          <>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Are you 18 or older?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleAgeVerification(true)}
                  className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${
                    isOver18 === true
                      ? 'bg-[#1d7283] text-white border-[#1d7283]'
                      : 'bg-zinc-700 text-gray-300 border-gray-600 hover:bg-zinc-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleAgeVerification(false)}
                  className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${
                    isOver18 === false
                      ? 'bg-[#1d7283] text-white border-[#1d7283]'
                      : 'bg-zinc-700 text-gray-300 border-gray-600 hover:bg-zinc-600'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {showVerification && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  {verificationQuestion.question}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {verificationQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setVerificationAnswer(option)}
                      className={`py-2 px-4 border rounded-md text-sm font-medium ${
                        verificationAnswer === option
                          ? 'bg-[#1d7283] text-white border-[#1d7283]'
                          : 'bg-zinc-700 text-gray-300 border-gray-600 hover:bg-zinc-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1d7283] hover:bg-[#1d7283] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d7283]"
          >
            {isLogin ? 'Log in' : 'Register Now'}
          </button>
        </div>

        {!isWebView && (
          <div>
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FaGoogle className="mr-2" />
              {isLogin ? 'Log in with Google' : 'Sign up with Google'}
            </button>
          </div>
        )}

        {error && <p className="mt-2 text-sm text-[#1d7283]">{error}</p>}

        <div className="text-sm text-center mt-6">
          {isLogin ? (
            <Link to="/signup" className="font-medium text-[#1d7283] hover:text-[#1d7283]">
              Don&apos;t have an account? Sign up
            </Link>
          ) : (
            <Link to="/login" className="font-medium text-[#1d7283] hover:text-[#1d7283]">
              Already have an account? Log in
            </Link>
          )}
        </div>
      </form>

      <AgeVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
      />
    </>
  );
};

AuthForm.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onGoogleSignIn: PropTypes.func.isRequired,
  isWebView: PropTypes.bool.isRequired,
  isSignUp: PropTypes.bool,
  verificationQuestion: PropTypes.shape({
    question: PropTypes.string,
    answer: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string)
  })
};

const SignUpForm = ({ isWebView }) => {
  const navigate = useNavigate();
  const [verificationQuestion] = useState(() => {
    const randomIndex = Math.floor(Math.random() * VERIFICATION_QUESTIONS.length);
    return VERIFICATION_QUESTIONS[randomIndex];
  });

  const handleSignUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userEmail', email);
      navigate('/');
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      localStorage.setItem('userEmail', userEmail);
      navigate('/');
    } catch (error) {
      console.error("Error signing up with Google:", error);
    }
  };

  return (
    <AuthForm 
      isLogin={false} 
      onSubmit={handleSignUp} 
      onGoogleSignIn={handleGoogleSignIn} 
      isWebView={isWebView}
      isSignUp={true}
      verificationQuestion={verificationQuestion}
    />
  );
};

SignUpForm.propTypes = {
  isWebView: PropTypes.bool.isRequired
};

export default SignUpForm; 