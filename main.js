require("./electron-config");
const { BrowserWindow, Menu, app, ipcMain, clipboard } = require("electron");
const path = require("path");
const electronIsDev = require("electron-is-dev");
const windowStateKeeper = require("electron-window-state");

let mainWindow;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 380,
    defaultHeight: 680,
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 340,
    minHeight: 560,
    maxWidth: 480,
    resizable: true,
    maximizable: false,
    title: "Scientific Calculator",
    backgroundColor: "#1e1e2e",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  if (electronIsDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindowState.manage(mainWindow);
}

app.whenReady().then(() => {
  ipcMain.handle("copy-to-clipboard", (event, text) => {
    clipboard.writeText(text);
  });

  ipcMain.handle("read-from-clipboard", () => {
    return clipboard.readText();
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
