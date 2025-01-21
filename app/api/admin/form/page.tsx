"use client";
import React, { useEffect, useState, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Form from '@/components/admin/Form';
import AppModeContext from '@/context/appMode';
import AdminContext from '@/context/adminContext';
import { ClipLoader } from 'react-spinners';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  const adminId = session?.user?.id;

  const modeContext = useContext(AppModeContext);
  if (!modeContext) {
    throw new Error('AppModeContextProvider is missing');
  }
  const { lightmode, setLightMode } = modeContext;

  const adminContext = useContext(AdminContext);
  if (!adminContext) {
    throw new Error('AdminContextProvider is missing');
  }
  const [refresh, setRefresh ] = useState<boolean>(false);

  const [forms, setForms] = useState<any[]>([]); // Store forms
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const getForms = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getFormWithId/${adminId}`;

         setLoading(true)
        
        const response = await axios.get(url);
        // if(response.status == 209){
        //   setNoforms(true)
        //   return 
        // }
        const data = response.data

        setForms(data);
        setLoading(false)
      } catch (error: any) {
        // Axios error objects contain the response inside error.response
        if (error.response) {
          console.error('Error fetching forms:', error.response.status, error.response.data);
        } else {
          console.error('Error fetching forms:', error.message);
        }
      }
    };

    if (adminId) {
      getForms(); // Call the function to fetch forms
    }
  }, [refresh, adminId]);

  return (
    <div className={`flex flex-col gap-5 p-4 ${!lightmode && 'bg-darkBg'}`}>
      {loading ? 
      <div className='w-full h-[100vh] flex flex-row justify-center items-center'>
      <ClipLoader color="#00BFFF" loading={true} size={50} />
    </div>
    :(
      forms.length > 0 ? (
        forms.map((form, formIndex) => <Form key={formIndex} formIndex={formIndex} form={form} refresh={refresh} setRefresh={setRefresh} />)
      ) : (
        <div className={`text-center p-4 ${lightmode ? 'text-black' : 'text-white'}`}>
          No form found, create a new one
        </div>
      ))}
    </div>)
  
}
