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

### API Integration (Optional)

To enable real-time silver price data, set these environment variables:

```bash
# Create a .env file in the root directory
VITE_USE_REAL_API=true
VITE_API_KEY=your_api_key_here
```

**Recommended API Providers:**
- [Metals-API](https://metals-api.com/) - Free tier available
- [GoldAPI.io](https://www.goldapi.io/) - 100 requests/month free
- [MetalpriceAPI](https://metalpriceapi.com/) - Multiple currencies

### Repository Configuration

Set your repository URL for the "Build Your Own" feature:

```bash
VITE_REPO_URL=https://github.com/your-username/your-repo
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
