import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import Server from "../backend/serever";

export class Main {
  private mainWindow: BrowserWindow;
  private server: Server;
  private mainApp = app;
  private updater = autoUpdater;

  private loginFile: string;

  constructor() {
    this.loginFile = path.join(__dirname, "pages/login.html");
    this.server = new Server();
    this.init();
  }

  public init() {
    // start the application
    this.mainApp.whenReady().then(() => {
      console.log("This log is from main file");
      this.server.init();
      this.registerIpcEvents();
      this.createWindow();
      this.checkForUpdates();
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
      },
    });

    // load login file as the application starts
    this.mainWindow.loadFile(this.loginFile);
  }

  private async checkForUpdates() {
    try {
      console.log("Check for updates and notify...");
      this.updater.checkForUpdatesAndNotify();

      this.updater.on("checking-for-update", () => {
        console.log("checking for updates...");
      });

      this.updater.on("update-not-available", async (info: any) => {
        console.log("Update available!", info);

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
          this.updater.downloadUpdate();
        }
      });

      this.updater.on("download-progress", (progress) => {
        console.log("Download in progress", progress);
      });

      this.updater.on("error", (error) => {
        console.log("Failed to download the updates", error);
      });
    } catch (error) {
      console.log("An error occured while checking the updates", error);
    }
  }

  private registerIpcEvents() {
    ipcMain.on("ping", (event, arg) => {
      console.log("Received ping:", arg);
      event.reply("pong", "Hello from main");
    });

    ipcMain.handle("get-app-version", async () => {
      return app.getVersion();
    });

    ipcMain.on("login-failed", (event) => {
      console.log("login-failed..", this.loginFile);
      this.mainWindow.loadFile(this.loginFile);
    });

    ipcMain.on("sign-up-failed", () => {
      console.log("Sign up failed");
      this.mainWindow.loadFile(path.join(__dirname, "pages/signup.html"));
    });

    ipcMain.on("login-success", () => {
      console.log("Login successful");
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
