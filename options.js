'use strict';

// find hash in chrome.storage on findHashForm submit
document.querySelector('#findHashForm').addEventListener('submit', function(e) {
	let hash = document.querySelector('#hashInput').value;
	let key = 'hashes-' + hash.substring(0, 2);
	chrome.storage.local.get(key, function(data) {
		let hashes = data[key] || {};
		if (hash in hashes) {
			document.querySelector('#promptInput').value = hashes[hash];
		} else {
			document.querySelector('#promptInput').value = '(Not found.)';
		}
	});
	e.preventDefault();
	return false;
});

// export all hash-prompt pairs as CSV
document.querySelector('#exportHashesButton').addEventListener('click', function(e) {
	chrome.storage.local.get(null, function(data) {
		let csv = '';
		for (let key in data) {
			if (key.startsWith('hashes-')) {
				let hashes = data[key];
				for (let hash in hashes) {
					// replace double quotes with two double quotes
					let prompt = hashes[hash].replace(/"/g, '""');
					csv += hash + ',"' + prompt + '"\n';
				}
			}
		}
		let blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
		chrome.downloads.download({
			url: URL.createObjectURL(blob),
			filename: 'hashes.csv'
		});
	});
	e.preventDefault();
	return false;
});

// import hash-prompt pairs from CSV
document.querySelector('#importHashesForm').addEventListener('submit', function(e) {
	let file = document.querySelector('#importHashesFile').files[0];
	let reader = new FileReader();
	reader.onload = function() {
		let numImported = 0;
		let hashes = {};
		let lines = reader.result.split('\n');
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			if (line.length < 17) { continue; }
			let firstCommaIndex = line.indexOf(',');
			if (firstCommaIndex === -1) { continue; }
			let hash = line.substring(0, firstCommaIndex);
			let prompt = line.substring(firstCommaIndex + 1);
			if (prompt.startsWith('"') && prompt.endsWith('"')) {
				prompt = prompt.substring(1, prompt.length - 1);
			}
			let key = 'hashes-' + hash.substring(0, 2);
			if (!(key in hashes)) {
				hashes[key] = {};
			}
			hashes[key][hash] = prompt;
			numImported++;
		}
		// merge with existing hashes
		chrome.storage.local.get(null, function(data) {
			for (let key in data) {
				if (key.startsWith('hashes-')) {
					let dataHashes = data[key];
					if (!(key in hashes)) {
						hashes[key] = {};
					}
					for (let hash in dataHashes) {
						// don't overwrite imported hashes
						if (!(hash in hashes[key])) {
							hashes[key][hash] = dataHashes[hash];
						}
					}
				}
			}
			chrome.storage.local.set(hashes);
		});
		window.alert(numImported + ' hashes successfully imported.');
	};
	reader.readAsText(file);
	e.preventDefault();
	return false;
});
