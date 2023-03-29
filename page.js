(function() {
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
		chrome.runtime.sendMessage(obj);
	}
})();
