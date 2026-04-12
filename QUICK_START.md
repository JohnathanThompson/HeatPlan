# Quick Start Guide - React Native WBGT Tracker

## Prerequisites

Before running this app, ensure you have the following installed:

### Required Software

- **Node.js** (v18 or later) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Expo CLI** - Install globally: `npm install -g expo-cli`

### For Android Development

- **Android Studio** (with Android SDK) - [Download from developer.android.com](https://developer.android.com/studio)
- **Java Development Kit (JDK)** (v11 or later)

### For iOS Development (macOS only)

- **Xcode** (latest version)
- **iOS Simulator** (comes with Xcode)

## 📱 Running the App

### 1. Clone or Download the Project

```bash
# Navigate to your desired directory
cd /path/to/your/projects

# If cloning from git (replace with actual repo URL)
git clone <repository-url>
cd wbgt-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
# Start Expo dev server
npm start

# Or use the shorthand
npm run start
```

### 4. Run on Your Device

#### Option A: Android Emulator

1. Open Android Studio
2. Go to **Device Manager** → **Create Device**
3. Start an emulator (e.g., Pixel 5 API 33)
4. In the terminal where `npm start` is running, press `a` to open on Android

#### Option B: Physical Android Device

1. Enable **USB Debugging** in Developer Options
2. Connect your phone via USB
3. In the terminal, press `a` to open on connected device

#### Option C: iOS Simulator (macOS only)

1. In the terminal where `npm start` is running, press `i` to open on iOS Simulator

#### Option D: Expo Go App

1. Download **Expo Go** from:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)
2. With `npm start` running, scan the QR code with Expo Go
3. App loads instantly

## Available Commands

```bash
# Start development server
npm start

# Run on Android emulator/device
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run web version (experimental)
npm run web

# Build standalone APK for Android
npm run build:android

# Prebuild native code (for custom native modules)
npm run prebuild
```

## App Features

- **Home Tab**: Real-time WBGT monitoring, temperature/humidity display, weather forecast
- **Schedule Tab**: Create work schedules with heat-safe work-rest cycles
- **Location Selection**: Choose from multiple cities to see location-specific heat conditions
- **WBGT Information**: Tap the info button (?) to learn about heat safety guidelines

## Project Structure

```
src/app/
├── App.tsx                 # Main app with React Navigation setup
├── routes.ts               # Web routing (for future web version)
├── pages/
│   ├── Home.tsx           # Home screen with WBGT dashboard
│   ├── Schedule.tsx       # Schedule management screen
│   └── NotFound.tsx       # 404 page for web routing
├── components/
│   ├── Header.tsx         # App header with title
│   ├── WBGTInfo.tsx       # WBGT information modal
│   ├── ForecastChart.tsx  # Weather forecast chart
│   └── ui/                # Reusable UI components (shadcn/ui)
├── context/
│   └── LocationContext.tsx # Global location state management
└── utils/
    ├── wbgt.ts            # WBGT calculations and weather simulation
    └── currentTime.ts     # Time-based schedule utilities
```

### "Device not found" Error

- Ensure Android emulator is running
- Or check USB connection for physical device
- Run `adb devices` to verify device connection

### Expo Go won't connect

- Ensure your computer and device are on the same Wi-Fi network
- Try using a different network or disable firewall temporarily
- Restart both the dev server and Expo Go app

Run `npm run android` and enjoy your native app


# Screen Shots of App

## Home Page

![Home Page](image.png)

![Home Page 2](image-1.png)

## Schedule View

![Weekly Schedule](image-2.png)

![Daily Schedule](image-3.png)

![Schedule View](image-5.png)