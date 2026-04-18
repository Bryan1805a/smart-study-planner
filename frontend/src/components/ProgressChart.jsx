import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend} from 'recharts';

export default function ProgressChart({tasks}) {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400 italic">Add some tasks to see your progress!</p>
            </div>
        );
    }

    // Process the data:
    // Group tasks by subject and count completed & pending
    const processData = () => {
        const subjectStats = {};

        tasks.forEach(task => {
            // Get the subject name
            const subjectName = task.subject?.name || "Uncategorized";

            // Init the subject in our tracking object if it doesn't exist
            if (!subjectStats[subjectName]) {
                subjectStats[subjectName] = {name: subjectName, Completed: 0, Pending: 0};
            }

            // Increment the correct counter
            if (task.isCompleted) {
                subjectStats[subjectName].Completed += 1;
            }
            else {
                subjectStats[subjectName].Pending += 1;
            }
        });

        // Convert the object back into an array for Recharts
        return Object.values(subjectStats);
    };

    const chartData = processData();

    return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-80 w-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-200">Subject Progress</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
          <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} allowDecimals={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          {/* Green for completed, Blue for pending */}
          <Bar dataKey="Completed" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
          <Bar dataKey="Pending" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}