import { createContext, useEffect, useMemo, useState } from 'react';
import { meetings as mockMeetings } from '../data/mockData.js';

export const AppContext = createContext(null);
const LOG_STORAGE_KEY = 'ocm-admin-log-book';

function getStoredLogs() {
  try {
    const storedLogs = window.localStorage.getItem(LOG_STORAGE_KEY);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }) {
  const [meetings] = useState(mockMeetings);
  const [logs, setLogs] = useState(getStoredLogs);

  useEffect(() => {
    window.localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  function addLog(logEntry) {
    setLogs((currentLogs) => {
      const existingLog = currentLogs.find((log) => log.meetingId === logEntry.meetingId);
      const timestamp = new Date().toISOString();

      if (!existingLog) {
        return [
          {
            id: crypto.randomUUID(),
            timestamp,
            status: 'Sent',
            channels: logEntry.channel ? [logEntry.channel] : [],
            ...logEntry,
          },
          ...currentLogs,
        ];
      }

      const mergedRecipientIds = Array.from(
        new Set([...(existingLog.recipientIds || []), ...(logEntry.recipientIds || [])])
      );
      const mergedChannels = Array.from(
        new Set([...(existingLog.channels || (existingLog.channel ? [existingLog.channel] : [])), logEntry.channel].filter(Boolean))
      );

      return [
        {
          ...existingLog,
          timestamp,
          channel: mergedChannels.join(' + '),
          channels: mergedChannels,
          recipientIds: mergedRecipientIds,
          recipientsCount: mergedRecipientIds.length,
        },
        ...currentLogs.filter((log) => log.id !== existingLog.id),
      ];
    });
  }

  const value = useMemo(
    () => ({
      meetings,
      logs,
      addLog,
    }),
    [meetings, logs]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
