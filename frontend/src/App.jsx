import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';

// A simple temporary Home component
function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-6 text-blue-400">Smart Study Planner</h1>
      <Link to="/register" className="text-blue-400 hover:underline text-xl">Go to Registration Page</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;