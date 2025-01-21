import React, { useState,useContext } from 'react';
import { Pencil,Save } from "lucide-react";
import axios from 'axios';
import AdminContext from '@/context/adminContext';
import AppModeContext from '@/context/appMode';

interface OptionProps {
  id: any;
  option: string;
  idx: number;
  edit:boolean
  refresh:boolean;
  setRefresh: (value:boolean)=>void
  // onSave: (id: any, newOption: string) => void; // Function to save the new option
}

const Option = ({ id, option, idx,edit,refresh,setRefresh }: OptionProps) => {
  const [isEditing, setIsEditing] = useState(false); 
  const [editedOption, setEditedOption] = useState(option);

 
  const modeContext = useContext(AppModeContext);
  if (!modeContext) {throw new Error('AppModeContextProvider is missing');}
  const { lightmode } = modeContext;

  const adminContext = useContext(AdminContext);
  if (!adminContext) {throw new Error('AdminContextProvider is missing');}
  const { optionIndex } = adminContext;



  const handleSave = async () => {
    setIsEditing(false);

    try {

      const body = {
        optionId: id,
        optionText: editedOption,
      }

      console.log(body);
      
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/updateOption`, body);

      if (response.status === 200) {
        setRefresh(!refresh)


      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  return (
    <div className={`w-full flex items-center ${edit ? "justify-between" : "justify-start gap-3"} gap-2 p-2 rounded-lg m-1 
    ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}>
      <span>{optionIndex[idx]}. </span>
      {isEditing ? (
        <input
          type="text"
          value={editedOption}
          onChange={(e) => setEditedOption(e.target.value)}
          className={`w-full ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"} rounded px-2 py-1 focus:outline-none`} 
        />
      ) : (
        <span>{option}</span>
      )}

      <div 
      className='h-4 w-4'
      >
        {(edit && isEditing) ? (
          <Save
            size={15}
            className={`cursor-pointer ${!edit && "hidden"} hover:opacity-100  transition-colors`}
            onClick={handleSave}
          />
        ) : (
          <Pencil
            size={13}
            className={`cursor-pointer ${!edit && "hidden"} hover:opacity-100  transition-colors`}
            onClick={() => setIsEditing(true)} // Enable edit mode
          />
        )}
      </div>
    </div>
  );
};

export default Option;
