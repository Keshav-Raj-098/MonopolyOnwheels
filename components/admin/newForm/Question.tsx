"use client";
import React, { useContext, useState, useEffect } from 'react';
import Option from './Option';
import { CircleX,Pencil, Save } from "lucide-react";
import AdminContext from '@/context/adminContext';
import AppModeContext from '@/context/appMode';

interface prop {
  index: number;
  isSurvey: boolean;
}

const Question = ({ index,isSurvey }: prop) => {
  const adminContext = useContext(AdminContext);
  
  if (!adminContext) {
    throw new Error('AdminContextProvider is missing');
  }

  const { noOfQuestion, setNoofQuestion, Form, refresh,setForm,setRefresh,saved,setIsSaved } = adminContext;

  const modeContext = useContext(AppModeContext);
    if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
    
    const { lightmode } = modeContext;

  // State for the question and its options
  const [multipe, setMultiple] = useState(false);
  const [question, setQuestion] = useState<string>("");
  const [option1, setOption1] = useState<string>("");
  const [isCorrect1,setIsCorrect1] = useState<boolean>(false);
  const [option2, setOption2] = useState<string>("");
  const [isCorrect2,setIsCorrect2] = useState<boolean>(false);
  const [option3, setOption3] = useState<string>("");
  const [isCorrect3,setIsCorrect3] = useState<boolean>(false);
  const [option4, setOption4] = useState<string>("");
  const [isCorrect4,setIsCorrect4] = useState<boolean>(false);


  // New state for editing mode
  const [isEditing, setIsEditing] = useState<boolean>(true);

  // Helper function to check if all fields are filled
  const areFieldsFilled = () => {
    return (
      question.trim() !== "" &&
      option1.trim() !== "" &&
      option2.trim() !== "" &&
      option3.trim() !== "" &&
      option4.trim() !== ""
    );
  };

  // Question body to be stored in FormId
  const body = {
    question: question,
    options: [
      {"text": option1, "isCorrect": isSurvey ? false : isCorrect1},
      {"text": option2, "isCorrect": isSurvey ? false : isCorrect2},
      {"text": option3, "isCorrect": isSurvey ? false : isCorrect3},
      {"text": option4, "isCorrect": isSurvey ? false : isCorrect4},
    ],
    multiple: isSurvey ? multipe : false,
    textAllowed: false,
  };
  
  // Function to check if multiple correct answers are allowed
  const validateOptions = () => {
    const correctOptions = [isCorrect1, isCorrect2, isCorrect3, isCorrect4].filter(Boolean).length;
    if (multipe && correctOptions < 2) {
      alert("For multiple correct answers, at least two options must be marked as correct.");
      return false;
    } else if (!multipe && correctOptions > 1) {
      alert("Only one option can be marked as correct for single correct answer questions.");
      return false;
    }
    return true;
  };

  // Modify the onClick handler to include validation
  const handleSaveClick = () => {
    if (isEditing) {
      if (areFieldsFilled() && validateOptions()) {
        const updatedFormId = [...Form];
        updatedFormId[index] = body;
        setForm(updatedFormId);
        console.log(Form);
        setIsEditing(false);
        setIsSaved(true);
      } else if (!areFieldsFilled()) {
        alert("All fields are required");
      }
    } else {
      setIsEditing(true);
    }
  };
  // useEffect to sync FormId updates as the user types in the fields
  useEffect(() => {
    if (areFieldsFilled()) {
      const updatedFormId = [...Form];
      updatedFormId[index] = body; // Replace or add the question at the given index
      setRefresh(!refresh); // Trigger re-render (optional, depending on your usage)
    }
  }, [question, option1, option2, option3, option4,isCorrect1,isCorrect2,isCorrect3,isCorrect4, multipe]);

  return (
    <div className={`my-5 p-5 ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}>
      <div className='mb-3 flex flex-row justify-between items-center'>

    
    
        <div className={`flex flex-row items-center space-x-2 ${isSurvey && "opacity-0"}`}>
          <label
            htmlFor="terms"
            className={` ${lightmode ? "black" : "text-darkText"} text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
          >
            Is this question MultiCorrect?
          </label>
          <input type="checkbox" className='cursor-pointer'
            onChange={() => { setMultiple(!multipe); }} 
            disabled={!isEditing}  // Disable checkbox in "Edit" mode
          />
        </div>
      
          
        <div className={`flex flex-row gap-2 items-center `}>
        <button
          className={`text-black`}
          onClick={() => {
            if (isEditing) {
              if (areFieldsFilled()) {
                // Add or update the question in FormId
                const updatedFormId = [...Form];
                updatedFormId[index] = body; // Replace or add the question at the given index
                
                // Update FormId in the context
                setForm(updatedFormId);
          
                console.log(Form);
                setIsEditing(false); // Switch to "Edit" mode after saving
              } else {
                alert("All fields are required");
              }
            } else {
              setIsEditing(true); // Switch back to "Save" mode to allow editing
            }
          }}
          
        >
          {isEditing ? <Save size={18} color='grey' onClick={handleSaveClick}/> : <Pencil size={18} color='grey'/>}
        </button>
        <CircleX
          className='hover:cursor-pointer hover:text-red-600 opacity-45 hover:opacity-100'
          size={"19px"}
          onClick={() => {
            if (noOfQuestion >= 2) {
              setNoofQuestion(noOfQuestion - 1);
            }
          }} />
      </div>
      
      </div>

      {/* Question */}
    
      
      <div className={`${lightmode ? "bg-white" : "bg-darkBg"}`}>
        <input
          type="text"
          placeholder='Enter Your Question Here'
          className={`${lightmode ? "bg-white" : "bg-darkBg border-b-[1px] border-darkBorder"} w-full border rounded px-2 py-1 focus:outline-none`}
          onChange={(e) => { setQuestion(e.target.value); }}
          value={question}
          disabled={!isEditing} // Disable input in "Edit" mode
        />
      </div>
      

      {/* Options */}
      <div className='grid grid-cols-1 md:grid-cols-2 items-baseline gap-2'>
        <Option idx={1} lightmode={lightmode} setOptionText={setOption1} setIsCorrect={setIsCorrect1} disabled={!isEditing} isSurvey={isSurvey} />
        <Option idx={2} lightmode={lightmode} setOptionText={setOption2} setIsCorrect={setIsCorrect2} disabled={!isEditing} isSurvey={isSurvey} />
        <Option idx={3} lightmode={lightmode} setOptionText={setOption3} setIsCorrect={setIsCorrect3} disabled={!isEditing} isSurvey={isSurvey} />
        <Option idx={4} lightmode={lightmode} setOptionText={setOption4} setIsCorrect={setIsCorrect4} disabled={!isEditing}  isSurvey={isSurvey} />
 
      </div>

    
    </div>
  );
}

export default Question;
