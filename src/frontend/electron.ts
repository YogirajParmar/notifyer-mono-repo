import { app, BrowserWindow } from "electron";
import * as path from "path";
import Server from "../backend/serever";
import * as dotenv from "dotenv";

dotenv.config();

const server = new Server();
server.init();
console.log("*****server started*****");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const filePath = `${path.join(__dirname, "pages/login.html")}`
  console.log("*****************",`filePath: ${filePath}`);
  win.loadFile(filePath);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
