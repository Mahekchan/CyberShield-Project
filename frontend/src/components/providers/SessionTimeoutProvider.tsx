import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  type ReactNode, // Corrected: type-only import for ReactNode
} from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of your context value (optional, but good practice)
interface SessionContextType {
  // You might expose functions to reset timers manually if needed, or get current state
  // For this example, we'll keep it simple and just let the provider handle it internally.
}

// Create a React Context for the session, though not strictly necessary for this basic implementation
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Define props for the SessionTimeoutProvider component
interface SessionTimeoutProviderProps {
  children: ReactNode; // Children components to be rendered within the provider
  idleTimeoutMinutes?: number; // Duration of inactivity after which session expires (in minutes)
  absoluteTimeoutMinutes?: number; // Maximum session duration regardless of activity (in minutes)
  logoutPath?: string; // Path to redirect to when a session expires
}

/**
 * SessionTimeoutProvider component manages idle and absolute session timeouts.
 * It wraps its children and monitors user activity.
 *
 * @param {object} props - Component props.
 * @param {ReactNode} props.children - The child components to be rendered.
 * @param {number} [props.idleTimeoutMinutes=15] - The idle timeout duration in minutes.
 * @param {number} [props.absoluteTimeoutMinutes=60] - The absolute timeout duration in minutes.
 * @param {string} [props.logoutPath="/signin"] - The path to redirect to upon session timeout.
 */
const SessionTimeoutProvider: React.FC<SessionTimeoutProviderProps> = ({
  children,
  idleTimeoutMinutes = 15, // Default idle timeout: 15 minutes of inactivity
  absoluteTimeoutMinutes = 60, // Default absolute timeout: 60 minutes total session time
  logoutPath = "/signin", // Default path to redirect to after logout
}) => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Refs to store timer IDs, allowing us to clear them later
  const idleTimerRef = useRef<number | null>(null);
  const absoluteTimerRef = useRef<number | null>(null);

  /**
   * Handles the logout process. This function is called when a timeout occurs.
   * IMPORTANT: You need to add your actual authentication cleanup logic here.
   */
  const logout = useCallback(() => {
    console.log("Session timed out. Logging out...");
    // --- IMPORTANT: Add your actual logout logic here ---
    // 1. Clear authentication tokens from client-side storage (e.g., localStorage, sessionStorage)
    //    This is crucial for security to ensure old tokens are removed.
    localStorage.removeItem("authToken"); // Example: Clear a token stored in localStorage
    sessionStorage.removeItem("userSessionId"); // Example: Clear a session ID

    // 2. Redirect the user to the login page or a logout confirmation page.
    navigate(logoutPath);

    // 3. (Highly Recommended for Security) If you have a backend, send a request
    //    to invalidate the user's session/token on the server side as well.
    //    This prevents the token from being used even if it's still present somewhere.
    //    Example: fetch('/api/logout', { method: 'POST' });
    // --- End of IMPORTANT section ---

    // Clear all active timers after logout
    clearTimers();
  }, [navigate, logoutPath]); // Dependencies for useCallback

  /**
   * Resets the idle timeout timer. This should be called whenever there is user activity.
   */
  const resetIdleTimer = useCallback(() => {
    // Clear any existing idle timer to prevent multiple timers running
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    // Set a new idle timer
    idleTimerRef.current = window.setTimeout(() => {
      logout(); // Call logout when idle timeout is reached
    }, idleTimeoutMinutes * 60 * 1000); // Convert minutes to milliseconds
  }, [idleTimeoutMinutes, logout]); // Dependencies for useCallback

  /**
   * Starts the absolute timeout timer. This timer is set once and does not reset with activity.
   */
  const startAbsoluteTimer = useCallback(() => {
    // Clear any existing absolute timer
    if (absoluteTimerRef.current) {
      clearTimeout(absoluteTimerRef.current);
    }
    // Set a new absolute timer
    absoluteTimerRef.current = window.setTimeout(() => {
      logout(); // Call logout when absolute timeout is reached
    }, absoluteTimeoutMinutes * 60 * 1000); // Convert minutes to milliseconds
  }, [absoluteTimeoutMinutes, logout]); // Dependencies for useCallback

  /**
   * Clears all active session timers (idle and absolute).
   */
  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (absoluteTimerRef.current) {
      clearTimeout(absoluteTimerRef.current);
      absoluteTimerRef.current = null;
    }
  }, []); // No dependencies, as it only clears refs

  /**
   * Event handler for user activity (mouse, keyboard, click, scroll).
   * Resets the idle timer if user is active.
   */
  const handleUserActivity = useCallback(() => {
    // Only reset the idle timer if it's currently active.
    // This implies that the user is considered "logged in" or has an active session.
    if (idleTimerRef.current !== null) {
      resetIdleTimer();
    }
  }, [resetIdleTimer]); // Dependency for useCallback

  // Effect hook to manage timers and event listeners on component mount and unmount
  useEffect(() => {
    // On mount, start both idle and absolute timers.
    // This assumes the provider is mounted when a user is authenticated.
    resetIdleTimer();
    startAbsoluteTimer();

    // Attach event listeners to the window for user activity detection
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity); // Optional: also detect scroll activity

    // Cleanup function: This runs when the component unmounts
    return () => {
      clearTimers(); // Clear all timers
      // Remove event listeners to prevent memory leaks
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
    };
  }, [
    resetIdleTimer,
    startAbsoluteTimer,
    clearTimers,
    handleUserActivity,
  ]); // Dependencies for useEffect

  // The context value can be expanded if you need to expose session state or functions
  const contextValue: SessionContextType = {};

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Custom hook to consume the SessionContext.
 * Currently, it doesn't provide much, but can be extended.
 */
export const useSessionTimeout = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    // Warn if the hook is used outside of the provider
    console.warn(
      "useSessionTimeout must be used within a SessionTimeoutProvider"
    );
    return {}; // Return an empty object or throw an error
  }
  return context;
};

export default SessionTimeoutProvider;
