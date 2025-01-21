"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ChooseAdminPage: React.FC = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) {
      setError("Code cannot be empty.");
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/findAdmin/${code}`;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(url);

      console.log(response);

      if (response.status === 200) {
        console.log(response.data?.message);
        localStorage.setItem("token", response.data?.token);
        router.push("/api/user/hello"); 
      } else if (response.status === 205) {

        setCode("");
        setError("UniqueCode doesn't exist");
        

      } else {
        setError("An unexpected error occurred.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Network error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Choose Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="adminName"
              name="adminName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Unique Code"
              onChange={(e) => setCode(e.target.value)}
              aria-label="Enter Unique Code"
            />
            {error && (
              <p className="text-red-500 text-xs italic mt-2 bg-red-100 border border-red-400 rounded p-2">
                {error}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChooseAdminPage;
