import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (message: string) => ipcRenderer.send("message", message),
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),            
  },
  getFilesFromPagesAndComponents: (rootPath) => ipcRenderer.invoke('get-files-from-pages-and-components', rootPath)
});
