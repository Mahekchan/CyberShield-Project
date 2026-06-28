import React, { useEffect } from "react";
import { io } from "socket.io-client";

export default function FlaggedNotification() {
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    const socket = io(API_URL);
 // Adjust if backend runs elsewhere

    socket.on("flagged_message", (data) => {
      // You can replace this with a toast/modal/alert
      alert(`Flagged: ${data.comment}\nReason: ${data.reasons.join(", ")}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Listening for flagged comments...</div>;
}
