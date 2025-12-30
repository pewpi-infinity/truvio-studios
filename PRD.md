# Planning Guide

Truvio Studios is a decentralized video sharing platform where creators upload and manage their own video content, users connect studios through search and hashtag discovery, and real-time financial data (silver prices) is integrated for presentation purposes.

**Experience Qualities**:
1. **Empowering** - Creators have full ownership and control over their content with persistent storage and management capabilities
2. **Connected** - Hashtag-based navigation creates an organic web of linked studios, enabling discovery through shared topics and themes
3. **Professional** - Clean interface with integrated live financial data transforms personal videos into polished presentations

**Complexity Level**: Light Application (multiple features with basic state)
This is a content management and discovery platform with video upload, persistent storage, hashtag parsing, search functionality, and live data integration. It requires state management but doesn't need complex routing or backend infrastructure.

## Essential Features

**Video Upload & Management**
- Functionality: Upload video files from local device, display them with title and description, persist across sessions
- Purpose: Enable creators to build their own video studio with full control
- Trigger: Click upload button or drag-and-drop video files
- Progression: Select file → Enter title/description/hashtags → Preview → Save → Video appears in studio grid
- Success criteria: Videos persist after page refresh, only owner can edit/delete their videos

**Hashtag Navigation System**
- Functionality: Parse hashtags from video descriptions, make them clickable, enable discovery across Truvio Studios
- Purpose: Create interconnected network of studios through shared topics
- Trigger: Click any hashtag in video description
- Progression: Click hashtag → See explanation of linking → Opens search with hashtag term
- Success criteria: Hashtags are visually distinct, clickable, and initiate search

**Search & Discovery**
- Functionality: Search videos by title, description, or hashtags with real-time filtering
- Purpose: Enable users to find related content across all Truvio Studios instances
- Trigger: Type in search bar
- Progression: Enter search term → Results filter instantly → Click result → Scroll to video
- Success criteria: Search works across all text fields, highlights matching videos

**Live Silver Price Feed**
- Functionality: Display real-time silver price with live chart showing price movements
- Purpose: Provide professional financial data context for presentation videos
- Trigger: Loads automatically on page load
- Progression: Page loads → API fetches silver data → Price displays → Chart renders with historical data
- Success criteria: Price updates regularly, chart shows meaningful timeframe, data is accurate

**Platform Connection Guide**
- Functionality: Educational section explaining how to link Truvio Studios together
- Purpose: Help users understand the decentralized connection model
- Trigger: Scroll to bottom of page
- Progression: Read explanation → Understand hashtag system → Learn about Spark interconnection
- Success criteria: Clear, concise explanation of the linking mechanism and business potential

## Edge Case Handling
- **No videos uploaded**: Display welcoming empty state with upload prompt and example hashtags
- **Large video files**: Show upload progress indicator and file size limits/warnings
- **Invalid file types**: Validate file is video format, show error message for unsupported files
- **Network failure on price feed**: Show last known price with "updating..." status
- **Search with no results**: Display helpful message suggesting different search terms
- **Malformed hashtags**: Parse intelligently, handle special characters gracefully

## Design Direction
The design should evoke a sense of modern professionalism with cutting-edge technology vibes. Think sleek media platform meets financial dashboard - sophisticated, trustworthy, and innovative. The interface should feel like a premium content studio with subtle luxury touches that communicate value and quality.

## Color Selection
A sophisticated palette that bridges media/entertainment with financial professionalism, using deep teals and metallic accents to reference both video production and precious metals.

- **Primary Color**: Deep Teal (oklch(0.45 0.12 210)) - Communicates trust, technology, and creative depth; bridges entertainment and finance
- **Secondary Colors**: 
  - Charcoal (oklch(0.25 0.01 260)) - Professional grounding for content cards and containers
  - Silver Gray (oklch(0.75 0.01 260)) - Subtle reference to silver market, used for secondary UI elements
- **Accent Color**: Bright Cyan (oklch(0.72 0.15 210)) - High-energy highlight for CTAs, active states, and price changes
- **Foreground/Background Pairings**:
  - Background (Deep Navy oklch(0.15 0.02 260)): Light text (oklch(0.97 0.01 260)) - Ratio 14.2:1 ✓
  - Primary (Deep Teal oklch(0.45 0.12 210)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Accent (Bright Cyan oklch(0.72 0.15 210)): Dark text (oklch(0.15 0.02 260)) - Ratio 8.9:1 ✓
  - Card (Dark Slate oklch(0.22 0.02 260)): Light text (oklch(0.97 0.01 260)) - Ratio 11.8:1 ✓

## Font Selection
Typography should balance modern tech aesthetics with media industry polish - clean geometric forms with subtle character.

- **Primary Font**: Space Grotesk - A distinctive geometric sans-serif with technical precision and contemporary edge, perfect for the "studio" branding
- **Secondary Font**: Inter - Clean, highly legible for body text and UI elements
- **Typographic Hierarchy**:
  - H1 (Truvio Studios Logo): Space Grotesk Bold/32px/tight tracking (-0.02em)
  - H2 (Section Headers): Space Grotesk SemiBold/24px/normal tracking
  - H3 (Video Titles): Space Grotesk Medium/18px/normal tracking
  - Body (Descriptions, UI): Inter Regular/15px/relaxed leading (1.6)
  - Small (Metadata, Labels): Inter Medium/13px/normal leading
  - Price Display: Space Grotesk Bold/28px/tight tracking (monospaced numbers)

## Animations
Animations should reinforce the professional media production feel with smooth, purposeful motion that suggests precision and quality.

- **Upload Interactions**: Smooth drag-drop zone with scale and glow effect on hover (framer-motion), pulsing border during drag-over
- **Video Grid**: Staggered fade-in on load with subtle lift on hover, smooth scale transform
- **Hashtag Clicks**: Gentle bounce feedback when clicked, color transition on hover
- **Price Updates**: Smooth number transitions with subtle flash on change (green for up, red for down)
- **Chart Animations**: Line draws in on load, smooth transitions between data points
- **Search Filtering**: Fade out non-matching videos, fade in matches with slight position shift

## Component Selection
- **Components**:
  - Card: Video containers with hover effects, dark background with subtle border
  - Button: Primary actions (upload, search) with gradient hover states
  - Input: Search bar with icon, file input with custom styled drop zone
  - Dialog: Video upload form modal with preview
  - Badge: Hashtags with pill shape, clickable with hover states
  - Separator: Between sections with subtle gradient
  - Scroll Area: Video grid container for smooth scrolling
  - Alert: Info section at bottom explaining linking
  
- **Customizations**:
  - Custom video upload drop zone with dashed border and icon
  - Custom price ticker component with animated numbers
  - Custom chart integration using D3 for silver prices
  - Video player controls with custom styling to match theme
  - Gradient overlays on video thumbnails for depth
  
- **States**:
  - Buttons: Rest (gradient background), Hover (brighter gradient, lift), Active (pressed down), Disabled (desaturated)
  - Hashtags: Rest (badge style), Hover (brighter background, scale 1.05), Active (accent color)
  - Video Cards: Rest (elevated), Hover (higher elevation, border glow), Selected (accent border)
  - Inputs: Rest (border), Focus (accent ring, lift), Error (red border), Success (green subtle border)
  
- **Icon Selection**:
  - Upload: CloudArrowUp (upload zone)
  - Video: Video (empty state, video cards)
  - Search: MagnifyingGlass (search input)
  - Hash: Hash (hashtag indicator)
  - Chart: ChartLine (price section)
  - Link: Link (connection guide)
  - Play: Play (video controls)
  - Edit: PencilSimple (edit video)
  - Trash: Trash (delete video)
  
- **Spacing**:
  - Container padding: p-8 (desktop), p-4 (mobile)
  - Card padding: p-6
  - Grid gap: gap-6 (desktop), gap-4 (mobile)
  - Section spacing: space-y-12 (desktop), space-y-8 (mobile)
  - Button padding: px-6 py-3
  
- **Mobile**:
  - Stack video grid to single column on mobile
  - Fixed header with search, scroll with videos below
  - Upload button floats as FAB on mobile
  - Silver price ticker sticky at top on mobile
  - Chart responsive with touch gestures
  - Simplified card layout with smaller thumbnails
