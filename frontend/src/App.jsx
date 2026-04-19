import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Timer from './pages/Timer';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <Routes>
      {/* Redirect the base URL straight to login for now */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/timer' element={<Timer />} />
      <Route path='/calendar' element={<CalendarPage />} />
    </Routes>
  );
}

export default App;