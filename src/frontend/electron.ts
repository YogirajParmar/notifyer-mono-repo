import { app, BrowserWindow, screen } from "electron";
import * as path from "path";
import Server from "../backend/serever";
import * as dotenv from "dotenv";

dotenv.config();

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Remove the window frame and make it cover the entire screen
  win.setFullScreen(true);

  const filePath = `${path.join(__dirname, "pages/login.html")}`;
  win.loadFile(filePath);
}

app.whenReady().then(() => {
  const server = new Server();
  server.init();
  console.log('Env: ', { port: process.env.PORT, baseUrl: process.env.ELECTRON_BASE_URL });
  console.log("*****server started*****");
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

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
