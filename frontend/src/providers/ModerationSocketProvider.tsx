import React, { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

interface ModerationSocketContextValue {
  socket: Socket | null;
}

const ModerationSocketContext = createContext<ModerationSocketContextValue>({
  socket: null,
});

export const useModerationSocketContext = () =>
  useContext(ModerationSocketContext);

interface Props {
  token?: string | null;
  children: React.ReactNode;
}

export const ModerationSocketProvider: React.FC<Props> = ({
  token,
  children,
}) => {
  const backendUrl =
    API_URL;

  const socket = useMemo(() => {
    if (!token) return null;
    const s = io(`${backendUrl}/moderators`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
    });

    s.on("connect", () => {
      console.log("connected to moderator namespace");
    });

    s.on("joinedAlerts", (info) => console.log("joinedAlerts:", info));
    s.on("moderatorAlert", (alert) => console.log("Realtime alert:", alert));
    s.on("connect_error", (err) => console.error("socket connect_error:", err));
    s.on("error", (err) => console.error("socket error:", err));

    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, backendUrl]);

  React.useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <ModerationSocketContext.Provider value={{ socket }}>
      {children}
    </ModerationSocketContext.Provider>
  );
};

export default ModerationSocketProvider;
