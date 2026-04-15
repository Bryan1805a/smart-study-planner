import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged
        const checkUser = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
                else {
                    navigate("/login");
                }
            } catch (err) {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [navigate]);

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
    }

    return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">My Dashboard</h1>
        <p className="text-gray-400 mb-8">Logged in as: <span className="text-green-400 font-mono">{user?.email}</span></p>
        
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-200">Study Overview</h2>
          <p className="text-gray-400">
            Welcome to your Smart Study Planner! Soon, we will fetch your Subjects and Tasks here.
          </p>
        </div>
      </div>
    </div>
  );
}