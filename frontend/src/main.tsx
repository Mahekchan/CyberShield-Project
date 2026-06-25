import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ModerationSocketProvider from "./providers/ModerationSocketProvider";

const firebaseConfig = {
  apiKey: "AIzaSyCAGadHbEXwa4skyF7YVnNeawpSUwC57v4",
  authDomain: "cybershield-2cf95.firebaseapp.com",
  projectId: "cybershield-2cf95",
  storageBucket: "cybershield-2cf95.firebasestorage.app",
  messagingSenderId: "512201226069",
  appId: "1:512201226069:web:feea10e1a5f329d1fa61dc",
};

const app = initializeApp(firebaseConfig);

const Root: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const idToken = await user.getIdToken();
          setToken(idToken);
        } else {
          setToken(null);
        }
      } catch (err) {
        console.error("Error fetching id token:", err);
        setToken(null);
      }
    });
    return unsub;
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        {/* Wrap app with ModerationSocketProvider. Pass moderator JWT when available. */}
        <ModerationSocketProvider token={token}>
          <App />
        </ModerationSocketProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);

export default app;
