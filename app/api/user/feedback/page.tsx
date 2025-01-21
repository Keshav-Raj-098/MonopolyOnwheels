"use client"
import React, { useState,useEffect } from 'react'
import { IoIosStar } from "react-icons/io";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
interface BoxProps {
    heading: string,
    setFunction: (value: string) => void
}


const page = () => {

    const [suggestion, setSuggestion] = useState("none")
    const [stars, setStars] = useState<number | any>(-1)
    const [abtTheGame, setAbtTheGame] = useState("none")
    const [notLiked, setNotLiked] = useState("none")
    const { data: session } = useSession();
    const [token, setToken] = useState<string | null>(null);
    const userId = session?.user?.id ; 
    
    useEffect(() => {
      setToken(localStorage.getItem('token'));
    }, []);

    
    

    const router = useRouter()
    const checkCompletion = async () => {
      if (session?.user?.id) {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/checkFeedback/${session?.user.id}`;
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: token,
            },
          });
  
          if (response.status === 203) {
          router.push('/api/user/spin');
          } else {
            console.log(response);
          }
        } catch (error) {
          console.error('Error checking completion:', error);
        }
      }
    };
  
    useEffect(() => {
      if (session?.user?.id && token) {
        checkCompletion();
      }
    }, [session, token]);
  



    const handleStarClick = (index: number) => {
       if(stars===(index)){
        setStars(-1)
       }
       else{

           setStars(index); // Update the selected index on star click
        }
    };
    const handleSubmit = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/feedback/${userId}`;
        const body = {
          stars: stars + 1,  // Increment stars correctly
          suggestion,
          abtTheGame,
          notLiked,
        };
      
        // Simple validation for stars rating
        if (stars === -1) {
          alert("Please provide a rating.");
          return;
        }
      
        try {
          // Make the POST request using fetch
          const response = await axios.post(url, body,{
            headers: {
              Authorization: token, 
          }});
      
          // Parse the response body as JSON
          const data = await response.data;
          
          console.log('Response:', data);
      
          if (response.status === 201) {
            // Redirect user on success
            alert('Feedback submitted successfully.');
            router.push('/api/user/spin');
          } else {
            // Handle other response statuses if needed
            alert('Unexpected response received.');
          }
      
        } catch (error) {
          // Display error message to user
          alert('There was an error submitting your feedback. Please try again later.');
          console.log('Error while submitting feedback:', error);
        }
      };
      

    return (
        <div 
        className='colorBg w-[100vw] h-[100vh] flex justify-center items-center p-4' 
    
      >
        {/* <TopBar showBack={true}/> */}
        <div className='flex flex-col p-6 bg-white rounded-lg shadow-md max-w-md w-full opacity-[0.85] bg-opacity-[0.38]'>
          <div className='text-xl text-center font-semibold mb-4'>How Much did you like the game</div>
         
          
          <div className='flex flex-row gap-[5px] justify-between'>
            {Array.from({ length: 10 }, (_, index) => (
              <IoIosStar 
                key={index} 
                size={"24px"} 
                className={`cursor-pointer ${index <= stars ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => handleStarClick(index)} 
              />
            ))}
          </div>

      
          <Box heading='Any Suggestion' setFunction={setSuggestion} />
          <Box heading='What did you like about the game?' setFunction={setAbtTheGame} />
          <Box heading='What did you not like about the game?' setFunction={setNotLiked} />
      
          <div className='my-4 flex flex-row w-full justify-center items-center'>
            <button
              className={`w-[90px] border-[1px] text-center px-3 py-2 ${stars >-1 ? "bg-[#0077ED] text-white border-transparent":"border-black text-black"} rounded-md `}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      
    )
}

export default page


const Box = ({ heading, setFunction }: BoxProps) => {

    return <div className='flex flex-col my-2'>
        <span>{heading}</span>
        <textarea
            className='my-[2px] scrollbar-hide border-[2px] h-6 border-black w-full resize-none overflow-y-scroll rounded-md bg-transparent'
            onChange={(e) => {
                setFunction(e.target.value);
                e.target.style.height = 'auto'; // Reset height to auto to calculate scrollHeight
                e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight to expand
            }}
            style={{ maxHeight: '80px', minHeight: '30px' }} // Set a minimum height for the textarea

        ></textarea>
    </div>
} 
