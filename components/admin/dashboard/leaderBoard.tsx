import React from 'react';

interface User {
  name: string;
  points: number;
}

interface LeaderBoardProps {
  users: User[];
  lightmode: boolean;
  heading:string;
}

const LeaderBoard: React.FC<LeaderBoardProps> = ({ users, lightmode,heading }) => {
  return (
    <div className={`p-2 min-w-[300px] h-[85vh] overflow-scroll scrollbar-hide ${lightmode ? "text-black shadow-md border-[1px]" : "text-darkText border-[1px] border-darkBorder"} rounded-xl`}>
      <h3 className='text-center'>{heading}</h3>

      <div className={`mt-5 mb-3 px-4 py-[6px] flex flex-row justify-between rounded-2xl ${lightmode ? "bg-white shadow-md" : "border-[1px] border-darkBorder"}`}>
      <div className='flex flex-row gap-2 items-center'>
        <span className='w-[30px]'>#</span>
        <span className='w-50% '>Name</span></div>
        <span>Points</span>
      </div>

      <div className='flex flex-col gap-1'>
        {

          users.length>0 ? 
        
        
        (users?.map((user,index) => (
          <div key={user.name} className={`m-1 px-4 py-[6px] flex flex-row justify-between items-center rounded-2xl ${lightmode ? "bg-white shadow-md" : "border-[1px] border-darkBorder"}`}>
            <div className='flex flex-row gap-2 items-center'>
              {/* <div className={`h-8 w-8 rounded-full bg-darkText flex flex-row items-center justify-center`}>
                  <img src="/user.svg" alt="img" />
              </div> */}
              <span className='w-[30px] flex'>
                {index+1}</span>
              <span className='w-50% overflow-ellipsis'>{user.name}</span>
            </div>
            <span>{user.points}</span>
          </div>
         ))) :

         (<div className={`text-center ${lightmode ? "bg-white" : " text-darkText"}`}>
          <span>No User Found</span>
          
        </div>)
      
      }
      </div>
    </div>
  );
};

export default LeaderBoard;
