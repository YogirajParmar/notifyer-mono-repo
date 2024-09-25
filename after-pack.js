const fs = require("fs");
const path = require("path");

exports.default = function (context) {
  const appOutDir = context.appOutDir;
  const unnecessaryFiles = [
    "LICENSE",
    "LICENSES.chromium.html",
    "version",
    "resources/inspector",
    "resources/electron.asar.unpacked/dist/resources/inspector",
  ];

  unnecessaryFiles.forEach((file) => {
    const filePath = path.join(appOutDir, file);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { recursive: true, force: true });
      console.log(`Removed: ${filePath}`);
    }
  });
};
