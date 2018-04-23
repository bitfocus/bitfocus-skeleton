var electron = require('electron')
var RPC = require('electron-rpc/server')
var app = electron.app
var BrowserWindow = electron.BrowserWindow
var path = require('path')
var url = require('url')
var main = require('../src/index.js');
var system = main();
var window;

var skeleton_info = {
	appName: 'appName',
	appVersion: 'appVersion',
	appURL: 'http://www.lol.no',
	appStatus: 'appStatus'
};

function createWindow() {
  window = new BrowserWindow({width: 600, height: 400});

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'window.html'),
    protocol: 'file:',
    slashes: true
  }));

	var rpc = new RPC();
	rpc.configure(window.webContents)

	rpc.on('info', function(req, cb) {
		cb(null, skeleton_info);
	});

	rpc.on('log', function(req, cb) {
		cb(null, "Started");
	});

	system.on('skeleton-info', function(key,val) {
		skeleton_info[key] = val;
		rpc.send('info', skeleton_info);
	});

	system.on('skeleton-log', function(line) {
		rpc.send('log', line);
	});

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
