# ChatterBox 

A chat app for your mobile device. 

Written on React Native and developed with Expo.

Put in your name, choose a background color, and start chatting with your friends!

<img src="/img/StartScreen.png" alt="Start Screen" width="300" margin="20"><img src="/img/ChatScreen.png" alt="Chat Screen" width="300" margin="20"><br />

## Features

**Start Screen** where you can choose a username and a custom background color.

**Chat Screen** where you can send chat messages to friends, photos (from your camera or your media gallery), or a map of your location.

Stores your messages in Google Firebase cloud storage.

When offline, you can still see your messages, thanks to async storage.

_Chatterbox will ask for your permission before accessing your device's hardware or your photos._

## Setup

The Expo framework allows you to use React Native applications easily across different platforms.

Sign up for an Expo account: https://expo.io/signup
Install Expo using the CLI ```$ npm install --global expo-cli```

To use the app on your mobile device, download Expo from your App Store

To use a mobile simulator, use 
[Android Studio]https://docs.expo.io/workflow/android-studio-emulator/ for Android
[iOS Simulator]https://docs.expo.io/workflow/ios-simulator/ for iPhone/iPad

### Install Dependencies

Navigate to the project directory and enter:

```npm install```

### Run the App

Navigate to the project directory and enter:

```npm start or expo start```

This will open an Expo window in your browser. Follow the instructions there to run the app on your chosen device.

