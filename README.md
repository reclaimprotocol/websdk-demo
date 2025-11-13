# Reclaim Protocol - Web SDK Next.js Example

This is an example Next.js application demonstrating how to use the Reclaim Protocol WebSDK 

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Reclaim Protocol App ID and App Secret

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
```

### Adding Providers

To add providers to your application, edit the `src/config/providers.ts` file:

you can find the providerId in the dev.reclaimprotocol.org dashboard under your app's settings.

```typescript
export const providers: Provider[] = [
  {
    providerId: "ff4d7afe-4b78-4795-9429-d20df2deaad7",
    providerName: "Example Provider 1"
  },
  {
    providerId: "your-provider-id-here",
    providerName: "Your Provider Name"
  },
  // Add more providers as needed
];
```


### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the application.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Customization

### Custom Share Page URL

To use a custom share page URL, modify the initialization in `src/app/page.tsx`:

```typescript
const proofRequest = await ReclaimProofRequest.init(
  process.env.NEXT_PUBLIC_RECLAIM_APP_ID!,
  process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET!,
  provider.providerId,
  {
    useAppClip: false,
    customSharePageUrl: process.env.NEXT_PUBLIC_WEBSDK_URL
  }
)
```