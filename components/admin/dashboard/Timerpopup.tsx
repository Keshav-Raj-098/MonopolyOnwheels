// components/Popup.tsx
import React,{ useState } from 'react';
import DropDown from './dropDown';
import axios, { AxiosError } from 'axios';
import { ClipLoader } from 'react-spinners';
import { useSession } from 'next-auth/react';

interface PopupProps {
  
  onClose: () => void; // Define the type for onClose
  functionName:string
  refresh:boolean;
  setRefresh: (value:boolean)=>void
}


const getValues = (externalValue: string): string[] => {
    switch (externalValue) {
        case "days":
            return Array.from({ length: 7 }, (_, i) => (i + 1).toString()); // Returns ["1", "2", "3", "4", "5", "6", "7"]
        case "hours":
            return Array.from({ length: 24 }, (_, i) => (i + 1).toString()); // Returns ["1", "2", ..., "24"]
        case "minutes":
            return ["15", "30", "45"]; // Returns ["15", "30", "45"]
        default:
            return []; // Return an empty array for any other value
    }
};

// Example usage:
const selectedValue = "days"; // This could be "hours" or "minutes" as well
const values = getValues(selectedValue);


const Popup: React.FC<PopupProps> = ({ onClose,functionName,refresh,setRefresh}) => {

    const units = ["days","hours","minutes"]
    
    const [value, setValue] = useState("")
    const [unit, setUnit] = useState(units[2])
    const { data: session } = useSession()
    const adminId = session?.user?.id

    const values = getValues(unit)


    const handleClick = async () => {
      const requestData = {
          functionToRun: functionName,
          durationValue: parseInt(value),
          durationUnit: unit,
      };
  
  
  
      try {

          const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/putTimer/${adminId}`,
              requestData,
             
          );
          if(response.status===200){
            
            onClose()
            setRefresh(!refresh)
            

          }
      } catch (error: any) {
          if (error.response) {
              // The request was made and the server responded with a status code
              console.error('Error Data:', error.response.data);
              console.error('Error Status:', error.response.status);
          } else if (error.request) {
              // The request was made but no response was received
              console.error('No response received:', error.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              console.error('Error:', error.message);
          }
      }
  };
  


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    
      <div className="bg-white rounded-lg p-6 shadow-lg">

        {/* Title */}
        <h2 className="text-xl text-center font-bold">You are setting the reset timer for Mega-LeaderBoard </h2>

        <div className='flex flex-row justify-center gap-3'>
            <DropDown items={values} setvalue={setValue} value={`${value}`}/>
            <DropDown items={units} setvalue={setUnit} value={`${unit}`}/>
        </div>

    
    {/* Buttons */}
        <div className='flex flex-row justify-between items-center'>

        <button 
          onClick={onClose} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
          Close
        </button>
        <button 
          onClick={handleClick} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"

           >
          Set
        </button>
            </div>
      </div>

    </div>

    
  );
};

export default Popup;
