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
	});
	return txt;
}

function readStorage(key, fallback) {
	let storage = localStorage.getItem(key);
	return storage == null ? fallback : storage;
}

window.onload = async function() {
	data = await new P2Data();
	if (true) {
		let mt = `
			sar_speedrun_cc_start "Container Ride" map=sp_a1_intro1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Room Trigger" entity targetname=relay_start_map inputname=Trigger
			sar_speedrun_cc_rule "Second Room" entity targetname=drop_box_rl inputname=Trigger
			sar_speedrun_cc_rule "Fizzler" entity targetname=departure_elevator-logic_source_elevator_door_open inputname=Trigger
			sar_speedrun_cc_rule "End" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Portal Carousel" map=sp_a1_intro2 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Cube Room" zone center=-31.5,397.97,-11 size=66.8,36,110 angle=0
			sar_speedrun_cc_rule "Button Room" zone center=-685.97,96.04,-3 size=36,64.14,110 angle=0
			sar_speedrun_cc_rule "Ending Room" zone center=-429.97,511.69,-11 size=36,64.07,110 angle=0
			sar_speedrun_cc_rule "Exit Door" zone center=-319.62,624.13,-0.38 size=127.17,30.4,127.17 angle=0
			sar_speedrun_cc_rule "End" entity targetname=departure_elevator-close inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Portal Gun" map=sp_a1_intro3 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Drop Trigger" entity targetname=podium_collapse inputname=EnableRefire
			sar_speedrun_cc_rule "Portal Entry" zone center=94.68,2260.19,-192.3 size=103.55,70.96,127.34 angle=0
			sar_speedrun_cc_rule "Orange Portal Trigger" entity targetname=room_1_portal_deactivate_rl inputname=Trigger
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_3-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Smooth Jazz" map=sp_a1_intro4 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Dropper Trigger" entity targetname=logic_drop_box inputname=Trigger
			sar_speedrun_cc_rule "Second Room" entity targetname=info_sign-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Cube Fizzle" entity targetname=section_2_box_2 inputname=Dissolve
			sar_speedrun_cc_rule "Trap Room" entity targetname=room_2_portal_deactivate_rl inputname=Trigger
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_2-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Cube Momentum" map=sp_a1_intro5 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal Trigger" entity targetname=room_1_portal_activate_rl inputname=Trigger
			sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper_2-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Door" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Future Starter" map=sp_a1_intro6 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal Trigger" entity targetname=room_1_fling_portal_activate_rl inputname=Trigger
			sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Second Room" entity targetname=music.sp_a1_intro6 inputname=PlaySound
			sar_speedrun_cc_rule "Second Button Activation" entity targetname=button_2-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Secret Panel" map=sp_a1_intro7 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Passthrough" entity targetname=ceiling_drips_2_particles inputname=Start
			sar_speedrun_cc_rule "Waffle Shot" portal center=-2368,300,1500 size=7,102,302 angle=0
			sar_speedrun_cc_rule "Transition Trigger" entity targetname=transition_airlock_door_close_rl inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Wakeup" map=sp_a1_wakeup action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=training_door inputname=Open
			sar_speedrun_cc_rule "Drop" entity targetname=light_dynamic_basement inputname=TurnOn
			sar_speedrun_cc_rule "Elevator" entity targetname=basement_breakers_entrance_door inputname=Close
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Incinerator" map=sp_a2_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Incinerator Room" entity targetname=chute_1_relay inputname=Trigger
			sar_speedrun_cc_rule "Mid Room" entity targetname=incinerator_portal inputname=SetFadeEndDistance
			sar_speedrun_cc_rule "Portal Gun Grab" entity targetname=pickup_portalgun_relay inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Intro" map=sp_a2_laser_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=start inputname=Trigger
			sar_speedrun_cc_rule "Door Entry" entity targetname=door_0-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Elevator Trigger" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger
			sar_speedrun_cc_rule "Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Stairs" map=sp_a2_laser_stairs action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Dropper Trigger" entity targetname=cube_dropper_01-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Button Activation" entity targetname=exit_button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Dual Lasers" map=sp_a2_dual_lasers action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Switch Glitch" entity targetname=room_2_check_2_activated_relay inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Over Goo" map=sp_a2_laser_over_goo action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Panels Trigger" entity targetname=InstanceAuto69-corridor_repair-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_1-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Catapult Intro" map=sp_a2_catapult_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Cube Push" entity targetname=hallway_sim_go inputname=Trigger
			sar_speedrun_cc_rule "Catapult Trigger" entity targetname=catapult_target_relay inputname=Trigger
			sar_speedrun_cc_rule "Second Catapult Trigger" entity targetname=launch_sound2b inputname=PlaySound
			sar_speedrun_cc_rule "Wall Portal" zone center=-32.28,-1382.97,-159.77 size=448.43,113.99,320.45 angle=0
			sar_speedrun_cc_rule "Door Passthrough" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger
			sar_speedrun_cc_rule "Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Trust Fling" map=sp_a2_trust_fling action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Panels Trigger" entity targetname=wall_panel_1-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Catapult Trigger" entity targetname=flingroom_1_circular_catapult_1_wav_1 inputname=PlaySound
			sar_speedrun_cc_rule "Button Press" entity targetname=first_press_relay inputname=Trigger
			sar_speedrun_cc_rule "Portal Passthrough" zone center=-107.03,-832.06,383.4 size=41.87,255.82,254.02 angle=0
			sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Pit Flings" map=sp_a2_pit_flings action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Room Entry" entity targetname=player_in_pit_branch inputname=SetValue
			sar_speedrun_cc_rule "Platform Entry" entity targetname=exit_ledge_player_clip inputname=Kill
			sar_speedrun_cc_rule "End Door" entity targetname=SAVE_CUBE inputname=FireEvent
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Fizzler Intro" map=sp_a2_fizzler_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Panels Trigger" entity targetname=light_shadowed_01 inputname=TurnOn
			sar_speedrun_cc_rule "Laser Receiver" entity targetname=@exit_door-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Ceiling Catapult" map=sp_a2_sphere_peek action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Laser Receiver" entity targetname=@exit_door-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Ricochet" map=sp_a2_ricochet action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=entry_music inputname=PlaySound
			sar_speedrun_cc_rule "Cube Area" entity targetname=juggled_cube_music inputname=PlaySound
			sar_speedrun_cc_rule "Catapult Trigger" entity targetname=floor_catapult_1_sound inputname=PlaySound
			sar_speedrun_cc_rule "Ending Area" zone center=3357.7,1088.05,-63.97 size=123.03,383.85,895.99 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Intro" map=sp_a2_bridge_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_52-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Button Press" entity targetname=box_dropper_01-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Cube Portal Passthrough" entity targetname=autosave inputname=SaveDangerous
			sar_speedrun_cc_rule "Player Portal Passthrough" zone center=756.05,63.97,-385.04 size=23.84,127.87,253.99 angle=0
			sar_speedrun_cc_rule "End Wall" zone center=192.03,560.02,128.3 size=127.88,31.91,254.69 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge The Gap" map=sp_a2_bridge_the_gap action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Intro" map=sp_a2_turret_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Door Passthrough" entity targetname=aud_VFX.LightFlicker inputname=PlaySound
			sar_speedrun_cc_rule "First Portal" zone center=587.4,-1697.66,-75.02 size=22.61,130.61,105.89 angle=0
			sar_speedrun_cc_rule "Second Portal" zone center=640.03,-1262.09,-64.1 size=128.01,28.11,127.27 angle=0
			sar_speedrun_cc_rule "Floor Portal" zone center=1071.63,-1311.99,-116.33 size=160.02,127.95,23.27 angle=0
			sar_speedrun_cc_rule "Cube Room Entry" zone center=332.35,-896.12,128.29 size=24.63,191.52,255.35 angle=0
			sar_speedrun_cc_rule "Cube Room Wall" zone center=927.96,-972.34,127.68 size=447.37,39.25,255.3 angle=0
			sar_speedrun_cc_rule "Ending Room" zone center=1131.03,-192.36,127.65 size=41.88,382.56,255.23 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Relays" map=sp_a2_laser_relays action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Floor Panels Trigger" entity targetname=animset01_start_rl inputname=Trigger
			sar_speedrun_cc_rule "Laser Switch Glitch" entity targetname=relay3_powered_branch inputname=SetValue
			sar_speedrun_cc_rule "Door Entry" zone center=-320.25,-1071.59,63.66 size=127.88,32.77,127.25 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Blocker" map=sp_a2_turret_blocker action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=info_sign-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay9
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Vs Turret" map=sp_a2_laser_vs_turret action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "OOB" zone center=153.49,-234.07,540.65 size=178.91,159.9,87.15 angle=0
			sar_speedrun_cc_rule "Lower Landing" zone center=336.95,-264.22,287.42 size=61.89,111.5,122.08 angle=0
			sar_speedrun_cc_rule "Re-Entry" zone center=360.34,-359.72,135.35 size=303.26,81.36,46.63 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Pull The Rug" map=sp_a2_pull_the_rug action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Room Entry" entity targetname=change_to_error_state_02 inputname=Trigger
			sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Lift Peak" entity targetname=@elevator_turret_waterfall_rl inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Column Blocker" map=sp_a2_column_blocker action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Cutscene Trigger" entity targetname=blackout_lights_off_fade inputname=Fade
			sar_speedrun_cc_rule "Observation Room" zone center=-848.5,-33.1,352.35 size=126.94,61.49,190.99 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Chaining" map=sp_a2_laser_chaining action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Entry" entity targetname=music.sp_a2_laser_chaining_b1 inputname=PlaySound
			sar_speedrun_cc_rule "Wall Portal" zone center=-367.28,-637.15,640.2 size=33.38,377.5,255.54 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=relay_02_indicator inputname=Check
			sar_speedrun_cc_rule "Catapult" zone center=548.04,63.63,-11.47 size=151.87,142.84,104.99 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Triple Laser" map=sp_a2_triple_laser action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Portal Entry" zone center=7197.16,-5336.25,137.26 size=58.26,123.87,237.42 angle=0
			sar_speedrun_cc_rule "Switch Glitch" entity targetname=@exit_door-testchamber_door inputname=Open
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Jailbreak" map=sp_a2_bts1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "First Portal Entry" zone center=-9743.78,-479.05,449.45 size=96.38,126.04,129.56 angle=0
			sar_speedrun_cc_rule "Railing" zone center=-2825,-1679.5,45 size=62,297,110 angle=0
			sar_speedrun_cc_rule "Stairboost" zone center=-465.07,-635.72,72 size=118.08,161.22,239.94 angle=0
			sar_speedrun_cc_rule "Last Corner" zone center=818,-989,-11 size=68,132,106 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Escape" map=sp_a2_bts2 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Turret Trigger" entity targetname=player_clip inputname=Enable
			sar_speedrun_cc_rule "Portal Passthrough" entity targetname=first_turret_arena_music_stop inputname=Trigger
			sar_speedrun_cc_rule "Stairs" entity targetname=destruction_flashlight_o1 inputname=TurnOn
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Factory" map=sp_a2_bts3 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Landing" entity targetname=lookat_entryhall_target_rl inputname=Trigger
			sar_speedrun_cc_rule "Brown Conveyor" zone center=6913.03,884.54,185.12 size=253.88,150.73,77.71 angle=0
			sar_speedrun_cc_rule "Railing" entity targetname=lookat_drop_to_panel_ride_rl inputname=Trigger
			sar_speedrun_cc_rule "Tube Room Drop" entity targetname=laser_cutter_room_kill_relay inputname=Trigger
			sar_speedrun_cc_rule "Portal Room" entity targetname=@music_sp_a2_bts3_b3 inputname=StopSound
			sar_speedrun_cc_rule "Panels" entity targetname=spirarooml_areaportal inputname=SetFadeEndDistance
			sar_speedrun_cc_rule "End Room" entity targetname=@music_sp_a2_bts3_b5 inputname=PlaySound
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Sabotage" map=sp_a2_bts4 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Second Conveyor" entity targetname=light_01 inputname=TurnOn
			sar_speedrun_cc_rule "Second Room" entity targetname=proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Hallway" entity targetname=dim_wheatley_flashlight inputname=Enable
			sar_speedrun_cc_rule "Classroom" entity targetname=lookat_fair_doorway_relay inputname=Trigger
			sar_speedrun_cc_rule "Rubble Room" entity targetname=@music_sp_a2_bts4_b3 inputname=StopSound
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Neurotoxin Sabotage" map=sp_a2_bts5 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=airlock_door_01-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Airlock Room" entity targetname=airlock_door_01-proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Lift" entity targetname=lift_blocker inputname=Enable
			sar_speedrun_cc_rule "Button Press" entity targetname=button_relay inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Tube Ride" map=sp_a2_bts6 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Core" map=sp_a2_core action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "First Room" entity targetname=music_sp_a2_core_b1 inputname=PlaySound
			sar_speedrun_cc_rule "Door Trap" entity targetname=rv_trap_fake_door_handle inputname=open
			sar_speedrun_cc_rule "Vault" entity targetname=rv_player_clip inputname=Kill
			sar_speedrun_cc_rule "Button Press" entity targetname=button_press_relay inputname=Trigger
			sar_speedrun_cc_rule "Cutscene Activation" entity targetname=begin_core_swap_relay inputname=Trigger
			sar_speedrun_cc_rule "Lift Cutscene Trigger" entity targetname=elevator_exit_door_close_relay inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Long Fall" map=sp_a3_00 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Underground" map=sp_a3_01 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Second Portal Passthrough" entity targetname=ambient_sp_a3_01_b3 inputname=PlaySound
			sar_speedrun_cc_rule "Catwalk" entity targetname=helper_01 inputname=Disable
			sar_speedrun_cc_rule "Ravine" entity targetname=ambient_sp_a3_01_b5 inputname=PlaySound
			sar_speedrun_cc_rule "Long Shot Portal" portal center=4880,4270,-544 size=130,135,7 angle=0
			sar_speedrun_cc_rule "Portal Entry" zone center=4879.93,4269.74,-509.76 size=127.23,132.32,68.42 angle=0
			sar_speedrun_cc_rule "First Button Press" entity targetname=timer2b-TimerStart inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Second Button Press" entity targetname=timer1b-TimerStart inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Cave Johnson" map=sp_a3_03 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Catwalk Portal Entry" zone center=-6107.5,279.05,-4800.82 size=72.95,300.99,382.31 angle=0
			sar_speedrun_cc_rule "Portal Stand" zone center=-4976.03,1113.87,-2644.6 size=103.94,37.67,138.07 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Repulsion Intro" map=sp_a3_jump_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Lights Trigger" entity targetname=@dark_column_flicker_start inputname=Trigger
			sar_speedrun_cc_rule "First Room" entity targetname=ambient_sp_a3_jump_intro_b1 inputname=PlaySound
			sar_speedrun_cc_rule "Dropper Activation" entity targetname=room_1_cube_dropper-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Second Floor" zone center=-1172.3,1152,1311.71 size=168.45,255.94,254.77 angle=0
			sar_speedrun_cc_rule "Last Portal Passthrough" zone center=-1631.89,797.21,1634.26 size=162.59,58.36,157.63 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bomb Flings" map=sp_a3_bomb_flings action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Railing" zone center=-256.1,335.97,-1281.08 size=255.42,351.87,253.79 angle=0
			sar_speedrun_cc_rule "Gel Drop" entity targetname=trigger_to_drop inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Crazy Box" map=sp_a3_crazy_box action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "First Room" entity targetname=ambient_sp_a3_crazy_box_b1 inputname=PlaySound
			sar_speedrun_cc_rule "Seamshot" portal center=896,-1024,2048 size=194,322,7 angle=0
			sar_speedrun_cc_rule "Cube Grab" entity targetname=achievement_crazy_box_entity inputname=FireEvent
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "PotatOS" map=sp_a3_transition01 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door" entity targetname=pumproom_door_bottom_button inputname=Lock
			sar_speedrun_cc_rule "Lever" entity targetname=pump_machine_relay inputname=trigger
			sar_speedrun_cc_rule "Second Door" entity targetname=pumproom_door_top_button inputname=Lock
			sar_speedrun_cc_rule "Lone Panel" entity targetname=music_sp_a3_transition01_b4 inputname=PlaySound
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Propulsion Intro" map=sp_a3_speed_ramp action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Long Shot" portal center=-68,-640,896 size=7,130,130 angle=0
			sar_speedrun_cc_rule "Ending Portal Entry" zone center=-38.72,-639.96,896.17 size=58.49,127.75,127.29 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Propulsion Flings" map=sp_a3_speed_flings action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Blue Gel Bounce" zone center=2815.6,-109.17,-303.28 size=192.37,153.96,97.37 angle=0
			sar_speedrun_cc_rule "Ramp" zone center=3358.64,1153,127.56 size=61.32,253.94,378.9 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Conversion Intro" map=sp_a3_portal_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "First Room" entity targetname=1970s_door1door_lower inputname=Close
			sar_speedrun_cc_rule "Balcony" entity targetname=1970s_door2_door_lower inputname=Close
			sar_speedrun_cc_rule "Door Trigger" entity targetname=highdoor_door_upper inputname=Open
			sar_speedrun_cc_rule "Second Door Open" entity targetname=liftshaft_entrance_door-door_open inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Three Gels" map=sp_a3_end action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Fling" zone center=-1105.75,256.12,-3879.9 size=99.12,191.69,127.73 angle=0
			sar_speedrun_cc_rule "Ending Fling" entity targetname=helper01 inputname=Disable
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Test" map=sp_a4_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Start Dialogue" zone center=-992,-480,320 size=128,128,192 angle=0
			sar_speedrun_cc_rule "Cube Throw" entity targetname=@exit_door1-player_in_door_trigger inputname=Enable
			sar_speedrun_cc_rule "Enter Elevator" entity targetname=test_chamber1_slow_relay inputname=Trigger
			sar_speedrun_cc_rule "First Solve" entity targetname=@exit_door2-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Trigger Elevator" entity targetname=departure_elevator-logic_source_elevator_door_open inputname=Trigger
			sar_speedrun_cc_rule "Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Funnel Intro" map=sp_a4_tb_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "First Room" entity targetname=arrival_elevator-signs_off inputname=Trigger
			sar_speedrun_cc_rule "Zone" zone center=2015.92,733.66,-258.67 size=64.1,580.63,506.26 angle=0
			sar_speedrun_cc_rule "Reportal" zone center=1312.19,384.22,415.43 size=64.33,256.38,253.77 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=button_1_pressed inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Ceiling Button" map=sp_a4_tb_trust_drop action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Drop" entity targetname=music3 inputname=PlaySound
			sar_speedrun_cc_rule "Crouch Fly" fly
			sar_speedrun_cc_rule "Button Press" entity targetname=dropper-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Door Activation" entity targetname=button_1-proxy inputname=OnProxyRelay5
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Wall Button" map=sp_a4_tb_wall_button action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Chamber Movement" entity targetname=relay_pre_chamber_move inputname=Trigger
			sar_speedrun_cc_rule "Button Press" entity targetname=func_brush_indicators_orange inputname=Enable
			sar_speedrun_cc_rule "End Area" entity targetname=trigger_solve_warning inputname=Enable
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Polarity" map=sp_a4_tb_polarity action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Panels Trigger" entity targetname=falling_tile_1_relay inputname=Trigger
			sar_speedrun_cc_rule "Crouch Fly" fly
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Funnel Catch (SP)" map=sp_a4_tb_catch action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Entry" entity targetname=light_shadowed_01 inputname=TurnOn
			sar_speedrun_cc_rule "Button Press" entity targetname=indicator_lights_flicker_rl inputname=Trigger
			sar_speedrun_cc_rule "Door Activation" entity targetname=puzzle_completed_relay inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Stop The Box" map=sp_a4_stop_the_box action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Door Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Catapult" map=sp_a4_laser_catapult action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Test Start" entity targetname=diag_laser_catapult_test_start inputname=Trigger
			sar_speedrun_cc_rule "Floor Portal Passthrough" zone center=-255.88,-319.92,40.65 size=127.91,127.98,65.24 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Platform" map=sp_a4_laser_platform action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Button Press" entity targetname=box_drop_relay inputname=Trigger
			sar_speedrun_cc_rule "Door Activation" entity targetname=exit_check inputname=Check
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Propulsion Catch" map=sp_a4_speed_tb_catch action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Chamber Trigger" zone center=-608.05,1675.93,-127.98 size=287.79,104.09,127.98 angle=0
			sar_speedrun_cc_rule "Ramp" zone center=-977.54,1322.84,153.57 size=48.93,362.86,193.93 angle=0
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Repulsion Polarity" map=sp_a4_jump_polarity action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Pipe Trigger" entity targetname=diag_jump_polarity_sorry inputname=Trigger
			sar_speedrun_cc_rule "Crouch Fly" fly
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Finale 1" map=sp_a4_finale1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Catapult Trigger" entity targetname=launch_sound1 inputname=PlaySound
			sar_speedrun_cc_rule "Second Catapult Trigger" entity targetname=music03 inputname=PlaySound
			sar_speedrun_cc_rule "Door Trigger" entity targetname=liftshaft_airlock_exit-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Second Portal Passthrough" entity targetname=music06 inputname=PlaySound
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Finale 2" map=sp_a4_finale2 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Chamber Trigger" entity targetname=shake_chamber_move inputname=StartShake
			sar_speedrun_cc_rule "Door Trigger" entity targetname=walkway_push inputname=Disable
			sar_speedrun_cc_rule "Second Door Trigger" entity targetname=bts_door_2-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Last Room" entity targetname=light_shadowed_05 inputname=TurnOn
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Finale 3" map=sp_a4_finale3 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=airlock_door2_brush inputname=Disable
			sar_speedrun_cc_rule "Gel Portal Entry" entity targetname=light_shadowed_02 inputname=TurnOn
			sar_speedrun_cc_rule "Funnel" entity targetname=column_smash_a inputname=SetAnimation
			sar_speedrun_cc_rule "End Door Trigger" entity targetname=door_lair-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Finale 4" map=sp_a4_finale4 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Elevator" entity targetname=breaker_socket_button inputname=Kill
			sar_speedrun_cc_rule "Space Core" entity targetname=socket1_sprite_kill_relay inputname=Trigger
			sar_speedrun_cc_rule "Rick" entity targetname=socket2_sprite_kill_relay inputname=Trigger
			sar_speedrun_cc_rule "Fact Core" entity targetname=socket3_sprite_kill_relay inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Calibration" map=mp_coop_start action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Hub" map=mp_coop_lobby_3 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Doors" map=mp_coop_doors action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal" portal center=-10272,-544,64 size=130,3,130 angle=0
			sar_speedrun_cc_rule "Portal Entry" zone center=-10272.05,-574.78,64.15 size=127.9,61.5,127.99 angle=0
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Buttons" map=mp_coop_race_2 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=entry_airlock-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=entry_airlock-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Dot Button" entity targetname=timer_1 inputname=Start
			sar_speedrun_cc_rule "Moon Button" entity targetname=timer_2 inputname=Start
			sar_speedrun_cc_rule "Triangle Button" entity targetname=timer_3 inputname=Start
			sar_speedrun_cc_rule "X Button" entity targetname=timer_4 inputname=Start
			sar_speedrun_cc_rule "Door Activation" entity targetname=button_ball-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Lasers" map=mp_coop_laser_2 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Stairs" entity targetname=ramp_up_relay1 inputname=Trigger
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Rat Maze" map=mp_coop_rat_maze action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Maze" entity targetname=blue_player_points_rl inputname=Enable
			sar_speedrun_cc_rule "End Portal" zone center=-254.71,-223.75,-416.04 size=66.51,127.81,127.51 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=@exit_door inputname=Open
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Crusher" map=mp_coop_laser_crusher action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "End Hop" zone center=2630.95,-1135.87,80.33 size=77.85,287.33,161.4 angle=0
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Behind The Scenes" map=mp_coop_teambts action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Lever 1" entity targetname=lever_1-proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Lever 2" entity targetname=lever_2-proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Flings" map=mp_coop_fling_3 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Blue Start" zone center=223.69,911.99,288 size=64.44,415.94,319.94 angle=0 player=0
			sar_speedrun_cc_rule "Orange Start" zone center=223.69,911.99,288 size=64.44,415.94,319.94 angle=0 player=1
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_2-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_2-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Wall Portal Exit" zone center=297.39,-384.02,704 size=41.16,127.86,127.93 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=button_ball-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Infinifling" map=mp_coop_infinifling_train action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Button" entity targetname=panel_fling_wall_timer inputname=Start
			sar_speedrun_cc_rule "End Area" entity targetname=manager_opendoor inputname=SetStateBTrue
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Team Retrieval" map=mp_coop_come_along action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Panels" entity targetname=button1-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Sphere Button" entity targetname=trigger_slimeroom_drop_ball-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Floor Portal" zone center=1023.93,1696.03,-352 size=127.74,127.57,155.94 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=button2-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Vertical Flings" map=mp_coop_fling_1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal Entry" zone center=607.94,63.93,-123.93 size=127.81,127.8,68.05 angle=0
			sar_speedrun_cc_rule "Button 1" entity targetname=race_button_1_checkmark inputname=Start
			sar_speedrun_cc_rule "Button 2" entity targetname=race_button_2_checkmark inputname=Start
			sar_speedrun_cc_rule "Door Activation" entity targetname=ball_button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Catapults" map=mp_coop_catapult_1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Catapult" entity targetname=catapult_3-proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Re-Entry" zone center=830.52,288.26,511.57 size=252.98,190.4,127.08 angle=0
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Multifling" map=mp_coop_multifling_1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Mid Room Door" entity targetname=button2-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Cube Button" entity targetname=dropper2-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Catapult" entity targetname=cat4-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Door Activation" entity targetname=button3-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Fling Crushers" map=mp_coop_fling_crushers action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Activation" entity targetname=transition_exit_doorway_1 inputname=Open
			sar_speedrun_cc_rule "Catapult" entity targetname=faithplate_crushers-proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Wall Button" entity targetname=relay_crusher_timer_close_solve inputname=Trigger
			sar_speedrun_cc_rule "Door Button" entity targetname=transition_exit_doorway_2 inputname=Open
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Industrial Fan" map=mp_coop_fan action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Fan Deactivation" entity targetname=@relay_loop_sound_stop inputname=Trigger
			sar_speedrun_cc_rule "Door Activation" entity targetname=door-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Final Room Blue" zone center=-640.33,1087.46,233.03 size=8,60.08,114 angle=0 player=0
			sar_speedrun_cc_rule "Final Room Orange" zone center=-640.33,1087.46,233.03 size=8,60.08,114 angle=0 player=1
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Cooperative Bridges" map=mp_coop_wall_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Starting Wall" zone center=-95.84,-2366.62,-255.72 size=191.61,130.69,254.67 angle=0
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Catapult" entity targetname=faith_plate-proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Door Activation" entity targetname=button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Swap" map=mp_coop_wall_2 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Fling Block" map=mp_coop_catapult_wall_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Sphere Button" entity targetname=@cube_dropper inputname=Trigger
			sar_speedrun_cc_rule "Middle Door" entity targetname=button-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Catapult Block" map=mp_coop_wall_block action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Fling" map=mp_coop_catapult_2 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Walls" map=mp_coop_turret_walls action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=last_airlock-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=last_airlock-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Sphere Button" entity targetname=trigger_slimeroom_drop_ball-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Door Activation" entity targetname=button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Assassin" map=mp_coop_turret_ball action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Catapult Orange" entity targetname=faith_plate_player-relay_up inputname=Trigger
			sar_speedrun_cc_rule "Catapult Blue" entity targetname=faith_plate_player-proxy inputname=OnProxyRelay3 "ccafter=Catapult Orange"
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Portal Entry Blue" zone center=68.67,1440.08,645.06 size=54.6,191.79,185.48 angle=0 player=0
			sar_speedrun_cc_rule "Portal Entry Orange" zone center=68.67,1440.08,645.06 size=54.6,191.79,185.48 angle=0 player=1
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Testing" map=mp_coop_wall_5 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "First Room" entity targetname=Ptemplate_ball_training inputname=ForceSpawn
			sar_speedrun_cc_rule "Door Activation" entity targetname=power1-ptemplate_ball_door_1 inputname=ForceSpawn
			sar_speedrun_cc_rule "Door Activation 2" entity targetname=power2-ptemplate_ball_door_1 inputname=ForceSpawn
			sar_speedrun_cc_rule "Door Activation 3" entity targetname=camera_door_4-security_3_door_left inputname=Open
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Cooperative Funnels" map=mp_coop_tbeam_redirect action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Wall Button" entity targetname=button_platform inputname=pressin
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Funnel Drill" map=mp_coop_tbeam_drill action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Catapult" entity targetname=catapult-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Sphere Button" entity targetname=proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Ball Block" entity targetname=exit_enable inputname=Trigger
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Funnel Catch (MP)" map=mp_coop_tbeam_catch_grind_1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal" portal center=-384,-1151,250 size=130,130,27 angle=0
			sar_speedrun_cc_rule "Wall Portal Exit" zone center=-472.97,-1759.98,-192.2 size=10,127.23,127.38 angle=0
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Funnel Laser" map=mp_coop_tbeam_laser_1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Catapult" entity targetname=faithplate-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Cooperative Polarity" map=mp_coop_tbeam_polarity action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Funnel Hop" map=mp_coop_tbeam_polarity2 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Crouch Fly Blue" fly player=0
			sar_speedrun_cc_rule "Crouch Fly Orange" fly player=1
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Advanced Polarity" map=mp_coop_tbeam_polarity3 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Panel Trigger" entity targetname=platform_exit-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Funnel Maze" map=mp_coop_tbeam_maze action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Crouch Fly" fly
			sar_speedrun_cc_rule "Cube Grab" entity targetname=cube_dropper_box inputname=Use
			sar_speedrun_cc_rule "Button Activation" entity targetname=button_2-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Warehouse" map=mp_coop_tbeam_end action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Conveyor Hop" zone center=440.75,-105.61,105.85 size=142.44,434.3,203.13 angle=0
			sar_speedrun_cc_rule "Wall Portal Exit" zone center=1760.36,188.87,160 size=319.23,134.2,127.33 angle=0
			sar_speedrun_cc_rule "Blue Funnel Exit" entity targetname=relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Orange Funnel Exit" entity targetname=relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Repulsion Jumps" map=mp_coop_paint_come_along action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Double Bounce" map=mp_coop_paint_redirect action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Gel Drop" entity targetname=paint_sprayer inputname=Start
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Repulsion" map=mp_coop_paint_bridge action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Long Shot" portal center=-635,-192,575 size=12,130,130 angle=0
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Wall Repulsion" map=mp_coop_paint_walljumps action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Propulsion Crushers" map=mp_coop_paint_speed_fling action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Button Activation" entity targetname=paint_sprayer1_start inputname=Trigger
			sar_speedrun_cc_rule "Portal" portal center=-897,127,-322 size=12,130,130 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=ball_button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Ninja" map=mp_coop_paint_red_racer action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Cube Drop" entity targetname=cube_dropper inputname=Trigger
			sar_speedrun_cc_rule "Floor Platform" zone center=-1552.37,515.37,-467.6 size=125.8,134.19,88.74 angle=0
			sar_speedrun_cc_rule "Gravity Trigger" zone center=-1308,512,346 size=616,128,28 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=team_trigger_door inputname=Enable
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Propulsion Retrieval" map=mp_coop_paint_speed_catch action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Gel Drop" entity targetname=paint_sprayer2_start inputname=Trigger
			sar_speedrun_cc_rule "Slanted Portal Exit" zone center=704,566.96,347.91 size=126.93,63.65,110.27 angle=0
			sar_speedrun_cc_rule "Panels" entity targetname=platform_button inputname=Press
			sar_speedrun_cc_rule "Cube Drop" entity targetname=box_buttons inputname=Press
			sar_speedrun_cc_rule "Door Activation" entity targetname=sphere_button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Vault Entrance" map=mp_coop_paint_longjump_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Second Room" zone center=304,-4547.79,961.06 size=287.95,120.36,125.74 angle=0
			sar_speedrun_cc_rule "Gel Drop" entity targetname=relay_paint_start_2 inputname=Trigger
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Separation" map=mp_coop_separation_1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Cube Drop" entity targetname=reflecto_cube_dropper-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Door Activation" entity targetname=camera_triggers inputname=Enable
			sar_speedrun_cc_rule "Sphere Drop" entity targetname=dispenser_2-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Button Activation" entity targetname=orange_door_2-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Wall" zone center=2816.02,-3135.98,64.44 size=383.9,127.98,128.66 angle=0
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Triple Axis" map=mp_coop_tripleaxis action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Crusher" entity targetname=crusher_sequence_start_rl inputname=Trigger
			sar_speedrun_cc_rule "Crouch Fly Blue" fly player=0
			sar_speedrun_cc_rule "Crouch Fly Orange" fly player=1
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Catapult Catch" map=mp_coop_catapult_catch action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Cube Area" zone center=1103.59,-639.85,-192.12 size=96.77,255.5,127.69 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=exit_door-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Gels" map=mp_coop_2paints_1bridge action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=entry_airlock-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=entry_airlock-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Button Stick" entity targetname=team_trigger_door inputname=Enable
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=chamber_exit_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=chamber_exit_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Maintenance" map=mp_coop_paint_conversion action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal Room" zone center=-1378.28,3262.04,182.64 size=187.19,316.02,124.72 angle=0
			sar_speedrun_cc_rule "Elevator" zone center=-1873.3,4928.08,-1312.67 size=1054.17,127.79,318.6 angle=0
			sar_speedrun_cc_rule "Fall" entity targetname=disassembler_start_relay inputname=Trigger
			sar_speedrun_cc_rule "End Area" entity targetname=paint_sprayer_white inputname=Start
			sar_speedrun_cc_rule "Stairs" entity targetname=ramp_up_relay inputname=Trigger
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Catch" map=mp_coop_bridge_catch action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Button" zone center=146.89,1343.92,14.03 size=37.33,127.5,12 angle=0
			sar_speedrun_cc_rule "Laser Catapult" entity targetname=catapult_1_wav inputname=PlaySound
			sar_speedrun_cc_rule "Catapult" entity targetname=catapult_1_wav2 inputname=PlaySound
			sar_speedrun_cc_rule "Bridge Activation" entity targetname=laser_socketed inputname=SetValue
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Double Lift" map=mp_coop_laser_tbeam action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Crouch Fly Blue" fly player=0
			sar_speedrun_cc_rule "Crouch Fly Orange" fly player=1
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Gel Maze" map=mp_coop_paint_rat_maze action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal Entry" zone center=-573.35,-0.1,703.71 size=69.24,255.73,127.07 angle=0
			sar_speedrun_cc_rule "Cube Button" entity targetname=cube_dropper_01-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Slanted Portal" zone center=575.95,95.71,577.8 size=127.83,56.84,114.41 angle=0
			sar_speedrun_cc_rule "Door Activation" entity targetname=@exit_door inputname=Open
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Crazier Box" map=mp_coop_paint_crazy_box action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Panels Trigger" entity targetname=exit_button_clips inputname=Disable
			sar_speedrun_cc_rule "Cube Receptacle" entity targetname=team_trigger_door inputname=Enable
			sar_speedrun_cc_rule "Door Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Door Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Blind Shot" entity targetname=bts_wall_undamaged inputname=Disable
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish`.replaceAll('\t', '').split('sar_speedrun_cc_start ').map(e => e.split('\n').filter(e => e)).filter(e => e.length);
		for (let i = 0; i < data.maps.length; i++) {
			let str = mt.filter(e => e[0].startsWith('"' + data.maps[i].splitname + '"'));
			if (str[0]) data.maps[i].triggers = str[0].filter(e => e.startsWith('sar_speedrun_cc_rule ')).map(e => e.slice(21));
		}
	} else data.getMtriggers();
	
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
	console.log('a')
	compile();
}
