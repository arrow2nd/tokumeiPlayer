const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'com.electron.tokumei',
        'files': [
            'img',
            'src',
            'view',
            'package.json'
        ],
        /*'mac': {
            'target': 'dmg',
            'icon': '../img/icon.ico'
        },*/
        'win': {
            'target': [
                'nsis',
                'portable'
            ],
            'icon': '../img/icon.ico'
         },
         "nsis": {
            "oneClick": false,
            "allowToChangeInstallationDirectory": true
          }
    }
});
