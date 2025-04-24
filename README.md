# Shared Spaces Mobile

A mobile application built with React Native and Expo.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14.0 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS development: macOS with Xcode installed
- For Android development: Android Studio with SDK tools

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/TheRaymondGroup/SharedSpaces-Mobile.git
   cd SharedSpaces-Mobile
   ```

2. Install dependencies:
   ```
   yarn install
   ```

## Running the App

### Start the Development Server

```
yarn expo start
```

### Running on a Physical Device

1. Install the Expo Go app on your device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code:
   - iOS: Use the device's camera app
   - Android: Use the QR scanner in the Expo Go app

3. The app will load on your device

## Building for Production

### Create a standalone build

```
npx expo build:android
npx expo build:ios
```

Or with the newer EAS Build system:

```
npx eas build --platform android
npx eas build --platform ios
```