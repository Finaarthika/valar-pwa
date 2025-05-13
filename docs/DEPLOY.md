# Valar PWA Deployment Guide

This document outlines the steps for deploying the Valar PWA and building the Trusted Web Activity (TWA) APK.

## 1. Firebase Hosting Deployment

1.  Build the PWA for production:

    ```bash
    npm run build
    ```

    This will generate the production-ready files in the `dist` directory.

2.  Install the Firebase CLI if you haven't already:

    ```bash
    npm install -g firebase-tools
    ```

3.  Log in to Firebase:

    ```bash
    firebase login
    ```

4.  Initialize your project for Firebase Hosting in the `valar-pwa` directory:

    ```bash
    firebase init hosting
    ```

    Follow the prompts, selecting your Firebase project and specifying `dist` as the public directory.

5.  Deploy your site:

    ```bash
    firebase deploy --only hosting
    ```

## 2. Bubblewrap Build and Play Console Upload

1.  Ensure you have Java Development Kit (JDK) installed.

2.  Install Bubblewrap if you haven't already:

    ```bash
    npm install -g @bubblewrap/cli
    ```

3.  Navigate to the `valar-pwa` directory and initialize Bubblewrap. This will create a `twa-workspace` directory and a `bubblewrap-config.json` file (which we have already created and configured partially).

    ```bash
    npx @bubblewrap/cli init
    ```

    Follow the prompts, ensuring you point to your deployed PWA URL and the correct icon paths.

4.  Build the TWA APK:

    ```bash
    npx @bubblewrap/cli build
    ```

    This will generate `valar-release.apk` in the `twa-workspace` directory.

5.  **Signing Your APK:** Before uploading to the Play Console, you need to sign your APK with a release key. If you don't have one, you can generate one using Java's `keytool`. Store your keystore file and its password securely.

    ```bash
    keytool -genkey -v -keystore your_release_key.jks -alias your_alias_name -keyalg RSA -keysize 2048 -validity 10000
    ```

    Then, sign your APK:

    ```bash
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore your_release_key.jks valar-release.apk your_alias_name
    ```

6.  **Zipalign (Optional but Recommended):** Zipalign is an archive alignment tool that provides important optimization to application (.apk) files. Run this after signing.

    ```bash
    zipalign -v 4 valar-release.apk valar-release-aligned.apk
    ```

7.  Upload the signed and aligned APK (`valar-release-aligned.apk`) to the Google Play Console.

## 3. Data Safety Section Disclosure

In the Google Play Console Data Safety section, you will need to disclose the following data collection and usage:

*   **Collected Data:** Name, Phone Number, Email Address, Foreground Location.
*   **Purpose:** This data is collected to create and manage user profiles, enable location-based features (setting shop location, recording loan event location), and facilitate communication.
*   **Encryption:** Data is encrypted in transit.
*   **Data Retention:** Data is retained as long as the user account is active or as required by law.
*   **User Data Deletion:** Users can request data deletion by contacting [Your Support Email/Method].
