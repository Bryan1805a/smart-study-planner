import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        setError('');

        try {
            const response = await fetch("https://smart-study-planner-api-k97w.onrender.com/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
                credentials: "include", // Tells REACT to accept the HTTP only cookie
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/');
            }
            else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Could not connect to the server.");
        }
    };
    
    return (
    <div className="min-h-screen flex items-center justify-center app-background">
      <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-96 border border-gray-600/50">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors mt-2"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};