const q = e => document.getElementById(e);

function clearAllData() {
	texts = [];
	aliases = [];
	functions = [];
	con.clear();
}

const con = {
	txt: [],
	
	debugLevel: Infinity,

	historyCount: 512,
	
	log: function(txt, debugLevel = 0, color = '#FFFFFF') {
		if (this.debugLevel >= debugLevel) {
			this.txt.push(`<p style="color:${color}">${txt}</p>`);
			this.txt = this.txt.slice(-this.historyCount);
			q('console').innerHTML = this.txt.join('');
			q('console').scrollTop = q('console').scrollHeight;
		}
	},
	
	warn: function(txt, debugLevel = 0, color = '#FFFF55') {
		if (this.debugLevel >= debugLevel) {
			this.txt.push(`<p style="color:${color}">${txt}</p>`);
			this.txt = this.txt.slice(-this.historyCount);
			q('console').innerHTML = this.txt.join('');
			q('console').scrollTop = q('console').scrollHeight;
		}
	},
	
	err: function(txt, debugLevel = 0, color = '#FF5555') {
		if (this.debugLevel >= debugLevel) {
			if (this.debugLevel >= 3) this.txt.push(trace.map((e, f) => `<p style="color:${color}">Stack ${f - 5} : ${e}</p>`).join(''))
			this.txt.push(`<p style="color:${color}">${txt}</p>`);
			this.txt = this.txt.slice(-this.historyCount);
			q('console').innerHTML = this.txt.join('');
			q('console').scrollTop = q('console').scrollHeight;
		}
	},
	
	clear: function() {
		this.txt = [];
		q('console').innerHTML = '';
	}
}

const cfg = {
	currentView: '',
	
	cfgs: [],
	
	view: function(name) {
		let tabcontents = document.getElementsByClassName('tabcontent'), tablinks = document.getElementsByClassName('tablinks');
		for (let ele of tabcontents) {
			ele.style.display = ele.id == `tabcontents${name}` ? 'block' : 'none';
		}
		for (let ele of tablinks) {
			ele.className = name == ele.innerHTML ? ele.className + ' active' : ele.className.replaceAll(' active', '');
		}
		this.currentView = name;
	},
	
	get: function(name) {
		if (!q(`tabcontents${name}`)) {
			return null;
		}
		return q(`tabcontents${name}`).value;
	},
	
	add: function(name, switchTo = false, value = '') {
		let origname = name;
		name = name.replaceAll('"', '').replaceAll("'", '');
		if (name.length == 0 || name.startsWith('/')) {
			
		} else if (this.cfgs.indexOf(name) > -1) {
			
		} else {
			this.cfgs.push(name);
			q('tab').innerHTML += `<button class="tablinks" onclick="cfg.view('${name}')">${name}</button>`;
			let ele = document.createElement('textarea');
			ele.id = `tabcontents${name}`;
			ele.className = 'tabcontent';
			ele.value = value;
			q('tabcontents').appendChild(ele);
			if (switchTo) this.view(name);
		}
	},
}

function drawTexts() {
	q('texts').innerHTML = '';
	let txts = texts.filter(e => e.shown).sort((a, b) => {a.id - b.id});
	for (let i = 0; i < txts.length; i++) {
		q('texts').innerHTML += '<p>';
		
		let txt = '';
		for (let j = 0; j < texts[i].txt.length; j++) {
			if (texts[i].txt[j] == '#') {
				if (texts[i].txt[j + 1] == '#') {
					txt += '#';
					j++;
					continue;
				}
				let next6 = texts[i].txt.slice(j + 1, j + 7);
				if (!next6.split('').some(e => '0123456789ABCDEF'.indexOf(e) == -1)) {
					// the next 6 characters are hex-worthy
					txt += `<span style="color:#${next6}">`;
					j += 6;
					continue;
				}
			}
			txt += texts[i].txt[j];
		}
		
		q('texts').innerHTML += txt + '</p>';
	}
}

/*
	debugLevel
	0 - Minimal debugging information
	1 - Above + SAR functions and aliases debugging
	2 - Above + Command Parsing debug
	3 - Above + Error Stack Trace
*/

function run(file) {
	con.clear();
	execute(['exec', file]);
}

function execute(args) {
	trace.push(args.join(' '));
	trace = trace.slice(-5);
	let existing = aliases.find(e => e.name == args[0]), command = '', name = '', val = '', txt = '';
	if (existing) {
		execute([...source.getCommandArgs(existing.command)[0], ...args.slice(1)])
		return;
	}
	existing = functions.find(e => e.name == args[0]);
	if (existing) {
		cbuf = [...source.getCommandArgs(source.expand(existing.command, args.slice(1), svars).out), ...cbuf];
		return;
	}

	if (['sar_update', 'sar_disable_coop_score_hud', 'sar_disable_no_focus_sleep', 'r_portal_use_pvs_optimization', 'r_portal_fastpath', 'r_PortalTestEnts', 'save_screenshot', 'contimes', 'phys_penetration_error_time', 'gameinstructor_enable', 'svar_persist', 'svar_no_persist', 'sar_autorecord', 'sar_speedrun_offset', 'sar_speedrun_category', 'sar_speedrun_time_pauses', 'sar_speedrun_smartsplit', 'sar_speedrun_autostop', 'sar_challenge_autostop', 'sar_record_at_demo_name', 'sar_record_prefix', 'sar_record_at', 'sar_fast_load_preset', 'sar_cm_rightwarp', 'developer', 'fps_max', 'sensitivity', 'sar_hud_order_bottom', 'sar_hud_font_index', 'sar_hud_x', 'sar_hud_y', 'sar_hud_spacing', 'sar_hud_bg', 'sar_hud_velocity', 'sar_hud_velocity', 'sar_hud_position', 'sar_hud_angles', 'sar_on_exit', 'sar_on_load', 'sar_on_flags', 'sar_on_coop_reset_remote', 'sar_on_coop_reset_done', 'sar_on_coop_spawn'].some(e => args[0] == e || ['sar_toast_', 'sar_demo_', 'sar_con_filter'].some(e => args[0].startsWith(e)))) return;

	// there is a better way to do this than a massive switch statement
	// job for future me
	switch(args[0]) {
		case 'exec':
			con.log(`exec: Executing config ${args[1]}.cfg`);
			txt = cfg.get(args[1]);
			if (txt == null) {
				con.err(`exec: Couldn't exec ${args[1]}.cfg. Are you sure it exists?`);
			} else {
				cbuf = [...source.getCommandArgs(txt), ...cbuf];
			}
			break;
		case 'sar_on_config_exec':
			if (args.length < 2) {
				con.err(`sar_on_config_exec: Too few args. Got ${args.join(' ')}`);
			}
			txt = args.slice(1).map(e => e.encases('"', '"') ? e.slice(1, -1) : e).join(' ');
			cbuf = [...source.getCommandArgs(txt), ...cbuf];
			break;
		case 'sar_alias':
			if (args.length < 3) {
				con.err(`sar_alias: Too few args. Got ${args.join(' ')}`);
			}
			name = args[1].encases('"', '"') ? args[1].slice(1, -1) : args[1];
			command = args.slice(2).map(e => e.encases('"', '"') ? e.slice(1, -1) : e).join(' ');
			existing = functions.find(e => e.name == name);
			if (existing) {
				con.err(`sar_alias: Function ${name} already exists, not shadowing!`);
				break;
			}
			existing = aliases.find(e => e.name == name)
			if (existing) {
				existing.command = command;
				break;
			}
			aliases.push({name: name, command: command});
			break;
		case 'sar_function':
			if (args.length < 3) {
				con.err(`sar_function: Too few args. Got ${args.join(' ')}`);
			}
			name = args[1].encases('"', '"') ? args[1].slice(1, -1) : args[1];
			command = args.slice(2).map(e => e.encases('"', '"') ? e.slice(1, -1) : e).join(' ');
			existing = aliases.find(e => e.name == name);
			if (existing) {
				con.err(`sar_function: Alias ${name} already exists, not shadowing!`);
				break;
			}
			existing = functions.find(e => e.name == name);
			if (existing) {
				existing.command = command;
				break;
			}
			functions.push({name: name, command: command});
			break;
		case 'sar_expand':
			command = args.slice(1).map(e => e.encases('"', '"') ? e.slice(1, -1) : e).join(' ');
			cbuf = [...source.getCommandArgs(source.expand(command, null, svars).out), ...cbuf];
			break;
		case 'svar_set':
			if (args.length != 3) {
				con.err(`svar_set: Wrong arg number. Got ${args.join(' ')}`);
			}
			SetSvar(args[1], args[2])
			break;
		case 'svar_get':
			if (args.length != 2) {
				con.err(`svar_get: Wrong arg number. Got ${args.join(' ')}`);
			}
			name = args[1].encases('"', '"') ? args[1].slice(1, -1) : args[1];
			con.log(`${name} = ${GetSvar(args[1])}`);
			break;
		case 'svar_from_cvar':
			if (args.length != 3) {
				con.err(`svar_from_cvar: Wrong arg number. Got ${args.join(' ')}`);
			}
			SetSvar(args[1], '1')
			break;
		case 'echo':
			if (args.length > 1) {
				let txt = args.slice(1).map(e => e.encases('"', '"') ? e.slice(1, -1) : e).join(' ');
				con.log(!txt.split('').some(e => e != ' ') ? '<br>' : txt);
			} else {
				con.warn(`echo: No args given. You're weird.`);
			}
			break;
		case 'clear':
			if (con.debugLevel < 1) con.clear();
			break;
		case 'sar_hud_set_text':
			if (args.length < 3) {
				con.err(`sar_hud_set_text: Too few args. Got ${args.join(' ')}`);
			}

			// TODO : Make argument parsing better to avoid break set weirdness
			// sar_hud_set_text 0 test: yes

			val = args.slice(2).map(e => e.encases('"', '"') ? e.slice(1, -1) : e).join(' ');
			existing = texts.find(e => e.id == args[1]);
			if (existing) {
				existing.txt = val;
				break;
			}
			texts.push({
				id: args[1],
				txt: val,
				shown: true,
			})
			break;
		case 'sar_hud_hide_text':
			if (args.length != 2) {
				con.err(`sar_hud_hide_text: Wrong arg number. Got ${args.join(' ')}`);
			}
			existing = texts.find(e => e.id == args[1])
			if (existing) existing.shown = false;
			break;
		case 'sar_hud_show_text':
			if (args.length != 2) {
				con.err(`sar_hud_show_text: Wrong arg number. Got ${args.join(' ')}`);
			}
			existing = texts.find(e => e.id == args[1])
			if (existing) existing.shown = true;
			break;
		case 'plugin_load':
			if (args.length < 2) {
				con.err(`plugin_load: Too few args.`);
			}
			if (args[1] == 'sar') {
				con.log('Loaded SourceAutoRecord, Version 1.12.6-pre12', undefined, '#55CC55');
				con.log(`Loaded plugin "${args[1]}"`);
			} else {
				con.warn(`plugin_load: Loaded "${args[1]}", which is not SAR.`);
			}
			break;
		case 'sar_about':
			let gamestr = 'Unknown';
			switch(game) {
				case 'portal2':
				case 'srm':
					gamestr = 'Portal 2 (7293)';
					break;
				case 'mel':
					gamestr = 'Portal Stories: Mel (5723)';
					break;
				case 'reloaded':
					gamestr = 'Portal Reloaded';
					break;
			}
			con.log('SourceAutoRecord is a speedrun plugin for Source Engine games.', undefined, '#EECC44');
			con.log('More information at: https://github.com/p2sr/SourceAutoRecord or https://wiki.portal2.sr/SAR', undefined, '#EECC44');
			con.log(`Game: ${gamestr}`, undefined, '#EECC44');
			con.log('Version: 1.12.6-pre12', undefined, '#EECC44');
			con.log('Built: 22:53:39 Feb  9 2022', undefined, '#EECC44');
			break;
		default:
			con.err(`Unknown command ${args[0]}. Context: ${args.join(' ')}`);
	}
}

function SetSvar(name, val) {
	name = name.encases('"', '"') ? name.slice(1, -1) : name;
	val = val.encases('"', '"') ? val.slice(1, -1) : val;
	let existing = svars.find(e => e.name == name);
	if (existing) {
		existing.val = val;
		return;
	}
	svars.push({name: name, val: val});
}

function GetSvar(name) {
	name = name.encases('"', '"') ? name.slice(1, -1) : name;
	let existing = svars.find(e => e.name == name);
	return existing ? existing.val : '';
}

function tick() {
	// This runs at ~60 FPS
	if (cbuf.length > 0) {
		while (cbuf.length > 0) {
			execute(...cbuf.splice(0, 1));
		}
	}
	drawTexts();
	requestAnimationFrame(tick);
}


function newCFG() {
	let name = prompt('CFG name?');
	cfg.add(name, true);
}

function changeGame() {
	game = q('game').value
}


let liveconsolehistory = [];
let liveconsolefuture = [];
function liveConsoleType(event) {
	let val
	switch (event.key) {
		case 'Enter':
			event.preventDefault();
			cbuf = [...source.getCommandArgs(q('liveconsole').value), ...cbuf]
			liveconsolehistory.push(q('liveconsole').value);
			liveconsolehistory = liveconsolehistory.slice(-256);
			liveconsolefuture = [];
			q('liveconsole').value = '';
			break;
		case 'ArrowUp':
			event.preventDefault();
			val = q('liveconsole').value;
			if (liveconsolehistory.length > 0) {
				liveconsolefuture.push(val);
				val = liveconsolehistory.pop();
			}
			q('liveconsole').value = val;
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


let texts = [], svars = [], aliases = [], functions = [], trace = [];
let game = 'other';
let cbuf = [];

con.debugLevel = 2;

window.onload = async function() {
	changeGame();
	tick();
	let fetchsrconfigs = async (filename) => {
		await queryAPI(`https://raw.githubusercontent.com/p2sr/srconfigs/master/${filename}.cfg`).then(e => {
			cfg.add(filename, false, e);
		});
	}
	await fetchsrconfigs('autoexec');
	cfg.view(cfg.cfgs[0]);
	q('runfirst').innerHTML = `Run ${cfg.cfgs[0]}`;
	await fetchsrconfigs('aliases');
	await fetchsrconfigs('cm_ghost');
	await fetchsrconfigs('cats/fullgame');
	// await fetchsrconfigs('con_filter');
	await fetchsrconfigs('extra');
}
