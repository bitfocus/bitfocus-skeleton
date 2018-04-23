var electron = require('electron')
var RPC = require('electron-rpc/server')
var app = electron.app
var BrowserWindow = electron.BrowserWindow
var path = require('path')
var url = require('url')
var window;

function createWindow() {
  window = new BrowserWindow({width: 600, height: 400});

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'window.html'),
    protocol: 'file:',
    slashes: true
  }));

	var rpc = new RPC();
	rpc.configure(window.webContents)

	rpc.on('status', function(req, cb) {
		cb(null, "datta")
	});

	rpc.send('status', "well ok");

  window.on('closed', function () {
    window = null
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  app.quit()
});

app.on('activate', function () {
  if (window === null) {
    createWindow();
  }
})
