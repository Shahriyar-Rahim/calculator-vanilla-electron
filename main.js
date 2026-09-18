// require("./electron-config");
const { BrowserWindow, Menu, app, ipcMain, clipboard } = require("electron");
const path = require("path");
const electronIsDev = require("electron-is-dev");
const windowStateKeeper = require("electron-window-state");

if (process.platform === "linux") {
  app.commandLine.appendSwitch("no-sandbox");
  app.commandLine.appendSwitch("disable-setuid-sandbox");
  app.commandLine.appendSwitch("disable-dev-shm-usage");
  app.commandLine.appendSwitch("ozone-platform-hint", "auto");
}
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
    show: false,
    title: "Scientific Calculator",
    backgroundColor: "#1e1e2e",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox:false
    },
  });

  Menu.setApplicationMenu(null);
  // mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  const indexPath = path.join(__dirname, "renderer", "index.html");
  mainWindow.loadFile(indexPath).catch((err) => {
    console.error("Failed to load index.html:", err);
  });

  // if (electronIsDev) {
  //   mainWindow.webContents.openDevTools({ mode: "detach" });
  // }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

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
