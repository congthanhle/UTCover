import {app, BrowserWindow, ipcMain, session, dialog} from 'electron';
import {join} from 'path';
const path = require('path');
const fs = require('fs');
import ExternalTestRunner from './utils/TestRunner';
import DataSample from './utils/DataSample';

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
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

  const getFilesFromMultipleDirectories = (rootPath: string) => {
    const result: {
      pages: { filename: string; path: string }[];
      components: { filename: string; path: string }[];
      testPages: { filename: string; path: string }[];
      testComponents: { filename: string; path: string }[];
    } = { pages: [], components: [], testPages: [], testComponents: [] };

    const srcDir = path.join(rootPath, 'src');
    const testDir = path.join(rootPath, 'tests', 'unit');

    const directories = [
      { name: 'pages', path: path.join(srcDir, 'pages'), resultKey: 'pages' },
      { name: 'components', path: path.join(srcDir, 'components'), resultKey: 'components' },
      { name: 'testPages', path: path.join(testDir, 'pages'), resultKey: 'testPages' },
      { name: 'testComponents', path: path.join(testDir, 'components'), resultKey: 'testComponents' },
    ];

    directories.forEach(({ name, path: dirPath, resultKey }) => {
      if (fs.existsSync(dirPath)) {
        result[resultKey] = getFilesRecursively(dirPath);
      } else {
        console.warn(`Directory not found: ${name} at ${dirPath}`);
      }
    });

    return result;
  };

  return getFilesFromMultipleDirectories(rootPath);
});

ipcMain.handle('run-external-tests', async (event, projectPath, filesPath) => {
  const testRunner = new ExternalTestRunner(projectPath, filesPath);
  try {
    const results = await testRunner.runTests();
    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});


ipcMain.handle('generate-sample-data', async (_event, dto: any, amount: number, lang: string = "US") => {
  const data = new DataSample(dto, amount, lang);
  try {
    const results = await data.generateSampleData();
    return results;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});



