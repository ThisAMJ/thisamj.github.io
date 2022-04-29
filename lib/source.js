
/**
 * Source engine implementation in JavaScript
 */
 
 
/*
	TODO: Check when developer is checked for console
	developer 0
	developer 1; exec config
*/

/* I'll leave this here, but I have no intention of implementing flags.
const FCVAR_NONE                       = 0
const FCVAR_UNREGISTERED               = 1
const FCVAR_DEVELOPMENTONLY            = 1 << 1
const FCVAR_GAMEDLL                    = 1 << 2
const FCVAR_CLIENTDLL                  = 1 << 3
const FCVAR_HIDDEN                     = 1 << 4
const FCVAR_PROTECTED                  = 1 << 5
const FCVAR_SPONLY                     = 1 << 6
const FCVAR_ARCHIVE                    = 1 << 7
const FCVAR_NOTIFY                     = 1 << 8
const FCVAR_USERINFO                   = 1 << 9
const FCVAR_PRINTABLEONLY              = 1 << 10
const FCVAR_GAMEDLL_FOR_REMOTE_CLIENTS = 1 << 10
const FCVAR_UNLOGGED                   = 1 << 11
const FCVAR_NEVER_AS_STRING            = 1 << 12
const FCVAR_REPLICATED                 = 1 << 13
const FCVAR_CHEAT                      = 1 << 14
const FCVAR_SS                         = 1 << 15
const FCVAR_DEMO                       = 1 << 16
const FCVAR_DONTRECORD                 = 1 << 17
const FCVAR_SS_ADDED                   = 1 << 18
const FCVAR_RELEASE                    = 1 << 19
const FCVAR_RELOAD_MATERIALS           = 1 << 20
const FCVAR_RELOAD_TEXTURES            = 1 << 21
const FCVAR_NOT_CONNECTED              = 1 << 22
const FCVAR_MATERIAL_SYSTEM_THREAD     = 1 << 23
const FCVAR_ARCHIVE_GAMECONSOLE        = 1 << 24
const FCVAR_SERVER_CAN_EXECUTE         = 1 << 28
const FCVAR_SERVER_CANNOT_QUERY        = 1 << 29
const FCVAR_CLIENTCMD_CAN_EXECUTE      = 1 << 30
const FCVAR_ACCESSIBLE_FROM_THREADS    = 1 << 25 
*/

const source = {
	
	/** portal2, srm, mel, reloaded, aptag, twtm, other */
	game: 'portal2',

	map: '',
	
	/** Bound keys */
	binds: [{key: 'ESCAPE', cmd: 'cancelselect'}],
	aliases: [],

	/** Loaded plugins */
	plugins: [],

	/** Functions that are ran every tick */
	onTickEvents: {pre: [], post: []},

	/** Runs every tick (60th of a second) and executes every command in the buffer. */
	__tick: function() {
		source.con.flush();
		for (let event of source.onTickEvents.pre) event();
		source.cmd.executeAll();
		for (let event of source.onTickEvents.post) event();
		requestAnimationFrame(source.__tick);
	},
	
	/** Utility functions */
	__: {
		tooFewArgs: function(args, wanted = NaN) {
			this.parent.con.err(`${args[0]}: Too few args. Got '${args.cmdStr}'\nUsage : ${this.parent.getCmd(args[0]).helpStr || 'Unknown. Tell AMJ!'}\n`)},
		wrongArgCount: function(args, wanted = NaN) {
			this.parent.con.err(`${args[0]}: Wrong arg number. Got '${args.cmdStr}'\nUsage : ${this.parent.getCmd(args[0]).helpStr || 'Unknown. Tell AMJ!'}\n`)},
		commandAlreadyExists: function(args) {
			this.parent.con.err(`${args[0]}: ${args[1]} already exists, not shadowing!\n`)},
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
		/** s_pButtonCodeName */
		keys: " 0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y z KP_INS KP_END KP_DOWNARROW KP_PGDN KP_LEFTARROW KP_5 KP_RIGHTARROW KP_HOME KP_UPARROW KP_PGUP KP_SLASH KP_MULTIPLY KP_MINUS KP_PLUS KP_ENTER KP_DEL [ ] SEMICOLON ' ` , . / \\ - = ENTER SPACE BACKSPACE TAB CAPSLOCK NUMLOCK ESCAPE SCROLLLOCK INS DEL HOME END PGUP PGDN PAUSE SHIFT RSHIFT ALT RALT CTRL RCTRL LWIN RWIN APP UPARROW LEFTARROW DOWNARROW RIGHTARROW F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 MOUSE1 MOUSE2 MOUSE3 MOUSE4 MOUSE5 MWHEELUP MWHEELDOWN".split(' '),
		htmlKeys: ' Digit0 Digit1 Digit2 Digit3 Digit4 Digit5 Digit6 Digit7 Digit8 Digit9 KeyA KeyB KeyC KeyD KeyE KeyF KeyG KeyH KeyI KeyJ KeyK KeyL KeyM KeyN KeyO KeyP KeyQ KeyR KeyS KeyT KeyU KeyV KeyW KeyX KeyY KeyZ Numpad0 Numpad1 Numpad2 Numpad3 Numpad4 Numpad5 Numpad6 Numpad7 Numpad8 Numpad9 NumpadDivide NumpadMultiply NumpadSubtract NumpadAdd NumpadEnter NumpadDecimal BracketLeft BracketRight Semicolon Quote Backquote Comma Period Slash Backslash Minus Equal Enter Space Backspace Tab CapsLock NumLock Escape ScrollLock Insert Delete Home End PageUp PageDown Pause ShiftLeft ShiftRight AltLeft AltRight ControlLeft ControlRight MetaLeft MetaRight  ArrowUp ArrowLeft ArrowDown ArrowRight F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12       '.split(' '),
		pressedKeys: [],
		hooks: {},
		errorLog: [],
	},
	
	changeGame: function(game) {
		this.game = game;
		this.__initMaps();
	},
	
	exec: function(args, echoFail = true) {
		if (args.length < 2) {
			return this.__.tooFewArgs(args);
		}
		s = k = args[1];
		this.con.log(`Execing config: ${k}\n`, 1);
		if (s.endsWith('.cfg')) s = s.slice(0, -4);
		if (!k.endsWith('.cfg')) k += '.cfg';
		txt = this.cfg.get(s);
		
		if (txt == null) {
			// Fail silently on execifexits and for autoexec, joystick and game
			if (echoFail && !~['autoexec.cfg', 'joystick.cfg', 'game.cfg'].indexOf(k))
				this.con.err(`exec: Couldn't exec ${k}. Are you sure it exists?\n`);
			return;
		}
		
		if (txt.length > 1024 * 1024)
			return this.con.err(`exec: ${k} larger than 1 MB!\n`);
		
		// Ingame, the text is added one line at a time and the added commands are ran
		// This will probably make the command buffer grow much less (I'm not sure of the size of the buffer ingame)
		// However, this will remove the slowdown functionality this implementation offers
		
		// let lines = txt.split('\n');
		// for (let line of lines) {
			// let j = this.cmd.buffer.length;
			// this.cmd.executeCommand(line, false, true);
			// while (this.cmd.buffer.length > j)
				// this.cmd.execute(this.cmd.buffer.splice(j, 1)[0]);
		// }
		
		// Alternatively, we could just add the entire text at once
		this.cmd.executeCommand(txt);
	},
	
	keyDown: function(event) {
		event.preventDefault();
		if (event.repeat) return;
		if (!~this.__.htmlKeys.indexOf(event.code)) return this.con.warn(`You just pressed ${event.code}, which isn't registered. Tell AMJ!\n`);
		let bind = this.binds.find(e => e.key == this.__.keys[this.__.htmlKeys.indexOf(event.code)].toUpperCase());
		if (!bind) return;
		this.__.pressedKeys.push(bind.key);
		this.cmd.executeCommand(bind.cmd);
	},
	
	keyUp: function(event) {
		event.preventDefault();
		if (!~this.__.htmlKeys.indexOf(event.code)) return false;
		let bind = this.binds.find(e => e.key == this.__.keys[this.__.htmlKeys.indexOf(event.code)].toUpperCase());
		if (!bind) return;
		this.__.pressedKeys = this.__.pressedKeys.filter(e => e != bind.key); // laziness
		if (bind.cmd.startsWith('+')) this.cmd.executeCommand(bind.cmd.replace('+', '-'));
	},
	
	/** Implementation of the command buffer */
	cmd: {
		
		maxArgCount: 64,
		maxCmdLength: 512,
		maxAliasLength: 32,
		breakset: "(){}:'",
		
		/** Command buffer array */
		buffer: [],

		/** Debug stack trace of commands executed */
		trace: [],
		
		/** Whether or not the command buffer is currently being flushed */
		executing: false,
		
		slowdown: false,
		
		/**
		 * Converts a string into an array of commands (e.g. 'echo Hello; echo World!' => [['echo', 'Hello'], ['echo', 'World!']])
		 * @param {String} text 
		 */
		parseArguments: function(text = '') {
			let out = [];
			
			// Remove comments and split commands/lines
			text = text.replace(/[^\x00-\x7F]/g, ''); // https://stackoverflow.com/a/20856346
			let cmds = !text ? [] : text.split('\n').flatMap(e => {
				let f = e.split('//'), str = f[0];
				for (let i = 1; i < f.length; i++) {
					if (str.split('"').length % 2 == 1) break;
					str += '//' + f[i];
				}
				f = str.split(';');
				let out = [f[0]];
				for (let i = 1; i < f.length; i++) {
					if (out.join('').split('"').length % 2 == 1) {
						out.push(f[i]);
					} else out[out.length - 1] += ';' + f[i];
				}
				return out;
			});
			
			for (let cmd of cmds) {
				if (!cmd) continue;
				if (cmd.length >= this.maxCmdLength - 1) {
					this.parent.con.warn('Cbuf: Tokenizer encountered command which overflows the tokenizer buffer... Skipping!\n');
					this.parent.con.warn(cmd, 3);
					continue;
				}
				
				/*
					Old, overly fancy version
					JUST gets the arguments, no argLength
					// args = cmd.split('"').flatMap((e, f) => 
						// f % 2 == 0
							// ? this.breakset.reduce((a, e) =>
								// a.flatMap(f => f.replaceAll(e, ` ${e} `).split(' ')),
								// e.trim().replaceAll('\t', ' ').replaceEvery('  ', ' ').split(' '))
							// : `"${e}"`
					// ).filter(e => e).map(e => e.replaceAll('"', ''));
				*/
				
				// New, more primitive version
				// Made for argLength
				args = [];
				args.cmdStr = cmd, args.argLength = [], args.argLengthS = [];
				let i = -1, j = 0, arg = '';
				while (++i < cmd.length && cmd[i] == ' '); // Skip over beginning whitespace
				while (i < cmd.length) {
					if (cmd[i] == '"') while (++i < cmd.length && cmd[i] != '"') arg += cmd[i];
					else {
						arg += cmd[i];
						while (++i < cmd.length && !(~this.breakset.indexOf(cmd[i]) || cmd[i] == ' ')) arg += cmd[i];
					}
					if (~this.breakset.indexOf(cmd[i])) {
						args.push(arg);
						arg = cmd[i];
						args.argLength.push(i - j);
						args.argLengthS.push(i);
						j = i;
					}
					while (++i < cmd.length && cmd[i] == ' ');
					args.push(arg);
					arg = '';
					args.argLength.push(i - j);
					args.argLengthS.push(i);
					j = i;
				}
				
				if (args.length == 0) continue;
				
				if (args.length >= this.maxArgCount) {
					this.parent.con.warn('Cbuf: Tokenizer encountered command which overflows the argument buffer... Clamping!\n');
					args = args.slice(0, this.maxArgCount - 1);
					args.argLength = args.argLength.slice(0, this.maxArgCount - 1);
					args.argLengthS = args.argLengthS.slice(0, this.maxArgCount - 1);
				}
				
				// args.argLength[args.argLength.length - 1] = 0;
				// args.argLengthS[args.argLengthS.length - 1] = i - 1;
				
				out.push(args);
			}
			
			return out;
		},
		
		/** 
		 * Adds a command to the buffer, optionally flushing the buffer as it does so 
		 * @param {Command} command
		 * @param {Boolean} immediately
		 */
		executeCommand: function(command = '', immediately = true, append = false) {
			this.buffer = append ? [...this.buffer, ...this.parseArguments(command)] : [...this.parseArguments(command), ...this.buffer];
			if (immediately) this.executeAll();
		},
		
		/** Flushes the command buffer, executing each command */
		executeAll: function() {
			// If already executing, ignore
			if (this.executing) return;

			// TODO: Implement wait
			this.executing = true;

			if (this.slowdown) {
				for (let i = 0; i < 1; i++) if (this.buffer.length > 0) this.execute(this.buffer.shift());
			} else {
				while (this.buffer.length > 0) this.execute(this.buffer.shift());
			}

			this.executing = false;
		},
		
		/** Execute a command */
		execute: function(args) {
			// Add to debug trace
			this.trace.push(args);
			this.trace = this.trace.slice(-5);
			
			// console.log(args);
			if (this.parent.cvar('developer') >= 3) this.parent.con.print(`${args.cmdStr.trimStart()}\n`, 0, '#8888EE');
			
			// If a command exists for argument 0
			if (args[0] == undefined) {
				this.parent.con.err(`How has this happened. You've managed to pass a command that can't exist.\n`);
			}
			let cmd = this.parent.getCmd(args[0]);
			if (cmd) {
				if (cmd.type == 'Command') {
					if (this.parent.__.hooks[args[0]]) {
						for (hook of this.parent.__.hooks[args[0]].pre) {
							hook(args);
						}
					}
					cmd.callback(args);
					if (this.parent.__.hooks[args[0]]) {
						for (hook of this.parent.__.hooks[args[0]].post) {
							hook(args);
						}
					}
					return;
				} else if (cmd.type == 'Cvar') {
					if (args.length == 1) {
						return this.parent.con.log(this.parent.describeCvar(cmd));
					}
					let value = args.slice(1).join(' ');
					return this.parent.setCvar(cmd.name, value);
				}
			} else {
				// Unknown command
				let error = `Unknown command "${args[0]}".`;
				if (args.length > 1) error += ` Context: ${args.cmdStr}`;
				return this.parent.con.err(`${error}\n`);
			}
		},
		
		compress: function(text = '') {
			// General compression working for any Source Engine game
			// SAR will override this to compress cond strings, deferred references, expansions, etc
			let commands = this.parseArguments(text);
			let out = [];
			for (let i = 0; i < commands.length; i++) {
				let args = commands[i];
				let outS = '';
				for (let j = 0; j < args.length; j++) {
					let argument = args[j];
					let haveToQuote = false;
					if ([...this.breakset, ' ', ';', '$'].some(e => ~argument.indexOf(e))) haveToQuote = true;
					
					if (haveToQuote) outS += `"${argument}"`;
					else {
						if (j > 0 && !outS.endsWith('"')) outS += ' ';
						outS += argument;
					}
				}
				if (outS.endsWith('"')) outS = outS.slice(0, -1);
				out.push(outS);
			}
			out = out.filter(e => e.length <= this.maxCmdLength - 2);
			let outS = '', l = 0;
			for (let command of out) {
				if (outS.split('\n').last().split('"').length % 2 == 1 && l + command.length + 1 <= this.maxCmdLength - 2) {
					let t = outS != '';
					outS += (t ? ';' : '') + command;
					l += command.length + (t ? 1 : 0);
				} else {
					outS += '\n' + command;
					l = command.length;
				}
			}
			console.log(outS);
		}
	},
	
	/** HTML-based console outputs */
	con: {
		buffer: [],
		output: undefined,
		historyCount: 1024,
		
		flush: function() {
			if (!!this.output) {
				let shouldScroll = this.output.scrollTop >= this.output.scrollHeight - this.output.offsetHeight;
				while (this.buffer.length > 0) {
					let text = this.buffer.shift();
					// If text[3] is truthy, it was `clear`
					if (text[3]) {
						this.output.innerHTML = '';
						continue;
					}
					
					if (this.parent.cvar('developer') >= text[1]) {
						let lines = text[0].split('\n');
						for (let i = 0; i < lines.length; i++) {
							let line = lines[i];
							let ele = document.createElement('span');
							ele.style.color = text[2];
							ele.innerText = line;
							
							if (line != '') this.output.appendChild(ele);
							if (i < lines.length - 1) this.output.appendChild(document.createElement('br'));
						}
					}
				}
				while (this.output.childElementCount > 2 * this.historyCount) this.output.removeChild(this.output.firstChild)
				if (shouldScroll) this.output.scrollTop = this.output.scrollHeight;
			}
		},
		
		print: function(text = '', debugLevel = 0, color = '#FFFFFF') {
			if (this.parent.cvar('developer') >= debugLevel)
				this.buffer.push([text, debugLevel, color]);
		},
		
		log: function(...arguments) {
			this.print(...arguments);
		},
			
		warn: function(text = '', debugLevel = 0, color = '#FFFF55') {
			this.print(text, debugLevel, color);
		},
		
		err: function(text = '', debugLevel = 0, color = '#FF5555') {
			this.parent.__.errorLog.push(text);
			this.print(text, debugLevel, color);
			
			// Show stack trace at developer 2 only (3 shows the trace anyway)
			if (this.parent.cvar('developer') == 2) {
				for (let i = 0; i < this.parent.cmd.trace.length; i++) {
					this.print(`Stack ${i - this.parent.cmd.trace.length} : ${this.parent.cmd.trace[i].cmdStr}\n`, color);
				}
			}
		},
		
		clear: function(maxDebugLevel = 1) {
			if (this.parent.cvar('developer') <= maxDebugLevel)
				this.buffer.push(['', '', '', 1]);
		},
		
		enterCommand: function(command) {
			this.log(`] ${command}\n`);
			this.parent.cmd.executeCommand(command);
		},
	},

	/** HTML-based config files */
	cfg: {
		// TODO:
		// This is kinda webpage-specific, try to generalise
		// Cfg contents are currently stored *in* the HTML. Refactor it!
		currentView: '',
		
		cfgs: [],
		
		view: function(name) {
			name = name || ''
			name = name.replaceAll('"', '').replaceAll("'", '');
			if (!~this.cfgs.indexOf(name)) return false;
			let tabcontents = document.getElementsByClassName('tabcontent'), tablinks = document.getElementsByClassName('tablinks');
			for (let ele of tabcontents) {
				ele.style.display = ele.id == `tabcontents${name}` ? 'flex' : 'none';
			}
			for (let ele of tablinks) {
				ele.className = name == ele.innerHTML ? ele.className + ' active' : ele.className.replaceAll(' active', '');
			}
			this.currentView = name;
		},
		
		get: function(name) {
			name = name.replaceAll('"', '').replaceAll("'", '');
			return document.getElementById(`tabcontents${name}`)
				? document.getElementById(`tabcontents${name}`).value
				: null;
		},
		
		add: function(name, switchTo = false, value = '') {
			name = name.replaceAll('"', '').replaceAll("'", '');
			if (!document.getElementById('tab')) return false;
			if (!document.getElementById('tabcontents')) return false;
			if (~this.cfgs.indexOf(name)) {
				return document.getElementById(`tabcontents${name}`).value = value;
			}
			if (name.length > 0 && !name.startsWith('/') && !~this.cfgs.indexOf(name)) {
				this.cfgs.push(name);
				document.getElementById('tab').innerHTML += `<button class="tablinks" onclick="source.cfg.view('${name}')">${name}</button>`;
				let ele = document.createElement('textarea');
				ele.id = `tabcontents${name}`;
				ele.className = 'tabcontent';
				ele.value = value;
				ele.allowTab();
				document.getElementById('tabcontents').appendChild(ele);
				if (switchTo) this.view(name);
			}
		},
	},
	
	/** Console commands or variables */
	
	cmds: [],
	getCmd: function(name) {
		let search = name.toLowerCase();
		return this.cmds.find(e => e.name.toLowerCase() == search);
	},
	
	createCommand: function(name, helpStr = '\n', callback = (args) => {source.con.warn(`NotImpl: ${args[0]} (${args.cmdStr.trimStart()})\n`)}) {
		if (typeof helpStr == 'function') { // helpStr can be underloaded to callback
			callback = helpStr
			helpStr = '\n';
		}
		let obj = {
			type: 'Command',
			name: name,
			helpStr: helpStr,
			callback: callback,
		};
		let existing = this.cmds.findIndex(e => e.name == name);
		if (~existing) {
			if (this.cmds[existing].type == 'Command') return this.cmds[existing] = obj;
			return console.err('Tried to create command over cvar');
		}
		
		this.cmds.push(obj);
	},
	createCvar: function(name, value = 0, helpStr = '\n', min = NaN, max = NaN, callback = undefined) {
		let obj = {
			type: 'Cvar',
			name: name,
			value: value,
			default: value,
			helpStr: helpStr,
			min: isNaN(min) ? Number.NEGATIVE_INFINITY : Number(min),
			max: isNaN(max) ? Number.POSITIVE_INFINITY : Number(max),
			callback: callback,
		};
		let existing = this.cmds.findIndex(e => e.name == name);
		if (~existing) {
			if (this.cmds[existing].type == 'Cvar') return this.cmds[existing] = obj;
			return console.err('Tried to create cvar over command');
		}
		this.cmds.push(obj);
	},
	setCvar: function(name, value) {
		let cvar = this.getCmd(name);
		if (cvar) {
			if (cvar.type != 'Cvar') return false;
			if (!isNaN(cvar.min)) value = Math.max(cvar.min, value);
			if (!isNaN(cvar.max)) value = Math.min(cvar.max, value);
			cvar.value = value;
			if (cvar.callback) cvar.callback(value);
		} else this.createCvar(name, value);
	},
	cvar: function(name) {
		let cvar = this.getCmd(name);
		if (!cvar || cvar.type != 'Cvar') return undefined;
		return cvar.value;
	},
	describeCvar: function(cvar) {
		if (typeof cvar == 'string') return this.describeCvar(this.getCmd(cvar));
		if ((!cvar || cvar.type != 'Cvar')) return '';
		let str = `"${cvar.name}" = "${cvar.value}" `;
		if (cvar.value != cvar.default) str += `(def. "${cvar.default}") `;
		if (cvar.min != Number.NEGATIVE_INFINITY) str += `min. ${cvar.min} `;
		if (cvar.max != Number.POSITIVE_INFINITY) str += `max. ${cvar.max} `;
		if (cvar.helpStr != '') str += `- ${cvar.helpStr} `;
		return str;
	},
	
	__initMaps: function() {
		this.maps = [];
		switch (this.game) {
			case 'srm':
				this.maps.push(...['credits_museum', 'celeste_moonroom']);
			case 'portal2':
				this.maps.push(...['sp_a1_intro1', 'sp_a1_intro2', 'sp_a1_intro3', 'sp_a1_intro4', 'sp_a1_intro5', 'sp_a1_intro6', 'sp_a1_intro7', 'sp_a1_wakeup', 'sp_a2_intro', 'sp_a2_laser_intro', 'sp_a2_laser_stairs', 'sp_a2_dual_lasers', 'sp_a2_laser_over_goo', 'sp_a2_catapult_intro', 'sp_a2_trust_fling', 'sp_a2_pit_flings', 'sp_a2_fizzler_intro', 'sp_a2_sphere_peek', 'sp_a2_ricochet', 'sp_a2_bridge_intro', 'sp_a2_bridge_the_gap', 'sp_a2_turret_intro', 'sp_a2_laser_relays', 'sp_a2_turret_blocker', 'sp_a2_laser_vs_turret', 'sp_a2_pull_the_rug', 'sp_a2_column_blocker', 'sp_a2_laser_chaining', 'sp_a2_triple_laser', 'sp_a2_bts1', 'sp_a2_bts2', 'sp_a2_bts3', 'sp_a2_bts4', 'sp_a2_bts5', 'sp_a2_bts6', 'sp_a2_core', 'sp_a3_00', 'sp_a3_01', 'sp_a3_03', 'sp_a3_jump_intro', 'sp_a3_bomb_flings', 'sp_a3_crazy_box', 'sp_a3_transition01', 'sp_a3_speed_ramp', 'sp_a3_speed_flings', 'sp_a3_portal_intro', 'sp_a3_end', 'sp_a4_intro', 'sp_a4_tb_intro', 'sp_a4_tb_trust_drop', 'sp_a4_tb_wall_button', 'sp_a4_tb_polarity', 'sp_a4_tb_catch', 'sp_a4_stop_the_box', 'sp_a4_laser_catapult', 'sp_a4_laser_platform', 'sp_a4_speed_tb_catch', 'sp_a4_jump_polarity', 'sp_a4_finale1', 'sp_a4_finale2', 'sp_a4_finale3', 'sp_a4_finale4', 'sp_a5_credits', 'credits', 'mp_coop_start', 'mp_coop_lobby_3', 'mp_coop_doors', 'mp_coop_race_2', 'mp_coop_laser_2', 'mp_coop_rat_maze', 'mp_coop_laser_crusher', 'mp_coop_teambts', 'mp_coop_fling_3', 'mp_coop_infinifling_train', 'mp_coop_come_along', 'mp_coop_fling_1', 'mp_coop_catapult_1', 'mp_coop_multifling_1', 'mp_coop_fling_crushers', 'mp_coop_fan', 'mp_coop_wall_intro', 'mp_coop_wall_2', 'mp_coop_catapult_wall_intro', 'mp_coop_wall_block', 'mp_coop_catapult_2', 'mp_coop_turret_walls', 'mp_coop_turret_ball', 'mp_coop_wall_5', 'mp_coop_tbeam_redirect', 'mp_coop_tbeam_drill', 'mp_coop_tbeam_catch_grind_1', 'mp_coop_tbeam_laser_1', 'mp_coop_tbeam_polarity', 'mp_coop_tbeam_polarity2', 'mp_coop_tbeam_polarity3', 'mp_coop_tbeam_maze', 'mp_coop_tbeam_end', 'mp_coop_paint_come_along', 'mp_coop_paint_redirect', 'mp_coop_paint_bridge', 'mp_coop_paint_walljumps', 'mp_coop_paint_speed_fling', 'mp_coop_paint_red_racer', 'mp_coop_paint_speed_catch', 'mp_coop_paint_longjump_intro', 'mp_coop_credits', 'mp_coop_separation_1', 'mp_coop_tripleaxis', 'mp_coop_catapult_catch', 'mp_coop_2paints_1bridge', 'mp_coop_paint_conversion', 'mp_coop_bridge_catch', 'mp_coop_laser_tbeam', 'mp_coop_paint_rat_maze', 'mp_coop_paint_crazy_box']);
				break;
			case 'aptag':
				this.maps.push(...['gg_intro_wakeup', 'gg_blue_only', 'gg_blue_only_2', 'gg_blue_only_3', 'gg_blue_only_2_pt2', 'gg_a1_intro4', 'gg_blue_upplatform', 'gg_red_only', 'gg_red_surf', 'gg_all_intro', 'gg_all_rotating_wall', 'gg_all_fizzler', 'gg_all_intro_2', 'gg_a2_column_blocker', 'gg_all_puzzle2', 'gg_all2_puzzle1', 'gg_all_puzzle1', 'gg_all2_escape', 'gg_stage_reveal', 'gg_stage_bridgebounce_2', 'gg_stage_redfirst', 'gg_stage_laserrelay', 'gg_stage_beamscotty', 'gg_stage_bridgebounce', 'gg_stage_roofbounce', 'gg_stage_pickbounce', 'gg_stage_theend']);
				break;
			case 'mel':
				this.maps.push(...['sp_a1_tramride', 'st_a1_tramride', 'sp_a1_mel_intro', 'st_a1_mel_intro', 'sp_a1_lift', 'st_a1_lift', 'sp_a1_garden', 'st_a1_garden', 'sp_a2_garden_de', 'st_a2_garden_de', 'sp_a2_underbounce', 'st_a2_underbounce', 'sp_a2_once_upon', 'st_a2_once_upon', 'sp_a2_past_power', 'st_a2_past_power', 'sp_a2_ramp', 'st_a2_ramp', 'sp_a2_firestorm', 'st_a2_firestorm', 'sp_a3_junkyard', 'st_a3_junkyard', 'sp_a3_concepts', 'st_a3_concepts', 'sp_a3_paint_fling', 'st_a3_paint_fling', 'sp_a3_faith_plate', 'st_a3_faith_plate', 'sp_a3_transition', 'st_a3_transition', 'sp_a4_overgrown', 'st_a4_overgrown', 'sp_a4_tb_over_goo', 'st_a4_tb_over_goo', 'sp_a4_two_of_a_kind', 'st_a4_two_of_a_kind', 'sp_a4_destroyed', 'st_a4_destroyed', 'sp_a4_factory', 'st_a4_factory', 'sp_a4_core_access', 'st_a4_core_access', 'sp_a4_finale', 'st_a4_finale']);
				break;
			case 'reloaded':
				this.maps.push(...['sp_a1_pr_map_001', 'sp_a1_pr_map_002', 'sp_a1_pr_map_003', 'sp_a1_pr_map_004', 'sp_a1_pr_map_005', 'sp_a1_pr_map_006', 'sp_a1_pr_map_007', 'sp_a1_pr_map_008', 'sp_a1_pr_map_009', 'sp_a1_pr_map_010', 'sp_a1_pr_map_011', 'sp_a1_pr_map_012']);
				break;
			case 'twtm':
				// lol
				break;
		}
	},
	
	__initVars: function() {
		delete this.__initVars;
		let cmd = (...arguments) => this.createCommand(...arguments);
		let cvr = (...arguments) => this.createCvar(...arguments);
		
		
		
		cmd('loadsfm', 'Test -- Loads the SFM\n');
		cvr('replay_enable', 0, 'Enable Replay recording on server\n');
		cvr('replay_snapshotrate', 16, 'Snapshots broadcasted per second\n', 0);
		cvr('replay_autoretry', 1, 'Relay proxies retry connection after network timeout\n', 0);
		cvr('replay_timeout', 30, 'SourceTV connection timeout in seconds.\n', 0);
		cmd('request_replay_demo', 'Request a replay demo from the server.\n');
		cmd('replay_cache_ragdolls', 'Cache ragdolls to disk\n');
		cvr('engine_no_focus_sleep\n', 50);
		cvr('fps_max', 300, 'Frame rate limiter\n');
		cvr('mat_powersavingsmode', 0, 'Power Savings Mode\n');
		cvr('sleep_when_meeting_framerate', 1, 'Sleep instead of spinning if we\'re meeting the desired framerate.\n');
		cvr('fps_max_splitscreen', 300, 'Frame rate limiter, splitscreen\n');
		cvr('fps_max_menu', 120, 'Frame rate limiter, main menu\n');
		cvr('async_serialize', 0, 'Force async reads to serialize for profiling\n');
		cvr('vx_do_not_throttle_events', 0, 'Force VXConsole updates every frame; smoother vprof data on PS3 but at a slight (~0.2ms) perf cost.\n');
		cvr('cpu_frequency_monitoring', 0, 'Set CPU frequency monitoring interval in seconds. Zero means disabled.\n', 0, 10);
		cmd('host_filtered_time_report', 'Dumps time spent idle in previous frames in ms(dedicated only).\n');
		cvr('cl_drawmaterial', '', 'Draw a particular material over the frame\n');
		cvr('mat_showwatertextures', 0);
		cvr('mat_wateroverlaysize', 128);
		cvr('mat_showframebuffertexture', 0);
		cvr('mat_framebuffercopyoverlaysize', 128);
		cvr('mat_showcamerarendertarget', 0);
		cvr('mat_camerarendertargetoverlaysize', 128);
		cvr('mat_hsv', 0);
		cvr('mat_yuv', 0);
		cvr('cl_overdraw_test', 0);
		cvr('mat_drawTexture', '', 'Enable debug view texture\n');
		cvr('mat_drawTextureScale', 1, 'Debug view texture scale\n');
		cvr('mat_wireframe', 0);
		cvr('mat_showlightmappage', -1);
		cvr('cl_drawshadowtexture', 0);
		cvr('cl_shadowtextureoverlaysize', 256);
		cvr('r_flashlightdrawdepth', 0);
		cvr('cl_custommaterial_debug_graph', 0);
		cvr('cl_debugoverlaysthroughportals', 0);
		cmd('r_screenoverlay', 'Draw specified material as an overlay\n');
		cvr('tv_maxrate', 0, 'Max GOTV spectator bandwith rate allowed, 0 == unlimited\n');
		cvr('tv_relaypassword', '', 'GOTV password for relay proxies\n');
		cvr('tv_chattimelimit', 8, 'Limits spectators to chat only every n seconds\n');
		cvr('tv_chatgroupsize', 0, 'Set the default chat group size\n');
		cvr('cl_mouselook_roll_compensation', 1, 'In Portal and Paint, if your view is being rolled, compensate for that. So mouse movements are always relative to the screen.\n');
		cvr('m_pitch', 0.022, 'Mouse pitch factor.\n');
		cvr('sensitivity', 2.5, 'Mouse sensitivity\n', 0.0001, 1000);
		cvr('m_side', 0.8, 'Mouse side factor.\n', 0.0001, 1000);
		cvr('m_yaw', 0.022, 'Mouse yaw factor.\n', 0.0001, 1000);
		cvr('m_forward', 1, 'Mouse forward factor\n', 0.0001, 1000);
		cvr('m_customaccel', 0, `Custom mouse acceleration:
0: custom accelaration disabled
1: mouse_acceleration = min(m_customaccel_max, pow(raw_mouse_delta, m_customaccel_exponent) * m_customaccel_scale + sensitivity)
2: Same as 1, with but x and y sensitivity are scaled by m_pitch and m_yaw respectively.
3: mouse_acceleration = pow(raw_mouse_delta, m_customaccel_exponent - 1) * sensitivity`);
		cvr('m_customaccel_scale', 0.04, 'Custom mouse acceleration value.\n', 0, 10);
		cvr('m_customaccel_max', 0, 'Max mouse move scale factor, 0 for no limit\n');
		cvr('m_customaccel_exponent', 1.05, 'Mouse move is raised to this power before being scaled by scale factor.\n', 0.0001, 10);
		cvr('m_mousespeed', 1, 'Windows mouse acceleration (0 to disable, 1 to enable [Windows 2000: enable initial threshold], 2 to enable secondary threshold [Windows 2000 only]).\n');
		cvr('m_mouseaccel1', 0, 'Windows mouse acceleration initial threshold (2x movement).\n', 0);
		cvr('m_mouseaccel2', 0, 'Windows mouse acceleration secondary threshold (4x movement).\n', 0);
		cvr('m_rawinput', 1, 'Use Raw Input for mouse input.\n');
		cvr('cl_mouselook', 1, 'Set to 1 to use mouse for look, 0 for keyboard look. Cannot be set while connected to a server.\n');
		cvr('cl_mouseenable', 1);
		cvr('rcon_password', '', 'remote console password.\n');
		cvr('sv_rcon_banpenalty', 0, 'Number of minutes to ban users who fail rcon authentication\n', 0);
		cvr('sv_rcon_maxfailures', 10, 'Max number of times a user can fail rcon authentication before being banned\n', 1, 20);
		cvr('sv_rcon_minfailures', 5, 'Number of times a user can fail rcon authentication in sv_rcon_minfailuretime before being banned\n', 1, 20);
		cvr('sv_rcon_minfailuretime', 30, 'Number of seconds to track failed rcon authentications\n', 1);
		cvr('sv_rcon_whitelist_address', '', 'When set, rcon failed authentications will never ban this address, e.g. \'127.0.0.1\'\n');
		cvr('con_timestamp', 0, 'Prefix console.log entries with timestamps\n');
		cvr('con_logfile', '', 'Console output gets written to this file\n');
		cvr('con_trace', 0, 'Print console text to low level printout.\n');
		cvr('con_notifytime', 8, 'How long to display recent console text to the upper part of the game window\n');
		cvr('contimes', 8, 'Number of console lines to overlay for debugging.\n');
		cvr('con_drawnotify', 1, 'Disables drawing of notification area (for taking screenshows).\n');
		cvr('con_enable', 0, 'Allows the console to be activated.\n');
		cvr('con_filter_enable', 0, 'Filters console output based on the setting of con_filter_text. 1 filters completely, 2 displays filtered text brighter than other text.\n');
		cvr('con_filter_text', '', 'Text with which to filter console spew. Set con_filter_enable 1 or 2 to activate.\n');
		cvr('con_filter_text_out', '', 'Text with which to filter OUT of console spew. Set con_filter_enable 1 or 2 to activate.\n');
		cvr('con_nprint_bgalpha', 50, 'Con_NPrint background alpha.\n');
		cvr('con_nprint_bgborder', 5, 'Con_NPrint border size.\n');
		cmd('toggleconsole', 'Show/hide the console.\n');
		cmd('hideconsole', 'Hide the console.\n');
		cmd('showconsole', 'Show the console.\n');
		cmd('clear', 'Clear all console output.\n');
		cmd('log_dumpchannels', 'Dumps information about all logging channels.\n');
		cmd('log_level', 'Set the spew level of a logging channel.\n');
		cmd('log_color', 'Set the color of a logging channel.\n');
		cmd('log_flags', 'Set the flags on a logging channel.\n');
		cvr('_fov', 0, 'Automates fov command to server.\n');
		cvr('zoom_sensitivity_ratio_joystick', 1, 'Additional controller sensitivity scale factor applied when FOV is zoomed in.\n');
		cvr('zoom_sensitivity_ratio_mouse', 1, 'Additional mouse sensitivity scale factor applied when FOV is zoomed in.\n');
		cvr('v_centermove', 0.15);
		cvr('v_centerspeed', 500);
		cvr('viewmodel_fov', 54);
		cvr('mat_viewportscale', 1, 'Scale down the main viewport (to reduce GPU impact on CPU profiling)\n'), 1/640, 1;
		cvr('mat_viewportupscale', 1, 'Scale the viewport back up\n');
		cvr('cl_leveloverview', 0);
		cvr('r_mapextents', 16384, 'Set the max dimension for the map.  This determines the far clipping plane\n');
		cvr('cl_camera_follow_bone_index', -2, 'Index of the bone to follow.  -2 == disabled.  -1 == root bone.  0+ is bone index.\n');
		cvr('gl_clear', 0);
		cvr('gl_clear_randomcolor', 0, 'Clear the back buffer to random colors every frame. Helps spot open seams in geometry.\n');
		cvr('r_farz', -1, 'Override the far clipping plane. -1 means to use the value in env_fog_controller.\n');
		cvr('r_nearz', -1, 'Override the near clipping plane. -1 means to not override.\n');
		cvr('cl_demoviewoverride', 0, 'Override view during demo playback\n');
		cmd('centerview');
		cvr('ss_debug_draw_player', -1);
		cmd('spec_pos', 'dump position and angles to the console\n');
		cmd('getpos', 'dump position and angles to the console\n');
		cmd('getpos_exact', 'dump origin and angles to the console\n');
		cvr('play_distance', 1, 'Set to 1:"2 foot" or 2:"10 foot" presets.\n');
		cvr('viewmodel_presetpos', 1, '1:"Desktop", 2:"Couch", 3:"Classic" \n');
		cmd('cmd1', 'sets userinfo string for split screen player in slot 1\n');
		cmd('cmd2', 'sets userinfo string for split screen player in slot 2\n');
		cmd('cmd3', 'sets userinfo string for split screen player in slot 3\n');
		cmd('cmd4', 'sets userinfo string for split screen player in slot 4\n');
		cmd('findflags', 'Find concommands by flags.\n');
		cmd('cvarlist', 'Show the list of convars/concommands\n');
		cmd('help', 'Find help about a convar/concommand.\n');
		cmd('differences', 'Show all convars which are not at their default values.\n');
		cmd('toggle', 'Toggles a convar on or off, or cycles through a set of values.\n');
		cmd('reset_gameconvars', 'Reset a bunch of game convars to default values\n');
		// cvr('paint_max_surface_border_alpha', 0.7);
		// cvr('paint_alpha_offset_enabled', 1);
		cvr('paintsplat_bias', 0.1, 'Change bias value for computing circle buffer\n');
		cvr('paintsplat_noise_enabled', 1);
		cvr('paintsplat_max_alpha_noise', 0.1, 'Max noise value of circle alpha\n');
		// cvr('paint_min_valid_alpha_value', 0.7);
		// cvr('debug_paint_alpha', 0);
		// cmd('dump_paintmaps', 'dump paintmap data to "paintmap_#.txt"\n');
		cvr('cl_timeout', 30, 'After this many seconds without receiving a packet from the server, the client will disconnect itself\n');
		cvr('cl_forcepreload', 0, 'Whether we should force preloading.\n');
		cvr('cl_downloadfilter', 'all', 'Determines which files can be downloaded from the server (all, none, nosounds)\n');
		cvr('cl_download_demoplayer', 1, 'Determines whether downloads of  external resources are allowed during demo playback (0:no,1:workshop,2:all)\n');
		cvr('cl_debug_ugc_downloads', 0);
		cvr('g_cv_miniprofiler_dump', 0);
		cvr('joy_axisbutton_threshold', 0.3, 'Analog axis range before a button press is registered.\n');
		cvr('joy_axis_deadzone', 0.2, 'Dead zone near the zero point to not report movement.\n');
		cvr('joy_active', -1, 'Which of the connected joysticks / gamepads to use (-1 means first found)\n');
		cvr('joy_gamecontroller_config', '', 'Game controller mapping (passed to SDL with SDL_HINT_GAMECONTROLLERCONFIG), can also be configured in Steam Big Picture mode.\n');
		cvr('fog_volume_debug', 0, 'If enabled, prints diagnostic information about the current fog volume\n');
		cvr('vm_debug', 0);
		cvr('vm_draw_always', 0, '1 - Always draw view models, 2 - Never draw view models.  Should be done before map launches.\n');
		// cvr('vm_pointer_pitch_up_scale', 0.25, 'Limit how much the view model follows the pointer in looking up.\n');
		cvr('mat_preview', '');
		cvr('cl_showfps', 0, 'Draw fps meter (1 = fps, 2 = smooth, 3 = server, 4 = Show+LogToFile, 5 = Thread and wait times +10 = detailed )\n');
		cvr('cl_showpos', 0, 'Draw current position at top of screen\n');
		cvr('cl_showbattery', 0, 'Draw current battery level at top of screen when on battery power\n');
		cvr('cl_showfps5_disp_time', 1, 'Time interval (s) at which thread and wait times are sampled and display is updated\n');
		cvr('cl_showfps5_btlneck_disp_time', 5, 'Time interval (s) for which main/render/gpu bottleneck ticks are displayed\n');
		cvr('cl_countbones', 0);
		cvr('cl_blocking_threshold', 0, 'If file ops take more than this amount of time, add to \'spewblocking\' history list\n');
		cvr('cl_showblocking', 0, 'Show blocking i/o on top of fps panel\n');
		cvr('cl_blocking_recentsize', 40, 'Number of items to store in recent spew history.\n');
		cvr('cl_blocking_msec', 100, 'Vertical scale of blocking graph in milliseconds\n');
		cmd('spewblocking', 'Spew current blocking file list.\n');
		cvr('gl_blit_halfx', 0);
		cvr('gl_blit_halfy', 0);
		cvr('gl_swapdebug', 0);
		cvr('gl_swaplimit', 0);
		cvr('gl_swapinterval', 0);
		cvr('gl_swaplimit_mt', 3);
		cvr('gl_disable_forced_vsync', 0);
		cvr('gl_swaptear', 0);
		cvr('sdl_double_click_size', 2);
		cvr('sdl_double_click_time', 400);
		cvr('sdl_displayindex', -1, 'SDL fullscreen display index.\n');
		cmd('grab_window', 'grab/ungrab window.\n');
		cvr('cl_anglespeedkey', 0.67);
		cvr('cl_yawspeed', 210);
		cvr('cl_pitchspeed', 225);
		cvr('cl_pitchdown', 89);
		cvr('cl_pitchup', 89);
		cvr('cl_upspeed', 320);
		cvr('lookspring', 0);
		cvr('lookstrafe', 0);
		cvr('cl_sidespeed', 175);
		cvr('cl_forwardspeed', 175);
		cvr('cl_backspeed', 175);
		cvr('in_joystick', 1, 'True if the joystick is enabled, false otherwise.\n', 0, 1);
		cvr('thirdperson_platformer', 0, 'Player will aim in the direction they are moving.\n');
		cvr('thirdperson_screenspace', 0, 'Movement will be relative to the camera, etg: left means screen-left\n');
		cvr('sv_noclipduringpause', 0, 'If cheats are enabled, then you can noclip with the game paused (for doing screenshots, etc.).\n');
		cvr('cl_lagcomp_errorcheck', 0, 'Player index of other player to check for position errors.\n');
		cvr('option_duck_method', 0);
		cvr('option_speed_method', 0);
		cvr('round_start_reset_duck', 0);
		cvr('round_start_reset_speed', 0);
		cvr('in_forceuser', 0, 'Force user input to this split screen player\n');
		cvr('ss_mimic', 0, 'Split screen users mimic base player\'s CUserCmds\n');
		cmd('ss_teleport', 'Teleport other splitscreen player to my location.\n');
		
		for (let e of `remote_view,showportals,coop_ping,commandermousemove,movedown,left,right,forward,back,lookup,lookdown,strafe,moveleft,moveright,speed,walk,attack,attack2,use,jump,klook,jlook,duck,reload,alt1,alt2,score,showscores,graph,break,force_centerview,joyadvancedupdate,zoom,zoom_in,zoom_out,grenade1,grenade2,lookspin`.split(',')) {
			cmd('+' + e);
			cmd('-' + e);
		}
		
		cmd('impulse');
		cmd('toggle_duck');
		cmd('xmove');
		cmd('xlook');
		cvr('g_Language', 0);
		cvr('sk_autoaim_mode', 1);
		// cvr('sv_portal_players', 1);
		cvr('old_radiusdamage', 0);
		cvr('skill', 1);
		cvr('cl_phys_timescale', 1, 'Sets the scale of time for client-side physics (ragdolls)\n');
		cvr('cl_phys_maxticks', 0, 'Sets the max number of physics ticks allowed for client-side pyhsics (ragdolls)\n');
		cvr('cl_ragdoll_gravity', 600, 'Sets the gravity client-side ragdolls\n');
		cvr('phys_debug_check_contacts', 0);
		cvr('cl_phys_block_fraction', 0.1);
		cvr('cl_phys_block_dist', 1);
		cvr('cl_predictphysics', 0, 'Use a prediction-friendly physics interface on the client\n');
		cvr('cl_ragdoll_collide', 0);
		cvr('cl_phys_show_active', 0);
		cmd('BindToggle', 'Performs bind <key> "increment var <cvar> 0 1 1"\n');
		cmd('stuffcmds', 'Parses and stuffs command line + commands to command buffer.\n');
		cmd('whitelistcmd', 'Runs a whitelisted command.\n');
		cmd('cmd', 'Forward command to server.\n');
		
		
		
		
		
		cvr('developer', 0);
		cvr('name', 'unnamed', 'Current user name\n');
		cvr('ss_pipscale', 0.3, 'Scale of the PIP aspect ratio to our resolution.\n');
		cvr('ss_pip_bottom_offset', 25, 'PIP offset vector from the bottom of the screen\n');
		cvr('ss_pip_right_offset', 25, 'PIP offset vector from the right of the screen\n');
		cvr('viewmodel_offset_x', 0);
		cvr('viewmodel_offset_y', 0);
		cvr('viewmodel_offset_z', 0);
		cvr('mat_ambient_light_r', 0);
		cvr('mat_ambient_light_g', 0);
		cvr('mat_ambient_light_b', 0);
		cvr('snd_disable_mixer_duck', 0);
		cvr('r_portal_fastpath', 1);
		cvr('snd_mute_losefocus', 1);
		cvr('contimes', 8, 'Number of console lines to overlay for debugging.\n');
		cvr('con_drawnotify', 1, 'Disables drawing of notification area (for taking screenshots).\n');
		cvr('phys_penetration_error_time', 10, 'Controls the duration of vphysics penetration error boxes.\n');
		cvr('sv_player_funnel_into_portals', 1, 'Causes the player to auto correct toward the center of floor portals.\n');
		cvr('r_portal_use_pvs_optimization', 1, 'Enables an optimization that allows portals to be culled when outside of the PVS.\n');
		cvr('r_PortalTestEnts', 1, 'Clip entities against portal frustums.\n');
		cvr('save_screenshot', 1, '0 = none, 1 = non-autosave, 2 = always\n');
		cvr('gameinstructor_enable', 1, 'Display in game lessons that teach new players.\n');
		cvr('puzzlemaker_play_sounds', 1, 'sets if the puzzlemaker can play sounds or not\n');

		cmd('exec', 'exec <filename> [path id] : execute a script file\n', function(args) {
			source.exec(args, true);
		});
		cmd('execifexists', 'execifexists <filename> [path id] : execute a script file only if it exists\n', function(args) {
			source.exec(args, false);
		});
		cmd('execwithwhitelist', 'Execute script file, only execing convars on a whitelist.\n');
		
		cmd('bind', 'bind <key> [command] : attach a command to a key\n', function(args) {
			if (args.length != 2 && args.length != 3) {
				return source.__.wrongArgCount(args);
			}
			
			let key = args[1], keyUp = key.toUpperCase();
			
			if (!~source.__.keys.find(e => e.toUpperCase() == keyUp)) {
				return source.con.err(`bind: ${key} isn't a valid key\n`);
			}
			
			if (args.length == 2) {
				let bind = source.binds.find(e => e.key == keyUp);
				return source.con.log(bind
					? `"${key}" = "${bind.cmd}"\n`
					: `"${key}" is not bound\n`);
			}
			
			// No kiddin'. If Valve didn't limit the arg count at the top, you wouldn't need to quote binds.
			// Unless of course your command contains a semicolon.
			// Also breakset would make spaces
			let cmd = args.slice(2).join(' ');
			if (keyUp == 'ESCAPE') cmd = 'cancelselect';
				
			let bind = source.binds.find(e => e.key == keyUp);
			if (bind) return bind.cmd = cmd;
			
			source.binds.push({key: keyUp, cmd: cmd});
		});
		
		cmd('unbind', 'unbind <key> : remove commands from a key\n', function(args) {
			if (args.length != 2) {
				return source.__.wrongArgCount(args);
			}
			
			let key = args[1], keyUp = key.toUpperCase();
			
			if (!~source.__.keys.indexOf(keyUp)) {
				return source.con.err(`unbind: ${key} isn't a valid key\n`);
			}
			
			if (keyUp == 'ESCAPE') {
				return source.con.err(`unbind: Can't unbind ESCAPE key\n`);
			}
			
			let i = source.binds.findIndex(e => e.key == keyUp);
			if (~i) {
				source.binds.splice(i, 1); // Remove bind at index i
			} else {
				return source.con.err(`unbind: ${key} is not bound\n`);
			}
		});
		
		cmd('unbindall', 'Unbind all keys.\n', function(args) {
			source.binds = source.binds.filter(e => !~['ESCAPE', '`'].indexOf(e.key));
		});
		
		cmd('key_listboundkeys', 'key_listboundkeys : list bound keys with bindings\n', function(args) {
			for (let i = 0; i < source.__.keys.length; i++) {
				let bind = source.binds.find(e => e.key == source.__.keys[i].toUpperCase());
				if (!bind) continue;
				source.con.log(`"${bind.key}" = "${bind.cmd}"\n`);
			}
		});
		
		cmd('key_findbinding', 'key_findbinding <substring> : find key bound to specified command string\n', function(args) {
			if (args.length != 2) {
				return source.__.wrongArgCount(args);
			}
			if (!args[1]) return source.con.err(`key_findbinding: Invalid search string\n`);
			for (let i = 0; i < source.__.keys.length; i++) {
				let bind = source.binds.find(e => e.key == source.__.keys[i]);
				if (!bind || !~bind.cmd.indexOf(args[1])) continue;
				source.con.log(`"${bind.key}" = "${bind.cmd}"\n`);
			}
		});
		
		cmd('find', 'find <string> : find commands with the specified string in their name/help text\n', function(args) {
			if (args.length != 2) {
				return source.__.wrongArgCount(args);
			}
			
			let search = args[1].toUpperCase();
			
			if (!args[1]) return source.con.err(`find: Invalid search string\n`);
			
			for (let cmd of source.cmds) {
				if (~cmd.name.toUpperCase().indexOf(search) || ~cmd.helpStr.toUpperCase().indexOf(search)) {
					if (cmd.type == 'Command') source.con.log(`"${cmd.name}" - ${cmd.helpStr}\n`);
					else source.con.log(`${source.describeCvar(cmd)}\n`);
				}
			}
		});
		
		cmd('help', 'help <cvar> : find help about a convar/concommand\n', function(args) {
			if (args.length != 2) {
				return source.__.wrongArgCount(args, 2);
			}
			let cmd = source.getCmd(args[1]);
			if (cmd) {
				if (cmd.type == 'Command') source.con.log(`"${cmd.name}" - ${cmd.helpStr}\n`);
				else source.con.log(`${src.describeCvar(cmd)}\n`);
			} else {
				return source.con.err(`help: No cvar or command named ${args[1]}\n`);
			}
		});
		
		cmd('say', 'say <message> : display player message\n', function(args) {
			if (args.length < 2) {
				return source.__.tooFewArgs(args);
			}
			let txt = args.slice(1).join(' ');
			txt = !txt.split('').some(e => e != ' ') ? ' ' : txt;
			source.con.log(`${source.cvar('name')}: ${txt}\n`);
		});
		
		cmd('echo', 'echo [message] ... : echo text to console\n', function(args) {
			if (args.length < 2) {
				return source.con.warn(`echo: No args given. You're weird.\n`, 1);
			}
			source.con.log(args.slice(1).join(' ') + ' \n');
		});
		
		cmd('clear', 'clear : clear all console output\n', function(args) {
			source.con.clear();
		});
		
		cmd('alias', 'Alias a command.\n', function(args) {
			if (args.length == 1) {
				
			}
		});
		
		cmd('plugin_load', 'plugin_load <filename> : loads a plugin\n', function(args) {
		
			// Extensible, just add <plugin_name>.js to sourcerun folder
			// Asynchronous unlike ingame (plugin_load sar; echo hi echoes hi first)
			
			// TODO: Make this not worryingly unsafe and remove specific reference to sourcerun page
			
			if (args.length < 2) {
				return source.__.tooFewArgs(args);
			}
			let pluginscript = document.createElement('script')
			eval('pluginscript.onerror = function() {source.con.err(`plugin_load: plugin "${args[1]}" does not exist\n`)}');
			eval('pluginscript.onload = function() {source.con.log(`Loaded plugin "${args[1]}"\n`)}');
			pluginscript.src = 'plugins/' + args[1];
			if (!pluginscript.src.endsWith('.js')) pluginscript.src += '.js';
			//    ↓ sourcerun specific
			if (~['sketch', 'commands'].indexOf(args[1])) {
				return source.con.err(`plugin_load: Loading plugin "${args[1]}" is illegal!\n`);
			}
			if (source.plugins.find(e => e == args[1].toLowerCase())) {
				return source.con.warn(`plugin_load: Plugin "${args[1]}" is already loaded!\n`);
			}
			source.plugins.push(args[1].toLowerCase());
			document.head.appendChild(pluginscript);
		});
	
		cmd('save', 'Saves current game.\n', () => {}); // save <savename> [wait]: save a game
		cmd('load', 'Load a saved game from a console storage device.\n', () => {}); // load <savename>: load a game
		cmd('snd_setmixer', 'Set named Mixgroup of current mixer to mix vol, mute, solo.\n', () => {});
		cmd('script', 'Run the text as a script\n', () => {});
		cmd('record', 'Record a demo.\n', () => {});
		cmd('stop', 'Finish recording demo.\n', () => {});
	},
	
	__init: function() {
        delete this.__init;
		// Add parent pointer to child objects
		for (let obj of Object.keys(this)) {
			// Don't add to these keys
			if (!~['cmds', 'binds', 'plugins', 'onTickEvents'].indexOf(obj)) this[obj].parent = this;
		}
		this.__initVars();
		this.__initMaps();
		
		requestAnimationFrame(this.__tick);
		
		requestAnimationFrame(() => {
			// If it already exists (somehow) don't overwrite it
			if (source.cfg.get('autoexec') == null) source.cfg.add('autoexec', true, `
// AMJ's web implementation of the Source engine for P2.
// You may want to load an example
// Or write a .cfg here and run it.
`)});
        return this;
    }
}.__init();

const src = source;

const CON_COMMAND = function() {src.createCommand(...arguments)};
const CON_CVAR = function() {src.createCvar(...arguments)};

const CON_COMMAND_HOOK = function(command, after = false, func) {
	let cmd = src.getCmd(command);
	if (!cmd || cmd.type != 'Command') {
		console.error(`CON_COMMAND_HOOK for ${command} failed.`);
		if (!cmd) return console.log(`Reason: Command doesn't exist.`);
		return console.log(`Reason: Command is a cvar.`);
	}
	if (!src.__.hooks[command]) src.__.hooks[command] = {pre: [], post: []};
	src.__.hooks[command][after ? 'post' : 'pre'].push(func);
}

const ON_TICK = func => src.onTickEvents.post.push(func);
const ON_PRETICK = func => src.onTickEvents.pre.push(func);

setTimeout(() => source.cmd.executeCommand('exec autoexec.cfg'), 300); // arbitrary delays
setTimeout(() => source.cmd.executeCommand('exec config.cfg'), 600);


const goldsource = {

	commandMaxLength: 510,

	removeComments: e => {
		return !e ? '' : e.split('\n').map(e => {
			let str = '', f = e.split('//');
			for (let i = 0; i < f.length; i++) {
				if (i > 0) {
					if (str.split('"').length % 2 == 1) break;
					str += '//' + f[i];
				} else str += f[i];
			}
			return str.split('"').length % 2 == 1 ? str.trim() : str.trimLeft();
		}).filter(e => e).join('\n');
	},

	getCommandArgs: function(e) {
		// Todo:
		//		Recognise command length limit break (what should it do?)
		return !e ? [] : this.removeComments(e).split('\n').flatMap(e => {
			let out = [], args = e.split('"').flatMap((e, f) =>
					f % 2 == 0
						? "(){};:'".split('').reduce((a, e) =>
							a.flatMap(f => f.replaceAll(e, ` ${e} `).split(' ')),
							e.trim().replaceAll('\t', ' ').replaceEvery('  ', ' ').split(' '))
						: `"${e}"`).filter(e => e);
			for (let i = 0, buf = []; i < args.length; i++) {
				if (args[i] == ';') {
					if (buf.length) out.push(buf);
					buf = [];
				}
				else if (i == args.length - 1) out.push(buf.concat(args[i]));
				else buf.push(args[i]);
			}
			return out;
		});
	},

	compress: function(e, options = {
			// Default options
			minimizeLines: true,
			removeTrailingQuotes: true,
		}) {
		
		// Options:
		//
		// minimizeLines - On by default.
		//                 Minimizes the amount of line breaks in the text
		//                 This can help on Windows to mitigate the use of
		//                 CRLF line breaks. It will never increase output length.
		//
		// minifyInsideQuotes - Off by default.
		//                      Minimizes extra spaces/tabs inside quoted arguments.
		//                      This can mangle some text, so is turned
		//                      off by default.
		//
		// removeTrailingQuotes - On by default.
		//                        Removes blank trailing quotes from commands ("")
		//                        This can break very few applications, so is on by
		//                        default.
		//                        ('echo' vs. 'echo ""', 2nd one prints an empty line)
		
		let option = e => options[e] ?? false;
		let cmds = this.getCommandArgs(e).map(e => {
			let args = [], out = '';
			for (let i = 0; i < e.length; i++) {
				if (e[i].encases('"', '"')) {
					
					if (option('minifyInsideQuotes') || e[i - 1] == 'cond') {
						e[i] = '"' + "(){}:';&|".split('').reduce((a, e) => 
							a.replaceAll(e + ' ', e).replaceAll(' ' + e, e)
						, e[i].replaceAll('\t', ' ').replaceEvery('  ', ' '))
						.replaceAll(" $'", "$$'")  // JS is dumb and uses $ as a control char,
						.replaceAll("$' ", "$$'") // but only sometimes??
						.slice(1, -1).trim() + '"';
					}

					// We can't remove the quotes if they contain a breakset char, semicolon, svar/arg substitution or space
					let canRemoveQuotes = true;
					if (e[i] == '""') canRemoveQuotes = !e.slice(i).some(e => e != '""') && option('removeTrailingQuotes');
					else if ("(){}:'; ".split('').some(f => e[i].indexOf(f) > -1)) canRemoveQuotes = false;
					else if (this.repeatExpand(e[i]).sub) canRemoveQuotes = false;
					e[i] = canRemoveQuotes ? e[i].slice(1, -1) : e[i];
				}
				args.push(e[i]);
			}
			for (let i = 0; i < args.length; i++) {
				out += args[i] + (
					args[i + 1] &&
					!`(){}:'"`.split('').some(f => args[i].endsWith(f) || args[i + 1].startsWith(f))
						? ' '
						: '');
			}
			if (out.endsWith('"')) out = out.slice(0, -1);

			return out;
		}), out = [];
		if (option('minimizeLines')) {
			
			// Can probably be optimised better
			// But due to uncertainty with CBuf I will not do so for now
			
			// Minimizing new line characters can help compress
			// If the file uses CRLF line endings using ; instead will save 1 byte per line
			// Due to source being source, there is a limit on each line's length

			for (let i = 0, buf = '', len = 0; i < cmds.length; i++) {
				// discard commands longer than command limit
				if (cmds[i].length <= this.commandMaxLength) {
					if (cmds[i].length == this.commandMaxLength) {
						if (buf != '') out.push(buf);
						out.push(cmds[i]);
						buf = '';
						len = 0;
						continue;
					}
					if (buf.split('"').length % 2 == 0) {
						out.push(buf);
						buf = '';
						len = 0;
					}
					let txt = (buf == '' ? '' : ';') + cmds[i];
					if (len + txt.length > this.commandMaxLength) {
						out.push(buf);
						buf = cmds[i];
						len = cmds[i].length;
					} else {
						buf += txt;
						len += txt.length;
					}
				}
				if (i == cmds.length - 1 && buf != '') out.push(buf);
			}
		} else return cmds;
		return out;
	},
	
	expand: function(text, args = [], svars = []) {
		if (text.encases('"', '"')) text = text.slice(1, -1);
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
				if (c >= 1 && c <= 9) {
					sub = true;
					if (args[c - 1]) str += args[c - 1].encases('"', '"') ? args[c - 1].slice(1, -1) : args[c - 1];
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
				let svar = text.substr(i + 1, len);
				let value = svars.find(e => e.name == svar);
				if (value) str += value.val;
				i += len;
				continue;
			}
			str += text[i];
		}
		return {out: str, sub: sub};
	},
}

