"use client"
import React, { useContext, useState } from 'react'
import AppModeContext from '@/context/appMode';
import Question from './Question';
import AdminContext from '@/context/adminContext';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ClipLoader } from 'react-spinners';

const Newform = () => {

  const modeContext = useContext(AppModeContext);
  if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
  const { lightmode } = modeContext;

  const adminContext = useContext(AdminContext);
  if (!adminContext) { throw new Error('AdminContextProvider is missing'); }

  const [formName, setFormName] = useState<string>("")
  const [isSurvey, setIsSurvey] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { noOfQuestion, setNoofQuestion, Form,saved,setIsSaved } = adminContext;

  const { data: session } = useSession();
    const adminId = session?.user?.id ;

    
    
    const handleSubmit = async () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/addForm/${adminId}`;
    
    // Validate the Form object if necessary
    if (!Form || Object.keys(Form).length === 0) {
      alert("Please fill out the form completely");

      return;
    }
    
    try {
      

      if(!saved){
        alert("Please save the questions before submitting")
        return;
      }

      setLoading(true);
      
      // Add a loading state here if necessary
      const response = await axios.post(url, {
        formName,
        formData: Form,
        isSurvey
      });
    
      if (response.status === 201) {
      alert("Form added successfully");
      // Optionally reset the form fields
      window.location.reload();
     
      } else {
      alert("Form not added, please try again");
      }
    } catch (error) {
      // Extract error details for better debugging
      //@ts-ignore
      const errorMessage = error?.response?.data?.message || "Error while adding form";
      alert(errorMessage);
    }
    finally {
      setLoading(false);
      
    };}


  return ( 

    loading ? (
      <div className='w-full h-[100vh] flex flex-row justify-center items-center'>
      <ClipLoader color="#00BFFF" loading={true} size={50} />
    </div>)
  
    :
   
    <div className={`gap-5 p-4 ${!lightmode && "bg-darkBg"} h-full`}>

       <div className='flex flex-row justify-center my-3'>

      <button
        className={`w-[100px] border-[1px] text-center px-3 py-2 bg-[#0077ED] text-white rounded-md`}
        onClick={handleSubmit}
        >
        Submit
      </button>
        </div>


      <div className={`rounded-lg p-4 ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}>

        <div className='my-2 flex flex-col gap-2'>

          <select
          className={`w-full ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px]" : "text-darkText bg-darkBg border-[1px] border-darkBorder"} rounded px-2 py-1 focus:outline-none`}
          onChange={(e) => setIsSurvey(!isSurvey)}
          >
          <option value="true">This is a Survey Form</option>
          <option value="false">This is a Question-Answer Form</option>

          </select>

          <input type="text"
            placeholder='Enter Form Name Here'
            className={`w-full ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"} rounded px-2 py-1 focus:outline-none`} 
            onChange={(e)=>{setFormName(e.target.value)}}
            />
        </div>

        <div>
          {Array.from({ length: noOfQuestion }, (_, index) => (
            <Question index={index} isSurvey={isSurvey} />
          ))}

        </div>


        <div className='my-4 flex flex-row w-full justify-center items-center'>
          <button
            className={`w-[130px] border-[1px] text-center px-3 py-2 bg-[#0077ED] text-white rounded-md`}
            // disabled={!saved}
            onClick={() => {
           
              if(!saved){
                alert("Please save the question before adding more")
                return;
              }

              setNoofQuestion(noOfQuestion + 1)
              setIsSaved(false)
            }}
          >
            Add Question
          </button>
        </div>

      </div>

    </div>
  )
}

export default Newform
