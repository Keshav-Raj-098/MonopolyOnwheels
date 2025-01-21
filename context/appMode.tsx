"use client";

import { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

// Define the shape of the context
interface AppModeContextType {
  lightmode: boolean;
  setLightMode: Dispatch<SetStateAction<boolean>>;
}

// Create the context with a default value of undefined
const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

// Define the type for the provider props
interface AppModeContextProviderProps {
  children: ReactNode;
}

// Create a provider component
export function AppModeContextProvider({ children }: AppModeContextProviderProps) {
  // Initialize the state from localStorage or fallback to false (dark mode)
  const [lightmode, setLightMode] = useState<boolean>(true);

  // Apply theme to the body
  useEffect(() => {
    if (lightmode) {
      document.body.classList.remove('dark');
      localStorage.setItem('lightmode', 'true'); // Store preference
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('lightmode', 'false');
    }
  }, [lightmode]);

  return (
    <AppModeContext.Provider value={{ lightmode, setLightMode }}>
      {children}
    </AppModeContext.Provider>
  );
}

export default AppModeContext;
