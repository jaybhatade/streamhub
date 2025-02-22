import React, { useEffect, useState } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { 
  FaUser, 
  FaEnvelope, 
  FaSignOutAlt, 
  FaPhone, 
  FaHeart, 
  FaEdit,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HeaderTwo from '../components/HeaderTwo';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          try {
            const userDocRef = doc(db, 'users', userEmail);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              setUserDetails(userDocSnap.data());
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
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
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateDetails = () => {
    navigate('/form');
  };

  const ProfileSection = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-3 p-4 bg-zinc-900 rounded-lg transition-all duration-300 hover:bg-zinc-800">
      <Icon className="text-[#269FB6] text-xl" />
      <div>
        <p className="text-zinc-400 text-sm">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#269FB6]"></div>
        <p className="text-[#269FB6] mt-4">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <HeaderTwo title={"Profile"}/>
      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-black rounded-2xl p-6 my-6 mt-14 border border-zinc-800 shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-[#269FB6] rounded-full flex items-center justify-center mb-4">
              <FaUser className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : user.displayName || 'User'}
            </h2>
            {userDetails?.packageName && (
              <span className="bg-[#269FB6] text-white px-4 py-1 rounded-full text-sm">
                {userDetails.packageName}
              </span>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          {userDetails ? (
            <>
              <ProfileSection icon={FaEnvelope} label="Email" value={user.email} />
              <ProfileSection icon={FaPhone} label="Phone" value={userDetails.phoneNumber} />
              <ProfileSection 
                icon={FaHeart} 
                label="Interests" 
                value={userDetails.interests.join(', ')} 
              />
              
              {/* Actions */}
              <div className="flex flex-col space-y-4 mt-8">
                <button
                  onClick={handleUpdateDetails}
                  className="w-full bg-[#269FB6] hover:bg-[#1d7f91] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <FaEdit className="mr-2" />
                  Update Profile
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="text-center bg-zinc-900 p-8 rounded-xl border border-zinc-800">
              <p className="text-zinc-400 mb-6">Please complete your profile details</p>
              <button
                onClick={handleUpdateDetails}
                className="bg-[#269FB6] hover:bg-[#1d7f91] text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition-all duration-300 transform hover:scale-[1.02]"
              >
                <FaEdit className="mr-2" />
                Complete Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Logout</h3>
            <p className="text-zinc-400 mb-6">Are you sure you want to logout?</p>
            <div className="flex space-x-4">
              <button
                onClick={handleLogout}
                className="flex-1 bg-[#269FB6] hover:bg-[#1d7f91] text-white font-bold py-2 rounded-lg transition-colors"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;