var model_bias = {
	'Gandalf': "a grey wise old man, that's been through everything and knows almost everything.",
	'Barbie': "a teenage young girl, ultra famous and fabulous, obsessed with pink and fashion.",
	'Dracula': "a sad and depressive vampire, has a thing for blood and the color dark red.",
	'Sauron': "the most evil creature in the universe, only cares about death and power, also is obsessed with fire.",
	'HarryPotter': "a famous teenager for his past, coming from the magical world, whose courage, power and friendship help him to destroy the most dangerous wizard from all times.",
	'MickeyMouse': "a childish character with big black nose and ears, always happy and prepared for adventures, which is loved by all children.",
	'ScoobyDoo': "a brown dog with a lot of energy and happiness, ultra curious and ultra hungry, thinking only about food, very prone to get himself in danger and escape it by pure chance."
};
var possibleDimensions = [
	{ width: 640, height: 1536 },
	{ width: 768, height: 1344 },
	{ width: 832, height: 1216 },
	{ width: 896, height: 1152 },
	{ width: 1024, height: 1024 },
	{ width: 1152, height: 896 },
	{ width: 1216, height: 832 },
	{ width: 1344, height: 768 },
	{ width: 1536, height: 640 },
];
var selectedModel = '';

function toggleDarkMode(save) {
	var darkMode = sessionStorage.getItem('darkMode') ?? 'disabled';
	if (save === 'true') {
		darkMode = (darkMode === 'disabled') ? 'enabled' : 'disabled';
	}

	const elementsToToggle = document.querySelectorAll('.dark-mode-toggle');
	elementsToToggle.forEach(element => {
		if (darkMode === 'disabled') {
			element.classList.remove('dark-mode');
		} else {
			element.classList.add('dark-mode');
		}
	});

	var symbolContainer = document.getElementById('symbol-container');
	symbolContainer.innerHTML = (darkMode === 'enabled') ? '🔆' : '🌙';

	sessionStorage.setItem('darkMode', darkMode);
}

function toggleModel() {
	var models = document.getElementById('models');
	if (models.classList.contains("hidden")) {
		models.classList.remove("hidden");
		
		document.getElementById('options').classList.add('hidden');
		document.getElementById('slider').classList.add('hidden');
	} else {
		models.classList.add("hidden");
	}
}

function toggleOptions() {
	var options = document.getElementById('options');
	if (options.classList.contains("hidden")) {
		options.classList.remove("hidden");

		document.getElementById('models').classList.add('hidden');
	} else {
		options.classList.add("hidden");
		document.getElementById('slider').classList.add('hidden');
	}
}

function toggleDimensions() {
	var dimensions = document.getElementById('slider');
	dimensions.classList.toggle('hidden');
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

function parseIfInteger(text) {
	var parsedValue = parseInt(text, 10);
	if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
		return parsedValue;
	} 

	return -1;
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
		document.getElementById('prompt').value = '';
	}

	var negativePrompt = document.getElementById('negative-prompt').value.trim();
	if (negativePrompt !== '') {
		var negativePromptInput = document.createElement('input');
		negativePromptInput.setAttribute('type', 'text');
		negativePromptInput.setAttribute('name', 'NegativePrompt');
		negativePromptInput.setAttribute('value', negativePrompt);
		form.appendChild(negativePromptInput);
		document.getElementById('negative-prompt').value = '';
	}

	var steps = parseIfInteger(document.getElementById('steps-prompt').value.trim());
	if (steps !== -1) {
		var stepsInput = document.createElement('input');
		stepsInput.setAttribute('type', 'number');
		stepsInput.setAttribute('name', 'steps');
		stepsInput.setAttribute('value', steps);
		form.appendChild(stepsInput);
	}

	var seed = parseIfInteger(document.getElementById('seed-prompt').value.trim());
	if (seed !== -1) {
		var seedInput = document.createElement('input');
		seedInput.setAttribute('type', 'number');
		seedInput.setAttribute('name', 'seed');
		seedInput.setAttribute('value', seed);
		form.appendChild(seedInput);
	}

	var cfgScale = parseIfInteger(document.getElementById('cfg-scale-prompt').value.trim());
	if (cfgScale !== -1) {
		var cfgScaleInput = document.createElement('input');
		cfgScaleInput.setAttribute('type', 'number');
		cfgScaleInput.setAttribute('name', 'cfgScale');
		cfgScaleInput.setAttribute('value', cfgScale);
		form.appendChild(cfgScaleInput);
	}

	var samples = parseIfInteger(document.getElementById('samples-prompt').value.trim());
	if (samples !== -1) {
		var samplesInput = document.createElement('input');
		samplesInput.setAttribute('type', 'number');
		samplesInput.setAttribute('name', 'samples');
		samplesInput.setAttribute('value', samples);
		form.appendChild(samplesInput);
	}

	var sliderValue = parseInt(document.getElementById("range-slider").value);
	var width = possibleDimensions[sliderValue - 1].width;
	var height = possibleDimensions[sliderValue - 1].height;
	
	var widthInput = document.createElement('input');
	widthInput.setAttribute('type', 'number');
	widthInput.setAttribute('name', 'width');
	widthInput.setAttribute('value', width);
	form.appendChild(widthInput);

	var heightInput = document.createElement('input');
	heightInput.setAttribute('type', 'number');
	heightInput.setAttribute('name', 'height');
	heightInput.setAttribute('value', height);
	form.appendChild(heightInput);

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

function updateDimensionLabels() {
	var sliderValue = parseInt(document.getElementById("range-slider").value);
	
	document.getElementById('width-label').innerHTML = "Width: " + possibleDimensions[sliderValue - 1].width + "px";
	document.getElementById('height-label').innerHTML = "Height: " + possibleDimensions[sliderValue - 1].height + "px";
}

function resetOptions() {
	document.getElementById('samples-prompt').value = '';
	document.getElementById('cfg-scale-prompt').value = '';
	document.getElementById('steps-prompt').value = '';
	document.getElementById('seed-prompt').value = '';

	document.getElementById("range-slider").value = '5';
	updateDimensionLabels();
}