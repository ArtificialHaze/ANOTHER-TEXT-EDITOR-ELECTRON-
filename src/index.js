const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");
const { shell } = require("electron");
const fs = require("fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let win;

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "index.html"));

  win.on("ready-to-show", () => {
    win.show();
  });

  // Open the DevTools.
  win.webContents.openDevTools();
};

const template = [
  {
    label: "File",
    submenu: [
      {
        id: "save-file-item",
        enabled: false,
        accelerator: "Ctrl + S",
        label: "Save File",
        click: async () => {
          win.webContents.send("save-file");
        },
      },
      { type: "separator" },
      {
        label: "Open File",
        accelerator: "Ctrl + O",
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({
            properties: ["openFile"],
          });
          const file = filePaths[0];
          const content = fs.readFileSync(file, "utf-8");
          win.webContents.send("file-opened", { content, filePath: file });
          const saveFileItem = menu.getMenuItemById("save-file-item");
          saveFileItem.enabled = true;
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on("ready", () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
