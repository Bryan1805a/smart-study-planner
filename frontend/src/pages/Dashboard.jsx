import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import ProgressChart from '../components/ProgressChart';
import StudySuggestion from '../components/StudySuggestion';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubjectId, setNewTaskSubjectId] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await fetch('https://smart-study-planner-api-k97w.onrender.com/api/auth/me', { credentials: 'include' });
        if (!userRes.ok) return navigate('/login');
        setUser(await userRes.json());

        const subjectsRes = await fetch('https://smart-study-planner-api-k97w.onrender.com/api/subjects', { credentials: 'include' });
        if (subjectsRes.ok) setSubjects(await subjectsRes.json());

        const tasksRes = await fetch('https://smart-study-planner-api-k97w.onrender.com/api/tasks', { credentials: 'include' });
        if (tasksRes.ok) setTasks(await tasksRes.json());
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      const res = await fetch('https://smart-study-planner-api-k97w.onrender.com/api/subjects', {
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
      const res = await fetch(`https://smart-study-planner-api-k97w.onrender.com/api/subjects/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setSubjects(subjects.filter((s) => s.id !== id));
        setTasks(tasks.filter((t) => t.subjectId !== id)); 
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskSubjectId) return;
    try {
      const res = await fetch('https://smart-study-planner-api-k97w.onrender.com/api/tasks', {
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
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleTask = async (id, currentStatus) => {
    try {
      const res = await fetch(`https://smart-study-planner-api-k97w.onrender.com/api/tasks/${id}/complete`, {
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
      const res = await fetch(`https://smart-study-planner-api-k97w.onrender.com/api/tasks/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleLogout = async () => {
    await fetch('https://smart-study-planner-api-k97w.onrender.com/api/auth/logout', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  const pendingTasks = tasks.filter(t => !t.isCompleted);

  if (loading) return <div className="min-h-screen app-background flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen app-background flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gray-900/60 backdrop-blur-md border-r border-gray-700/50 flex flex-col p-6">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white mb-4">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-semibold text-white">{user?.email?.split('@')[0]}</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => navigate('/calendar')}
            className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            Calendar
          </button>
          <button 
            onClick={() => navigate('/timer')}
            className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            Focus Timer
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 transition"
        >
          Logout
        </button>
      </aside>

      {/* CENTER CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <StudySuggestion />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subjects */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-white">Subjects |</h2>
            <form onSubmit={handleCreateSubject} className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newSubjectName} 
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Add new subject..."
                className="flex-1 bg-gray-800/80 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 rounded-lg font-bold">+</button>
            </form>
            <ul className="space-y-2">
              {subjects.map((subject) => (
                <li key={subject.id} className="flex justify-between items-center bg-gray-800/60 p-3 rounded-lg border border-gray-700/50">
                  <span className="font-medium text-gray-200">{subject.name}</span>
                  <button onClick={() => handleDeleteSubject(subject.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </li>
              ))}
              {subjects.length === 0 && <p className="text-gray-500 text-sm">No subjects yet</p>}
            </ul>
          </div>

          {/* Progress Chart */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <ProgressChart tasks={tasks} />
          </div>

          {/* Tasks */}
          <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-white">Tasks</h2>
            <form onSubmit={handleCreateTask} className="flex flex-col md:flex-row gap-3 mb-6 p-4 bg-gray-800/40 rounded-lg border border-gray-700/50">
              <input 
                type="text" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What needs to be done?" 
                className="flex-1 bg-gray-800/80 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
              />
              <select 
                value={newTaskSubjectId} 
                onChange={(e) => setNewTaskSubjectId(e.target.value)}
                className="bg-gray-800/80 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
              >
                <option value="" disabled>Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input 
                type="date" 
                value={newTaskDueDate} 
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-gray-800/80 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Add
              </button>
            </form>

            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks yet. You are all caught up!</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${task.isCompleted ? 'bg-gray-800/30 border-green-900/30 opacity-60' : 'bg-gray-800/60 border-gray-700/50'}`}>
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <input 
                        type="checkbox" 
                        checked={task.isCompleted} 
                        onChange={() => handleToggleTask(task.id, task.isCompleted)}
                        className="w-5 h-5 accent-green-500 cursor-pointer"
                      />
                      <div>
                        <p className={`text-lg font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
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
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-72 bg-gray-900/60 backdrop-blur-md border-l border-gray-700/50 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-6">Ongoing Tasks</h2>
        
        <div className="space-y-4">
          {pendingTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending tasks</p>
          ) : (
            pendingTasks.slice(0, 10).map((task) => (
              <div key={task.id} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/50">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="font-medium text-white">{task.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {task.subject?.name || 'No subject'}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-orange-400 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Subjects</h3>
          <div className="space-y-2">
            {subjects.map((subject) => {
              const subjectTasks = tasks.filter(t => t.subjectId === subject.id && !t.isCompleted);
              return (
                <div key={subject.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{subject.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${subjectTasks.length > 0 ? 'bg-blue-600/30 text-blue-400' : 'bg-gray-700 text-gray-500'}`}>
                    {subjectTasks.length}
                  </span>
                </div>
              );
            })}
            {subjects.length === 0 && <p className="text-gray-500 text-sm">No subjects yet</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}