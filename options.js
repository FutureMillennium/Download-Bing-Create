'use strict';

// find hash in chrome.storage on findHashForm submit
document.querySelector('#findHashForm').addEventListener('submit', function(e) {
	chrome.storage.sync.get('hashes', function(data) {
		let hashes = data.hashes || {};
		let hash = document.querySelector('#hashInput').value;
		if (hash in hashes) {
			document.querySelector('#promptInput').value = hashes[hash];
		} else {
			document.querySelector('#promptInput').value = '(Not found.)';
		}
	});
	e.preventDefault();
	return false;
});

// exportHashesButton click
document.querySelector('#exportHashesButton').addEventListener('click', function(e) {
	chrome.storage.sync.get('hashes', function(data) {
		let hashes = data.hashes || {};
		let csv = '';
		for (let hash in hashes) {
			csv += hash + ',"' + hashes[hash] + '"\n';
		}
		let blob = new Blob([csv], {type: 'text/csv'});
		let url = URL.createObjectURL(blob);
		chrome.downloads.download({
			url: url,
			filename: 'hashes.csv'
		});
	});
	e.preventDefault();
	return false;
});

// importHashesForm
document.querySelector('#importHashesForm').addEventListener('submit', function(e) {
	let file = document.querySelector('#importHashesFile').files[0];
	let reader = new FileReader();
	reader.onload = function() {
		let hashes = {};
		let lines = reader.result.split('\n');
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i].split(',');
			hashes[line[0]] = line[1];
		}
		chrome.storage.sync.set({hashes: hashes});
	};
	reader.readAsText(file);
	e.preventDefault();
	return false;
});
