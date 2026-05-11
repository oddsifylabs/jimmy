# Jimmy - Sports Bet Checker

Your instant sports bet checker with modern design and powerful features.

## Features

✅ **Quick Bet Checking** - Check results instantly  
✅ **Import/Export** - Support for AlexBet CSV, JSON, and simple CSV  
✅ **Modern Design** - Clean dark theme with custom icons  
✅ **No API Key Required** - Works with ESPN database  
✅ **Offline Support** - All data stored locally  
✅ **Multiple Formats** - Spreads, moneylines, totals, props  
✅ **Responsive** - Works on desktop and mobile  

## Local Setup

1. Install Node.js (if not already installed)
2. Clone or download this repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser to `http://localhost:3000`

## Deploy to Railway

### Step 1: Push to GitHub (Optional but recommended)
```bash
git init
git add .
git commit -m "Initial commit: Jimmy bet checker"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub or create an account
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Select your repository (or paste GitHub link)
6. Railway will automatically detect Node.js project
7. Click "Deploy"

### Step 3: Configure Railway (if needed)
- Railway automatically detects `package.json` and `server.js`
- The app will start on the PORT environment variable
- Your app will be live at: `https://your-project.railway.app`

## Environment Variables

Railway will automatically set:
- `PORT` - The port your app runs on (default: 3000)

## Usage

### Checking Bets
1. Enter bets in format: `Team Name Spread - MM/DD/YYYY`
2. Click "Check Results"
3. View WIN/LOSS status instantly

### Examples
- `Carolina Hurricanes -1.5 - 05/08/2026`
- `Houston Astros ML - 05/08/2026`
- `Toronto Raptors +8.5 - 04/29/2026`

### Import Options
- **AlexBet Signal Pro CSV** - Upload exported CSV files
- **Simple CSV** - Create your own (Team,Spread,Date)
- **Jimmy JSON** - Export and re-import your bets

### Export Options
- Click "Export" to download bets as JSON
- Perfect for backups and record keeping

## File Structure

```
.
├── server.js              # Express server
├── package.json          # Node.js dependencies
├── jimmy-with-tabs.html  # Main Jimmy application
├── README.md             # This file
└── .railwayignore        # Railway configuration
```

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express
- **Deployment**: Railway
- **Storage**: Browser localStorage (client-side)

## Data Privacy

All your bet data is stored locally on your device. Nothing is sent to external servers. You can use Jimmy completely offline after first load.

## Support

For issues or feature requests, please check the "How to Use" tab in the app.

## License

MIT License

---

**Jimmy** - Made with ⚡ for sports bettors everywhere
