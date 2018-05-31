var electron = require('electron')
var RPC = require('electron-rpc/server')
var app = electron.app
var BrowserWindow = electron.BrowserWindow;
var path = require('path')
var url = require('url')
var main = require('../app.js');
var system = main();
var fs = require("fs");
var path = require("path");
var window;

var skeleton_info = {
	appName: '',
	appVersion: '',
	appURL: '',
	appStatus: '',
	configDir: app.getPath('appData')
};

function packageinfo() {
	var self = this;
	var fileContents = fs.readFileSync(__dirname + '/../package.json');
	var object = JSON.parse(fileContents);
	return object;
};

function createWindow() {
	window = new BrowserWindow({
		width: 400,
		height: 600,
		minHeight: 600,
		minWidth: 400,
		maxHeight: 600,
		frame: false,
		resizable: false,
		icon: path.join(__dirname, 'assets/icon.png'),
		webPreferences: {
			pageVisibility: true
		}
	});

	window.loadURL(url.format({
		pathname: path.join(__dirname, 'window.html'),
		protocol: 'file:',
		slashes: true
	}));

	var rpc = new RPC();
	rpc.configure(window.webContents);

	rpc.on('info', function(req, cb) {
		cb(null, skeleton_info);
	});

	rpc.on('log', function(req, cb) {
		cb(null, "Started");
	});

	rpc.on('skeleton-close', function(req, cb) {
		system.emit('exit');
	});

	rpc.on('skeleton-minimize', function(req, cb) {
		window.minimize();
	});

	rpc.on('skeleton-bind-ip', function(req, cb) {
		console.log("chip:",req.body)
		system.emit('skeleton-bind-ip', req.body);
	});

	rpc.on('skeleton-ready', function(req, cb) {
		system.emit('skeleton-ready');
	});

	system.on('skeleton-ip-unavail', function() {
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

	var build = fs.readFileSync(__dirname + "/../BUILD").toString().trim();
	var pkg = packageinfo();
	system.emit('skeleton-info', 'appVersion', pkg.version + " (" + build.trim() + ")" );
	system.emit('skeleton-info', 'appName', pkg.description);
	system.emit('skeleton-info', 'appStatus', 'Starting');
	system.emit('skeleton-info', 'configDir', app.getPath('appData') );
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
