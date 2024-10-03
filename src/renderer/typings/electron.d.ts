/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (message: string) => void
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => Promise<any>;
  };
  getFilesFromPagesAndComponents: (rootPath: string) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
