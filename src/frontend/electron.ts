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

let downloadDialog: Electron.MessageBoxReturnValue | null = null;

let win: BrowserWindow;

function sendStatusToWindow(text: any) {
  log.info(text);
  win.webContents.send("message", text);
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const windowWidth = Math.floor(width * 0.9);
  const windowHeight = Math.floor(height * 0.9);

  win = new BrowserWindow({
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

  // setInterval(() => {
  //   if (win.isDestroyed()) {
  //     console.log("Main window is destroyed.");
  //     return;
  //   }

  //   logger.log("info", "Checking if main window is still responsive...");
  //   win.webContents
  //     .executeJavaScript("console.log('Renderer process active');")
  //     .then(() => logger.log("info", "Window is responsive"))
  //     .catch(() =>
  //       logger.log("info", "Window is NOT responsive! Possible freeze.")
  //     );
  // }, 5000);

  // ipcMain.on("minimize-window", () => {
  //   win.minimize();
  // });

  // ipcMain.on("maximize-window", () => {
  //   if (win.isMaximized()) {
  //     win.unmaximize();
  //   } else {
  //     win.maximize();
  //   }
  // });

  // ipcMain.on("close-window", () => {
  //   win.close();
  // });

  autoUpdater.setFeedURL({
    provider: "github",
    owner: "YogirajParmar",
    repo: "notifyer-mono-repo",
  });

  console.log("Calling checkForUpdatesAndNotify...");
  autoUpdater.checkForUpdatesAndNotify();

  ipcMain.on("login-success", (event) => {
    logger.log("info", "loading index file");
    win.loadFile(path.join(__dirname, "pages/index.html"));
  });

  ipcMain.on("login-failed", (event) => {
    logger.log("info", "reload login file");
    win.loadFile(path.join(__dirname, "pages/login.html"));
  });
}

// check for update
autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
  log.info("Checking for update...");
  sendStatusToWindow("Checking for update...");
});

// update not available
autoUpdater.on("update-not-available", () => {
  console.log("No update found.");
  log.info("No update found.");
});

// update available
autoUpdater.on("update-available", async (info) => {
  console.log("Update available!", info);
  log.info("Update available:", info);

  // send web contains
  sendStatusToWindow("Update available.");

  // Start downloading the update
  const { response } = await dialog.showMessageBox({
    type: "info",
    title: "Update Available",
    message: `A new update (v${info.version}) is available. Please download it now.`,
    buttons: ["Download Now"],
    defaultId: 0,
    noLink: true,
  });

  if (response === 0) {
    console.log("Downloading update now...");
    log.info("Downloading update now...");

    downloadDialog = await dialog.showMessageBox({
      type: "info",
      title: "Downloading Update",
      message: "Downloading updates... Please wait.",
      buttons: [], // No buttons
      noLink: true,
    });

    autoUpdater.downloadUpdate();
  }
});

// downloading updates
autoUpdater.on("download-progress", async (progress) => {
  const percent = progress.percent.toFixed(2);

  let log_message = "Download speed: " + progress.bytesPerSecond;
  log_message = log_message + " - Downloaded " + percent + "%";
  log_message =
    log_message + " (" + progress.transferred + "/" + progress.total + ")";
  sendStatusToWindow(log_message);

  logger.log("info", `Download progress: ${percent}%`);
  log.info(`Download progress: ${percent}%`);
});

// update downloaded
autoUpdater.on("update-downloaded", async () => {
  console.log("Update downloaded. Restart app...");
  log.info("Update downloaded. Restart app...");
  sendStatusToWindow("Update downloaded");

  if (downloadDialog) {
    console.log("Dialog box is present. Reusing avialable dialog box");
    log.info("Dialog box is present. Reusing avialable dialog box...");
    downloadDialog = await dialog.showMessageBox({
      type: "info",
      title: "Upadte ready",
      message: "A new update has been downloaded. The app will now restart.",
      buttons: ["Restart"],
      defaultId: 0,
    });
  }

  console.log("Creating a new dialog box");
  log.info("Creating a new dialog box...");
  await dialog.showMessageBox({
    type: "info",
    title: "Upadte ready",
    message: "A new update has been downloaded. The app will now restart.",
    buttons: ["Restart"],
    defaultId: 0,
  });
});

// error handling for updates
autoUpdater.on("error", (err) => {
  console.log("Update error:", err);
  log.error("Update error:", err);
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
