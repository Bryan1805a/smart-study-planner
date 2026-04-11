import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // fetch data from the backend when the page loads
    fetch('http://localhost:5000/')
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => setMessage('Failed to connect to backend!'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-6 text-blue-400">Smart Study Planner</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold mb-2 text-green-400">Backend Status:</h2>
        <p className="text-lg">{message}</p>
      </div>
    </div>
  )
}

export default App