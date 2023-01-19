import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const logout = async () => {
  localStorage.removeItem("user");
  await signOut(auth);
  console.log("User logged out.");
};

const login = async (email, password) => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    alert(error.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const fetchCurrentUser = () => {
  const userString = localStorage.getItem("user");
  const userCredential = JSON.parse(userString);
  if (userCredential) {
    return userCredential;
    // ...
  } else {
    // User is signed out
    // ...

    return null;
  }
};

const register = async (email, password, userName, walletAddress) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredentials) {
      updateProfile(userCredentials.user, {
        displayName: userName,
        photoURL: walletAddress,
      })
        .then(() => {
          localStorage.setItem("user", JSON.stringify(userCredentials));
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return userCredentials;
  } catch (error) {
    console.log(error.message);
    alert(error.message);
    return error;
  }
};

function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const setMobileMode = () => {
  localStorage.setItem("mobileMode", "true");
  getMobileMode();
};

const resetMobileMode = () => {
  localStorage.removeItem("mobileMode");
};

const getMobileMode = () => {
  const mobileModeString = localStorage.getItem("mobileMode");
  const mobileMode = JSON.parse(mobileModeString);
  if (mobileMode === true) {
    return true;
  } else return false;
};

export {
  auth,
  db,
  storage,
  login,
  register,
  sendPasswordReset,
  logout,
  fetchCurrentUser,
  truncateAddress,
  setMobileMode,
  getMobileMode,
  resetMobileMode,
};
