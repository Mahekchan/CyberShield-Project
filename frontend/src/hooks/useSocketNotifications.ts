import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export interface FlaggedMessage {
  comment: string;
  cleaned: string;
  labels: string[];
  reasons: string[];
}

export function useSocketNotifications(
  onFlagged: (msg: FlaggedMessage) => void
) {
  useEffect(() => {
    const socket: Socket = io('http://localhost:5000'); // Change if backend is on another host/port

    socket.on('flagged_message', (data: FlaggedMessage) => {
      onFlagged(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [onFlagged]);
}