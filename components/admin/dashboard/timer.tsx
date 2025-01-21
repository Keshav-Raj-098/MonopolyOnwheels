import React, { useContext } from 'react'
import AppModeContext from '@/context/appMode';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface taskDetail{
    updatedAt:string,
    timeLeft:string | null

}

interface timerProp {
    heading:string,
    popup:boolean
    setPopup:(value: boolean) => void;
    setFunctionName:(value:string) => void;
    task:taskDetail | any,
    resetOrNot:boolean
}

const TimerCard = ({heading,popup,setPopup,resetOrNot,task, setFunctionName}:timerProp) => {

    const modeContext = useContext(AppModeContext);
    if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
    const { lightmode, setLightMode } = modeContext;
    const { data: session } = useSession();
    const adminId = session?.user?.id

    const handleReset = async()=>{

        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/resetLeaderBoard/${adminId}`
        try {

            const response = await axios.post(url,{
                heading:heading
            })
             
            console.log(response);
            
            if(response.status===200){
                console.log("Reset SuccessFull"); 
                window.location.reload()               
            }
            
        } catch (error) {
            
        }
    }


    return (
        <div className={`my-4 w-full h-fit rounded-xl p-4 flex flex-col  gap-3 ${lightmode ? "text-black shadow-md border-[1px]" : "text-darkText bg-darkBg  border-[1px] border-darkBorder"}`}
        >
            <h3 className='text-center'>{`Set Reset Timer for ${heading}`}</h3>
            <div className='flex flex-col md:flex-row justify-between'>
                <div className='flex flex-col b-r-[1px] '>
                    <span>{`Last Updated at:-  ${task?.updatedAt}`}</span>
                    <span>{
                        task?.timeLeft !== null ?
                    `Will Update at:- ${task?.timeLeft}` :
                    `Task Completed`
                    }</span>
                </div>
                <div className='flex flex-row gap-2'>

                
                <button
                    className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText hover:bg-gray-800"} text-dark rounded-lg`}
                    onClick={() => { setPopup(!popup)
                        if(heading==="MegaLeaderBoard"){
                            setFunctionName("setAllCareerPointsToZero")
                        }
                        else{
                            setFunctionName("sessionWinner")
                        }
                    }}
                >Update

                </button>
                { resetOrNot &&

                    <button
                    className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText hover:bg-gray-800"} text-dark rounded-lg`}
                    onClick={handleReset}
                    >Reset

                </button>
                }
                </div>
            </div>

        </div>

    )
}

export default TimerCard
