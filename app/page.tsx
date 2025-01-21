"use client"
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Router, { useRouter } from 'next/navigation';
import { useSelectedLayoutSegments } from 'next/navigation';

const WelcomePage = () => {
  const [agreed, setAgreed] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const router =useRouter()

  return (
    <div className="min-h-screen w-full from-blue-50 via-purple-50 to-pink-50 p-4"
    style = {{ 
      backgroundImage: 'url("/bg.svg")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover', // Ensures the background image covers the entire viewport
      backgroundPosition: 'center', // Centers the background image
      width: '100vw', // Full width of the viewport
      height: '100%', // Full height of the viewport
    }}
    
    >
      <div className="max-w-md mx-auto pt-8">
        {/* Logo and Language Toggle */}
        <div className="flex justify-between items-center mb-8"> {/* Changed items-start to items-center */}

  <button 
    onClick={() => setIsArabic(!isArabic)}
    className="opacity-0 px-3 py-1 rounded-full bg-white/70 hover:bg-white/90 text-sm shadow-sm"
  >
    {isArabic ? 'English' : 'العربية'}
  </button>
  
  {/* IIT Delhi Abu Dhabi Logo */}
  {/* <div className="w-60 sm:w-65 md:w-64">
    <img src="Logo1.svg" alt="Logo" />
  </div> */}
</div>


        {/* Main Content */}
        <div className="p-6 bg-white/30 backdrop-blur-sm shadow-sm rounded-lg">
          <h1 className="text-4xl font-bold text-center mb-8">Welcome!</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How to play?</h2>
            <div className="space-y-2">
              <p>Follow these simple steps:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Register for the game.</li>
                <li>Answer questions to earn spins.</li>
                <li>Spin the wheel to land on situations.</li>
                <li>Spend spins to engage with situations and earn career points.</li>
                <li>Answer more questions for extra spins.</li>
                <li>Highest career points wins a prize.</li>
                <li>Max 30 spins per user.</li>
                <li>Use the toggle on top left to change the language to Arabic</li>
              </ol>
            </div>
          </div>

          {/* Agreement Checkbox - Centered */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-gray-200"
            />
            <label htmlFor="agree" className="text-sm">
              I agree to play this game
            </label>
          </div>

          {/* Start Button - Lighter Colors */}
          <button
            onClick={() => router.push(`/login`)}
            disabled={!agreed}
            className={`w-full py-3 rounded-full text-xl font-semibold transition-all duration-300
              ${agreed 
                ? 'bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;