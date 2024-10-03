import {app, BrowserWindow, ipcMain, session, dialog} from 'electron';
import {join} from 'path';
const path = require('path');
const fs = require('fs');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.handle('select-directory', async (event, operation) => {
  const properties = operation === 'export' ? ['openDirectory', 'createDirectory'] : ['openDirectory'];
  const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
  });
  if (result.canceled) {
      return null;
  } else {
      return result.filePaths[0];
  }
});

ipcMain.handle('get-files-from-pages-and-components', (event, rootPath) => {
  const getFilesRecursively = (dir: string, fileList: { filename: string; path: string }[] = []) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        getFilesRecursively(filePath, fileList);
      } else {
        if (!file.endsWith('.stories.ts')) {
          fileList.push({ filename: file, path: filePath });
        }
      }
    });
    return fileList;
  };

  const getFilesFromPagesAndComponents = (rootPath: string) => {
    const result: { pages: { filename: string; path: string }[], components: { filename: string; path: string }[] } = { pages: [], components: [] };

    const pagesDir = path.join(rootPath, 'pages');
    if (fs.existsSync(pagesDir)) {
      result.pages = getFilesRecursively(pagesDir);
    }

    const componentsDir = path.join(rootPath, 'components');
    if (fs.existsSync(componentsDir)) {
      result.components = getFilesRecursively(componentsDir);
    }

    return result;
  };

  return getFilesFromPagesAndComponents(rootPath);
});

