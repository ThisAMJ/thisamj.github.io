/**
 * SAR plugin JavaScript port for use with source.js
 */
 
const sar = {
	version: '1.12.8-pre1',
	built: '22:52:20 Aug 26 2022',
	
	category: {
		current: '',
		creating: null,
		defaults: null,
		categories: [],
		rules: [],
		create: function(name) {
			if (name === '') {
				sar.println(`Category name cannot be empty\n`);
				return false;
			}
			if (this.categories.find(e => e.name.toLowerCase() === name.toLowerCase())) {
				sar.println(`Category ${name} already exists\n`);
				return false;
			}
			this.categories.push({
				name: name,
				rules: [],
			});
			return true;
		},
		parseParams: function(params) {
			let out = {};
			for (let param of params) {
				if (!~param.indexOf('=')) {
					sar.println(`Invalid argument '${param}'\n`);
					return false;
				}
				let key = param.slice(0, param.indexOf('='));
				let val = param.slice(param.indexOf('=') + 1);
				if (key === 'ccafter') {
					key = 'after';
					val = `${this.creating} - ${val}`;
				}
				out[key] = val;
			}
			return out;
		},
		createRule: function(name, type, params) {
			if (name === '') {
				sar.println(`Rule name cannot be empty\n`);
				return false;
			}
			if (this.rules.find(e => e.name.toLowerCase() === name.toLowerCase())) {
				sar.println(`Rule ${name} already exists\n`);
				return false;
			}
			
			let actionstr = params['action'];
			if (!actionstr) {
				sar.println(`action not specified\n`);
				return false;
			}
			if (!~['start', 'force_start', 'stop', 'split', 'pause', 'resume'].indexOf(actionstr)) {
				sar.println(`Unknown action ${actionstr}`);
				return false;
			}
			if (!params['map']) {
				sar.println(`map not specified\n`);
				return false;
			}
			let rule = {
				name: name,
				type: type,
				params: params
			}
			if (false) {
				sar.println(`Failed to create rule\n`);
				return false;
			}
			this.rules.push(rule);
			return true;
		},
		addRuleToCategory: function(category, rule) {
			let cat = this.categories.find(e => e.name.toLowerCase() === category.toLowerCase());
			if (!cat) {
				sar.println(`Category ${category} does not exist\n`);
				return false;
			}
			if (!this.rules.find(e => e.name.toLowerCase() === rule.toLowerCase())) {
				sar.println(`Rule ${rule} does not exist\n`);
				return false;
			}
			if (cat.rules.find(e => e.toLowerCase() === rule.toLowerCase())) {
				sar.println(`Rule ${rule} already in category ${category}\n`);
				return false;
			}
			cat.rules.push(rule);
			return true;
		},
	},
	
	
	hud: {
		texts: [],
		order: [],
		ordercompletion: function(args) {
			return sar.hud.order.filter(e => ~e.indexOf(args[1] || ''));
		},
		output: null,
		getPrecision: function(velocity = false) {
			let p = velocity ? parseInt(src.cmd.cvar('sar_hud_velocity_precision')) : parseInt(src.cmd.cvar('sar_hud_precision'));
			if (p < 0) p = 0;
			if (parseInt(src.cmd.cvar('sv_cheats')) != 1) {
				let max = velocity ? 2 : 6;
				if (p > max) p = max;
			}
			return p;
		},
		formatText: str => {
			
			let curColor = null, out = '';
			
			for (let i = 0, j = str.length; i < j; i++) {
				if (str[i] === '#') {
					++i;
					if (str[i] === '#') {
						out += '#';
						continue;
					}
					if (str[i] === 'r') {
						if (curColor !== null) {
							out += '</span>'
							curColor = null;
						}
						continue;
					}
					let next6 = str.slice(i, i + 6);
					if (!next6.split('').some(e => !~'0123456789aAbBcCdDeEfF'.indexOf(e))) {
						// the next 6 characters are hex-worthy
						if (curColor !== null) out += '</span>';
						out += `<span style="color:#${next6}">`;
						curColor = next6;
						i += 5;
						continue;
					}
				}
				out += str[i];
			}
			if (curColor !== null) out += '</span>'
			return out;
		},
		draw: function() {
			sar.ticks = (sar.ticks + 1) % 600;
			if (!this.output) return false;
			let hud_elements = {}, out = [], tmp, tmp2 = (0).toFixed(this.getPrecision()), tmp3 = (0).toFixed(this.getPrecision(true));
			
			tmp = parseInt(src.cmd.cvar('sar_hud_position'));
			if (!isNaN(tmp) && tmp != 0) {
				hud_elements.position = src.map == '' ? [] : `pos: ${tmp2} ${tmp2} ${tmp2}`;
			}
			
			tmp = parseInt(src.cmd.cvar('sar_hud_velocity'));
			if (!isNaN(tmp) && tmp != 0) {
				hud_elements.velocity = src.map == '' ? [] : `vel: ${tmp3} ${tmp3} ${tmp3}`;
			}
			
			tmp = parseInt(src.cmd.cvar('sar_hud_angles'));
			if (!isNaN(tmp) && tmp != 0) {
				hud_elements.angles = src.map == '' ? [] : `ang: ${tmp2} ${tmp2}`
			}
			
			hud_elements.text = sar.hud.texts.filter(e => e.shown).sort((a, b) => a.id - b.id).map(e => e.txt);
			
			for (let ele of this.order) {
				if (hud_elements[ele]) out.push(...typeof hud_elements[ele] === 'string' ? hud_elements[ele].split('\n') : hud_elements[ele]);
			}
			
			let color = sar.hud.rainbow ? `${hsvToRgb(sar.ticks / 600).join(' ')} 255` : src.cmd.cvar('sar_hud_font_color');
			color = color.replace(/  */g, ' ').split(' ');
			if (color.length !== 4) color = ['255', '255', '255', '255'];
			color[3] /= 255;
			color = color.join(',');
			
			out = out.map(e => `<pre style="color:rgba(${color})">${e}</pre>`).join('');
			if (this.output.innerHTML != out) this.output.innerHTML = out;
		},
	},
	
	expand: function(text, args) {
		// if (text.encases('"', '"')) text = text.slice(1, -1);
		let str = '', sub = false, i = -1;
		while (++i < text.length) {
			if (text[i] == '$') {
				let c = text[i + 1];
				if (c == '$') {
					str += c;
					i++;
					continue;
				}
				if (c == "'") {
					str += '"';
					i++;
					continue;
				}
				if (c == '-') {
					i++;
					continue;
				}
				if (c == '+') {
					sub = true;
					i++;
					let arg = Number(text[i + 1]);
					i++;
					while (parseInt(text[i + 1]) >= 0 && parseInt(text[i++]) <= 9) {
						arg = arg * 10 + text[i];
					}
					str += args.cmdStr.slice(args.argLengthS[arg]);
					continue;
				}
				if (c >= 1 && c <= 9) {
					sub = true;
					let arg = Number(c);
					i++;
					while (parseInt(text[i + 1]) >= 0 && parseInt(text[i++]) <= 9) {
						arg = arg * 10 + text[i];
					}
					if (args[arg + 1]) str += args[arg + 1];
					continue;
				}
				if (c == '#') {
					sub = true;
					str += args.length - 2;
					i++;
					continue;
				}
				let len = 0;
				while (true) {
					let ch = text[i + ++len];
					if (ch >= 'a' && ch <= 'z') continue;
					if (ch >= 'A' && ch <= 'Z') continue;
					if (ch >= '0' && ch <= '9') continue;
					if (ch == '_' || ch == '-') continue;
					break;
				}
				if (--len == 0) {
					str += '$';
					continue;
				}
				sub = true;
				let value = this.GetSvar(text.substr(i + 1, len));
				if (value) str += value;
				i += len;
				continue;
			}
			str += text[i];
		}
		return {out: str, sub: sub};
	},
	
	printHelp: function(args) {
		let convar = src.cmd.getConvar(args[0]);
		if (!convar || !convar.helpStr) return;
		sar.println(convar.helpStr);
	},
	
	GetColor: function(colstr = '') {
		return `#${colstr}`;
	},
	
	println: function(text, debugLevel = 0, color = '#EECC44') {
		src.con.log(`${text}`, debugLevel, color);
	},
	
	atoi: function(val) {
		let i = parseInt(val);
		if (isNaN(i) || !isFinite(i)) return 0;
		return Math.max(-2147483648, Math.min(2147483647, val));
	},
	signedint: function(val) {
		let i = parseInt(val);
		if (isNaN(i) || !isFinite(i)) return 0;
		while (i < -2147483648) i += 4294967296;
		while (i > 2147483647) i -= 4294967296;
		return i;
	},
};

{ // hwait

	sar.hwaits = [];

	ON_PRETICK(function() {
		for (let i = 0; i < sar.hwaits.length; i++) {
			let hwait = sar.hwaits[i];
			if (hwait.ticks <= 0) {
				src.cmd.executeCommand(hwait.cmd);
				sar.hwaits.splice(i--, 1);
				continue;
			}
			hwait.ticks--;
		}
	});

	CON_COMMAND_F('hwait', 'hwait <tick> <command> [args...] - run a command after the given number of host ticks\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 3) {
			return sar.printHelp(args);
		}
		let ticks = sar.atoi(args[1]);
		let cmd = args.length === 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
		if (ticks <= 0) {
			src.cmd.executeCommand(cmd);
		} else {
			sar.hwaits.push({
				ticks: ticks,
				cmd: cmd
			});
		}
	});
	
	CON_COMMAND('seq', 'seq <commands>... - runs a sequence of commands one tick after one another\n', function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		let cmds = args.slice(1), i = 0;
		for (let cmd of cmds) {
			i++;
			sar.hwaits.push({
				ticks: i,
				cmd: cmd
			});
		}
	});
} // hwait

CON_COMMAND_F('nop', 'nop [args]... - nop ignores all its arguments and does nothing\n', FCVAR_DONTRECORD, () => {});

{ // hud
	CON_CVAR('sar_hud_precision', 3);
	CON_CVAR('sar_hud_velocity_precision', 2);
	CON_CVAR('sar_hud_font_color', '255 255 255 255');
	
	sar.ticks = 0;
	sar.hud.rainbow = false;
	CON_CVAR('sar_hud_rainbow', -1, 'Enables the rainbow HUD mode. -1 = default, 0 = disable, 1 = enable.\n', FCVAR_NONE, -1, 1);
	if (new Date().getMonth() === 5) { // June
		if (Math.floor(Math.random() * 50 + 1)) {
			sar.hud.rainbow = true;
		}
	}
	
	ON_TICK(function() {
		switch (src.cmd.cvar('sar_hud_rainbow')) {
			case '0':
				sar.hud.rainbow = false;
				break;
			case '1':
				sar.hud.rainbow = true;
				break;
		}
		sar.hud.draw();
	});
	
	sar.hud.defaultorder = [];
	for (let ele of ['tastick', 'groundframes', 'text', 'position', 'angles', 'portal_angles', 'portal_angles_2', 'velocity', 'velang', 'groundspeed', 'session', 'last_session', 'sum', 'timer', 'avg', 'cps', 'pause_timer', 'demo', 'jumps', 'portals', 'steps', 'jump', 'jump_peak', 'velocity_peak', 'trace', 'frame', 'last_frame', 'inspection', 'eyeoffset', 'duckstate', 'grounded']) {
		sar.hud.defaultorder.push(ele);
		if (ele != 'text') CON_CVAR(`sar_hud_${ele}`, 0);
	}
	sar.hud.order = sar.hud.defaultorder;
	
	CON_COMMAND('sar_hud_set_text', 'sar_hud_set_text <id> <text>... - sets and shows the nth text value in the HUD\n', function(args) {
		if (args.length < 3) {
			return sar.printHelp(args);
		}
		let id = sar.atoi(args[1]);
		if (id === -1) {
			return sar.printHelp(args);
		}
		let txt = sar.hud.formatText(args.length === 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]));
		let existing = sar.hud.texts.find(e => e.id === id)
		if (existing) {
			return existing.txt = txt;
		}
		let component = {
			id: id,
			txt: txt,
			color: null,
			shown: true
		};
		sar.hud.texts.push(component);
	});
	
	CON_COMMAND('sar_hud_set_text_color', 'sar_hud_set_text_color <id> [color] - sets the color of the nth text value in the HUD. Reset by not giving color.\n', function(args) {
		if (args.length < 2 || args.length > 3) {
			return sar.printHelp(args);
		}
		let id = sar.atoi(args[1]);
		let existing = sar.hud.texts.find(e => e.id === id);
		if (args.length === 2) {
			existing.color = null;
		} else {
			existing.color = args[2];
		}
	});
	
	CON_COMMAND('sar_hud_show_text', 'sar_hud_show_text <id> - shows the nth text value in the HUD\n', function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		if (args[1] === 'all') {
			return sar.hud.texts.map(e => e.shown = true);
		}
		let existing = sar.hud.texts.find(e => e.id === sar.atoi(args[1]));
		if (existing) existing.shown = true;
	});

	CON_COMMAND('sar_hud_hide_text', 'sar_hud_hide_text <id> - hides the nth text value in the HUD\n', function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		if (args[1] === 'all') {
			return sar.hud.texts.map(e => e.shown = false);
		}
		let existing = sar.hud.texts.find(e => e.id === sar.atoi(args[1]));
		if (existing) existing.shown = false;
	});
	
	CON_COMMAND('sar_hud_order_bottom', 'sar_hud_order_bottom <name> - orders hud element to bottom\n', function(args) {
		if (args.length !== 2) {
			return sar.println(`Set!\n`);
		}
		
		if (!sar.hud.order.includes(args[1].toLowerCase())) {
			return src.con.err(`Unknown HUD element name!\n`);
		}
		
		sar.hud.order = [...sar.hud.order.filter(e => e.toLowerCase() !== args[1].toLowerCase()), args[1].toLowerCase()];
		
		sar.println(`Moved HUD element ${args[1]} to bottom.\n`)
	}, sar.hud.ordercompletion);

	CON_COMMAND('sar_hud_order_top', 'sar_hud_order_top <name> - orders hud element to top\n', function(args) {
		if (args.length !== 2) {
			return sar.println(`Orders hud element to top: sar_hud_order_top <name>\n`);
		}
		
		if (!sar.hud.order.includes(args[1].toLowerCase())) {
			return src.con.err(`Unknown HUD element name!\n`);
		}
		
		sar.hud.order = [args[1].toLowerCase(), ...sar.hud.order.filter(e => e != args[1].toLowerCase())];
		
		sar.println(`Moved HUD element ${args[1]} to top.\n`)
	}, sar.hud.ordercompletion);
	
	CON_COMMAND('sar_hud_order_reset', 'sar_hud_order_reset - resets order of hud element\n', function(args) {
		sar.hud.order = sar.hud.defaultorder;
		sar.println(`Reset default HUD element order!\n`);
	});
} // hud

{ // svar operations

	sar.svars = {};
	sar.persistentSvars = [];
	sar.SavePersistentSvars = function() {
		let s = {};
		for (let svar of sar.persistentSvars) {
			s[svar] = sar.GetSvar(svar);
		}
		localStorage.setItem('sar.persistentSvars', JSON.stringify(s))
	};
	sar.GetSvar = function(name) {
		return (sar.svars[Object.keys(sar.svars).find(e => e === name)] || '').toString();
	};
	sar.SetSvar = function(name, val) {
		sar.svars[name] = val.toString();
		if (sar.persistentSvars.find(e => e.toLowerCase() === name.toLowerCase())) sar.SavePersistentSvars();
	};
	sar.svars = JSON.parse(localStorage.getItem('sar.persistentSvars') || '{}');

	CON_COMMAND_F('svar_set', 'svar_set <variable> <value> - set a svar (SAR variable) to a given value\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 3) {
			return sar.printHelp(args);
		}
		
		sar.SetSvar(args[1], args.length === 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]));
	});
	
	CON_COMMAND_F('svar_substr', 'svar_substr <variable> <from> [len] - sets a svar to its substring.\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 3 || args.length > 4) {
			return sar.printHelp(args);
		}
		
		let val = sar.GetSvar(args[1]);
		let from = sar.atoi(args[2]);
		let len = args.length === 4 ? sar.atoi(args[3]) : val.length;
		
		if (from < 0) from += val.length;
		if (from < 0 || from > val.length) {
			return sar.println(`Substring index out of bounds of variable\n`);
		}
		if (len < 0) {
			return sar.println(`Negative length of substring\n`);
		}
		val = val.substr(from, len);
		sar.SetSvar(args[1], val);
	});

	CON_COMMAND_F('svar_get', 'svar_get <variable> - get the value of a svar\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
		sar.println(`${args[1]} = ${sar.GetSvar(args[1])}\n`);
	});

	CON_COMMAND_F('svar_from_cvar', 'svar_from_cvar <variable> <cvar> - capture a cvar\'s value and place it into an svar, removing newlines\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 3) {
			return sar.printHelp(args);
		}
		
		let cvar = src.cmd.getConvar(args[2])
		if (cvar && !cvar.isCommand) {
			sar.SetSvar(args[1], cvar.value.toString().replace(/\n/g, ''));
		}
	});
	
	sar.capture = {
		target: '', len: 0
	};
	CON_COMMAND_F('_sar_svar_capture_stop', 'Internal SAR command. Do not use\n', FCVAR_DONTRECORD | FCVAR_HIDDEN, function(args) {
		let out = src.con.buffer.slice(sar.capture.len); // Get the console buffer since capture
		out = out.filter(e => e[1] <= src.cmd.cvar('developer')); // Filter to developer level
		out = out.map(e => e[0]); // Get the text components
		out = out.join(''); // Squish into one string
		out = out.replace(/\n/g, ''); // Remove newlines
		sar.SetSvar(sar.capture.target, out);
		sar.capture = {
			target: '', len: 0
		};
		src.cmd.getConvar(args[0]).flags |= FCVAR_HIDDEN;
	});
	CON_COMMAND_F('svar_capture', 'svar_capture <variable> <command> [args]... - capture a command\'s output and place it into an svar, removing newlines\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 3) {
			return src.__.tooFewArgs(args);
		}
		
		let cmd = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
			
		// Console reading - use the buffer
		sar.capture.target = args[1];
		sar.capture.len = src.con.buffer.length;
		src.cmd.getConvar('_sar_svar_capture_stop').flags &= ~FCVAR_HIDDEN;
		src.cmd.executeCommand('_sar_svar_capture_stop');
		src.cmd.executeCommand(cmd);
	});

	CON_COMMAND_F('svar_persist', 'svar_persist <variable> - mark an svar as persistent\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
		if (!~sar.persistentSvars.indexOf(args[1])) {
			sar.persistentSvars.push(args[1]);
		}
		sar.SavePersistentSvars();
	});

	CON_COMMAND_F('svar_no_persist', 'svar_no_persist <variable> - unmark an svar as persistent\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
		sar.persistentSvars = sar.persistentSvars.filter(e => e !== args[1]);
		sar.SavePersistentSvars();
	});

	{
		let SVAR_OP = function(name, op, disallowSecondZero = false) {
			CON_COMMAND_F(`svar_${name}`, `svar_${name} <variable> <variable|value> - perform the given operation on an svar\n`, FCVAR_DONTRECORD, function(args) {
				if (args.length !== 3) {
					return sar.printHelp(args);
				}
				let pInt = (x) => sar.atoi(x);
				let cur = sar.svars.hasOwnProperty(args[1]) ? pInt(sar.svars[args[1]]) : 0;
				let other = sar.svars.hasOwnProperty(args[2]) ? pInt(sar.svars[args[2]]) : pInt(args[2]);
				sar.SetSvar(args[1], (disallowSecondZero && other === 0) ? 0 : sar.signedint(eval(`cur ${op} other`)));
			});
		};
		
		SVAR_OP('add', '+');
		SVAR_OP('sub', '-');
		SVAR_OP('mul', '*');
		SVAR_OP('div', '/', true);
		SVAR_OP('mod', '%', true);
	}
} // svar operations

{ // sar_on_things

	
	sar.event_execs = {};
	sar.runevents = function(event) {
		if (!sar.event_execs[event]) {
			return src.con.err(`Event "${event}" does not exist.\n`);
		}
		for (let exec of sar.event_execs[event]) {
			src.cmd.executeCommand(exec);
		}
	}

	let MK_SAR_ON = function(name, when, immediately) {
		sar.event_execs[name] = [];
		CON_COMMAND_F(`sar_on_${name}`, `sar_on_${name} <command> [args]... - registers a command to be run ${when}\n`, FCVAR_DONTRECORD, function(args) {
			if (args.length < 2) {
				return sar.printHelp(args);
			}
			let cmd = args.length === 2 ? args[1] : args.cmdStr.slice(args.argLengthS[0]);
			sar.event_execs[name].push(cmd);
		});
		CON_COMMAND_F(`sar_on_${name}_clear`, `sar_on_${name}_clear - clears commands registered on event "${name}"\n`, FCVAR_DONTRECORD, function(args) {
			sar.println(`Cleared ${sar.event_execs[name].length} commands from event "${name}"\n`);
			sar.event_execs[name] = [];
		});
	}
	
	MK_SAR_ON('load',              'on session start',                   true);
	MK_SAR_ON('session_end',       'on session end',                     true);
	MK_SAR_ON('exit',              'on game exit',                       true);
	MK_SAR_ON('demo_start',        'when demo playback starts',          false);
	MK_SAR_ON('demo_stop',         'when demo playback stops',           false);
	MK_SAR_ON('flags',             'when CM flags are hit',              false);
	MK_SAR_ON('coop_reset_done',   'when coop reset is completed',       false);
	MK_SAR_ON('coop_reset_remote', 'when coop reset run remotely',       false);
	MK_SAR_ON('coop_spawn',        'on coop spawn',                      true);
	MK_SAR_ON('config_exec',       'on config.cfg exec',                 true);
	MK_SAR_ON('tas_start',         'when TAS script playback starts',    true);
	MK_SAR_ON('tas_end',           'when TAS script playback ends',      true);
	MK_SAR_ON('pb',                'when auto-submitter detects PB',     true);
	MK_SAR_ON('not_pb',            'when auto-submitter detects not PB', true);
	
	// Since I can't simulate the entire game, here's these commands to test map loads or whatevs
	CON_COMMAND('__do_event', '__do_event <event> - Executes a faux event (e.g. "__do_event load" runs sar_on_load commands)\n', function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
		
		sar.runevents(args[1]);
		
	}, function(args) {
		if (args.length === 1) return Object.keys(sar.event_execs);
		if (args.length === 2) return Object.keys(sar.event_execs).filter(e => ~e.indexOf(args[1]));
	});
	
	sar.hasConfigExeced = false;
	CON_COMMAND_HOOK('exec', true, function(args) {
		if (args[1] === 'config.cfg' && !sar.hasConfigExeced) {
			sar.hasConfigExeced = true;
			sar.runevents('config_exec');
		}
	})
} // sar_on_things

{ // functions / aliases

	sar.aliases = [];
	sar.functions = [];

	CON_COMMAND_F('sar_function', 'sar_function <name> [command] [args]... - create a function, replacing $1, $2 etc up to $9 in the command string with the respective argument. If no command is specified, prints the given function\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		
		let func = sar.functions.find(e => e.name.toLowerCase() === args[1].toLowerCase());
		
		if (args.length === 2) {
			if (func) {
				sar.println(`${func.cmd}\n`);
			} else {
				sar.println(`Function ${args[1]} does not exist\n`);
			}
			return;
		}
		
		let cmd = args.length === 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
		
		if (func) {
			func.cmd = cmd;
		} else {
			if (src.cmd.getConvar(args[1])) {
				return sar.println(`Command ${args[1]} already exists! Cannot shadow.\n`);
			}
			CON_COMMAND(args[1], 'SAR function command.\n', function(args) {
				src.cmd.executeCommand(`sar_function_run ${args.cmdStr}`);
			});
			sar.functions.push({
				name: args[1],
				cmd: cmd
			});
		}
	});

	CON_COMMAND_F('sar_function_run', 'sar_function_run <name> [args]... - run a function with the given arguments\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		let it = sar.functions.find(e => e.name.toLowerCase() === args[1].toLowerCase());
		if (!it) return src.con.err(`Function ${args[1]} does not exist\n`);
		src.cmd.executeCommand(sar.expand(it.cmd, args).out);
	});

	CON_COMMAND_F('sar_expand', 'sar_expand [cmd]... - run a command after expanding svar substitutions\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		let cmd = args.length === 2 ? args[1] : args.cmdStr.slice(args.argLengthS[0]);
		src.cmd.executeCommand(sar.expand(cmd, []).out);
	})

	CON_COMMAND_F('sar_alias', 'sar_alias <name> [command] [args]... - create an alias, similar to the \'alias\' command but not requiring quoting. If no command is specified, prints the given alias\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		
		let alias = sar.aliases.find(e => e.name.toLowerCase() === args[1].toLowerCase());
		
		if (args.length === 2) {
			if (alias) {
				sar.println(`${alias.cmd}\n`);
			} else {
				sar.println(`Alias ${args[1]} does not exist\n`);
			}
			return;
		}
		
		let cmd = args.length === 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
		
		// TODO: Work with __delete
		if (alias) {
			alias.cmd = cmd;
		} else {
			if (src.cmd.getConvar(args[1])) {
				return sar.println(`Command ${args[1]} already exists! Cannot shadow.\n`);
			}
			CON_COMMAND(args[1], 'SAR alias command.\n', function(args) {
				src.cmd.executeCommand(`sar_alias_run ${args.cmdStr}`);
			});
			sar.aliases.push({
				name: args[1],
				cmd: cmd
			});
		}
	});

	CON_COMMAND('sar_alias_run', 'sar_alias_run <name> [args]... - run a SAR alias, passing on any additional arguments\n', function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		let it = sar.aliases.find(e => e.name.toLowerCase() === args[1].toLowerCase());
		if (!it) return src.con.err(`Alias ${args[1]} does not exist\n`);
		src.cmd.executeCommand(`${it.cmd} ${args.cmdStr.slice(args.argLengthS[1])}`);
	});

} // functions / aliases

{ // cond

	sar.cond = {
		conditions: {
			ORANGE: 0,
			COOP: 1,
			CM: 2,
			SAME_MAP: 3,
			WORKSHOP: 4,
			MENU: 5,
			MAP: 6,
			PREV_MAP: 7,
			GAME: 8,
			NOT: 9,
			AND: 10,
			OR: 11,
			SVAR: 12,
		},
	
		eval: function(c) {
			switch (c.type) {
				case this.conditions.ORANGE: return false;
				case this.conditions.COOP: return src.maps.cur.startsWith('mp_coop_');
				case this.conditions.CM: return src.cvar('sv_bonus_challenge') == 1;
				case this.conditions.SAME_MAP: return src.maps.cur == src.maps.history[0];
				case this.conditions.WORKSHOP: return false;
				case this.conditions.MENU: return src.maps.cur == '';
				case this.conditions.MAP: return src.maps.cur == c.val;
				case this.conditions.PREV_MAP: return src.maps.history[0] == c.val;
				case this.conditions.GAME: return src.game.str == c.val;
				case this.conditions.NOT: return !this.eval(c.unop_cond);
				case this.conditions.AND: return this.eval(c.binop_l) && this.eval(c.binop_r);
				case this.conditions.OR: return this.eval(c.binop_l) || this.eval(c.binop_r);
				case this.conditions.SVAR: return sar.GetSvar(c.svar) == c.val;
			}
			return false;
		},

		tokens: {
			TOK_LPAREN: 0,
			TOK_RPAREN: 1,
			TOK_NOT: 2,
			TOK_AND: 3,
			TOK_OR: 4,
			TOK_EQUALS: 5,
			TOK_STR: 6,
		},

		parse: function(cond_str) {
			let toks = [];
			for (let i = 0; i < cond_str.length; i++) {
				if (~' \v\t\r\n'.indexOf(cond_str[i])) continue;
				if (~'()!&|='.indexOf(cond_str[i])) {
					toks.push((['()!&|='.indexOf(cond_str[i])]));
					continue;
				}
				let str = '';
				while (i < cond_str.length && !~' \v\t\r\n()!&|='.indexOf(cond_str[i])) str += cond_str[i++];
				i--;
				toks.push([this.tokens.TOK_STR, str]);
				continue;
			}

			let op_stack = [], out_stack = [];
			let POP_OP_TO_OUTPUT = function() {
				let op = op_stack.pop();
				if (out_stack.length == 0) {
					src.con.err(`Malformed input\n`);
					return null;
				}
				let c_new = {};
				if (op == sar.cond.tokens.TOK_NOT) {
					c_new.type = sar.cond.conditions.NOT;
					c_new.unop_cond = out_stack.pop();
				} else {
					c_new.type = op == sar.cond.tokens.TOK_OR ? sar.cond.conditions.OR : sar.cond.conditions.AND;
					c_new.binop_r = out_stack.pop();
					if (out_stack.length == 0) {
						src.con.err(`Malformed input\n`);
						return null;
					}
					c_new.binop_l = out_stack.pop();
				}
				out_stack.push(c_new);
				return 1;
			};
		
			while (toks.length > 0) {
				let t = toks.shift();
		
				switch(t[0]) {
					case this.tokens.TOK_STR:
						let c = {};
						switch (t[1]) {
							case 'orange':
								c.type = this.conditions.ORANGE;
								break;
							case 'coop':
								c.type = this.conditions.COOP;
								break;
							case 'cm':
								c.type = this.conditions.CM;
								break;
							case 'same_map':
								c.type = this.conditions.SAME_MAP;
								break;
							case 'workshop':
								c.type = this.conditions.WORKSHOP;
								break;
							case 'menu':
								c.type = this.conditions.MENU;
								break;
							default:
								if (t[1] == 'map' || t[1] == 'prev_map' || t[1] == 'game' || t[1].startsWith('var:') || t[1][0] == '?') {

									if (toks.length == 0 || toks[0][0] != this.tokens.TOK_EQUALS) {
										src.con.err(`Expected = after '${t[1]}'\n`);
										return null;
									}

									toks.shift();
									
									let compare_tok;
									if (toks.length == 0 || (compare_tok = toks.shift())[0] != this.tokens.TOK_STR) {
										src.con.err(`Expected string token after '${t[1]}='\n`);
										return null;
									}

									if (t[1].startsWith('var:') || t[1][0] == '?') {
										c.type = this.conditions.SVAR;
										c.svar = t[1].substr(t[1][0] == '?' ? 1 : 4);
									} else {
										c.type = this.conditions[t[1].toUpperCase()];
									}
									
									c.val = (compare_tok[1].startsWith('var:') || compare_tok[1][0] == '?')
											? sar.GetSvar(compare_tok[1].substr(compare_tok[1][0] == '?' ? 1 : 4))
											: compare_tok[1];

								} else {
									src.con.err(`Bad token '${t[1]}'\n`);
									return null;
								}
						}
		
						out_stack.push(c)
						break;
		
					case this.tokens.TOK_LPAREN:
					case this.tokens.TOK_NOT:
						op_stack.push(t[0]);
						break;
					
					case this.tokens.TOK_RPAREN:
						while (op_stack.length > 0 && op_stack.last() != this.tokens.TOK_LPAREN) POP_OP_TO_OUTPUT();
						if (op_stack.length == 0) {
							src.con.err(`Unmatched parentheses\n`);
							return null;
						}
						op_stack.pop();
						break;

					case this.tokens.TOK_AND:
					case this.tokens.TOK_OR:
						while (op_stack.length > 0 && (op_stack.last() == this.tokens.TOK_NOT || op_stack.last() == this.tokens.TOK_AND)) POP_OP_TO_OUTPUT();
						op_stack.push(t[0]);
						break;
					
					case this.tokens.TOK_EQUALS:
						src.con.err(`Unexpected '=' token\n`);
						return null;
				}
			}
			while (op_stack.length > 0) POP_OP_TO_OUTPUT();

			if (out_stack.length == 0) {
				src.con.err(`Malformed input\n`);
				return null;
			}
			let cond = out_stack.pop();
			if (out_stack.length > 0) {
				src.con.err(`Malformed input\n`);
				return null;
			}
			return cond;
		}
	};

	CON_COMMAND_F('cond', 'cond <condition> <command> [args]... - runs a command only if a given condition is met\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 3) {
			return sar.printHelp(args);
		}
		
		let cond_str = args[1];
		let cond = sar.cond.parse(cond_str);
		if (!cond) {
			return sar.println(`Condition parsing of "${cond_str}" failed\n`);
		}
		let should_run = sar.cond.eval(cond);
		if (!should_run) return;
		src.cmd.executeCommand(args.length === 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]));
	});
} // cond


{ // con filter

	sar.con = {
		filters: [],
		filtering: null,
		
		matches_filters: function(text) {
			if (Number(src.cmd.cvar('sar_con_filter')) === 0) return true;
			
			if (this.filtering) {
				let match = this.filtering.allow;
				if (this.matches_filter(text, this.filtering.to)) {
					let was_filtering = JSON.parse(JSON.stringify(this.filtering));
					this.filtering = undefined;
					src.con.log(`Finishing persistent filter rule from "${was_filtering.from}" to "${was_filtering.to}"\n`, 3, '#88FF88');
				}
				return match;
			}
			
			for (let rule of this.filters) {
				if (this.matches_filter(text, rule.from)) {
					if (!this.matches_filter(text, rule.to)) {
						src.con.log(`Starting persistent filter rule from "${rule.from}" to "${rule.to}"\n`, 3, '#88FF88');
						this.filtering = rule;
					}
					return rule.allow;
				}
			}
			return Number(src.cmd.cvar('sar_con_filter_default')) === 1;
		},
		
		matches_filter: function(text, rule) {
			return !rule
				? true
				: typeof text !== 'string'
					? false
					: rule[0] === '^' && rule[rule.length - 1] === '$'
						? rule.slice(1, -1) === text
						: rule[0] === '^'
							? text.startsWith(rule.slice(1))
							: rule[rule.length - 1] === '$'
								? text.endsWith(rule.slice(0, -1))
								: ~text.indexOf(rule);
		}
	};

	CON_CVAR('sar_con_filter', 0, 'Enable the console filter\n', FCVAR_NONE, 0, 1);
	CON_CVAR('sar_con_filter_default', 0, 'Whether to allow text through the console filter by default', FCVAR_NONE, 0, 1);
	CON_CVAR('sar_con_filter_suppress_blank_lines', 0, 'Whether to suppress blank lines in console\n', FCVAR_NONE, 0, 1);
	CON_COMMAND('sar_con_filter_allow', 'sar_con_filter_allow <string> [end] - add an allow rule to the console filter, allowing until \'end\' is matched\n', function(args) {
		if (args.length < 2 || args.length > 3) {
			return sar.printHelp(args);
		}
		sar.con.filters.push({allow: true, from: args[1], to: args[2] || null});
	});
	CON_COMMAND('sar_con_filter_block', 'sar_con_filter_block <string> [end] - add a disallow rule to the console filter, blocking until \'end\' is matched\n', function(args) {
		if (args.length < 2 || args.length > 3) {
			return sar.printHelp(args);
		}
		sar.con.filters.push({allow: false, from: args[1], to: args[2] || null});
	});
	CON_COMMAND('sar_con_filter_reset', 'sar_con_filter_reset - clear the console filter rule list\n', function(args) {
		if (args.length != 1) {
			return sar.printHelp(args);
		}
		sar.con.filters = [];
	});
	
	src.con.print = function(text = '', debugLevel = 0, color = '#FFFFFF') {
		// TODO: print('\n') should finish current line
		let lines = text.split('\n');
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i], display = false;
			if (i == lines.length - 1 && line == '') continue;
			if (sar.con.matches_filters(line) && (line != '' || !src.cmd.cvar('sar_con_filter_suppress_blank_lines'))) {
				if (i < lines.length - 1) line += '\n';
				display = true;
			} else if (line.trim() != '' && line.trim() != '\n') {
				line += '\n';
				debugLevel = 3;
				color = '#888888';
				display = true;
			}
			// if (line == '\n') continue;
			// console.log([line, debugLevel, color, false, display]);
			this.buffer.push([line, debugLevel, color, false, display]);
		}
		
		// let lines = text.split('\n');
		// for (let i = 0; i < lines.length; i++) {
			// let line = lines[i];
			// if (sar.matches_filters(line) && (line != '' || !src.cvar('sar_con_filter_suppress_blank_lines'))) {
				// this.buffer.push([`${line}${i < lines.length - 1 ? '\n' : ''}`, debugLevel, color]);
			// } else {
				// if (line.trim() != '') this.buffer.push([line, 3, '#888888']);
			// }
		// }
	};
}

{ // echo
	CON_COMMAND('sar_echo', 'sar_echo <color> <string...> - echo a string to console with a given color\n', function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		
		let col = sar.GetColor(args[1], false);
		if (!col) {
			return sar.printHelp(args);
		}
		
		let str = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
		src.con.log(`${str}\n`, 0, col);
	});

	CON_COMMAND('sar_echo_nolf', 'sar_echo_nolf <color> <string...> - echo a string to console with a given color and no trailing line feed\n', function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		
		let col = sar.GetColor(args[1], false);
		if (!col) {
			return sar.printHelp(args);
		}
		
		let str = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
		src.con.log(str, 0, col);
	});
}

CON_COMMAND('sar_update', 'sar_update [release|pre] [exit] [force] - update SAR to the latest version. If exit is given, exit the game upon successful update; if force is given, always re-install, even if it may be a downgrade\n');

{ // speedrun categories
	switch (src.game.str) {
		case 'mel':
			sar.category.current = 'RTA';
			sar.category.categories = [{name: 'RTA', rules: ['Story - Start', 'Advanced - Start', 'Story - End', 'Advanced - End']}];
			sar.category.rules = [
				{
					name: 'Story - Start',
					map: 'st_a1_tramride',
					action: 'start',
					type: 'entity',
					targetname: 'Intro_Viewcontroller',
					inputname: 'Disable'
				}, {
					name: 'Advanced - Start',
					map: 'sp_a1_tramride',
					action: 'start',
					type: 'entity',
					targetname: 'Intro_Viewcontroller',
					inputname: 'Disable'
				}, {
					name: 'Story - End',
					map: 'st_a4_finale',
					action: 'stop',
					type: 'entity',
					targetname: 'soundscape',
					inputname: 'Kill'
				}, {
					name: 'Advanced - End',
					map: 'sp_a4_finale',
					action: 'stop',
					type: 'entity',
					targetname: 'soundscape',
					inputname: 'Kill'
				}
			];
			break;
		case 'aptag':
			sar.category.current = 'RTA';
			sar.category.categories = [{name: 'RTA', rules: ['Start', 'Good Ending', 'Bad Ending']}];
			sar.category.rules = [
				{
					name: 'Start',
					map: 'gg_intro_wakeup',
					action: 'start',
					type: 'entity',
					targetname: 'tele_out_shower',
					inputname: 'Enable'
				}, {
					name: 'Good Ending',
					map: 'gg_stage_theend',
					action: 'stop',
					type: 'entity',
					targetname: 'ele_exit_door',
					inputname: 'Close'
				}, {
					name: 'Bad Ending',
					map: 'gg_stage_theend',
					action: 'stop',
					type: 'entity',
					targetname: 'credits_video',
					inputname: 'PlayMovie'
				}
			];
			break;
		case 'twtm':
			sar.category.current = 'RTA';
			sar.category.categories = [{name: 'RTA', rules: ['Start', 'Finish']}];
			sar.category.rules = [
				{
					name: 'Start',
					map: 'tm_intro_01',
					action: 'start',
					type: 'entity',
					targetname: 'wall_fall',
					inputname: 'SetAnimation',
					parameter: 'fall2'
				}, {
					name: 'Finish',
					map: 'tm_map_final',
					action: 'stop',
					type: 'entity',
					targetname: 'player_br',
					inputname: 'Enable'
				}
			];
			break;
		case 'reloaded':
			sar.category.current = 'Chambers RTA';
			sar.category.categories = [
				{
					name: 'Chambers RTA',
					rules: ['Tube Start', 'Portal Save Start', 'Tube Ending', 'Escape Ending', '02', '03', '04', '06', '07', '09', '11', '13', '14', '16', '17', '19', '21', '23']
				}, {
					name: 'RTA',
					rules: ['Tube Start', 'Portal Save Start', 'Tube Ending', 'Escape Ending']
				}
			];
			{
				let rule = (name, map, cx, cy, cz) => {
					return {
						name: name,
						map: `sp_a1_pr_map_${map}`,
						action: 'split',
						type: 'zone',
						center: [cx, cy, cz],
						size: [150, 150, 200],
						angle: 0
					}
				}
				sar.category.rules = [
					{
						name: 'Tube Start',
						map: 'sp_a1_pr_map_002',
						action: 'start',
						type: 'entity',
						targetname: 'announcer1',
						inputname: 'Trigger'
					}, {
						name: 'Portal Save Start',
						map: 'sp_a1_pr_map_002',
						action: 'start',
						type: 'entity',
						targetname: '@wportal1',
						inputname: 'Open'
					}, {
						name: 'Tube Ending',
						map: 'sp_a1_pr_map_012',
						action: 'stop',
						type: 'entity',
						targetname: 'finale-finale_vc',
						inputname: 'Enable'
					}, {
						name: 'Escape Ending',
						map: 'sp_a1_pr_map_012',
						action: 'stop',
						type: 'entity',
						targetname: 'finale-escape_ending',
						inputname: 'EnableRefire'
					},
					rule('02', '003',  336,   432,  100),
					rule('03', '003', -2400, -2080, 100),
					rule('04', '003', -2400,  416,  200),
					rule('06', '004',  1952,  208,  100),
					rule('07', '004',  4864,  6784, 100),
					rule('09', '005',  160,  -1472, 100),
					rule('11', '006', -2816, -288,  100),
					rule('13', '007',  544,  -320,  100),
					rule('14', '007', -1472, -1312, 100),
					rule('16', '008', -608,   1024, 676),
					rule('17', '008',  4096,  6528, 676),
					rule('19', '009', -2048, -3488, 548),
					rule('21', '010',  1344,  288,  260),
					rule('23', '011', -2336, -2944, 484)
				];
			}
			break;
		default:
			sar.category.current = 'Singleplayer';
			sar.category.categories = [
				{
					name: 'Singleplayer',
					rules: ['Container Ride Start', 'Vault Start', 'Moon Shot']
				}, {
					name: 'Coop',
					rules: ['Coop Start', 'Coop Course 5 End']
				}, {
					name: 'Coop AC',
					rules: ['Coop Start', 'Coop Course 6 End']
				}
			];
			sar.category.rules = [
				{
					name: 'Container Ride Start',
					map: 'sp_a1_intro1',
					action: 'start',
					type: 'entity',
					targetname: 'camera_intro',
					inputname: 'TeleportToView'
				}, {
					name: 'Vault Start',
					map: 'sp_a1_intro1',
					action: 'start',
					type: 'entity',
					targetname: 'camera_1',
					inputname: 'TeleportPlayerToProxy'
				}, {
					name: 'Moon Shot',
					map: 'sp_a4_finale4',
					action: 'stop',
					type: 'entity',
					targetname: '@glados',
					inputname: 'RunScriptCode',
					parameter: 'BBPortalPlaced()'
				}, {
					name: 'Coop Start',
					map: 'mp_coop_start',
					action: 'start',
					type: 'entity',
					targetname: 'teleport_start',
					inputname: 'Enable'
				}, {
					name: 'Coop Course 5 End',
					map: 'mp_coop_paint_longjump_intro',
					action: 'stop',
					type: 'entity',
					targetname: 'vault-movie_outro',
					inputname: 'PlayMovieForAllPlayers'
				}, {
					name: 'Coop Course 6 End',
					map: 'mp_coop_paint_crazy_box',
					action: 'stop',
					type: 'entity',
					targetname: 'movie_outro',
					inputname: 'PlayMovieForAllPlayers'
				}
			];
			break;
	}
	CON_COMMAND('sar_speedrun_category', 'sar_speedrun_category [category] - get or set the speedrun category\n', function(args) {
		if (args.length > 1) {
			if (!sar.category.categories.find(e => e.name.toLowerCase() === args[1].toLowerCase())) {
				sar.println(`Category ${args[1]} does not exist!\n`);
			} else {
				if (sar.category.current.toLowerCase() !== args[1].toLowerCase()) {
					sar.category.current = args[1];
				}
				sar.println(`Using category '${sar.category.current}'\n`);
				return;
			}
		}
		let category = sar.category.categories.find(e => e.name.toLowerCase() === sar.category.current.toLowerCase());
		if (!category) return;
		sar.println(`Using '${sar.category.current}' with ${category.rules.length} rules:\n`);
		for (let rule of category.rules) {
			sar.println(`    ${rule}\n`);
		}
		sar.println(`\n`);
		sar.println(`Available categories:\n`);
		for (let cat of sar.category.categories) {
			sar.println(`    ${cat.name} (${cat.rules.length} rules)\n`)
		}
	}, function(args) {
		if (args.length === 1) return sar.category.categories.map(e => e.name);
		if (args.length === 2) return sar.category.categories.map(e => e.name).filter(e => ~e.indexOf(args[1]));
	});

	CON_COMMAND('sar_speedrun_cc_start', 'sar_speedrun_cc_start <category name> [default options]... - start the category creator\n', function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		
		if (sar.category.creating !== null) {
			return sar.println(`[cc] category creation already in progress\n`);
		}
		
		if (args[1] === '') {
			return sar.println(`[cc] category name cannot be empty\n`);
		}
		
		let params = sar.category.parseParams(args.slice(2));
		if (!params) {
			return sar.println(`[cc] failed to parse options\n`);
		}
		sar.category.defaults = params;
		
		if (!sar.category.create(args[1])) {
			return sar.println(`[cc] failed to create category\n`);
		}
		
		sar.category.creating = args[1];
	});

	CON_COMMAND('sar_speedrun_cc_rule', 'sar_speedrun_rule <rule name> <rule type> [options]... - add a rule to the category currently being created\n', function(args) {
		if (args.length < 3) {
			return sar.printHelp(args);
		}
		if (sar.category.creating === null) {
			return sar.println(`[cc] no category creation in progress\n`);
		}
		
		let params = sar.category.parseParams(args.slice(3))
		if (!params) {
			return sar.println(`[cc] failed to parse options\n`);
		}
		params = {...params, ...sar.category.defaults};
		
		let ruleName = `${sar.category.creating} - ${args[1]}`;
		if (!sar.category.createRule(ruleName, args[2], params)) {
			return sar.println(`[cc] failed to create rule\n`);
		}
		if (!sar.category.addRuleToCategory(sar.category.creating, ruleName)) {
			return sar.println(`[cc] failed to add rule to category\n`);
		}
	});

	CON_COMMAND('sar_speedrun_cc_finish', 'sar_speedrun_cc_finish - finish the category creator\n', function(args) {
		if (sar.category.creating === null) {
			return sar.println(`[cc] no category creation in progress\n`);
		}
		sar.println(`[cc] created category '${sar.category.creating}'\n`);
		sar.category.creating = null;
		sar.category.defaults = null;
	});
}

CON_COMMAND('sar_import_stats', 'sar_import_stats <filePath> - import the stats from the specified .csv file\n');
CON_COMMAND('sar_export_stats', 'sar_export_stats <filepath> -  export the stats to the specifed path in a .csv file\n');
for (let cmd of `sar_demo_overwrite_bak
sar_prevent_ehm
sar_hud_x
sar_hud_y
sar_hud_spacing
sar_hud_bg
sar_toast_tag_set_color
sar_record_at_demo_name
sar_record_at
sar_record_at_increment
sar_toast_width
sar_toast_setpos
sar_toast_tag_set_duration
sar_always_transmit_heavy_ents
sar_toast_tag_dismiss_all
sar_speedrun_time_pauses
sar_speedrun_smartsplit
sar_autorecord
sar_record_prefix
sar_speedrun_autostop
sar_speedrun_reset
sar_challenge_autostop
sar_fast_load_preset
sar_cm_rightwarp
sar_speedrun_offset
sar_hud_font_index
sar_chat
ghost_chat
sar_toast_x
sar_toast_y
sar_toast_align
sar_toast_anchor
sar_toast_disable
sar_toast_background
sar_toast_compact
sar_toast_font
sar_toast_create`.replace(/\t/g, '').split('\n')) {
	CON_COMMAND(cmd);
}
CON_COMMAND('sar_disable_coop_score_hud');
CON_COMMAND('sar_demo_blacklist_all');
CON_COMMAND('sar_disable_no_focus_sleep');

CON_COMMAND('sar_about', 'sar_about - prints info about SAR plugin\n', function(args) {
	let gamestr = 'Unknown';
	switch (src.game.str) {
		case 'portal2':
		case 'srm':
			gamestr = 'Portal 2 (8491)';
			break;
		case 'mel':
			gamestr = 'Portal Stories: Mel (8151)';
			break;
		case 'reloaded':
			gamestr = 'Portal Reloaded (8151)';
			break;
		case 'aptag':
			gamestr = 'Aperture Tag (7054)';
			break;
		case 'twtm':
			gamestr = 'Thinking with Time Machine (5723)';
			break;
	}
	sar.println('SourceAutoRecord is a speedrun plugin for Source Engine games.\n');
	sar.println('More information at: https://github.com/p2sr/SourceAutoRecord or https://wiki.portal2.sr/SAR\n');
	sar.println(`Game: ${gamestr}\n`);
	sar.println(`Version: ${sar.version}\n`);
	sar.println(`Built: ${sar.built}\n`);
});

sar.println(`Loaded SourceAutoRecord, Version ${sar.version}\n`, undefined, '#55CC55');

CON_COMMAND_HOOK('map', true, function(args) {if (!src.cmd.lastCommandErrored) sar.runevents('load')});
CON_COMMAND_HOOK('changelevel', true, function(args) {if (!src.cmd.lastCommandErrored) sar.runevents('load')});
CON_COMMAND_HOOK('restart', true, function(args) {if (!src.cmd.lastCommandErrored) sar.runevents('load')});
CON_COMMAND_HOOK('restart_level', true, function(args) {if (!src.cmd.lastCommandErrored) sar.runevents('load')});
