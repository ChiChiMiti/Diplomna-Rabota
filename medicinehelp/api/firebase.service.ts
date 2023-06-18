import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCK5OuAwkXVN0T4k053N-qcr9b63fEp1kQ",
  authDomain: "medicine-help.firebaseapp.com",
  projectId: "medicine-help",
  storageBucket: "medicine-help.appspot.com",
  messagingSenderId: "704086344164",
  appId: "1:704086344164:web:542b0cc15640d3975a47f1",
  measurementId: "G-K0P3MMB637"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);