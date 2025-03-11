# Authgear sample for Ionic

This repo demonstrates how to add authentication into an Ionic apps using Authgear.

## Project setup

1. Clone repo
2. Install dependencies command:
```
npm install
```

### Configuration

The project needs to be configured with your Authgear app's Endpoint and client ID in order for the authentication flow to work.

To do this, rename `.env.example` in the root directory of the project to `.env`, then open the file and add your Authgear client application's Client ID and Endpoint as the value for `VITE_AUTHGEAR_CLIENT_ID` and `VITE_AUTHGEAR_ENDPOINT` respectively.

Add the following URIs to your Authgear client application's Authorized Redirect URI:

- `com.authgear.example.capacitor://host/path`
- `capacitor://localhost`
- `http://localhost:8100/oauth-redirect`
- `https://localhost`

To test the app on the web, run the following command:
```
ionic serve
```
To build and run your application on mobile, use the following commands:
Build your code:

```
npm run build
```
Sync changes to mobile platforms
```
npx cap sync
```
Open project on Android:
```
npx cap open android
```
Or open project on iOS:
```
npx cap open ios
```
Run your project from Android Studio or Xcode.

## What is Authgear?

[Authgear](https://www.authgear.com/) is a highly adaptable identity-as-a-service (IDaaS) platform for web and mobile applications.
Authgear makes user authentication easier and faster to implement by integrating it into various types of applications - from single-page web apps to mobile applications to API services.

### Key Features

- Zero trust authentication architecture with [OpenID Connect](https://openid.net/developers/how-connect-works/) (OIDC) standard.
- Easy-to-use interfaces for user registration and login, including email, phone, username as login ID, and password, OTP, magic links, etc for authentication.
- Support a wide range of identity providers, such as [Google](https://developers.google.com/identity), [Apple](https://support.apple.com/en-gb/guide/deployment/depa64848f3a/web), and [Azure Active Directory](https://azure.microsoft.com/en-gb/products/active-directory/) (AD).
- Support biometric login on mobile, Passkeys, and Multi-Factor Authentication (MFA) such as SMS/email-based verification and authenticator apps with TOTP.

## Documentation

View other Authgear Documentation at [https://docs.authgear.com/](https://docs.authgear.com/)
