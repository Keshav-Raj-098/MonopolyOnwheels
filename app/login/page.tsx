"use client"
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import axios  from 'axios';

export default function SignupPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNewAdmin, setIsNewAdmin] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    otp: '',
    uniqueCode:''
  
  });

  // Previous helper functions remain the same
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
  //@ts-ignore
  const handleSendOTP = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem('userOTP');
    sessionStorage.removeItem('userEmail');
    // Generate OTP and store in session storage
    const generatedOTP = generateOTP();
    sessionStorage.setItem('userOTP', generatedOTP);
    sessionStorage.setItem('userEmail', formData.email);
    
    try {
      // Send OTP to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/sendotp`, {
        email: formData.email,
        otp: generatedOTP
      });
  
      // Alert user with the generated OTP
      // alert(`Your OTP is: ${generatedOTP}`);
      // console.log(response);
      
      // Update state to indicate OTP was sent
      setIsOTPSent(true);
      setShowOTPInput(true);
      setOtpError('');
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error sending OTP:', error);
      
      // Optionally, you can show an alert or update the state to reflect the error
      alert('Failed to send OTP. Please try again.');
      setOtpError('An error occurred while sending the OTP.'); // Display an error message
    }
  };
  
  
  

  const verifyOTP = () => {
    const storedOTP = sessionStorage.getItem('userOTP');
    const storedEmail = sessionStorage.getItem('userEmail');
      
    console.log(storedOTP, storedEmail);
    
    if (!storedOTP || !storedEmail) {
      setOtpError('OTP expired. Please request a new one.');
      return false;
    }

    if (storedEmail !== formData.email) {
      setOtpError('Email mismatch. Please start over.');
      return false;
    }

    if (formData.otp === storedOTP) {
      sessionStorage.removeItem('userOTP');
      sessionStorage.removeItem('userEmail');
      return true;
    }

    setOtpError('Invalid OTP. Please try again.');
    return false;
  };
  //@ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isAdmin) {
      // Case for Admins
      if (isNewAdmin) {
        // For new admins: Send OTP if not sent already
        if (!isOTPSent) {
          await handleSendOTP(e);
          return; // Wait for OTP to be sent, then stop execution
        }
  
        // Verify OTP after it has been sent
        if (verifyOTP()) {
          // Complete new admin registration
          const result = await signIn('admin-registration', {
            email: formData.email,
            password: formData.password,
            uniqueCode: formData.uniqueCode,
            redirect: true,
            callbackUrl: '/api/admin/dashboard',
          });
        }
      } else {
        // For existing admins: Direct login without OTP
        const result = await signIn('admin-login', {
          email: formData.email,
          password: formData.password,
          redirect: true,
          callbackUrl: '/api/admin/dashboard',
        });
      }
    } else {
      // Case for Users
      if (!isOTPSent) {
        // Send OTP if not already sent
        await handleSendOTP(e);
        return; // Wait for OTP to be sent, then stop execution
      }
  
      if (verifyOTP()) {
        // Handle user registration
        const result = await signIn('user-registration', {
          name: formData.name,
          email: formData.email,
          gender: formData.gender,
          age: formData.age,
          redirect: true,
          callbackUrl: '/api/user/chooseAdmin',
        });
      }
    }
  };
  
  

  const handleGoogleSignIn = () => {
    signIn('google', { 
      callbackUrl: '/api/user/chooseAdmin'
     }
    );
      
  };

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('OTP');
      sessionStorage.removeItem('Email');
    };
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">
            {
              isAdmin ? 'Create Your Own Game' : 'Sign-up to play'
            }
          </h1>
        </div>

        {!isAdmin && (
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">Sign up with Google</span>
          </button>
        )}

        <div className="relative flex items-center justify-center my-8">
          <div className="border-t border-gray-300 w-full"></div>
         {!isAdmin &&  <span className="bg-transparent px-4 text-gray-500">or</span>}
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isAdmin ? (
            <>
              <input
                type="text"
                placeholder="Game Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
              <input
                type="email"
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                  required
                />
                
                <select
                aria-label="Choose an option"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                  required
                >
                  <option value="">Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              {showOTPInput && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                  maxLength={6}
                  required
                />
              )}
            </>
          ) : (
            <div className='flex flex-col gap-3'>
              <input
                type="email"
                placeholder="Admin Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
              {isNewAdmin && 
              <input
                type="password"
                placeholder="Unique Code"
                value={formData.uniqueCode}
                onChange={(e) => setFormData({ ...formData, uniqueCode: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />}
                {showOTPInput && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                  maxLength={6}
                  required
                />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            
            {isOTPSent ? "Verify OTP" : isNewAdmin ? "Get OTP" : "Login"}

          </button>
        </form>

        {otpError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {otpError}
          </div>
        )}
        { isAdmin &&
        <div className='flex flex-row justify-center items-center'>

        <button
          onClick={() => setIsNewAdmin(!isNewAdmin)}
          className="my-0 text-center text-sm text-gray-500 hover:text-gray-700"
          >
          {isNewAdmin ? 'Switch to Existing Admin' : 'New Admin'}
          
        </button>
          </div>
        }
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="absolute bottom-[-48px] left-1/2 transform -translate-x-1/2 text-sm text-gray-500 hover:text-gray-700"
        >
          
          {isAdmin ? 'Switch to User Signup' : 'Admin Login'}
        </button>
      </div>
    </div>
  );
}