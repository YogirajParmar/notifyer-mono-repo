import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import Server from "../../backend/serever";
import { logger } from "../../backend/helpers";

export class Main {
  private mainWindow: BrowserWindow;
  private server: Server;
  private mainApp = app;
  private updater = autoUpdater;

  private loginFile: string;

  constructor() {
    this.loginFile = path.join(__dirname, "../../client/index.html");
    logger.log("info", `Login file loaded: ${this.loginFile}`);
    this.server = new Server();
    this.checkForUpdates();
    this.init();
  }

  public init() {
    // start the application
    this.mainApp.whenReady().then(() => {
      this.server.init();
      this.registerIpcEvents();
      this.createWindow();
    });
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      fullscreen: true,
      minimizable: true,
      maximizable: true,
      closable: true,
      icon: path.join(
        __dirname,
        "assets",
        "icons",
        "android-chrome-192x192.png"
      ),
      center: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
      },
    });

    // load login file as the application starts
    this.mainWindow.loadFile(this.loginFile);
  }

  private async checkForUpdates() {
    try {
      this.updater.on("checking-for-update", () => {
        logger.log("info", "checking for updates...");
      });

      this.updater.on("update-not-available", async (info: any) => {
        logger.log("info", `Update available! ${info}`);

        const { response } = await dialog.showMessageBox({
          type: "info",
          title: "Update Available",
          message: `A new update (v${info.version}) is available. Please download it now.`,
          buttons: ["Download Now"],
          defaultId: 0,
          noLink: true,
        });

        if (response === 0) {
          logger.log("info", "Downloading update now...");
          this.updater.downloadUpdate();
        }
      });

      this.updater.on("download-progress", (progress) => {
        logger.log("info", `Download in progress: ${progress}`);
      });

      this.updater.on("error", (error) => {
        logger.log("info", `Failed to download the updates ${error}`);
      });

      this.updater.checkForUpdates();
    } catch (error) {
      logger.log(
        "info",
        `An error occured while checking the updates: ${error}`
      );
    }
  }

  private registerIpcEvents() {
    ipcMain.on("ping", (event, arg) => {
      logger.log("info", `Received ping: ${arg}`);
      event.reply("pong", "Hello from main");
    });

    ipcMain.handle("get-app-version", async () => {
      return app.getVersion();
    });

    ipcMain.on("login-failed", (event) => {
      logger.log("info", `login-failed.. ${this.loginFile}`);
      this.mainWindow.loadFile(this.loginFile);
    });

    ipcMain.on("sign-up-failed", () => {
      logger.log("info", "Sign up failed");
      this.mainWindow.loadFile(path.join(__dirname, "pages/signup.html"));
    });

    ipcMain.on("login-success", () => {
      logger.log("info", "Login successful");
      this.mainWindow.loadFile(path.join(__dirname, "pages/index.html"));
    });

    ipcMain.on("minimize-window", () => {
      this.mainWindow.minimize();
    });

    ipcMain.on("maximize-window", () => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow.maximize();
      }
    });

    ipcMain.on("close-window", () => {
      this.mainWindow.close();
    });
  }
}

new Main();
