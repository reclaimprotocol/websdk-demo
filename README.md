# Reclaim Protocol - Web SDK Next.js Example

This is an example Next.js application demonstrating how to use the Reclaim Protocol WebSDK 

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Reclaim Protocol App ID and App Secret  

You can obtain these details from the [Reclaim Developer Portal](https://dev.reclaimprotocol.org).

### Installation

1. Clone or navigate to this directory:

```bash
cd example
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Copy `.env.example` to `.env.local` and fill in your Reclaim credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_RECLAIM_APP_ID=your_app_id_here
NEXT_PUBLIC_RECLAIM_APP_SECRET=your_app_secret_here
NEXT_PUBLIC_WEBSDK_URL=websdk_url
```

### Adding Providers

To add providers to your application, edit the `src/config/providers.ts` file:

you can find the providerId in the [dev.reclaimprotocol.org](https://dev.reclaimprotocol.org) dashboard under your app page.

```typescript
export const providers: Provider[] = [
  {
    providerId: "your-provider-id-here",
    providerName: "Your Provider Name"
  },
];
```


### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```