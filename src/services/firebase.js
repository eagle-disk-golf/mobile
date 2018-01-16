import * as firebase from 'firebase';
import Config from 'react-native-config';

// Initialize Firebase
const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  databaseURL: Config.FIREBASE_DATABASE_URL,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
};

export const DB_NAMES = {
  lanes: 'lanes/',
  courses: 'courses/'
};

export default firebaseApp = firebase.initializeApp(firebaseConfig);

