'use client';

import {
  initializeApp,
  getApp,
  FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  Auth,
  connectAuthEmulator,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function getFirebaseApp(): FirebaseApp {
  try {
    return getApp();
  } catch {
    return (app = initializeApp(firebaseConfig));
  }
}

export function getFirebaseAuth(): Auth {
  const firebaseApp = getFirebaseApp();
  try {
    return getAuth(firebaseApp);
  } catch {
    return (auth = getAuth(firebaseApp));
  }
}

export function getFirebaseDb(): Firestore {
  const firebaseApp = getFirebaseApp();
  try {
    return getFirestore(firebaseApp);
  } catch {
    return (db = getFirestore(firebaseApp));
  }
}

export function initializeFirebase() {
  const app = getFirebaseApp();
  const authInstance = getFirebaseAuth();
  const dbInstance = getFirebaseDb();

  // Emulator setup (development only)
  if (
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_USE_EMULATOR === 'true'
  ) {
    try {
      connectAuthEmulator(authInstance, 'http://localhost:9099', {
        disableWarnings: true,
      });
    } catch (e) {
      // Emulator already connected
    }

    try {
      connectFirestoreEmulator(dbInstance, 'localhost', 8080);
    } catch (e) {
      // Emulator already connected
    }
  }

  return { app, auth: authInstance, db: dbInstance };
}
