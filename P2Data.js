// Requires prototypes.js, FileSaver.js and jszip.js referenced before usage

class P2Data {
	constructor() {
		let genericTriggers = coop => ['"Start" load action=force_start'].concat(coop ? ['"Flags 1" flags', '"Flags 2" flags "ccafter=Flags 1" action=stop'] : ['"Flags" flags action=stop']);
		let P2Map = e => ({
			filename: e[0],
			splitname: e[1],
			wikiname:
				e[1] == 'Funnel Catch (SP)'
					? 'Funnel Catch (singleplayer)'
					: e[1] == 'Funnel Catch (MP)'
						? 'Funnel Catch'
						: e[1] == 'Jailbreak'
							? 'Jail Break'
							: e[1],
			chapter: isNaN(parseInt(e[2])) ? -1 : parseInt(e[2]),
			coop: e[3],
			triggers: genericTriggers(e[3]),
			chamberID: e[4],
			cmboard: [],
			fade: e[5],
			wikicontent: '',
			cmNative: false
		});
		this.maps = [
			P2Map(['sp_a1_intro1'                , 'Container Ride',       1, false, 62761, `In a dire e[mer]gency`]),
			P2Map(['sp_a1_intro2'                , 'Portal Carousel',      1, false, 62758, `Aperture Science Reintegration [Associate]`]),
			P2Map(['sp_a1_intro3'                , 'Portal Gun',           1, false, 47458, `Asked that [first]. I'm just gonna [wait] for you up ahead`]),
			P2Map(['sp_a1_intro4'                , 'Smooth Jazz',          1, false, 47455, ``]),
			P2Map(['sp_a1_intro5'                , 'Cube Momentum',        1, false, 47452, `Personality [constructs] will remain`]),
			P2Map(['sp_a1_intro6'                , 'Future Starter',       1, false, 47106, `Please [return] to your primitive tribe`]),
			P2Map(['sp_a1_intro7'                , 'Secret Panel',         1, false, 62763, ``]),
			P2Map(['sp_a1_wakeup'                , 'Wakeup',               1, false, 62759, ``]),
			P2Map(['sp_a2_intro'                 , 'Incinerator',          1, false, 47735, `Testing for the [rest] of your life`]),
			P2Map(['sp_a2_laser_intro'           , 'Laser Intro',          2, false, 62765, ``]),
			P2Map(['sp_a2_laser_stairs'          , 'Laser Stairs',         2, false, 47736, `That's what it says: a [horrible] person`]),
			P2Map(['sp_a2_dual_lasers'           , 'Dual Lasers',          2, false, 47738, `Emerge from suspension terribly [undernourished]`]),
			P2Map(['sp_a2_laser_over_goo'        , 'Laser Over Goo',       2, false, 47742, ``]),
			P2Map(['sp_a2_catapult_intro'        , 'Catapult Intro',       2, false, 62767, `Room full of air [for] the rest`]),
			P2Map(['sp_a2_trust_fling'           , 'Trust Fling',          2, false, 47744, ``]),
			P2Map(['sp_a2_pit_flings'            , 'Pit Flings',           2, false, 47465, ``]),
			P2Map(['sp_a2_fizzler_intro'         , 'Fizzler Intro',        2, false, 47746, ``]),
			P2Map(['sp_a2_sphere_peek'           , 'Ceiling Catapult',     3, false, 47748, ``]),
			P2Map(['sp_a2_ricochet'              , 'Ricochet',             3, false, 47751, `I [did] see some humans`]),
			P2Map(['sp_a2_bridge_intro'          , 'Bridge Intro',         3, false, 47752, `Did you guess 'sharks'? Because [that's] wrong`]),
			P2Map(['sp_a2_bridge_the_gap'        , 'Bridge The Gap',       3, false, 47755, `There's lots of room [here]`]),
			P2Map(['sp_a2_turret_intro'          , 'Turret Intro',         3, false, 47756, ``]),
			P2Map(['sp_a2_laser_relays'          , 'Laser Relays',         3, false, 47759, `Technically, it's a [medical] experiment`]),
			P2Map(['sp_a2_turret_blocker'        , 'Turret Blocker',       3, false, 47760, `A man [and] a woman`]),
			P2Map(['sp_a2_laser_vs_turret'       , 'Laser Vs Turret',      3, false, 47763, `[2nd high note]`]),
			P2Map(['sp_a2_pull_the_rug'          , 'Pull The Rug',         3, false, 47764, `After all [these] years`]),
			P2Map(['sp_a2_column_blocker'        , 'Column Blocker',       4, false, 47766, ``]),
			P2Map(['sp_a2_laser_chaining'        , 'Laser Chaining',       4, false, 47768, ``]),
			P2Map(['sp_a2_triple_laser'          , 'Triple Laser',         4, false, 47770, `Look at things objectively, [see] what you`]),
			P2Map(['sp_a2_bts1'                  , 'Jailbreak',            4, false, 47773, ``]),
			P2Map(['sp_a2_bts2'                  , 'Escape',               4, false, 47774, ``]),
			P2Map(['sp_a2_bts3'                  , 'Turret Factory',       5, false, 47776, ``]),
			P2Map(['sp_a2_bts4'                  , 'Turret Sabotage',      5, false, 47779, ``]),
			P2Map(['sp_a2_bts5'                  , 'Neurotoxin Sabotage',  5, false, 47780, ``]),
			P2Map(['sp_a2_bts6'                  , 'Tube Ride',            5, false, -1,    ``]),
			P2Map(['sp_a2_core'                  , 'Core',                 5, false, 62771, ``]),
			P2Map(['sp_a3_00'                    , 'Long Fall',            6, false, -1,    ``]),
			P2Map(['sp_a3_01'                    , 'Underground',          6, false, 47783, ``]),
			P2Map(['sp_a3_03'                    , 'Cave Johnson',         6, false, 47784, ``]),
			P2Map(['sp_a3_jump_intro'            , 'Repulsion Intro',      6, false, 47787, `Advice the lab boys gave me: [*] do not`]),
			P2Map(['sp_a3_bomb_flings'           , 'Bomb Flings',          6, false, 47468, `Chance the [calcium] could harden`]),
			P2Map(['sp_a3_crazy_box'             , 'Crazy Box',            6, false, 47469, `Special safety [door] that won't`]),
			P2Map(['sp_a3_transition01'          , 'PotatOS',              6, false, 47472, ``]),
			P2Map(['sp_a3_speed_ramp'            , 'Propulsion Intro',     7, false, 47791, `With your help, we're gonna change [the] world`]),
			P2Map(['sp_a3_speed_flings'          , 'Propulsion Flings',    7, false, 47793, `I mentioned earlier. [Again]: all you gotta do`]),
			P2Map(['sp_a3_portal_intro'          , 'Conversion Intro',     7, false, 47795, ``]),
			P2Map(['sp_a3_end'                   , 'Three Gels',           7, false, 47798, ``]),
			P2Map(['sp_a4_intro'                 , 'Test',                 8, false, 88350, `Paradox idea didn't work. [And] it almost`]),
			P2Map(['sp_a4_tb_intro'              , 'Funnel Intro',         8, false, 47800, `The good [news] is... well, none so far`]),
			P2Map(['sp_a4_tb_trust_drop'         , 'Ceiling Button',       8, false, 47802, `I knew we're in a lot [of] trouble`]),
			P2Map(['sp_a4_tb_wall_button'        , 'Wall Button',          8, false, 47804, `Oh no... [*] it's happening sonner than I expected`]),
			P2Map(['sp_a4_tb_polarity'           , 'Polarity',             8, false, 47806, ``]),
			P2Map(['sp_a4_tb_catch'              , 'Funnel Catch (SP)',    8, false, 47808, `Can get a little... [unbearable]`]),
			P2Map(['sp_a4_stop_the_box'          , 'Stop The Box',         8, false, 47811, `No. [No]. That was the solution`]),
			P2Map(['sp_a4_laser_catapult'        , 'Laser Catapult',       8, false, 47813, `Any of the [crucial] functions required`]),
			P2Map(['sp_a4_laser_platform'        , 'Laser Platform',       8, false, 47815, ``]),
			P2Map(['sp_a4_speed_tb_catch'        , 'Propulsion Catch',     8, false, 47817, `Gonna love it, to [*] death`]),
			P2Map(['sp_a4_jump_polarity'         , 'Repulsion Polarity',   8, false, 47819, `Got a surprise [for] us`]),
			P2Map(['sp_a4_finale1'               , 'Finale 1',             9, false, 62776, ``]),
			P2Map(['sp_a4_finale2'               , 'Finale 2',             9, false, 47821, ``]),
			P2Map(['sp_a4_finale3'               , 'Finale 3',             9, false, 47824, ``]),
			P2Map(['sp_a4_finale4'               , 'Finale 4',             9, false, 47456, ``]),
			P2Map(['mp_coop_start'               , 'Calibration',          0, true,  -1,    ``]),
			P2Map(['mp_coop_lobby_3'             , 'Hub',                  0, true,  -1,    ``]),
			P2Map(['mp_coop_doors'               , 'Doors',                1, true,  47741, ``]),
			P2Map(['mp_coop_race_2'              , 'Buttons',              1, true,  47825, ``]),
			P2Map(['mp_coop_laser_2'             , 'Lasers',               1, true,  47828, `One of you is doing very [v]ery well`]),
			P2Map(['mp_coop_rat_maze'            , 'Rat Maze',             1, true,  47829, `Reflected in your final [sc]ore`]),
			P2Map(['mp_coop_laser_crusher'       , 'Laser Crusher',        1, true,  45467, `Not just flattery, you are gre[a]t at science`]),
			P2Map(['mp_coop_teambts'             , 'Behind The Scenes',    1, true,  46362, ``]),
			P2Map(['mp_coop_fling_3'             , 'Flings',               2, true,  47831, `Fit an edgeless safet[y] cube`]),
			P2Map(['mp_coop_infinifling_train'   , 'Infinifling',          2, true,  47833, `Must be very, very prou[d]`]),
			P2Map(['mp_coop_come_along'          , 'Team Retrieval',       2, true,  47835, ``]),
			P2Map(['mp_coop_fling_1'             , 'Vertical Flings',      2, true,  47837, ``]),
			P2Map(['mp_coop_catapult_1'          , 'Catapults',            2, true,  47840, ``]),
			P2Map(['mp_coop_multifling_1'        , 'Multifling',           2, true,  47841, `Looming consequence of [d]eath`]),
			P2Map(['mp_coop_fling_crushers'      , 'Fling Crushers',       2, true,  47844, `Earned a break [from] the official`]),
			P2Map(['mp_coop_fan'                 , 'Industrial Fan',       2, true,  47845, ``]),
			P2Map(['mp_coop_wall_intro'          , 'Cooperative Bridges',  3, true,  47848, `Let me give you a cl[ue]`]),
			P2Map(['mp_coop_wall_2'              , 'Bridge Swap',          3, true,  47849, `Testing track hall of fame for tha[t]`]),
			P2Map(['mp_coop_catapult_wall_intro' , 'Fling Block',          3, true,  47854, `Completing this test, a reward for [t]esting`]),
			P2Map(['mp_coop_wall_block'          , 'Catapult Block',       3, true,  47856, `Described it as impossible, dead[ly], cruel`]),
			P2Map(['mp_coop_catapult_2'          , 'Bridge Fling',         3, true,  47858, `To not reassemble you. He refu[s]ed`]),
			P2Map(['mp_coop_turret_walls'        , 'Turret Walls',         3, true,  47861, `Reconfigured it from my original [p]lans`]),
			P2Map(['mp_coop_turret_ball'         , 'Turret Assassin',      3, true,  52642, `You would've never completed them. So [a]gain`]),
			P2Map(['mp_coop_wall_5'              , 'Bridge Testing',       3, true,  52660, ``]),
			P2Map(['mp_coop_tbeam_redirect'      , 'Cooperative Funnels',  4, true,  52662, `Three. Seven. Hundred [and] seven`]),
			P2Map(['mp_coop_tbeam_drill'         , 'Funnel Drill',         4, true,  52663, `There. [I've] said it`]),
			P2Map(['mp_coop_tbeam_catch_grind_1' , 'Funnel Catch (MP)',    4, true,  52665, `I'm not sur[e] I trust the two`]),
			P2Map(['mp_coop_tbeam_laser_1'       , 'Funnel Laser',         4, true,  52667, `Doing that just to aggra[v]ate me`]),
			P2Map(['mp_coop_tbeam_polarity'      , 'Cooperative Polarity', 4, true,  52671, `I trust y[ou]. You are my favorite`]),
			P2Map(['mp_coop_tbeam_polarity2'     , 'Funnel Hop',           4, true,  52687, `If [O]range had said those things about me`]),
			P2Map(['mp_coop_tbeam_polarity3'     , 'Advanced Polarity',    4, true,  52689, `So I can trust [you] one hundred percent`]),
			P2Map(['mp_coop_tbeam_maze'          , 'Funnel Maze',          4, true,  52691, `Can go any further, [*] I will need`]),
			P2Map(['mp_coop_tbeam_end'           , 'Turret Warehouse',     4, true,  52777, ``]),
			P2Map(['mp_coop_paint_come_along'    , 'Repulsion Jumps',      5, true,  52694, `The best cooperative tes[t]ing team`]),
			P2Map(['mp_coop_paint_redirect'      , 'Double Bounce',        5, true,  52711, `Number one request? [*] Less deadly tests`]),
			P2Map(['mp_coop_paint_bridge'        , 'Bridge Repulsion',     5, true,  52714, `You will need him for the f[i]nal track`]),
			P2Map(['mp_coop_paint_walljumps'     , 'Wall Repulsion',       5, true,  52715, `Ever write a historica[l] document`]),
			P2Map(['mp_coop_paint_speed_fling'   , 'Propulsion Crushers',  5, true,  52717, `If that doesn't moti[v]ate you`]),
			P2Map(['mp_coop_paint_red_racer'     , 'Turret Ninja',         5, true,  52735, `Are you [as] excited as I am?`]),
			P2Map(['mp_coop_paint_speed_catch'   , 'Propulsion Retrieval', 5, true,  52738, `Humans to monsters is about [*] a million`]),
			P2Map(['mp_coop_paint_longjump_intro', 'Vault Entrance',       5, true,  52740, ``]),
			P2Map(['mp_coop_separation_1'        , 'Separation',           6, true,  49341, `For as long as you [d]id`]),
			P2Map(['mp_coop_tripleaxis'          , 'Triple Axis',          6, true,  49343, `In the future, but we [d]on't`]),
			P2Map(['mp_coop_catapult_catch'      , 'Catapult Catch',       6, true,  49345, `I'm marking this art [a]ppreciated`]),
			P2Map(['mp_coop_2paints_1bridge'     , 'Bridge Gels',          6, true,  49347, ``]),
			P2Map(['mp_coop_paint_conversion'    , 'Maintenance',          6, true,  49349, ``]),
			P2Map(['mp_coop_bridge_catch'        , 'Bridge Catch',         6, true,  49351, `The scheming juices [f]lowing`]),
			P2Map(['mp_coop_laser_tbeam'         , 'Double Lift',          6, true,  52757, ``]),
			P2Map(['mp_coop_paint_rat_maze'      , 'Gel Maze',             6, true,  52759, `On the other side, [t]hanks`]),
			P2Map(['mp_coop_paint_crazy_box'     , 'Crazier Box',          6, true,  48287, ``])
		];
	}

	coordFunc(func) {
		this.maps = this.maps.map(e => {
			e.triggers = e.triggers.map(e => {
				let name = e.substr(0, e.indexOf('"', 1) + 1);
				let args = e.substr(e.indexOf('"', 1) + 2).split(' ').map((e, f, g) => {
					let property = e.split('=');
					if (property.length > 0 && ['center', 'size', 'angle'].indexOf(property[0]) > -1) {
						property[1] = property[1].split(',').map(e => func(parseFloat(e), g[0], property[0])).join(',');
					}
					return property.join('=');
				});
				return name + ' ' + args.join(' ');
			});
			return e;
		});
	}

	addTrailingZeroes() {
		this.coordFunc(e => e.toFixed(2).toString());
	}

	removeTrailingZeroes() {
		this.coordFunc(e => e.toString());
	}

	optimisePortalTriggers() {
		// portal triggers can be less precise than zones
		// so we snap center to nearest whole pos
		// and increase size to make up for any lost edges
		this.coordFunc((e, t, p) =>
			t == 'portal'
				? p == 'center'
					? Math.round(e)
					: p == 'size'
						? Math.ceil(e) + 2
						: e
				: e
		);
	}

	async getMtriggers() {
		// Get mtriggers from Github (p2sr/portal2-mtriggers)
		// This will be obsolete when 1.13 releases, remind me to update it
		return queryAPI(this.maps.map(e => 
			'https://raw.githubusercontent.com/p2sr/portal2-mtriggers/master/' +
			(e.coop ? 'Coop/Course' : 'SP/Chapter') +
			e.chapter + '/' +
			e.filename + '.cfg'
		)).then(e => {
			let count = e.length;
			for (let i = 0; i < count; i++) {
				let map = this.maps[i];
				map.triggers = e[i].split('\n').filter(e => 
					e.startsWith('sar_speedrun_cc_rule ')
				).map(e => e.replace('sar_speedrun_cc_rule ', ''));
				map.cmNative = map.triggers.length > 0;
			}
			return this;
		});
	}

	async getWiki() {
		// Get wiki from portal2.sr (wiki.portal2.sr/api.php)
		let target = this;
		return queryAPI([...target.maps].chunkify(50).map(e =>
			'https://wiki.portal2.sr/api.php?action=query&format=json&origin=*&prop=revisions&rvprop=content&rvslots=main&titles=' +
			e.map(e => e.wikiname).join('|')
		), r => r.json()).then(e => e.reduce((acc, val) =>
			acc.concat(Object.keys(val.query.pages).reduce((f, g) => 
				f.concat(val.query.pages[g])
			, [])), [])
		).then(e => {
			let count = e.length;
			for (let i = 0; i < count; i++) {
				let map = target.mapWithProperty('wikiname', e[i].title);
				map.wikicontent = '';
				if (e[i].hasOwnProperty('revisions')) {
					let txt = e[i].revisions[0].slots.main["*"];
					if (txt.startsWith('#REDIRECT')) {
						// No redirect handling
						console.error(`WIKI: Couldn't get ${map.wikiname} : ERROR 302`);
					} else {
						map.wikicontent = txt;
					}
				} else {
					console.error(`WIKI: Couldn't get ${map.wikiname} : ERROR 404`);
				}
			}
			return target;
		});
	}
	
	async getBoards() {
		// Get Challenge Mode leaderboards
		// This is easily the most intensive fetch function
		// Use sparingly to appease the portal2.sr hosting service
		
		// CORS headers aren't set for the /json page so none of this works
		return false;
		
		return queryAPI(this.maps.map(e => 'https://board.portal2.sr/chamber/' + e.chamberID + '/json'
		), r => r.json()
		).then(e => {
			for (let i = 0; i < e.length; i++) {
				let scores = [];
				//                                                && parseInt(e[i][key].scoreData.scoreRank) <= 10    /* for only top 10 times */
				for (let key in e[i]) if (e[i].hasOwnProperty(key)) scores.push(e[i][key]);
				this.maps[i].cmboard = scores.map(e => {
					e.scoreData.date = new Date(e.scoreData.date + ' +2'); // CEST, UTC +2 hours
					delete e.scoreData.changelogId;
					delete e.scoreData.playerRank;
					delete e.scoreData.note;
					delete e.scoreData.submission;
					delete e.userData.avatar;
					return e;
				});;
			}
			return this;
		})
	}

	formatWiki() {
		this.maps.map(e => e.formattedWiki = e.wikicontent.replaceAll('\n', '<br>'));
		for (let map of this.maps) {
			if (!map.wikicontent || map.wikicontent == '') continue;
			[map.formattedWiki, map.categories] = [[], []];
			let [bold, italic, pre] = [false];
			let lines = map.wikicontent.split('\n'), lineCount = lines.length;
			for (let i = 0; i < lineCount; i++) {
				[bold, italic] = [false];

				while (lines[i].indexOf("'''") > -1) {
					lines[i] = lines[i].replace("'''", bold ? "</b>" : "<b>");
					bold = !bold;
				} // bolding

				while (lines[i].indexOf("''") > -1) {
					lines[i] = lines[i].replace("''", italic ? "</i>" : "<i>");
					italic = !italic;
				} // italics
				
				if (lines[i].startsWith(' ')) {
					lines[i] = lines[i].substr(1);
					if (!pre) {
						if (i == lines.length - 1) {
							lines[i] = '<pre>' + lines[i] + '</pre>';
						} else {
							lines[i] = '<pre>' + lines[i];
						}
						pre = true;
					}
				} else if (pre) {
					map.formattedWiki[map.formattedWiki.length - 1] = lines[i - 1] + '</pre>';
					pre = false;
				}

				while (lines[i].indexOf('[[') > -1 && lines[i].indexOf(']]') > lines[i].indexOf('[[')) {
					let start = lines[i].indexOf('[['), end = lines[i].indexOf(']]');
					let content = lines[i].substring(start, end + 2);
					if (content.startsWith('[[Category:')) {
						map.categories.push(lines[i].substring(start + 11, end));
					} else if (!content.startsWith('[[File:')) {
							let parts = content.replace('[[', '').replace(']]', '').split('|');
							let link = parts[0], display = parts.pop();
							if (link.startsWith('#')) link = map.wikiname + link;
							link = 'https://wiki.portal2.sr/' + link.replaceAll(' ', '_').replaceAll('"', '%22');
							lines[i] = lines[i].replace(content, `<a href="${link}" target="_blank">${display}</a>`);
					}
					if (start == lines[i].indexOf('[[')) lines[i] = lines[i].replace(content, '');
				}

				while (lines[i].indexOf('[') > -1 && lines[i].indexOf(']') > lines[i].indexOf('[')) {
					let start = lines[i].indexOf('['), end = lines[i].indexOf(']') + 1;
					let content = lines[i].substring(start, end);
					let link = content.split(' ')[0].substr(1);
					let display = (content.split(' ').length > 1 ? content.replace(`[${link} `, '') : link).replace(']', '');
					if (!link.startsWith('http')) break;
					lines[i] = lines[i].replace(content, `<a href="${link}" target="_blank">${display}</a>`);
				}


				let trimmedLine = lines[i].trim();

				if (trimmedLine.startsWith('{{')) {
					let startI = i, inside = [], indent = 0, goneIn = false;
					while ((indent > 0 || !goneIn) && i < lines.length) {
						goneIn = true;
						indent += (lines[i].match(/\{\{/g) || []).length;
						indent -= (lines[i].match(/\}\}/g) || []).length;
						inside.push(lines[i].trim());
						i++;
					}
					i--;
					inside = inside.join('\n'), indent = 0;
					inside = inside.substring(2, inside.length - 2);
					let insideArgs = [], str = '';
					for (let j = 0; j < inside.length; j++) {
						if (inside[j] + inside[j + 1] == '{{') {
							indent++;
							j += 2;
						} else if (inside[j] + inside[j + 1] == '}}') {
							indent--;
							j += 2;
						} else if (inside[j] == '|' && indent == 0) {
							insideArgs.push(str);
							str = '';
						} else {
							str += inside[j];
						}
					}
					insideArgs.push(str);
					// do stuff with insideArgs
					switch (insideArgs[0]) {
						case 'P2_Video':
							// youtube embed
							break;
						case 'P2_Infobox':
							// page title
							map.formattedWiki.push(`<h1 class="p2title">${insideArgs[1]}</h1>`);
							if (map.coop) {
								// the only coop map not cm native is calibration
								map.cmNative = map.splitname != 'Calibration' && map.splitname != 'Hub';
							} else {
								let arr = insideArgs[3].split("\n");
								for (let i = 0; i < arr.length; i++) {
									if (arr[i].indexOf('Native to Challenge Mode') > -1) {
										let part = arr[i].split(" ");
										map.cmNative = part[part.length - 1] == 'Yes';
									}
								}
							}
							break;
						case 'P2 Image':
							// image (no underscore for some reason)
							break;
					}

					continue;
				} // templates

				if (lines[i].startsWith('#')) {
					if (!lines[i - 1].startsWith('#')) map.formattedWiki.push('<ol>');
					map.formattedWiki.push(`<li>${lines[i].substring(1)}</li>`);
					if (!lines[i + 1].startsWith('#')) map.formattedWiki.push('</ol>');
					continue;
				} // ordered lists

				if (lines[i].startsWith('*')) {
					if (!lines[i - 1].startsWith('*')) map.formattedWiki.push('<ul>');
					map.formattedWiki.push(`<li>${lines[i].substring(1)}</li>`);
					if (!lines[i + 1].startsWith('*')) map.formattedWiki.push('</ul>');
					continue;
				} // unordered lists

				{
					let j = 0;
					while (lines[i][j] + trimmedLine[trimmedLine.length - j - 1] == '==') {j++;}
					if (j > 0) {
						map.formattedWiki.push(`<h${j}>${lines[i].substring(j, trimmedLine.length - j)}</h${j}>`);
						continue;
					}
				} // headings
				map.formattedWiki.push(lines[i]);
			}
			map.formattedWiki = map.formattedWiki.join('<br>').replaceEvery('<br><br><br>', '<br><br>');
		}
	}

	convertMtriggers() {
		// Convert mtriggers to 1.13+ file format
		let zip = new JSZip();
		this.maps.filter(e => 0 < e.triggers.length).map(P2Map => {
			let mtriggers = [];
			mtriggers.push('!name ' + P2Map.splitname);
			mtriggers.push('!map ' + P2Map.filename);
			mtriggers.push(...P2Map.triggers.map((e, f, g) => {
				if (e == '"Start" load action=force_start') return '!start load';
				let name = e.split('"')[1];
				let args = e.substr(name.length + 3);
				args = args.replace(' action=stop', '');
				e = `${name}: ${args}`;

				if (P2Map.coop) {

					if (e == 'Flags 1: flags') {
						e = 'Flags:\n	[Blue]   finish player=0';
					} else if (e == 'Flags 2: flags "ccafter=Flags 1"') {
						e = '	[Orange] finish player=1';
					}

					// hard code case for turret assassin
					e = e.replace(' "ccafter=Catapult Orange"', '');
					if (P2Map.filename != 'mp_coop_turret_ball' ||
						(e != 'Catapult Orange: entity targetname=faith_plate_player-relay_up inputname=Trigger' &&
						 e != 'Catapult Blue: entity targetname=faith_plate_player-proxy inputname=OnProxyRelay3')) {
						if (name.endsWith(' Blue')) {
							e = e.replace(' Blue: ', ':\n	[Blue]   ');
						} else if (name.endsWith(' Orange')) {
							e = '	[Orange] ' + args;
						} else if (name.startsWith('Blue ')) {
							e = name.substr(5) + ':\n	[Blue]   ' + args;
						} else if (name.startsWith('Orange ')) {
							e = '	[Orange] ' + args;
						}
					}
				}
				return e;
			}));
			console.log(mtriggers.join('\n'));
			zip.file(P2Map.filename + '.mtr', mtriggers.join('\n'));
		})
      	zip.saveAs("mtriggers.zip");
	}

	mapWithProperty(prop, val) {
		let found = this.maps.filter(e => e[prop] == val);
		return found[0] ? found[0] : undefined;
	}
}
