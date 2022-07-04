
function timeticks(inTime) {
    let ticksE = document.getElementById('ticks'), timeE = document.getElementById('time');
    let ticks = parseInt(ticksE.value), time = timeE.value.split(':');
    if (!inTime && isNaN(ticks))     return timeE.value = '';
    if ( inTime && time.length == 0) return ticksE.value = '';

    let secs = (inTime ? (time.length > 0 ? Number(time[time.length - 1]) : 0) : ((ticks / 60) % 60).toFixed(3));
    let mins = (inTime ? (time.length > 1 ? Number(time[time.length - 2]) : 0) : Math.floor(ticks / 3600) % 60);
    let hrs  = (inTime ? (time.length > 2 ? Number(time[time.length - 3]) : 0) : Math.floor(ticks / 216000));

    if (isNaN(secs) || isNaN(mins) || isNaN(hrs)) return false;
    ticks = Math.round(secs * 60) + mins * 3600 + hrs * 216000;
    time = secs.toString();
    if (mins > 0) time = mins + ':' + time.padStart(6, '0');
    if ( hrs > 0) time =  hrs + ':' + time.padStart(9, '0');

    if (inTime) ticksE.value = ticks;
    else timeE.value  = time;
}

function retickScript(txt, relative) {
	console.clear();
	// TODO: Destroy less of the script in this conversion

	// Remove block comments
	let script = '', inBlockComment = false;
	for (let i = 0; i < txt.length; i++) {
		if (txt[i] + txt[i + 1] == '/*') {
			inBlockComment = true;
			i++;
			continue;
		}
		if (txt[i] + txt[i + 1] == '*/') {
			inBlockComment = false;
			i++;
			continue;
		}
		if (!inBlockComment) script += txt[i];
	}

	script = script.split('\n').map(e => e.trim());
	
	// Remove line comments
	script = script.map(e => e.slice(0, ~e.indexOf('//') ? e.indexOf('//') : e.length))

	// Only framebulks
	script = script.filter(e => ~e.indexOf('>')).map(e => [e.slice(0, e.indexOf('>')), e.slice(e.indexOf('>'))]);
	
	let tick = undefined;

	for (let bulk of script) {
		if (bulk[0][0] == '+') {
			tick += Number(bulk[0].slice(1));
		} else {
			tick = Number(bulk[0]);
		}
		if (isNaN(tick)) tick = 0;
		bulk[0] = tick.toString();
	}

	if (relative) {
		tick = script[0][0];
		for (let bulk of script) {
			if (bulk[0] == tick) continue;
			let tmp = Number(bulk[0]);
			bulk[0] = '+' + (tmp - tick);
			tick = tmp;
		}
	}

	script = script.map(e => e.join('')).join('\n');
	
	return script;
}

function absoluteticks() {
	let txt = document.getElementById('absoluteticks').value;
	txt = retickScript(txt);
	document.getElementById('relativeticks').value = txt;
}

function relativeticks() {
	let txt = document.getElementById('relativeticks').value;
	txt = retickScript(txt, true);
	document.getElementById('absoluteticks').value = txt;
}
