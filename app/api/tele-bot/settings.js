import { getServerSideConfig } from "../../config/server";
const serverConfig = getServerSideConfig();

export const settings = {
  // Replace with your own subscription key, service region (e.g., "westus"),
  // and recognition language.
  subscriptionKey: serverConfig.speechKey,
  serviceRegion: serverConfig.speechRegion, // e.g., "westus"
  language: "en-US",

  // Replace with the full path to a wav file you want to recognize or overwrite.
  filename: "YourAudioFile.wav", // 16000 Hz, Mono

  // Replace with your own Language Understanding subscription key (endpoint
  // key), region, and app ID in case you want to run the intent sample.
  luSubscriptionKey: "YourLanguageUnderstandingSubscriptionKey",
  luServiceRegion: "YourLanguageUnderstandingServiceRegion",
  luAppId: "YourLanguageUnderstandingAppId",
};
