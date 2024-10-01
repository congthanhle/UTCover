const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('public/index.html');
};

app.on('ready', createWindow);

// Communicate between main and renderer (e.g., running tests, listing files)
ipcMain.handle('run-tests', async (event, fileList) => {
  const testRunner = require('./testRunner');
  return await testRunner.runTests(fileList);
});
