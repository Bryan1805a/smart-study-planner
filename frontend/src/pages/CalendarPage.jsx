import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Calendar, dateFnsLocalizer} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'en-US': enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasksForCalendar = async () => {
            try {
                const res = await fetch("https://smart-study-planner-api-k97w.onrender.com/api/tasks", {credentials: "include"});

                if (res.ok) {
                    const tasks = await res.json();

                    // Transform task data into calendar events
                    const calendarEvents = tasks.filter(task => task.dueDate).map(task => ({
                        id: task.id,
                        title: task.title,
                        start: new Date(task.dueDate),
                        end: new Date(task.dueDate),
                        allDay: true, // Treat due dates as all-day events
                        isCompleted: task.isCompleted,
                    }));

                    setEvents(calendarEvents);
                }
                else {navigate("/login")};
            } catch (err) {
                console.error("Failed to fetch tasks", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasksForCalendar();
    }, [navigate]);

    // Custom styling for the events
    const eventStyleGetter = (event) => {
        const backgroundColor = event.isCompleted ? '#22c55e' : '#3b82f6'; // Green if done, blue if pending

        const style = {
            backgroundColor,
            borderRadius: '4px',
            opacity: 0.9,
            color: 'white',
            border: '0px',
            display: 'block'
        };

        return {style};
    };

    if (loading) {
        return <div className="min-h-screen app-background flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen app-background text-white p-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Navigation Header */}
                <div className="flex justify-between items-center mb-8">
                    <Link to="/dashboard" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-blue-400">Schedule Overview</h1>
                </div>

                {/* Calendar Container */}
                {/* We wrap the calendar in a white container because its default styles are designed for a light theme */}
                <div className="bg-gray-100/90 backdrop-blur-sm p-6 rounded-lg shadow-xl h-[700px]">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        eventPropGetter={eventStyleGetter}
                        views={['month', 'week', 'agenda']} // Let the user switch between views!
                        toolbar={true}
                        defaultDate={new Date()}
                        view={view}
                        date={date}
                        onView={(nextView) => setView(nextView)}
                        onNavigate={(nextDate) => setDate(nextDate)}
                    />
                </div>

            </div>
        </div>
    );
};