const express = require('express');
const path = require('path');
const https = require('https');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Serve the main Jimmy app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Jimmy is running!' });
});

// Check game result via The-Odds-API
app.post('/api/check-game', async (req, res) => {
  try {
    const { team, spread, date, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!team || !date) {
      return res.status(400).json({ error: 'Team and date are required' });
    }

    // Search for the game
    const gameResult = await searchGameResult(team, date, apiKey);

    res.json({
      success: true,
      result: gameResult
    });
  } catch (error) {
    console.error('Error checking game:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to check game result',
      success: false
    });
  }
});

// Search for game result from The-Odds-API
async function searchGameResult(teamName, dateStr, apiKey) {
  return new Promise((resolve) => {
    // Parse date (MM/DD/YYYY)
    const [month, day, year] = dateStr.split('/');
    const gameDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    const daysAgo = Math.floor((today - gameDate) / (1000 * 60 * 60 * 24));

    console.log(`Searching for ${teamName} on ${dateStr} (${daysAgo} days ago)`);

    const options = {
      hostname: 'api.the-odds-api.com',
      path: `/v4/sports/basketball_nba/scores?daysFrom=${daysAgo}&apiKey=${apiKey}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    };

    console.log(`Fetching: https://${options.hostname}${options.path.split('&apiKey')[0]}&apiKey=***`);

    https.get(options, (res) => {
      let body = '';
      console.log(`API Response Status: ${res.statusCode}`);

      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode === 401) {
            resolve({
              status: 'ERROR',
              score: 'Invalid API Key',
              details: 'Please check your The-Odds-API key in Settings'
            });
            return;
          }

          if (res.statusCode !== 200) {
            resolve({
              status: 'ERROR',
              score: `API Error (${res.statusCode})`,
              details: 'Failed to fetch game data'
            });
            return;
          }

          const data = JSON.parse(body);
          const games = data || [];

          console.log(`Found ${games.length} games from The-Odds-API`);

          const normalizedTeamName = teamName.toLowerCase().trim();

          for (const game of games) {
            const homeTeam = game.home_team || '';
            const awayTeam = game.away_team || '';
            const homeScore = game.scores?.find(s => s.name === homeTeam)?.score;
            const awayScore = game.scores?.find(s => s.name === awayTeam)?.score;

            console.log(`Game: ${awayTeam} @ ${homeTeam} - ${awayScore}:${homeScore}`);

            // Check if either team matches
            if (homeTeam.toLowerCase().includes(normalizedTeamName) ||
                awayTeam.toLowerCase().includes(normalizedTeamName) ||
                normalizedTeamName.includes(homeTeam.toLowerCase()) ||
                normalizedTeamName.includes(awayTeam.toLowerCase())) {

              const isHome = homeTeam.toLowerCase().includes(normalizedTeamName) || normalizedTeamName.includes(homeTeam.toLowerCase());
              const teamScore = isHome ? homeScore : awayScore;
              const opponentScore = isHome ? awayScore : homeScore;
              const opponentTeam = isHome ? awayTeam : homeTeam;

              let betResult = 'PENDING';
              if (teamScore !== undefined && opponentScore !== undefined) {
                betResult = teamScore > opponentScore ? 'WIN' : 'LOSS';
              }

              resolve({
                status: betResult,
                score: `${awayTeam} ${awayScore}, ${homeTeam} ${homeScore}`,
                details: betResult === 'WIN'
                  ? `✅ ${teamName} won ${teamScore}-${opponentScore} vs ${opponentTeam}`
                  : `❌ ${teamName} lost ${teamScore}-${opponentScore} to ${opponentTeam}`
              });
              return;
            }
          }

          // No game found
          resolve({
            status: 'PENDING',
            score: `Game not found for ${teamName}`,
            details: `Searched ${games.length} games on this date`
          });

        } catch (e) {
          console.error('Error parsing API response:', e.message);
          resolve({
            status: 'ERROR',
            score: 'Error parsing game data',
            details: e.message
          });
        }
      });
    }).on('error', (err) => {
      console.error('API error:', err.message);
      resolve({
        status: 'ERROR',
        score: 'Connection error',
        details: 'Please check your internet connection'
      });
    });
  });
}

app.listen(PORT, () => {
  console.log(`Jimmy is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
