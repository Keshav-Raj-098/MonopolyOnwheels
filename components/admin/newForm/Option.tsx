"use client"
import React,{useContext,useState}from 'react'
import AdminContext from '@/context/adminContext';


interface option{
    idx:number,
    lightmode:boolean,
    setOptionText:(value:string)=>void,
    setIsCorrect:(value:boolean)=>void,
    isSurvey:boolean,
    disabled:boolean
}

const Option = ({idx,lightmode,setOptionText,setIsCorrect,isSurvey,disabled}:option) => {


    
    const adminContext = useContext(AdminContext);
    if (!adminContext) {throw new Error('AdminContextProvider is missing');}
    const { refresh, setRefresh } = adminContext;

  
  return (
    <div className={`w-full flex items-center gap-2 p-2 rounded-lg m-1 
    ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}>
      {/* <span>{idx}. </span> */}
      
      {
        !isSurvey && 
      
      <input
        type="checkbox"
        disabled={disabled}
        className={`mr-2 hover:cursor-pointer` }
        onChange={(e) => {
        
          if(isSurvey){setIsCorrect(false)}
        setIsCorrect(e.target.checked)}}
      />
        }
        <input
          type="text"
          
          disabled={disabled}
          placeholder={`Enter option No. ${idx} here`}
        //   value={editedOption}
        //   onChange={(e) => setEditedOption(e.target.value)}
          className={`w-full ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"} px-2 py-1 focus:outline-none`}
          onChange={(e)=>{setOptionText(e.target.value)}}
        />
      
    </div>
  )
}

export default Option
