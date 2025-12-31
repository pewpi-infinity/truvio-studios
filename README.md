# Truvio Studios - Decentralized Video Presentation Platform

Truvio Studios is a decentralized video sharing platform where creators upload and manage their own video content, integrated with real-time financial data for professional presentations.

## Features

✨ **Video Management** - Upload, organize, and present your video content
📊 **Live Market Data** - Integrated commodity price feeds with charts
🌏 **China Market Tracking** - Dedicated Shanghai market pricing with USD conversion
🎨 **Customizable Context** - Switch presentation topics dynamically
🔗 **Decentralized Network** - Connect studios through hashtag discovery
👥 **Viewer Mode** - Clean presentation view for visitors

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/pewpi-infinity/truvio-studios.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Configuration

### Silver Price Data

The application displays silver price data and charts using a **multi-index aggregation system** that simulates prices from worldwide exchanges with realistic market behavior.

#### Multi-Index Aggregation Algorithm

The system simulates silver prices from multiple worldwide exchanges and calculates a weighted average:

- **LBMA (London)** - 40% weight - Global benchmark for precious metals
- **COMEX (USA)** - 30% weight - Major futures market
- **Shanghai Gold Exchange (China)** - 20% weight - Largest physical silver market
- **Other markets** - 10% weight - Regional exchanges

This weighted approach provides a comprehensive, globally-representative silver price that accounts for regional variations and market dynamics.

#### Features

- **Live price simulation**: Realistic market behavior with proper volatility
- **Smart caching**: Data less than 30 seconds old is reused
- **Persistent storage**: Price history stored in localStorage for offline viewing
- **Automatic updates**: Prices refresh every 60 seconds for real-time tracking
- **Exchange breakdown**: View which exchanges are contributing to the aggregated price
- **24-hour metrics**: Displays high, low, and volume data

The application displays:
- Aggregated worldwide silver spot prices (XAG/USD)
- China market prices with Shanghai Gold Exchange (SGE) premium calculations
- Individual exchange contributions with visual indicators
- Historical price charts with smooth animations

### Repository Configuration

Set your repository URL for the "Build Your Own" feature:

```bash
VITE_REPO_URL=https://github.com/your-username/your-repo
```

### Presentation Context Configuration

The application displays a customizable presentation context (e.g., "Silver", "Gold", "Commodities"). 

- The default context is defined in `runtime.config.json`
- Users can change the context via the "Change Context" button in the UI
- Runtime changes are stored in the browser's KV store and persist across sessions
- To make a context change permanent across deployments:
  1. Edit `runtime.config.json` in the repository
  2. Update the `presentationContext` field
  3. Commit and push the changes
  
Example `runtime.config.json`:
```json
{
  "app": "78b7da0b5b514ee56610",
  "presentationContext": "Gold"
}
```

## Usage

### Video Storage

Videos uploaded to Truvio Studios are **automatically committed to the repository** in the `public/videos` directory.

#### How Video Storage Works

- **Video files** are stored in `public/videos/` directory in the repository
- **Thumbnail images** are stored in `public/thumbnails/` directory
- **Video metadata** (title, description, hashtags) is stored in GitHub Spark KV store
- When you upload a video, it's automatically committed to the main branch
- Videos are accessible to anyone viewing your deployed site

#### Features

✅ **Persistent storage** - Videos are committed to Git and persist across deployments  
✅ **Shareable** - Anyone with your studio URL can view the videos  
✅ **Version controlled** - All videos are tracked in Git history  
✅ **No external dependencies** - No need for cloud storage services  

#### Requirements

- GitHub authentication (automatically handled by Spark)
- Write access to the repository
- Videos are limited by GitHub repository size constraints (recommended < 100MB per video)

### As a Studio Owner

1. **Upload Videos**: Click "Upload Video" to add content
2. **Change Context**: Use "Change Context" to customize your presentation topic
3. **Manage Content**: Edit or delete your videos as needed

### As a Viewer

- Browse videos and market data
- Click hashtags to discover related content
- Use "Fork Repository" to create your own studio

## Deployment

### GitHub Pages

The project is configured for GitHub Pages deployment:

```bash
# Build the project
npm run build

# Deploy the dist folder to GitHub Pages
```

The `base` path is set to `/truvio-studios/` in `vite.config.ts`. Update this to match your repository name.

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: D3.js
- **Build Tool**: Vite 7
- **Storage**: GitHub Spark KV Store
- **UI Components**: Radix UI, shadcn/ui

## Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   ├── SilverPriceTicker.tsx
│   ├── ChinaSilverChart.tsx
│   └── VideoCard.tsx
├── lib/              # Utilities and helpers
│   ├── silverApi.ts  # Market data API
│   └── types.ts      # TypeScript types
└── App.tsx           # Main application
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## Support

For issues and questions, please use the GitHub Issues tab.

---

**Powered by GitHub Spark** - Build and deploy your own studio today!
