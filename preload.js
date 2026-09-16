const { contextBridge, clipboard } = require("electron");

contextBridge.exposeInMainWorld('electronApi', {
    copyToClipboard: (text) => clipboard.writeText(text),
    readFromClipboard: () => clipboard.readText
})