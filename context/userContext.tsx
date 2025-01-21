"use client"

import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context
interface userContextType {
  UserId: string;
  setUserId:(value:string)=>void
}

// Create the context with a default value of undefined
const userContext = createContext<userContextType | undefined>(undefined);

// Define the type for the provider props
interface userContextProviderProps {
  children: ReactNode;
}

// Create a provider component
export function UserContextProvider({ children }: userContextProviderProps) {
  const [UserId,setUserId] = useState<string>("");


  return (
    <userContext.Provider value={{  UserId, setUserId, }}>
      {children}
    </userContext.Provider>
  );
}

export default userContext;
