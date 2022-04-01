const q = e => document.getElementById(e);
const con = src.con;

function clearAllData() {
	con.clear();
	sar.texts = [];
	sar.aliases = [];
	sar.functions = [];
	// TODO: Fix redeclaration of const sar
	// src.plugins = [];
	src.binds = [];
	src.onTickEvents = [];
	src.cmd.buffer = [];
}

function run(file) {
	profiling = [];
	src.con.clear();
	src.cmd.executeCommand(`exec "${file.replaceAll('"', '')}"`);
}

function newCFG() {
	let name = prompt('CFG name?');
	if (name != null) src.cfg.add(name, true);
}

function changeGame() {
	game = q('gameSelect').value;
}

let liveconsolehistory = [];
let liveconsolefuture = [];
function liveConsoleType(event) {
	let val
	switch (event.key) {
		case 'Enter':
			event.preventDefault();
			src.con.enterCommand(q('liveconsole').value);
			liveconsolehistory = [...liveconsolehistory, ...liveconsolefuture, q('liveconsole').value].slice(-256);
			liveconsolefuture = [];
			q('liveconsole').value = '';
			q('console').scrollTop = q('console').scrollHeight;
			break;
		case 'ArrowUp':
			event.preventDefault();
			if (liveconsolehistory.length > 0) {
				liveconsolefuture.push(q('liveconsole').value);
				q('liveconsole').value = liveconsolehistory.pop();
			}
			break;
		case 'ArrowDown':
			event.preventDefault();
			val = q('liveconsole').value;
			if (liveconsolefuture.length > 0 && val.trim() != '') {
				liveconsolehistory.push(val);
				val = liveconsolefuture.pop();
			}
			q('liveconsole').value = val;
	}
}

let game = 'other';

// console.log([...sar.aliases, ...sar.functions].map(e => e.name).sort().join('\n'))

window.addEventListener('load', async function() {
	src.con.output = q('console');
	src.cmd.executeCommand('plugin_load sar');
	setTimeout(function() {
		sar.textOutputs.push(q('texts'));
		let s = document.createElement('script');
		s.src = 'examples/tetris.js'
		document.body.appendChild(s);
	}, 300);
	changeGame();
	let fetchghub = async (repo, filepath, out = '') => {
		if (!out) out = filepath;
		await queryAPI(`https://raw.githubusercontent.com/${repo}/master/${filepath}`).then(e => {
			src.cfg.add(out.replace('.cfg', ''), false, e)
		})
	}
	let fetchsrconfigs = async (filename) => {
		filename = filename.replace('.cfg', '');
		await fetchghub('p2sr/srconfigs', filename + '.cfg').then(e => {
			src.cfg.add(filename, false, e);
		});
	};

	// await fetchsrconfigs('autoexec');
	// await fetchsrconfigs('aliases');
	// await fetchsrconfigs('cm_ghost');

	// await fetchghub('p2sr/portal2-mtriggers', 'mtriggers.cfg', 'mtriggers/mtriggers');
	// await fetchsrconfigs('chapter_cats/portal2');
	// await fetchsrconfigs('cats/fullgame');
	// await fetchsrconfigs('con_filter');
	// await fetchsrconfigs('extra');

	// await fetchghub('ThisAMJ/SARtris', 'tetris.cfg', 'minigames/tetris/tetris')
	// await fetchghub('ThisAMJ/SARtris', 'runonce.cfg', 'minigames/tetris/runonce')
	// await fetchghub('ThisAMJ/SARtris', 'display.cfg', 'minigames/tetris/display')
	// await fetchghub('ThisAMJ/SARtris', 'tetrominoes.cfg', 'minigames/tetris/tetrominoes')
	// await fetchghub('ThisAMJ/SARtris', 'util.cfg', 'minigames/tetris/util')
});
