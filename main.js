// Modules to control application life and create native browser window
const {app, BrowserWindow, Tray, Menu, screen} = require('electron')
const path = require('path')
const axios = require('axios')

//prevent Sleep
const powerSaveBlocker = require('electron').powerSaveBlocker;
powerSaveBlocker.start('prevent-app-suspension');

function createWindow () {

  //get window size
  let displays = screen.getAllDisplays();
  let d_width = 0
  let d_height = 0;

  for(var i in displays){
    let d = displays[i];
    d_width+= d.workAreaSize.width;
    d_height+= d.workAreaSize.height;
  }

  // Create the browser window.
  let win = new BrowserWindow({
    width: 450,
    height: 280,
    x: (d_width-460),
    y: (d_height-290),
    frame:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.removeMenu();

  // and load the index.html of the app.
  win.loadFile('index.html')

  //creating tray
  tray = new Tray( path.join(__dirname, '/assets/icons/btc.png') )
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', type: 'normal', click() { win.show() } },
    { label: 'Quit', type: 'normal', click() { app.quit() } }
  ])

  tray.setToolTip('Crypto Tracker')
  tray.on("click", () => (win.isVisible() ? win.hide() : win.show()));
  tray.setContextMenu(contextMenu);

  win.on("close", e => {
    if (win.isVisible()) {
      win.hide();
      e.preventDefault();
    }
  });

  // Open the DevTools.
  // win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.