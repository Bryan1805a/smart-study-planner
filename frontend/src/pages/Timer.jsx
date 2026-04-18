import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

export default function Timer() {
    // State for the timer
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins in secs
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    // Countdown logic
    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }
        else if (isActive && timeLeft === 0) {
            // If time runs out, stop the timer and alert the user
            clearInterval(interval);
            alert(isBreak ? "Break is over! Time to focus." : "Great job! Time for a 5-minutes break.");

            // Automatically switch between Work and Break modes
            const nextIsBreak = !isBreak;
            setIsBreak(nextIsBreak);
            setTimeLeft(nextIsBreak ? 5 * 60 : 25 * 60);
            setIsActive(false);
        }

        // Clean up function:
        // Clears the interval when the component unmounts or state changes
        return () => clearInterval(interval);
    }, [isActive, timeLeft, isBreak]);

    // Helper function to turn "1500" secs into "25:00"
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Button handlers
    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    };

    const switchMode = (toBreak) => {
        setIsActive(false);
        setIsBreak(toBreak);
        setTimeLeft(toBreak ? 5 * 60 : 25 * 60);
    };

    return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      
      {/* Navigation back to Dashboard */}
      <div className="absolute top-8 left-8">
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition flex items-center gap-2">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Focus Mode</h1>

        {/* Mode Switchers */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => switchMode(false)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${!isBreak ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
          >
            Pomodoro (25m)
          </button>
          <button 
            onClick={() => switchMode(true)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${isBreak ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
          >
            Short Break (5m)
          </button>
        </div>

        {/* The Clock */}
        <div className="text-8xl font-mono font-bold mb-8 tracking-wider text-gray-100">
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition ${isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {isActive ? 'PAUSE' : 'START'}
          </button>
          <button 
            onClick={resetTimer}
            className="px-8 py-3 rounded-lg font-bold text-lg bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
}