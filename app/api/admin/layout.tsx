"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useContext } from 'react';
import AppModeContext from '@/context/appMode';
import {MoonStar,Sun} from 'lucide-react'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';


export default function Layout({ children }: { children: React.ReactNode }) {


  const context = useContext(AppModeContext);
  const { data: session } = useSession();
  const adminId = session?.user?.id;


const handleDownload = async () => {
    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/download/${adminId}`;
        
        const response = await axios.get(url, {
            responseType: 'blob', // Important: Set responseType to 'blob' for file downloads
        });

        // Create a link to download the file
        const blob = new Blob([response.data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Set file name (optional, but improves user experience)
        link.download = 'data.csv';

        // Trigger the download
        link.click();

        // Clean up the object URL
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};



  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Redirect to the homepage or any other page
  }

  

  if (!context) {
    throw new Error('AppModeContextProvider is missing');
  }

  const { lightmode, setLightMode } = context;

  return (
    <div className={`${lightmode ? "bg-lightBg" : "bg-darkBg"} `}>

      <div className={`px-3 h-[55px] flex flex-row justify-between items-center sticky top-0
         ${lightmode ?  'text-gray-500' : ' text-darkText border-b-[1px] border-darkBorder'} backdrop-blur-md z-[10000]`}
>


        <div className='flex flex-row gap-5'>

          <Link href={"dashboard"}>Dashboard</Link>
          <Link href={"form"}>Form</Link>
          <Link href={"results"}>Result</Link>
          <Link href={"createform"}>Add</Link>
            <span className={`cursor-pointer ${lightmode ? 'text-gray-500' : 'text-darkText'}`} 
            onClick={handleDownload}
            >Data</span>
            <span className={`cursor-pointer ${lightmode ? 'text-gray-500' : 'text-darkText'}`} 
            onClick={handleLogout}
            >Exit</span>


        </div>
          
            <div className='flex flex-row items-center gap-2 cursor-pointer' onClick={() => { 
            setLightMode(!lightmode); 
            localStorage.setItem("lightmode", (!lightmode).toString());
            }}>
            {lightmode ? <Sun /> : <MoonStar />}
            </div>

      </div>

      {children}
    </div>
  );
}
