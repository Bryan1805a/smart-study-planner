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
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-5 rounded-lg border border-indigo-500 shadow-lg mb-8 animate-pulse-slow">
            <div className="flex items-center gap-4">
                <div className="text-3xl">Suggestion</div>
                <p className="text-white font-medium text-lg tracking-wide">
                    {suggestion}
                </p>
            </div>
        </div>
  );
}