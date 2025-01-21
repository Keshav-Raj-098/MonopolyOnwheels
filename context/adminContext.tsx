"use client"

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface Option {
  text: string;
  isCorrect: boolean;
}


interface Question{
  question:string,
  options:Option[],
  multiple:boolean,
  textAllowed:boolean,
}

// Define the shape of the context
interface adminContextType {
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  saved: boolean;
  setIsSaved: Dispatch<SetStateAction<boolean>>;
  optionIndex:string[]
  noOfQuestion:number,
  setNoofQuestion:(value:number)=> void
  Form:Question[] 
  setForm:(value:Question[])=> void

}

// Create the context with a default value of undefined
const AdminContext = createContext<adminContextType | undefined>(undefined);

// Define the type for the provider props
interface adminContextProviderProps {
  children: ReactNode;
}

// Create a provider component
export function AdminContextProvider({ children }: adminContextProviderProps) {
  const [refresh,setRefresh] = useState<boolean>(false);
  const [saved,setIsSaved] = useState<boolean>(false);
  const [noOfQuestion,setNoofQuestion] = useState<number>(1)
  const optionIndex = ["A","B","C","D"]
  const [Form,setForm] = useState<Question[]>([])

  return (
    <AdminContext.Provider value=
    {{  
      refresh, setRefresh,
      optionIndex,
      noOfQuestion,setNoofQuestion,
      Form,
      setForm,
      saved,
      setIsSaved


     }}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContext;
