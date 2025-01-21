"use client";
import React, { useState,useContext } from 'react';
import Form from '@/components/admin/newForm/Form';
import AppModeContext from '@/context/appMode';
import AdminContext from '@/context/adminContext';



export default function Dashboard() {
  
  
  const modeContext = useContext(AppModeContext);
  if (!modeContext) {throw new Error('AppModeContextProvider is missing');}
  const { lightmode, setLightMode } = modeContext;
  
  const adminContext = useContext(AdminContext);
  if (!adminContext) {throw new Error('AdminContextProvider is missing');}
  const { refresh, setRefresh } = adminContext;


  const [forms, setForms] = useState<any[]>([]); // Store forms
 

  
  
  

  return (
    
   <Form/>
  );
}

