String.prototype.padByDelim = function(d, tabWidth = 4) {
	var maxes = [];
	return this.split('\n').map(e => e.split(d)).map(e => {
		e = e.map(e => e.replaceAll('\t', ' '.repeat(tabWidth)));
		e.map((e, f, g) => 
			maxes[f] = maxes[f] ? Math.max(maxes[f], e.length) : e.length
		);
		return e;
	}).map(e => 
		2 > e.length ? e : e.map((e, f, g) => 
			f % 2 == 0 ? ' '.repeat(0 < f ? maxes[f - 1] - g[f - 1].length : 0) + e + ' '.repeat(maxes[f] - e.length) : e
		).join(d)
	).join('\n');
}

String.prototype.encases = function(s, e) {
	return this.startsWith(s) && this.endsWith(e);
}

String.prototype.replaceEvery = function(s, r = '') {
	let string = this.valueOf();
	if (~r.indexOf(s)) return string;
	while (~string.indexOf(s)) string = string.replaceAll(s, r);
	return string;
}

String.prototype.clip = function() {
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
	let a = [...this].sort(), b = [], t = a[0], c = 0;
	a.map(e => {
		if (e == t) {
			c++;
		} else {
			b.push([t, c]);
			c = 1;
		}
		t = e;
	});
	b.push([t, c]);
	return b.sort((a, b) => b[1] - a[1]);
}

Array.prototype.chunkify = function(s) {
	if (0 >= s || isNaN(s)) return this;
	let c = [];
	while (this.length) c.push(this.splice(0, s));
	return c;
}

Array.prototype.last = function() {
	return this[this.length - 1];
}

Array.prototype.insert = function(i, e) {
    this.splice(i, 0, e);
};

function formatBytes(a, b = 2, k = true) {
	// Modified version of https://stackoverflow.com/a/18650828
	with (Math) {
		let d = floor(log(abs(a)) / log(1000 + k * 24));
		if (1 > d) return a + ' Byte' + (1 == a ? '' : 's');
		return parseFloat((a / pow(1000 + k * 24, d)).toFixed(max(0, b))) + ' ' + (k ? ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi'] : ['k', 'm', 'g', 't', 'p', 'e', 'z', 'y'])[d - 1] + 'B';
	}
}

HTMLElement.prototype.allowTab = function() {
	this.addEventListener('keydown', function(e) {
		// https://stackoverflow.com/a/6637396
		if (e.key == 'Tab') {
			e.preventDefault();
			with (this) {
				var start = selectionStart;
				value = value.slice(0, start) + '\t' + value.slice(selectionEnd);
				selectionStart = selectionEnd = ++start;
			}
		}
	});
}

HTMLElement.prototype.removeAllChildNodes = function() {
	while (this.firstChild) this.removeChild(this.firstChild);
}

let getParentFolder = u => {
	// https://stackoverflow.com/a/33858730
	u = u || window.location.href;
	u = u.lastIndexOf('/') == (u.length - 1) ? u.slice(0, -1) : u.slice(0, u.lastIndexOf('/'));
	return u.slice(++u.lastIndexOf('/'));
}

const queryAPI = (url, g = r => r.text()) => new Promise((res, fail) => {
	// by default, read as text
	let f = e => fetch(e, {cache: "no-cache", mode: "no-cors"}).then(g).catch(err => fail(err));
	typeof url == "string"
		? f(url).then(r => res(r))
		: Promise.all(url.map(f)).then(r => res(r));
});

const hsvToRgb = (h = 0, s = 1, v = 0.5) => {
	// h, s, v in [0, 1]
	// r, g, b in [0, 255]
    let r, g, b;
    if (s === 0) {
        r = g = b = v; // achromatic
    } else {
        var f = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let q = v < 0.5 ? v * (1 + s) : v + s - v * s;
        let p = 2 * v - q;
        r = f(p, q, h + 1/3);
        g = f(p, q, h);
        b = f(p, q, h - 1/3);
    }
	let i = f => Math.floor(255 * f + 0.5);
    return [i(r), i(g), i(b)];
}

const delay = ms => new Promise(res => setTimeout(res, ms));
