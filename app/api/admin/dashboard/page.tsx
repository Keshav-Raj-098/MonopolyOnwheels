"use client";
import React, { useContext, useEffect, useState } from "react";
import AppModeContext from "@/context/appMode";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import LeaderBoard from "@/components/admin/dashboard/leaderBoard";
import ShortLeaderBoard from "@/components/admin/ShortleaderBoard";
import TimerCard from "@/components/admin/dashboard/timer";
import Popup from "@/components/admin/dashboard/Timerpopup";
import { useSession } from "next-auth/react";

interface User {
  name: string;
  gender: string;
  age: string;
  points: number;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [sessionUsers, setSessionUsers] = useState<User[]>([]);
  const [functionName, setFunctionName] = useState<string>("");
  const [lastSession, setLastSession] = useState<User[]>([]);
  const [Session, setSession] = useState<User[]>([]);
  const [mega, setMega] = useState<User[]>([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isLoading, setisLoading] = useState(true); // Default true
  const [refresh, setRefresh] = useState<boolean>(false);

  const modeContext = useContext(AppModeContext);
  if (!modeContext) {
    throw new Error("AppModeContextProvider is missing");
  }
  const { lightmode } = modeContext;

  const { data: session, status } = useSession();
  const adminId = session?.user?.id;

  // API call to fetch users
  const getUsers = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getAllusers/${adminId}`;
      setisLoading(true);

      const response = await axios.get(url);
      setUsers(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error.response?.data || error.message);
    } finally {
      setisLoading(false);
    }
  };

  // API call to fetch admin details
  const getAdmin = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getAdmin/${adminId}`;
      setisLoading(true);

      const response = await axios.get(url);

      if (response.status === 200) {
        setLastSession(response.data.lastSessionWinners);
        setSession(response.data.tasks.sessionWinner);
        setMega(response.data.tasks.setAllCareerPointsToZero);
      }
    } catch (error: any) {
      console.error("Error fetching admin details:", error.response?.data || error.message);
    } finally {
      setisLoading(false);
    }
  };

  // API call to fetch session users
  const getSessionUsers = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getSessionusers/sessionWinner/${adminId}`;
      setisLoading(true);

      const response = await axios.get(url);
      setSessionUsers(response.data.users);
    } catch (error: any) {
      console.error("Error fetching session users:", error.response?.data || error.message);
    } finally {
      setisLoading(false);
    }
  };

  // Fetch all data after session is authenticated
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === "authenticated" && adminId) {
          await getUsers();
          await getAdmin();
          await getSessionUsers();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [status, adminId, refresh]);

  return (
    !isLoading ? (
      <div className={`flex flex-col-reverse  md:flex-row p-4 md:items-start justify-between`}>
        {/* Mega Leaderboard */}
        <LeaderBoard lightmode={lightmode} heading="MegaLeaderboard" users={users} />

        {/* Main Section */}
        <div className={`w-full h-[90%] px-4 ${lightmode ? "text-black" : "text-darkText"} flex-col justify-between`}>
          <div className="flex flex-row gap-4">
            {/* Total Users Card */}
            <div
              className={`min-w-[150px] h-[180px] rounded-xl p-6 flex flex-col justify-center items-center gap-3 ${
                lightmode ? "text-black shadow-lg" : "text-darkText bg-darkBg border-[1px] border-darkBorder"
              }`}
            >
              <h3 className="text-[19px] font-bold">Total Users</h3>
              <span className="text-[23px] font-medium">{users.length}</span>
            </div>

            {/* Last Session Winners */}
            <ShortLeaderBoard heading="Last Session Winners" lightmode={lightmode} users={lastSession} />
          </div>

          <div>
            {/* Timer Cards */}
            <TimerCard
              heading="MegaLeaderBoard"
              popup={isPopupOpen}
              setPopup={setPopupOpen}
              resetOrNot={true}
              task={mega}
              setFunctionName={setFunctionName}
            />
            <TimerCard
              heading="Session LeaderBoard"
              popup={isPopupOpen}
              setPopup={setPopupOpen}
              resetOrNot={false}
              task={Session}
              setFunctionName={setFunctionName}
            />
          </div>
        </div>

        {/* Session Leaderboard */}
        <LeaderBoard lightmode={lightmode} heading="LeaderBoard" users={sessionUsers} />

        {/* Popup */}
        {isPopupOpen && (
          <Popup onClose={() => setPopupOpen(false)} functionName={functionName} refresh={refresh} setRefresh={setRefresh} />
        )}
      </div>
    ) : (
      <div className="w-full h-[100vh] flex flex-row justify-center items-center">
        <ClipLoader color="#00BFFF" loading={true} size={50} />
      </div>
    )
  );
}
