const FCVAR_NONE                       = 0;
const FCVAR_UNREGISTERED               = 1;
const FCVAR_DEVELOPMENTONLY            = 1 << 1;
const FCVAR_GAMEDLL                    = 1 << 2;
const FCVAR_CLIENTDLL                  = 1 << 3;
const FCVAR_HIDDEN                     = 1 << 4;
const FCVAR_PROTECTED                  = 1 << 5;
const FCVAR_SPONLY                     = 1 << 6;
const FCVAR_ARCHIVE                    = 1 << 7;
const FCVAR_NOTIFY                     = 1 << 8;
const FCVAR_USERINFO                   = 1 << 9;
const FCVAR_PRINTABLEONLY              = 1 << 10;
const FCVAR_GAMEDLL_FOR_REMOTE_CLIENTS = 1 << 10;
const FCVAR_UNLOGGED                   = 1 << 11;
const FCVAR_NEVER_AS_STRING            = 1 << 12;
const FCVAR_REPLICATED                 = 1 << 13;
const FCVAR_CHEAT                      = 1 << 14;
const FCVAR_SS                         = 1 << 15;
const FCVAR_DEMO                       = 1 << 16;
const FCVAR_DONTRECORD                 = 1 << 17;
const FCVAR_SS_ADDED                   = 1 << 18;
const FCVAR_RELEASE                    = 1 << 19;
const FCVAR_RELOAD_MATERIALS           = 1 << 20;
const FCVAR_RELOAD_TEXTURES            = 1 << 21;
const FCVAR_NOT_CONNECTED              = 1 << 22;
const FCVAR_MATERIAL_SYSTEM_THREAD     = 1 << 23;
const FCVAR_ARCHIVE_GAMECONSOLE        = 1 << 24;
const FCVAR_SERVER_CAN_EXECUTE         = 1 << 28;
const FCVAR_SERVER_CANNOT_QUERY        = 1 << 29;
const FCVAR_CLIENTCMD_CAN_EXECUTE      = 1 << 30;
const FCVAR_ACCESSIBLE_FROM_THREADS    = 1 << 25;
const FCVAR_MATERIAL_THREAD_MASK       = FCVAR_RELOAD_MATERIALS | FCVAR_RELOAD_TEXTURES | FCVAR_MATERIAL_SYSTEM_THREAD;
const PUZZLEMAKER_DEV                  = 0;

/**
 * Source engine implementation in JavaScript
 */
const src = ({
	
	game: {

		str: '',

		/**
		 * Changes the currently running game, and refreshes the maplist {@link src.maps.init} accordingly.
		 * @param  {String} to
		 */
		change: function(to) {
			this.str = to;
			this.parent.maps.init();
		}

	},
	
	maps: {

		cur: '',

		history: [],

		list: [],

		/**
		 * @param  {String} to
		 * 
		 * Changes the current map to the given string.
		 */
		change: function(to) {
			if (!~this.list.indexOf(to) && to !== '') {
				return this.parent.con.err(`map '${to}' does not exist\n`);
			}
			this.history.splice(0, 0, this.cur);
			this.history = this.history.slice(0, 10);
			this.cur = to;
			this.parent.cmd.getConvar('host_map').value = to;
		},

		/**
		 * Refreshes the maplist according to {@link src.game.str}.
		 */
		init: function() {
			this.list = [];
			switch (this.parent.game.str) {
				case 'aptag':
					this.list.push('gg_intro_wakeup', 'gg_blue_only', 'gg_blue_only_2', 'gg_blue_only_3', 'gg_blue_only_2_pt2', 'gg_a1_intro4', 'gg_blue_upplatform', 'gg_red_only', 'gg_red_surf', 'gg_all_intro', 'gg_all_rotating_wall', 'gg_all_fizzler', 'gg_all_intro_2', 'gg_a2_column_blocker', 'gg_all_puzzle2', 'gg_all2_puzzle1', 'gg_all_puzzle1', 'gg_all2_escape', 'gg_stage_reveal', 'gg_stage_bridgebounce_2', 'gg_stage_redfirst', 'gg_stage_laserrelay', 'gg_stage_beamscotty', 'gg_stage_bridgebounce', 'gg_stage_roofbounce', 'gg_stage_pickbounce', 'gg_stage_theend');
					break;
				case 'mel':
					this.list.push('sp_a1_tramride', 'st_a1_tramride', 'sp_a1_mel_intro', 'st_a1_mel_intro', 'sp_a1_lift', 'st_a1_lift', 'sp_a1_garden', 'st_a1_garden', 'sp_a2_garden_de', 'st_a2_garden_de', 'sp_a2_underbounce', 'st_a2_underbounce', 'sp_a2_once_upon', 'st_a2_once_upon', 'sp_a2_past_power', 'st_a2_past_power', 'sp_a2_ramp', 'st_a2_ramp', 'sp_a2_firestorm', 'st_a2_firestorm', 'sp_a3_junkyard', 'st_a3_junkyard', 'sp_a3_concepts', 'st_a3_concepts', 'sp_a3_paint_fling', 'st_a3_paint_fling', 'sp_a3_faith_plate', 'st_a3_faith_plate', 'sp_a3_transition', 'st_a3_transition', 'sp_a4_overgrown', 'st_a4_overgrown', 'sp_a4_tb_over_goo', 'st_a4_tb_over_goo', 'sp_a4_two_of_a_kind', 'st_a4_two_of_a_kind', 'sp_a4_destroyed', 'st_a4_destroyed', 'sp_a4_factory', 'st_a4_factory', 'sp_a4_core_access', 'st_a4_core_access', 'sp_a4_finale', 'st_a4_finale');
					break;
				case 'reloaded':
					this.list.push('sp_a1_pr_map_001', 'sp_a1_pr_map_002', 'sp_a1_pr_map_003', 'sp_a1_pr_map_004', 'sp_a1_pr_map_005', 'sp_a1_pr_map_006', 'sp_a1_pr_map_007', 'sp_a1_pr_map_008', 'sp_a1_pr_map_009', 'sp_a1_pr_map_010', 'sp_a1_pr_map_011', 'sp_a1_pr_map_012');
					break;
				case 'twtm':
					this.list.push('tm_intro_01', 'tm_training_01b', 'tm_map_01b', 'tm_scene_map-update2', 'tm_map_02b', 'tm_map_03b', 'tm_map_04a', 'tm_map_05a-update2', 'tm_map_06a', 'tm_map_07', 'tm_map_08', 'tm_map_final');
					break;
				case 'srm':
					this.list.push('credits_museum', 'celeste_moonroom');
				default: // 'portal2'
					this.list.push('sp_a1_intro1', 'sp_a1_intro2', 'sp_a1_intro3', 'sp_a1_intro4', 'sp_a1_intro5', 'sp_a1_intro6', 'sp_a1_intro7', 'sp_a1_wakeup', 'sp_a2_intro', 'sp_a2_laser_intro', 'sp_a2_laser_stairs', 'sp_a2_dual_lasers', 'sp_a2_laser_over_goo', 'sp_a2_catapult_intro', 'sp_a2_trust_fling', 'sp_a2_pit_flings', 'sp_a2_fizzler_intro', 'sp_a2_sphere_peek', 'sp_a2_ricochet', 'sp_a2_bridge_intro', 'sp_a2_bridge_the_gap', 'sp_a2_turret_intro', 'sp_a2_laser_relays', 'sp_a2_turret_blocker', 'sp_a2_laser_vs_turret', 'sp_a2_pull_the_rug', 'sp_a2_column_blocker', 'sp_a2_laser_chaining', 'sp_a2_triple_laser', 'sp_a2_bts1', 'sp_a2_bts2', 'sp_a2_bts3', 'sp_a2_bts4', 'sp_a2_bts5', 'sp_a2_bts6', 'sp_a2_core', 'sp_a3_00', 'sp_a3_01', 'sp_a3_03', 'sp_a3_jump_intro', 'sp_a3_bomb_flings', 'sp_a3_crazy_box', 'sp_a3_transition01', 'sp_a3_speed_ramp', 'sp_a3_speed_flings', 'sp_a3_portal_intro', 'sp_a3_end', 'sp_a4_intro', 'sp_a4_tb_intro', 'sp_a4_tb_trust_drop', 'sp_a4_tb_wall_button', 'sp_a4_tb_polarity', 'sp_a4_tb_catch', 'sp_a4_stop_the_box', 'sp_a4_laser_catapult', 'sp_a4_laser_platform', 'sp_a4_speed_tb_catch', 'sp_a4_jump_polarity', 'sp_a4_finale1', 'sp_a4_finale2', 'sp_a4_finale3', 'sp_a4_finale4', 'sp_a5_credits', 'credits', 'mp_coop_start', 'mp_coop_lobby_3', 'mp_coop_doors', 'mp_coop_race_2', 'mp_coop_laser_2', 'mp_coop_rat_maze', 'mp_coop_laser_crusher', 'mp_coop_teambts', 'mp_coop_fling_3', 'mp_coop_infinifling_train', 'mp_coop_come_along', 'mp_coop_fling_1', 'mp_coop_catapult_1', 'mp_coop_multifling_1', 'mp_coop_fling_crushers', 'mp_coop_fan', 'mp_coop_wall_intro', 'mp_coop_wall_2', 'mp_coop_catapult_wall_intro', 'mp_coop_wall_block', 'mp_coop_catapult_2', 'mp_coop_turret_walls', 'mp_coop_turret_ball', 'mp_coop_wall_5', 'mp_coop_tbeam_redirect', 'mp_coop_tbeam_drill', 'mp_coop_tbeam_catch_grind_1', 'mp_coop_tbeam_laser_1', 'mp_coop_tbeam_polarity', 'mp_coop_tbeam_polarity2', 'mp_coop_tbeam_polarity3', 'mp_coop_tbeam_maze', 'mp_coop_tbeam_end', 'mp_coop_paint_come_along', 'mp_coop_paint_redirect', 'mp_coop_paint_bridge', 'mp_coop_paint_walljumps', 'mp_coop_paint_speed_fling', 'mp_coop_paint_red_racer', 'mp_coop_paint_speed_catch', 'mp_coop_paint_longjump_intro', 'mp_coop_credits', 'mp_coop_separation_1', 'mp_coop_tripleaxis', 'mp_coop_catapult_catch', 'mp_coop_2paints_1bridge', 'mp_coop_paint_conversion', 'mp_coop_bridge_catch', 'mp_coop_laser_tbeam', 'mp_coop_paint_rat_maze', 'mp_coop_paint_crazy_box');
					break;
			}
		}

	},
	
	tick: {

		last: null,

		onTickEvents: {
			pre: [],
			post: []
		},

		/**
		 * Runs the events of a single game tick.
		 * 
		 * First, flushes the console buffer to the output. {@link src.con.flush}
		 * 
		 * Then, run any defined pre-tick events.
		 * 
		 * Then, flush the command buffer. {@link src.cmd.executeAll}
		 * 
		 * Last, run any defined post-tick events.
		 */
		__call: function() {
			this.parent.con.flush();
			for (let ev of this.onTickEvents.pre)  ev();
			this.parent.cmd.executeAll();
			for (let ev of this.onTickEvents.post) ev();
		},

		/**
		 * Internal tick loop. Updates statistics with performance and calls {@link src.tick.__call}
		 */
		call: function() {
			src.tick.last = Date.now();
			src.tick.__call();
			requestAnimationFrame(src.tick.call);
		}

	},
	
	key: {

		list: {
			// inputsystem/key_translation.cpp L357
			src: ' 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z KP_INS KP_END KP_DOWNARROW KP_PGDN KP_LEFTARROW KP_5 KP_RIGHTARROW KP_HOME KP_UPARROW KP_PGUP KP_SLASH KP_MULTIPLY KP_MINUS KP_PLUS KP_ENTER KP_DEL [ ] SEMICOLON \' ` , . / \\ - = ENTER SPACE BACKSPACE TAB CAPSLOCK NUMLOCK ESCAPE SCROLLLOCK INS DEL HOME END PGUP PGDN PAUSE SHIFT RSHIFT ALT RALT CTRL RCTRL LWIN RWIN APP UPARROW LEFTARROW DOWNARROW RIGHTARROW F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 MOUSE1 MOUSE2 MOUSE3 MOUSE4 MOUSE5 MWHEELUP MWHEELDOWN'.split(' '),
			html: ' Digit0 Digit1 Digit2 Digit3 Digit4 Digit5 Digit6 Digit7 Digit8 Digit9 KeyA KeyB KeyC KeyD KeyE KeyF KeyG KeyH KeyI KeyJ KeyK KeyL KeyM KeyN KeyO KeyP KeyQ KeyR KeyS KeyT KeyU KeyV KeyW KeyX KeyY KeyZ Numpad0 Numpad1 Numpad2 Numpad3 Numpad4 Numpad5 Numpad6 Numpad7 Numpad8 Numpad9 NumpadDivide NumpadMultiply NumpadSubtract NumpadAdd NumpadEnter NumpadDecimal BracketLeft BracketRight Semicolon Quote Backquote Comma Period Slash Backslash Minus Equal Enter Space Backspace Tab CapsLock NumLock Escape ScrollLock Insert Delete Home End PageUp PageDown Pause ShiftLeft ShiftRight AltLeft AltRight ControlLeft ControlRight MetaLeft MetaRight  ArrowUp ArrowLeft ArrowDown ArrowRight F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12       '.split(' '),
			pressed: []
		},
		
		binds: [],
		
		/**
		 * `key_listboundkeys` - Lists the keys that are currently bound
		 * @param  {} args
		 */
		listbound: function(args) {
			for (let key of this.list.src) {
				let bind = this.binds.find(e => e.key === key);
				if (!bind || bind.cmd.length === 0) continue;
				this.parent.con.log(`"${key}" = "${bind.cmd}"\n`);
			}
		},
		
		/**
		 * `key_findbinding <substring>` - Finds the bind that contains the substring in its command
		 * @param  {} args
		 */
		findbinding: function(args) {
			if (args.length != 2) {
				return this.parent.con.log(`usage:  key_findbinding substring\n`);
			}
			
			let substring = args[1];
			if (!substring || substring.length === 0) {
				return this.parent.con.log(`usage:  key_findbinding substring\n`);
			}
			
			for (let key of this.list.src) {
				let bind = this.binds.find(e => e.key === key);
				if (!bind || bind.cmd.length === 0) continue;
				if (~bind.cmd.indexOf(substring)) {
					this.parent.con.log(`"${key}" = "${bind.cmd}"\n`);
				}
			}
		},
		
		/**
		 * Binds the specified key to run cmd when pressed, overwriting any existing bind
		 * @param  {String} key
		 * @param  {String} cmd
		 */
		bindKey: function(key, cmd) {
			this.binds = [...this.binds.filter(e => e.key !== key), {key: key, cmd: cmd}];
		},
		
		/**
		 * `bind <key> [command]` - binds a key to a command
		 * @param  {} args
		 */
		bind: function(args) {
			if (args.length < 2 || args.length > 3) {
				return this.parent.con.log(`bind <key> [command] : attach a command to a key\n`);
			}
			
			let b = args[1].toUpperCase();
			
			if (this.list.src.indexOf(b) < 1) {
				return this.parent.con.err(`"${args[1]}" isn't a valid key\n`);
			}
			
			if (args.length === 2) {
				let bind = this.binds.find(e => e.key === b);
				return this.parent.con.log(bind ?
					`"${args[1]}" = "${bind.cmd}"\n` :
					`"${args[1]}" is not bound\n`);
			}
			
			this.bindKey(b, b === 'ESCAPE' ?
				'cancelselect' :
				args.slice(2).join(' ')
			);
		},
		
		/**
		 * `unbind <key>` - unbinds any commands from a key. ESCAPE cannot be unbound.
		 * @param  {} args
		 */
		unbind: function(args) {
			if (args.length !== 2) {
				return this.parent.con.log(`unbind <key> : remove commands from a key\n`);
			}
			
			let key = args[1].toUpperCase();
			
			if (this.list.src.indexOf(key) < 1) {
				return this.parent.con.err(`"${args[1]}" isn't a valid key\n`);
			}
			
			if (key === 'ESCAPE') {
				return this.parent.con.err(`Can't unbind ESCAPE key\n`);
			}
			
			this.bindKey(key, '');
		},
		
		/**
		 * `unbindall` - Unbinds all keys except ESCAPE and ` (tilde)
		 * @param  {} args
		 */
		unbindall: function(args) {
			this.binds.forEach(e => {
				if (!~['ESCAPE', '`'].indexOf(e.key)) {
					e.cmd = '';
				}
			});
		},
		
		/**
		 * @param  {KeyboardEvent} event
		 * @param  {Boolean} down
		 */
		keyPress: function(event, down) {
			event.preventDefault();
			if (event.repeat) return;

			if (!this.list.html.includes(event.code)) {
				if (down) this.parent.con.warn(`You just pressed ${event.code}, which isn't registered. Tell AMJ!\n`);
				return;
			}

			let code = this.list.html.indexOf(event.code);
			if (code === 0) return false; // What? You pressed the '' button

			let key = this.list.src[code].toUpperCase();
			let bind = this.binds.find(e => e.key === key);
			
			this.list.pressed = this.list.pressed.filter(e => e !== key);
			if (down) this.list.pressed.push(key);
			
			// Warn about unbound keys
			// This is implemented, but only for digital controller inputs (ABXY etc)
			if (!bind || bind.cmd.length === 0) {
				if (down) this.parent.con.log(`"${key}" is unbound.\n`);
				return;
			}
			
			if (!down) {
				if (bind.cmd[0] === '+') {
					this.parent.cmd.executeCommand(`-${bind.cmd.slice(1)} ${code}`);
				}
				return;
			}
			
			if (bind.cmd[0] === '+') {
				return this.parent.cmd.executeCommand(`${bind.cmd} ${code}`);
			}
			
			this.parent.cmd.executeCommand(bind.cmd);
		}

	},
	
	plugin: {

		loaded: [],

		load_hooks: [],

		/**
		 * Adds a function to be ran when the specified plugin is loaded.
		 * @param  {String} name
		 * @param  {Function} callback
		 */
		hook: function(name, callback) {
			this.load_hooks.push({
				name: name.toLowerCase(),
				callback: callback
			});
		},

		/**
		 * Loads the specified plugin from `plugins/` relative to the page.
		 * 
		 * Currently not sandboxed so that Source Commands Test can access SAR from sourcerun
		 * @param  {String} name
		 */
		load: function(name) {
			// name = name.replace(/[\/\\]/g, ''); // Sandbox in plugins folder
			if (name.endsWith('.js')) name = name.slice(0, -3);

			if (this.loaded.find(e => e === name.toLowerCase())) {
				src.con.warn(`Plugin "${name}" is already loaded!\n`);
				return src.cmd.commandReady = true;
			}
			
			let pluginscript = document.createElement('script')
			
			pluginscript.src = `plugins/${name}.js`;
			
			pluginscript.onerror = function() {
				src.con.err(`Unable to load plugin "${name}"\n`);
				src.cmd.commandReady = true;
			}
			
			pluginscript.onload = function() {
				let hook = src.plugin.load_hooks.find(e => e.name === name.toLowerCase());
				if (hook) hook.callback();
				src.plugin.loaded.push(name.toLowerCase());
				src.con.log(`Loaded plugin "${name}"\n`);
				src.cmd.commandReady = true;
				
				// Optional: Remove hook after it's done
				src.plugin.load_hooks = src.plugin.load_hooks.filter(e => e.name !== name.toLowerCase());
			}
			
			document.head.appendChild(pluginscript);
		}

	},
	
	cfg: {
		
		cfgs: {},
		
		/**
		 * Get the contents of the specified cfg file, or null if it doesn't exist
		 * @param  {String} name
		 */
		get: function(name) {
			return this.cfgs[name] ? this.cfgs[name] : null;
		},
		
		/**
		 * Set the contents of the specified cfg file, creating it if it doesn't exist
		 * @param  {String} name
		 */
		set: function(name, value = '') {
			this.cfgs[name] = value;
		},

		/**
		 * Remove the specified cfg file
		 * @param  {String} name
		 */
		remove: function(name) {
			delete this.cfgs[name];
		},
		
		/**
		 * `exec <filename>` | `execifexists <filename>` - executes a cfg file.
		 * 
		 * Currently, this simply adds the entire file to the command buffer. Ingame,
		 * it is handled differently. The file is added line-by-line, and each time
		 * any added commands are ran. This could be due to limitations with the size
		 * of the command buffer (adding every command from a cfg at once could cause
		 * issues)
		 * @param  {} args
		 * @param  {Boolean} onlyIfExists
		 */
		exec: function(args, onlyIfExists) {
			// WONTFIX: whitelist
			if (args.length < 2) {
				return this.parent.con.err(`${args[0]} <filename> [path id]: execute a script file\n`);
			}
			
			let s = args[1];
			this.parent.con.log(`Execing config: ${s}\n`, 1);
			
			// WONTFIX: path ID
			let fileName = s.replaceAll('.cfg', '').toLowerCase();
			
			let f = this.cfgs[fileName];
			if (f === null || f === undefined) {
				// Fail silently on execifexists and for autoexec, joystick and game
				if (!onlyIfExists && !~['autoexec.cfg', 'joystick.cfg', 'game.cfg'].indexOf(s)) {
					this.parent.con.err(`${args[0]}: couldn't exec ${s}\n`);
				}
				return;
			}

			if (f.length > 1048576) { // 1 MB
				return this.parent.con.err(`${args[0]} ${s}: file size larger than 1 MB!\n`);
			}
			
			this.parent.con.log(`execing ${s}\n`, 1);
			
			// This introduces nuances to the slowdown feature
			// Although I don't think it causes any functional differences,
			// behaviour should be taken with the slightest grain of salt.
			// I'm too lazy to implement the ingame behaviour
			
			// if (this.parent.cmd.slowdown) {
			
			this.parent.cmd.executeCommand(f);
			
			// } else {
				// let lines = f.split('\n');
				// console.log("EXEC!");
				// for (let line of lines) {
					// let j = this.parent.cmd.buffer.length;
					// this.parent.cmd.executeCommand(line, false, true);
					// while (this.parent.cmd.buffer.length > j) {
						// this.parent.cmd.execute(this.parent.cmd.buffer.splice(j, 1)[0]);
					// }
				// }
			// }
		}

	},
	
	con: {

		buffer: [],

		output: undefined,

		historyCount: 1024,

		enterHistory: [],
		
		/**
		 * Flushes the console buffer, appending any applicable elements to the HTML output.
		 */
		flush: function() {
			if (!!this.output) {
				let shouldScroll = this.output.scrollTop >= this.output.scrollHeight - this.output.offsetHeight;
				let dev = this.parent.cmd.cvar('developer');
				this.buffer = this.buffer.filter(e => dev >= e[1] && e[4]);
				while (this.buffer.length > 0) {
					let text = this.buffer.shift();

					if (text[3]) {
						// clear
						// this.output.innerHTML = '';
						this.output.removeAllChildNodes();
						continue;
					}

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
				while (this.output.childElementCount > this.historyCount * 2) this.output.removeChild(this.output.firstChild);
				if (shouldScroll) this.output.scrollTop = this.output.scrollHeight;
			}
		},

		/**
		 * Adds an element to the console buffer.
		 * @param  {String} text - Defaults to ""
		 * @param  {Number} debugLevel - Defaults to 0
		 * @param  {String} color - Defaults to white `#FFF`
		 */
		print: function(text = '', debugLevel = 0, color = '#FFF') {
			this.buffer.push([text, debugLevel, color, false, true]);
		},

		/**
		 * Alias for {@link src.con.print}
		 */
		log: function(...args) {
			this.print(...args);
		},

		/**
		 * Alias for {@link src.con.print}, with the default color changed to yellow.
		 */
		warn: function(text = '', debugLevel = 0, color = '#FFFF55') {
			this.print(text, debugLevel, color);
		},

		/**
		 * Alias for {@link src.con.print}, with the default color changed to red.
		 * Also adds the error text to a log and sets the lastCommandErrored flag.
		 */
		err: function(text = '', debugLevel = 0, color = '#FF5555') {
			this.parent.cmd.errorLog.push(text);
			this.parent.cmd.lastCommandErrored = true;
			this.print(text, debugLevel, color);
		},

		/**
		 * Adds a 'clear' element to the console buffer, only if maxDebugLevel is low enough to do so.
		 * i.e. At default, it will clear the console if `developer` is 1 or lower.
		 * @param  {Number} maxDebugLevel - Defaults to 1
		 */
		clear: function(maxDebugLevel = 1) {
			if (this.parent.cmd.cvar('developer') <= maxDebugLevel) {
				this.buffer.push([0, 0, 0, 1, 1]);
			}
		},

		/**
		 * Ran when the user enters a command into the console.
		 * If {@link src.cmd.limitlength} is set, the command will be limited to 255 characters in length, like it is ingame.
		 * Any non-ASCII characters (0x00 - 0x7F) are removed, like they are ingame.
		 * @param  {String} cmd
		 */
		enterCommand: function(cmd) {
			if (this.parent.cmd.limitlength) cmd = cmd.slice(0, 255);

			// Remove non-ASCII characters, since Source doesn't like them. Investigate why!
			cmd = cmd.replace(/[^\x00-\x7F]/g, ''); // https://stackoverflow.com/a/20856346
			
			this.enterHistory.push(cmd);
			this.log(`] ${cmd}\n`);
			this.parent.cmd.executeCommand(cmd);
		},

		/**
		 * Constructs a list of autocomplete items from the given partial command string.
		 * @param  {String} cmd
		 */
		autocomplete: function(cmd) {
			let cmds = this.parent.cmd.parseArguments(cmd);
			let args = cmds[cmds.length - 1];
			if (!args || args.length === 0) return [];
			if (args.length === 1 && !cmd.endsWith(' ')) {
				// cast convars from object to array so we can filter
				// probably faster to just loop over and add to an array but lazy
				let convars = Object.keys(this.parent.cmd.convars).map(e => this.parent.cmd.convars[e]);
				convars = convars.filter(e => !this.parent.cmd.isFlagSet(e, FCVAR_DEVELOPMENTONLY) && !this.parent.cmd.isFlagSet(e, FCVAR_HIDDEN));
				let startsWith = convars.filter(e => e.name.toLowerCase().startsWith(args[0].toLowerCase())).map(e => e.name).sort();
				let includes = convars.filter(e => ~e.name.toLowerCase().indexOf(args[0].toLowerCase())).map(e => e.name).filter(e => !startsWith.includes(e)).sort();
				return [...startsWith, ...includes, ...this.enterHistory];
			}
			cmd = this.parent.cmd.getConvar(args[0]);
			if (!cmd) return [];
			return cmd.isCommand
				? ((cmd.autocompletefunc || ((args) => []))(args) || []).map(e => args.cmdStr.slice(0, args.argLengthS[args.length - 2]) + e).sort()
				: args.length === 1 ? [`${args[0]} ${this.parent.cmd.maybeQuote(cmd.value)}`] : [];
		}

	},

	cmd: {
		
		breakset: "(){}:'",

		maxArgCount: 64,

		maxCmdLength: 512,

		maxAliasNameLength: 32,

		maxCmdLengthSometimes: 1024,
		
		aliases: [],
		
		convars: {},
		
		printFlags: [
			[FCVAR_GAMEDLL, 'game'],
			[FCVAR_CLIENTDLL, 'client'],
			[FCVAR_ARCHIVE, 'archive'],
			[FCVAR_NOTIFY, 'notify'],
			[FCVAR_SPONLY, 'singleplayer'],
			[FCVAR_NOT_CONNECTED, 'notconnected'],
			[FCVAR_CHEAT, 'cheat'],
			[FCVAR_REPLICATED, 'replicated'],
			[FCVAR_SERVER_CAN_EXECUTE, 'server_can_execute'],
			[FCVAR_CLIENTCMD_CAN_EXECUTE, 'clientcmd_can_execute'],
			[FCVAR_USERINFO, 'user'],
			[FCVAR_SS, 'ss'],
			[FCVAR_SS_ADDED, 'ss_added']
		],
		
		findFlags: [
			[FCVAR_ARCHIVE, "a"],
			[FCVAR_SPONLY, "sp"],
			[FCVAR_GAMEDLL, "sv"],
			[FCVAR_CHEAT, "cheat"],
			[FCVAR_USERINFO, "user"],
			[FCVAR_NOTIFY, "nf"],
			[FCVAR_PROTECTED, "prot"],
			[FCVAR_PRINTABLEONLY, "print"],
			[FCVAR_UNLOGGED, "log"],
			[FCVAR_NEVER_AS_STRING, "numeric"],
			[FCVAR_REPLICATED, "rep"],
			[FCVAR_DEMO, "demo"],
			[FCVAR_DONTRECORD, "norecord"],
			[FCVAR_SERVER_CAN_EXECUTE, "server_can_execute"],
			[FCVAR_CLIENTCMD_CAN_EXECUTE, "clientcmd_can_execute"],
			[FCVAR_CLIENTDLL, "cl"],
			[FCVAR_SS, "ss"],
			[FCVAR_SS_ADDED, "ss_added"],
			[FCVAR_DEVELOPMENTONLY, "dev_only"]
		],
		
		commandReady: true,
		
		executing: false,

		slowdown: false,

		limitlength: true,

		buffer: [],

		errorLog: [],

		/**
		 * Deletes all convars registered in the engine.
		 */
		reset: function() {
			src.cmd.convars = {}
		},

		/**
		 * Unregisters the convar with the specified name.
		 * @param  {String} name
		 */
		unregister: function(name) {
			delete this.convars[name];
		},

		/**
		 * Gets the convar with the specified name.
		 * @param  {String} name
		 */
		getConvar: function(name) {
			let convar = this.convars[name.toLowerCase()];
			if (!convar) return null;
			return convar;
		},

		/**
		 * Gets the value of the cvar with the specified name.
		 * @param  {String} name
		 */
		cvar: function(name) {
			let convar = this.getConvar(name);
			if (!convar || convar.isCommand) return null;
			return convar.value;
		},

		/**
		 * Sets the value of the cvar with the specified name.
		 * @param  {String} name
		 */
		setCvar: function(name, value) {
			let convar = this.getConvar(name);
			if (!convar || convar.isCommand) return null;
			convar.value = value;
			if (convar.callback) convar.callback();
		},
		
		/**
		 * Creates a command convar.
		 * @param  {String} name
		 * @param  {String} helpStr
		 * @param  {Number} flags - Defaults to `FCVAR_NONE` (0)
		 * @param  {Function} callback - Function with single argument
		 * @param  {Function} autocompletefunc - Function with single argument, returns array of strings.
		 * @param  {Boolean} synchronous - If false, command is obliged to set {@link src.cmd.commandReady} once its functionality is complete.
		 */
		createCommand: function(name, helpStr = '\n', flags = FCVAR_NONE, callback = undefined, autocompletefunc = cmd => [], synchronous = true) {
			let obj = {
				isCommand: true,
				name: name,
				helpStr: helpStr,
				flags: flags,
				callback: callback,
				autocompletefunc: autocompletefunc,
				synchronous: synchronous,
				hooks: {
					pre: [],
					post: []
				}
			};
			let existing = this.convars[name.toLowerCase()];
			if (existing && !existing.isCommand) {
				return this.parent.con.err(`Tried to create command over cvar\n`);
			}
			this.convars[name.toLowerCase()] = obj;
		},
		
		/**
		 * Creates a cvar convar.
		 * @param  {String} name
		 * @param  {} value - Defaults to 0
		 * @param  {String} helpStr
		 * @param  {Number} flags - Defaults to `FCVAR_NONE` (0)
		 * @param  {Number} min
		 * @param  {Number} max
		 * @param  {Function} callback
		 */
		createCvar: function(name = '', value = 0, helpStr = '\n', flags = FCVAR_NONE, min = NaN, max = NaN, callback = undefined) {
			let obj = {
				isCommand: false,
				name: name,
				value: value,
				default: value,
				helpStr: helpStr,
				flags: flags,
				min: isNaN(min) ? NaN : Number(min),
				max: isNaN(max) ? NaN : Number(max),
				callback: callback
			};
			let existing = this.convars[name.toLowerCase()];
			if (existing && existing.isCommand) {
				return this.parent.con.err(`Tried to create cvar over command\n`);
			}
			this.convars[name.toLowerCase()] = obj;
		},
		
		/**
		 * Prints the description for the given convar.
		 * @param  {} convar
		 * @example
		 * printConvarDescription(getConvar("developer")) => `"developer" = "1" ( def. "0" )`
		 */
		printConvarDescription: function(convar) {
			if (!convar) {
				return console.error(`Assertion failed`);
			}
			
			let out = `"${convar.name}" `;
			if (convar.isCommand) {
			} else {
				out += `= "${convar.value}"`;
				if (convar.value != convar.default) {
					out += ` ( def. "${convar.default}" )`;
				}
				
				if (!isNaN(convar.min)) out += ` min. ${convar.min}`;
				if (!isNaN(convar.max)) out += ` max. ${convar.max}`;
			}
			
			for (let i = 0; i < this.printFlags.length; i++) {
				if (this.isFlagSet(convar, this.printFlags[i][0])) {
					out += ` ${this.printFlags[i][1]}`;
				}
			}
			
			// this.parent.con.log(out + (convar.helpStr ? ` - ${convar.helpStr.slice(0, 80)}` : ''));
			
			if (convar.helpStr) {
				this.parent.con.log(`${out.padEnd(80, ' ')} - ${convar.helpStr.slice(0, 80)}`);
			} else {
				this.parent.con.log(`${out}`);
			}
			
		},
		
		/**
		 * Parses the given string into an array of command objects.
		 * 
		 * A command object is an array of string arguments with the additional properties `cmdStr`, `argLength`, and `argLengthS`.
		 * 
		 * `cmdStr` is the entire command string (not necessarily == text)
		 * 
		 * `argLength` is an array containing the length of the nth argument of the command
		 * 
		 * `argLengthS` is an array of the summative length of the command string up to and including arg n.
		 * @param  {String} text - String to parse
		 * @param  {Boolean} printerrs - Defaults to false
		 */
		parseArguments: function(text = '', printerrs = false) {
			let out = [];
			
			// Remove comments and split commands/lines
			let cmds = !text ? [] : text.replace(/\t/g, '').split('\n').flatMap(e => {
				let f = e.split('//'), str = f[0];
				for (let i = 1; i < f.length; i++) {
					if (str.split('"').length % 2 === 1) break;
					str += `//${f[i]}`;
				}
				f = str.split(';');
				let out = [f[0]];
				for (let i = 1; i < f.length; i++) {
					if (out.join('').split('"').length % 2 === 1) out.push(f[i]);
					else out[out.length - 1] += `;${f[i]}`;
				}
				return out;
			});
			
			for (let cmd of cmds) {
				if (!cmd) continue;
				if (cmd.length >= this.maxCmdLength - 1 && this.limitlength) {
					if (printerrs) this.parent.con.warn('CCommand::Tokenize: Encountered command which overflows the tokenizer buffer.. Skipping!\n\n');
					if (printerrs) this.parent.con.warn(cmd, 3);
					continue;
				}
				
				let args = [];
				args.cmdStr = cmd, args.argLength = [], args.argLengthS = [];
				let push = function() {
					while (++i < cmd.length && cmd[i] === ' ');
					args.push(arg);
					arg = '';
					args.argLength.push(i - j);
					args.argLengthS.push(j = i);
				}
				let i = -1, j = 0, arg = '';
				while (++i < cmd.length && cmd[i] === ' '); // Skip over beginning whitespace
				while (i < cmd.length) {
					if (cmd[i] === '"') {
						while (++i < cmd.length && cmd[i] !== '"') arg += cmd[i];
						push();
					} else if (~this.breakset.indexOf(cmd[i])) {
						arg = cmd[i];
						push();
					} else {
						arg = cmd[i];
						while (++i < cmd.length && !~[...this.breakset, ' ', '"'].indexOf(cmd[i])) arg += cmd[i];
						--i;
						push();
					}
				}
				
				args.argc = args.length;
				
				if (args.argc === 0) continue;
				if (args.argc >= this.maxArgCount && this.limitlength) {
					if (printerrs) this.parent.con.warn('CCommand::Tokenize: Encountered command which overflows the argument buffer.. Clamped!\n');
					let cmdStr = args.cmdStr;
					let argLength = args.argLength.slice(0, this.maxArgCount);
					let argLengthS = args.argLengthS.slice(0, this.maxArgCount);
					args = args.slice(0, this.maxArgCount);
					args.argc = args.length;
					args.cmdStr = cmdStr;
					args.argLength = argLength;
					args.argLengthS = argLengthS;
				}
				
				// args.argLength[args.argLength.length - 1] = 0;
				// args.argLengthS[args.argLengthS.length - 1] = i - 1;
				
				out.push(args);
			}
			
			return out;
		},
		
		/**
		 * Parses command and adds to the buffer. If append is true, it is
		 * added at the back of the buffer, otherwise the front. If
		 * immediately is true, the command buffer will be flushed after
		 * doing so.
		 * @param  {String} command
		 * @param  {Boolean} immediately - Defaults to true
		 * @param  {Boolean} append - Defaults to false
		 */
		executeCommand: function(command = '', immediately = true, append = false) {
			this.buffer = append ? [...this.buffer, ...this.parseArguments(command, true)] : [...this.parseArguments(command, true), ...this.buffer];
			if (immediately) this.executeAll();
		},
		
		/**
		 * Flushes the command buffer, executing all contained commands.
		 * If it is already being flushed, does nothing.
		 */
		executeAll: function() {
			if (this.executing) return;
			
			if (this.buffer.length > 0) {
				this.executing = true;
				this.awaitReadyExecute(this.buffer.shift());
			}
		},
		
		/**
		 * Executes the given command when commandReady is next true, and
		 * continues to do so with the next command in the command buffer
		 * until the buffer is empty.
		 * @param  {} cmd
		 */
		awaitReadyExecute: function(cmd) {
			if (src.cmd.commandReady) {
				
				src.cmd.execute(cmd);
				
				if (src.cmd.slowdown) {
					 return src.cmd.executing = false;
				}
				
				// Cut down on recursion by running as many synchronous commands
				// as we can now (for now plugin_load is the only asynchronous
				// command so this will pretty much yeet recursion entirely)
				while (src.cmd.buffer.length > 0) {
					let command = src.cmd.getConvar(cmd[0]);
					if (command && command.isCommand && !command.synchronous) {
						break;
					}
					cmd = src.cmd.buffer.shift();
					src.cmd.execute(cmd);
				}
				
				// We just ran an asynchronous command, await its completion
				if (src.cmd.buffer.length > 0) src.cmd.awaitReadyExecute(src.cmd.buffer.shift());
				else return src.cmd.executing = false;
				
			} else {
				setTimeout(src.cmd.awaitReadyExecute, 1, cmd);
			}
		},
		
		/**
		 * Performs a bitwise AND on the specified convar's flags and the
		 * given flag.
		 * @param  {} convar
		 * @param  {Number} flag
		 */
		isFlagSet: function(convar, flag) {
			return convar.flags & flag;
		},
		
		/**
		 * Executes the given command.
		 * @param  {} command
		 */
		execute: function(command) {
			src.con.log(`${command.cmdStr}\n`, 4);
			if (!command.argc) {
				return null;
			}
			
			if (command[0] === '[$&*,`]') {
				if (command.argc === 3) {
					// HandleExecutionMarker(command[1], command[2]);
				} else {
					this.parent.con.warn(`WARNING: INVALID EXECUTION MARKER.\n`);
				}
				return null;
			}
			
			// check aliases
			for (let alias of this.aliases) {
				if (command[0].toLowerCase() === alias.name.toLowerCase()) {
					if (alias.name.toLowerCase() === alias.cmd.toLowerCase()) {
						// prevent self-reference hang
						this.parent.con.warn(`Prevented self-referential alias "${alias.name}"\n`);
						return null;
					}
					this.executeCommand(alias.cmd);
					return null;
				}
			}
			
			let cmd = this.getConvar(command[0]);
						
			if (cmd) {
				if (cmd.isCommand) {
					if (!cmd.callback) {
						// this.parent.con.err(`Command "${cmd.name}" has no callback!\n`);
						return null;
					}
					if (this.isFlagSet(cmd, FCVAR_CHEAT)) {
						if (!this.cvar('sv_cheats') > 0) {
							if (false) { // test for sp
								this.parent.con.err(`This game doesn't allow cheat command ${cmd.name} in single player, unless you have sv_cheats set to 1.\n`);
							} else {
								this.parent.con.err(`Can't use cheat command ${cmd.name} in multiplayer, unless the server has sv_cheats set to 1.\n`);
							}
							return null;
						}
					}
					
					if (this.isFlagSet(cmd, FCVAR_SPONLY)) {
						if (false) { // test for sp
							this.parent.con.err(`Can't use command ${cmd.name} in multiplayer.\n`);
							return null;
						}
					}
					
					if (this.isFlagSet(cmd, FCVAR_DEVELOPMENTONLY)) {
						this.parent.con.err(`Unknown command "${cmd.name}"\n`);
						return null;
					}
					
					// run the command
					this.lastCommandErrored = false;
					this.commandReady = false;
					
					for (let hook of cmd.hooks.pre) {
						hook(command);
					}
					
					cmd.callback(command);
					
					// TODO: post hooks for asynchronous commands
					if (cmd.synchronous) {
						for (let hook of cmd.hooks.post) {
							hook(command);
						}
						this.commandReady = true;
					}
					return cmd;
				} else {
					if (command.argc === 1) {
						this.parent.con.log(this.describeCvar(cmd));
						return true;
					}
					let value = command[1];
					this.setCvar(cmd.name, value);
					return true;
				}
			} else {
				this.parent.con.err(`Unknown command: ${command[0]}\n`);
				return null;
			}
		},
		
		/**
		 * If the specified string contains any breakset characters,
		 * spaces, or semicolons, wraps it in quotes. Otherwise, return
		 * the given value.
		 * @param  {String} str
		 */
		maybeQuote: function(str) {
				str = str.toString();
				let haveToQuote = false;
				if (this.breakset.split('').some(e => ~str.indexOf(e)) && str.length > 1) haveToQuote = true;
				if ([' ', ';'].some(e => ~str.indexOf(e))) haveToQuote = true;
				if (str === '') haveToQuote = true;
				
				return haveToQuote ? `"${str}"` : str;
		}
	},

	/**
	 * Deletes all cfg files and clears the console.
	 */
	reset: function() {
		src.cfg.cfgs = {};
		if (src.con.output) src.con.output.removeAllChildNodes();
	},

	/**
	 * Clears the console, runs valve.rc, sets default binds,
	 * and prepares to exec config.cfg in anywhere from 600 to 900ms
	 * Just as it would in-game, as config.cfg is loaded from cloud and
	 * ran upon retrieval. 600-900ms is an arbitrary choice.
	 */
	start: function() {
		if (src.con.output) src.con.output.removeAllChildNodes();
		src.cmd.executeCommand(`
		// load the base configuration
		//exec default.cfg
		
		// Setup custom constoller
		exec joystick.cfg
		
		// run a user script file if present
		exec autoexec.cfg
		
		//
		// stuff command line statements
		//
		stuffcmds
		
		// display the startup level
		startupmenu
		`);
		src.key.binds = JSON.parse(localStorage.getItem('src.key.binds')) || [...[
			{key: 'ESCAPE', cmd: 'cancelselect'},
			{key: '`', cmd: 'toggleconsole'},
			{key: 'W', cmd: '+forward'},
			{key: 'S', cmd: '+back'},
			{key: 'A', cmd: '+moveleft'},
			{key: 'D', cmd: '+moveright'},
			{key: 'SPACE', cmd: '+jump'},
			{key: 'CTRL', cmd: '+duck'},
			{key: 'E', cmd: '+use'},
			{key: 'Q', cmd: '+mouse_menu_taunt'},
			{key: 'MOUSE1', cmd: '+attack'},
			{key: 'MOUSE2', cmd: '+attack2'},
			{key: 'F5', cmd: 'jpeg'},
			{key: 'F6', cmd: 'save quick'},
			{key: 'F7', cmd: 'load quick'},
			{key: 'PAUSE', cmd: 'pause'},
			{key: 'TAB', cmd: '+remote_view'},
			{key: 'F', cmd: '+mouse_menu'},
			{key: 'C', cmd: '+voicerecord'},
			{key: 'T', cmd: 'say'},
			{key: 'MOUSE3', cmd: '+zoom'},
			{key: 'MWHEELUP', cmd: '+zoom_in'},
			{key: 'MWHEELDOWN', cmd: '+zoom_out'},
			{key: 'R', cmd: 'swap_ss_input'},
		], ...~navigator.platform.indexOf("Mac") || navigator.platform === "iPhone" ? [{key: 'Z', cmd: '+zoom'}] : []];
		setTimeout(function() {
			src.cmd.executeCommand('exec config.cfg')
		}, Math.random() * 300 + 600);
	},
	
	/**
	 * Initialises the src object, giving each child object a parent reference.
	 * 
	 * Selects Portal 2 as the default game. Starts tick loop.
	 */
	__init: function() {
		delete this.__init;
		Object.keys(this).forEach(obj => {
			this[obj].parent = this;
		});
		this.game.change('portal2');
		requestAnimationFrame(this.tick.call);
		return this;
	}
}.__init());

/**
 * Creates a command convar.
 * @param  {String} name
 * @param  {String} helpStr
 * @param  {Function} callback - Function with single argument
 * @param  {Function} autocompletefunc - Function with single argument, returns array of strings.
 * @param  {Boolean} synchronous - If false, command is obliged to set {@link src.cmd.commandReady} once its functionality is complete.
 */
const CON_COMMAND = function(name, helpStr = '\n', callback = undefined, autocompletefunc = cmd => [], synchronous = true) {
	src.cmd.createCommand(name, helpStr, FCVAR_NONE, callback, autocompletefunc, synchronous);
};

/**
 * Creates a command convar.
 * @param  {String} name
 * @param  {String} helpStr
 * @param  {Number} flags - Defaults to `FCVAR_NONE` (0)
 * @param  {Function} callback - Function with single argument
 * @param  {Function} autocompletefunc - Function with single argument, returns array of strings.
 * @param  {Boolean} synchronous - If false, command is obliged to set {@link src.cmd.commandReady} once its functionality is complete.
 */
const CON_COMMAND_F = function(name, helpStr = '\n', flags = FCVAR_NONE, callback = undefined, autocompletefunc = cmd => [], synchronous = true) {
	src.cmd.createCommand(name, helpStr, flags, callback, autocompletefunc, synchronous)
};

/**
 * Creates a cvar convar.
 * @param  {String} name
 * @param  {} value - Defaults to 0
 * @param  {String} helpStr
 * @param  {Number} flags - Defaults to `FCVAR_NONE` (0)
 * @param  {Number} min
 * @param  {Number} max
 * @param  {Function} callback
 */
const CON_CVAR = function(name = '', value = 0, helpStr = '\n', flags = FCVAR_NONE, min = NaN, max = NaN, callback = undefined) {
	src.cmd.createCvar(name, value, helpStr, flags, min, max, callback)
};

/**
 * Adds a hook to the specified command convar.
 * @param  {String} name
 * @param  {Boolean} post - Defaults to false. Whether to run the hook before or after the command.
 * @param  {Function} func
 */
const CON_COMMAND_HOOK = function(name, post = false, func) {
	let convar = src.cmd.getConvar(name);
	if (!convar) return console.error(`CON_COMMAND_HOOK failed for ${name}: doesn't exist`);
	convar.hooks[post ? 'post' : 'pre'].push(func);
}

/**
 * Add a function to be ran after each engine tick.
 * @param  {Function} func
 */
const ON_TICK = func => src.tick.onTickEvents.post.push(func);


/**
 * Add a function to be ran before each engine tick.
 * @param  {Function} func
 */
const ON_PRETICK = func => src.tick.onTickEvents.pre.push(func);

{
	// Split this into a separate file because it's massive
	let cvars = document.createElement('script');
	cvars.src = '../lib/source-cmds.js';
	document.head.appendChild(cvars);
}

setTimeout(function() {
	src.start()
}, 500)
