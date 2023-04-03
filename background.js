'use strict';

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {file: "page.js"});
});

 // get message from page.js
chrome.runtime.onMessage.addListener(function(obj) {

	// replace invalid characters in filename
	let filename = obj.filename.replace(/[\\/:*?"<>|]/g, '_');
	chrome.downloads.download({
		url: obj.url,
		filename: filename,
	});
	
	if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError);
	}
});
