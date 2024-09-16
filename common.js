const setTheme = (theme) => {
	theme ??= localStorage.theme ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light');
	document.documentElement.dataset.theme = theme;
	localStorage.theme = theme;
}
setTheme();

window.addEventListener('load', () => {
	const darkModeToggle = document.getElementById('dark-mode-toggle');
	if (darkModeToggle) {
		darkModeToggle.addEventListener('click', () => {
			let dark = document.documentElement.dataset.theme === 'dark';
			setTheme(dark ? 'light' : 'dark');
			darkModeToggle.classList.toggle('fa-moon', dark);
			darkModeToggle.classList.toggle('fa-sun', !dark);
		});
		darkModeToggle.click();
		darkModeToggle.click();
	}

	const github = document.getElementById('github-link');
	if (github) {
		github.href = 'https://github.com/ThisAMJ/thisamj.github.io/tree/main' + location.pathname;
	}

	// If the HTML doesn't contain these, create them as a fallback
	// This will cause a slight flicker, but it's better than nothing
	const shadow = document.getElementById('shadow');
	if (!shadow) {
		document.body.insertBefore(document.createElement('div'), document.body.firstChild).id = 'shadow';
	}
	const background = document.getElementById('background');
	if (!background) {
		document.body.insertBefore(document.createElement('div'), document.body.firstChild).id = 'background';
	}

});
