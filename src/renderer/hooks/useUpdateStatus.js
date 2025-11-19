import { useState, useEffect } from 'react';

// Access electron APIs directly (nodeIntegration is true)
const { ipcRenderer } = typeof window !== 'undefined' && window.require ? window.require('electron') : { ipcRenderer: null };

export const useUpdateStatus = () => {
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    if (!ipcRenderer) return;

    const checkInitialStatus = async () => {
      try {
        const inProgress = await ipcRenderer.invoke('is-update-in-progress');
        setIsUpdateInProgress(inProgress);
      } catch (error) {
        console.error('Error checking update status:', error);
      }
    };

    const handleUpdateStatus = (event, { status, data }) => {
      setUpdateStatus(status);
      // Consider these statuses as "in progress"
      const blockingStatuses = ['checking', 'available', 'downloading', 'ready-to-install'];
      setIsUpdateInProgress(blockingStatuses.includes(status));
    };

    checkInitialStatus();
    ipcRenderer.on('update-status', handleUpdateStatus);

    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('update-status');
      }
    };
  }, []);

  return { isUpdateInProgress, updateStatus };
};

