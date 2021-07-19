// Todo:
//		Automatically redefine the last call of a defining function to the defining function's character (sounds more complicated than it is (?) )
//      Add back flatten, with splitting every 512 characters at max

// Known bugs:
//		Variable delimiter is overwritten with [] by alias

let q =  s => document.querySelector(s);
let qA = s => document.querySelectorAll(s);

var allowedChars = ['!#$%&*+,-./0123456789<=>?@[\\]^_`abcdefghijklmnopqrstuvwxyz|~', "(){}:'"], canvas;
var data, defaultMtriggers = [];


//You can try to shuffle these around to optimise the usage better, I think I've done pretty well
let shortcuts = {};

shortcuts.spStarts = [
	['1'     , '1_intro' ],
	['2'     , '2_laser_'],
	['BTS'   , '2_bts'   ],
	['TB'    , '4_tb_'   ],
	['Finale', '4_finale'],
];

shortcuts.mpStarts = [
	['Paint' , 'paint_'],
	['TBeam' , 'tbeam_'],
];

shortcuts.entityRules = [
	['InputNameOnProxyRelay1' ,                 '',                                                '','OnProxyRelay1'],
	['InputNameTrigger'       ,                 '',                                                '',      'Trigger'],
	['InputNameOnProxyRelay2' ,                 '',                                                '','OnProxyRelay2'],
	['InputNamePlaySound'     ,                 '',                                                '',    'PlaySound'],
	['TargetNamePlayerClip'   ,                 '','departure_elevator-elevator_doorclose_playerclip',             ''],
	['NameDoorActivation'     ,'"Door Activation"',                                                '',             ''],
	['InputNameOnProxyRelay3' ,                 '',                                                '','OnProxyRelay3'],
	['NameTrigger'            ,        ' Trigger"',                                                '',             ''],
	['InputNameStart'         ,                 '',                                                '',        'Start'],
	['InputNameEnable'        ,                 '',                                                '',       'Enable'],
	['InputNameTurnOn'        ,                 '',                                                '',       'TurnOn'],
	['NameRoom'               ,           ' Room"',                                                '',             ''],
	['TargetNameButton'       ,                 '',                                         '_button',             ''],
	['TargetNameAirlockOrange',                 '',                       'airlock_1-relay_orange_in',             ''],
	['NameActivation'         ,     ' Activation"',                                                '',             ''],
	['InputNameDisable'       ,                 '',                                                '',      'Disable'],
	['InputNameOpen'          ,                 '',                                                '',         'Open'],
];

shortcuts.portalRules = [
	['portalNameShot'  ,  'Shot"'],
	['portalNamePortal','Portal"'],
];

shortcuts.zoneRules = [
	['zoneNameRoom'       ,             ' Room"'],
	['zoneNamePassthrough','Portal Passthrough"'],
	['zoneNamePExit'      ,      ' Portal Exit"'],
	['zoneNamePEntry'     ,      'Portal Entry"'],
	['zoneNamePortal'     ,           ' Portal"'],
	['zoneNameWall'       ,             ' Wall"'],
];


function compile() {

	{
		localStorage.setItem('readableHeader', q('#txt').value);
		localStorage.setItem('compileLive',    q('#liveUpdate').checked);
		localStorage.setItem('includeHeader',  q('#includeHeader').checked);
		localStorage.setItem('includeContent', q('#includeContent').checked);
		localStorage.setItem('includeFooter',  q('#includeFooter').checked);
	}

	let compiled = compileFrom(q('#txt').value);


	q('#out').value = compiled;
	q('#outpre').innerHTML = `Compiled: (${formatBytes(compiled.length, 3, false)})`;


	// Thanks to https://stackoverflow.com/a/22826906/13192876
	let width, buffer, ctx, idata;
	with (Math) {
		width = ceil(sqrt(compiled.length));
		buffer = new Uint8ClampedArray(pow(width, 2) * 4);
		for (var loc = 0; loc < pow(width, 2); loc++) {
			var pos = loc * 4; // pixel loc
			var val = loc < compiled.length ? compiled.charCodeAt(loc) : 0;
			buffer[pos    ] = val % 256;
			buffer[pos + 1] = floor(val / 256);
			buffer[pos + 2] = 255;
			buffer[pos + 3] = 255;
		}
	}
	ctx = canvas.getContext('2d');
	[canvas.width, canvas.height] = [width, width];
	idata = ctx.createImageData(width, width);
	idata.data.set(buffer);
	ctx.putImageData(idata, 0, 0);
}

function compileFrom(text) {
	let v = (t) => rChars.join(t);
	let vIsDef = (t) => aliases.concat(functions).some(e => e[0] == v(t));
	let setIfDef = (val, t) => vIsDef(t) ? v(t) : val;
	let compileVariables = (t) => aliases.concat(functions).reduce((e, f) => e.replaceAll(f[0], f[1]), t);
	let squishCommand = (t) => 
		t.split('\n').map(e => 
			Array.from("(){}:'").reduce((e, f) => 
				e.split('"').map((g, h) => 
					h % 2 == 0 ? g.replaceAll(f + ' ', f).replaceAll(' ' + f, f) : g
				).join('"')
			, e.split('"').length == 2 ? e : e.split('"').map((e, f, g) => 
				f % 2 == 0 || e.indexOf('$') == -1 && (e.indexOf(' ') == -1 && e.indexOf(';') == -1 && e != '' && f < g.length - 1) ? e : `"${e}"`
			).join(' ').replaceEvery('  ', ' ').replaceAll('; ', ';').replaceAll(' ;', ';')).split('"').map((e, f, g) => 
				f % 2 == 0 ? e.trim() : e
			).join('"')
		).join('\n');
		
	

	let aliases = [], functions = [], varCount = [0, 0];
	let analysis = {entityRules : [], zoneRules : [], portalRules : []};

	let txt = [], header, content, footer;
	let rChars = ['', ''];
	
	let pFloat = e => parseFloat(e);
	
	{ // header
		header = ['sar_alias [alias] sar_alias', 'alias [funct] sar_function'].concat(text.split('\n'));
		aliases.push(['[alias]']);

		{ // initial squish, find variables, get rChars
			header = header.map(e => 
				e.trim().replaceEvery('  ', ' ')
			).map(e => 
				e.indexOf('//') > -1 ? e.substring(0, e.indexOf('//')) : e
			).filter(e => e != '').map(e => {
				if (e.split(' ').length > 1) {
					let variableName = e.split(' ')[1];
					Array.from(allowedChars[1]).forEach(e => variableName = variableName.replaceAll(e, ''));
					if (e.startsWith('alias ')) {
						e = e.replace('alias ', '[alias] ');
						aliases.push([variableName]);
					} else if (e.startsWith('funct ')) {
						e = e.replace('funct ', '[funct] ');
						functions.push([variableName]);
					} else if (functions.some(f => e.startsWith(f[0]))) {
						functions.push([variableName]);
					}
					return e.replaceAll(' funct ', ' [funct] ')
				}
				return e
			});

			// First alias or function
			// Does it start with alphabetic char?
			// If not, use first and last as variable header and footer
			let reg = new RegExp(/^[A-Za-z]/), func = e => {
				if (!reg.test(e[0][0])) {
					rChars = [
						e[0][0][0],
						e[0][0][e[0][0].length - 1]
					];
				}
			};
			if (aliases.length > 0) {
				func(aliases);
			} else if (functions.length > 0) {
				func(functions);
			}
		}
	}
	
	{ // content
		content = [...defaultMtriggers];

		for (let i = 0; i < content.length; i++) {
			let args = content[i].split('"').map(e => e.trim()).map((e, f) => f % 2 == 0 ? e.trim().split(' ') : [`"${e}"`]).flat(1);

			switch (args[0]) {
				case 'sar_speedrun_cc_start':
					let coop = args[2].indexOf('mp_coop_') > -1;
					let shortcut = 'start' + (coop ? 'MP' : 'SP');
					if (vIsDef(shortcut)) {
						args = [
							v(shortcut),
							args[1], // hey hey possible save?
							args[2].replace('map=', '').replace('sp_a', '').replace('mp_coop_', '')
						];
					}
					let usable = (coop ? shortcuts.mpStarts : shortcuts.spStarts).filter(e => 
						(args[2].startsWith(e[1]) && vIsDef(shortcut + e[0]))
					).sort((a, b) => b[1].length - a[1].length)[0];
					if (usable) {
						args[0] = v(shortcut + usable[0]);
						args[2] = args[2].replace(usable[1], '');
					}
					break;
				case 'sar_speedrun_cc_rule':
					args[0] = setIfDef(args[0], 'createRule');
					switch (args[2]) {
						case 'load':
							args = setIfDef(args, 'genericStartRule');
							break;
						case 'entity':
							let name = args[1];
							let target = args[3].replace('targetname=', '');
							let input = args[4].replace('inputname=', '');
							if (args.length == 5) {
								if (vIsDef('entityRule')) {
									args[0] = v('entityRule');
									args[1] = name;
									args[2] = '';
									args[3] = target;
									args[4] = input;
								}

								{
									if (name == '"End Trigger Blue"' &&
										target == 'team_door-team_proxy' &&
										input == 'OnProxyRelay1') {
										args = setIfDef(args, 'endTriggerBlue');
										break;
									}
									if (name == '"End Trigger Orange"' &&
										target == 'team_door-team_proxy' &&
										input == 'OnProxyRelay3') {
										args = setIfDef(args, 'endTriggerOrange');
										break;
									}
								} // End Trigger Blue/Orange
								
								{
									if (name == '"Middle Trigger Blue"' &&
										input == 'Trigger' && vIsDef('midTriggerBlue')) {
										args = [
											v('midTriggerBlue'),
											target
										];
										break;
									}
									if (name == '"Middle Trigger Orange"' &&
										input == 'Trigger' && vIsDef('midTriggerOrange')) {
										args = [
											v('midTriggerOrange'),
											target
										];
										break;
									}
								} // Middle Trigger Blue/Orange

								// Use the longest applicable shortcut
								let usable = shortcuts.entityRules.map(e => {
									let i1 = 1;
									while (e[i1] == '') i1++;
									let ind = i1 == 1 ? 1 : i1 + 1;
									if (ind < args.length) {
										if (args[ind].endsWith(e[i1]) && vIsDef(e[0])) {
											return [e[i1].replaceAll('"', '').length, e];
										}
									}
								}).filter(e => e).sort((a, b) => b[0] - a[0])[0];
								if (usable) {
									let i1 = 1;
									while (usable[1][i1] == '') i1++;
									let ind = i1 == 1 ? 1 : i1 + 1;
									args[0] = v(usable[1][0]);
									args[ind] = args[ind].replace(usable[1][i1], '');
									if (usable[1][i1].endsWith('"') && !usable[1][i1].startsWith('"')) {
										args[ind] += '"';
									}
								}

								if (args[0] == setIfDef(setIfDef('sar_speedrun_cc_rule', 'createRule'), 'entityRule')) {
									analysis.entityRules.push([name, target, input]);
								}
							}
							break;
						case 'zone':
							args[3] = 'center=' + args[3].replace('center=', '').split(',').map(pFloat).join(',');
							args[4] = 'size='   + args[4].replace('size=',   '').split(',').map(pFloat).join(',');
							args[5] = 'angle='  + args[5].replace('angle=',  '').split(',').map(pFloat).join(',');
							if (vIsDef('zoneRule') && args[5] == 'angle=0') {
								args[0] = v('zoneRule');
								args[2] = '';
								args[3] = args[3].replace('center=', '');
								args[4] = args[4].replace('size=', '');
								args[5] = '';

								// Use the first shortcut you find that matches the rule
								for (let j = 0; j < shortcuts.zoneRules.length; j++) {
									if (args[1].endsWith(shortcuts.zoneRules[j][1]) && vIsDef(shortcuts.zoneRules[j][0])) {
										args[0] = v(shortcuts.zoneRules[j][0]);
										args[1] = args[1].replace(shortcuts.zoneRules[j][1], '');
										if (shortcuts.zoneRules[j][1].endsWith('"') && !shortcuts.zoneRules[j][1].startsWith('"')) {
											args[1] += '"';
										}
										if (args[1] == '""') {
											args[1] = '';
										}
										break;
									}
								}

								if (args[0] == setIfDef(setIfDef('sar_speedrun_cc_rule', 'createRule'), 'zoneRule')) {
									analysis.zoneRules.push([args[1], args[3].replace('center=', ''), args[4].replace('size=', '')]);
								}
							}
							break;
						case 'portal':
							if (vIsDef('portalRule') && args[5] == 'angle=0') {
								args[0] = v('portalRule');
								args[2] = '';
								args[3] = args[3].replace('center=', '');
								args[4] = args[4].replace('size=', '');
								args[5] = '';

								// Use the first shortcut you find that matches the rule
								for (let j = 0; j < shortcuts.portalRules.length; j++) {
									if (args[1].endsWith(shortcuts.portalRules[j][1]) && vIsDef(shortcuts.portalRules[j][0])) {
										args[0] = v(shortcuts.portalRules[j][0]);
										args[1] = args[1].replace(shortcuts.portalRules[j][1], '');
										if (shortcuts.portalRules[j][1].endsWith('"') && !shortcuts.portalRules[j][1].startsWith('"')) {
											args[1] += '"';
										}
										if (args[1] == '""') {
											args[1] = '';
										}
										break;
									}
								}

								if (args[0] == setIfDef(setIfDef('sar_speedrun_cc_rule', 'createRule'), 'portalRule')) {
									analysis.portalRules.push([args[1], args[3].replace('center=', ''), args[4].replace('size=', '')]);
								}

							}
							break;
						case 'fly':
							switch (args[1]) {
								case '"Crouch Fly"':
									args = setIfDef(args, 'flyRule');
									break;
								case '"Crouch Fly Blue"':
									args = setIfDef(args, 'flyRuleCoopBlue');
									break;
								case '"Crouch Fly Orange"':
									args = setIfDef(args, 'flyRuleCoopOrange');
									break;
							}
							break;
						case 'flags':
							switch (args[1]) {
								case '"Flags"':
									args = setIfDef(args, 'genericSPFlagsRule');
									break;
								case '"Flags 1"':
									args = setIfDef(args, 'genericMPFlag1Rule');
									break;
								case '"Flags 2"':
									args = setIfDef(args, 'genericMPFlag2Rule');
									break;
							}
							break;
					}
					break;
				case 'sar_speedrun_cc_finish':
					args = setIfDef(args, 'endCategory');
					break;
			}
			content[i] = (typeof args == 'string' ? args : args.join(' ')).trim().replaceEvery('  ', ' ');
		}

		content = content.join('\n');

		let a = `
			genericStartRule
			flyRuleCoopBlue
			flyRuleCoopOrange
			flyRuleCoopBoth
			genericSPFlagsRule
			endCategory
			genericSPFlagRules
			genericMPFlag1Rule
			genericMPFlag2Rule
			genericMPFlagRules
			endTriggerBlue
			endTriggerOrange
			endTriggerAndMPFlagRules
		`.trim().replaceAll('\t', '').split('\n').map(e => v(e));

		content = content.replaceAll(`\n${a[0]}`, `; ${a[0]}`);
		content = content.replaceAll(`\n${a[1]}\n${a[2]}`, `\n${a[3]}`);
		content = content.replaceAll(`\n${a[4]}\n${a[5]}`, `\n${a[6]}`);
		content = content.replaceAll(`\n${a[7]}\n${a[8]}\n${a[5]}`, `\n${a[9]}`);
		content = content.replaceAll(`\n${a[10]}\n${a[11]}\n${a[9]}`, `\n${a[12]}`);

		content = content.split('\n');
	}

	{ // footer
		footer = [];
		footer = aliases.map(e => 
			e[0] != '[alias]' && e[0] != '[funct]' ? `[alias] ${e[0]} "` : undefined
		).concat(functions.map(e => 
			`[funct] ${e[0]} "`
		)).concat(['[alias] [funct] "', '[alias] [alias] "']).filter(e => e);
	}

	if (q('#includeHeader').checked) txt.push(header.join('\n'));
	if (q('#includeContent').checked) txt.push(content.join('\n'));
	if (q('#includeFooter').checked) txt.push(footer.join('\n'));
	txt = squishCommand(txt.join('\n'));

	// use breakset for commands that have the most 'breakable spaces'
	// aka spaces that would be removed by using a breakset character
	let breakableOccurrences = [];
	{
		let occurrences = t => txt.split(t).length - 1;
		breakableOccurrences = aliases.map((e, f) => {
			let c = occurrences(' ' + e[0] + ' ');
			let co = occurrences(' ' + e[0]) + occurrences(e[0] + ' ');
			return [true, f, co - c];
		});
		breakableOccurrences = breakableOccurrences.concat(functions.map((e, f) => {
			let c = occurrences(' ' + e[0] + ' ');
			let co = occurrences(' ' + e[0]) + occurrences(e[0] + ' ');
			return [false, f, co - c];
		}));
		breakableOccurrences.sort((a, b) => b[2] - a[2]).slice(0, allowedChars[1].length).map(e => {
			(e[0] ? aliases : functions)[e[1]][1] = allowedChars[1][varCount[1]++];
		});
		breakableOccurrences = breakableOccurrences.map(e => {
			return [(e[0] ? aliases : functions)[e[1]], e[2]];
		})
	}

	console.clear();

	console.log('If mtriggers are not updating with GitHub, right click the refresh button and press "Empty cache and hard reload"');

	// use regular set for every other command
	// for now smart redefinition is ignored, could save a few definitions
	// but only if i can be fked figuring that out
	let unassigned = aliases.concat(functions).filter(e => !e[1]).slice(allowedChars[0].length);
	{
		let f = e => e[1] ? e : [e[0], allowedChars[0][varCount[0]++]];
		aliases = aliases.filter(e => e[1]).concat(aliases.filter(e => !e[1]).slice(0, allowedChars[0].length).map(f));
		functions = functions.filter(e => e[1]).concat(functions.filter(e => !e[1]).slice(0, allowedChars[0].length - aliases.length).map(f));
	}


	let f = e => e[0][0] + ' :: ' + e[1] + ' breakable space(s) : ' + e[0][1];
	console.log('Breakset variables :\n' + breakableOccurrences.slice(0, allowedChars[1].length).map(f).join('\n').padByDelim(':'));
	// console.log('Other variables :\n' + breakableOccurrences.slice(allowedChars[1].length).map(f).join('\n').padByDelim(':'));
	
	console.log(varCount[0] + "/" + allowedChars[0].length + " variables used (" + (varCount[0] / allowedChars[0].length * 100).toFixed(2) +"%)");
	if (varCount[0] > allowedChars[0].length - 1) {
		console.error('AHH WE"RE OUT OF VARIABLE CHARACTERS!!!!!! ANARCHYHYCHYCHCYH!!!!11!!')
	} else if (allowedChars[0].length - varCount[0] < 10) {
		console.warn(allowedChars[0].length - varCount[0] + ' variable characters remaining!!');
	}

	console.log(analysis);

	txt = compileVariables(txt);
	txt = squishCommand(txt);
	return txt;
}


function txtUpdate() {
	if (q('#liveUpdate').checked) compile();
}

function toggleLiveUpdate(t) {
	q('button').style.visibility = q('#liveUpdate').checked ? 'hidden' : 'visible';
	if (t && q('#liveUpdate').checked) compile();
}

function readStorage(key, fallback) {
	let storage = localStorage.getItem(key);
	return storage == null ? fallback : storage;
}

window.onload = async function() {
	q('#txt').value = 'Loading mtriggers from Github...';
	data = await new P2Data().getMtriggers();
	data.removeTrailingZeroes();
	defaultMtriggers = data.maps.filter(e => e.triggers.length > 0).map(e => 
		`sar_speedrun_cc_start "${e.splitname}" map=${e.filename} action=split\n` +
		e.triggers.map(e =>
			'sar_speedrun_cc_rule ' + e
				.replace('"Mid Room Blue"'     , '"Middle Trigger Blue"')
				.replace('"Mid Room Orange"'   , '"Middle Trigger Orange"')
				.replace('"Middle Room Blue"'  , '"Middle Trigger Blue"')
				.replace('"Middle Room Orange"', '"Middle Trigger Orange"')
		).join('\n') +
		'\nsar_speedrun_cc_finish'
	).join('\n').split('\n');
	q('#txt').value              = readStorage('readableHeader', '// Readable header goes here!');
	q('#liveUpdate').checked     = readStorage('compileLive',    'true') == 'true';
	q('#includeHeader').checked  = readStorage('includeHeader',  'true') == 'true';
	q('#includeContent').checked = readStorage('includeContent', 'true') == 'true';
	q('#includeFooter').checked  = readStorage('includeFooter',  'true') == 'true';
	canvas = q('canvas');
	compile();
	toggleLiveUpdate(false);
	q('#txt').addEventListener('keydown', function(e) {
		// https://stackoverflow.com/a/6637396/13192876
		if (e.key == 'Tab') {
			e.preventDefault();
			var start = this.selectionStart, end = this.selectionEnd;

			// set textarea value to: text before caret + tab + text after caret
			this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

			// put caret at right position again
			this.selectionStart = this.selectionEnd = start + 1;
		}
	});
}