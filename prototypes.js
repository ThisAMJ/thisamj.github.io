String.prototype.padByDelim = function(d) {
	var out = [], maxes = [], split = this.split('\n').map(e => e.split(d)), i, k;
	split.forEach(e => {
		if (e.length < 2) return;
		for (i = 0; i < e.length; i++) {
			k = i > e.length - 1 ? 0 : e[i].length;
			maxes[i] = maxes[i] ? Math.max(maxes[i], k) : k;
		}
	});
	split.forEach(e => {
		if (e.length < 2) return out = out.concat(e);
		for (i = 0; i < e.length; i += 2) {
			e[i] = ' '.repeat(i > 0 ? maxes[i - 1] - e[i - 1].length : 0) + e[i] + ' '.repeat(maxes[i] - e[i].length);
		}
		out.push(e.join(d));
	});
	return out.join('\n');
}

String.prototype.encases = function(s, e) {
	return this.startsWith(s) && this.endsWith(e);
}

String.prototype.replaceEvery = function(s, r = '') {
	let string = this.valueOf();
	if (r.indexOf(s) > -1) return string;
	while (string.indexOf(s) > -1) string = string.replaceAll(s,r);
	return string;
}

String.prototype.clip = function() {
	// Use navigator function
	navigator.clipboard.writeText(this.valueOf()).catch(e => {
		// If it fails, fallback to old method
		with (document) {
			let dummy = createElement('textarea');
			body.appendChild(dummy);
			dummy.value = this.valueOf();
			dummy.select();
			execCommand('copy');
			body.removeChild(dummy);
		}
	});
}

Array.prototype.sortByOccurrences = function() {
	// sort a alphabetically so occurrences are adjacent
	// ES6 copy to avoid mutation of input
	let a = [...this].sort(), b = [], t = a[0], count = 0;

	for (let i = 0; i < a.length + 1; i++) {
		if (a[i] == t) {
			count++;
		} else {
			b.push([t, count]);
			count = 1;
		}
		t = a[i];
	}
	return b.sort((a, b) => b[1] - a[1]); // most common first
}

function formatBytes(a, b = 2, k = true) {
	// Modified version of https://stackoverflow.com/a/18650828/13192876
	with (Math) {
		let d = floor(log(a) / log(1000 + k * 24));
		if (d < 1) return a + ' Byte' + (a == 1 ? '' : 's');
		let s = k ? ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'] : ['kB','mB','gB','tB','pB','eB','zB','yB'];
		return parseFloat((a / pow(1000 + k * 24, d)).toFixed(max(0, b))) + ' ' + s[d - 1];
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
