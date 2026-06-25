// frontend/src/hooks/useBullyingAlerts.ts
import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface BullyingAlert {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  message: string;
  severity: 'high' | 'medium' | 'low' | 'none';
  keywords: string[];
  reasons: string[];
  userType: 'student' | 'admin';
}

export function useBullyingAlerts(
  onAlert: (alert: BullyingAlert) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const socket: Socket = io(
      import.meta.env.VITE_API_URL || 'http://localhost:5000'
    );

    // Listen for bullying alerts
    socket.on('bullying:alert', (data: BullyingAlert) => {
      console.log('🚨 Bullying Alert Received:', data);
      onAlert({
        ...data,
        timestamp: new Date(data.timestamp),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [onAlert, enabled]);
}

export default useBullyingAlerts;
