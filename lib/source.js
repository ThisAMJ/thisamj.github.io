const source = {

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
	
	expand: function(text, substitute = []) {
		if (text.encases('"', '"')) text = text.slice(1, -1);
		let str = '', sub = false, i = -1;
		while (++i < text.length) {
			if (text[i] == '$') {
				let c = text[i + 1];
				if (c == '$' || c == "'") {
					str += c;
					i++;
					continue;
				}
				if (c == '-') {
					i++;
					continue;
				}
				if (c >= 1 && c <= 9) {
					sub = true;
					let value = substitute.filter(e => e.name == 'arg ' + c);
					if (value[0]) str += value[0].val;
					else str += '$' + c;
					i++;
					continue;
				}
				let len = 0;
				while (true) {
					let ch = text[i + ++len];
					if (ch >= 'a' && c <= 'z') continue;
					if (ch >= 'A' && c <= 'Z') continue;
					if (ch >= '0' && c <= '9') continue;
					if (ch == '_' || c == '-') continue;
					break;
				}
				if (--len == 0) {
					str += '$';
					continue;
				}
				sub = true;
				let svar = text.substr(i + 1, len);
				let value = substitute.filter(e => e.name == 'svar ' + svar);
				if (value[0]) str += value[0].val;
				else str += '$' + svar;
				i += len + 1;
				continue;
			}
			str += text[i];
		}
		return {out: str, sub: sub};
	},
	
	repeatExpand: function(text, substitute = []) {
		let last = '', sub = false, i = 0;
		while (last != text && ++i) {
			last = text;
			let ex = this.expand(text, substitute);
			if (ex.sub) sub = true;
			text = ex.out;
		}
		return {out: text, sub: sub, steps: --i};
	},
	
	simplify: function(text, values = []) {
		text = this.getCommandArgs(text);
		for (let i = 0; i < text.length; i++) {
			if (text[i][0] == 'sar_alias') {
				if (text[i][2].encases('"', '"')) text[i][2] = text[i][2].slice(1, -1);
				values.push({type: 'alias', name: text[i][1], value: text[i].slice(2).join(' ')});
				text[i] = [];
			} else if (text[i][0] == 'sar_function') {
				if (text[i][2].encases('"', '"')) text[i][2] = text[i][2].slice(1, -1);
				values.push({type: 'function', name: text[i][1], value: text[i].slice(2).join(' ')});
				text[i] = [];
			} else if (text[i].some(e => values.some(f => e == f.name))) {
				console.log(text[i].filter(e => values.some(f => e == f.name)));
			}
		}
		console.log(values)
		return {out: text.map(e => e.filter(e => e).join(' ')).filter(e => e).join('\n'), values: values};
	},
	
	repeatSimplify: function(text) {
		let last = '', i = 0, values = [];
		while (last != text && ++i) {
			last = text;
			let sim = this.simplify(text, values);
			text = sim.out;
			values = sim.values;
		}
		return {out: text};
	},
}