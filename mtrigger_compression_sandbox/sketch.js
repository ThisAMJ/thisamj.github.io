//	Todo:
//		Automatically redefine the last call of a defining function to the defining function's character (sounds more complicated than it is (?) )
//		Add back flatten, with splitting every 511 characters at max

let q =  s => document.querySelector(s);
let qA = s => document.querySelectorAll(s);

const allowedChars = [
	'!#$%&*+,-./0123456789<=>?@[\\]^_`abcdefghijklmnopqrstuvwxyz|~',
	"(){}:'"
];
var data, defaultMtriggers = [];
var readableHeader =
`
// Readable header for AMJ's P2SR Mtrigger Compression Sandbox
// Because of the close relationship between the header and the code used to compress it,
// I have decided to remove the live editability of the header.

funct [startCategoryFunc] "funct $1 sar_speedrun_cc_start $'$$1$' map=$2$$2 action=split; [genericStartRule]"

funct [startMPFunc] [startCategoryFunc] $1 mp_coop_$2
	[startMPFunc] [startMP]      // any other maps
	[startMPFunc] [startMPPaint]  paint_
	[startMPFunc] [startMPTBeam]  tbeam_
funct [startSPFunc] [startCategoryFunc] $1 sp_a$2
	[startSPFunc] [startSP]      // any other maps
	[startSPFunc] [startSP1]      1_intro
	[startSPFunc] [startSP2]      2_laser_
	[startSPFunc] [startSPBTS]    2_bts
	[startSPFunc] [startSPTB]     4_tb_
	[startSPFunc] [startSPFinale] 4_finale


alias [createRule]     sar_speedrun_cc_rule
alias [endCategory]    sar_speedrun_cc_finish

// Because of the ability to remove quotes at the end of lines, it is better to put name last

funct [entityRule] [createRule] "$3" entity targetname=$1 inputname=$2
funct    [flyRule] [createRule] "Crouch Fly$2" fly $1

funct [createPositionedRuleFunction] funct $1 [createRule] "$$3" $2 center=$$1 size=$$2 angle=0
	[createPositionedRuleFunction] [portalRule] "portal"
	[createPositionedRuleFunction]   [zoneRule] "zone"


funct [portalNamePortal] [portalRule] "$1Portal" $2 $3


funct [zoneFunc] funct $1 [zoneRule] "$$1$2" $$2 $$3
[zoneFunc] [zoneNameRoom]        " Room"
[zoneFunc] [zoneNamePassthrough] "Portal Passthrough"
[zoneFunc] [zoneNamePExit]       " Portal Exit"
[zoneFunc] [zoneNamePEntry]      "Portal Entry"
[zoneFunc] [zoneNamePortal]      " Portal"
[zoneFunc] [zoneNameWall]        " Wall"


alias [genericStartRule] [createRule] "Start" load action=force_start

funct [createFlagRule] funct $1 [createRule] "Flags$4" flags action=$2 "ccafter=$3"
	[createFlagRule] [genericSPFlagsRule] stop  "Start"   ""      
	[createFlagRule] [genericMPFlag1Rule] split "Start"   " 1"    
	[createFlagRule] [genericMPFlag2Rule] stop  "Flags 1" " 2"   

alias [genericSPFlagRules] "[genericSPFlagsRule]; [endCategory]"
alias [genericMPFlagRules] "[genericMPFlag1Rule]; [genericMPFlag2Rule]; [endCategory]"

funct [entityRuleFunction]   funct $1 [entityRule] $3$$2 $2$$1 "$4$$3"
funct [OnProxyRelayFunction] [entityRuleFunction] $1 OnProxyRelay$2
	[OnProxyRelayFunction] [InputNameOnProxyRelay1] 1 
	[OnProxyRelayFunction] [InputNameOnProxyRelay2] 2 
	[OnProxyRelayFunction] [InputNameOnProxyRelay3] 3 

//                             Function Name      AppendInput AppendTarget                                       AppendTrigger    
	[entityRuleFunction]   [InputNamePlaySound]   "PlaySound" ""                                                 ""
	[entityRuleFunction]   [InputNameTrigger]     "Trigger"   ""                                                 ""
	[entityRuleFunction]   [InputNameEnable]      "Enable"    ""                                                 ""
	[entityRuleFunction]   [InputNameTurnOn]      "TurnOn"    ""                                                 ""
	[entityRuleFunction]   [InputNameStart]       "Start"     ""                                                 ""
	[entityRuleFunction]   [TargetNamePlayerClip] ""          "departure_elevator-elevator_doorclose_playerclip" ""
	[entityRuleFunction]   [TargetNameButton      ""          "_button"                                          ""
	[entityRuleFunction]   [NameDoorActivation]   ""          ""                                                 "Door Activation"
	[entityRuleFunction]   [NameTrigger]          ""          ""                                                 " Trigger"
	[entityRuleFunction]   [NameRoom]             ""          ""                                                 " Room"


funct [endTriggerRuleFunction] funct $1 $3 "End Trigger $2e" team_door-team_proxy
	[endTriggerRuleFunction] [endTriggerBlue]    Blu   [InputNameOnProxyRelay1]
	[endTriggerRuleFunction] [endTriggerOrange]  Orang [InputNameOnProxyRelay3]

alias [endTriggerAndMPFlagRules] "[endTriggerBlue]; [endTriggerOrange]; [genericMPFlagRules]"

funct [midTriggerRuleFunction] funct $1 [InputNameTrigger] "Middle Trigger $2e" $$1 
	[midTriggerRuleFunction] [midTriggerBlue]    Blu
	[midTriggerRuleFunction] [midTriggerOrange]  Orang

funct [flyRuleCoop] funct $1 [flyRule] player=$3 " $2e"
	[flyRuleCoop] [flyRuleCoopBlue]   Blu   0
	[flyRuleCoop] [flyRuleCoopOrange] Orang 1
alias [flyRuleCoopBoth] "[flyRuleCoopBlue]; [flyRuleCoopOrange]"
`;

let shortcuts = {
	spStarts: [
		['1'     , '1_intro' ],
		['2'     , '2_laser_'],
		['BTS'   , '2_bts'   ],
		['TB'    , '4_tb_'   ],
		['Finale', '4_finale'],
	],

	mpStarts: [
		['Paint','paint_'],
		['TBeam','tbeam_'],
	],

	entityRules: [
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
	],

	portalRules: [
		['portalNamePortal','Portal"'],
	],

	zoneRules: [
		['zoneNameRoom'       ,             ' Room"'],
		['zoneNamePassthrough','Portal Passthrough"'],
		['zoneNamePExit'      ,      ' Portal Exit"'],
		['zoneNamePEntry'     ,      'Portal Entry"'],
		['zoneNamePortal'     ,           ' Portal"'],
		['zoneNameWall'       ,             ' Wall"'],
	],
};

function compile() {
	localStorage.setItem('includeHeader',  q('#includeHeader').checked);
	localStorage.setItem('includeContent', q('#includeContent').checked);
	localStorage.setItem('includeFooter',  q('#includeFooter').checked);
	let compiled = compileFrom(readableHeader);
	q('#out').value = compiled;
	q('#outpre').innerHTML = `Compiled: (${formatBytes(compiled.length, 3, false)})`;
}

function compileFrom(text) {
	console.clear();
	let compileVariables = t => aliases.concat(functions).reduce((e, f) => e.replaceAll(f[0], f[1]), t);

	let aliases = [['[alias]'], ['[funct]']], functions = [], varCount = [0, 0];

	let txt = [], header, content, footer;
		
	{ // header
		text = text.replaceAll('\t', ' ').split('\n').map(e => 
			source.removeComments(e.trim().replaceEvery('  ', ' '))
		).filter(e => e).join('\n');
		header = [
			'sar_alias [alias] sar_alias',
			'[alias] [funct] sar_function',
			...source.getCommandArgs(text).map(e => 
				e.map((e, f, g) => {
					if (f == 0) {
						if (e == 'alias') aliases.push([g[1]]);
						else if (e == 'funct') functions.push([g[1]]);
						else if (functions.some(f => f[0] == e)) functions.push([g[1]]);
					}
					return e == 'funct' ? '[funct]' : e == 'alias' ? '[alias]' : e;
			}).join(' ').replaceAll('funct ', '[funct] ').replaceAll(' funct', ' [funct]'))
			// bodge
		];
	}
	
	{ // content
		content = [...defaultMtriggers];

		for (let i = 0; i < content.length; i++) {
			let args = source.getCommandArgs(content[i])[0];
			let name, target, input, center, size, angle;
			switch (args[0]) {
				case 'sar_speedrun_cc_start':
					let coop = args[2].indexOf('mp_coop_') > -1;
					let shortcut = 'start' + (coop ? 'MP' : 'SP');
					args = [
						'[' + shortcut + ']',
						args[1], // hey hey possible save?
						args[2].replace('map=', '').replace('sp_a', '').replace('mp_coop_', '')
					];
					let usable = (coop ? shortcuts.mpStarts : shortcuts.spStarts).filter(e => 
						(args[2].startsWith(e[1]))
					).sort((a, b) => b[1].length - a[1].length)[0];
					if (usable) {
						args[0] = '[' + shortcut + usable[0] + ']';
						args[2] = args[2].replace(usable[1], '');
					}
					break;
				case 'sar_speedrun_cc_rule':
					args[0] = '[createRule]';
					switch (args[2]) {
						case 'load':
							args = '[genericStartRule]';
							break;
						case 'entity':
							name   = args[1];
							target = args[3].replace('targetname=', '');
							input  = args[4].replace('inputname=', '');
							if (args.length == 5) {
								args = [
									'[entityRule]',
									target,
									input,
									name
								];

								{
									if (name   == '"End Trigger Blue"' &&
										target == 'team_door-team_proxy' &&
										input  == 'OnProxyRelay1') {
										args = '[endTriggerBlue]';
										break;
									}
									if (name   == '"End Trigger Orange"' &&
										target == 'team_door-team_proxy' &&
										input  == 'OnProxyRelay3') {
										args = '[endTriggerOrange]';
										break;
									}
								} // End Trigger Blue/Orange
								
								{
									if (name  == '"Middle Trigger Blue"' &&
										input == 'Trigger') {
										args = [
											'[midTriggerBlue]',
											target
										];
										break;
									}
									if (name  == '"Middle Trigger Orange"' &&
										input == 'Trigger') {
										args = [
											'[midTriggerOrange]',
											target
										];
										break;
									}
								} // Middle Trigger Blue/Orange

								// Use the longest applicable shortcut
								let usable = shortcuts.entityRules.map(e => {
									let i1 = 1;
									while (e[i1] == '') i1++;
									let ind = i1 == 1 ? 3 : i1 == 2 ? 1 : 2;
									if (ind < args.length) {
										if (args[ind].endsWith(e[i1])) {
											return [e[i1].replaceAll('"', '').length, e];
										}
									}
								}).filter(e => e).sort((a, b) => b[0] - a[0])[0];
								if (usable) {
									let i1 = 1;
									while (usable[1][i1] == '') i1++;
									let ind = i1 == 1 ? 3 : i1 == 2 ? 1 : 2;
									args[0] = '[' + usable[1][0] + ']';
									args[ind] = args[ind].replace(usable[1][i1], '');
									if (usable[1][i1].endsWith('"') && !usable[1][i1].startsWith('"')) {
										args[ind] += '"';
									}
									if (args[ind] == '') args[ind] = '""';
								}
							}
							break;
						case 'zone':
							name = args[1];
							center = args[3].replace('center=', '');
							size = args[4].replace('size=', '');
							angle = args[5].replace('angle=', '');
							if (angle == 0 && args.length == 6) {
								args = [
									'[zoneRule]',
									center,
									size,
									name
								];

								// Use the first shortcut you find that matches the rule
								for (let j = 0; j < shortcuts.zoneRules.length; j++) {
									if (args[1].endsWith(shortcuts.zoneRules[j][1])) {
										args[0] = '[' + shortcuts.zoneRules[j][0] + ']';
										args[1] = args[1].replace(shortcuts.zoneRules[j][1], '');
										if (shortcuts.zoneRules[j][1].endsWith('"') && !shortcuts.zoneRules[j][1].startsWith('"')) {
											args[1] += '"';
										}
										break;
									}
								}
							}
							break;
						case 'portal':
							name = args[1];
							center = args[3].replace('center=', '');
							size = args[4].replace('size=', '');
							angle = args[5].replace('angle=', '');
							if (angle == 0) {
								args = [
									'[portalRule]',
									center,
									size,
									name
								];

								// Use the first shortcut you find that matches the rule
								for (let j = 0; j < shortcuts.portalRules.length; j++) {
									if (args[1].endsWith(shortcuts.portalRules[j][1])) {
										args[0] = '[' + shortcuts.portalRules[j][0] + ']';
										args[1] = args[1].replace(shortcuts.portalRules[j][1], '');
										if (shortcuts.portalRules[j][1].endsWith('"') && !shortcuts.portalRules[j][1].startsWith('"')) {
											args[1] += '"';
										}
										break;
									}
								}
							}
							break;
						case 'fly':
							switch (args[1]) {
								case '"Crouch Fly"':
									args = '[flyRule]';
									break;
								case '"Crouch Fly Blue"':
									args = '[flyRuleCoopBlue]';
									break;
								case '"Crouch Fly Orange"':
									args = '[flyRuleCoopOrange]';
									break;
							}
							break;
						case 'flags':
							switch (args[1]) {
								case '"Flags"':
									args = '[genericSPFlagsRule]';
									break;
								case '"Flags 1"':
									args = '[genericMPFlag1Rule]';
									break;
								case '"Flags 2"':
									args = '[genericMPFlag2Rule]';
									break;
							}
							break;
					}
					break;
				case 'sar_speedrun_cc_finish':
					args = '[endCategory]';
					break;
			}
			content[i] = (typeof args == 'string' ? args : args.join(' ')).trim().replaceEvery('  ', ' ');
		}

		let a = `genericStartRule
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
			endTriggerAndMPFlagRules`.split('\n').map(e => '[' + e.trim() + ']');

		content = content
			.filter(e => e)
			.join('\n')
			.replaceAll(`\n${a[0]}`,                     ``)
			.replaceAll(`\n${a[1]}\n${a[2]}`,            `\n${a[3]}`)
			.replaceAll(`\n${a[4]}\n${a[5]}`,            `\n${a[6]}`)
			.replaceAll(`\n${a[7]}\n${a[8]}\n${a[5]}`,   `\n${a[9]}`)
			.replaceAll(`\n${a[10]}\n${a[11]}\n${a[9]}`, `\n${a[12]}`)
			.split('\n');
	}
	
	{ // footer
		footer = aliases.map(e => e[0] != '[alias]' && e[0] != '[funct]'
			? `[alias] ${e[0]} ""`
			: undefined
		).concat(functions.map(e => 
			`[funct] ${e[0]} ""`
		)).concat([
			`[alias] [funct] ""`,
			`[alias] [alias] ""`
		]).filter(e => e);
	}
	
	header = source.compress(header.join('\n'), {
		minimizeLines: false,
		minifyInsideQuotes: true,
		removeTrailingQuotes: true,
	});
	
	content = source.compress(content.join('\n'), {
		minimizeLines: false,
		minifyInsideQuotes: true,
		removeTrailingQuotes: true,
	});
	footer = source.compress(footer.join('\n'), {
		minimizeLines: false,
		minifyInsideQuotes: true,
		removeTrailingQuotes: false,
	});

	if (q('#includeHeader').checked)  txt.push(header.join('\n'));
	if (q('#includeContent').checked) txt.push(content.join('\n'));
	if (q('#includeFooter').checked)  txt.push(footer.join('\n'));
	
	txt = txt.join('\n');

	// use breakset for commands that have the most 'breakable spaces'
	// aka spaces that would be removed by using a breakset character
	let occurrences = t => txt.split(t).length - 1;
	let func = (a, e, f) => [a,  f, occurrences(' ' + e[0]) + occurrences(e[0] + ' ') - occurrences(' ' + e[0] + ' ')];
	let breakableOccurrences = aliases.map((e, f) => 
		func(true, e, f)
	).concat(functions.map((e, f) => 
		func(false, e, f)
	)).sort((a, b) => b[2] - a[2]);
	breakableOccurrences.slice(0, allowedChars[1].length).forEach(e => {
		(e[0] ? aliases : functions)[e[1]][1] = allowedChars[1][varCount[1]++];
	})
	breakableOccurrences = breakableOccurrences.map(e => [(e[0] ? aliases : functions)[e[1]], e[2]]);

	// use regular set for every other command
	// for now smart redefinition is ignored, could save a few definitions
	// but only if i can be fked figuring that out
	let unassigned = aliases.concat(functions).filter(e => !e[1]).slice(allowedChars[0].length);
	{
		let f = e => e[1] ? e : [e[0], allowedChars[0][varCount[0]++]];
		aliases = aliases.filter(e => e[1]).concat(aliases.filter(e => !e[1]).slice(0, allowedChars[0].length).map(f));
		functions = functions.filter(e => e[1]).concat(functions.filter(e => !e[1]).slice(0, allowedChars[0].length - varCount[0]).map(f));
	}

	let f = e => `${e[0][0]} :: ${e[1]} breakable space(s) : ${e[0][1]}`;
	console.log('Break Set variables :\n' + breakableOccurrences.slice(0, allowedChars[1].length).map(f).join('\n').padByDelim(':'));
	
	console.log(`${varCount[0]}/${allowedChars[0].length} variables used (${(varCount[0] / allowedChars[0].length * 100).toFixed(2)}%)`);
	if (varCount[0] > allowedChars[0].length - 1) {
		console.error('AHH WE"RE OUT OF VARIABLE CHARACTERS!!!!!! ANARCHYHYCHYCHCYH!!!!11!!')
	} else if (allowedChars[0].length - varCount[0] < 10) {
		console.warn(allowedChars[0].length - varCount[0] + ' variable characters remaining!!');
	}
	txt = source.compress(compileVariables(txt), {
		minimizeLines: true,
		minifyInsideQuotes: true,
		removeTrailingQuotes: false,
	}).join('\n');
	return txt;
}

function readStorage(key, fallback) {
	let storage = localStorage.getItem(key);
	return storage == null ? fallback : storage;
}

window.onload = async function() {
	data = await new P2Data();
	await data.getMtriggers();
	
	data.removeTrailingZeroes();
	data.optimisePortalTriggers();
	defaultMtriggers = data.maps.filter(e => e.triggers.length).map(e => 
		[
			`sar_speedrun_cc_start "${e.splitname}" map=${e.filename} action=split`,
			e.triggers.map(e =>
				'sar_speedrun_cc_rule ' + e
					.replace('"Mid Room Blue"'     , '"Middle Trigger Blue"')
					.replace('"Mid Room Orange"'   , '"Middle Trigger Orange"')
					.replace('"Middle Room Blue"'  , '"Middle Trigger Blue"')
					.replace('"Middle Room Orange"', '"Middle Trigger Orange"')
			).join('\n'),
			'sar_speedrun_cc_finish'
		].join('\n')
	).join('\n').split('\n');
	q('#txt').value = readableHeader;
	q('#includeHeader').checked  = readStorage('includeHeader',  'true') == 'true';
	q('#includeContent').checked = readStorage('includeContent', 'true') == 'true';
	q('#includeFooter').checked  = readStorage('includeFooter',  'true') == 'true';
	compile();
}
