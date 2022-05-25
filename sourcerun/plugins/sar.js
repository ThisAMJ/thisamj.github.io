/**
 * SAR plugin JavaScript port for use with source.js
 */
 
const sar = {
	version: '1.12.7-pre2',
	built: '12:45:28 Apr 16 2022',
	platform: ~navigator.userAgent.indexOf('Windows') ? 'win' : /(Linux|X11(?!.*CrOS))/.test(navigator.userAgent) ? 'lin' : '?',
	creatingCategory: '',
	categories: [],
	aliases: [],
	functions: [],
	svars: [],
	texts: [],
	textOutputs: [],
	seqs: [],
	con_filters: [],
	con_filtering: undefined,
	matches_filter: function(text, filter) {
		
		// LOLLLL
		return !filter
			? true
			: !text
				? false
				: filter[0] == '^' && filter[filter.length - 1] == '$'
					? filter.slice(1, -1) == text
					: filter[0] == '^'
						? text.startsWith(filter.slice(1))
						: filter[filter.length - 1] == '$'
							? text.endsWith(filter.slice(0, -1))
							: text == filter;
		
	},
	matches_filters: function(text) {
		if (!src.cvar('sar_con_filter')) return true;
		
		if (this.con_filtering) {
			let match = this.con_filtering.allow;
			if (this.matches_filter(text, this.con_filtering.to)) {
				src.con.log(`Finishing persistent filter rule from "${this.con_filtering.from}" to "${this.con_filtering.to}"\n`, 3, '#88FF88');
				this.con_filtering = undefined;
			}
			return match;
		}
		
		for (let rule of this.con_filters) {
			if (this.matches_filter(text, rule.from)) {
				if (!this.matches_filter(text, rule.to)) {
					src.con.log(`Starting persistent filter rule from "${rule.from}" to "${rule.to}"\n`, 3, '#88FF88');
					this.con_filtering = rule;
				}
				return rule.allow;
			}
		}
		
		return src.cvar('sar_con_filter_default');
	},
	
	cond: {
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
				case this.conditions.COOP: return src.map.startsWith('mp_coop_');
				case this.conditions.CM: return src.cvar('sv_bonus_challenge') == 1;
				case this.conditions.SAME_MAP: return src.map == src.prev_map;
				case this.conditions.WORKSHOP: return false;
				case this.conditions.MENU: return src.map == '';
				case this.conditions.MAP: return src.map == c.val;
				case this.conditions.PREV_MAP: return src.prev_map == c.val;
				case this.conditions.GAME: return game == c.val;
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

		parse: function(cond_str, context) {
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
					src.con.err(`cond: Malformed input. Context: ${context}\n`);
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
						src.con.err(`cond: Malformed input. Context: ${context}\n`);
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
								if (t[1] == 'map' || t[1] == 'prev_map' || t[1] == 'game' || t[1].startsWith('var:')) {

									if (toks.length == 0 || toks[0][0] != this.tokens.TOK_EQUALS) {
										src.con.err(`cond: Expected = after '${t[1]}'. Context: ${context}\n`);
										return null;
									}

									toks.shift();
									
									let compare_tok;
									if (toks.length == 0 || (compare_tok = toks.shift())[0] != this.tokens.TOK_STR) {
										src.con.err(`cond: Expected string token after '${t[1]}='. Context: ${context}\n`);
										return null;
									}

									if (t[1].startsWith('var:')) {
										c.type = this.conditions.SVAR;
										c.svar = t[1].substr(4);
									} else {
										c.type = this.conditions[t[1].toUpperCase()];
									}
									c.val = compare_tok[1];

								} else {
									src.con.err(`cond: Bad token '${t[1]}'. Context: ${context}\n`);
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
							src.con.err(`cond: Unmatched parentheses. Context: ${context}\n`);
							return null
						}
						op_stack.pop();
						break;

					case this.tokens.TOK_AND:
					case this.tokens.TOK_OR:
						while (op_stack.length > 0 && (op_stack.last() == this.tokens.TOK_NOT || op_stack.last() == this.tokens.TOK_AND)) POP_OP_TO_OUTPUT();
						op_stack.push(t[0]);
						break;
					
					case this.tokens.TOK_EQUALS:
						src.con.err(`cond: Unexpected '=' token. Context: ${context}\n`);
						return null;
				}
			}
			while (op_stack.length > 0) POP_OP_TO_OUTPUT();

			if (out_stack.length == 0) {
				src.con.err(`cond: Malformed input. Context: ${context}\n`);
				return null;
			}
			let cond = out_stack.pop();
			if (out_stack.length > 0) {
				src.con.err(`cond: Malformed input. Context: ${context}\n`);
				return null;
			}
			return cond;
		}
	},
	
	expand: function(text, args = []) {
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
				let value = this.svars.find(e => e.name == svar);
				if (value) str += value.val;
				i += len;
				continue;
			}
			str += text[i];
		}
		return {out: str, sub: sub};
	},

	formatHudText: hudText => {
		let str = hudText.txt, txt = '', spans = 0;
		for (let j = 0; j < str.length; j++) {
			if (str[j] == '#') {
				if (str[j + 1] == '#') {
					txt += '#';
					j++;
					continue;
				}
				let next6 = str.slice(j + 1, j + 7);
				if (!next6.split('').some(e => !~'0123456789aAbBcCdDeEfF'.indexOf(e))) {
					// the next 6 characters are hex-worthy
					txt += `<span style="color:#${next6}">`;
					spans++;
					j += 6;
					continue;
				}
			}
			txt += str[j];
		}
		hudText.formatted = txt + '</span>'.repeat(spans);
	},
	
	SvarExists: function(name) {
		return this.svars.find(e => e.name == name);
	},
	
	SetSvar: function(name, val) {
		name = name;
		val = val.toString();
		let existing = this.svars.find(e => e.name == name);
		existing ? existing.val = val : this.svars.push({name: name, val: val});
	},
	
	GetSvar: function(name) {
		let existing = this.svars.find(e => e.name == name);
		return existing ? existing.val : '';
	},
	
	println: function(text, debugLevel = 0, color = '#EECC44') {
		src.con.log(`${text}\n`, debugLevel, color);
	},
	
	GetColor: function(colstr = '') {
		return `#${colstr}`;
	}
}

sar.fonts = [];
switch (sar.platform) {
	case 'win':
		sar.fonts = []
		break;
	case 'lin':
		sar.fonts = ['', 'Courier New', 'Courier New', 'Courier New', 'Courier New', 'Lucida Console', 'Lucida Console', 'Lucida Console', 'Lucida Console', 'Lucida Console', 'Lucida Console', 'Tahoma', 'Tahoma']
}

{
	let MK_SAR_ON = function(name, when, immediately) {
		if (!sar.events) sar.events = {};
		if (!sar.runevents) sar.runevents = {};
		sar.events[name] = [];
		eval(`CON_COMMAND('sar_on_${name}', 'sar_on_${name} <command> [args]... - registers a command to be run ${when}\\n', function(args) {
			if (args.length < 2) {
				return src.__.tooFewArgs(args);
			}
			let cmd = args.length == 2 ? args[1] : args.cmdStr.slice(args.argLength[0]);
			sar.events.${name}.push(cmd);
		});
		sar.runevents.${name} = function() {
			for (let cmd of sar.events.${name}) {
				src.cmd.executeCommand(cmd, ${immediately});
			}
		}`);
	}
	MK_SAR_ON('load', "on session start", true)
	MK_SAR_ON('session_end', "on session end", true)
	MK_SAR_ON('exit', "on game exit", false)
	MK_SAR_ON('demo_start', "when demo playback starts", false)
	MK_SAR_ON('demo_stop', "when demo playback stops", false)
	MK_SAR_ON('flags', "when CM flags are hit", false)
	MK_SAR_ON('coop_reset_done', "when coop reset is completed", false)
	MK_SAR_ON('coop_reset_remote', "when coop reset run remotely", false)
	MK_SAR_ON('coop_spawn', "on coop spawn", true)
	MK_SAR_ON('config_exec', "on config.cfg exec", true)
}

// Since I can't simulate the entire game, here's these commands to test map loads or whatevs
CON_COMMAND('__do_event', '__do_event <event> - Executes a faux event (e.g. "__do_event load" runs sar_on_load commands)\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	if (!sar.runevents[args[1]]) {
		return src.con.err(`__do_event: Event "${args[1]}" does not exist.\n`);
	}
	sar.runevents[args[1]]();
});

CON_COMMAND('nop', 'nop [args]... - nop ignores all its arguments and does nothing\n', () => {});

sar.has_execd_config = false;
CON_COMMAND_HOOK('exec', true, function(args) {
	// let is_config_exec = (args.length == 3 && args[1] == 'config.cfg') || (args.length == 2 && args[1] == 'config_default.cfg')
	let is_config_exec = args[1] == 'config.cfg' || args[1] == 'config_default.cfg';
	if (is_config_exec && !sar.has_execd_config) {
		sar.runevents.config_exec();
		sar.has_execd_config = true;
	}
});

CON_COMMAND_HOOK('map', true, function(args) {sar.runevents.load()});
CON_COMMAND_HOOK('changelevel', true, function(args) {sar.runevents.load()});
CON_COMMAND_HOOK('restart', true, function(args) {sar.runevents.load()});
CON_COMMAND_HOOK('restart_level', true, function(args) {sar.runevents.load()});

CON_COMMAND('sar_fast_load_preset', 'set_fast_load_preset <preset> - sets all loading fixes to preset values\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}

	let preset = args[1];
	let CMD = str => src.cmd.executeCommand(str);

	if (preset == 'none') {
		CMD("ui_loadingscreen_transition_time 1.0");
		CMD("ui_loadingscreen_fadein_time 1.0");
		CMD("ui_loadingscreen_mintransition_time 0.5");
		CMD("sar_disable_progress_bar_update 0");
		CMD("sar_prevent_mat_snapshot_recompute 0");
		CMD("sar_loads_uncap 0");
		CMD("sar_loads_norender 0");
	} else if (preset == "sla") {
		CMD("ui_loadingscreen_transition_time 0.0");
		CMD("ui_loadingscreen_fadein_time 0.0");
		CMD("ui_loadingscreen_mintransition_time 0.0");
		CMD("sar_disable_progress_bar_update 1");
		CMD("sar_prevent_mat_snapshot_recompute 1");
		CMD("sar_loads_uncap 0");
		CMD("sar_loads_norender 0");
	} else if (preset == "normal") {
		CMD("ui_loadingscreen_transition_time 0.0");
		CMD("ui_loadingscreen_fadein_time 0.0");
		CMD("ui_loadingscreen_mintransition_time 0.0");
		CMD("sar_disable_progress_bar_update 1");
		CMD("sar_prevent_mat_snapshot_recompute 1");
		CMD("sar_loads_uncap 1");
		CMD("sar_loads_norender 0");
	} else if (preset == "full") {
		CMD("ui_loadingscreen_transition_time 0.0");
		CMD("ui_loadingscreen_fadein_time 0.0");
		CMD("ui_loadingscreen_mintransition_time 0.0");
		CMD("sar_disable_progress_bar_update 2");
		CMD("sar_prevent_mat_snapshot_recompute 1");
		CMD("sar_loads_uncap 1");
		CMD("sar_loads_norender 1");
	} else {
		sar.println(`Unknown preset ${preset}!\n`);
		sar.println(src.getCmd(args[0]).helpStr);
	}
});
CON_CVAR('sar_loads_norender', 0);
CON_CVAR('sar_loads_uncap', 0);
if (src.game == 'portal2') {
	CON_CVAR('ui_loadingscreen_mintransition_time', 0.5);
	CON_CVAR('ui_loadingscreen_fadein_time', 1);
	CON_CVAR('ui_loadingscreen_transition_time', 1);
}

CON_COMMAND('sar_chat');
CON_COMMAND('ghost_chat');
CON_COMMAND('ghost_message', 'ghost_message - send message to other players\n');
CON_COMMAND('ghost_name', 'ghost_name - change your online name\n');
CON_COMMAND('ghost_type', `ghost_type <0/1/2/3/4>:
0: Colored circle
1: Colored pyramid
2: Colored pyramid with portal gun (RECORDED IN DEMOS)
3: Prop model (RECORDED IN DEMOS)
4: Bendy\n`);
CON_COMMAND('ghost_set_color', 'ghost_set_color <hex code> - sets the ghost color to the specified sRGB color code\n');
CON_COMMAND('sar_ihud_preset', 'sar_ihud_preset <preset> - modifies input hud based on given preset\n');
CON_COMMAND('sar_ihud_modify', 'sar_ihud_modify <element|all> [param=value]... - modifies parameters in given element.\n');
CON_COMMAND('sar_update', 'sar_update [release|pre] [exit] [force] - update SAR to the latest version. If exit is given, exit the game upon successful update; if force is given, always re-install, even if it may be a downgrade\n');
CON_COMMAND('sar_toast_tag_set_color', 'sar_toast_tag_set_color <tag> <color> - set the color of the specified toast tag to an sRGB color\n');
CON_COMMAND('sar_toast_tag_set_duration', 'sar_toast_tag_set_duration <tag> <duration> - set the duration of the specified toast tag in seconds. The duration may be given as \'forever\'\n');
CON_COMMAND('sar_toast_tag_dismiss_all', 'sar_toast_tag_dismiss_all <tag> - dismiss all active toasts with the given tag\n');
CON_COMMAND('sar_toast_setpos', 'sar_toast_setpos <bottom|top> <left|center|right> - set the position of the toasts HUD\n');
CON_COMMAND('sar_toast_create', 'sar_toast_create <tag> <text> - create a toast\n');
CON_COMMAND('sar_toast_net_create', 'sar_toast_net_create <tag> <text> - create a toast, also sending it to your coop partner\n');
CON_COMMAND('sar_toast_dismiss_all', 'sar_toast_dismiss_all - dismiss all active toasts\n');
CON_COMMAND('svar_persist', 'svar_persist <variable> - mark an svar as persistent\n');
CON_COMMAND('svar_no_persist', 'svar_no_persist <variable> - unmark an svar as persistent\n');

CON_COMMAND('sar_speedrun_cc_start');
CON_COMMAND('sar_speedrun_cc_rule');
CON_COMMAND('sar_speedrun_cc_finish');
CON_COMMAND('sar_speedrun_reset_categories');
CON_COMMAND('sar_tas_play', 'sar_tas_play <filename> [filename2] - plays a TAS script with given name. If two script names are given, play coop\n');
CON_COMMAND('sar_tas_play_single', 'sar_tas_play_single <filename> [slot] - plays a single coop TAS script, giving the player control of the other slot.\n');
CON_COMMAND('sar_tas_replay', 'sar_tas_replay - replays the last played TAS\n');
CON_COMMAND('sar_tas_pause', 'sar_tas_pause - pauses TAS playback\n');
CON_COMMAND('sar_tas_resume', 'sar_tas_resume - resumes TAS playback\n');
CON_COMMAND('sar_tas_advance', 'sar_tas_advance - advances TAS playback by one tick\n');
CON_COMMAND('sar_tas_stop', 'sar_tas_stop - stop TAS playing\n');
CON_COMMAND('sar_tas_save_raw', 'sar_tas_save_raw - saves a processed version of just processed script\n');

for (let cmd of ['sar_record_prefix', 'sar_record_at', 'sar_cm_rightwarp', 'sar_hud_font_index', 'sar_hud_x', 'sar_hud_y', 'sar_hud_spacing', 'sar_hud_bg', 'sar_hud_velocity', 'sar_hud_velocity', 'sar_hud_position', 'sar_hud_angles', 'sar_hud_demo'])
	CON_CVAR(cmd, 0);

CON_CVAR('sar_autorecord', 0, 'Enables or disables automatic demo recording.\n', -1, 1);
CON_CVAR('sar_autojump', 0, 'Enables automatic jumping on the server.\n');
CON_CVAR('sar_jumpboost', 0, `Enables special game movement on the server.
0 = Default,
1 = Orange Box Engine,
2 = Pre-OBE.\n`, 0);
CON_CVAR('sar_aircontrol', 0, 'Enables more air-control on the server.\n', 0, 2);
CON_CVAR('sar_duckjump', 0, 'Allows duck-jumping even when fully crouched, similar to prevent_crouch_jump.\n');
CON_CVAR('sar_disable_challenge_stats_hud', 0, 'Disables opening the challenge mode stats HUD.\n');
CON_CVAR('sar_disable_steam_pause', 0, 'Prevents pauses from steam overlay.\n');
CON_CVAR('sar_disable_no_focus_sleep', 0, 'Does not yield the CPU when game is not focused.\n');
CON_CVAR('sar_disable_progress_bar_update', 0, 'Disables excessive usage of progress bar.\n', 0, 2);
CON_CVAR('sar_prevent_mat_snapshot_recompute', 0, 'Shortens loading times by preventing state snapshot recomputation.\n');
CON_CVAR('sar_challenge_autostop', 0, 'Automatically stops recording demos when the leaderboard opens after a CM run. If 2, automatically appends the run time to the demo name.\n', 0, 3);
CON_CVAR('sar_show_entinp', 0, 'Print all entity inputs to console.\n');
CON_CVAR('sar_ihud', 0, 'Enabled or disables movement inputs HUD of client.\n');
CON_CVAR('sar_ihud_x', 2, 'X position of input HUD.\n');
CON_CVAR('sar_ihud_y', 2, 'Y position of input HUD.\n');
CON_CVAR('sar_ihud_grid_padding', 2, 'Padding between grid squares of input HUD.\n');
CON_CVAR('sar_ihud_grid_size', 60, 'Grid square size of input HUD.\n', 0);
CON_CVAR('sar_ihud_analog_image_scale', 0.6, 'Scale of analog input images against max extent.\n', 0, 1);
CON_CVAR('sar_ihud_analog_view_deshake', 0, 'Try to eliminate small fluctuations in the movement analog.\n');
CON_CVAR('ui_transition_effect', 1);
CON_CVAR('sar_trace_autoclear', 1, 'Automatically clear the trace on session start\n');
CON_CVAR('sar_trace_record', 0, 'Record the trace to a slot. Set to 0 for not recording\n', 0);
CON_CVAR('sar_trace_draw', 0, 'Display the recorded player trace. Requires cheats\n');
CON_CVAR('sar_trace_draw_through_walls', 1, 'Display the player trace through walls. Requires sar_trace_draw\n');
CON_CVAR('sar_trace_draw_speed_deltas', 1, 'Display the speed deltas. Requires sar_trace_draw\n');
CON_CVAR('sar_trace_draw_time', 3, `Display tick above trace hover info
0 = hide tick info
1 = ticks since trace recording started
2 = session timer
3 = TAS timer (if no TAS was played, uses 1 instead)\n`, 0, 3);
CON_CVAR('sar_trace_font', 0, 'Font index to display player trace info in\n', 0);
CON_CVAR('sar_trace_bbox_at', -1, 'Display a player-sized bbox at the given tick.\n', -1);
CON_CVAR('sar_trace_bbox_use_hover', 0, 'Move trace bbox to hovered trace point tick on given trace\n', 0);
CON_CVAR('sar_trace_bbox_ent_record', 1, 'Record hitboxes of nearby entities in the trace. You may want to disable this if memory consumption gets too high.\n');
CON_CVAR('sar_trace_bbox_ent_draw', 1, 'Draw hitboxes of nearby entities in the trace.\n');
CON_CVAR('sar_trace_bbox_ent_dist', 200, 'Distance from which to capture entity hitboxes.\n', 50);
CON_CVAR('sar_sr_hud', 0, 'Draws speedrun timer.\n', 0);
CON_CVAR('sar_sr_hud_x', 0, 'X offset of speedrun timer HUD.\n');
CON_CVAR('sar_sr_hud_y', 100, 'Y offset of speedrun timer HUD.\n');
CON_CVAR('sar_sr_hud_font_color', '255 255 255 255', 'RGBA font color of speedrun timer HUD.\n');
CON_CVAR('sar_sr_hud_font_index', 70, 'Font index of speedrun timer HUD.\n', 0);
CON_CVAR('sar_demo_blacklist', 0, 'Stop a set of commands from being run by demo playback.\n');
CON_CVAR('sar_demo_blacklist_all', 0, 'Stop all commands from being run by demo playback.\n');
CON_CVAR('sar_demo_remove_broken', 1, 'Whether to remove broken frames from demo playback\n');
CON_CVAR('sar_demo_overwrite_bak', 0, 'Rename demos to (name)_bak if they would be overwritten by recording\n', 0);
CON_CVAR('sar_toast_disable', 0, 'Disable all toasts from showing.\n');
CON_CVAR('sar_toast_font', 6, 'The font index to use for toasts.\n', 0);
CON_CVAR('sar_toast_width', 250, 'The maximum width for toasts.\n', 10);
CON_CVAR('sar_toast_x', 0, 'The horizontal position of the toasts HUD.\n', 0);
CON_CVAR('sar_toast_y', 0, 'The vertical position of the toasts HUD.\n', 0);
CON_CVAR('sar_toast_align', 0, 'The side to align toasts to horizontally. 0 = left, 1 = center, 2 = right.\n', 0, 2);
CON_CVAR('sar_toast_anchor', 1, 'Where to put new toasts. 0 = bottom, 1 = top.\n', 0, 1);
// I feel like I've lost sight of the point of this
CON_CVAR('sar_toast_compact', 0, 'Enables a compact form of the toasts HUD.\n');
CON_CVAR('sar_toast_background', 1, 'Sets the background highlight for toasts. 0 = no background, 1 = text width only, 2 = full width.\n', 0, 2);
CON_CVAR('sar_toast_net_disable', 0, 'Disable network toasts.\n');
CON_CVAR('sar_disable_coop_score_hud', 0, 'Disables the coop score HUD which appears in demo playback.\n');
CON_CVAR('sar_speedrun_smartsplit', 1, 'Only split the speedrun timer a maximum of once per map.\n');
CON_CVAR('sar_speedrun_time_pauses', 0, 'Include time spent paused in the speedrun timer.\n');
CON_CVAR('sar_speedrun_stop_in_menu', 0, 'Automatically stop the speedrun timer when the menu is loaded.\n');
CON_CVAR('sar_speedrun_start_on_load', 0, 'Automatically start the speedrun timer when a map is loaded. 2 = restart if active.\n', 0, 2);
CON_CVAR('sar_speedrun_offset', 0, 'Start speedruns with this many ticks on the timer.\n', 0);
CON_CVAR('sar_speedrun_autostop', 0, 'Automatically stop recording demos when a speedrun finishes. If 2, automatically append the run time to the demo name.\n', 0, 2);
CON_CVAR('sar_record_at_demo_name', 'chamber', 'Name of the demo automatically recorded.\n');

for (let element of ['tastick', 'groundframes', 'text', 'position', 'angles', 'portal_angles', 'portal_angles_2', 'velocity', 'velang', 'groundspeed', 'session', 'last_session', 'sum', 'timer', 'avg', 'cps', 'pause_timer', 'demo', 'jumps', 'portals', 'steps', 'jump', 'jump_peak', 'velocity_peak', 'trace', 'frame', 'last_frame', 'inspection', 'eyeoffset', 'duckstate', 'grounded'])
	CON_CVAR(`sar_hud_${element}`, 0);

CON_CVAR('sar_hud_spacing', 1, 'Spacing between elements of HUD.\n', 0);
CON_CVAR('sar_hud_x', 2, 'X padding of HUD.\n', 0);
CON_CVAR('sar_hud_y', 2, 'Y padding of HUD.\n', 0);
CON_CVAR('sar_hud_font_index', 0,'Font index of HUD.\n', 0);
CON_CVAR('sar_hud_font_color', '255 255 255 255', 'RGBA font color of HUD.\n');
CON_CVAR('sar_hud_precision', 3, 'Precision of HUD numbers.\n', 0);
CON_CVAR('sar_hud_velocity_precision', 2, 'Precision of velocity HUD numbers.\n', 0);

CON_CVAR('sar_pp_hud', 0, 'Enables or disables the portals placement HUD.\n', 0);
CON_CVAR('sar_pp_hud_show_blue', 0, 'Enables or disables blue portal preview.\n', 0);
CON_CVAR('sar_pp_hud_show_orange', 0, 'Enables or disables orange portal placement preview.\n', 0);
CON_CVAR('sar_pp_hud_x', 5, 'x pos of portal placement hud.\n');
CON_CVAR('sar_pp_hud_y', 5, 'y pos of portal placement hud.\n');
CON_CVAR('sar_pp_hud_opacity', 100, 'Opacity of portal previews.\n', 0, 255);
CON_CVAR('sar_pp_hud_font', 0, 'Change font of portal placement hud.\n', 0);

CON_CVAR('sar_tas_server', 0);
CON_CVAR('sar_tas_debug', 0, 'Debug TAS informations. 0 - none, 1 - basic, 2 - all.\n', 0, 2);
CON_CVAR('sar_tas_dump_usercmd', 0, 'Dump TAS-generated usercmds to a file.\n');
CON_CVAR('sar_tas_dump_player_info', 0, 'Dump player info for each tick of TAS playback to a file.\n');
CON_CVAR('sar_tas_tools_enabled', 1, 'Enables tool processing for TAS script making.\n');
CON_CVAR('sar_tas_tools_force', 0, 'Force tool playback for TAS scripts; primarily for debugging.\n');
CON_CVAR('sar_tas_autosave_raw', 0, 'Enables automatic saving of raw, processed TAS scripts.\n');
CON_CVAR('sar_tas_pauseat', 0, 'Pauses the TAS playback on specified tick.\n', 0);
CON_CVAR('sar_tas_skipto', 0, 'Fast-forwards the TAS playback until given playback tick.\n', 0);
CON_CVAR('sar_tas_playbackrate', 1, 'The rate at which to play back TAS scripts.\n', 0.02)
CON_CVAR('sar_tas_restore_fps', 1, 'Restore fps_max and host_framerate after TAS playback.\n')
CON_CVAR('sar_tas_interpolate', 0, 'Preserve client interpolation in TAS playback.\n')

ON_TICK(function() {
	let txts = sar.texts.filter(e => e.shown).sort((a, b) => a.id - b.id).map(e => `<pre>${e.formatted}</pre>`).join('');
	for (let output of sar.textOutputs) 
		if (output.innerHTML != txts) output.innerHTML = txts;
});

CON_COMMAND('sar_speedrun_cc_start', 'sar_speedrun_cc_start <category name> [default options]... - start the category creator\n', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	sar.creatingCategory = args[1];
});

CON_COMMAND('sar_speedrun_cc_finish', 'sar_speedrun_cc_finish - finish the category creator\n', function(args) {
	if (sar.creatingCategory == '') return src.con.err('[cc] no category creation in progress\n', undefined, '#EECC44');
	sar.println(`[cc] created category '${sar.creatingCategory}'`);
	sar.creatingCategory = '';
});

CON_COMMAND('sar_speedrun_category', 'sar_speedrun_category [category] - get or set the speedrun category\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	sar.println(`Using category '${args[1]}'`);
});

CON_COMMAND('sar_hud_order_bottom', 'sar_hud_order_bottom <name> - orders hud element to bottom\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	sar.println(`Moved HUD element ${args[1]} to bottom.`)
});

CON_COMMAND('sar_hud_order_top', 'sar_hud_order_top <name> - orders hud element to top\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	sar.println(`Moved HUD element ${args[1]} to top.`)
});

// CON_COMMAND('sar_on_config_exec', 'sar_on_config_exec <command> [args]... - registers a command to be run on config.cfg exec\n', function(args) {
	// if (args.length < 2) {
		// return src.__.tooTewArgs(args);
	// }
	// txt = args.length == 2 ? args[1] : args.cmdStr.slice(args.argLength[0]);
	// src.cmd.executeCommand(txt, false, true);
// });

CON_COMMAND('sar_alias', 'sar_alias <name> [command] [args]... - create an alias, similar to the \'alias\' command but not requiring quoting. If no command is specified, prints the given alias\n', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	let name = args[1].trim();
	let command = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	let existing = sar.aliases.find(e => e.name == name);
	if (args.length == 2) {
		return sar.println(existing
			? existing.command // `sar_alias: ${name} = ${existing.command}`
			: `sar_alias: Alias ${name} does not exist`);
	}
	if (!existing && src.getCmd(name)) return src.__.commandAlreadyExists(args);
	if (existing) existing.command = command;
	else sar.aliases.push({name: name, command: command});
	eval(`CON_COMMAND(name, 'SAR alias command.', function(args) {
		src.cmd.executeCommand(\`${command.replaceAll('\\', '\\\\').replaceAll('`', '\`')} \${args.cmdStr.slice(args.argLength[0])}\`);
	});`);
});

CON_COMMAND('sar_function', 'sar_function <name> [command] [args]... - create a function, replacing $1, $2 etc up to $9 in the command string with the respective argument. If no command is specified, prints the given function\n', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	let name = args[1]
	let command = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	let existing = sar.functions.find(e => e.name == name);
	if (args.length == 2) {
		return existing
			? sar.println(`sar_function: ${name} = ${existing.command}`)
			: sar.println(`sar_function: Function ${name} does not exist`);
	}
	if (!existing && src.getCmd(name)) return src.__.commandAlreadyExists(args);
	if (existing) existing.command = command;
	else sar.functions.push({name: name, command: command});
	eval(`CON_COMMAND(name, 'SAR function command.', function(args) {
		src.cmd.executeCommand(sar.expand(\`${command.replaceAll('\\', '\\\\').replaceAll('`', '\\\`')}\`, args.slice(1)).out);
	});`);
});

CON_COMMAND('sar_expand', 'sar_expand [cmd]... - run a command after expanding svar substitutions\n', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	let command = args.length == 2 ? args[1] : args.cmdStr.slice(args.argLength[0]);
	src.cmd.executeCommand(sar.expand(command).out);
});

CON_COMMAND('cond', 'cond <condition> <command> [args]... - runs a command only if a given condition is met\n', function(args) {
	if (args.length < 3) {
		return src.__.tooFewArgs(args);
	}

	let cond_str = args[1];
	let command = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	
	let condition = sar.cond.parse(cond_str, args.cmdStr);

	if (!condition) return src.con.err(`cond: Condition parsing failed\n`);

	if (sar.cond.eval(condition)) src.cmd.executeCommand(command);

})

CON_COMMAND('svar_set', 'svar_set <variable> <value> - set a svar (SAR variable) to a given value\n', function(args) {
	if (args.length != 3) {
		return src.__.wrongArgCount(args);
	}
	sar.SetSvar(args[1], args[2]);
});

CON_COMMAND('svar_get', 'svar_get <variable> - get the value of a svar\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	sar.println(`${args[1]} = ${sar.GetSvar(args[1])}`);
});

CON_COMMAND('svar_count', 'svar_count - prints a count of all the defined svars\n', function(args) {
	if (args.length != 1) {
		return src.__.wrongArgCount(args);
	}
	// sar.svars = sar.svars.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	let c = sar.svars.length;
	let len = Math.floor(Math.log10(c)) + 1;
	sar.println(`svar_count: ${c} svar${c != 1 ? 's' : ''} defined`);
	
	// probably should be split into 'svar_list' but that doesn't exist ingame >:(
	for (let i = 0; i < c; i++) {
		sar.println(`  ${(i + 1).toString().padStart(len, ' ')} : ${sar.svars[i].name} = ${sar.svars[i].val}`, 1);
	}
});

// Svar Arithmetic
{
	// it's so tempting to just allow floating point :(
	let svar_op = (name, operation, disallowSecondZero = false) => {
		eval(`CON_COMMAND('svar_${name}', 'svar_${name} <variable> <variable|value> - perform the given operation on an svar\\n', function(args) {
			if (args.length != 3) {
				return src.__.wrongArgCount(args);
			}
			
			let cur = src.__.atoi(sar.GetSvar(args[1]));
			let other = Number(args[2]);
			if (isNaN(other)) other = sar.SvarExists(args[1]) ? src.__.atoi(sar.GetSvar(args[2])) : 0;
			
			sar.SetSvar(args[1], ${disallowSecondZero} && other == 0 ? 0 : src.__.signedint(cur ${operation} other));
		});`);
	}
	
	svar_op('add', '+');
	svar_op('sub', '-');
	svar_op('mul', '*');
	svar_op('div', '/', true);
	svar_op('mod', '%', true);
}

CON_COMMAND('svar_from_cvar', 'svar_from_cvar <variable> <cvar> - capture a cvars\'s value and place it into an svar, removing newlines\n', function(args) {
	if (args.length != 3) {
		return src.__.wrongArgCount(args);
	}
	let cvar = src.cvar(args[2]);
	if (cvar != undefined) sar.SetSvar(args[1], cvar.toString().replaceAll('\n', ''));
});

CON_COMMAND('svar_capture', 'svar_capture <variable> <command> [args]... - capture a command\'s output and place it into an svar, removing newlines\n', function(args) {
	if (args.length != 3) {
		return src.__.wrongArgCount(args);
	}
	// Just set it to 1, I'm not implementing console reading (for now at least)
	sar.SetSvar(args[1], 1);
});

CON_COMMAND('sar_font_get_name', 'sar_font_get_name <idx> - gets the name of the nth font index\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	let idx = parseInt(args[1]);
	if (isNaN(idx) || !sar.fonts[idx]) {
		return sar.println('Invalid font index');
	}
	return sar.println(sar.fonts[idx]);
}

CON_COMMAND('sar_hud_set_text', 'sar_hud_set_text <id> <text>... - sets and shows the nth text value in the HUD\n', function(args) {
	if (args.length < 3) {
		return src.__.tooFewArgs(args);
	}

	let id = src.__.atoi(args[1]);
	if (id < 0) return src.con.err(`sar_hud_set_text: Tried to set negative hud index ${id}\n`);
	let val = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	let existing = sar.texts.find(e => e.id == id);
	if (existing) {
		existing.txt = val;
		return sar.formatHudText(existing)
	}
	let txt = {
		id: id,
		txt: val,
		shown: true
	};
	sar.formatHudText(txt);
	sar.texts.push(txt);
});

CON_COMMAND('sar_hud_show_text', 'sar_hud_show_text <id> - shows the nth text value in the HUD\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	let existing = sar.texts.find(e => e.id == args[1]);
	if (existing) existing.shown = true;
});

CON_COMMAND('sar_hud_hide_text', 'sar_hud_hide_text <id> - hides the nth text value in the HUD\n', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	let existing = sar.texts.find(e => e.id == args[1]);
	if (existing) existing.shown = false;
});

CON_COMMAND('seq', 'seq <commands>... - runs a sequence of commands one tick after one another\n', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	let cmds = args.slice(1);
	sar.seqs.push(cmds);
});

ON_PRETICK(function() {
	sar.seqs = sar.seqs.filter(e => e.length > 0);
	for (let seq of sar.seqs) {
		let cmd = seq.shift();
		src.cmd.executeCommand(cmd);
	}
});

CON_CVAR('sar_con_filter', 0, 'Enable the console filter\n');
CON_CVAR('sar_con_filter_default', 0, 'Whether to allow text through the console filter by default');
CON_CVAR('sar_con_filter_suppress_blank_lines', 0, 'Whether to suppress blank lines in console\n');
CON_COMMAND('sar_con_filter_allow', 'sar_con_filter_allow <string> [end] - add an allow rule to the console filter, allowing until \'end\' is matched\n', function(args) {
	if (args.length < 2 || args.length > 3) {
		return src.__.wrongArgCount(args);
	}
	sar.con_filters.push({allow: true, from: args[1], to: args[2]});
});
CON_COMMAND('sar_con_filter_block', 'sar_con_filter_block <string> [end] - add a disallow rule to the console filter, blocking until \'end\' is matched\n', function(args) {
	if (args.length < 2 || args.length > 3) {
		return src.__.wrongArgCount(args);
	}
	sar.con_filters.push({allow: false, from: args[1], to: args[2]});
});
CON_COMMAND('sar_con_filter_reset', 'sar_con_filter_reset - clear the console filter rule list\n', function(args) {
	if (args.length != 1) {
		return src.__.wrongArgCount(args);
	}
	sar.con_filters = [];
});

src.con.print = function(text = '', debugLevel = 0, color = '#FFFFFF') {
	// TODO: print('\n') should finish current line
	let lines = text.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		if (sar.matches_filters(line) && (line != '' || !src.cvar('sar_con_filter_suppress_blank_lines'))) {
			this.buffer.push([`${line}${i < lines.length - 1 ? '\n' : ''}`, debugLevel, color]);
		} else {
			if (line.trim() == '') line = '';
			this.buffer.push([line, 3, '#888888']);
		}
	}
};

CON_COMMAND('sar_echo', 'sar_echo <color> <string...> - echo a string to console with a given color\n', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	
	let col = sar.GetColor(args[1], false);
	if (!col) {
		return src.con.err(`sar_echo: Invalid color. Got ${args[1]}`);
	}
	
	let str = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	src.con.log(`${str}\n`, 0, col);
});

CON_COMMAND('sar_echo_nolf', 'sar_echo_nolf <color> <string...> - echo a string to console with a given color and no trailing line feed\n', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	
	let col = sar.GetColor(args[1], false);
	if (!col) {
		return src.con.err(`sar_echo_nolf: Invalid color. Got ${args[1]}`);
	}
	
	let str = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	src.con.log(str, 0, col);
});

CON_COMMAND('sar_about', 'sar_about - prints info about SAR plugin', function(args) {
	let gamestr = 'Unknown';
	switch (game) {
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
	sar.println('SourceAutoRecord is a speedrun plugin for Source Engine games.');
	sar.println('More information at: https://github.com/p2sr/SourceAutoRecord or https://wiki.portal2.sr/SAR');
	sar.println(`Game: ${gamestr}`);
	sar.println(`Version: ${sar.version}`);
	sar.println(`Built: ${sar.built}`);
});

sar.println(`Couldn't open the file. Are you sure the file is here? : "Stats/phunkpaiDWPS.csv"`);
sar.println(`Loaded SourceAutoRecord, Version ${sar.version}`, undefined, '#55CC55');
