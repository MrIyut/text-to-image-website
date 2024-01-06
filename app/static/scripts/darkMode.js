function toggleColor() {
	const elementsToToggle = document.querySelectorAll('.dark-mode-toggle');

	// Toggle dark mode class on each element
	elementsToToggle.forEach(element => {
		element.classList.toggle('dark-mode');
	});

	var symbolContainer = document.getElementById('symbolContainer');
	symbolContainer.innerHTML = (symbolContainer.innerHTML === '🌙') ? '🔆' : '🌙';
}