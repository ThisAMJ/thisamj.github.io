if (typeof src !== 'object') console.error('Source.js not loaded!');

const q = e => document.getElementById(e);


function changeTab(side, to) {
	let eles = document.getElementsByClassName(`content-tab-${side}`);
	for (let ele of eles) {
		ele.hidden = !(ele.id === `content-tab-${side}-${to}`);
	}
	
	let btns = document.getElementsByClassName(`nav-btn-${side}`);
	for (let ele of btns) {
		ele.classList[(ele.id === `nav-btn-${side}-${to}`) ? 'add' : 'remove']('content-tab-selected');
	}
	
	localStorage.setItem(`${side}Tab`, to);
}

function changeGame(live = true) {
	if (!live) q('game-select').value = localStorage.getItem('game') || 'portal2';
	src.game.change(q('game-select').value);
	localStorage.setItem('game', q('game-select').value);
}

function bindKeyPress(event, down) {
	src.key.keyPress(event, down);
	q('bindarea').value = src.key.list.pressed.join(' ');
}

function selectExample() {
	let example = q('cfg-example').value;
	if (example >= 0) {
		examples[example].run();
	}
}

// TODO: Tab/arrow keys autocomplete
function consoleKeyPress(ev, down) {
	if (down) {
		switch (ev.key) {
			case 'Enter':
				ev.preventDefault();
				src.con.enterCommand(q('liveconsole').value);
				q('liveconsole').value = '';
				q('console').scrollTop = q('console').scrollHeight;
				break;
			case 'Tab':
				ev.preventDefault();
				q('liveconsole').value = q('liveconsole').value.replace(/\t/g, '');
		}
	} else {
		q('liveconsole').value = q('liveconsole').value.replace(/\t/g, '');
	}

	// q('console-autocomplete').value = q('liveconsole').value + ' hello';
	// if (q('liveconsole').value == '') q('console-autocomplete').value = '';
	dispAutocompletions();
}

function dispAutocompletions() {
	let completions = src.con.autocomplete(q('liveconsole').value);
	completions = completions.slice(0, 5);
	document.getElementById('console-autocomplete').removeAllChildNodes();
	for (let completion of completions) {
		let div = document.createElement('div');
		div.innerText = completion;
		document.getElementById('console-autocomplete').appendChild(div);
	}
}

let viewedCFG = null;
function newCFG() {
	let name = prompt('CFG Name', 'autoexec').toLowerCase();
	addCFG(name, src.cfg.cfgs[name] || '');
	viewCFG(name);
}

src.cfg.set = function(name, value = '') {
	addCFG(name, value)
}

function addCFG(name, value) {
	src.cfg.cfgs[name] = value;
	for (let child of q('cfg-tabs').childNodes) {
		if (child.innerText === name) return;
	}
	let btn = document.createElement('button');
	btn.onclick = function() {
		viewCFG(name);
	}
	btn.innerText = name;
	btn.classList.add('cfg-tab');
	q('cfg-tabs').appendChild(btn);
	q('remove-cfg').hidden = false;
	saveCFG();

	if (q('cfg-tabs').childElementCount == 1) {
		viewCFG(name)
	}
}

function editCFG() {
	if (viewedCFG === null) {
		addCFG('autoexec', '');
	}
	src.cfg.set(viewedCFG, q('cfg-content').innerText);
	saveCFG();
}

src.cfg.remove = function(name) {
	let tabs = q('cfg-tabs');
	if (src.cfg.cfgs.hasOwnProperty(name)) {
		for (let child of tabs.childNodes) {
			if (child.innerText === name) {
				tabs.removeChild(child);
				break;
			}
		}
	}
	delete src.cfg.cfgs[name];
	saveCFG();

	if (name == viewedCFG && tabs.firstChild) {
		viewCFG(tabs.firstChild.innerText);
	}
	if (!tabs.firstChild) {
		viewedCFG = null;
		q('cfg-content').innerText = '';
		q('remove-cfg').hidden = true;
	}
}

function removeCFG() {
	src.cfg.remove(viewedCFG);
}

function viewCFG(name) {
	if (src.cfg.cfgs.hasOwnProperty(name)) {
		viewedCFG = name;
		q('cfg-content').innerText = src.cfg.get(name);
		
		for (let child of q('cfg-tabs').childNodes) {
			child.classList[child.innerText === name ? 'add' : 'remove']('cfg-tab-selected');
		}
	
		return localStorage.setItem('cfgView', viewedCFG);
	}
}

function saveCFG() {
	localStorage.setItem('cfgs', JSON.stringify(src.cfg.cfgs))
}

function runSelected() {
	src.cmd.executeCommand('exec ' + viewedCFG);
}

window.addEventListener('load', async function() {
	src.plugin.hook('sar', function() {
		sar.hud.output = q('sar-hud');
	});
	src.con.output = q('console');
	
	q('liveconsole').allowTab()
	q('cfg-content').allowTab();
	
	let cfgs = JSON.parse(localStorage.getItem('cfgs') || '{}');
	for (let cfg of Object.keys(cfgs)) {
		addCFG(cfg, cfgs[cfg]);
	}
	viewCFG(localStorage.getItem('cfgView') || 'autoexec');
	
	changeGame(false);
	changeTab('left',  localStorage.getItem('leftTab')  || 'cfg');
	changeTab('right', localStorage.getItem('rightTab') || 'con');
	
	let params = new URLSearchParams(window.location.search);
	if (params.has('example')) {
		if (examples[params.get('example')]) examples[params.get('example')].run();
	}
});


src.tick.call = function() {
	if (src.tick.last !== null) {
		document.getElementById('stats-ticktime').innerText = (Date.now() - src.tick.last).toString() + "ms per tick";
	}
	src.tick.last = Date.now();
	src.tick.__call();
	requestAnimationFrame(src.tick.call);
}
