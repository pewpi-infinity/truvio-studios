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

### Real-Time Silver Price API Setup

The application displays silver price data and charts using a **multi-source aggregation system** that combines prices from worldwide exchanges. By default, it shows simulated data for demonstration purposes. To enable **real-time market data**:

#### Multi-Index Aggregation Algorithm

The system fetches silver prices from multiple worldwide exchanges and calculates a weighted average:

- **LBMA (London)** - 40% weight - Global benchmark for precious metals
- **COMEX (USA)** - 30% weight - Major futures market
- **Shanghai Gold Exchange (China)** - 20% weight - Largest physical silver market
- **Other markets** - 10% weight - Regional exchanges

This weighted approach provides a comprehensive, globally-representative silver price that accounts for regional variations and market dynamics.

#### API Provider Setup

1. **Choose one or more API providers** (free tiers available):
   - **[MetalpriceAPI](https://metalpriceapi.com/)** - Multiple currencies, reliable data
   - **[Metals-API](https://metals-api.com/)** - 100 requests/month free (Recommended)
   - **[Commodities-API](https://commodities-api.com/)** - Commodities data provider

2. **Sign up and get your API keys** from your chosen provider(s)

3. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and set your API keys
   VITE_USE_REAL_API=true
   VITE_METALPRICEAPI_KEY=your_metalpriceapi_key_here
   VITE_METALS_API_KEY=your_metals_api_key_here
   VITE_COMMODITIES_API_KEY=your_commodities_api_key_here
   ```

4. **Restart the development server** to apply changes:
   ```bash
   npm run dev
   ```

#### Features

- **Multi-source fetching**: Attempts to fetch from multiple APIs with automatic fallback
- **Smart caching**: Data less than 30 seconds old is reused to minimize API calls
- **Persistent storage**: Price history stored in localStorage for offline viewing
- **Automatic updates**: Prices refresh every 60 seconds for real-time tracking
- **Exchange breakdown**: View which exchanges are contributing to the aggregated price
- **24-hour metrics**: Displays high, low, and volume data
- **Graceful degradation**: Falls back to cached or simulated data if APIs fail

The application displays:
- Aggregated worldwide silver spot prices (XAG/USD)
- China market prices with Shanghai Gold Exchange (SGE) premium calculations
- Individual exchange contributions with visual indicators
- Historical price charts with smooth animations

**Note**: API requests are intelligently cached. The system implements exponential backoff for failed requests and always provides data even when APIs are unavailable.

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

### Video Storage - Important Limitations

**🔒 Local Storage Only**: Videos uploaded to Truvio Studios are stored in **IndexedDB** (browser-local storage) and are **NOT automatically shared** when you share your studio link.

#### How Video Storage Works

- **Video files** are stored in your browser's IndexedDB (client-side storage)
- **Video metadata** (title, description, hashtags) is stored in GitHub Spark KV store
- When you share your studio URL, **only the metadata is visible** to other users
- Other users will **not** see the actual video files you've uploaded

#### Limitations

❌ **Cannot share videos** - Videos are stored locally and not accessible to others  
❌ **Browser-specific** - Videos only appear in the browser where they were uploaded  
❌ **Not persistent across devices** - Videos don't sync between your devices  
❌ **Risk of data loss** - Clearing browser data will delete all videos  

#### Workarounds

1. **For Personal Use**: The current system works well for personal video organization and presentations on a single device
2. **For Sharing**: Consider using video hosting services (YouTube, Vimeo) and linking to them instead
3. **Export/Import** (Future): We plan to add export/import functionality to move videos between browsers

#### Why This Limitation Exists

This limitation is by design to keep the application simple and free from server hosting costs. Adding true video persistence would require:
- Cloud storage integration (AWS S3, Cloudinary, etc.)
- Server infrastructure for video processing
- Authentication and authorization systems
- Significant costs for storage and bandwidth

If you need persistent video sharing, consider forking the repository and adding integration with a cloud storage provider.

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
