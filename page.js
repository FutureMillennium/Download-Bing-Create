(async function() {
	'use strict';

	async function DigestMessage(message) {
		const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
		const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8); // hash the message
		const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
		const hashHex = hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join(""); // convert bytes to hex string
		return hashHex;
	}

	let imgs = document.querySelectorAll('.img_cont img');
	if (imgs.length === 0) {
		imgs = document.querySelectorAll('.giric img');
	}
	let prompt = document.querySelector('#sb_form_q').value;
	let hash = (await DigestMessage(prompt)).substring(0, 16);

	// add hash-prompt pair to chrome.storage if it doesn't exist
	if (prompt.length > 220) {
		chrome.storage.sync.get('hashes', function(data) {
			// handle errors
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				return;
			}

			let hashes = data.hashes || {};
			if (!(hash in hashes)) {
				hashes[hash] = prompt;
				chrome.storage.sync.set({hashes: hashes});
			}
		});
	}

	for (let i = 0; i < imgs.length; i++) {
		let url = imgs[i].src.replace('w=270&h=270&c=6&r=0&o=5&', '');
		let obj = {
			url: url,
			filename: prompt + '-' + i + '.jpg'
		};
		if (prompt.length > 220) {
			obj.filename = hash + ' ' + prompt + '-' + i + '.jpg'
		}
		chrome.runtime.sendMessage(obj);
	}
})();
