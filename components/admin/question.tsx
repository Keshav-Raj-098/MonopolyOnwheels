"use client";
import React, { useState, useContext } from 'react';
import { Pencil, Trash2, Save } from "lucide-react";
import Option from './option';
import axios from 'axios';
import AppModeContext from '@/context/appMode';
import AdminContext from '@/context/adminContext';
import { ClipLoader } from 'react-spinners';

interface Option {
  id: string;
  option: string;
}

interface QuestionProps {
  id: number;
  index: number;
  question: string;
  options: Option[];
  edit: boolean
  refresh:boolean;
  setRefresh: (value:boolean)=>void
}

const Question: React.FC<QuestionProps> = ({ id, index,refresh,setRefresh,question, options, edit }) => {
  const [isEditing, setIsEditing] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [questionOptions, setQuestionOptions] = useState(options);


  const modeContext = useContext(AppModeContext);
  if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
  const { lightmode } = modeContext;



  const handleSave = async () => {
    setIsEditing(false);


    try {

      const body = {
        questionId: id,
        questionText: editedQuestion,
      }

      console.log(body);

      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/updateQuestion`, body);

      if (response.status === 200) {
      setRefresh(!refresh)

      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };


  return (

      <div className={`my-5 p-5
      ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}>
        {
          (edit && isEditing) ? (
            <div className='flex flex-row items-center justify-between mb-3'>
              <input
                className={`w-full ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"} rounded px-2 py-1 focus:outline-none`} 
                type="text"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
              />
              <button onClick={handleSave}>
                <Save
                  size={18}
                  className="cursor-pointer text-green-600 hover:text-green-700 transition-colors"
                  onClick={handleSave}
                />
              </button>
            </div>
          ) : (
            <div className='flex flex-row items-center justify-between mb-3'>
              <h3 className='text-lg'>{index}. {question}</h3>
              <button onClick={() => setIsEditing(true)}>
                <Pencil
                  size={18}
                  opacity={0.7}
                  className={`cursor-pointer ${!edit && "hidden"} hover:opacity-100 transition-opacity`}
                  onClick={() => setIsEditing(true)} // Enable edit mode
                />
              </button>
            </div>
          )}



        <div className='grid grid-cols-1 md:grid-cols-2 items-baseline gap-2'>
          {questionOptions.map((opt, index) => (
            <div key={opt.id} >
              <Option id={opt.id} idx={index} option={opt.option} edit={edit}
                refresh={refresh} 
                setRefresh={setRefresh} />
            </div>
          ))}
        </div>
      </div>
   

  );
};

export default Question;


