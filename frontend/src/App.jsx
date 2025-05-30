import { useState, useEffect } from 'react'
import reactlogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {

  const [matches, setMatches] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3000/matches')
     .then((res) => {
        console.log('Full response:', res.data); // Check actual structure here
        setMatches(res.data.upcomingMatches || res.data); // Fallback if direct array
      })
      .catch((err) => {
        console.error('Error fetching matches:', err);
      });
  }, []);

  return (
    <div className="app-container">
      <h1>Upcoming Soccer Matches</h1>
      {matches.length === 0 ? (
        <p>Loading matches...</p>
      ) : (
        matches.map((m, idx) => (
          <div key={idx} className="match-card">
            <p className="competition">{m.competition || 'No Competition Info'}</p>
            <p className="teams">{m.homeTeam} vs {m.awayTeam}</p>
            <p className="datetime">
              Date & Time: {m.dateTimeUTC ? new Date(m.dateTimeUTC).toLocaleString() : 'Not Available'}
            </p>
            <p className="status">Status: {m.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;