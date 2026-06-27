import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("import.meta.env.VITE_API_URL");

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Fetch initial count
    axios
      .get("import.meta.env.VITE_API_URL/api/dashboard/active-users")
      .then((res) => setActiveUsers(res.data.activeUsers))
      .catch(() => setActiveUsers(0));

    // Listen for real-time updates
    socket.on("activeUsersUpdate", (data) => {
      setActiveUsers(data.activeUsers);
    });

    return () => {
      socket.off("activeUsersUpdate");
    };
  }, []);

  return (
    <h3
      style={{
        color: "#2152ff",
        fontWeight: 800,
        background: "#f6faff",
        borderRadius: 8,
        padding: "10px 24px",
        display: "inline-block",
        boxShadow: "0 2px 8px #2152ff14",
      }}
    >
      Active Users: {activeUsers}
    </h3>
  );
};

export default ActiveUsers;
