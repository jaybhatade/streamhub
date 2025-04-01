import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import LogoHeader from '../components/LogoHeader';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import PropTypes from 'prop-types';

const AuthPage = ({ isLogin }) => {
  const [user, loading, error] = useAuthState(auth);
  const [initializing, setInitializing] = useState(true);
  const [isWebView, setIsWebView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
    checkIfWebView();
  }, []);

  useEffect(() => {
    if (!loading && !initializing && user) {
      navigate('/');
    }
  }, [user, loading, initializing, navigate]);

  const checkIfWebView = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsWebView(/webview|wv|android.+chrome|crios/i.test(userAgent));
  };

  if (loading || initializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#1d7283] text-2xl">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <>
      <LogoHeader/>
      <div className="min-h-[90vh] bg-black flex flex-col lg:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-[10vh] text-center text-3xl font-extrabold text-white">
            {isLogin ? 'Log in to your account' : 'Create a new account'}
          </h2>
        </div>

        <div className="mt-8 mb-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-zinc-800 py-8 px-4 mx-4 shadow rounded-xl sm:rounded-2xl sm:px-10">
            {isLogin ? <LoginForm isWebView={isWebView} /> : <SignUpForm isWebView={isWebView} />}
          </div>
        </div>
      </div>
    </>
  );
};

AuthPage.propTypes = {
  isLogin: PropTypes.bool.isRequired
};

export default AuthPage;