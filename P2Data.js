class P2Data {
	constructor() {
		let genericTriggers = coop => ['"Start" load action=force_start'].concat(coop ? ['"Flags 1" flags', '"Flags 2" flags "ccafter=Flags 1" action=stop'] : ['"Flags" flags action=stop']);
		let P2Map = e => ({
			filename: e[0],
			splitname: e[1],
			wikiname:
				e[1] == 'Funnel Catch (SP)' ? 'Funnel Catch (singleplayer)' :
				e[1] == 'Funnel Catch (MP)' ? 'Funnel Catch' :
				e[1] == 'Jailbreak'         ? 'Jail Break' :
				e[1],
			chapter: isNaN(parseInt(e[2])) ? -1 : parseInt(e[2]),
			coop: e[3],
			triggers: genericTriggers(e[3]),
			fade: e[4],
			wikicontent: '',
			cmNative: false
		});
		this.maps = [
			P2Map(['sp_a1_intro1'                , 'Container Ride',       1, false, ``]),
			P2Map(['sp_a1_intro2'                , 'Portal Carousel',      1, false, `Aperture Science Reintegration [Associate]`]),
			P2Map(['sp_a1_intro3'                , 'Portal Gun',           1, false, `Should've asked that [first]. I'm just gonna [wait] for you up ahead`]),
			P2Map(['sp_a1_intro4'                , 'Smooth Jazz',          1, false, ``]),
			P2Map(['sp_a1_intro5'                , 'Cube Momentum',        1, false, `Personality [constructs] will remain`]),
			P2Map(['sp_a1_intro6'                , 'Future Starter',       1, false, `Please [return] to your primitive tribe`]),
			P2Map(['sp_a1_intro7'                , 'Secret Panel',         1, false, ``]),
			P2Map(['sp_a1_wakeup'                , 'Wakeup',               1, false, ``]),
			P2Map(['sp_a2_intro'                 , 'Incinerator',          1, false, `Testing for the [rest] of your life`]),
			P2Map(['sp_a2_laser_intro'           , 'Laser Intro',          2, false, ``]),
			P2Map(['sp_a2_laser_stairs'          , 'Laser Stairs',         2, false, `That's what it says: a [horrible] person`]),
			P2Map(['sp_a2_dual_lasers'           , 'Dual Lasers',          2, false, `Emerge from suspension terribly [undernourished]`]),
			P2Map(['sp_a2_laser_over_goo'        , 'Laser Over Goo',       2, false, ``]),
			P2Map(['sp_a2_catapult_intro'        , 'Catapult Intro',       2, false, `Room full of air [for] the rest of your life`]),
			P2Map(['sp_a2_trust_fling'           , 'Trust Fling',          2, false, ``]),
			P2Map(['sp_a2_pit_flings'            , 'Pit Flings',           2, false, ``]),
			P2Map(['sp_a2_fizzler_intro'         , 'Fizzler Intro',        2, false, ``]),
			P2Map(['sp_a2_sphere_peek'           , 'Ceiling Catapult',     3, false, ``]),
			P2Map(['sp_a2_ricochet'              , 'Ricochet',             3, false, `I [did] see some humans`]),
			P2Map(['sp_a2_bridge_intro'          , 'Bridge Intro',         3, false, `Did you guess 'sharks'? Because [that's] wrong`]),
			P2Map(['sp_a2_bridge_the_gap'        , 'Bridge The Gap',       3, false, `There's lots of room [here]`]),
			P2Map(['sp_a2_turret_intro'          , 'Turret Intro',         3, false, ``]),
			P2Map(['sp_a2_laser_relays'          , 'Laser Relays',         3, false, `Technically, it's a [medical] experiment`]),             
			P2Map(['sp_a2_turret_blocker'        , 'Turret Blocker',       3, false, `A man [and] a woman`]),
			P2Map(['sp_a2_laser_vs_turret'       , 'Laser Vs Turret',      3, false, `[second high note]`]),
			P2Map(['sp_a2_pull_the_rug'          , 'Pull The Rug',         3, false, `After all [these] years`]),
			P2Map(['sp_a2_column_blocker'        , 'Column Blocker',       4, false, ``]),
			P2Map(['sp_a2_laser_chaining'        , 'Laser Chaining',       4, false, ``]),
			P2Map(['sp_a2_triple_laser'          , 'Triple Laser',         4, false, `Look at things objectively, [see] what you don't need`]),               
			P2Map(['sp_a2_bts1'                  , 'Jailbreak',            4, false, ``]),
			P2Map(['sp_a2_bts2'                  , 'Escape',               4, false, ``]),
			P2Map(['sp_a2_bts3'                  , 'Turret Factory',       5, false, ``]),
			P2Map(['sp_a2_bts4'                  , 'Turret Sabotage',      5, false, ``]),
			P2Map(['sp_a2_bts5'                  , 'Neurotoxin Sabotage',  5, false, ``]),
			P2Map(['sp_a2_bts6'                  , 'Tube Ride',            5, false, ``]),                                        
			P2Map(['sp_a2_core'                  , 'Core',                 5, false, ``]),
			P2Map(['sp_a3_00'                    , 'Long Fall',            6, false, ``]),                                        
			P2Map(['sp_a3_01'                    , 'Underground',          6, false, ``]),
			P2Map(['sp_a3_03'                    , 'Cave Johnson',         6, false, ``]),
			P2Map(['sp_a3_jump_intro'            , 'Repulsion Intro',      6, false, `Here's some advice the lab boys gave me [*] do not`]),
			P2Map(['sp_a3_bomb_flings'           , 'Bomb Flings',          6, false, `Slight chance the [calcium] could harden`]),
			P2Map(['sp_a3_crazy_box'             , 'Crazy Box',            6, false, `Invent a special safety [door] that won't hit you`]),
			P2Map(['sp_a3_transition01'          , 'PotatOS',              6, false, ``]),
			P2Map(['sp_a3_speed_ramp'            , 'Propulsion Intro',     7, false, `With your help, we're gonna change [the] world`]),          
			P2Map(['sp_a3_speed_flings'          , 'Propulsion Flings',    7, false, `I mentioned earlier. [Again]: all you gotta do`]),
			P2Map(['sp_a3_portal_intro'          , 'Conversion Intro',     7, false, ``]),
			P2Map(['sp_a3_end'                   , 'Three Gels',           7, false, ``]),
			P2Map(['sp_a4_intro'                 , 'Test',                 8, false, `Paradox idea didn't work. [And] it almost killed me`]),
			P2Map(['sp_a4_tb_intro'              , 'Funnel Intro',         8, false, `The good [news] is... well, none so far`]),                             
			P2Map(['sp_a4_tb_trust_drop'         , 'Ceiling Button',       8, false, `I knew we're in a lot [of] trouble`]),
			P2Map(['sp_a4_tb_wall_button'        , 'Wall Button',          8, false, `Oh no... [*] it's happening sonner than I expected`]),
			P2Map(['sp_a4_tb_polarity'           , 'Polarity',             8, false, ``]),
			P2Map(['sp_a4_tb_catch'              , 'Funnel Catch (SP)',    8, false, `Can get a little... [unbearable]`]),
			P2Map(['sp_a4_stop_the_box'          , 'Stop The Box',         8, false, `No. [No]. That was the solution`]),
			P2Map(['sp_a4_laser_catapult'        , 'Laser Catapult',       8, false, `Maintain any of the [crucial] functions required`]),
			P2Map(['sp_a4_laser_platform'        , 'Laser Platform',       8, false, ``]),
			P2Map(['sp_a4_speed_tb_catch'        , 'Propulsion Catch',     8, false, `Gonna love it, to [*] death`]),                            
			P2Map(['sp_a4_jump_polarity'         , 'Repulsion Polarity',   8, false, `He's got a surprise [for] us`]),
			P2Map(['sp_a4_finale1'               , 'Finale 1',             9, false, ``]),
			P2Map(['sp_a4_finale2'               , 'Finale 2',             9, false, ``]),
			P2Map(['sp_a4_finale3'               , 'Finale 3',             9, false, ``]),
			P2Map(['sp_a4_finale4'               , 'Finale 4',             9, false, ``]),
			P2Map(['mp_coop_start'               , 'Calibration',          0, true,  ``]),                                        
			P2Map(['mp_coop_doors'               , 'Doors',                1, true,  ``]),
			P2Map(['mp_coop_race_2'              , 'Buttons',              1, true,  ``]),
			P2Map(['mp_coop_laser_2'             , 'Lasers',               1, true,  `One of you is doing very [v]ery well`]),
			P2Map(['mp_coop_rat_maze'            , 'Rat Maze',             1, true,  `Reflected in your final [sc]ore`]),
			P2Map(['mp_coop_laser_crusher'       , 'Laser Crusher',        1, true,  `Not just flattery, you are gre[a]t at science`]),              
			P2Map(['mp_coop_teambts'             , 'Behind The Scenes',    1, true,  ``]),
			P2Map(['mp_coop_fling_3'             , 'Flings',               2, true,  `Exactly fit an edgeless safet[y] cube`]),
			P2Map(['mp_coop_infinifling_train'   , 'Infinifling',          2, true,  `Must be very, very prou[d]`]),                            
			P2Map(['mp_coop_come_along'          , 'Team Retrieval',       2, true,  ``]),
			P2Map(['mp_coop_fling_1'             , 'Vertical Flings',      2, true,  ``]),
			P2Map(['mp_coop_catapult_1'          , 'Catapults',            2, true,  ``]),
			P2Map(['mp_coop_multifling_1'        , 'Multifling',           2, true,  `Looming consequence of [d]eath`]),
			P2Map(['mp_coop_fling_crushers'      , 'Fling Crushers',       2, true,  `Earned a break [from] the official testing courses`]),
			P2Map(['mp_coop_fan'                 , 'Industrial Fan',       2, true,  ``]),
			P2Map(['mp_coop_wall_intro'          , 'Cooperative Bridges',  3, true,  `Let me give you a cl[ue]`]),
			P2Map(['mp_coop_wall_2'              , 'Bridge Swap',          3, true,  `Testing track hall of fame for tha[t]`]),
			P2Map(['mp_coop_catapult_wall_intro' , 'Fling Block',          3, true,  `For completing this test, a reward for [t]esting`]),                  
			P2Map(['mp_coop_wall_block'          , 'Catapult Block',       3, true,  `Described it as impossible, dead[ly], cruel`]),
			P2Map(['mp_coop_catapult_2'          , 'Bridge Fling',         3, true,  `To not reassemble you. He refu[s]ed`]),
			P2Map(['mp_coop_turret_walls'        , 'Turret Walls',         3, true,  `Reconfigured it from my original [p]lans`]),
			P2Map(['mp_coop_turret_ball'         , 'Turret Assassin',      3, true,  `You would've never completed them. So [a]gain`]),
			P2Map(['mp_coop_wall_5'              , 'Bridge Testing',       3, true,  ``]),
			P2Map(['mp_coop_tbeam_redirect'      , 'Cooperative Funnels',  4, true,  `Three. Seven. Hundred [and] seven`]),
			P2Map(['mp_coop_tbeam_drill'         , 'Funnel Drill',         4, true,  `There. [I've] said it`]),
			P2Map(['mp_coop_tbeam_catch_grind_1' , 'Funnel Catch (MP)',    4, true,  `I'm not sur[e] I trust the two of you together`]),
			P2Map(['mp_coop_tbeam_laser_1'       , 'Funnel Laser',         4, true,  `Doing that just to aggra[v]ate me`]),
			P2Map(['mp_coop_tbeam_polarity'      , 'Cooperative Polarity', 4, true,  `I trust y[ou]. You are my favorite`]),
			P2Map(['mp_coop_tbeam_polarity2'     , 'Funnel Hop',           4, true,  `If [O]range had said those things about me`]),
			P2Map(['mp_coop_tbeam_polarity3'     , 'Advanced Polarity',    4, true,  `So I can trust [you] one hundred percent`]),
			P2Map(['mp_coop_tbeam_maze'          , 'Funnel Maze',          4, true,  `Before we can go any further, [*] I will need you to complete`]),         
			P2Map(['mp_coop_tbeam_end'           , 'Turret Warehouse',     4, true,  ``]),
			P2Map(['mp_coop_paint_come_along'    , 'Repulsion Jumps',      5, true,  `The best cooperative tes[t]ing team`]),
			P2Map(['mp_coop_paint_redirect'      , 'Double Bounce',        5, true,  `The number one request? [*] Less deadly tests`]),
			P2Map(['mp_coop_paint_bridge'        , 'Bridge Repulsion',     5, true,  `You will need him for the f[i]nal track`]),
			P2Map(['mp_coop_paint_walljumps'     , 'Wall Repulsion',       5, true,  `If they ever write a historica[l] document of my heroic rescue`]),
			P2Map(['mp_coop_paint_speed_fling'   , 'Propulsion Crushers',  5, true,  `If that doesn't moti[v]ate you`]),
			P2Map(['mp_coop_paint_red_racer'     , 'Turret Ninja',         5, true,  `Are you [as] excited as I am?`]),
			P2Map(['mp_coop_paint_speed_catch'   , 'Propulsion Retrieval', 5, true,  `The ratio of humans to monsters is about [*] a million to one.`]),
			P2Map(['mp_coop_paint_longjump_intro', 'Vault Entrance',       5, true,  ``]),
			P2Map(['mp_coop_separation_1'        , 'Separation',           6, true,  `For as long as you [d]id`]),
			P2Map(['mp_coop_tripleaxis'          , 'Triple Axis',          6, true,  `Solving things in the future, but we [d]on't`]),                          
			P2Map(['mp_coop_catapult_catch'      , 'Catapult Catch',       6, true,  `I'm marking this art [a]ppreciated`]),
			P2Map(['mp_coop_2paints_1bridge'     , 'Bridge Gels',          6, true,  ``]),
			P2Map(['mp_coop_paint_conversion'    , 'Maintenance',          6, true,  ``]),
			P2Map(['mp_coop_bridge_catch'        , 'Bridge Catch',         6, true,  `Just to get the scheming juices [f]lowing`]),
			P2Map(['mp_coop_laser_tbeam'         , 'Double Lift',          6, true,  ``]),
			P2Map(['mp_coop_paint_rat_maze'      , 'Gel Maze',             6, true,  `If I don't see you on the other side, [t]hanks for nothing`]),                    
			P2Map(['mp_coop_paint_crazy_box'     , 'Crazier Box',          6, true,  ``])
		];
	}

	async getMtriggers() {
		// Get mtriggers from Github (p2sr/portal2-mtriggers)
		let URLs = this.maps.map(e =>
			'https://raw.githubusercontent.com/p2sr/portal2-mtriggers/master/' +
			(e.coop ? 'Coop/Course' : 'SP/Chapter') +
			e.chapter + '/' +
			e.filename + '.cfg'
		);

		if (queryAPI) {
			let response = await queryAPI(URLs);
			for (let i = 0; i < response.length; i++) {
				let map = this.maps[i];
				this.maps[i].triggers = response[i].split('\n').filter(e =>
					e.startsWith('sar_speedrun_cc_rule ')
				).map(e => e.replace('sar_speedrun_cc_rule ', ''))
			}
		} else {
			console.error("PROTOTYPES.JS NOT INCLUDED!");
		}

		return this;
	}

	trailingZeroFunc(f) {
		this.maps = this.maps.map(e => {
			e.triggers = e.triggers.map(e => {
				let name = e.substring(0, e.indexOf('"', 1) + 1);
				let args = e.substring(e.indexOf('"', 1) + 2).split(' ');
				args = args.map(e => {
					let property = e.split('=');
					if (property.length > 0 && ['center', 'size', 'angle'].indexOf(property[0]) > -1) {
						property[1] = property[1].split(',').map(f).join(',');
					}
					return property.join('=');
				});
				return name + ' ' + args.join(' ');
			});
			return e;
		});
	}
	addTrailingZeroes() {
		this.trailingZeroFunc(e => parseFloat(e).toFixed(2).toString());
	}
	removeTrailingZeroes() {
		this.trailingZeroFunc(e => parseFloat(e).toString());
	}

	async getWiki() {
		// Get wiki from portal2.sr (wiki.portal2.sr/api.php)
		if (Array.prototype.chunkify) {
			let URLs = this.maps.chunkify(50).map(e => 
				'https://wiki.portal2.sr/api.php?action=query&format=json&origin=*&prop=revisions&rvprop=content&rvslots=main&titles=' +
				e.map(e => e.wikiname).join('|')
			);
			if (queryAPI) {
				let response = await queryAPI(URLs, r => r.json());
				for (let i = 0; i < response.length; i++) {
					let pages = response[i].query.pages;
					for (let page in pages) {
						if (pages.hasOwnProperty(page)) {
							let map = this.mapWithWikiName(pages[page].title);
							map.wikicontent = '';
							if (pages[page].hasOwnProperty('revisions')) {
								let txt = pages[page].revisions[0].slots.main["*"];
								if (txt.startsWith('#REDIRECT')) {
									// No.
									console.error(`couldn't get wikitext for ${map.wikiname}, got redirected`);
								} else {
									map.wikicontent = txt;
								}
							} else {
								console.error(`couldn't get wikitext for ${map.wikiname}, page doesn't exist`);
							}
						}
					}
				}
			} else {
				console.error("PROTOTYPES.JS NOT INCLUDED!");
			}
		} else {
			console.error("PROTOTYPES.JS NOT INCLUDED!");
		}
		return this;
	}

	mapWithWikiName(wikiname) {
		let found = this.maps.filter(e => e.wikiname == wikiname);
		return found[0] ? found[0] : false;
	}
}