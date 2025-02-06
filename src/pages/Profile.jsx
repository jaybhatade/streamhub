import React, { useEffect, useState } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase'; // Ensure `db` is exported from your firebase config
import { FaUser, FaEnvelope, FaSignOutAlt, FaPhone, FaHeart, FaEdit } from 'react-icons/fa';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user details from Firestore
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const userDocRef = doc(db, 'users', userEmail);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserDetails(userDocSnap.data());
          } else {
            console.log('No such document!');
          }
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      localStorage.removeItem('userEmail');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleUpdateDetails = () => {
    navigate('/form');
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
    <div className='w-full h-screen'>
      <Header />
      <div className='w-full h-full flex flex-col bg-gradient-to-b from-black via-[#2296ad]/20 to-black'>
        <div className='flex items-center justify-center px-4 py-16'>
          <div className="max-w-md w-full bg-black shadow-xl rounded-2xl overflow-hidden">
            <div className="relative">
              <div className="h-20 bg-gradient-to-t from-black to-[#269FB6]"></div>
            </div>
            <div className="pt-0 pb-8 px-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : user.displayName}
                </h2>
                <div className="flex items-center justify-center text-zinc-400 mb-4">
                  <FaEnvelope className="mr-2" />
                  <span>{user.email}</span>
                </div>
                {userDetails ? (
                  <>
                    <div className="flex items-center justify-center text-zinc-400 mb-4">
                      <FaPhone className="mr-2" />
                      <span>{userDetails.phoneNumber}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center text-zinc-400 mb-4">
                      <FaHeart className="mr-2" />
                      <span>Interests: {userDetails.interests.join(', ')}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-400 mb-4">
                    <p>Please complete your profile details</p>
                    <button
                      onClick={handleUpdateDetails}
                      className="mt-4 bg-[#269FB6] hover:bg-[#1d7f91] text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
                    >
                      <FaEdit className="mr-2" />
                      <span>Update Profile</span>
                    </button>
                  </div>
                )}
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