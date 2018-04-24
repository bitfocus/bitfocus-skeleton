var Client = require('electron-rpc/client')
var client = new Client();
var exec = require('child_process').exec;

var skeleton_info = {
	appName: 'appName',
	appVersion: 'appVersion',
	appURL: 'appURL',
	appStatus: 'appStatus'
};

function skeleton_info_draw() {
	document.getElementById("status").innerHTML = skeleton_info.appStatus;
	document.getElementById("url").innerHTML = skeleton_info.appURL;
	document.getElementById("model").innerHTML = skeleton_info.appName + " v" + skeleton_info.appVersion;
	document.title = skeleton_info.appName;
}

document.getElementById('launch').addEventListener('click', function() {
	var isWin = process.platform === "win32";
	exec((isWin ? 'start ' : 'open ' ) + skeleton_info.appURL, function callback(error, stdout, stderr){});
});

document.getElementById('hide').addEventListener('click', function() {
	client.request('skeleton-minimize');
});

document.getElementById('close').addEventListener('click', function() {
	client.request('skeleton-close');
});

client.request('info', function(err, obj) {
	skeleton_info = obj;
	skeleton_info_draw();
});

client.on('info', function(err, obj) {
	skeleton_info = obj;
	skeleton_info_draw();
});

client.on('log', function(err, line) {
	var old_log = document.getElementById("log").innerHTML;
	document.getElementById("log").innerHTML = old_log + "\n" + line;
	var textarea = document.getElementById('log');
	if (textarea.scrollHeight - textarea.scrollTop - textarea.offsetHeight < 20) {
		textarea.scrollTop = textarea.scrollHeight;
	}
});

client.request('skeleton-ready');
