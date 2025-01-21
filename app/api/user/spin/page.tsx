"use client"
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

// Type definitions
interface Leader {
  id: string;
  rank: number;
  username: string;
  points: number;
}

interface Scenario {
  id: number;
  scenario: string;
  easy: string;
  tough: string;
  spinCommitment: number;
  careerPoints: number;
  emoji: string;
}

interface Detail {
  leaderBoard: user[];
  user: {
    rank: number;
    points: number;
    spinLeft: number;
  };
}

interface user {
  name: string;
  points: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    scenario: "Pursue Higher Education",
    easy: "Skip higher education",
    tough: "Enroll in a Master's program",
    spinCommitment: 3,
    careerPoints: 6,
    emoji: "🎓"
  },
  {
    id: 2,
    scenario: "Start a New Business",
    easy: "Work for a stable job",
    tough: "Launch a startup with risks",
    spinCommitment: 4,
    careerPoints: 8,
    emoji: "💼"
  },
  {
    id: 3,
    scenario: "Relocate for a Job Opportunity",
    easy: "Stay in the current city",
    tough: "Move to a new city for a better role",
    spinCommitment: 2,
    careerPoints: 4,
    emoji: "🏢"
  },
  {
    id: 4,
    scenario: "Invest in Skill Development",
    easy: "Stick with current skills",
    tough: "Enroll in an intensive course",
    spinCommitment: 3,
    careerPoints: 6,
    emoji: "📚"
  },
  {
    id: 5,
    scenario: "Work-Life Balance",
    easy: "Prioritize work-life balance",
    tough: "Take on a challenging project with longer hours",
    spinCommitment: 2,
    careerPoints: 4,
    emoji: "⚖️"
  },
  {
    id: 6,
    scenario: "Career Change",
    easy: "Stay in the current field",
    tough: "Switch to a new industry",
    spinCommitment: 4,
    careerPoints: 8,
    emoji: "🔄"
  },
  {
    id: 7,
    scenario: "Leadership Role",
    easy: "Continue as a team member",
    tough: "Accept a leadership role",
    spinCommitment: 3,
    careerPoints: 6,
    emoji: "👥"
  },
  {
    id: 8,
    scenario: "Pursue an International Internship",
    easy: "Choose a local opportunity",
    tough: "Apply for a competitive international internship",
    spinCommitment: 5,
    careerPoints: 10,
    emoji: "🌍"
  },
  {
    id: 9,
    scenario: "Financial Investment",
    easy: "Save money in a regular account",
    tough: "Invest in stocks or mutual funds",
    spinCommitment: 2,
    careerPoints: 4,
    emoji: "💰"
  },
  {
    id: 10,
    scenario: "Community Service",
    easy: "Focus solely on career",
    tough: "Volunteer for a cause",
    spinCommitment: 1,
    careerPoints: 2,
    emoji: "🤝"
  }
];

const CareerDecisionGame = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: session, status } = useSession();
  const audioFile = '/tick.mp3';

  // State management
  const [detail, setDetail] = useState<Detail | undefined>(undefined);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [careerPoints, setCareerPoints] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState<number | undefined>(undefined);
  const [rank, setRank] = useState<number | undefined>(undefined);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [fillFeedback, setfillFeedback] = useState(false);
  const [multiClick, setMultiClick] = useState<boolean>(false);
  const [rotation, setRotation] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);


  // Canvas setup and drawing functions
  const setupCanvas = (canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    return ctx;
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = setupCanvas(canvas);
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const radius = Math.min(width, height) / 2.2;
    const segments = SCENARIOS.length;
    const anglePerSegment = (2 * Math.PI) / segments;

    // Clear and set center
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation);

    // Gold border
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 15;
    ctx.stroke();

    // Draw segments
    SCENARIOS.forEach((scenario, i) => {
      const startAngle = i * anglePerSegment;
      const endAngle = (i + 1) * anglePerSegment;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 2, startAngle, endAngle);
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#DC2626';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw emoji and text
      ctx.save();
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = i % 2 === 0 ? '#000000' : '#FFFFFF';
      ctx.font = '32px sans-serif';
      ctx.fillText(scenario.emoji, radius - 50, 0);
      ctx.restore();
    });

    // Center point
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  const drawMarker = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;

    ctx.save();
    ctx.translate(width / 2, 20);

    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.lineTo(0, 30);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };


  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Redirect to the homepage or any other page
  }

  // Game logic functions
  const spinWheel = () => {
    if (isSpinning || (spinsLeft || 0) <= 0) return;

    setIsSpinning(true);
    const spinDuration = 3000;
    const startTime = Date.now();
    const startRotation = rotation;
    const totalRotation = 2 * Math.PI * (4 + Math.random() * 4);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / spinDuration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const newRotation = startRotation + totalRotation * eased;

      setRotation(newRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const selectedIndex = Math.floor(((newRotation % (2 * Math.PI)) / (2 * Math.PI)) * SCENARIOS.length);
        setCurrentScenario(SCENARIOS[SCENARIOS.length - 1 - selectedIndex]);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleChoice = async (isTough: boolean) => {
    if (!session?.user?.id || !currentScenario) return;

    const pointsToAdd = isTough ? currentScenario.careerPoints : 0;
    const spinsToDeduct = isTough ? currentScenario.spinCommitment + 1 : 1;

    try {
      setMultiClick(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updatePoints/${session.user.id}`,
        {
          points: pointsToAdd,
          spinUpdate: -spinsToDeduct
        }
      );

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/leaderboard/${session.user.id}`, {
        headers: {
          Authorization: token,
        }
      }
      );

      setDetail(response.data);
      setCareerPoints(response.data.user.points);
      setSpinsLeft(response.data.user.spinLeft);
      setCurrentScenario(null);
    } catch (error) {
      console.error("Error handling choice:", error);
    }
    finally {
      setMultiClick(false);
    }
  };

  const checkCompletion = async () => {
    if (session?.user?.id) {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/checkFeedback/${session?.user.id}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 203) {
          setGameCompleted(true);
        } else if (response.status === 205) {
          setGameCompleted(false);
          setfillFeedback(true);
        } else if (response.status === 209) {
          setGameCompleted(false);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error('Error checking completion:', error);
      }
    }
  };

  useEffect(() => {
    if (session?.user?.id && token) {
      checkCompletion();
    }
  }, [session, token]);

  // Effects
  useEffect(() => {
    if (session?.user?.id && token) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/leaderboard/${session?.user.id}`, {
        headers: {
          Authorization: token,

        }
      }).then((response) => {

        console.log(response);

        setDetail(response.data);
        setSpinsLeft(response.data.user.spinLeft);
        setCareerPoints(response.data.user.points);
        setRank(response.data?.user?.rank)
      })
        .catch((error) => {
          console.error('Error fetching details:', error);
        });
    }
  }, [session?.user?.id, token]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 800;
      drawWheel();
      drawMarker();
    }
  }, [rotation]);

  useEffect(() => {
    const audio = new Audio(audioFile);
    if (isSpinning) {
      audio.play();
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
    };
  }, [isSpinning]);

  return (<div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
    <div className="max-w-md mx-auto">
      {/* Header with Language Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Career Decision Game</h1>
        <div className="opacity-0 bg-white/30 backdrop-blur-sm rounded-full p-1 flex items-center">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-gray-800 text-sm ${language === 'en' ? 'bg-white' : ''
              }`}
          >
            En
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1 rounded-full text-gray-800 text-sm ${language === 'ar' ? 'bg-white' : ''
              }`}
          >
            عربي
          </button>
        </div>
      </div>



      {/* Game Container */}
      <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-8">
        {/* Stats Display */}
        <div className="flex justify-between mb-6">
          <div className="space-y-1">
            <div className="text-xl font-bold">Global Rank: {rank}</div>
            <div className="text-xl font-bold">Career points: {careerPoints}</div>
          </div>
          <div className="text-xl font-bold">
            Spin: {spinsLeft}
          </div>
        </div>

        {/* Wheel Container */}
        <div className="relative mb-6 aspect-square">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-4xl">
            <span role="img" aria-label="pointer" >📍</span>
          </div>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="w-full h-full"
            style={{
              // transform: `rotate(70deg)`,
              transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {
            gameCompleted || fillFeedback ? (

              <div className='flex flex-col items-center'>
                {spinsLeft === 0 ? (
                  <div>

                    <div className="text-center p-4 bg-green-100 rounded-lg shadow-md">
                      🎉 You have completed the game. 🎉
                    </div>
                    <div className="text-lg text-green-700">
                      🎊 !! Thanks For playing the Game !! 🎊
                    </div>
                  </div>) :

                  <button
                    onClick={gameCompleted ? () => {
                      alert("The game has been completed.Thanks playing")
                    } : spinWheel}
                    disabled={isSpinning || (spinsLeft || 0) <= 0}
                    className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full disabled:opacity-50"
                  >
                    Click to spin
                  </button>



                }
                {fillFeedback && (spinsLeft === 0) && 

                  <div className="mt-4 p-4 bg-yellow-100 rounded-lg shadow-md text-center cursor-pointer"
                    onClick={() => { router.push('/api/user/feedback') }}
                  >
                    <span className="text-lg font-semibold text-yellow-800" >Fill the Feedback Form</span>
                  </div>


                }
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={gameCompleted ? () => {
                    alert("The game has been completed.Thanks playing")
                  } : spinWheel}
                  disabled={isSpinning || (spinsLeft || 0) <= 0 || gameCompleted}
                  className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full disabled:opacity-50"
                >
                  Click to spin
                </button>
                <button
                  onClick={() => {
                    if (gameCompleted) {
                      alert("The game has been completed.Thanks For playing")
                    }
                    else {
                      router.push('/api/user/survey')
                    }
                  }}
                  disabled={isSpinning || spinsLeft !== 0 || gameCompleted}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full disabled:opacity-50"
                >
                  Click to get more spins
                </button>
              </div>
            )
          }

          
        </div>
        {
          gameCompleted &&  (

            <div className="mt-4 p-4 bg-red-100 rounded-lg shadow-md text-center cursor-pointer"
              onClick={() => { handleLogout() }}
            >
              <span className="text-lg font-semibold text-red-800">Exit Game</span>
            </div>
          ) 
        }
      </div>

      {/* Leaderboard */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Leader Board</h2>
        <div className="flex justify-center items-end space-x-8">
          {detail?.leaderBoard?.map((leader, index) => (
            leader &&
            <div className="text-center" key={index}>
              <div
                className={`${(index + 1) === 1 ? 'w-24 h-24' : 'w-20 h-20'
                  } bg-gray-200 rounded-full flex items-center justify-center mb-2`}
              >
                <div className={`${(index + 1) === 1 ? 'text-2xl' : 'text-xl'
                  } font-bold`}>
                  #{(index + 1)}
                </div>
              </div>
              <div className="font-semibold">{leader.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Modal */}
      {currentScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">{currentScenario.scenario}</h3>
            <div className="space-y-4">
              <button
                disabled={multiClick}
                onClick={() => { handleChoice(false) }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded"
              >
                {currentScenario.easy}
              </button>
              <button
                disabled={multiClick}
                onClick={() => { handleChoice(true) }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                {currentScenario.tough}
                <div className='flex flex-row gap-2 items-center justify-center'>
                  <span className="text-sm ml-2">
                    (+{currentScenario.careerPoints} pts)
                  </span>
                  <span className="text-sm ml-2">
                    (- {`${currentScenario.spinCommitment + 1}`} spin)
                  </span>
                </div>

              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
  );
}

export default CareerDecisionGame