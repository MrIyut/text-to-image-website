var model_bias = {
	'Gandalf': "a grey wise old man, that's been through everything and knows almost everything.",
	'Barbie': "a teenage young girl, ultra famous and fabulous, obsessed with pink and fashion.",
	'Dracula': "a sad and depressive vampire, has a thing for blood and the color dark red.",
	'Sauron': "the most evil creature in the universe, only cares about death and power, also is obsessed with fire.",
	'HarryPotter': "a famous teenager for his past, coming from the magical world, whose courage, power and friendship help him to destroy the most dangerous wizard from all times.",
	'MickeyMouse': "a childish character with big black nose and ears, always happy and prepared for adventures, which is loved by all children.",
	'ScoobyDoo': "a brown dog with a lot of energy and happiness, ultra curious and ultra hungry, thinking only about food, very prone to get himself in danger and escape it by pure chance."
};
var selectedModel = '';

function toggleMode() {
	const elementsToToggle = document.querySelectorAll('.dark-mode-toggle');

	// Toggle dark mode class on each element
	elementsToToggle.forEach(element => {
		element.classList.toggle('dark-mode');
	});

	var symbolContainer = document.getElementById('symbol-container');
	symbolContainer.innerHTML = (symbolContainer.innerHTML === '🌙') ? '🔆' : '🌙';
}

function toggleModel() {
	var options = document.getElementById('models');
	if (options.classList.contains("hidden")) {
		options.classList.remove("hidden");
		// disable options div
	} else {
		options.classList.add("hidden");
	}
}

function selectModel(value, image_url) {
	if (selectedModel !== '') {
		document.getElementById(selectedModel).classList.remove("selected");
	}

	var modelButton = document.getElementById('model-button');
	var final_url = "/static/app/images-model/" + image_url;

	if (selectedModel == value) {
		document.getElementById(selectedModel).classList.remove("selected");
		selectedModel = '';

		modelButton.style.backgroundImage = 'none';
		modelButton.innerHTML = 'AI Model';
	} else {
		selectedModel = value;
		document.getElementById(selectedModel).classList.add("selected");

		modelButton.style.backgroundImage = 'url(' + final_url + ')';
		modelButton.innerHTML = value;
	}

	toggleModel()
}

function toggleOptions() {

}

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function generateImage() {
	document.getElementById('generate-button').onclick = null;

	var form = document.createElement('form');
	form.setAttribute('id', 'dynamicForm');
	form.setAttribute('action', '/');
	form.setAttribute('method', 'post');

	var prompt = document.getElementById('prompt').value.trim();
	if (selectedModel !== '' && model_bias[selectedModel]) {
		prompt = prompt + '. Generate the image from the perspective of ' + model_bias[selectedModel];
	}
	
	if (prompt !== '') {
		var promptInput = document.createElement('input');
		promptInput.setAttribute('type', 'text');
		promptInput.setAttribute('name', 'Prompt');
		promptInput.setAttribute('value', prompt);
		form.appendChild(promptInput);
	}

	var negativePrompt = document.getElementById('negative-prompt').value.trim();
	if (negativePrompt !== '') {
		var negativePromptInput = document.createElement('input');
		negativePromptInput.setAttribute('type', 'text');
		negativePromptInput.setAttribute('name', 'NegativePrompt');
		negativePromptInput.setAttribute('value', negativePrompt);
		form.appendChild(negativePromptInput);
	}
	
	var csrfInput = document.createElement('input');
	csrfInput.setAttribute('type', 'hidden');
	csrfInput.setAttribute('name', 'csrfmiddlewaretoken');
	csrfInput.value = getCookie('csrftoken');
	form.appendChild(csrfInput);

	var submitButton = document.createElement('button');
	submitButton.setAttribute('type', 'submit');
	submitButton.textContent = 'Submit';
	form.appendChild(submitButton);

	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function downloadImages() {
	var images = document.querySelectorAll('[id^="generated_image"]');

	images.forEach(function (image, index) {
		var imageUrl = image.src;
		var downloadLink = document.createElement('a');

		downloadLink.href = imageUrl;
		downloadLink.download = 'image_' + (index + 1) + '.png';

		document.body.appendChild(downloadLink);
		downloadLink.click();

		document.body.removeChild(downloadLink);
	});
}