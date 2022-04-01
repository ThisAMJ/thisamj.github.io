/**
 * SAR plugin JavaScript port for use with source.js
 */

for (let cmd of ['nop', 'ghost_set_color', 'sar_ihud_preset', 'sar_ihud_modify', 'sar_update', 'sar_toast_tag_set_color', 'sar_toast_tag_set_duration', 'sar_toast_setpos', 'svar_persist', 'svar_no_persist', 'sar_speedrun_category', 'sar_fast_load_preset', 'sar_hud_order_bottom', 'sar_hud_order_top', 'sar_on_exit', 'sar_on_load', 'sar_on_flags', 'sar_on_coop_reset_remote', 'sar_on_coop_reset_done', 'sar_on_coop_spawn', 'sar_con_filter_reset', 'sar_con_filter_block', 'sar_con_filter_allow', 'sar_speedrun_cc_start', 'sar_speedrun_cc_rule', 'sar_speedrun_cc_finish', 'sar_speedrun_reset_categories'])
	CON_COMMAND(cmd, '', () => {});

for (let cmd of ['ghost_type', 'sar_trace_font', 'sar_ihud', 'sar_ihud_x', 'sar_ihud_y', 'sar_sr_hud', 'sar_sr_hud_font_index', 'sar_sr_hud_x', 'sar_sr_hud_y', 'sar_trace_draw_speed_deltas', 'sar_demo_blacklist_all', 'sar_demo_overwrite_bak', 'sar_toast_width', 'sar_disable_coop_score_hud', 'sar_disable_no_focus_sleep', 'sar_autorecord', 'sar_speedrun_offset', 'sar_speedrun_time_pauses', 'sar_speedrun_smartsplit', 'sar_speedrun_autostop', 'sar_challenge_autostop', 'sar_record_at_demo_name', 'sar_record_prefix', 'sar_record_at', 'sar_cm_rightwarp', 'sar_hud_font_index', 'sar_hud_x', 'sar_hud_y', 'sar_hud_spacing', 'sar_hud_bg', 'sar_hud_velocity', 'sar_hud_velocity', 'sar_hud_position', 'sar_hud_angles', 'sar_hud_demo', 'sar_toast_x', 'sar_toast_y', 'sar_toast_align', 'sar_toast_anchor', 'sar_toast_disable', 'sar_toast_background', 'sar_toast_compact', 'sar_toast_font', 'sar_con_filter', 'sar_con_filter_default', 'sar_con_filter_suppress_blank_lines', ])
	src.createCvar(cmd, 0)

src.createCvar('ghost_name', src.cvar('name'));

const sar = {
	creatingCategory: '',
	aliases: [],
	functions: [],
	svars: [],
	texts: [],
	textOutputs: [],
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
				case this.conditions.COOP: return false;
				case this.conditions.CM: return false;
				case this.conditions.SAME_MAP: return false;
				case this.conditions.WORKSHOP: return false;
				case this.conditions.MENU: return false;
				case this.conditions.MAP: return false;
				case this.conditions.PREV_MAP: return false;
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

		parse: function(cond_str = '') {
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
					src.con.err(`cond: Malformed input`);
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
						src.con.err(`cond: Malformed input`);
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
										src.con.err(`cond: Expected = after '${t[1]}'`);
										return null;
									}

									toks.shift();

									if (toks.length == 0) {
										// This doesn't exist in SAR
										// "cond map= do_stuff" crashes game
										src.con.err(`cond: Malformed input`);
										return null;
									}

									let compare_tok = toks.shift();
									if (compare_tok[0] != this.tokens.TOK_STR) {
										src.con.err(`cond: Expected string token after '${t[1]}='`);
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
									src.con.err(`cond: Bad token '${t[1]}'`);
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
							src.con.err(`cond: Unmatched parentheses`);
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
						src.con.err(`cond: Unexpected '=' token`);
						return null;
				}
			}
			while (op_stack.length > 0) POP_OP_TO_OUTPUT();

			if (out_stack.length == 0) {
				src.con.err(`cond: Malformed input`);
				return null;
			}
			let cond = out_stack.pop();
			if (out_stack.length > 0) {
				src.con.err(`cond: Malformed input`);
				return null;
			}
			return cond;
		}
	},
	
	expand: function(text, args = []) {
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
		if (existing) existing.val = val;
		else this.svars.push({name: name, val: val});
	},
	
	GetSvar: function(name) {
		let existing = this.svars.find(e => e.name == name);
		if (existing) return existing.val;
		return '';
	},
}

ON_TICK(function() {
	let txts = sar.texts.filter(e => e.shown).sort((a, b) => a.id - b.id).map(e => '<pre>' + e.formatted + '</pre>').join('');
	for (let output of sar.textOutputs) {
		if (output.innerHTML != txts) output.innerHTML = txts;
	}
});

CON_COMMAND('sar_speedrun_cc_start', '', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	sar.creatingCategory = args[1];
});

CON_COMMAND('sar_speedrun_cc_finish', '', function(args) {
	if (sar.creatingCategory == '') return src.con.err('[cc] no category creation in progress', null, '#EECC44');
	src.con.log(`[cc] created category '${sar.creatingCategory}'`, null, '#EECC44');
	sar.creatingCategory = '';
});

CON_COMMAND('sar_speedrun_category', '', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	src.con.log(`Using category '${args[1]}'`, null, '#EECC44');
});

CON_COMMAND('sar_hud_order_bottom', '', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	src.con.log(`Moved HUD element ${args[1]} to bottom.`, null, '#EECC44')
});

CON_COMMAND('sar_hud_order_top', '', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	src.con.log(`Moved HUD element ${args[1]} to top.`, null, '#EECC44')
});

CON_COMMAND('sar_on_config_exec', '', function(args) {
	if (args.length < 2) {
		return src.__.tooTewArgs(args);
	}
	txt = args.length == 2 ? args[1] : args.cmdStr.slice(args.argLength[0]);
	src.cmd.executeCommand(txt, false, true);
});

CON_COMMAND('sar_alias_run', '', function(args) {
	let alias = sar.aliases.find(e => e.name == args[1]);
	if (!alias) {
		return src.con.err(`sar_alias_run: Alias ${args[1]} does not exist`);
	}
	src.cmd.executeCommand(alias.command + ' ' + args.cmdStr.slice(args.argLengthS[1]));
});

CON_COMMAND('sar_alias', '', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	let name = args[1].trim();
	let command = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	let existing = sar.aliases.find(e => e.name == name);
	if (args.length == 2) {
		return existing
			? src.con.log(`sar_alias: ${name} = ${existing.command}`)
			: src.con.log(`sar_alias: Alias ${name} does not exist`);
	}
	if (!existing && src.cmds[name]) return src.__.commandAlreadyExists(args);
	if (existing) return existing.command = command;
	sar.aliases.push({name: name, command: command});
	CON_COMMAND(name, (args) => src.cmd.executeCommand('sar_alias_run ' + args.cmdStr));
});

CON_COMMAND('sar_function_run', '', function(args) {
	let func = sar.functions.find(e => e.name == args[1]);
	if (!func) {
		return src.con.err(`sar_function_run: Function ${args[1]} does not exist`);
	}
	console.log(func.command, sar.expand(func.command, args.slice(2)).out)
	src.cmd.executeCommand(sar.expand(func.command, args.slice(2)).out);
});

CON_COMMAND('sar_function', '', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	let name = args[1]
	let command = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	let existing = sar.functions.find(e => e.name == name);
	if (args.length == 2) {
		return existing
			? con.log(`sar_function: ${name} = ${existing.command}`)
			: con.log(`sar_function: Function ${name} does not exist`);
	}
	if (!existing && src.cmds[name]) return src.__.commandAlreadyExists(args);
	if (existing) return existing.command = command;
	sar.functions.push({name: name, command: command});
	CON_COMMAND(name, (args) => src.cmd.executeCommand('sar_function_run ' + args.cmdStr));
});

CON_COMMAND('sar_expand', '', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	let command = args.length == 2 ? args[1] : args.cmdStr.slice(args.argLength[0]);
	src.cmd.executeCommand(sar.expand(command).out);
});

CON_COMMAND('cond', '', function(args) {
	if (args.length < 3) {
		return src.__.tooFewArgs(args);
	}

	let cond_str = args[1];
	let command = args.length == 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);
	
	let condition = sar.cond.parse(cond_str);

	if (!condition) return src.con.err(`cond: Condition parsing failed`);

	if (sar.cond.eval(condition)) src.cmd.executeCommand(command);

})

CON_COMMAND('svar_set', '', function(args) {
	if (args.length != 3) {
		return src.__.wrongArgCount(args);
	}
	sar.SetSvar(args[1], args[2]);
});

CON_COMMAND('svar_get', '', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	src.con.log(`${args[1]} = ${sar.GetSvar(args[1])}`);
});

CON_COMMAND('svar_count', '', function(args) {
	if (args.length != 1) {
		return src.__.wrongArgCount(args);
	}
	// sar.svars = sar.svars.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	let c = sar.svars.length;
	let len = Math.floor(Math.log10(c)) + 1;
	src.con.log(`svar_count: ${c} svar${c != 1 ? 's' : ''} defined`, undefined, '#EECC44');
	
	// probably should be split into 'svar_list' but that doesn't exist ingame >:(
	for (let i = 0; i < c; i++) {
		src.con.log(`  ${(i + 1).toString().padStart(len, ' ')} : ${sar.svars[i].name} = ${sar.svars[i].val}`, 3, '#EECC44');
	}
});

// Svar Arithmetic
{
	// it's so tempting to just allow floating point :(
	let svar_op = (name, operation, disallowSecondZero = false) => {
		eval(`CON_COMMAND('svar_${name}', 'svar_${name} <variable> <variable|value> - perform the given operation on an svar', function(args) {
			if (args.length != 3) {
				return src.__.wrongArgCount(args);
			}
			let first = src.__.atoi(sar.GetSvar(args[1]));
			let second = args[2];
			second = src.__.atoi(sar.SvarExists(second) ? sar.GetSvar(second) : second);
			let val = src.__.atoi(${disallowSecondZero} && second == 0 ? 0 : parseInt(first ${operation} second));
			sar.SetSvar(args[1], val);
		});`);
	}
	
	svar_op('add', '+');
	svar_op('sub', '-');
	svar_op('mul', '*');
	svar_op('div', '/', true);
	svar_op('mod', '%', true);
}

CON_COMMAND('svar_from_cvar', '', function(args) {
	if (args.length != 3) {
		return src.__.wrongArgCount(args);
	}
	// Just set it to 1, I'm not implementing cvars (for now at least)
	sar.SetSvar(args[1], 1);
});

CON_COMMAND('svar_capture', '', function(args) {
	if (args.length != 3) {
		return src.__.wrongArgCount(args);
	}
	// Just set it to 1, I'm not implementing console reading (for now at least)
	sar.SetSvar(args[1], 1);
});

CON_COMMAND('sar_hud_set_text', '', function(args) {
	if (args.length < 3) {
		return src.__.tooFewArgs(args);
	}

	let id = src.__.atoi(args[1]);
	if (id < 0) return src.con.err(`sar_hud_set_text: Tried to set negative hud index ${id}`);
	let val = args.cmdStr.slice(args.argLengthS[1]);
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

CON_COMMAND('sar_hud_show_text', '', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	let existing = sar.texts.find(e => e.id == args[1]);
	if (existing) existing.shown = true;
});

CON_COMMAND('sar_hud_hide_text', '', function(args) {
	if (args.length != 2) {
		return src.__.wrongArgCount(args);
	}
	let existing = sar.texts.find(e => e.id == args[1]);
	if (existing) existing.shown = false;
});

CON_COMMAND('sar_on_tick', '', function(args) {
	if (args.length < 2) {
		return src.__.tooFewArgs(args);
	}
	let cmd = args.cmdStr.slice(args.argLength[0]);
	ON_TICK(function() {
		src.cmd.executeCommand(cmd);
	});
});

CON_COMMAND('sar_on_tick_clear', '', function(args) {
	if (args.length != 1) {
		return src.__.wrongArgCount(args);
	}
	src.onTickEvents = [];
});

CON_COMMAND('sar_about', '', function(args) {
	let gamestr = 'Unknown';
	switch (game) {
		case 'portal2':
		case 'srm':
			gamestr = 'Portal 2 (8491)';
			break;
		case 'mel':
			gamestr = `Portal Stories: Mel (8151)`;
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
	src.con.log('SourceAutoRecord is a speedrun plugin for Source Engine games.', undefined, '#EECC44');
	src.con.log('More information at: https://github.com/p2sr/SourceAutoRecord or https://wiki.portal2.sr/SAR', undefined, '#EECC44');
	src.con.log(`Game: ${gamestr}`, undefined, '#EECC44');
	src.con.log('Version: 1.12.6-pre14', undefined, '#EECC44');
	src.con.log('Built: 18:15:11 Mar 10 2022', undefined, '#EECC44');
});


src.con.log(`Couldn't open the file. Are you sure the file is here? : "Stats/phunkpaiDWPS.csv"`, undefined, '#EECC44');
src.con.log(`Loaded SourceAutoRecord, Version 1.12.6-pre14`, undefined, '#55CC55');
