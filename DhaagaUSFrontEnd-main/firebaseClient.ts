// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbsQq0407MqHye8M5LdXzsSXQS_rRcMHY",
  authDomain: "dhaaga-auth.firebaseapp.com",
  projectId: "dhaaga-auth",
  storageBucket: "dhaaga-auth.appspot.com",
  messagingSenderId: "216551666864",
  appId: "1:216551666864:web:48c9da1a3d2d71215bb775",
  measurementId: "G-4X3185J115",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export function to initialize firebase.
export default () => {
  let app;
  if (typeof window !== "undefined" && !getApps().length) {
    return (app = initializeApp(firebaseConfig));
  }
};
