import { useCallback, useEffect } from "react";
import { useModerationSocketContext } from "../providers/ModerationSocketProvider";

export function useModerationSocket() {
  const { socket } = useModerationSocketContext();

  const on = useCallback(
    (event: string, cb: (...args: any[]) => void) => {
      socket?.on(event, cb);
      return () => {
        // ensure cleanup returns void (don't return the value from socket.off)
        socket?.off(event, cb);
      };
    },
    [socket]
  );

  const emit = useCallback(
    (event: string, ...args: any[]) => {
      socket?.emit(event, ...args);
    },
    [socket]
  );

  useEffect(() => {
    return () => {
      // optional cleanup: remove all listeners when unmounting hook consumer
      // socket?.off(); // leaving commented: callers should remove their listeners
    };
  }, [socket]);

  return { socket, on, emit };
}

export default useModerationSocket;
