const { ipcRenderer } = require("electron");
const fs = require("fs");

let openedFilePath;

const textareaElement = document.getElementById("text-editor-area");

ipcRenderer.on("file-opened", (event, { content, filePath }) => {
  openedFilePath = filePath;
  textareaElement.value = content;
  textareaElement.style.display = "inline-block";
  document.getElementById("path").textContent = filePath;
});

ipcRenderer.on("save-file", (event) => {
  const currentValue = textareaElement.value;
  fs.writeFileSync(openedFilePath, currentValue, "utf-8");
});
