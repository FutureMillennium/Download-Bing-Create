chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {file: "page.js"});
 });

 // get message from page.js
chrome.runtime.onMessage.addListener(function(obj) {
	chrome.downloads.download({
		url: obj.url,
		filename: obj.filename
	});
});
