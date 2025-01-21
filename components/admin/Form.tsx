"use client"
import React, { useState, useContext } from 'react'
import Question from './question'
import AppModeContext from '@/context/appMode';
import axios from 'axios';



interface FormProps {
  form: {
    formid:string;
    type: string;
    name: string;
    form: {
      question: string;
      options: string[];
    }[];
  };
  formIndex: number;
  refresh:boolean;
  setRefresh: (value:boolean)=>void
}

const Form: React.FC<FormProps> = ({ form, formIndex,refresh,setRefresh }) => {
  const [editForm, setEditForm] = useState(false);

  const modeContext = useContext(AppModeContext);
  if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
  const { lightmode } = modeContext;


  const handleDelete = async (formId: string) => {
    try {
      // Make a DELETE request to your API endpoint
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/delete/${formId}`
      const response = await axios.delete(url);
        
      if(response.status===200){
        alert("Form Deleted Successfully")
        setRefresh(!refresh)
        
      }
      // Log success message or handle successful response
      console.log(response.data.message); // Display the success message
      // Optionally, you can update your state or UI to reflect the deletion
    } catch (error) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        // Check for specific error messages from the backend
        console.error(error.response?.data?.message || "An error occurred while deleting the form");
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };




  return (
    <div
      key={formIndex}
    className={`rounded-lg p-4 ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}
    >
      <div className="flex flex-col gap-2 md:flex-row justify-between items-center">
        <h1 className={`text-2xl font-bold text-center mb-4 ${lightmode ? "text-black" : "text-white"}`}>
          {form.name} <span className={`${lightmode ? "text-blue-500" : "text-blue-300"}`}>({form.type})</span>
        </h1>
        <div className="flex flex-row justify-between items-center gap-3">
          {/* <button className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText"} text-dark rounded-lg`}>
            Add Question
          </button> */}
          <button
            className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText"} ${editForm && "bg-red-600 text-white"} text-dark rounded-lg`}
            onClick={() => {
              setEditForm(!editForm);
            }}
          >{
              editForm ? "Cancel" : "Edit Form"
            }
          </button>
          <button
            className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText"} ${editForm && "bg-red-600 text-white"} text-dark rounded-lg`}
            onClick={() => {handleDelete(form.formid)}}
          >Delete

          </button>
        </div>
      </div>

      {form.form.map((question: any, questionIndex: any) => (
        <Question
          key={questionIndex}
          id={question.questionId} // Assuming question ID is based on form index
          index={questionIndex + 1}
          question={question.question}
          options={question.options}
          edit={editForm}
          refresh={refresh} 
          setRefresh={setRefresh}

        />
      ))}
    </div>
  );
};

export default Form
