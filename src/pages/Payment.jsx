import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaCreditCard, 
  FaWallet, 
  FaUniversity, 
  FaQrcode,
  FaCheck 
} from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import based on your firebase configuration

const PaymentGateway = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  // Pricing packages array
  const packs = [
    { Id: "V", Name:"Vip Pack", Amt: "249" },
    { Id: "P", Name:"Premium Pack", Amt: "199" },
    { Id: "B", Name:"Basic Pack", Amt: "99" }
  ];

  // Fetch price based on ID
  useEffect(() => {
    setLoading(true);
    const pack = packs.find(pack => pack.Id === id);
    
    if (pack) {
      setAmount(pack.Amt);
      setLoading(false);
    } else {
      setError("Invalid package ID");
      setLoading(false);
      // Redirect to error page or home after a delay
      setTimeout(() => navigate('/'), 3000);
    }
  }, [id, navigate]);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit / Debit Card',
      icon: <FaCreditCard className="w-6 h-6" />,
      description: 'Pay securely using your card'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <FaQrcode className="w-6 h-6" />,
      description: 'Pay using UPI apps'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <FaUniversity className="w-6 h-6" />,
      description: 'Pay using your bank account'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: <FaWallet className="w-6 h-6" />,
      description: 'Pay using digital wallet'
    }
  ];

  const handlePayment = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('userEmail'); // Fetch user email from local storage
    const packName = packs.find(pack => pack.Id === id)?.Name; // Get the package name
    // Store data in Firebase
    if (userEmail && packName) {
      const userRef = doc(db, 'users', userEmail); // Use userEmail instead of user.uid
      await setDoc(userRef, { packageName: packName }, { merge: true });
      setShowPopup(true); // Show the confirmation popup
      setTimeout(() => {
        setShowPopup(false);
        navigate('/'); // Navigate to home after showing the popup
      }, 2000); // Auto navigate after 2 seconds
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
          <p className="text-gray-600">{packs.find(pack => pack.Id === id)?.Name}</p>
          <p className="text-gray-600 font-semibold">Amount: ₹{amount}</p>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`${
                  selectedMethod === method.id 
                    ? 'text-blue-500' 
                    : 'text-gray-600'
                }`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                {selectedMethod === method.id && (
                  <FaCheck className="text-blue-500 w-5 h-5" />
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedMethod === 'card' && (
          <form onSubmit={handlePayment} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </form>
        )}

        <button
          onClick={handlePayment}
          className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Pay ₹{amount}
        </button>

        <p className="mt-4 text-xs text-center text-gray-500">
          By clicking Pay, you agree to our Terms and Conditions
        </p>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center text-black">
              <h3 className="text-lg font-semibold">Payment Confirmed!</h3>
              <p className="mt-2">Thank you for your payment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;