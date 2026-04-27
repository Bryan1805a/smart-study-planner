import {useState, useEffect} from 'react';

export default function StudySuggestion() {
    const [suggestion, setSuggestion] = useState("Analysing your schedule...");

    useEffect(() => {
        const fetchSuggestion = async () => {
            try {
                const res = await fetch("https://smart-study-planner-api-k97w.onrender.com/api/suggestions", {credentials: "include"});

                if (res.ok) {
                    const data = await res.json();
                    setSuggestion(data.message);
                }
                else {
                    setSuggestion("Could not load suggestions right now.");
                }
            } catch (error) {
                setSuggestion("Could not connect to the smart engine.");
            }
        };

        fetchSuggestion();
    }, []);

return (
        <div className="bg-gradient-to-r from-indigo-900/80 to-blue-900/80 backdrop-blur-sm p-5 rounded-xl border border-indigo-500/50 shadow-lg mb-8">
            <div className="flex items-center gap-4">
                <div className="text-3xl text-white">Suggestion | </div>
                <p className="text-white font-medium text-lg tracking-wide">
                    {suggestion}
                </p>
            </div>
        </div>
    );
}