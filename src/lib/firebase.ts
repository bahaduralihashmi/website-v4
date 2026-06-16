import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

/*
===================================================================
  FIREBASE CONFIGURATION GUIDE (bahaduralimunnabhai@gmail.com)
===================================================================
  To connect this application to your custom Firebase project:
  
  1. Go to Firebase Console (https://console.firebase.google.com/)
  2. Create or select your project.
  3. Under Project Settings -> General, add a Web App.
  4. Copy the config object and paste it below, replacing this configuration:

  const manualConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
===================================================================
*/

// Use provisioned dynamic config from setup by default
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth, and Storage services
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connectivity check as requested by system verification guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase Connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.error("Firebase is offline. Please check your network or configuration.");
    } else {
      console.log("Firebase server connectivity confirmed.", error);
    }
  }
}

// Fallback error handler following guidelines
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
    },
    operationType,
    path,
  };
  console.error("Firestore Error Detailed: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

