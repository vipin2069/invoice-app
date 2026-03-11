# Invoice SaaS React Native App

A complete Expo React Native invoicing app with:
- 7 editable fields: `Qty`, `Price`, `Discount%`, `Discount`, `Tax%`, `Tax`, `Total Price`
- Bi-directional dependency logic (editing any field updates dependent fields)
- Invoice card grid
- Edit flow for every created invoice card
- Exactly **3 React `useState` hooks** in the app logic

## Project Structure

```text
.
|- App.js
|- index.js
|- app.json
|- babel.config.js
|- package.json
|- src
|  |- components
|  |  |- InvoiceCard.js
|  |  |- InvoiceField.js
|  |- constants
|  |  |- theme.js
|  |- screens
|  |  |- InvoiceScreen.js
|  |- utils
|     |- invoiceMath.js
```

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ (or yarn/pnpm)
- Android Studio emulator / iOS simulator / Expo Go app (for mobile testing)

## Install and Run

1. Install dependencies:

```bash
npm install
```

2. Start Expo dev server:

```bash
npm run start
```

3. Open the app:
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Press `w` for web
- Or scan QR in Expo Go on your phone

## Quick Manual Test Checklist

1. Change `Qty` -> verify `Discount`, `Tax`, `Total Price` change.
2. Change `Discount%` -> verify `Discount` and `Total Price` change.
3. Change `Discount` -> verify `Discount%`, `Tax`, and `Total Price` change.
4. Change `Tax%` -> verify `Tax` and `Total Price` change.
5. Change `Tax` -> verify `Tax%` and `Total Price` change.
6. Change `Total Price` -> verify `Tax` and `Tax%` update.
7. Submit form -> card appears in grid.
8. Click `Edit` on card -> values load in form, update and submit -> same card updates.

