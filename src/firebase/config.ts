// Zain Academy - Firebase Configuration
// Paste your official Firebase Web SDK configuration keys below.
// You can obtain these from the Firebase Console: Settings > Project settings > General > Your apps.

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/**
 * Checks if the Firebase config has been filled with real credentials.
 */
export function isFirebaseConfigured(): boolean {
  return (
    firebaseConfig.apiKey !== "" &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId !== "" &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
}
