'use strict';
const { app, Menu, BrowserWindow } = require('electron');

// ウインドウを作成、index.html をロード
function createWindow () {
    const win = new BrowserWindow({ 
        width: 255,
        height: 105,
        transparent: true,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: __dirname + '/preload.js'
        }
    });
    win.loadFile('view/index.html');
    Menu.setApplicationMenu(null);
    //win.webContents.openDevTools();
};

// 多重起動を禁止
const doubleboot = app.requestSingleInstanceLock();
if(!doubleboot){
    app.quit();
};

// このメソッドは、Electron が初期化処理と
// browser window の作成準備が完了した時に呼び出されます。
// 一部のAPIはこのイベントが発生した後にのみ利用できます。
app.allowRendererProcessReuse = true;
app.whenReady().then(createWindow);

// 全てのウィンドウが閉じられた時に終了します。
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    };
});

// このファイル内には、
// 残りのアプリ固有のメインプロセスコードを含めることができます。 
// 別々のファイルに分割してここで require することもできます。
