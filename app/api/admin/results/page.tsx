"use client";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Barchart } from "@/components/admin/dashboard/barChart";
import AppModeContext from "@/context/appMode";
import AdminContext from "@/context/adminContext";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";

interface Option {
  option: string;
  markedCount: number;
}

interface Question {
  question: string;
  options: Option[];
}

interface QuestionSet {
  questions: Question[];
  name: string;
  id: string;
  type: string;
}

export default function Dashboard() {
  const modeContext = useContext(AppModeContext);
  if (!modeContext) {
    throw new Error("AppModeContextProvider is missing");
  }
  const { lightmode } = modeContext;

  const adminContext = useContext(AdminContext);
  if (!adminContext) {
    throw new Error("AdminContextProvider is missing");
  }

  const [refresh, setRefresh] = useState<boolean>(true);
  const [forms, setForms] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: session, status } = useSession();
  const adminId = session?.user?.id;

  // Handle form response reset
  const handleFormResponseReset = async (formId: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/resetResponse/${formId}/${adminId}`;
      const response = await axios.delete(url);

      if (response.status === 200) {
        alert("Response Reset Successfully");
        setRefresh((prev) => !prev); // Toggle refresh to reload forms
      }
    } catch (error: any) {
      console.error("Error resetting form response:", error.response?.data || error.message);
    }
  };

  // Fetch forms from the backend
  useEffect(() => {
    const getForms = async () => {
      if (status !== "authenticated" || !adminId) return; // Ensure session is authenticated

      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getForm/${adminId}`;
        const response = await axios.get(url);

        setForms(response.data);
      } catch (error: any) {
        console.error("Error fetching forms:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    getForms();
  }, [refresh, status, adminId]);

  return loading ? (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <ClipLoader color="#00BFFF" loading={true} size={50} />
    </div>
  ) : (
    <div className={`flex flex-col gap-5 md:p-4 ${!lightmode && "bg-darkBg"}`}>
      {forms.length > 0 ? (
        forms.map((form, formIndex) => (
          <div
            key={form.id}
            className={`p-5 flex flex-col mb-4 ${lightmode ? "shadow-lg bg-white" : ""}`}
          >
            <div className="mb-2 flex justify-between items-center">
              <div
                className={`font-bold text-2xl ${lightmode ? "text-black" : "text-darkText"}`}
              >
                {form.name}
                <span className={`${lightmode ? "text-blue-500" : "text-blue-300"}`}>({form.type})</span>
              </div>
              <button
                className={`px-3 py-2 rounded-lg ${
                  lightmode
                    ? "bg-red-500 text-white"
                    : "bg-red-500 border-[1px] border-darkBorder text-darkText"
                }`}
                onClick={() => handleFormResponseReset(form.id)}
              >
                Reset response
              </button>
            </div>
            <div className="flex flex-col md:flex-row w-full overflow-x-auto gap-5">
              {form.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="flex flex-row">
                  <Barchart chartData={question} />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className={`text-center ${lightmode ? "text-black" : "text-darkText"}`}>
          No Responses Yet
        </div>
      )}
    </div>
  );
}
