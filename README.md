# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Sol Dashboard 🌞

A modern, responsive dashboard for **sol** - an intelligent solar maintenance platform that makes solar panel cleaning data-driven and cost-effective.

## 🎯 Project Overview

Sol addresses the critical problem of solar soiling in commercial rooftop installations. By combining predictive APIs (weather, AQI, dust forecasts) with real-time sensor data, sol provides facility managers with an optimal cleaning schedule that maximizes ROI and minimizes unnecessary maintenance.

## ✨ Features

### 📊 Dashboard Components

1. **Overview Cards**
   - Current energy production monitoring
   - Real-time soiling loss estimation
   - Economic threshold tracking

2. **Cleaning Intelligence**
   - AI-powered optimal cleaning date recommendations
   - Weather event forecasting (rain, dust storms, high AQI)
   - Cleaning schedule optimization

3. **Performance Analytics**
   - Interactive energy yield charts (predicted vs actual)
   - Historical cleaning records with ROI analysis
   - Performance trend visualization

4. **System Health Monitoring**
   - Real-time connectivity status
   - Panel temperature monitoring
   - Inverter efficiency tracking
   - Battery health indicators

### 🎨 Design Features

- **Catppuccin Mocha** color palette for a sleek, dark theme
- Responsive design optimized for desktop and mobile
- Smooth animations and hover effects
- Glass-morphism effects with backdrop blur
- Custom scrollbars and focus indicators

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 (latest)
- **UI Components**: Custom components inspired by shadcn/ui
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Build Tool**: Vite 7
- **Fonts**: Inter (primary), JetBrains Mono (monospace)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sol-dash/sol-dash
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── overview-cards.tsx  # Energy production overview
│   ├── cleaning-forecast.tsx # Cleaning recommendations
│   ├── reports-section.tsx # Performance analytics
│   ├── system-status.tsx   # System health monitoring
│   └── dashboard.tsx       # Main dashboard layout
├── lib/
│   ├── utils.ts           # Utility functions
│   └── mock-data.ts       # Sample data and helpers
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Color Palette (Catppuccin Mocha)

- **Base**: `#1e1e2e` - Primary background
- **Mantle**: `#181825` - Secondary background
- **Surface**: `#313244` - Card backgrounds
- **Text**: `#cdd6f4` - Primary text
- **Accent**: `#cba6f7` - Primary accent (mauve)
- **Success**: `#a6e3a1` - Success states
- **Warning**: `#f9e2af` - Warning states
- **Error**: `#f38ba8` - Error states

## 📊 Mock Data

The dashboard uses realistic mock data including:
- 30 days of energy production data
- Historical cleaning records with ROI calculations
- Weather event forecasts
- System health metrics
- Real-time status indicators

## 🌟 Key Features Implemented

### Business Logic
- **Economic Soiling Threshold**: Calculates when cleaning becomes profitable
- **ROI Analysis**: Tracks return on investment for each cleaning
- **Weather Integration**: Shows upcoming events that affect maintenance decisions
- **Performance Tracking**: Compares predicted vs actual energy yield

### UX/UI Excellence
- **Progressive Enhancement**: Smooth animations with staggered reveals
- **Accessibility**: Proper focus management and color contrast
- **Responsive Design**: Optimized for all screen sizes
- **Real-time Updates**: Live status indicators and data refresh
- **Interactive Charts**: Hover effects and detailed tooltips

## 🚧 Future Enhancements

- **Backend Integration**: Connect to real APIs and databases
- **User Authentication**: Multi-tenant support with role-based access
- **Mobile App**: React Native companion app
- **Advanced Analytics**: Machine learning predictions
- **Notification System**: Real-time alerts and email notifications
- **Multi-language Support**: Internationalization (i18n)

## 📄 License

This project is built as a prototype/MVP demonstration. 

## 🙏 Acknowledgments

- **Catppuccin** for the beautiful color palette
- **shadcn/ui** for component design inspiration
- **Tailwind CSS** for the utility-first approach
- **Recharts** for excellent chart components

---

**Built with ❤️ for a sustainable future** 🌱

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
