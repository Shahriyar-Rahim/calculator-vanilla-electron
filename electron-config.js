const { app } = require("electron");

if (process.platform === "linux") {
  app.commandLine.appendSwitch("no-sandbox");
  app.commandLine.appendSwitch("disable-setuid-sandbox");
  app.commandLine.appendSwitch("disable-dev-shm-usage");
  app.commandLine.appendSwitch("disable-gpu");
  app.commandLine.appendSwitch("ozone-platform", "x11");
  app.commandLine.appendSwitch("log-level", "3");
  app.disableHardwareAcceleration();
}
