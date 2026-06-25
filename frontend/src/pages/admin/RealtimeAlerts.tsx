import React, { useEffect, useState } from "react";
import useModerationSocket from "../../hooks/useModerationSocket";

interface AlertItem {
  id?: string;
  title?: string;
  message?: string;
  createdAt?: string;
  [key: string]: any;
}

const RealtimeAlerts: React.FC = () => {
  const { on } = useModerationSocket();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const off = on("moderatorAlert", (alert: AlertItem) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    return () => {
      // ensure we call the cleanup function
      off && off();
    };
  }, [on]);

  return (
    <div style={{ padding: 16 }}>
      <h3>Realtime Alerts</h3>
      {alerts.length === 0 ? (
        <div>No alerts yet.</div>
      ) : (
        <ul>
          {alerts.map((a, i) => (
            <li key={a.id ?? i}>
              <strong>{a.title ?? "Alert"}</strong>:{" "}
              {a.message ?? JSON.stringify(a)}
              <div style={{ fontSize: 12, color: "#666" }}>{a.createdAt}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RealtimeAlerts;
