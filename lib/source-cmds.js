src.cmd.reset = async function() {
	// This list is complete except for ClientCommands and other hard-coded things
	let convars = await fetch('../lib/source-cmds/portal2.json').then(e => e.json());
	let convarsOld = await fetch('../lib/source-cmds/portal2-old.json').then(e => e.json());

	falsecvars = [];
	truecvars = [];
	for (let convar of convarsOld) {
		if (!convars.find(e => e.name === convar.name)) {
			falsecvars.push(convar);
		}
	}
	for (let convar of convars) {
		if (!convarsOld.find(e => e.name === convar.name)) {
			truecvars.push(convar);
		}
	}
	console.log("false cvars (found in strs, not in dump) aka not actually in game");
	console.log(falsecvars);
	console.log("true  cvars (found in dump, not in strs) aka actually in game, missing from strs");
	console.log(truecvars);

	for (let convar of convars) {
		if (!convar.hasOwnProperty('synchronous')) convar.synchronous = true;
		if (!convar.hasOwnProperty('value')) convar.value = convar.default;
		if (convar.hasOwnProperty('min')) if (convar.min === null) convar.min = NaN;
		if (convar.hasOwnProperty('max')) if (convar.max === null) convar.max = NaN;

		if (convar.isCommand) {
			convar.callback = function(args) {
				// src.con.log(`${args.cmdStr} has no callback\n`);
			}
			convar.hooks = {pre: [], post: []};
		}
		src.cmd.convars[convar.name.toLowerCase()] = convar;
	}

	src.cmd.getConvar("snd_setmixer").callback = function(args) {
		if (args.length !== 4) {
			return src.con.log("Parameters: mix group name, [vol, mute, solo], value");
		}
	}

	src.cmd.getConvar("bind").callback = function(args) {
		src.key.bind(args);
	}

	src.cmd.getConvar("bind_osx").callback = function(args) {
		if (~navigator.platform.indexOf("Mac") || navigator.platform === "iPhone") {
			src.key.bind(args);
		}
	}

	src.cmd.getConvar("bind").autocompletefunc = src.cmd.getConvar("bind_osx").autocompletefunc = src.cmd.getConvar("unbind").autocompletefunc = function(args) {
		if (args.length === 1) return src.key.list.src.filter(e => e.length > 0);
		if (args.length === 2 && !args.cmdStr.endsWith(' ')) return src.key.list.src.filter(e => e.length > 0 && ~e.toLowerCase().indexOf(args[1].toLowerCase())).sort().sort((a, b) => a.toLowerCase().startsWith(args[1].toLowerCase()) ? -1 : 0);
	}


	CON_COMMAND("BindToggle", "Performs a bind <key> \"increment var <cvar> 0 1 1\"", function(args) {
		if (args.length < 2) {
			return src.con.log("BindToggle <key> <cvar>: invalid syntax specified\n");
		}
		
		let cmd = `bind ${args[1]} "incrementvar ${args[2]} 0 1 1"\n`;
		if (src.cmd.limitlength) cmd = cmd.slice(0, src.cmd.maxCmdLength);
		
		src.cmd.executeCommand(cmd);
	});
	
	src.cmd.getConvar("unbind").callback = function(args) {
		src.key.unbind(args);
	};
	src.cmd.getConvar("unbindall").callback = function(args) {
		src.key.unbindall(args);
	};
	src.cmd.getConvar("key_listboundkeys").callback = function(args) {
		src.key.listbound(args);
	};
	src.cmd.getConvar("key_findbinding").callback = function(args) {
		src.key.findbinding(args);
	};
	
	src.cmd.getConvar("incrementvar").callback = function(args) {
		if (args.length !== 5) {
			return src.con.log("Usage: incrementvar varName minValue maxValue delta\n");
		}
		
		let name = args[1];
		if (!name || name.length === 0) {
			return src.con.log("Host_IncrementCVar_f without a varname\n", 1);
		}
		
		let cvar = src.cmd.getConvar(name);
		if (!cvar /* && !cvar.isCommand */) {
			return src.con.log(`cvar "${name}" not found\n`, 1);
		}
		
		let cur = Number(cvar.value),
			start = Number(args[2]),
			end = Number(args[3]),
			delta = Number(args[4]);

		if (isNaN(cur)) cur = 0;
		if (isNaN(start)) start = 0;
		if (isNaN(end)) end = 0;
		if (isNaN(delta)) delta = 0;
		
		let next = cur + delta;
		if (next > end) next = start;
		else if (next < start) next = end;
		
		next = next.toFixed(6);
		
		src.cmd.executeCommand(`${name} ${next}`);
		src.con.log(`${cvar.name} = ${next}\n`, 1);
	};

	src.cmd.getConvar("help").callback = function(args) {
		if (args.length !== 2) {
			return src.con.log(`Usage:  help <cvarname>\n`);
		}
		let convar = src.cmd.getConvar(args[1]);
		if (!convar) {
			return src.con.log(`help:  no cvar or command named ${args[1]}\n`)
		}
		src.cmd.printConvarDescription(convar);
	};

	src.cmd.getConvar("help").autocompletefunc = function(args) {
		if (args.length === 1) return Object.keys(src.cmd.convars);
		if (args.length === 2) return Object.keys(src.cmd.convars).filter(e => ~e.indexOf(args[1])).sort().sort((a, b) => a.toLowerCase().startsWith(args[1].toLowerCase()) ? -1 : 0);
	}

	src.cmd.getConvar("find").callback = function(args) {
		if (args.length !== 2) {
			return src.con.log(`Usage:  find <string>\n`);
		}
		
		let search = args[1], found = Object.keys(src.cmd.convars).map(e => src.cmd.convars[e]);
		if (!src.cmd.showhidden) found = found.filter(e => !src.cmd.isFlagSet(e, FCVAR_DEVELOPMENTONLY) && !src.cmd.isFlagSet(e, FCVAR_HIDDEN));
		found = found.filter(e => ~e.name.toLowerCase().indexOf(search.toLowerCase()) || ~(e.helpStr || '').toLowerCase().indexOf(search.toLowerCase()));
		for (let find of found) {
			src.cmd.printConvarDescription(find);
		}
	};

	src.cmd.getConvar("findflags").callback = function(args) {
		if (args.length < 2) {
			src.con.log("Usage:  findflags <string>\n");
			src.con.log("Available flags to search for: \n");
			for (let i = 0; i < src.cmd.findFlags.length; i++) {
				src.con.log(`   - ${src.cmd.findFlags[i][1]}\n`);
			}
			return;
		}
		let search = args[1];
		for (let convarname in src.cmd.convars) {
			let convar = src.cmd.convars[convarname];
			if (!src.cmd.showhidden && (src.cmd.isFlagSet(convar, FCVAR_DEVELOPMENTONLY) || src.cmd.isFlagSet(convar, FCVAR_HIDDEN))) {
				continue;
			}
			
			for (let i = 0; i < src.cmd.findFlags.length; i++) {
				if (!src.cmd.isFlagSet(convar, src.cmd.findFlags[i][0])) continue;
				if (src.cmd.findFlags[i][1] !== search) continue;
				src.cmd.printConvarDescription(convar);
			}
		}
	};
	
	src.cmd.getConvar("findflags").autocompletefunc = function(args) {
		if (args.length === 1) return src.cmd.findFlags.map(e => e[1]);
		if (args.length === 2) return src.cmd.findFlags.filter(e => ~e[1].indexOf(args[1])).map(e => e[1]);
	}

	src.cmd.getConvar("differences").callback = function(args) {
		for (let cvarname of Object.keys(src.cmd.convars)) {
			let cvar = src.cmd.convars[cvarname];
			if (cvar.isCommand) continue;
			if (!src.cmd.showhidden) if (src.cmd.isFlagSet(cvar, FCVAR_DEVELOPMENTONLY) || src.cmd.isFlagSet(cvar, FCVAR_HIDDEN)) continue;
			if (cvar.value == cvar.default) continue;
			src.cmd.printConvarDescription(cvar);
		}
	};

	src.cmd.getConvar("toggle").callback = function(args) {
		if (args.length < 2) {
			return src.con.log("Usage:  toggle <cvarname> [value1] [value2] [value3]...\n");
		}
		let convar = src.cmd.getConvar(args[1]);
		if (!convar || convar.isCommand) return src.con.log(`${args[1]} is not a valid cvar\n`);
		if (!src.cmd.showhidden) if (src.cmd.isFlagSet(convar, FCVAR_DEVELOPMENTONLY) || src.cmd.isFlagSet(convar, FCVAR_HIDDEN)) return;
		// TODO: if flag FCVAR_SPONLY, only valid in singleplayer
		// TODO: if flag FCVAR_NOT_CONNECTED, only valid when not connected to a server
		// TODO: allow cheat commands in singleplayer, debug, or multiplayer with sv_cheats on (WHAT? WHY?)
		// TODO: "if this is a replicated ConVar, except don't wory about restrictions if playing a .dem file"
		if (args.length == 2) {
			// just toggle it on and off
			convar.value = !convar.value;
			src.cmd.printConvarDescription(convar);
		} else {
			let i = 2;
			// look for the current value in the command arguments
			for (; i < args.length; i++) {
				if (convar.value == args[i]) {
					break;
				}
			}

			// choose the next one
			i++;

			// if we didn't find it, or were at the last value in the command arguments, use the 1st argument
			if (i >= args.length) {
				i = 2;
			}

			convar.value = args[i];
			src.cmd.printConvarDescription(convar);
		}
	}

	src.cmd.getConvar("host_writeconfig").callback = function(args) {
		if (args.length > 2) {
			return src.con.log("Usage:  writeconfig <filename.cfg>\n");
		}

		if (args.length == 2) {
			let filename = args[1];
			if (!filename || !filename[0]) return;
			// Strip path and extension from filename
			filename = filename.split(/[\\\/]/).pop().split('.')[0];
			src.cfg.writeConfiguration(-1, `${filename}.cfg`);
		} else {
			src.cfg.writeConfiguration(-1, "config.cfg");
		}
	};
	
	src.cmd.getConvar("map").autocompletefunc = function(args) {
		if (args.length === 1) return src.maps.list;
		if (args.length === 2) return src.maps.list.filter(e => ~e.indexOf(args[1]));
	};
	src.cmd.getConvar("changelevel").autocompletefunc = src.cmd.getConvar("map").autocompletefunc;
	
	src.cmd.getConvar("map").callback = function(args) {
		src.maps.change(args[1]);
	};
	src.cmd.getConvar("changelevel").callback = function(args) {
		src.maps.change(args[1]);
	};
	src.cmd.getConvar("restart").callback = function(args) {
		src.maps.change(src.maps.cur);
	};
	
	CON_COMMAND("restart_level", "", function(args) {
		if (src.maps.cur === '') {
			src.con.log(`Unknown command "restart_level"\n`);
		} else {
			src.con.log(`Unknown command: restart_level`);
		}
		src.maps.change(src.maps.cur);
	});

	src.cmd.getConvar("disconnect").callback = function(args) {
		src.maps.change('');
	};

	CON_COMMAND("exec", "Execute script file.", function(args) {
		src.cfg.exec(args, false);
	}, function(args) {
		if (args.length === 1) return Object.keys(src.cfg.cfgs);
		if (args.length === 2) {
			let out = Object.keys(src.cfg.cfgs).filter(e => e.startsWith(args[1]));
			out = [...out, ...Object.keys(src.cfg.cfgs).filter(e => ~e.indexOf(args[1]) && !~out.indexOf(e))];
			return out;
		}
		return [];
	});

	src.cmd.getConvar("execifexists").callback = function(args) {
		src.cfg.exec(args, true);
	};

	src.cmd.getConvar("clear").callback = function(args) {
		src.con.clear();
	};

	src.cmd.getConvar("echo").callback = function(args) {
		src.con.log(`${args.slice(1).map(e => e + ' ').join('')}\n`);
	};

	src.cmd.getConvar("alias").callback = function(args) {
		if (args.length === 1) {
			src.con.log(`Current alias commands:\n`);
			for (let alias of src.cmd.aliases) {
				src.con.log(`${alias.name} : ${alias.cmd}\n`);
			}
			return;
		}
		let s = args[1];
		if (s.length >= src.cmd.maxAliasNameLength) {
			return src.con.log(`Alias name is too long\n`);
		}
		let cmd = args.slice(2).map(e => `${e} `).join('') + '\n';
		
		src.cmd.aliases = src.cmd.aliases.filter(e => e.name.toLowerCase() !== s.toLowerCase());
		
		if (false) {
			return src.con.log(`Cannot alias an existing ${true ? 'concommand' : 'convar'}\n`);
		}
		
		src.cmd.aliases.push({
			name: s,
			cmd: cmd
		});
	};

	CON_COMMAND("plugin_load", "plugin_load <filename> : loads a plugin", function(args) {
		if (args.length < 2) {
			return src.con.err(`plugin_load <filename>\n`);
		}
		src.plugin.load(args[1]);
	}, undefined, false);

	src.cmd.getConvar("quit").callback = function(args) {
		window.close();
	}

	// CUSTOM COMMANDS!
	CON_COMMAND('__slowdown', '__slowdown <on|off> - control the speed at which commands are ran.\n\ton - one command per tick\n\toff - instant\n', function(args) {
		if (args.length !== 2) {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
		if (args[1] === 'on') {
			src.cmd.slowdown = true;
		} else if (args[1] === 'off') {
			src.cmd.slowdown = false;
		} else {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
	}, function(args) {
		if (args.length < 3) return ['on', 'off'];
	});

	CON_COMMAND('__delete', '__delete <convar> - Unregisters a convar from the engine.\n', function(args) {
		if (args.length !== 2) {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
		let convar = src.cmd.getConvar(args[1]);
		if (!convar) return src.con.err(`Convar "${args[1]}" doesn't exist\n`);
		src.cmd.unregister(args[1]);
	}, function(args) {
		if (args.length === 1) return Object.keys(src.cmd.convars);
		if (args.length === 2) return Object.keys(src.cmd.convars).filter(e => ~e.indexOf(args[1])).sort().sort((a, b) => a.toLowerCase().startsWith(args[1].toLowerCase()) ? -1 : 0);
	});

	CON_COMMAND('__limitlength', '__limitlength <on|off> - toggle the engine\'s ability to run commands over 510 chars/64 args\n', function(args) {
		if (args.length !== 2) {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
		if (args[1] === 'on') {
			src.cmd.limitlength = true;
		} else if (args[1] === 'off') {
			src.cmd.limitlength = false;
		} else {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
	}, function(args) {
		if (args.length < 3) return ['on', 'off'];
	});

	CON_COMMAND('__showhidden', '__showhidden <on|off> - toggle the engine\'s ability to show hidden convars\n', function(args) {
		if (args.length !== 2) {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
		if (args[1] === 'on') {
			src.cmd.showhidden = true;
		} else if (args[1] === 'off') {
			src.cmd.showhidden = false;
		} else {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
	}, function(args) {
		if (args.length < 3) return ['on', 'off'];
	});

	CON_COMMAND('__timecmd', '__timecmd <command>... - run a command and time how long it takes\n', function(args) {
		if (args.length < 2) {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}

		src.cmd.getConvar('__timecmd_done').flags &= ~FCVAR_HIDDEN;
		let cmd = args.length === 2 ? args[1] : args.cmdStr.slice(args.argLengthS[0]);

		src.cmd.time = performance.now();
		src.cmd.executeCommand('__timecmd_done');
		src.cmd.executeCommand(cmd);
	});

	CON_COMMAND_F('__timecmd_done', '', FCVAR_HIDDEN, function(args) {
		src.cmd.getConvar(args[0]).flags |= FCVAR_HIDDEN;
		if (src.cmd.time) src.con.log(`Took ${performance.now() - src.cmd.time}ms\n`);
	});

	CON_COMMAND('__deletecfg', '__deletecfg <cfg> - delete a cfg file\n', function(args) {
		if (args.length !== 2) {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
		if (!src.cfg.cfgs[args[1]]) {
			return src.con.err(`CFG "${args[1]}" does not exist!\n`);
		}
		src.cfg.remove(args[1]);
	});

	CON_COMMAND('__deleteallcfgs', '__deleteallcfgs - delete all cfg files\n', function(args) {
		if (args.length !== 1) {
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}
		for (cfg of Object.keys(src.cfg.cfgs)) {
			src.cfg.remove(cfg);
		}
	});

	CON_COMMAND('__fetchcfg', '__fetchcfg <cfg> <url> - download a cfg file\n', function(args) {
		if (args.length < 3) {
			src.cmd.commandReady = true;
			return src.con.err(src.cmd.getConvar(args[0]).helpStr);
		}

		let url = args.length === 3 ? args[2] : args.cmdStr.slice(args.argLengthS[1]);

		if (!url.endsWith('.cfg')) {
			src.cmd.commandReady = true;
			return src.con.err('[__fetchcfg] failed: not a cfg!\n');
		}
		queryAPI(url).then(e => {
			src.cfg.set(args[1], e);
			src.cmd.commandReady = true;
		}).catch(err => {
			src.con.err(`[__fetchcfg] failed: ${err.message}\n`);
			src.cmd.commandReady = true;
		});
	}, undefined, false);

	CON_COMMAND('__kill', '__kill - Clears the command buffer, stopping recursion..\n', function(args) {
		src.cmd.buffer = [];
	});

	CON_COMMAND('__srcstart', '__srcstart - start engine\n', function(args) {
		src.start();
	})
}
src.cmd.reset();
