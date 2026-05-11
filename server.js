const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve the main Jimmy app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'jimmy-with-tabs.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Jimmy is running!' });
});

app.listen(PORT, () => {
  console.log(`Jimmy is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
