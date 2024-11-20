/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (message: string) => void
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => Promise<any>;
  };
  getFilesFromPagesAndComponents: (rootPath: string) => Promise<any>;
  runExternalTests: (projectPath: string, filesPath?: string[]) => Promise<any>;
  generateSampleData: (dto: any, amount: number, lang?: string) => Promise<any>;
  copyText: (text: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
