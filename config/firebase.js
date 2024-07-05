import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: //Your Firebase apiKey,
    authDomain: //Your Firebase authDomain,
    projectId: //Your Firebase projectId,
    storageBucket: //Your Firebase storageBucked,
    messagingSenderId: //Your Firebase messagingSenderId,
    appId: //Your Firebase appId
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

export { database, auth };