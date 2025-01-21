"use client";
import React, { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import axios from 'axios';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

// Types remain the same as before, adding new interface for answer feedback
interface AnswerFeedback {
  correct: string[];
  incorrect: string[];
  answers: string[];
  allAnswersMatched: boolean;
}

interface Option {
  id: string;
  option: string;
}

interface Question {
  questionId: string;
  question: string;
  options: Option[];
  ismarked: boolean;
  isMultipleCorrect: boolean;
}

interface EachQuestionProps {
  question: string;
  questionId: string;
  options: Option[];
  ismarked: boolean;
  onOptionSelect: (optionId: string[]) => void;
  selectedOption: string[];
  handleNavigation: (direction: 'prev' | 'next',redirectUrl:string) => Promise<void>;
  loading: boolean;
  isMultipleCorrect: boolean;
  isSurvey: boolean;
  answerFeedback: AnswerFeedback | null;
  showingFeedback: boolean;
  redirectUrl:string
}

// TopBar Component remains the same
const TopBar: React.FC<{ showBack?: boolean }> = ({ showBack = true }) => {
  const router = useRouter();
  const [isEnglish, setIsEnglish] = useState(true);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
        {/* {showBack && (
          <button
            onClick={() => router.push('/api/user/spin')}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )} */}
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-medium">Monopolyonwheels</h1>
          <button
            onClick={() => setIsEnglish(!isEnglish)}
            className="opacity-0 text-sm px-3 py-1 rounded-full border bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {isEnglish ? 'En' : 'عربي'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component remains the same
const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-green-400 h-2.5 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};
const EachQuestion: React.FC<EachQuestionProps> = ({
  question,
  options,
  onOptionSelect,
  selectedOption,
  handleNavigation,
  loading,
  isMultipleCorrect,
  isSurvey,
  answerFeedback,
  showingFeedback,
  redirectUrl
}) => {
  const getOptionStyle = (optionId: string) => {
    if (!showingFeedback) {
      return selectedOption.includes(optionId)
        ? 'border-blue-400 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300';
    }

    if (answerFeedback) {
      if (answerFeedback.answers.includes(optionId)) {
        return 'border-green-400 bg-green-50';
      }
      if (answerFeedback.incorrect.includes(optionId)) {
        return 'border-red-400 bg-red-50';
      }
    }
    return 'border-gray-200';
  };

  const getOptionIcon = (optionId: string) => {
    if (!showingFeedback || !answerFeedback) return null;

    if (answerFeedback.answers.includes(optionId)) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (answerFeedback.incorrect.includes(optionId)) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return null;
  };

  const handleOptionSelect = (optionId: string) => {
    if (showingFeedback) return; // Prevent selection while showing feedback

    if (isMultipleCorrect) {
      if (selectedOption.includes(optionId)) {
        onOptionSelect(selectedOption.filter((id) => id !== optionId));
      } else {
        onOptionSelect([...selectedOption, optionId]);
      }
    } else {
      onOptionSelect([optionId]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">
          {question} {isMultipleCorrect && "(multiple)"}
        </h2>
      </div>

      <div className="space-y-3">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${getOptionStyle(opt.id)}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div
                  className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                    selectedOption.includes(opt.id)
                      ? 'border-blue-400 bg-blue-400'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedOption.includes(opt.id) && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <label className="flex-1 cursor-pointer">{opt.option}</label>
              </div>
              <div className="ml-2">
                {getOptionIcon(opt.id)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        {/* <button
          onClick={() => handleNavigation('prev')}
          className="px-6 py-2 bg-green-400 text-white rounded-full hover:bg-green-500 transition-colors"
        >
          Prev
        </button> */}
        <button
          onClick={() => handleNavigation('next',redirectUrl)}
          disabled={selectedOption.length === 0 || loading}
          className="px-6 py-2 bg-green-400 text-white rounded-full hover:bg-green-500 transition-colors disabled:bg-gray-300"
        >
          {loading 
            ? 'Submitting...' 
            : showingFeedback 
              ? 'Next'
              : isSurvey 
                ? 'Next' 
                : 'Submit'
          }
        </button>
      </div>
    </div>
  );
};

const Survey: React.FC<{ questions: Question[]; formId: string; isSurvey: boolean,redirectUrl:string }> = ({
  questions,
  formId,
  isSurvey,
  redirectUrl
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const unmarkedQuestions = questions.filter((question) => !question.ismarked);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null);
  const [showingFeedback, setShowingFeedback] = useState<boolean>(false);

  const handleNavigation = async (direction: 'prev' | 'next',redirectUrl:string) => {
    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption([]);
      setAnswerFeedback(null);
      setShowingFeedback(false);
      return;
    }

    if (!userId || selectedOption.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/mark/${userId}`;
      const body = {
        formId,
        isSurvey,
        questionId: unmarkedQuestions[currentQuestionIndex].questionId,
        optionIds: selectedOption,
      };

      const response = await axios.post(url, body);

      if (isSurvey) {
        if (response.data.marked) {
          if (currentQuestionIndex === unmarkedQuestions.length - 1) {
            router.push(`${redirectUrl}`);
          } else {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption([]);
          }
        }
      } else {
        // Handle Q&A feedback
        if (!showingFeedback) {
          setAnswerFeedback(response.data);
          setShowingFeedback(true);
        } else {
          // Move to next question after showing feedback
          if (currentQuestionIndex === unmarkedQuestions.length - 1) {
            router.push(`${redirectUrl}`);
          } else {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption([]);
            setAnswerFeedback(null);
            setShowingFeedback(false);
          }
        }
      }
    } catch (err) {
      setError('Error submitting answer. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = unmarkedQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="max-w-2xl mx-auto pt-16 px-4">
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={unmarkedQuestions.length}
        />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <EachQuestion
            question={currentQuestion.question}
            questionId={currentQuestion.questionId}
            options={currentQuestion.options}
            ismarked={currentQuestion.ismarked}
            isMultipleCorrect={currentQuestion.isMultipleCorrect}
            onOptionSelect={setSelectedOption}
            selectedOption={selectedOption}
            handleNavigation={handleNavigation}
            loading={loading}
            isSurvey={isSurvey}
            answerFeedback={answerFeedback}
            showingFeedback={showingFeedback}
            redirectUrl={redirectUrl}
          />
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Survey;
export { TopBar };