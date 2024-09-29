import { app, BrowserWindow, screen, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import Server from "../backend/serever";
import * as dotenv from "dotenv";
import { logger } from "@backend/helpers"

const envPath = app.isPackaged
  ? path.join(process.resourcesPath, '.env')
  : path.join(__dirname, '..', '..', '.env');

dotenv.config({ path: envPath });

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const windowWidth = Math.floor(width * 0.9);
  const windowHeight = Math.floor(height * 0.9);

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    icon: path.join(__dirname, 'assets', 'icons', 'android-chrome-192x192.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,
    transparent: false,
  });

  win.center();
  logger.log("info", "Starting the application");

  const filePath = `${path.join(__dirname, "pages/login.html")}`;
  win.loadFile(filePath);

  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    win.close();
  });

  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
  const server = new Server();
  server.init();
  logger.log("info", "Server initialized");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

autoUpdater.on('update-available', () => {
  logger.log("info", "Update available");
});

autoUpdater.on('update-downloaded', () => {
  logger.log("info", "Update downloaded");
  autoUpdater.quitAndInstall();
});
