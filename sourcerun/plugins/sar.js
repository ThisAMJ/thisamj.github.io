/**
 * SAR plugin JavaScript port for use with source.js
 */
 
const sar = {
	version: '1.12.8-pre3',
	built: '03:52:12 Oct 30 2022',
	
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
			sar.ticks += 1;
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
			
			let color = sar.hud.rainbow ? `${hsvToRgb((sar.ticks % 600) / 600).join(' ')} 255` : src.cmd.cvar('sar_hud_font_color');
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
					if (parseInt(text[i + 1]) >= 0 && parseInt(text[i + 1]) <= 9) {
						let arg = parseInt(text[i + 1]);
						i++;
						while (parseInt(text[i + 1]) >= 0 && parseInt(text[i++]) <= 9) {
							arg = arg * 10 + text[i];
						}
						str += args.cmdStr.slice(args.argLengthS[arg - 1]);
					} else {
						str += '$+';
					}
					continue;
				}
				if (c >= 0 && c <= 9) {
					sub = true;
					let arg = parseInt(c);
					i++;
					while (parseInt(text[i + 1]) >= 0 && parseInt(text[i++]) <= 9) {
						arg = arg * 10 + text[i];
					}
					if (args[arg]) str += args[arg];
					continue;
				}
				if (c == '#') {
					sub = true;
					str += args.length - 1;
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
	sar.ticks = 0;

	CON_CVAR('sar_hud_spacing', '1', 'Spacing between elements of HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_hud_x', '2', 'X padding of HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_hud_y', '2', 'Y padding of HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_hud_font_index', '0', 'Font index of HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_hud_font_color', '255 255 255 255', 'RGBA font color of HUD.\n', FCVAR_DONTRECORD);
	
	CON_CVAR('sar_hud_bg', '0', 'Enable the SAR HUD background.\n', FCVAR_NEVER_AS_STRING);
	CON_CVAR('sar_hud_orange_only', '0', 'Only display the SAR HUD for orange, for solo coop (fullscreen PIP).\n', FCVAR_NEVER_AS_STRING);
	
	CON_CVAR('sar_hud_precision', '3', 'Precision of HUD numbers.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_hud_velocity_precision', '2', 'Precision of velocity HUD numbers.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	
	CON_CVAR('sar_hud_rainbow', -1, 'Enables the rainbow HUD mode. -1 = default, 0 = disable, 1 = enable.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, -1, 1);
	sar.hud.rainbow = false;
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
	
	CON_COMMAND_F('sar_hud_set_text', 'sar_hud_set_text <id> <text>... - sets and shows the nth text value in the HUD\n', FCVAR_DONTRECORD, function(args) {
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
	
	CON_COMMAND_F('sar_hud_set_text_color', 'sar_hud_set_text_color <id> [color] - sets the color of the nth text value in the HUD. Reset by not giving color.\n', FCVAR_DONTRECORD, function(args) {
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
	
	CON_COMMAND_F('sar_hud_show_text', 'sar_hud_show_text <id> - shows the nth text value in the HUD\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		if (args[1] === 'all') {
			return sar.hud.texts.map(e => e.shown = true);
		}
		let existing = sar.hud.texts.find(e => e.id === sar.atoi(args[1]));
		if (existing) existing.shown = true;
	});

	CON_COMMAND_F('sar_hud_hide_text', 'sar_hud_hide_text <id> - hides the nth text value in the HUD\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		if (args[1] === 'all') {
			return sar.hud.texts.map(e => e.shown = false);
		}
		let existing = sar.hud.texts.find(e => e.id === sar.atoi(args[1]));
		if (existing) existing.shown = false;
	});
	
	CON_COMMAND_F('sar_hud_order_bottom', 'sar_hud_order_bottom <name> - orders hud element to bottom\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 2) {
			return sar.println(`Set!\n`);
		}
		
		if (!sar.hud.order.includes(args[1].toLowerCase())) {
			return src.con.err(`Unknown HUD element name!\n`);
		}
		
		sar.hud.order = [...sar.hud.order.filter(e => e.toLowerCase() !== args[1].toLowerCase()), args[1].toLowerCase()];
		
		sar.println(`Moved HUD element ${args[1]} to bottom.\n`)
	}, sar.hud.ordercompletion);

	CON_COMMAND_F('sar_hud_order_top', 'sar_hud_order_top <name> - orders hud element to top\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 2) {
			return sar.println(`Orders hud element to top: sar_hud_order_top <name>\n`);
		}
		
		if (!sar.hud.order.includes(args[1].toLowerCase())) {
			return src.con.err(`Unknown HUD element name!\n`);
		}
		
		sar.hud.order = [args[1].toLowerCase(), ...sar.hud.order.filter(e => e != args[1].toLowerCase())];
		
		sar.println(`Moved HUD element ${args[1]} to top.\n`)
	}, sar.hud.ordercompletion);
	
	CON_COMMAND_F('sar_hud_order_reset', 'sar_hud_order_reset - resets order of hud element\n', FCVAR_DONTRECORD, function(args) {
		sar.hud.order = sar.hud.defaultorder;
		sar.println(`Reset default HUD element order!\n`);
	});
	
	CON_COMMAND_F('sar_pip_align', 'sar_pip_align <top|center|bottom> <left|center|right> - aligns the remote view.\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 3) {
			return sar.printHelp(args);
		}
		let sw = window.outerWidth, sh = window.outerHeight;
		let scale = Number(src.cmd.getConvar('ss_pipscale').value);
		let w = sw * scale, h = sh * scale, x, y;
		
		if (args[1].toLowerCase() === 'top') {
			y = sh - h - 25;
		} else if (args[1].toLowerCase() === 'center') {
			y = (sh - h) / 2;
		} else if (args[1].toLowerCase() === 'bottom') {
			y = 25;
		} else {
			return sar.printHelp(args);
		}
		
		if (args[1].toLowerCase() === 'left') {
			x = sw - w - 25;
		} else if (args[1].toLowerCase() === 'center') {
			x = (sw - w) / 2;
		} else if (args[1].toLowerCase() === 'right') {
			x = 25;
		} else {
			return sar.printHelp(args);
		}
		
		src.cmd.getConvar('ss_pip_right_offset').value = x;
		src.cmd.getConvar('ss_pip_bottom_offset').value = y;
	});
} // hud

{ // toasts
	let TOAST_GAP = 10, LINE_PAD = 6, COMPACT_TOAST_PAD = 2, SIDE_PAD = 6, COMPACT_SIDE_PAD = 3, SLIDE_RATE = 200, FADE_TIME = 300;
	CON_CVAR('sar_toast_disable', '0', 'Disable all toasts from showing.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD);
	CON_CVAR('sar_toast_font', '6', 'The font index to use for toasts.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_toast_width', '250', 'The maximum width for toasts.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 2 * SIDE_PAD + 10);
	CON_CVAR('sar_toast_x', TOAST_GAP, 'The horizontal position of the toasts HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_toast_y', TOAST_GAP, 'The vertical position of the toasts HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_toast_align', '0', 'The side to align toasts to horizontally. 0 = left, 1 = center, 2 = right.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0, 2);
	CON_CVAR('sar_toast_anchor', '1', 'Where to put new toasts. 0 = bottom, 1 = top.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0, 1);
	CON_CVAR('sar_toast_compact', '0', 'Enables a compact form of the toasts HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD);
	CON_CVAR('sar_toast_background', '1', 'Sets the background highlight for toasts. 0 = no background, 1 = text width only, 2 = full width.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0, 2);
	CON_CVAR('sar_toast_net_disable', '0', 'Disable network toasts.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD);
	CON_COMMAND_F('sar_toast_tag_set_color', 'sar_toast_tag_set_color <tag> <color> - set the color of the specified toast tag to an sRGB color\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 3 && args.length !== 5) {
			return sar.printHelp(args);
		}
		
		let tag = args[1];
		// ...
	});
	CON_COMMAND_F('sar_toast_tag_set_duration', 'sar_toast_tag_set_duration <tag> <duration> - set the duration of the specified toast tag in seconds. The duration may be given as \'forever\'\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 3) {
			return sar.printHelp(args);
		}
		
		let tag = args[1];
		// ...
	});
	CON_COMMAND_F('sar_toast_tag_dismiss_all', 'sar_toast_tag_dismiss_all <tag> - dismiss all active toasts with the given tag\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
		
		let tag = args[1];
		// ...
	});
	CON_COMMAND_F('sar_toast_setpos', 'sar_toast_setpos <bottom|top> <left|center|right> - set the position of the toasts HUD\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 3) {
			return sar.printHelp(args);
		}
		
		let screenWidth = window.outerWidth, screenHeight = window.outerHeight;
		
		if (args[1] === 'bottom') {
			src.cmd.getConvar('sar_toast_anchor').value = 0;
			src.cmd.getConvar('sar_toast_y').value = screenHeight - TOAST_GAP;
		} else {
			src.cmd.getConvar('sar_toast_anchor').value = 1;
			src.cmd.getConvar('sar_toast_y').value = TOAST_GAP;
		}
		
		if (args[2] === 'left') {
			src.cmd.getConvar('sar_toast_align').value = 0;
			src.cmd.getConvar('sar_toast_x').value = TOAST_GAP;
		} else if (args[2] === 'center') {
			src.cmd.getConvar('sar_toast_align').value = 1;
			src.cmd.getConvar('sar_toast_x').value = (screenWidth - parseInt(src.cmd.getConvar('sar_toast_width').value)) / 2;
		} else {
			src.cmd.getConvar('sar_toast_align').value = 2;
			src.cmd.getConvar('sar_toast_x').value = screenWidth - parseInt(src.cmd.getConvar('sar_toast_width').value) - TOAST_GAP;
			
		}
	});
	CON_COMMAND_F('sar_toast_create', 'sar_toast_create <tag> <text> - create a toast\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 3) {
			return sar.printHelp(args);
		}
	});
	CON_COMMAND_F('sar_toast_net_create', 'sar_toast_net_create <tag> <text> - create a toast, also sending it to your coop partner\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 3) {
			return sar.printHelp(args);
		}
	});
	CON_COMMAND_F('sar_toast_dismiss_all', 'sar_toast_dismiss_all - dismiss all active toasts\n', FCVAR_DONTRECORD, function(args) {
		
	});
} // toasts

{
		CON_CVAR('sar_record_at', '-1', 'Start recording a demo at the tick specified. Will use sar_record_at_demo_name.\n', FCVAR_NONE, -1);
		CON_CVAR('sar_record_at_demo_name', 'chamber', 'Name of the demo automatically recorded.\n');
		CON_CVAR('sar_record_at_increment', '0', 'Increment automatically the demo name.\n', FCVAR_NEVER_AS_STRING);
		
		CON_CVAR('sar_pause_at', '-1', 'Pause at the specified tick. -1 to deactivate it.\n', FCVAR_NEVER_AS_STRING, -1);
		CON_CVAR('sar_pause_for', '0', 'Pause for this amount of ticks.\n', FCVAR_NEVER_AS_STRING, 0);
		
		CON_CVAR('sar_tick_debug', '0', 'Output debugging information to the console related to ticks and frames.\n', FCVAR_NEVER_AS_STRING, 0, 3);
		
		CON_CVAR('sar_cm_rightwarp', '0', 'Fix CM wrongwarp.\n', FCVAR_NEVER_AS_STRING);
		
		CON_CVAR('sar_bink_respect_host_time', '1', 'Make BINK video playback respect host time.\n', FCVAR_NEVER_AS_STRING);
}

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
		out = out.filter(e => e[1] <= Math.min(2, Number(src.cmd.cvar('developer')))); // Filter to developer level
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
			CON_COMMAND_F(`svar_f${name}`, `svar_f${name} <variable> <variable|value> - perform the given operation on an svar\n`, FCVAR_DONTRECORD, function(args) {
				if (args.length !== 3) {
					return sar.printHelp(args);
				}
				let cur = sar.svars.hasOwnProperty(args[1]) ? Number(sar.svars[args[1]]) : 0;
				let other = sar.svars.hasOwnProperty(args[2]) ? Number(sar.svars[args[2]]) : Number(args[2]);
				if (isNaN(cur)) cur = 0;
				if (isNaN(other)) other = 0;
				sar.SetSvar(args[1], (disallowSecondZero && other === 0) ? 0 : eval(`cur ${op} other`));
			});
		};
		
		SVAR_OP('add', '+');
		SVAR_OP('sub', '-');
		SVAR_OP('mul', '*');
		SVAR_OP('div', '/', true);
		SVAR_OP('mod', '%', true);
		
		let SVAR_SINGLE_OP = function(name, op) {
			CON_COMMAND_F(`svar_${name}`, `svar_${name} <variable> - perform the given operation on an svar`, FCVAR_DONTRECORD, function(args) {
				if (args.length !== 2) {
					return sar.printHelp(args);
				}
				let cur = sar.svars.hasOwnProperty(args[1]) ? Number(sar.svars[args[1]]) : 0;
				if (isNaN(cur)) cur = 0;
				sar.SetSvar(args[1], eval(op));
			});
		};
		
		SVAR_SINGLE_OP('round', 'Math.round(cur)');
		SVAR_SINGLE_OP('floor', 'Math.floor(cur)');
		SVAR_SINGLE_OP('ceil', 'Math.ceil(cur)');
		SVAR_SINGLE_OP('abs', 'Math.abs(cur)');
		
	}
} // svar operations

{ // sar_on_things

	
	sar.event_execs = {};
	sar.runevents = function(event) {
		if (!sar.event_execs[event]) {
			return src.con.err(`Event "${event}" does not exist.\n`);
		}
		for (let exec of sar.event_execs[event]) {
			src.cmd.executeCommand(exec, true, true);
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
		CON_COMMAND_F(`sar_on_${name}_list`, `sar_on_${name}_list - lists commands registered on event "${name}"\n`, FCVAR_DONTRECORD, function(args) {
			sar.println(`${sar.event_execs[name].length} commands on event "${name}"\n`);
			for (let cmd of sar.event_execs[name]) {
				sar.println(`${cmd}\n`);
			}
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
				let it = sar.functions.find(e => e.name.toLowerCase() === args[0].toLowerCase());
				if (it) src.cmd.executeCommand(sar.expand(it.cmd, args).out);
				// src.cmd.executeCommand(`sar_function_run ${args.cmdStr}`);
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
		
		let newargs = args.slice(1);
		newargs.argc = args.argc - 1;
		newargs.cmdStr = args.cmdStr.slice(args.argLength[0]);
		newargs.argLength = args.argLength.slice(1);
		newargs.argLengthS = args.argLengthS.slice(1);
		
		src.cmd.executeCommand(sar.expand(it.cmd, newargs).out);
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
				let it = sar.aliases.find(e => e.name.toLowerCase() === args[0].toLowerCase());
				if (it) src.cmd.executeCommand(`${it.cmd} ${args.cmdStr.slice(args.argLength[0])}`);
				// src.cmd.executeCommand(`sar_alias_run ${args.cmdStr}`);
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
				case this.conditions.CM: return src.cmd.cvar('sv_bonus_challenge') == 1;
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
	
	CON_COMMAND_F('conds', 'conds [<condition> <command>]... [else] - runs the first command which has a satisfied condition\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
		
		let i = 1;
		while (i < args.length) {
			if (i === args.length - 1) {
				// else
				return src.cmd.executeCommand(args[i], true);
			}
			
			let cond_str = args[i];
			let cond = sar.cond.parse(cond_str);
			if (!cond) {
				return sar.println(`Condition parsing of "${cond_str}" failed\n`);
			}
			let should_run = sar.cond.eval(cond);
			if (should_run) {
				return src.cmd.executeCommand(args[i + 1], true);
			}
			i += 2;
		}
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
				color = '#888888';
				display = Number(src.cmd.cvar('developer')) >= 3;
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

{ // ihud
	CON_CVAR('sar_ihud', '0', 'Enables or disables movement inputs HUD of client.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0, 1);
	CON_CVAR('sar_ihud_x', '2', 'X position of input HUD.\n', FCVAR_DONTRECORD);
	CON_CVAR('sar_ihud_y', '2', 'Y position of input HUD.\n', FCVAR_DONTRECORD);
	CON_CVAR('sar_ihud_grid_padding', '2', 'Padding between grid squares of input HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_ihud_grid_size', '60', 'Grid square size of input HUD.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0);
	CON_CVAR('sar_ihud_analog_image_scale', '0.6', 'Scale of analog input images against max extent.\n', FCVAR_NEVER_AS_STRING | FCVAR_DONTRECORD, 0, 1);
	CON_CVAR('sar_ihud_analog_view_deshake', '0', 'Try to eliminate small fluctuations in the movement analog.\n', FCVAR_NEVER_AS_STRING);
	CON_COMMAND_F('sar_ihud_preset', 'sar_ihud_preset <preset> - modifies input hud based on given preset\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
	});
	CON_COMMAND_F('sar_ihud_modify', 'sar_ihud_modify <element|all> [param=value]... - modifies parameters in given element.\nParams: enabled, text, pos, x, y, width, height, font, background, highlight, textcolor, texthighlight, image, highlightimage, minhold.\n', FCVAR_DONTRECORD, function(args) {
		if (args.length < 3) {
			return sar.printHelp(args);
		}
	});
	CON_COMMAND_F('sar_ihud_add_key', 'sar_ihud_add_key <key>\n', function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
		
		let keyCode = src.key.list.src.findIndex(e => e.toLowerCase() === args[1].toLowerCase());
		if (keyCode === -1) {
			return sar.println(`Key ${args[1]} does not exist.\n`);
		}
	});
	CON_COMMAND_F('sar_ihud_setpos', 'Automatically sets the position of input HUD.\nUsage: sar_ihud_setpos <top|center|bottom|y|y%> <left|center|right|x|x%>\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 3) return sar.printHelp(args);
		src.cmd.getConvar('sar_ihud_x').value = args[2];
		src.cmd.getConvar('sar_ihud_y').value = args[1];
	});
	CON_COMMAND_F('sar_ihud_set_background', 'sar_ihud_set_background <path> <grid x> <grid y> <grid w> <grid h>\n', FCVAR_DONTRECORD, function(args) {
		if (args.length !== 6) {
			return sar.printHelp(args);
		}
	});
	CON_COMMAND_F('sar_ihud_clear_background', 'sar_ihud_clear_background\n', FCVAR_DONTRECORD);
} // ihud

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
	
	CON_CVAR('sar_speedrun_smartsplit', '1', 'Only split the speedrun timer a maximum of once per map.\n', FCVAR_NEVER_AS_STRING);
	CON_CVAR('sar_speedrun_time_pauses', '0', 'Include time spent paused in the speedrun timer.\n', FCVAR_NEVER_AS_STRING);
	CON_CVAR('sar_speedrun_stop_in_menu', '0', 'Automatically stop the speedrun timer when the menu is loaded.\n', FCVAR_NEVER_AS_STRING);
	CON_CVAR('sar_speedrun_start_on_load', '0', 'Automatically start the speedrun timer when a map is loaded. 2 = restart if active.\n', FCVAR_NEVER_AS_STRING, 0, 2);
	CON_CVAR('sar_speedrun_offset', '0', 'Start speedruns with this time on the timer.\n', FCVAR_NONE, 0);
	CON_CVAR('sar_speedrun_autostop', '0', 'Automatically stop recording demos when a speedrun finishes. If 2, automatically append the run time to the demo name.\n', FCVAR_NEVER_AS_STRING, 0, 2);
	
	CON_CVAR('sar_mtrigger_legacy', '0', '\n', FCVAR_NEVER_AS_STRING, 0, 1);
	
	CON_COMMAND('sar_speedrun_start', 'sar_speedrun_start - start the speedrun timer\n', function(args) {
		
	});
	
	CON_COMMAND('sar_speedrun_stop', 'sar_speedrun_stop - stop the speedrun timer\n', function(args) {
		
	});
	
	CON_COMMAND('sar_speedrun_split', 'sar_speedrun_split - perform a split on the speedrun timer\n', function(args) {
		
	});
	
	CON_COMMAND('sar_speedrun_pause', 'sar_speedrun_pause - pause the speedrun timer\n', function(args) {
		
	});
	
	CON_COMMAND('sar_speedrun_resume', 'sar_speedrun_resume - resume the speedrun timer\n', function(args) {
		
	});
	
	CON_COMMAND('sar_speedrun_reset', 'sar_speedrun_reset - reset the speedrun timer\n', function(args) {
		
	});
	
	CON_COMMAND('sar_speedrun_result', 'sar_speedrun_result - print the speedrun result\n', function(args) {
		
	});
	
	CON_COMMAND('sar_speedrun_export', 'sar_speedrun_export <filename> - export the speedrun result to the specified CSV file\n', function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
	});
	
	CON_COMMAND('sar_speedrun_recover', 'sar_speedrun_recover <ticks|time> - recover a crashed run by resuming the timer at the given time on next load\n', function(args) {
		if (args.length < 2) {
			return sar.printHelp(args);
		}
	});
	
	CON_COMMAND('sar_speedrun_export_all', 'sar_speedrun_export_all <filename> - export the results of many speedruns to the specified CSV file\n', function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
	});
	
	CON_COMMAND('sar_speedrun_reset_export', 'sar_speedrun_reset_export - reset the log of complete and incomplete runs to be exported\n', function(args) {
		
	});
	
	CON_COMMAND('sar_speedrun_autoreset_load', 'sar_speedrun_autoreset_load <file> - load the given file of autoreset timestamps and use it while the speedrun timer is active\n', function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
	});
	
	CON_COMMAND('sar_speedrun_autoreset_clear', 'sar_speedrun_autoreset_clear - stop using the autoreset file\n', function(args) {
		
	});
	
	CON_COMMAND('sar_mtrigger_legacy_format', 'sar_mtrigger_legacy_format <string format> - formatting of the text that is displayed in the chat (!map - for map name, !seg - for segment name, !tt - for total time, !st - for split time). ( def. "!seg -> !tt (!st)" )\n', function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
	});
	
	CON_COMMAND('sar_mtrigger_legacy_textcolor', 'sar_mtrigger_legacy_textcolor <hex code> - the color of the text that is displayed in the chat.\n', function(args) {
		if (args.length !== 2) {
			return sar.printHelp(args);
		}
	});
	
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

CON_CVAR('sar_autorecord', '0', 'Enables or disables automatic demo recording.\n', FCVAR_NEVER_AS_STRING, -1, 1);
CON_CVAR('sar_autojump', '0', 'Enables automatic jumping on the server.\n', FCVAR_NEVER_AS_STRING);
CON_CVAR('sar_jumpboost', '0', 'Enables special game movement on the server.\n0 = Default,\n1 = Orange Box Engine,\n2 = Pre-OBE.\n', FCVAR_NEVER_AS_STRING, 0);
CON_CVAR('sar_aircontrol', '0', 'Enables more air-control on the server.\n', FCVAR_NEVER_AS_STRING, 0, 2);
CON_CVAR('sar_duckjump', '0', 'Allows duck-jumping even when fully crouched, similar to prevent_crouch_jump.\n', FCVAR_NEVER_AS_STRING);
CON_CVAR('sar_disable_challenge_stats_hud', '0', 'Disables opening the challenge mode stats HUD.\n', FCVAR_NEVER_AS_STRING)
CON_CVAR('sar_disable_steam_pause', '0', 'Prevents pauses from steam overlay.\n', FCVAR_NEVER_AS_STRING);
CON_CVAR('sar_disable_no_focus_sleep', '0', 'Does not yield the CPU when game is not focused.\n', FCVAR_NEVER_AS_STRING);
CON_CVAR('sar_disable_progress_bar_update', '0', 'Disables excessive usage of progress bar.\n', FCVAR_NEVER_AS_STRING, 0, 2);
CON_CVAR('sar_prevent_mat_snapshot_recompute', '0', 'Shortens loading times by preventing state snapshot recomputation.\n', FCVAR_NEVER_AS_STRING);
CON_CVAR('sar_challenge_autostop', '0', 'Automatically stops recording demos when the leaderboard opens after a CM run. If 2, automatically appends the run time to the demo name.\n', FCVAR_NEVER_AS_STRING, 0, 3);
CON_CVAR('sar_show_entinp', '0', 'Print all entity inputs to console.\n', FCVAR_NEVER_AS_STRING);
CON_CVAR('sar_force_qc', '0', 'When ducking, forces view offset to always be at standing height. Requires sv_cheats to work.\n', FCVAR_NEVER_AS_STRING, 0, 1);
CON_CVAR('sar_patch_bhop', '0', 'Patches bhop by limiting wish direction if your velocity is too high.\n', FCVAR_NEVER_AS_STRING, 0, 1);
CON_CVAR('sar_patch_cfg', '0', 'Patches Crouch Flying Glitch.\n', FCVAR_NEVER_AS_STRING, 0, 1);
CON_CVAR('sar_prevent_ehm', '0', 'Prevents Entity Handle Misinterpretation (EHM) from happening.\n', FCVAR_NEVER_AS_STRING, 0, 1);
CON_CVAR('sar_disable_weapon_sway', '0', 'Disables the viewmodel lagging behind.\n', FCVAR_NEVER_AS_STRING, 0, 1);

CON_CVAR('sar_demo_overwrite_bak', '0', 'Rename demos to (name)_bak if they would be overwritten by recording\n', FCVAR_NEVER_AS_STRING, 0);
CON_CVAR('sar_record_prefix', '', 'A string to prepend to recorded demo names. Can include strftime format codes.\n');
CON_CVAR('sar_record_mkdir', '1', 'Automatically create directories for demos if necessary.\n', FCVAR_NEVER_AS_STRING);
CON_COMMAND('sar_stop', 'sar_stop <name> - stop recording the current demo and rename it to \'name\' (not considering sar_record_prefix)\n', function(args) {
	if (args.length !== 2) {
		return sar.printHelp(args);
	}

	let name = args[1]
	if (name === '') {
		return sar.println("Demo name cannot be blank\n");
	}
	name += '.dem';
});

CON_CVAR('sar_loads_uncap', '0', 'Temporarily set fps_max to 0 during loads\n', FCVAR_NEVER_AS_STRING, 0, 1);
CON_CVAR('sar_loads_norender', '0', 'Temporarily set mat_norendering to 1 during loads\n', FCVAR_NEVER_AS_STRING, 0, 1);
CON_CVAR('sar_load_delay', '0', 'Delay for this number of milliseconds at the end of a load.\n', FCVAR_NEVER_AS_STRING, 0);

CON_COMMAND('sar_togglewait', 'sar_togglewait - enables or disables "wait" for the comman buffer\n', function(args) {
	let state = !src.cmd.waitEnabled;
	src.cmd.waitEnabled = state;
	sar.println(`${state ? 'Enabled' : 'Disabled'} wait!\n`);
});

CON_COMMAND('sar_delete_alias_cmds', 'sar_delete_alias_cmds - deletes all alias commands\n', function(args) {
	src.aliases = [];
});

CON_COMMAND_F('sar_fast_load_preset', 'sar_fast_load_preset <preset> - sets all loading fixes to preset values\n', FCVAR_DONTRECORD, function(args) {
	if (args.length !== 2) {
		return sar.printHelp(args);
	}
	
	let preset = args[1];
	let CMD = (x) => src.cmd.executeCommand(x);
	if (preset === "none") {
		if (src.game.cur !== "srm") {
			CMD('ui_loadingscreen_transition_time 1.0');
			CMD('ui_loadingscreen_fadein_time 1.0');
			CMD('ui_loadingscreen_mintransition_time 0.5');
		}
		CMD('sar_disable_progress_bar_update 0');
		CMD('sar_prevent_mat_snapshot_recompute 0');
		CMD('sar_loads_uncap 0');
		CMD('sar_loads_norender 0');
	} else if (preset === "sla") {
		if (src.game.cur !== "srm") {
			CMD('ui_loadingscreen_transition_time 0.0');
			CMD('ui_loadingscreen_fadein_time 0.0');
			CMD('ui_loadingscreen_mintransition_time 0.0');
		}
		CMD('sar_disable_progress_bar_update 1');
		CMD('sar_prevent_mat_snapshot_recompute 1');
		CMD('sar_loads_uncap 0');
		CMD('sar_loads_norender 0');
	} else if (preset === "normal") {
		if (src.game.cur !== "srm") {
			CMD('ui_loadingscreen_transition_time 0.0');
			CMD('ui_loadingscreen_fadein_time 0.0');
			CMD('ui_loadingscreen_mintransition_time 0.0');
		}
		CMD('sar_disable_progress_bar_update 1');
		CMD('sar_prevent_mat_snapshot_recompute 1');
		CMD('sar_loads_uncap 1');
		CMD('sar_loads_norender 0');
	} else if (preset === "full") {
		if (src.game.cur !== "srm") {
			CMD('ui_loadingscreen_transition_time 0.0');
			CMD('ui_loadingscreen_fadein_time 0.0');
			CMD('ui_loadingscreen_mintransition_time 0.0');
		}
		CMD('sar_disable_progress_bar_update 2');
		CMD('sar_prevent_mat_snapshot_recompute 1');
		CMD('sar_loads_uncap 1');
		CMD('sar_loads_norender 1');
	} else {
		sar.println(`Unknown preset ${preset}!\n`);
		sar.printHelp(args);
	}
}, function(args) {
		if (args.length === 1) return ['none', 'sla', 'normal', 'full'];
		if (args.length === 2) return ['none', 'sla', 'normal', 'full'].filter(e => ~e.indexOf(args[1]));
});

CON_COMMAND('sar_clear_lines', 'sar_clear_lines - clears all active drawline overlays\n', function(args) {
	for (let i = 0; i < 20; i++) {
		src.cmd.executeCommand('drawline 0 0 0 0 0 0', true);
	}
});

CON_COMMAND('sar_drawline', 'sar_drawline <x> <y> <z> <x> <y> <z> [r] [g] [b] - overlay a line in the world\n', function(args) {
	if (args.length !== 7 && args.length !== 10) {
		return sar.printHelp(args);
	}
});

CON_COMMAND('sar_drawline_clear', 'sar_drawline_clear - clear all active sar_drawlines\n', function(args) {
	
});

CON_COMMAND('sar_getpos', 'sar_getpos [slot] [server|client] - get the absolute origin and angles of a particular player from either the server or client . Defaults to slot 0 and server.\n', function(args) {
	if (args.length > 3) {
		return sar.printHelp(args);
	}
	
	let use_serv = true;
	if (args.length === 3) {
		if (args[2] === 'client') {
			use_serv = false;
		} else if (args[2] !== 'server') {
			return sar.printHelp(args);
		}
	}
		
	let slot = args.length >= 2 ? parseInt(args[1]) : 0;
	
	let origin = {x: 0, y: 0, z: 0};
	let angles = {x: 0, y: 0, z: 0};
	
	sar.println(`origin: ${origin.x} ${origin.y} ${origin.z}\n`);
	sar.println(`angles: ${angles.x} ${angles.y} ${angles.z}\n`);
});

CON_COMMAND('sar_geteyepos', 'sar_getpos [slot] [server|client] - get the absolute origin and angles of a particular player from either the server or client . Defaults to slot 0 and server.\n', function(args) {
	if (args.length > 2) {
		return sar.printHelp(args);
	}
	
	let slot = args.length >= 2 ? parseInt(args[1]) : 0;
	
	let eye = {x: 0, y: 0, z: 0};
	let angles = {x: 0, y: 0, z: 0};
	
	sar.println(`eye: ${eye.x} ${eye.y} ${eye.z}\n`);
	sar.println(`angles: ${angles.x} ${angles.y} ${angles.z}\n`);
});

CON_COMMAND('sar_chat', 'sar_chat - open the chat HUD\n', function(args) {

});

CON_COMMAND('ghost_chat', 'ghost_chat - open the chat HUD for messaging other players\n\n', function(args) {

});

CON_CVAR('sar_always_transmit_heavy_ents', '0', 'Always transmit large but seldom changing edicts to clients to prevent lag spikes.\n', FCVAR_NEVER_AS_STRING, 0, 1);

CON_CVAR('sar_timer_always_running', '1', 'Timer will save current value when disconnecting.\n', FCVAR_NEVER_AS_STRING, 0, 1);
CON_CVAR('sar_timer_time_pauses', '1', 'Timer adds non-simulated ticks when server pauses.\n', FCVAR_NEVER_AS_STRING, 0, 1);

CON_CVAR('sar_dpi_scale', '1', 'Fraction to scale mouse DPI down by.\n', FCVAR_NEVER_AS_STRING, 1);

CON_CVAR('sar_demo_remove_broken', '1', 'Whether to remove broken frames from demo playback\n', FCVAR_NEVER_AS_STRING, 0, 1);

for (let cmd of `ghost_type
ghost_sync
ghost_name
sar_trace_record
sar_tas_stop
sar_tas_play
sar_tas_playback_rate
sar_trace_draw
sar_trace_font_size`.replace(/\t/g, '').split('\n')) {
	CON_COMMAND(cmd);
}
CON_COMMAND('sar_disable_coop_score_hud');
CON_COMMAND('sar_demo_blacklist_all');

CON_COMMAND('sar_session', 'sar_session - prints the current tick of the server since it has loaded\n', function(args) {
	sar.println(`Session Tick: ${sar.ticks} (${(sar.ticks / 60).toFixed(3)})\n`);
	// TODO: Demo Recorder / Player
});

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

src.cmd.getConvar('help').callback = function(args) {
	if (args.length !== 2) {
		return sar.println('Prints help string of cvar. Usage: help <cvar>\n');
	}
	let cvar = src.cmd.getConvar(args[1]);
	if (cvar) {
		if (cvar.isCommand) {
			sar.println(`${cvar.name}\n`);
			sar.println(`Flags: ${cvar.flags}\n`);
			sar.println(`Description: ${cvar.helpStr}\n`);
		} else {
			sar.println(`${cvar.name}\n`);
			sar.println(`Default: ${cvar.default}\n`);
			sar.println(`Flags: ${cvar.flags}\n`);
			sar.println(`Description: ${cvar.helpStr}\n`);
		}
	} else {
		sar.println('Unknown cvar name!\n');
	}
}
