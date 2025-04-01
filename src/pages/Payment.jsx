import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaCreditCard, 
  FaWallet, 
  FaUniversity, 
  FaQrcode,
  FaCheck,
  FaExclamationCircle
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
  const [showPopup, setShowPopup] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [formErrors, setFormErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};
    
    if (selectedMethod === 'card') {
      // Card number validation - must be 16 digits
      const cardNumberClean = cardNumber.replace(/\s/g, '');
      if (!cardNumberClean.match(/^\d{16}$/)) {
        errors.cardNumber = 'Card number must be 16 digits';
      }

      // Expiry date validation - must be MM/YY format and not expired
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(expiryDate)) {
        errors.expiryDate = 'Invalid expiry date format (MM/YY)';
      } else {
        const [month, year] = expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expiry < new Date()) {
          errors.expiryDate = 'Card has expired';
        }
      }

      // CVV validation - must be 3 digits
      if (!cvv.match(/^\d{3}$/)) {
        errors.cvv = 'CVV must be 3 digits';
      }
    } else if (selectedMethod === 'upi') {
      // UPI ID validation
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z._]{2,49}$/;
      if (!upiId || !upiRegex.test(upiId)) {
        errors.upiId = 'Please enter a valid UPI ID (e.g., username@upi)';
      }
    } else if (selectedMethod === 'netbanking') {
      // Net Banking validation
      if (!selectedBank) {
        errors.selectedBank = 'Please select your bank';
      }
    } else if (selectedMethod === 'wallet') {
      // Wallet number validation
      if (!walletNumber.match(/^\d{10}$/)) {
        errors.walletNumber = 'Please enter a valid 10-digit wallet number';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    // Add space after every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 16 digits + spaces
    value = value.substring(0, 19);
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 3);
    setCvv(value);
  };

  const handleUpiIdChange = (e) => {
    setUpiId(e.target.value);
  };

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  const handleWalletNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setWalletNumber(value.substring(0, 10));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    const packName = packs.find(pack => pack.Id === id)?.Name;
    
    if (userEmail && packName) {
      const userRef = doc(db, 'users', userEmail);
      await setDoc(userRef, { packageName: packName }, { merge: true });
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/');
      }, 2000);
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

        <form onSubmit={handlePayment} className="mt-6 space-y-4">
          {selectedMethod === 'card' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={`w-full text-black px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.cardNumber ? 'border-red-500 bg-red-50' : ''
                    }`}
                  />
                  {formErrors.cardNumber && (
                    <div className="absolute right-3 top-2 text-red-500">
                      <FaExclamationCircle />
                    </div>
                  )}
                </div>
                {formErrors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      className={`w-full px-3 py-2 text-black border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.expiryDate ? 'border-red-500 bg-red-50' : ''
                      }`}
                    />
                    {formErrors.expiryDate && (
                      <div className="absolute right-3 top-2 text-red-500">
                        <FaExclamationCircle />
                      </div>
                    )}
                  </div>
                  {formErrors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      className={`w-full text-black px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.cvv ? 'border-red-500 bg-red-50' : ''
                      }`}
                    />
                    {formErrors.cvv && (
                      <div className="absolute right-3 top-2 text-red-500">
                        <FaExclamationCircle />
                      </div>
                    )}
                  </div>
                  {formErrors.cvv && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {selectedMethod === 'upi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="username@upi"
                  value={upiId}
                  onChange={handleUpiIdChange}
                  className={`w-full px-3 text-black py-2 textborder rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.upiId ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
                {formErrors.upiId && (
                  <div className="absolute right-3 top-2 text-red-500">
                    <FaExclamationCircle />
                  </div>
                )}
              </div>
              {formErrors.upiId && (
                <p className="text-red-500 text-xs mt-1">{formErrors.upiId}</p>
              )}
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Bank
              </label>
              <div className="relative">
                <select
                  value={selectedBank}
                  onChange={handleBankChange}
                  className={`w-full px-3 text-black py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.selectedBank ? 'border-red-500 bg-red-50' : ''
                  }`}
                >
                  <option value="">Select your bank</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="axis">Axis Bank</option>
                </select>
                {formErrors.selectedBank && (
                  <div className="absolute right-3 top-2 text-red-500">
                    <FaExclamationCircle />
                  </div>
                )}
              </div>
              {formErrors.selectedBank && (
                <p className="text-red-500 text-xs mt-1">{formErrors.selectedBank}</p>
              )}
            </div>
          )}

          {selectedMethod === 'wallet' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 10-digit wallet number"
                  value={walletNumber}
                  onChange={handleWalletNumberChange}
                  className={`w-full text-black px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.walletNumber ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
                {formErrors.walletNumber && (
                  <div className="absolute right-3 top-2 text-red-500">
                    <FaExclamationCircle />
                  </div>
                )}
              </div>
              {formErrors.walletNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.walletNumber}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Pay ₹{amount}
          </button>
        </form>

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