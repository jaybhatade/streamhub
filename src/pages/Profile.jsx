import React, { useEffect, useState } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { FaUser, FaEnvelope, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      localStorage.removeItem('userEmail');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#269FB6]"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className='w-full h-screen '>
      <Header />
      <div className='w-full h-full flex flex-col bg-gradient-to-b from-black via-[#2296ad]/20 to-black '>
      <div className=' flex items-center justify-center px-4 py-16'>
        <div className="max-w-md w-full bg-black  shadow-xl rounded-2xl overflow-hidden">
          <div className="relative">
            <div className="h-28 bg-gradient-to-t from-black to-[#269FB6]"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              {user.photoURL ? (
                <img
                  className="w-32 h-32 rounded-full border-4 border-zinc-800 object-cover"
                  src={user.photoURL}
                  alt={`${user.displayName}'s profile picture`}
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-zinc-800 bg-zinc-700 flex items-center justify-center">
                  <FaUser className="w-16 h-16 text-zinc-400" />
                </div>
              )}
            </div>
          </div>
          <div className="pt-16 pb-8 px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{user.displayName}</h2>
              <div className="flex items-center justify-center text-zinc-400 mb-4">
                <FaEnvelope className="mr-2" />
                <span>{user.email}</span>
              </div>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
                
              <button
                onClick={handleLogout}
                className="bg-[#269FB6] hover:bg-[#269FB6] text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
              >
                <FaSignOutAlt className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;