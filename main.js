const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let currentMaterial = 'auto';
let currentColor = 'rgba(255, 255, 255, 0)';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    titleBarStyle: 'hidden',
    frame: true,
    transparent: true
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.webContents.once('did-finish-load', () => {
    try {
      mainWindow.setBackgroundMaterial(currentMaterial);
      mainWindow.webContents.executeJavaScript(`document.body.style.backgroundColor = '${currentColor}';`);
    } catch (error) {
      console.error('Initial setup failed:', error);
    }
  });

  setInterval(() => {
    if (!mainWindow || !mainWindow.webContents) return;
    try {
      mainWindow.setBackgroundMaterial(currentMaterial);
    } catch (error) {
      // Ignore errors
    }
  }, 1000);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for setBackgroundMaterial
ipcMain.handle('set-background-material', async (event, material, rgba) => {
  try {
    currentMaterial = material;
    if (mainWindow && mainWindow.webContents) {
      // 'none'の場合はsetBackgroundMaterialを呼ばない（デフォルト状態）
      if (material !== 'none') {
        mainWindow.setBackgroundMaterial(material);
      }
      return { success: true, message: `Background material set to: ${material}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('set-background-color', async (event, rgba) => {
  try {
    currentColor = rgba;
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.executeJavaScript(`
        document.body.style.backgroundColor = '${rgba}';
      `);
      return { success: true, message: `Background color set to: ${rgba}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Window control handlers
ipcMain.handle('window-minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window-close', () => {
  mainWindow.close();
});
