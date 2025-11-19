import React, { useEffect, useState } from 'react';

// Access electron APIs directly (nodeIntegration is true)
const { ipcRenderer } = typeof window !== 'undefined' && window.require ? window.require('electron') : { ipcRenderer: null };

export const UpdateModal = () => {
  const [updateStatus, setUpdateStatus] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  useEffect(() => {
    if (!ipcRenderer) return;

    const handleUpdateStatus = (event, { status, data }) => {
      setUpdateStatus(status);
      setUpdateData(data);
    };

    ipcRenderer.on('update-status', handleUpdateStatus);

    // Check initial status
    ipcRenderer.invoke('is-update-in-progress').then((inProgress) => {
      if (inProgress) {
        setUpdateStatus('checking');
      }
    });

    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('update-status');
      }
    };
  }, []);

  if (!updateStatus || updateStatus === 'not-available' || updateStatus === 'error') {
    return null;
  }

  const getStatusMessage = () => {
    switch (updateStatus) {
      case 'checking':
        return 'Checking for updates...';
      case 'available':
        return `Update available! Version ${updateData?.version || ''} is being downloaded.`;
      case 'downloading':
        const percent = updateData?.percent || 0;
        return `Downloading update... ${percent}%`;
      case 'ready-to-install':
        return `Update downloaded! The app will restart to install version ${updateData?.version || ''}...`;
      default:
        return 'Processing update...';
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Loading Spinner */}
          <div className="mb-6 flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-black"></div>
          </div>

          {/* Status Message */}
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {updateStatus === 'ready-to-install' ? 'Update Ready!' : 'Updating Application'}
          </h3>
          
          <p className="text-gray-600 mb-6">{getStatusMessage()}</p>

          {/* Progress Bar for Downloading */}
          {updateStatus === 'downloading' && updateData?.percent !== undefined && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-black h-3 rounded-full transition-all duration-300"
                  style={{ width: `${updateData.percent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {updateData.transferred && updateData.total
                    ? `${formatBytes(updateData.transferred)} / ${formatBytes(updateData.total)}`
                    : `${updateData.percent}%`}
                </span>
                {updateData.bytesPerSecond && (
                  <span>{formatBytes(updateData.bytesPerSecond)}/s</span>
                )}
              </div>
            </div>
          )}

          {/* Warning for ready-to-install */}
          {updateStatus === 'ready-to-install' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                Please do not close the application. It will restart automatically in a few seconds.
              </p>
            </div>
          )}

          {/* Info message */}
          <p className="text-xs text-gray-500">
            {updateStatus === 'downloading' || updateStatus === 'checking'
              ? 'Please wait while we update the application...'
              : 'The application will restart shortly.'}
          </p>
        </div>
      </div>
    </div>
  );
};

