# Phishaware

A React Native mobile application that trains users to identify phishing emails through interactive simulations, tracks performance over time, and provides curated educational resources on phishing awareness.

Built as a Masters dissertation project.

---

## Overview

Phishaware presents users with timed phishing simulation tests containing a randomised mix of legitimate and phishing emails. Users must flag suspicious emails or open legitimate ones. Results are scored, persisted via a REST backend, and visualised as pie charts on the home dashboard.

---

## Features

- **Phishing Simulation** — 5-minute timed tests with 10 randomly selected emails (phishing and legitimate). Users read, flag, or ignore emails; each action is scored.
- **Score Tracking** — Post-test breakdown of phishing links opened, correctly flagged emails, false positives, and correct replies, visualised as a pie chart.
- **Learning Resources** — Curated external resources (articles, videos, quizzes) for building phishing awareness.
- **Authentication** — Full auth flow via AWS Cognito: sign up, sign in, forgot password, and confirm reset.
- **Secure Token Storage** — JWT access tokens stored using `expo-secure-store`; attached as Bearer tokens on all API requests.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 51) |
| Routing | Expo Router (file-based) |
| Auth | AWS Cognito (`amazon-cognito-identity-js`) |
| API | AWS API Gateway (eu-west-2) + Axios |
| Secure Storage | `expo-secure-store` |
| Charts | `react-native-chart-kit` + `react-native-svg` |
| Language | TypeScript |

---

## Project Structure

```
phishaware/
├── app/
│   ├── _layout.tsx                  # Root layout with SessionProvider
│   ├── welcome.tsx                  # Landing screen
│   ├── sign-in.tsx                  # Sign in screen
│   ├── sign-up.tsx                  # Sign up screen
│   ├── forgot-password.tsx          # Password reset request
│   ├── confirm-reset-password.tsx   # Password reset confirmation
│   └── (app)/
│       ├── _layout.tsx              # Auth guard — redirects unauthenticated users
│       ├── mock.tsx                 # Phishing simulation test screen
│       ├── report.tsx               # Individual test report screen
│       ├── about.tsx                # About screen
│       └── (tabs)/
│           ├── _layout.tsx          # Tab bar layout (Learning / Home / Account)
│           ├── index.tsx            # Home — score history dashboard
│           ├── learning.tsx         # Learning resources
│           └── account.tsx          # Account management + sign out
├── components/
│   ├── CustomModal.tsx              # Generic modal wrapper
│   ├── LoadingSpinner.tsx           # Loading indicator
│   ├── ScreenLayout.tsx             # Shared screen container
│   ├── StatsPieChart.tsx            # Pie chart for test results
│   └── mockModals/
│       ├── tutorialModal.tsx        # Pre-test tutorial
│       ├── emailModal.tsx           # Email viewer with flag/open actions
│       ├── warningModal.tsx         # Warning shown when a phishing link is opened
│       ├── successModal.tsx         # Success shown when phishing is correctly flagged
│       └── scoresModal.tsx          # End-of-test score summary
├── services/
│   ├── api.tsx                      # Axios wrapper with auth token injection
│   ├── cognito.tsx                  # Cognito sign-up, forgot/confirm password
│   ├── ctx.tsx                      # React context for session state
│   └── secretStorage.ts             # Secure token read/write via expo-secure-store
└── assets/
    ├── styles.tsx                   # Shared stylesheet
    └── images/                      # App icons, splash screen
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- An Expo account (for EAS builds)
- Android Studio or Xcode (for native builds), or Expo Go for development

### Installation

```bash
git clone https://github.com/thebenjamist/phishaware.git
cd phishaware
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_USER_POOL_ID=<your-cognito-user-pool-id>
EXPO_PUBLIC_USER_POOL_CLIENT_ID=<your-cognito-app-client-id>
```

### Running the App

```bash
# Start the Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## Scoring Model

Each test session scores the following email interactions:

| Metric | Description |
|---|---|
| `phishingLinksOpened` | Phishing emails that were opened (negative indicator) |
| `linksCorrectlyFlagged` | Phishing emails correctly flagged by the user |
| `linksFalselyFlagged` | Legitimate emails incorrectly flagged |
| `correctlyReplied` | Legitimate emails opened (treated as replied) |
| `typeAClicked` / `typeBClicked` / `typeCClicked` | Phishing emails opened, broken down by attack category |

Scores are submitted to the backend at the end of each test and displayed on the home dashboard as a historical pie chart series.

---

## Backend API

The app communicates with a REST API hosted on AWS API Gateway (`eu-west-2`). All requests require a Cognito-issued JWT Bearer token.

| Endpoint | Method | Description |
|---|---|---|
| `/emails` | GET | Fetch the pool of simulation emails |
| `/scores` | GET | Retrieve the user's score history |
| `/submit-score` | POST | Submit a completed test score |
| `/update-first-time-open` | GET | Mark the user's first-time learning tab visit |

---

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
# Android APK/AAB
eas build --platform android

# iOS IPA
eas build --platform ios
```

EAS project ID: `0daadb09-3a00-4e59-bbc8-139db3250fe0`

---

## License

This project was developed as part of a Masters dissertation. All rights reserved.
