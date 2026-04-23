# SteadyPace 

**IS4447 Mobile Application Development Project**
**Option A: Habit Tracker** (Specialised Running Tracker)
**Student:** Ruth Kangataran (122392463)

---

## GitHub Repository

https://github.com/ruthkangataran/122392463

## Expo Link

```
exp://u.expo.dev/f84f7cf7-29a2-4862-acc0-fba428b790f7?channel-name=preview
```

![QR Code](https://qr.expo.dev/eas-update?updateId=740d0c7f-46f8-410d-9c63-bbd945ae1e10&appScheme=steadypace&host=u.expo.dev)

---

## About

SteadyPace is a mobile running tracker built with React Native (Expo) and Drizzle ORM with SQLite. Users can log runs, set training targets, and analyse their progress through charts and summaries.

### Features

- Log, view, edit, and delete runs with distance, duration, category, and notes
- Create and manage custom run categories with colours
- Set weekly and monthly targets with progress tracking
- Insights screen with bar charts and category breakdown
- Search and filter runs by text, category, and date range
- User registration, login, logout, and account deletion
- Light/dark mode toggle with persistence
- Pre-run stretch suggestions via API Ninjas
- Streak tracking for consecutive run days
- CSV export of run data
- Seed data with 3 users and 80+ runs

---

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Expo Go app on your phone

### Installation

```bash
git clone https://github.com/ruthkangataran/122392463.git
cd 122392463
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_API_KEY=your_api_ninjas_key_here
```

Get a free API key from https://api-ninjas.com

### Running the App

```bash
npx expo start
```

Scan the QR code with Expo Go (iOS Camera or Android Expo Go app).

### Running Tests

```bash
npm test
```

---

## Tech Stack

- React Native (Expo SDK 54)
- TypeScript
- Drizzle ORM + SQLite
- Expo Router (file-based navigation)
- react-native-gifted-charts
- expo-file-system + expo-sharing (CSV export)
- API Ninjas (exercises endpoint)

---

## Demo Credentials

| User    | Email               | Password |
|---------|---------------------|----------|
| Ruth    | ruth@example.com    | test123  |
| Conor   | conor@example.com   | test123  |
| Saoirse | saoirse@example.com | test123  |