import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubjectId, setNewTaskSubjectId] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Verify User
        const userRes = await fetch('http://localhost:5000/api/auth/me', { credentials: 'include' });
        if (!userRes.ok) return navigate('/login');
        setUser(await userRes.json());

        // Fetch Subjects
        const subjectsRes = await fetch('http://localhost:5000/api/subjects', { credentials: 'include' });
        if (subjectsRes.ok) setSubjects(await subjectsRes.json());

        // Fetch Tasks
        const tasksRes = await fetch('http://localhost:5000/api/tasks', { credentials: 'include' });
        if (tasksRes.ok) setTasks(await tasksRes.json());

      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Subject function
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
        setSubjects([...subjects, await res.json()]);
        setNewSubjectName('');
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteSubject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setSubjects(subjects.filter((s) => s.id !== id));
        // Also remove any tasks associated with this subject from the UI
        setTasks(tasks.filter((t) => t.subjectId !== id)); 
      }
    } catch (err) { console.error(err); }
  };

  // Task function
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskSubjectId) return;

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTaskTitle, 
          subjectId: newTaskSubjectId,
          dueDate: newTaskDueDate || null 
        }),
        credentials: 'include',
      });

      if (res.ok) {
        setTasks([...tasks, await res.json()]);
        setNewTaskTitle('');
        setNewTaskDueDate('');
        // We leave newTaskSubjectId as is, in case they want to add multiple tasks to the same subject
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentStatus }),
        credentials: 'include',
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: updatedTask.isCompleted } : t));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) { console.error(err); }
  };

  // Logout
  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-400 mb-1">My Dashboard</h1>
            <p className="text-gray-400">Logged in as: <span className="text-green-400 font-mono">{user?.email}</span></p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition">Logout</button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Subjects */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">Subjects</h2>
            <form onSubmit={handleCreateSubject} className="flex gap-2 mb-6">
              <input 
                type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="New Subject..." className="flex-1 bg-gray-700 text-white rounded p-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 rounded font-bold">+</button>
            </form>
            <ul className="space-y-2">
              {subjects.map((subject) => (
                <li key={subject.id} className="flex justify-between items-center bg-gray-700 p-3 rounded border border-gray-600">
                  <span className="font-medium">{subject.name}</span>
                  <button onClick={() => handleDeleteSubject(subject.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT COLUMN: Tasks */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-200">Tasks</h2>
            
            {/* Create Task Form */}
            <form onSubmit={handleCreateTask} className="flex flex-col md:flex-row gap-3 mb-8 bg-gray-750 p-4 rounded-lg border border-gray-600">
              <input 
                type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?" className="flex-2 bg-gray-700 rounded p-2 outline-none focus:ring-2 focus:ring-green-500"
              />
              <select 
                value={newTaskSubjectId} onChange={(e) => setNewTaskSubjectId(e.target.value)}
                className="flex-1 bg-gray-700 rounded p-2 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input 
                type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-gray-700 rounded p-2 outline-none focus:ring-2 focus:ring-green-500 color-scheme-dark"
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                Add Task
              </button>
            </form>

            {/* Task List */}
            {tasks.length === 0 ? (
              <p className="text-gray-400 italic text-center py-4">No tasks yet. You are all caught up!</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${task.isCompleted ? 'bg-gray-800 border-green-900/50 opacity-60' : 'bg-gray-700 border-gray-600'}`}>
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <input 
                        type="checkbox" checked={task.isCompleted} onChange={() => handleToggleTask(task.id, task.isCompleted)}
                        className="w-5 h-5 accent-green-500 cursor-pointer"
                      />
                      <div>
                        <p className={`text-lg font-medium ${task.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          <span className="text-blue-400">{task.subject?.name || 'Unknown Subject'}</span> 
                          {task.dueDate && ` • Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-red-400 hover:text-red-300 text-sm self-end sm:self-auto">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}