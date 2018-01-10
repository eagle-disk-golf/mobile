import * as firebase from 'firebase';
import env from '../../env';

// Initialize Firebase
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  databaseURL: env.FIREBASE_DATABASE_URL,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
};

export const DB_NAMES = {
  sessions: 'sessions/',
  rounds: 'rounds/',
  lanes: 'lanes/'
};

export default firebaseApp = firebase.initializeApp(firebaseConfig);
