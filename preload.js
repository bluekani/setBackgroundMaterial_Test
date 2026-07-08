const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setBackgroundMaterial: (material) => ipcRenderer.invoke('set-background-material', material),
  setBackgroundColor: (rgba) => ipcRenderer.invoke('set-background-color', rgba),
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close')
});
