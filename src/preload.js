const { app, dialog, shell } = require('electron').remote;
  
process.once('loaded', () => {
    global.app = app;
    global.dialog = dialog;
    global.shell = shell;
});
