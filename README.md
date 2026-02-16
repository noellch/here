# Here

A real-time social radar app that combines map-based location with instant intent matching. Users toggle a "green light" to broadcast availability, select an intent tag, and discover nearby people on a live map.

## Core Concept

- **Real-time intent signal** — Users actively toggle a green light to broadcast availability
- **Map-based discovery** — See who is nearby on a live map with fuzzy location (150–250m radius)
- **Scene-based tags** — Every active user selects an intent tag (coffee, exercise, co-work, language exchange, gaming, drinks)

## How It Works

1. Open the app and see a map of your area
2. Choose an intent tag (e.g. ☕ Coffee Chat)
3. Turn on your green light — you appear on nearby users' maps
4. Wave at someone interesting
5. If they accept, a 24-hour chat room opens
6. Meet up!

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Expo (React Native) + TypeScript |
| Routing | expo-router (file-based) |
| Map | Mapbox GL (@rnmapbox/maps) |
| Backend | Firebase (Firestore + Cloud Functions) |
| Auth | Firebase Auth (Phone OTP) |
| State | nanostores |
| Geo | ngeohash |

## Project Structure

```
here/
├── src/
│   ├── app/              # expo-router screens and layouts
│   ├── components/       # shared UI components
│   ├── hooks/            # custom React hooks
│   ├── services/         # Firebase client SDK interactions
│   ├── stores/           # nanostores state management
│   ├── types/            # TypeScript type definitions
│   ├── constants/        # intent tags, colors
│   └── utils/            # location fuzzing, geohash
├── functions/            # Firebase Cloud Functions
│   └── src/
│       ├── triggers/     # Firestore event triggers
│       ├── scheduled/    # cron jobs (cleanup expired data)
│       └── utils/        # shared server utilities
├── firestore.rules       # Firestore security rules
├── firestore.indexes.json
├── firebase.json
└── app.json              # Expo config
```

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm install -g eas-cli`)
- Firebase project with Phone Authentication enabled
- Mapbox account and access token

### Setup

```bash
# Install dependencies
npm install

# Install Cloud Functions dependencies
cd functions && npm install && cd ..

# Create environment file
cp .env.example .env
# Add your EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN

# Add Firebase config
# Place GoogleService-Info.plist in project root

# Start development
npx expo start --dev-client
```

### Building

```bash
# Development build (iOS simulator)
eas build --platform ios --profile development

# Preview build (TestFlight)
eas build --platform ios --profile preview
```

### Deploying Firebase

```bash
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only functions
```

## Intent Tags

| Emoji | Tag | Description |
|-------|-----|-------------|
| ☕ | Coffee Chat | Meet for coffee |
| 🏃 | Exercise | Work out together |
| 💻 | Co-work | Work side by side |
| 🗣️ | Language Exchange | Practice languages |
| 🎮 | Gaming | Play games together |
| 🍻 | Drinks | Grab a drink |

## Safety & Privacy

- **Location fuzzing** — Exact location is never shown. Map pins are offset 150–250m randomly.
- **24-hour chat rooms** — Conversations auto-expire, reducing persistent contact pressure.
- **Rate limiting** — 3 waves per day prevents spam.
- **Block & report** — One-tap blocking with immediate effect. 3 reports triggers auto-suspension.
- **No dating** — Intent tags deliberately exclude romance to create a safer environment.

## License

Private — All rights reserved.
