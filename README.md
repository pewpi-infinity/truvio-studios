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

The application displays silver price data and charts. By default, it shows simulated data for demonstration purposes. To enable **real-time market data**:

1. **Choose an API Provider** (free tiers available):
   - **[Metals-API](https://metals-api.com/)** - 100 requests/month free (Recommended)
   - **[GoldAPI.io](https://www.goldapi.io/)** - 100 requests/month free
   - **[MetalpriceAPI](https://metalpriceapi.com/)** - Multiple currencies supported

2. **Sign up and get your API key** from your chosen provider

3. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and set your API key
   VITE_USE_REAL_API=true
   VITE_API_KEY=your_api_key_here
   ```

4. **Restart the development server** to apply changes:
   ```bash
   npm run dev
   ```

The application will now fetch real USA silver spot prices (XAG/USD) and China market prices with proper Shanghai Gold Exchange (SGE) premium calculations.

**Note**: API requests are cached to minimize usage. If the API fails or is unavailable, the system gracefully falls back to cached data or simulated prices.

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
