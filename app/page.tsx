'use client';

import { useState } from 'react';

interface Grade {
    name: string;
    currentGrades: string;
}

export default function Home() {
    const [grades, setGrades] = useState<Grade[] | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/grades');
            const data = await response.json();
            console.log('Fetched grades:', data); // Логируем полученные данные
            setGrades(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Welcome to the Grade Fetcher</h1>
            <button onClick={fetchGrades} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Grades'}
            </button>
            {grades && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Current Grades</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((grade, index) => (
                            <tr key={index}>
                                <td>{grade.name}</td>
                                <td>{grade.currentGrades}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
