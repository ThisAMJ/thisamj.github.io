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
	let toggleconsolekey = src.key.binds.find(e => e.cmd === 'toggleconsole').key;
	if (toggleconsolekey) {
		q('bindarea').value = src.key.list.pressed.filter(pressed => toggleconsolekey !== pressed).join(' ');
		if (toggleconsolekey === event.key) {
			event.preventDefault();
			if (down) {
				q('liveconsole').focus();
			}
		}
	}
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
		let toggleconsolekey = src.key.binds.find(e => e.cmd === 'toggleconsole')
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
				break;
		}
		if (toggleconsolekey && ev.key === toggleconsolekey.key) {
			ev.preventDefault();
			q('liveconsole').value = q('liveconsole').value.replaceAll(toggleconsolekey, '');
			q('bindarea').focus();
			dispAutocompletions();
			return;
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
	if (document.activeElement !== q('liveconsole')) return;
	for (let completion of completions) {
		let div = document.createElement('div');
		div.innerText = completion;
		document.getElementById('console-autocomplete').appendChild(div);
	}
}

let viewedCFG = null;
function newCFG() {
	let name = prompt('CFG Name', 'autoexec').toLowerCase();
	if (name !== '') {
		addCFG(name, src.cfg.cfgs[name] || '');
		viewCFG(name);
	}
}

src.cfg.set = function(name, value = '') {
	addCFG(name, value);
}

function addCFG(name, value, init = false) {
	name = name.replaceAll('.cfg', '').toLowerCase();
	src.cfg.cfgs[name] = value;
	saveCFG();
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
	q('remove-all-cfgs').hidden = false;

	if (q('cfg-tabs').childElementCount == 1 && !init) {
		viewCFG(name)
	}
}

async function cfgDrop(event) {
	let decoder = new TextDecoder();
	event.preventDefault();
	if (event.dataTransfer.items) {
		[...event.dataTransfer.items].forEach((item) => {
			if (item.kind === 'file') {
				let file = item.getAsFile();
				if (file.size != 0) {
					readFile(file);
				}
			}
		})
	}
	q('cfg-drop').classList.remove('dragging')
}

async function readFile(fileinfo, arrayBuffer = 0) {
	if (arrayBuffer == 0) arrayBuffer = await fileinfo.arrayBuffer();
	let decoder = new TextDecoder();
	if (fileinfo.type == 'application/zip' || fileinfo.name.endsWith('.zip')) {
		JSZip.loadAsync(arrayBuffer).then(e => {
			for (let fileinfo of Object.values(e.files)) {
				if (fileinfo.dir) continue;
				while (fileinfo.name.startsWith('cfg/')) fileinfo.name = fileinfo.name.slice(4);
				if (fileinfo.name.startsWith('mtriggers/')) continue; // Skip mtriggers for now, if tree view implemented don't.
				if (fileinfo.name.endsWith('.cfg')) {
					fileinfo.async("string").then(e => {
						addCFG(fileinfo.name, e);
					})
				}
			}
		})
	} else if (fileinfo.name.endsWith('.cfg')) {
		addCFG(fileinfo.name, decoder.decode(arrayBuffer));
	}
}

function cfgDragOver(event) {
	event.preventDefault();
	q('cfg-drop').classList.add('dragging')
}

function cfgDragLeave(event) {
	event.preventDefault();
	q('cfg-drop').classList.remove('dragging')
}

function editCFG() {
	if (viewedCFG === null) {
		addCFG('autoexec', '');
	}
	src.cfg.set(viewedCFG, q('cfg-content').value);
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
		q('cfg-content').value = '';
		q('remove-cfg').hidden = true;
		q('remove-all-cfgs').hidden = true;
	}
}

function removeCFG() {
	src.cfg.remove(viewedCFG);
}

function removeAllCFGs() {
	src.cmd.executeCommand('__deleteallcfgs');
}

function exportCFGs() {
	if (Object.keys(src.cfg.cfgs).length == 0) return;
	let zip = new JSZip();
	for (let cfg in src.cfg.cfgs) {
		zip.file(`cfg/${cfg}.cfg`, src.cfg.cfgs[cfg]);
	}
	zip.generateAsync({type:"blob"}).then(function(content) {
		saveAs(content, "cfg.zip");
	});
}

function viewCFG(name) {
	name = name.replaceAll('.cfg', '').toLowerCase()
	if (src.cfg.cfgs.hasOwnProperty(name)) {
		viewedCFG = name;
		q('cfg-content').value = src.cfg.get(name);
		
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
	
	src.cmd.getConvar('toggleconsole').callback = function(args) {
		if (document.activeElement === q('bindarea')) {
			q('liveconsole').focus();
		} else {
			q('bindarea').focus();
			dispAutocompletions();
			return;
		}
	}
	
	q('liveconsole').allowTab()
	q('cfg-content').allowTab();
	
	let cfgs = JSON.parse(localStorage.getItem('cfgs') || '{}');
	for (let cfg of Object.keys(cfgs)) {
		addCFG(cfg, cfgs[cfg], true);
	}
	viewCFG(localStorage.getItem('cfgView') || 'autoexec');
	
	changeGame(false);
	changeTab('left',  localStorage.getItem('leftTab')  || 'cfg');
	changeTab('right', localStorage.getItem('rightTab') || 'con');
	
	let params = new URLSearchParams(window.location.search);
	if (params.has('example')) {
		let example = examples.find(e => e.name === params.get('example'));
		if (example) example.run();
	}
	params.delete('example');
	window.history.replaceState('', '', `${location.protocol}//${location.host}${location.pathname}${params.toString() === '' ? '' : ('?' + params.toString())}`);
});


src.tick.call = function() {
	if (src.tick.last !== null) {
		document.getElementById('stats-ticktime').innerText = (Date.now() - src.tick.last).toString() + "ms per tick";
	}
	src.tick.last = Date.now();
	src.tick.__call();
	requestAnimationFrame(src.tick.call);
}
