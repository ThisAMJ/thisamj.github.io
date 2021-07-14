String.prototype.padByDelim = function(d) {
	var maxes = [];
	return this.split('\n').map(e => e.split(d)).map(e => {
		e.map((e, f, g) => 
			maxes[f] = maxes[f] ? Math.max(maxes[f], e.length) : e.length
		);
		return e;
	}).map(e => 
		e.length < 2 ? e : e.map((e, f, g) => 
			f % 2 == 0 ? ' '.repeat(f > 0 ? maxes[f - 1] - g[f - 1].length : 0) + e + ' '.repeat(maxes[f] - e.length) : e
		).join(d)
	).join('\n');
}

String.prototype.encases = function(s, e) {
	return this.startsWith(s) && this.endsWith(e);
}

String.prototype.replaceEvery = function(s, r = '') {
	let string = this.valueOf();
	if (r.indexOf(s) > -1) return string;
	while (string.indexOf(s) > -1) string = string.replaceAll(s, r);
	return string;
}

String.prototype.clip = function() {
	// Use navigator function
	navigator.clipboard.writeText(this.valueOf()).catch(e => {
		// If it fails, fallback to old method
		with (document) {
			let f = createElement('textarea');
			body.appendChild(f);
			f.value = this.valueOf();
			f.select();
			execCommand('copy');
			body.removeChild(f);
		}
	});
}

Array.prototype.sortByOccurrences = function() {
	// sort a alphabetically so occurrences are adjacent
	// ES6 copy to avoid mutation of input
	let a = [...this].sort(), b = [], t = a[0], count = 0;
	a.map(e => {
		if (e == t) {
			count++;
		} else {
			b.push([t, count]);
			count = 1;
		}
		t = e;
	});
	b.push([t, count]);
	return b.sort((a, b) => b[1] - a[1]); // most common first
}

function formatBytes(a, b = 2, k = true) {
	// Modified version of https://stackoverflow.com/a/18650828/13192876
	with (Math) {
		let d = floor(log(a) / log(1000 + k * 24));
		if (d < 1) return a + ' Byte' + (a == 1 ? '' : 's');
		let s = k ? ['Ki','Mi','Gi','Ti','Pi','Ei','Zi','Yi'] : ['k','m','g','t','p','e','z','y'];
		return parseFloat((a / pow(1000 + k * 24, d)).toFixed(max(0, b))) + ' ' + s[d - 1] + 'B';
	}
}

const queryAPI = url => new Promise((res, rej) => {
	// thank you https://stackoverflow.com/a/48969580/13192876
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = function() {
		with (this) {
			if (readyState == 4 && status == 200) {
				res(response);
			} else {
				if (status == 404) res('404 NOT FOUND');
				rej({
					status: status,
					statusText: xhr.statusText
				});
			}
		}
	}
	xhr.onerror = function() {
		rej({
			status: this.status,
			statusText: xhr.statusText
		});
	}
	xhr.send();
});

const delay = ms => new Promise(res => setTimeout(res, ms));
