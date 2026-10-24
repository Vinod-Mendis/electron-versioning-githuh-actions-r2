import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('appInfo', {
  version: () => ipcRenderer.invoke('version'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onStatus: (callback) => {
    const listener = (_event, text) => callback(text)
    ipcRenderer.on('status', listener)
    return () => ipcRenderer.removeListener('status', listener)
  },
  onUpdateReady: (callback) => {
    const listener = () => callback()
    ipcRenderer.on('update-ready', listener)
    return () => ipcRenderer.removeListener('update-ready', listener)
  }
})
