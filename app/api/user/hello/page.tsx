"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Survey from "@/components/survey";
import { useSession } from "next-auth/react";
import { ClipLoader } from 'react-spinners';




interface Option {
  id: string;
  option: string;
}

interface Question {
  question: string;
  questionId: string;
  options: Option[];
  isMultipleCorrect: boolean;
  ismarked: boolean; // Changed to boolean (lowercase)
}

interface Form {
  questions: Question[];
  name: string,
  isSurvey: boolean
}
export default function CareerFairSurvey() {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [formId, setFormId] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id; // Ensure this is set correctly
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    console.log("Token fetched from localStorage:", token);
    
  }, []);


    const getForms = async () => {
      setLoading(true); // Set loading true before fetching
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getFormId/${userId}`,
          {
            headers: {
              Authorization: token,
            }
          }
        );

        console.log(response.status);


        if (response.status === 200) {
          setFormId(response.data.formId)
          setForm(response.data.form);
        }
        //@ts-ignore
        else if (response.status === 206) {
          router.push("/api/user/spin")
        }
        else {

          throw new Error(response.data)
        }




      } catch (error: any) {
        console.error('Error fetching forms:', error.response ? `${error.response.status}: ${error.response.data}` : error.message);
      } finally {
        setLoading(false);

      }
    };

  useEffect(() => {
    if (userId && token) {
      getForms();
    }
  }, [userId, token]); 


  if (loading) return <div className='w-full h-[100vh] flex flex-row justify-center items-center'>
    <ClipLoader color="#00BFFF" loading={true} size={50} />
  </div>;
  // if (!form) router.push("/api/user/spin");

  return (

    <div>{form &&
      <Survey
        formId={formId}
        isSurvey={form.isSurvey}
        questions={form.questions} // Pass the questions to the Survey component
        //@ts-ignore
        onProgressUpdate={(remaining: number) => {
          // Handle progress updates if needed
          console.log(`Remaining questions: ${remaining}`);
        }}
        userId={userId} // Pass userId to the Survey component
        redirectUrl="/api/user/spin"
      />}
    </div>
  );
}
