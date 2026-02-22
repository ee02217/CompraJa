# CompraJa

A mobile shopping list app built with Expo.

## 🛠️ Setup

1. **Install dependencies**
   ```bash
   cd CompraJa
   npm install
   ```

2. **Install Expo CLI (if needed)**
   ```bash
   npm install -g expo
   ```

## ▶️ Run

### iOS Simulator
```bash
npx expo start --ios
```
Or press `i` in the Expo CLI menu.

### Android Emulator
```bash
npx expo start --android
```
Or press `a` in the Expo CLI menu.

### Physical Device
1. Install Expo Go on your device
2. Start the dev server: `npx expo start`
3. Scan the QR code with Expo Go

## 📱 Build (EAS)

### First Time Setup
```bash
# Login to Expo/EAS
npx expo login
eas login

# Configure EAS (creates eas.json if needed)
eas build:configure
```

### Development Build (iOS Simulator)
```bash
# Generate native iOS project
npx expo prebuild --platform ios

# Run on iOS Simulator
npx expo run:ios
```

### Or use EAS Build
```bash
eas build -p ios --profile development
```

### Build & Run on Simulator (Manual)
```bash
# After EAS build completes, download the .ipa
# Then install and launch on simulator:
xcrun simctl install booted /path/to/build.ipa
xcrun simctl launch booted com.compraja.app
```

## 📁 Architecture

```
CompraJa/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   └── index.tsx      # Home screen
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API/storage services
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── assets/               # Images, fonts, etc.
├── app.json             # Expo config
├── eas.json             # EAS build config
└── package.json
```

## 📦 Dependencies

- **expo** ~52.0.0 - Core framework
- **expo-router** ~4.0.0 - File-based routing
- **react-native** 0.76.5 - React Native

### Dev Dependencies
- **typescript** ~5.3.3 - Type safety
- **eslint** + **eslint-config-expo** - Linting
- **prettier** - Code formatting
- **@babel/core** - Transpilation

## ⚙️ Notes

- Uses Expo Managed Workflow (no native code modifications)
- New Architecture disabled for stability
- No Reanimated, VisionCamera, or worklets (per requirements)
- Minimum iOS: 13.4
