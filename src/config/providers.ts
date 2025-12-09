export interface Provider {
  providerId: string;
  providerName: string;
}

// Add your providers here
export const providers: Provider[] = [
   {
    providerId: "d504a779-f6af-42b5-acc0-6c776b4ad348",
    providerName: "IGNOU"
  },
  {
    providerId: "af966ea4-7b93-4eda-be5b-db3a4b1f4d7c",
    providerName: "Sacred Heart College"
  },
  {
    providerId: "ea7a00b8-7650-4243-8347-8a94d905bcd0",
    providerName: "Rizvi College"
  }
  // Add more providers as needed
  // {
  //   providerId: "your-provider-id-here",
  //   providerName: "Your Provider Name"
  // },
];
