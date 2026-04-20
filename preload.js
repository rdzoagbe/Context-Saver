const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getActiveWindow: () => ipcRenderer.invoke('get-active-window'),
});
