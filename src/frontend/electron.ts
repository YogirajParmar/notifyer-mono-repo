import { app, BrowserWindow, screen, ipcMain, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import Server from "../backend/serever";
import * as dotenv from "dotenv";
import { logger } from "@backend/helpers";
import log from "electron-log";

const envPath = app.isPackaged
  ? path.join(process.resourcesPath, ".env")
  : path.join(__dirname, "..", "..", ".env");

dotenv.config({ path: envPath });

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const windowWidth = Math.floor(width * 0.9);
  const windowHeight = Math.floor(height * 0.9);

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    icon: path.join(__dirname, "assets", "icons", "android-chrome-192x192.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
    frame: false,
    transparent: false,
  });

  win.center();
  logger.log("info", "Starting the application");

  const filePath = `${path.join(__dirname, "pages/login.html")}`;
  win.loadFile(filePath);

  ipcMain.on("minimize-window", () => {
    win.minimize();
  });

  ipcMain.on("maximize-window", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    win.close();
  });

  autoUpdater.setFeedURL({
    provider: "github",
    owner: "YogirajParmar",
    repo: "notifyer-mono-repo",
  });

  console.log("Calling checkForUpdatesAndNotify...");
  autoUpdater.checkForUpdatesAndNotify();
}

console.log("Initializing autoUpdater..."); // Debugging log

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
  log.info("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  console.log("Update available!", info);
  log.info("Update available:", info);

  // Start downloading the update
  console.log("Downloading update...");
  autoUpdater.downloadUpdate();
});

autoUpdater.on("update-not-available", () => {
  console.log("No update found.");
  log.info("No update found.");
});

autoUpdater.on("error", (err) => {
  console.log("Update error:", err);
  log.error("Update error:", err);
});

autoUpdater.on("download-progress", (progress) => {
  const win = BrowserWindow.getAllWindows()[0];
  const percent = progress.percent / 100;

  win.setProgressBar(percent);
  console.log(`Download progress: ${progress.percent.toFixed(2)}%`);
  log.info(`Download progress: ${progress.percent.toFixed(2)}%`);
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded. Restart app...");
  log.info("Update downloaded. Restart app...");

  dialog
    .showMessageBox({
      type: "info",
      title: "Upadte ready",
      message: "A new update has been downloaded. Restart now?",
      buttons: ["Restart", "Later"],
    })
    .then((result) => {
      if (result.response === 0) autoUpdater.quitAndInstall();
    });
});

app.whenReady().then(() => {
  const server = new Server();
  server.init();
  logger.log("info", "Server initialized");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

log.info("App starting...");
