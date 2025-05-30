const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors())

const API_KEY = '1e1f871d616d43209540712718c54645';
const PORT = 3000;

// Format UTC time to readable string
function formatUTCDate(utcDateStr) {
    const matchDate = new Date(utcDateStr);
    return matchDate.toUTCString();
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Get date N days ahead (default: 8)
function getFutureDate(daysAhead = 10) {
    const future = new Date();
    future.setDate(future.getDate() + daysAhead);
    return future.toISOString().split('T')[0];
}

app.get('/matches', async (req, res) => {
    const dateFrom = getTodayDate();
    const dateTo = getFutureDate();

    const url = `https://api.football-data.org/v4/matches?status=SCHEDULED&dateFrom=${dateFrom}&dateTo=${dateTo}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        const matches = response.data.matches;

        if (!matches.length) {
            return res.json({ message: 'No upcoming matches found in the next 14 days.' });
        }

        const upcoming = matches.map(m => ({
            competition: m.competition.name,
            homeTeam: m.homeTeam.name,
            awayTeam: m.awayTeam.name,
            dateTimeUTC: formatUTCDate(m.utcDate),
            matchday: m.matchday,
            status: m.status
        }));

        res.json({ upcomingMatches: upcoming });

    } catch (error) {
        console.error('Error fetching matches:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to retrieve data',
            details: error.response?.data || error.message
        });
    }
});


app.listen(PORT, () => {
    console.log(`⚽ Football API running at http://localhost:${PORT}/matches`);
});

