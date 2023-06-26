class P2Data {
	constructor() {
		let genericTriggers = coop => ['"Start" load action=force_start'].concat(coop ? ['"Flags 1" flags', '"Flags 2" flags "ccafter=Flags 1" action=stop'] : ['"Flags" flags action=stop']);
		let chapterLast = "", chapterIdx = 0;
		let P2Map = e => ({
			filename: e[0],
			splitname: e[1],
			wikiname:
				e[1] == 'Funnel Catch'
					? 'Funnel Catch (singleplayer)'
					: e[1] == 'Funnel Catch Coop'
						? 'Funnel Catch'
						: e[1] == 'Jailbreak'
							? 'Jail Break'
							: e[1] == 'Laser vs Turret'
								? 'Laser Vs Turret'
								: e[1],
			chapter: isNaN(parseInt(e[2])) ? -1 : parseInt(e[2]),
			chapterIdx: (e => {
				let ret = chapterLast == e[2] ? ++chapterIdx : chapterIdx = 1;
				chapterLast = e[2];
				return ret;
			})(e),
			coop: e[3],
			triggers: genericTriggers(e[3]),
			chamberID: e[4],
			cmboard: [],
			fade: e[5],
			wikicontent: '',
			categories: [],
			formattedWiki: '',
			cmAvailability: Math.floor(e[4] / 10000) >= 6 ? 0 : e[4] > -1 ? 1 : -1,
		});
		this.maps = [
			P2Map(['sp_a1_intro1'                , 'Container Ride',       1, false, 62761, `You have [j]ust passed through an Aperture [S]cience Material E[m]ancipation Grill, which vaporises most Aperture Science equipment that touches it.`]),
			P2Map(['sp_a1_intro2'                , 'Portal Carousel',      1, false, 62758, `Good. []Because of the tech[n]ical difficulties we [a]re currently experiencing, your test environment is unsuper[v]ised. Be[f]ore re-entering a [r]elaxation vault at the conclusion of testing, please take a m[o]ment to write down the re[s]ults of your test. []An Aperture Sci[e]nce Reintegration [A]ssociate will revive you for an interview when society has been rebuilt.`]),
			P2Map(['sp_a1_intro3'                , 'Portal Gun',           1, false, 47458, `Good. [I]f you feel that a lethal [m]ilitary android has not respected your rights as detailed in the Law[s] of Robotics, pl[e]ase note it on your Self-[R]eporting Form. []A future Aperture [S]cience Entitlement Associate will initiate the appropriate grievance-filing paperwork.`]),
			P2Map(['sp_a1_intro4'                , 'Smooth Jazz',          1, false, 47455, ``]),
			P2Map(['sp_a1_intro5'                , 'Cube Momentum',        1, false, 47452, `Well [d]one. The En[r]ichment Center reminds [y]ou that although circumstances may appear bleak, you are not alon[e]. All Ap[e]rture Science Personality [C]onstructs will rem[a]in functional in ap[o]calyptic, low-power environments of as few as 1 point 1 volts.`]),
			P2Map(['sp_a1_intro6'                , 'Future Starter',       1, false, 47106, `Good work [g]etting this far, future [s]tarter! That said, if you are simple-minded, ol[d], or irradi[a]ted in such a way th[a]t the future should not s[t]art with you, plea[s]e return to your primitive tribe, and send back someone better qualified for testing.`]),
			P2Map(['sp_a1_intro7'                , 'Secret Panel',         1, false, 62763, ``]),
			P2Map(['sp_a1_wakeup'                , 'Wakeup',               1, false, 62759, ``]),
			P2Map(['sp_a2_intro'                 , 'Incinerator',          1, false, 47735, `But the important [t]hing is you're back, with me. And now I'm onto all your little tricks. []So there's nothing to sto[p] us from testing, []for the rest of your life.[] After that, []who knows, maybe I'll take up a hobby. Reanimating the dead, maybe.`]),
			P2Map(['sp_a2_laser_intro'           , 'Laser Intro',          2, false, 62765, ``]),
			P2Map(['sp_a2_laser_stairs'          , 'Laser Stairs',         2, false, 47736, `Well [d]one. Here come the test results... []you are a h[o]rrible person.[] Tha[t]'s what it says, []a horrible person. We weren't even testing for that.`]),
			P2Map(['sp_a2_dual_lasers'           , 'Dual Lasers',          2, false, 47738, `[]Congratulatio[n]s. Not on the test. Most people emerge from su[s]pension terri[b]ly undernourished.[] I want to congra[t]ulate you on beatin[g] the odds and somehow managing to pack on a few pounds.`]),
			P2Map(['sp_a2_laser_over_goo'        , 'Laser Over Goo',       2, false, 47742, ``]),
			P2Map(['sp_a2_catapult_intro'        , 'Catapult Intro',       2, false, 62767, `Here's an interesting fact: []you're not breathin[g] real air. []It's too expensive to pump this far down. [W]e just take car[b]on dioxide [o]ut of a room, freshen it up a little, and pump it [b]ack in. []So you'll be [b]reathing the same [r]oom full of air [f]or the rest of your life.`]),
			P2Map(['sp_a2_trust_fling'           , 'Trust Fling',          2, false, 47744, `{Remember before when I was talking about smelly garbage standing around being useless? That} wa[s] a metaphor. I was actually talking about yo[u]. [A]nd I'm so[r]ry. You didn't react at the time, []so I was [w]orried it [s]ailed right over your head, which would've [m]ade this apolo[g]y seem in[s]ane. []Tha[t]'s why I had to call you garbage a second time just now.`]),
			P2Map(['sp_a2_pit_flings'            , 'Pit Flings',           2, false, 47465, ``]),
			P2Map(['sp_a2_fizzler_intro'         , 'Fizzler Intro',        2, false, 47746, ``]),
			P2Map(['sp_a2_sphere_peek'           , 'Ceiling Catapult',     3, false, 47748, ``]),
			P2Map(['sp_a2_ricochet'              , 'Ricochet',             3, false, 47751, `Well, you passed the test. []I didn't see [t]he deer today.[] I did [s]ee some humans,[] but with you here I've got more test subjects than I'll ever need.`]),
			P2Map(['sp_a2_bridge_intro'          , 'Bridge Intro',         3, false, 47752, `Excellent! You're a predator, and the[s]e tests are you[r] prey. [S]peaking of which, I was researching sharks for an upcoming [t]est. [D]o you know who el[s]e murders people who are only trying to help them? []Did you guess 'shar[k]s'? Because th[a]t's wrong. []The correct answer i[s] 'nobody.' Nobody but you is that pointlessly cruel.`]),
			P2Map(['sp_a2_bridge_the_gap'        , 'Bridge The Gap',       3, false, 47755, `Well done.[] In fac[t], you did so [w]ell, I'm going to note this on your file, in the commen[d]ations sectio[n]. Oh,[] there's lots of [r]oom here. []'Did well. Enough.'`]),
			P2Map(['sp_a2_turret_intro'          , 'Turret Intro',         3, false, 47756, ``]),
			P2Map(['sp_a2_laser_relays'          , 'Laser Relays',         3, false, 47759, `You know how I'm going [t]o live forever, []but you're going to be dea[d] in sixty years? Well, I've been working on a bela[t]ed birthday presen[t] for you. []Well, more of a belated birthday medical pro[c]edure. [W]ell, te[c]hnically, i[t]'s a medical expe[r]iment. What's important is it's a present.`]),
			P2Map(['sp_a2_turret_blocker'        , 'Turret Blocker',       3, false, 47760, `[]I'm going through the [l]ist of test subjects in cryogenic storage. I [m]anaged to find tw[o] with your last name.[] A m[a]n and a woman.[] So that's interesting. It's a small world.`]),
			P2Map(['sp_a2_laser_vs_turret'       , 'Laser vs Turret',      3, false, 47763, `[2nd high note] https://cdn.discordapp.com/attachments/574898830995357697/1069483351246905395/laser-vs-turret.mp3`]),
			P2Map(['sp_a2_pull_the_rug'          , 'Pull The Rug',         3, false, 47764, `I bet [y]ou think I forgot about your surprise. I didn't. []In fact, we're hea[d]ed to your surpris[e] right now. []After al[l] these years. I'm getting choked up just thinking about it.`]),
			P2Map(['sp_a2_column_blocker'        , 'Column Blocker',       4, false, 47766, ``]),
			P2Map(['sp_a2_laser_chaining'        , 'Laser Chaining',       4, false, 47768, `I thought about our [d]ilemma, and [I] came up with a sol[u]tion that I honestly think works out best for one of both of us.`]),
			P2Map(['sp_a2_triple_laser'          , 'Triple Laser',         4, false, 47770, `I think [t]hese test chambers look even better than they did before. []It was easy, re[a]lly. You jus[t] have to look at things [o]bjectively, [s]ee what you don't need anymore, and trim out the fat.`]),
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
			P2Map(['sp_a3_jump_intro'            , 'Repulsion Intro',      6, false, 47787, `Oh, in case you got [c]overed in that repulsion gel, here's some advice the lab boys gave me: []do not get covered in the repulsion gel. We haven't entirely nailed down what element it is yet, but I'll tell you this: it's a lively one, and it does not like the human skeleton.`]),
			P2Map(['sp_a3_bomb_flings'           , 'Bomb Flings',          6, false, 47468, `Just a heads up, that coffee we gave you earlier had fluores[c]ent calcium in it so we could track the neuronal activity in your brain.[] There's a slight chance the calcium could harden and vitrify your frontal lobe. Anyway, don't stress yourself thinking about it. I'm serious. Visualising the scenario while under stress actually triggers the reaction.`]),
			P2Map(['sp_a3_crazy_box'             , 'Crazy Box',            6, false, 47469, `{Science isn't} abou[t] "why", it's about "why not!" Why is so mu[c]h of our science dangerous? Why not marry safe science if you [l]ove it so much? In fact, why not invent a special safety [d]oor that won't hit you on the butt on the way out because you are fired! Not you, test subject, you're doing fine. Yes, you, box, your stuff, out the front door, parking lot, car. Goodbye.`]),
			P2Map(['sp_a3_transition01'          , 'PotatOS',              6, false, 47472, ``]),
			P2Map(['sp_a3_speed_ramp'            , 'Propulsion Intro',     7, false, 47791, `Great job, astro[n]aut, war hero, and or Olympian! With your help, [w]e're gonna cHaNgE ThE wOrLd! This on? *tap* *tap* *tap* Hey, listen up down there. That thing's called an 'elevator.' Not a bathroom.`]),
			P2Map(['sp_a3_speed_flings'          , 'Propulsion Flings',    7, false, 47793, `In case you're interested, there's still some [p]ositions available for that bonus opportunity I mentioned earlier. []Again, all you gotta do is let us disassemble you. We're no[t] banging rocks together here, we know how to put a man back together. So, that's a complete reassembly. New vitals, spit-shine on the old ones, plus we're scooping out tumors. Frankly, you oughtta be paying us.`]),
			P2Map(['sp_a3_portal_intro'          , 'Conversion Intro',     7, false, 47795, ``]),
			P2Map(['sp_a3_end'                   , 'Three Gels',           7, false, 47798, ``]),
			P2Map(['sp_a4_intro'                 , 'Test',                 8, false, 88350, `Alr[i]ght, so my paradox idea didn't work. An[d] it almost [k]illed me. []Luckily, by the looks of things, he knows as [m]uch about test bui[l]ding as he does about logical contradictions.`]),
			P2Map(['sp_a4_tb_intro'              , 'Funnel Intro',         8, false, 47800, `Okay, so the [b]ad news is the tests [a]re my tests now.[] So they can kill us. The [g]ood news is? []Well, none so far, to be honest. I'll get back to you on that.`]),
			P2Map(['sp_a4_tb_trust_drop'         , 'Ceiling Button',       8, false, 47802, `Ooh, ye[s], []well done.[] Thanks, all we had to do was pull that [l]ever. What? [W]ell no, you pressed the b-[A]HHHHHH! []I know we're in a l[o]t of trouble and probably about to die, but that was worth it.`]),
			P2Map(['sp_a4_tb_wall_button'        , 'Wall Button',          8, false, 47804, `Oh no, []it's happening [s]ooner than I expected. I'm sure we'll be fine.`]),
			P2Map(['sp_a4_tb_polarity'           , 'Polarity',             8, false, 47806, `[]Grrrrh, it's [n]ot enough! []If I'm such a moron, why can't you solve [a] simple test? []I might've pushed that moron thing a little too far this time.`]),
			P2Map(['sp_a4_tb_catch'              , 'Funnel Catch',         8, false, 47808, `The body he's squatting in,[] my body, has a buil[t] in euphoric response to tes[t]ing. Eventually you build up a resistance to it. It can get a little, []unbearable, unless you have the me[n]tal capacity to push past it. It didn't matter to me, I was in it for the science. Him, though...`]),
			P2Map(['sp_a4_stop_the_box'          , 'Stop The Box',         8, false, 47811, `Are you, []are you absolutely [s]ure you're solving the[s]e correctly? I mean, yes, you solved it, but I'm wondering[] if [m]aybe there's a number of way[s] to solve them, and you're picking all the [w]orst ways. []No, no, that was the solution. Grrh, what am I missing?`]),
			P2Map(['sp_a4_laser_catapult'        , 'Laser Catapult',       8, false, 47813, `Remember when I told you that he was s[p]ecifically designed to [m]ake bad decision[s]? Because I think he's decided not [t]o maintain any [o]f the crucial functions required to keep this facility from exploding.`]),
			P2Map(['sp_a4_laser_platform'        , 'Laser Platform',       8, false, 47815, ``]),
			P2Map(['sp_a4_speed_tb_catch'        , 'Propulsion Catch',     8, false, 47817, `You two are gonna love this big surprise.[] In [f]act, [y]ou might say, you're going to love it...[] to [d]eath.[] Gonna love it, until you're d-- []until it kills you, until you're [d]ead. Ha[h]aha, alright, I don't know whether, []you're uh[h], you're pickin' up on what I'm sayin' there, but -- Yes, thanks, we get it.`]),
			P2Map(['sp_a4_jump_polarity'         , 'Repulsion Polarity',   8, false, 47819, `[]So, he's inexplicably happy all of a sudden, [e]ven though he should b[e] going out of his min[d] with test withdrawal. And [h]e's got a surprise [f]or us. What did he find back there?`]),
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
			P2Map(['mp_coop_tbeam_catch_grind_1' , 'Funnel Catch Coop',    4, true,  52665, `I'm not sur[e] I trust the two`]),
			P2Map(['mp_coop_tbeam_laser_1'       , 'Funnel Laser',         4, true,  52667, `Doing that just to aggra[v]ate me`]),
			P2Map(['mp_coop_tbeam_polarity'      , 'Cooperative Polarity', 4, true,  52671, `I trust y[ou]. You are my favorite`]),
			P2Map(['mp_coop_tbeam_polarity2'     , 'Funnel Hop',           4, true,  52687, `If [O]range had said those things about me`]),
			P2Map(['mp_coop_tbeam_polarity3'     , 'Advanced Polarity',    4, true,  52689, `So I can trust [you] 100%`]),
			P2Map(['mp_coop_tbeam_maze'          , 'Funnel Maze',          4, true,  52691, `Can go any further, [*] I will need`]),
			P2Map(['mp_coop_tbeam_end'           , 'Turret Warehouse',     4, true,  52777, ``]),
			P2Map(['mp_coop_paint_come_along'    , 'Repulsion Jumps',      5, true,  52694, `The best cooperative tes[t]ing team`]),
			P2Map(['mp_coop_paint_redirect'      , 'Double Bounce',        5, true,  52711, `Number one request? [*] Less deadly tests`]),
			P2Map(['mp_coop_paint_bridge'        , 'Bridge Repulsion',     5, true,  52714, `You will need him for the f[i]nal track`]),
			P2Map(['mp_coop_paint_walljumps'     , 'Wall Repulsion',       5, true,  52715, `Ever write a historica[l] document`]),
			P2Map(['mp_coop_paint_speed_fling'   , 'Propulsion Crushers',  5, true,  52717, `If that doesn't moti[v]ate you`]),
			P2Map(['mp_coop_paint_red_racer'     , 'Turret Ninja',         5, true,  52735, `Are you [as] excited as I am?`]),
			P2Map(['mp_coop_paint_speed_catch'   , 'Propulsion Retrieval', 5, true,  52738, `Subjects to monsters is about [*] a million`]),
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

		this.chapters = ({
			sp: [
				'The Courtesy Call',
				'The Cold Boot',
				'The Return',
				'The Surprise',
				'The Escape',
				'The Fall',
				'The Reunion',
				'The Itch',
				'The Part Where He Kills You',
			],
			mp: [
				'Calibration',
				'Team Building',
				'Mass And Velocity',
				'Hard-Light Surfaces',
				'Excursion Funnels',
				'Mobility Gels',
				'Art Therapy',
			],
		});
		this.getCMChapterIdx();
	}

	getCMChapterIdx() {
		let chapterLast = "", chapterIdx = 0;
		for (let i = 0; i < this.maps.length; i++) {
			if (this.maps[i].cmAvailability == -1) this.maps[i].cmChapterIdx = -1;
			else if (chapterLast == this.maps[i].chapter) {
				this.maps[i].cmChapterIdx = ++chapterIdx;
			} else {
				this.maps[i].cmChapterIdx = chapterIdx = 1;
				chapterLast = this.maps[i].chapter;
			}
		}
	}

	coordFunc(func) {
		this.maps = this.maps.map(e => {
			e.triggers = e.triggers.map(e => {
				let name = e.slice(0, e.indexOf('"', 1) + 1);
				let args = e.slice(e.indexOf('"', 1) + 2).split(' ').map((e, f, g) => {
					let property = e.split('=');
					if (property.length > 1 && ['center', 'size', 'angle'].indexOf(property[0]) > -1) {
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
		return queryAPI(this.maps.filter(e => e.cmAvailability > -1).map(e => 
			'https://raw.githubusercontent.com/p2sr/portal2-mtriggers/master/' +
			(e.coop ? 'Coop/' : 'SP/') +
			e.chapter.toString().padStart(2, '0') + '_' + this.chapters[e.coop ? 'mp' : 'sp'][e.chapter - (e.coop ? 0 : 1)].toLowerCase().replaceAll(' ', '-') + '/' +
			e.cmChapterIdx.toString().padStart(2, '0') + '_' + e.splitname.toLowerCase().replaceAll(' ', '-') + '.cfg'
		)).then(e => {
			let count = e.length;
			for (let i = 0; i < count; i++) {
				let map = this.maps.filter(e => e.cmAvailability > -1)[i];
				map.triggers = e[i].split('\n').filter(e => 
					e.startsWith('sar_speedrun_cc_rule ')
				).map(e => e.replace('sar_speedrun_cc_rule ', ''));
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
		
		return queryAPI(this.maps.map(e =>
			`https://board.portal2.sr/chamber/${e.chamberID}/json`
		), r => r.json()
		).then(e => {
			for (let i = 0; i < e.length; i++) {
				let scores = [];
				for (let key in e[i]) {
					if (e[i].hasOwnProperty(key)) {
						let j = e[i][key];
						j.scoreData.steamID = key;
						scores.push(j);
					}
				}
				this.maps[i].cmboard = scores.map(e => {
					e.scoreData.runner = e.userData.boardname;
					e = e.scoreData;
					e.date = e.date == null ? null : new Date(e.date.replaceAll('-', '/') + ' GMT+2'); // CEST, GMT + 2 hours
					e.hasDemo = e.hasDemo == '1';
					if (e.hasDemo) e.demoID = e.changelogId;
					e.scoreRank = parseInt(e.scoreRank);
					e.score = parseInt(e.score) / 100;
					if (e.pending != '1') delete e.pending;
					if (!e.youtubeID) delete e.youtubeID;
					delete e.hasDemo;
					delete e.changelogId;
					delete e.playerRank;
					delete e.note;
					delete e.submission;
					return e;
				}).filter(e => !e.hasOwnProperty('pending'));
			}
			return this;
		});
	}

	formatWiki() {
		this.maps.map(e => e.formattedWiki = e.wikicontent.replaceAll('\n', '<br>'));
		for (let map of this.maps) {
			if (!map.wikicontent || map.wikicontent == '') continue;
			[map.formattedWiki, map.categories] = [[], []];
			let [pre, gallery] = [false];
			let lines = map.wikicontent.split('\n'), lineCount = lines.length;
			for (let i = 0; i < lineCount; i++) {
				let [bold, italic] = [false];

				while (lines[i].indexOf("'''") > -1) {
					lines[i] = lines[i].replace("'''", bold ? "</b>" : "<b>");
					bold = !bold;
				} // bolding

				while (lines[i].indexOf("''") > -1) {
					lines[i] = lines[i].replace("''", italic ? "</i>" : "<i>");
					italic = !italic;
				} // italics
				
				if (lines[i].startsWith(' ')) {
					lines[i] = lines[i].slice(1);
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
					let content = lines[i].slice(start, end + 2);
					if (content.startsWith('[[Category:')) {
						map.categories.push(lines[i].slice(start + 11, end));
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
					let content = lines[i].slice(start, end);
					let link = content.split(' ')[0].slice(1);
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
					inside = inside.join('\n').slice(2, -2), indent = 0;
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
					if (str != '') insideArgs.push(str);
					// do stuff with insideArgs
					switch (insideArgs[0]) {
						case 'P2_Video':
							// youtube embed
							break;
						case 'P2_Infobox':
							// page title
							map.formattedWiki.push(`<h1 class="p2title">${insideArgs[1]}</h1>`);
							break;
						case 'P2 Image':
							// image (no underscore for some reason)
							break;
					}

					continue;
				} // templates

				if (lines[i].startsWith('#')) {
					if (!lines[i - 1].startsWith('#')) map.formattedWiki.push('<ol>');
					map.formattedWiki.push(`<li>${lines[i].slice(1)}</li>`);
					if (!lines[i + 1].startsWith('#')) map.formattedWiki.push('</ol>');
					continue;
				} // ordered lists

				if (lines[i].startsWith('*')) {
					if (lines[i - 1] && !lines[i - 1].startsWith('*')) map.formattedWiki.push('<ul>');
					map.formattedWiki.push(`<li>${lines[i].slice(1)}</li>`);
					if (lines[i + 1] && !lines[i + 1].startsWith('*')) map.formattedWiki.push('</ul>');
					continue;
				} // unordered lists

				{
					let j = 0;
					while (lines[i][j] + trimmedLine[trimmedLine.length - j - 1] == '==') {j++;}
					if (j > 0) {
						map.formattedWiki.push(`<h${j}>${lines[i].slice(j, trimmedLine.length - j)}</h${j}>`);
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
				let args = e.slice(name.length + 3);
				args = args.replace(' action=stop', '');
				e = `${name}: ${args}`;

				if (P2Map.coop) {

					if (e == 'Flags 1: flags') {
						e = 'Flags:\n	[Blue]   finish player=0';
					} else if (e == 'Flags 2: flags "ccafter=Flags 1"') {
						e = '	[Orange] finish player=1';
					}

					if (name.endsWith(' Blue')) {
						e = e.replace(' Blue: ', ':\n	[Blue]   ');
					} else if (name.endsWith(' Orange')) {
						e = '	[Orange] ' + args;
					} else if (name.startsWith('Blue ')) {
						e = name.slice(5) + ':\n	[Blue]   ' + args;
					} else if (name.startsWith('Orange ')) {
						e = '	[Orange] ' + args;
					}
				}
				return e;
			}));
			console.log(mtriggers.join('\n'));
			zip.file(P2Map.filename + '.p2mtr', mtriggers.join('\n'));
		})
      	zip.saveAs("mtriggers.zip");
	}

	mapWithProperty(prop, val) {
		let found = this.maps.filter(e => e[prop] == val);
		return found[0] ? found[0] : undefined;
	}
}
