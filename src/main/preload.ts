import { contextBridge, ipcRenderer, clipboard  } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendMessage: (message: string) => ipcRenderer.send("message", message),
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),            
  },
  getFilesFromPagesAndComponents: (rootPath: string) => ipcRenderer.invoke('get-files-from-pages-and-components', rootPath),
  runExternalTests: (projectPath: string, filesPath: string) => ipcRenderer.invoke('run-external-tests', projectPath, filesPath),
  generateSampleData: (dto: any, amount: number, lang?: string) => ipcRenderer.invoke('generate-sample-data', dto, amount, lang),
  copyText: (text: string) => alert(text),
});
