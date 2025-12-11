export interface Provider {
  providerId: string;
  providerName: string;
}

// Add your providers here
export const providers: Provider[] = [
  {
    providerId: "e6a203d8-33d6-47dc-a2aa-6a49e3a954ba",
    providerName: "Kaggle"
  },
  {
    providerId: "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
    providerName: "Github"
  },
  {
    providerId: "636848af-0f31-4d1c-998f-4cc8c44c09b9",
    providerName: "Uber"
  },
  {
    providerId: "1f6da24f-6ca2-4cfa-9bf7-392c62cb1687",
    providerName: "Instagram"
  },
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
