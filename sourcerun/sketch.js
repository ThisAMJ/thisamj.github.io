if (typeof src != 'object') console.error('Source.js not loaded!');

const q = e => document.getElementById(e);
const con = src.con;

function changeTab(left, to) {
	left = left ? 'left' : 'right';
	let eles = document.getElementsByClassName('content-tab-' + left);
	let btns = document.getElementsByClassName('btn-' + left);
	for (let ele of eles) {
		ele.hidden = ele.id == left + '-' + to ? false : true;
	}
	for (let ele of btns) {
		(ele.id == 'btn-' + left + '-' + to) ? ele.classList.add('content-tab-selected') : ele.classList.remove('content-tab-selected');
	}
	localStorage.setItem(left + 'Tab', to);
}

function changeGame(live = true) {
	if (!live) q('game-select').value = localStorage.getItem('game') || 'portal2';
	src.changeGame(q('game-select').value);
	localStorage.setItem('game', q('game-select').value);
}

let keys = [];
let keyDisplay = ' 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9 / * - + Enter . [ ] ; \' ` , . / \\ - = \u23CE Space \u232B Tab \u21EA  Esc   \u2326 Home End PgUp PgDn  LShift RShift LAlt RAlt LCtrl RCtrl LMeta RMeta  \u2191 \u2190 \u2193 \u2192 F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12       '.split(' ');
function keyDown(ev) {
	ev.preventDefault();
	ev.altKey = false;
	ev.ctrlKey = false;
	ev.shiftKey = false;
	if (ev.repeat) return;
	src.keyDown(ev);
	if (!~src.__.htmlKeys.indexOf(ev.code)) return;
	keys.push(keyDisplay[src.__.htmlKeys.indexOf(ev.code)]);
	keys.sort();
	q('bindarea').value = keys.filter(e => e.length > 0).join(' ');
}

function keyUp(ev) {
	ev.preventDefault();
	if (ev.repeat) return;
	src.keyUp(ev);
	if (!~src.__.htmlKeys.indexOf(ev.code)) return;
	keys = keys.filter(e => e != keyDisplay[src.__.htmlKeys.indexOf(ev.code)]);
	q('bindarea').value = keys.filter(e => e.length > 0).join(' ');
}

// TODO: make this better lmao
window.addEventListener('load', () => q('liveconsole').allowTab());
let autocompleteseek = 0;
let autocompleteseeking = false;
function consoleType(ev) {
	let completions
	switch (ev.key) {
		case 'Enter':
			ev.preventDefault();
			src.con.enterCommand(q('liveconsole').value);
			autocompleteseek = 0;
			q('liveconsole').value = '';
			q('console').scrollTop = q('console').scrollHeight;
			dispAutocompletions();
			break;
		case 'ArrowUp':
			ev.preventDefault();
			autocompleteseek--;
			completions = src.con.autocomplete_all(q('liveconsole').value);
			if (autocompleteseek < 0) autocompleteseek += completions.length;
			q('liveconsole').value
			dispAutocompletions();
			break;
		case 'ArrowDown':
			ev.preventDefault();
			autocompleteseek++;
			completions = src.con.autocomplete_all(q('liveconsole').value);
			if (autocompleteseek > completions.length) autocompleteseek = 0;
			dispAutocompletions();
			break;
		case 'Tab':
			ev.preventDefault();
			q('liveconsole').value = src.con.autocomplete_all(q('liveconsole').value)[autocompleteseek];
			autocompleteseek = 0;
			dispAutocompletions();
			break;
	}
}

function consoleTypeAfter() {
	q('liveconsole').value = q('liveconsole').value.replace(/\t/g, '');
	dispAutocompletions();
}

function dispAutocompletions(completions = undefined) {
	if (!completions) completions = src.con.autocomplete(q('liveconsole').value, autocompleteseek - 7, 7);
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

function addCFG(name, content) {
	src.cfg.cfgs[name] = content;
	for (let child of q('cfg-tabs').childNodes) {
		if (child.innerText == name) return;
	}
	let btn = document.createElement('button');
	btn.onclick = function() {
		viewCFG(name);
	}
	btn.innerText = name;
	btn.classList.add('cfg-tabs');
	q('cfg-tabs').appendChild(btn);
	q('remove-cfg').hidden = false;
	if (viewedCFG == name) viewCFG(name);
	saveCFG();
}

function removeCFG() {
	if (src.cfg.cfgs[viewedCFG]) {
		delete src.cfg.cfgs[viewedCFG];
		saveCFG();
	}
}

function saveCFG() {
	localStorage.setItem('cfgs', JSON.stringify(src.cfg.cfgs))
}

function editCFG() {
	src.cfg.cfgs[viewedCFG] = q('cfg-content').innerText;
	saveCFG();
}

function viewCFG(name) {
	viewedCFG = name;
	q('cfg-content').innerText = src.cfg.get(name);
	
	let btns = document.getElementsByClassName('cfg-tabs');
	for (let ele of btns) {
		(ele.innerText == name) ? ele.classList.add('cfg-tab-selected') : ele.classList.remove('cfg-tab-selected');
	}
}

window.addEventListener('load', async function() {
	src.hookPluginLoad('sar', function() {
		// Connect to SAR hud HTML etc
		sar.hud.output = q('sar-hud');
	});
	src.con.output = q('console');
	
	q('cfg-content').allowTab();
	let cfgs = JSON.parse(localStorage.getItem('cfgs') || '{}');
	for (let cfg of Object.keys(cfgs)) {
		addCFG(cfg, cfgs[cfg]);
	}
	viewCFG('autoexec');
	q('remove-cfg').hidden = true;
	
	changeGame(false);
	changeTab(true,  localStorage.getItem('leftTab')  || 'cfg');
	changeTab(false, localStorage.getItem('rightTab') || 'con');
});

// function clearAllData() {
	// con.clear();
	// sar.texts = [];
	// for (let cmd of [...sar.aliases, ...sar.functions]) {
		// src.unregister(cmd)
	// }
	// sar.aliases = [];
	// sar.functions = [];
	// // TODO: Fix redeclaration of const sar
	// // src.plugins = [];
	// src.cmd.executeCommand('unbindall');
	// src.onTickEvents = {pre: [], post: []};
	// src.cmd.buffer = [];
// }
