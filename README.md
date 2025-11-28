# AirdropHunter - Setup & Integration Guide

This document provides instructions on how to take the AirdropHunter application from its current "Mock Mode" to a production-ready application using Firebase and how to deploy it.

## 🚀 1. Firebase Integration Guide

Currently, the app uses `services/mockStore.ts` to simulate a backend. Follow these steps to connect real Authentication and Database.

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it `AirdropHunter`.
3. Disable Google Analytics (for simplicity) and create the project.

### Step 2: Enable Services
1. **Authentication**:
   - Go to **Build > Authentication > Get Started**.
   - Select **Email/Password** provider and enable it.
2. **Firestore Database**:
   - Go to **Build > Firestore Database > Create Database**.
   - Choose a location.
   - Start in **Test Mode** (allows read/write for 30 days, easier for development).

### Step 3: Get Configuration
1. Click the **Gear icon (Project Settings)** next to "Project Overview".
2. Scroll to "Your apps" and click the **</> (Web)** icon.
3. Register the app (name it "Airdrop⁸Hunter Web").
4. Copy the `firebaseConfig` object (apiKey, authDomain, etc.).

### Step 4: Install Firebase
If you are using a package manager (like npm or yarn):
```bash
npm install firebase
```

### Step 5: Create the Firebase Service
Create a new file `services/firebaseStore.ts`. Copy the code below and replace the config values with yours.

```typescript
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore';
import { User, Airdrop } from '../types';

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const FirebaseStore = {
  // --- Auth ---
  register: async (email: string, password: string, name: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user profile in Firestore
    const newUser: User = {
      id: firebaseUser.uid,
      email: email,
      name: name,
      role: 'user', // Default role
      points: 100, // Welcome bonus
      lastDailyClaim: null,
      streak: 0,
      bookmarkedAirdrops: []
    };

    await setDoc(doc(db, "users", firebaseUser.uid), newUser);
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error("User profile not found");
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  getCurrentUser: async (uid: string): Promise<User | null> => {
    if (!uid) return null;
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  },

  // --- Airdrops ---
  getAirdrops: async (): Promise<Airdrop[]> => {
    const q = query(collection(db, "airdrops"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Airdrop));
  },

  addAirdrop: async (airdrop: Omit<Airdrop, 'id' | 'createdAt'>): Promise<Airdrop> => {
    const newAirdropRef = doc(collection(db, "airdrops"));
    const newAirdrop = {
      ...airdrop,
      id: newAirdropRef.id,
      createdAt: Date.now()
    };
    await setDoc(newAirdropRef, newAirdrop);
    return newAirdrop;
  },

  // --- Rewards ---
  claimDaily: async (user: User): Promise<{ success: boolean, pointsAdded: number, message: string }> => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (user.lastDailyClaim && (now - user.lastDailyClaim) < oneDay) {
      return { success: false, pointsAdded: 0, message: 'Already claimed today.' };
    }

    let newStreak = 1;
    if (user.lastDailyClaim && (now - user.lastDailyClaim) < (oneDay * 2)) {
      newStreak = user.streak + 1;
    }

    const pointsAdded = 50 + Math.min(newStreak * 10, 100);
    const updatedUser = {
      ...user,
      points: user.points + pointsAdded,
      lastDailyClaim: now,
      streak: newStreak
    };

    await updateDoc(doc(db, "users", user.id), {
      points: updatedUser.points,
      lastDailyClaim: updatedUser.lastDailyClaim,
      streak: updatedUser.streak
    });

    return { success: true, pointsAdded, message: `Claimed ${pointsAdded} points!` };
  }
};
```

### Step 6: Connect to App
In your files (`App.tsx`, `pages/Home.tsx`, etc.), replace imports from `MockStore` with `FirebaseStore`. Note that Firebase calls are `async`, so you may need to add `await` or `useEffect` hooks where data is fetched synchronously in the mock version.

---

## 🛡️ 2. Setting Up Admin Access

By default, new users are just 'users'. To make someone an admin:

1. Sign up a new user in your app (e.g., `admin@example.com`).
2. Go to **Firebase Console > Firestore Database**.
3. Find the `users` collection.
4. Find the document ID matching that user.
5. Change the `role` field from `"user"` to `"admin"`.
6. Refresh your app.

---

## ☁️ 3. Deployment Guide

The easiest way to deploy this React app is using **Vercel** or **Netlify**.

### Option A: Deploy to Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and sign up.
3. Click **"Add New Project"** and select your GitHub repo.
4. Vercel will detect it's a React app (likely using Vite or Create React App).
5. **Environment Variables**:
   - Add your Gemini API Key as `REACT_APP_API_KEY` (or `VITE_API_KEY` depending on bundler).
   - Add your Firebase configs if you used environment variables in step 5.
6. Click **Deploy**.

### Option B: Deploy to Netlify
1. Drag and drop your `build` or `dist` folder to Netlify Drop, OR connect your GitHub repo.
2. For Build Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist` (if using Vite) or `build` (if CRA).
3. Set environment variables in **Site Settings > Build & Deploy > Environment**.

---

## 🤖 4. Gemini AI Setup

To keep the AI features working in production:
1. Get an API Key from [Google AI Studio](https://aistudio.google.com/).
2. In your deployment platform (Vercel/Netlify), add an Environment Variable named `API_KEY` with your key value.
3. Ensure your `services/geminiService.ts` accesses this key via `process.env.API_KEY` (or `import.meta.env.VITE_API_KEY` for Vite).
