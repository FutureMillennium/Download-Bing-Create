(async function() {
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
	for (let i = 0; i < imgs.length; i++) {
		let url = imgs[i].src.replace('w=270&h=270&c=6&r=0&o=5&', '');
		let obj = {
			url: url,
			filename: prompt + '-' + i + '.jpg'
		};
		if (prompt.length > 220) {
			obj.filename = await DigestMessage(prompt) + ' ' + prompt + '-' + i + '.jpg'
		}
		chrome.runtime.sendMessage(obj);
	}
})();
