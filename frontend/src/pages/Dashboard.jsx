import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Verify User
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });

        if (!userRes.ok) {
          navigate('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData);

        // 2. Fetch Subjects
        const subjectsRes = await fetch('http://localhost:5000/api/subjects', {
          credentials: 'include', // MUST include this to send the cookie!
        });

        if (subjectsRes.ok) {
          const subjectsData = await subjectsRes.json();
          setSubjects(subjectsData);
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // --- CREATE SUBJECT ---
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubjectName }),
        credentials: 'include',
      });

      if (res.ok) {
        const newSubject = await res.json();
        // Update the state immediately so the UI refreshes
        setSubjects([...subjects, newSubject]);
        setNewSubjectName(''); // Clear the input field
      }
    } catch (err) {
      console.error('Failed to create subject', err);
    }
  };

  // --- DELETE SUBJECT ---
  const handleDeleteSubject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        // Remove the deleted subject from our state
        setSubjects(subjects.filter((sub) => sub.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete subject', err);
    }
  };

  // --- LOGOUT ---
  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { 
      method: 'POST', 
      credentials: 'include' 
    });
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-400 mb-1">My Dashboard</h1>
            <p className="text-gray-400">Logged in as: <span className="text-green-400 font-mono">{user?.email}</span></p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition">
            Logout
          </button>
        </div>
        
        {/* Subjects Section */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-200">My Subjects</h2>
          
          {/* Create Subject Form */}
          <form onSubmit={handleCreateSubject} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="e.g., Computer Science 101"
              className="flex-1 bg-gray-700 text-white rounded p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors">
              Add Subject
            </button>
          </form>

          {/* List of Subjects */}
          {subjects.length === 0 ? (
            <p className="text-gray-400 italic">No subjects added yet. Create one above!</p>
          ) : (
            <ul className="space-y-3">
              {subjects.map((subject) => (
                <li key={subject.id} className="flex justify-between items-center bg-gray-700 p-4 rounded-md border border-gray-600">
                  <span className="text-lg font-medium">{subject.name}</span>
                  <button 
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="text-red-400 hover:text-red-300 font-semibold"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}