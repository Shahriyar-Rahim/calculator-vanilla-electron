const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  copyToClipboard: (text) => ipcRenderer.invoke("copy-to-clipboard", text),
  readFromClipboard: () => ipcRenderer.invoke("read-from-clipboard"),
});
