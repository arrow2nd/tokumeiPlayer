const builder = require("electron-builder");

builder.build({
    config: {
        "appId": "com.electron.tokumei",
        "files": [
            "img",
            "src",
            "package.json"
        ],
        "win": {
            "target": [
                "nsis",
                "portable"
            ],
            "icon": "../icons/icon.ico"
         },
         "nsis": {
            "oneClick": false,
            "allowToChangeInstallationDirectory": true
         },
         "linux": {
             "target": [
                 "deb",
                 "pacman"
             ],
             "icon": "../icons",
             "category": "Network"
         }
    }
});
