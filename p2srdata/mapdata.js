class MapFile {
	constructor(filename, splitname, chapter, coop, triggers, fade, wikicontent) {
		this.filename = filename;
		this.splitname = splitname;
		switch (this.splitname) {
			case 'Funnel Catch':
				this.wikiname = 'Funnel Catch (singleplayer)';
				break;
			case 'Funnel Catch Coop':
				this.wikiname = 'Funnel Catch';
				break;
			case 'Jailbreak':
				this.wikiname = 'Jail Break';
				break;
			default:
				this.wikiname = this.splitname;
				break;
		}
		this.chapter = parseInt(chapter);
		if (isNaN(this.chapter)) this.chapter = -1;
		this.coop = coop;
		this.triggers = triggers;
		this.fade = fade;
		this.wikicontent = wikicontent;
		this.cmNative = false;
	}

	selfStr(readable, includeWiki) {
		let temp = this.triggers.length > 0 ? '`' : '';
		let triggers = [];
		this.triggers.forEach(e => {if (!e.startsWith(`"Start"`) && !e.startsWith(`"Flags`)) triggers.push(`\`${e}\``)});

		if (readable) {
			triggers = (triggers.length > 0 ? "\n\t" : "") + triggers.join(",\n\t");
			return `new MapFile('${this.filename}', '${this.splitname}', ${this.chapter}, ${this.coop}, [${triggers}],\n\t\`${this.fade}\`${includeWiki ? `,\n\`${this.wikicontent}\``: ''})`;
		} else {
			triggers = triggers.join(",");
			return `new MapFile('${this.filename}','${this.splitname}',${this.chapter},${this.coop},[${triggers}],\`${this.fade}\`${includeWiki ? `,\`${this.wikicontent}\`` : ''})`;
		}
	}

	createMtriggerString() {
		return `
		sar_speedrun_cc_start "${this.splitname}" map=${this.filename} action=split
		${this.triggers.map(t => {return `sar_speedrun_cc_rule ${t}`}).join('\n')}
		sar_speedrun_cc_finish
		`.replaceAll("\t",""). trim();
	}

	pushTriggers(arr) {
		arr.forEach(e => this.triggers.push(e));
	}

	triggersFromTxt(txt) {
		this.triggers = [];
		for (let line of txt.split("\n")) {
			line = line.trim();
			if (line.startsWith('sar_speedrun_category_rule_create ')) this.triggers.push(line.substring(34));
			if (line.startsWith('sar_speedrun_cc_rule ')) this.triggers.push(line.substring(21));
			if (line.startsWith('"')) this.triggers.push(line);
		}
		this.addGenericTriggers();
		this.fixTriggers();
		return this.triggers;
	}

	addGenericTriggers() {
		if (this.triggers[0] != `"Start" load action=force_start`) this.triggers.splice(0, 0, `"Start" load action=force_start`);
		if (this.coop) {
			if (this.triggers[this.triggers.length - 1] != `"Flags 2" flags "ccafter=Flags 1" action=stop`) {
			this.triggers.push(`"Flags 1" flags`);
			this.triggers.push(`"Flags 2" flags "ccafter=Flags 1" action=stop`);
			}
		} else if (this.triggers[this.triggers.length - 1] != `"Flags" flags action=stop`) {
			this.triggers.push(`"Flags" flags action=stop`);
		}
	}

	removeGenericTriggers() {
		if (this.triggers[0] == `"Start" load action=force_start`) {this.triggers.splice(0,1)};
		if (this.triggers[this.triggers.length - 1] == `"Flags" flags action=stop`) {this.triggers.splice(this.triggers.length - 1, 1)};
		if (this.triggers[this.triggers.length - 1] == `"Flags 2" flags "ccafter=Flags 1" action=stop`) {this.triggers.splice(this.triggers.length - 1, 1)};
		if (this.triggers[this.triggers.length - 1] == `"Flags 1" flags`) {this.triggers.splice(this.triggers.length - 1, 1)};
	}

	fixTriggers() {
		for (let index in this.triggers) {
			let trigger = this.triggers[index];
			let name = trigger.substring(0, trigger.indexOf('"', 1) + 1);
			let args = trigger.substring(trigger.indexOf('"', 1) + 2).split(" ");
			for (let i = 1; i < args.length; i++) {
				let property = args[i].split("=");
				if (property.length > 0 && ["center", "size", "angle"].indexOf(property[0]) > -1) {
					let values = property[1].split(",");
					for (let j = 0; j < values.length; j++) {
						if (values[j].indexOf(".") > -1) {
							// remove trailing zeroes
							while (values[j].endsWith("0")) {
								values[j] = values[j].substring(0,values[j].length - 1);
							}
							if (values[j].endsWith(".")) {
								values[j] = values[j].substring(0,values[j].length - 1);
							}
						}
					}
					property[1] = values.join(",");
				}
				args[i] = property.join("=");
			}
			this.triggers[index] = name + " " + args.join(" ");
		}
	}
}

async function updateWikiData() {
	if (window.navigator.onLine) {
		// only get wikicontent if connected to internet
		await updateWikiContent();
	}
	for (let map of maps) {
		var lines = map.wikicontent.split('\n');
		map.formattedWiki = [];
		map.categories = [];
		for (let i = 0; i < lines.length; i++) {
			let bold = false, italic = false;
			while (lines[i].indexOf("'''") > -1) {
				lines[i] = lines[i].replace("'''", bold ? "</b>" : "<b>");
				bold = !bold;
			}
			while (lines[i].indexOf("''") > -1) {
				lines[i] = lines[i].replace("''", italic ? "</i>" : "<i>");
				italic = !italic;
			}

			let trimmedLine = lines[i].trim();

			if (trimmedLine.startsWith('[[Category:') && trimmedLine.endsWith(']]')) {
				map.categories.push(lines[i].substring(11, lines[i].length - 2));
				continue;
			} 
			if (trimmedLine.trim().startsWith('{{')) {
				let startI = i, inside = [], indent = 0, goneIn = false;
				while ((indent > 0 || !goneIn) && i < lines.length) {
					goneIn = true;
					indent += (lines[i].match(/\{\{/g) || []).length;
					indent -= (lines[i].match(/\}\}/g) || []).length;
					inside.push(lines[i].trim());
					i++;
				}
				i--
				inside = inside.join('\n'), indent = 0;
				inside = inside.substring(2, inside.length - 2);
				let insideArgs = [], str = "";
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
						let arr = insideArgs[3].split("\n");
						for (let i = 0; i < arr.length; i++) {
							if (arr[i].indexOf("Native to Challenge Mode") > -1) {
								let part = arr[i].split(" ");
								map.cmNative = part[part.length - 1] == "Yes";
							}
						}
						break;
					case 'P2 Image':
						// image (no underscore for some dumb fucking reason)
						break;
				}

				continue;
			}

			if (trimmedLine.startsWith('#')) {
				map.formattedWiki.push('<ol>');
				while (trimmedLine.startsWith('#') && i < lines.length) {
					map.formattedWiki.push(`<li>${trimmedLine.substring(1)}</li>`);
					i++;
					trimmedLine = lines[i].trim();
				}
				i--;
				map.formattedWiki.push('</ol>');
				continue;
			}

			if (trimmedLine.startsWith('*')) {
				map.formattedWiki.push('<ul>');
				while (trimmedLine.startsWith('*') && i < lines.length) {
					map.formattedWiki.push(`<li>${trimmedLine.substring(1)}</li>`);
					i++;
					trimmedLine = lines[i].trim();
				}
				i--;
				map.formattedWiki.push('</ul>');
				continue;
			}

			{
				let j = 0;
				while (trimmedLine[j] + trimmedLine[trimmedLine.length - j - 1] == '==') {j++;}
				if (j > 0) {
					map.formattedWiki.push(`<h${j}>${trimmedLine.substring(j, trimmedLine.length - j)}</h${j}>`);
					continue;
				}
			}
			map.formattedWiki.push(lines[i]);
		}
		map.formattedWiki = map.formattedWiki.join('<br>');
	}
}

async function updateWikiContent() {
	var titles = maps.map(e => {return e.wikiname});
	// maximum titles count is 50, split them into chunks
	for (let i = 0; i < titles.length; i += 50) {
		let titleChunk = titles.slice(i, i + 50).join("|");
		// api query from fucking hell. took me 2 hours to find the origin option
		let url = `https://wiki.portal2.sr/api.php?action=query&format=json&origin=*&prop=revisions&rvprop=content&rvslots=main&titles=${titleChunk}`;
		let time = new Date();
		let response = await queryAPI(url);
		console.log(`got wikitext for maps ${i}-${Math.min(maps.length - 1, i + 50)} (${formatBytes(response.length)}), took ${new Date() - time}ms`);
		let json = JSON.parse(response).query.pages;
		for (let key in json) {
			if (json.hasOwnProperty(key)) {
				let map = mapWithWikiName(json[key].title);
				map.wikicontent = "";
				if (json[key].hasOwnProperty("revisions")) {
					let txt = json[key].revisions[0].slots.main["*"];
					if (txt.startsWith("#REDIRECT")) {
						// can't be fucked doing this so YEET
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
}

async function updateMtriggers() {
	var titles = maps.map(e => {return `${e.coop ? "Coop/Course" : "SP/Chapter"}${e.chapter}/${e.filename}.cfg`}), count = 0;
	for (let i = 0; i < titles.length; i++) {
		// github good website, didn't take me 2 hours to figure out :D
		let url = `https://raw.githubusercontent.com/p2sr/portal2-mtriggers/master/${titles[i]}`;
		let time = new Date();
		let response = await queryAPI(url);
		if (response != "404 NOT FOUND") {
			let t = maps[i].triggersFromTxt(response);
			count++;
			// console.log(`got mtriggers for ${maps[i].wikiname} (${formatBytes(response.length)}), took ${new Date() - time}ms`);
			// console.log(t.join("\n"));
		} else {
			// probably a cutscene map
			maps[i].triggers = [];
		}
	}
	console.log(`got mtriggers for ${count} maps, ${titles.length - count} not found`);
}

function mapWithFileName(str) {
	for (let map of maps) if (map.filename == str) return map;
	return false;
}

function mapWithSplitName(str) {
	for (let map of maps) if (map.splitname == str) return map;
  	return false;
}

function mapWithWikiName(str) {
	for (let map of maps) if (map.wikiname == str) return map;
	return false;
}

function mapsFromChapter(chapter, isCoop) {
	var mapsInChapter = [];
	for (let map of maps) {
		if (map.coop == isCoop && map.chapter == chapter) {
			mapsInChapter.push(map);
		}
	}
	return mapsInChapter;
}

function addMaps() {
	maps.push(new MapFile('sp_a1_intro1', 'Container Ride', 1, false, [
		`"Room Trigger" entity targetname=relay_start_map inputname=Trigger`,
		`"Second Room" entity targetname=drop_box_rl inputname=Trigger`,
		`"Fizzler" entity targetname=departure_elevator-logic_source_elevator_door_open inputname=Trigger`,
		`"End" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable`],
		`in a dire e[mer]gency`));
	maps.push(new MapFile('sp_a1_intro2', 'Portal Carousel', 1, false, [
		`"Cube Room" zone center=-31.50,415.97,-12.66 size=66.80,0.00,102.39 angle=0.00`,
		`"Button Room" zone center=-429.57,511.69,-11.92 size=36.80,64.07,110.17 angle=0.00`,
		`"Ending Room" zone center=-699.63,96.04,-3.06 size=8.68,64.14,107.93 angle=0.00`,
		`"Elevator Entry" zone center=-319.62,624.13,-0.38 size=127.17,30.40,127.17 angle=0.00`,
		`"End" entity targetname=departure_elevator-close inputname=Trigger`],
		`Aperture Science Reintegration [As]sociate`));
	maps.push(new MapFile('sp_a1_intro3', 'Portal Gun', 1, false, [
		`"Drop Trigger" entity targetname=podium_collapse inputname=EnableRefire`,
		`"Portal Entry" zone center=94.68,2260.19,-192.30 size=103.55,70.96,127.34 angle=0.00`,
		`"Orange Portal Trigger" entity targetname=room_1_portal_deactivate_rl inputname=Trigger`,
		`"Door Trigger" entity targetname=door_3-proxy inputname=OnProxyRelay2`],
		`I'm just gonna [wait] for you up ahead`));
	maps.push(new MapFile('sp_a1_intro4', 'Smooth Jazz', 1, false, [
		`"Dropper Trigger" entity targetname=logic_drop_box inputname=Trigger`,
		`"Second Room" entity targetname=info_sign-proxy inputname=OnProxyRelay1`,
		`"Cube Fizzle" entity targetname=section_2_box_2 inputname=Dissolve`,
		`"Trap Room" entity targetname=room_2_portal_deactivate_rl inputname=Trigger`,
		`"Door Trigger" entity targetname=door_2-proxy inputname=OnProxyRelay2`],
		``));
	maps.push(new MapFile('sp_a1_intro5', 'Cube Momentum', 1, false, [
		`"Portal Trigger" entity targetname=room_1_portal_activate_rl inputname=Trigger`,
		`"Button Press" entity targetname=cube_dropper_2-proxy inputname=OnProxyRelay1`,
		`"Door" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger`],
		`Personality [constructs] will remain`));
	maps.push(new MapFile('sp_a1_intro6', 'Future Starter', 1, false, [
		`"Portal Trigger" entity targetname=room_1_fling_portal_activate_rl inputname=Trigger`,
		`"Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2`,
		`"Second Room" entity targetname=music.sp_a1_intro6 inputname=PlaySound`,
		`"Second Button Activation" entity targetname=button_2-proxy inputname=OnProxyRelay2`],
		`Please [return] to your primitive tribe`));
	maps.push(new MapFile('sp_a1_intro7', 'Secret Panel', 1, false, [
		`"Door Passthrough" entity targetname=ceiling_drips_2_particles inputname=Start`,
		`"Transition Trigger" entity targetname=transition_airlock_door_close_rl inputname=Trigger`],
		``));
	maps.push(new MapFile('sp_a1_wakeup', 'Wakeup', 1, false, [
		`"Door Trigger" entity targetname=training_door inputname=Open`,
		`"Drop" entity targetname=light_dynamic_basement inputname=TurnOn`,
		`"Elevator" entity targetname=basement_breakers_entrance_door inputname=Close`],
		``));
	maps.push(new MapFile('sp_a2_intro', 'Incinerator', 1, false, [
		`"Incinerator Room" entity targetname=chute_1_relay inputname=Trigger`,
		`"Mid Room" entity targetname=incinerator_portal inputname=SetFadeEndDistance`,
		`"Portal Gun Grab" entity targetname=pickup_portalgun_relay inputname=Trigger`],
		`Testing for the [rest] of your life`));
	maps.push(new MapFile('sp_a2_laser_intro', 'Laser Intro', 2, false, [
		`"Door Trigger" entity targetname=start inputname=Trigger`,
		`"Door Entry" entity targetname=door_0-proxy inputname=OnProxyRelay2`,
		`"Elevator Trigger" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger`,
		`"Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable`],
		``));
	maps.push(new MapFile('sp_a2_laser_stairs', 'Laser Stairs', 2, false, [
		`"Dropper Trigger" entity targetname=cube_dropper_01-proxy inputname=OnProxyRelay1`,
		`"Button Activation" entity targetname=exit_button-proxy inputname=OnProxyRelay2`],
		`That's what it says: a [horrible] person`));
	maps.push(new MapFile('sp_a2_dual_lasers', 'Dual Lasers', 2, false, [
		`"Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2`,
		`"Switch Glitch" entity targetname=room_2_check_2_activated_relay inputname=Trigger`],
		`Emerge from suspension terribly [undernourished]`));
	maps.push(new MapFile('sp_a2_laser_over_goo', 'Laser Over Goo', 2, false, [
		`"Panels Trigger" entity targetname=InstanceAuto69-corridor_repair-proxy inputname=OnProxyRelay1`,
		`"Door Trigger" entity targetname=door_1-proxy inputname=OnProxyRelay2`,
		`"Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1`,
		`"Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay1`],
		``));
	maps.push(new MapFile('sp_a2_catapult_intro', 'Catapult Intro', 2, false, [
		`"Cube Push" entity targetname=hallway_sim_go inputname=Trigger`,
		`"Catapult Trigger" entity targetname=catapult_target_relay inputname=Trigger`,
		`"Second Catapult Trigger5" entity targetname=launch_sound2b inputname=PlaySound`,
		`"Wall Portal" zone center=-32.28,-1382.97,-159.77 size=448.43,113.99,320.45 angle=0.00`,
		`"Door Passthrough" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger`,
		`"Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable`],
		`Room full of fair [for] the rest of your life`));
	maps.push(new MapFile('sp_a2_trust_fling', 'Trust Fling', 2, false, [
		`"Panels Trigger" entity targetname=wall_panel_1-proxy inputname=OnProxyRelay1`,
		`"Catapult Trigger" entity targetname=flingroom_1_circular_catapult_1_wav_1 inputname=PlaySound`,
		`"Button Press" zone center=-107.03,-832.06,383.40 size=41.87,255.82,254.02 angle=0.00`,
		`"Portal Passthrough" entity targetname=first_press_relay inputname=Trigger`,
		`"Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2`],
		``));
	maps.push(new MapFile('sp_a2_pit_flings', 'Pit Flings', 2, false, [
		`"Room Entry" entity targetname=player_in_pit_branch inputname=SetValue`,
		`"Platform Entry" entity targetname=exit_ledge_player_clip inputname=Kill`,
		`"End Door" entity targetname=SAVE_CUBE inputname=FireEvent`],
		``));
	maps.push(new MapFile('sp_a2_fizzler_intro', 'Fizzler Intro', 2, false, [
		`"Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2`,
		`"Panels Trigger" entity targetname=light_shadowed_01 inputname=TurnOn`,
		`"Laser Receiver" entity targetname=@exit_door-proxy inputname=OnProxyRelay2`],
		``));
	maps.push(new MapFile('sp_a2_sphere_peek', 'Ceiling Catapult', 3, false, [
		`"Laser Receiver" entity targetname=@exit_door-proxy inputname=OnProxyRelay2`],
		``));
	maps.push(new MapFile('sp_a2_ricochet', 'Ricochet', 3, false, [
		`"Door Trigger" entity targetname=entry_music inputname=PlaySound`,
		`"Cube Area" entity targetname=juggled_cube_music inputname=PlaySound`,
		`"Catapult Trigger" entity targetname=floor_catapult_1_sound inputname=PlaySound`,
		`"Ending Area" zone center=3357.70,1088.05,-63.97 size=123.03,383.85,895.99 angle=0.00`],
		`I [did] see some humans`));
	maps.push(new MapFile('sp_a2_bridge_intro', 'Bridge Intro', 3, false, [
		`"Door Trigger" entity targetname=door_52-proxy inputname=OnProxyRelay2`,
		`"Button Press" entity targetname=autosave inputname=SaveDangerous`,
		`"Cube Portal Passthrough" entity targetname=box_dropper_01-proxy inputname=OnProxyRelay1`,
		`"Player Portal Passthrough" zone center=756.05,63.97,-385.04 size=23.84,127.87,253.99 angle=0.00`,
		`"End Wall" zone center=192.03,560.02,128.30 size=127.88,31.91,254.69 angle=0.00`],
		`Did you guess 'sharks'? Because [that's] wrong`));
	maps.push(new MapFile('sp_a2_bridge_the_gap', 'Bridge The Gap', 3, false, [
		`"Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2`,
		`"Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1`,
		`"Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2`],
		`There's lots of room [here]`));
	maps.push(new MapFile('sp_a2_turret_intro', 'Turret Intro', 3, false, [
		`"Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2`,
		`"Door Passthrough" entity targetname=aud_VFX.LightFlicker inputname=PlaySound`,
		`"First Portal" zone center=587.40,-1697.66,-75.02 size=22.61,130.61,105.89 angle=0.00`,
		`"Second Portal" zone center=640.03,-1262.09,-64.10 size=128.01,28.11,127.27 angle=0.00`,
		`"Floor Portal" zone center=1071.63,-1311.99,-116.33 size=160.02,127.95,23.27 angle=0.00`,
		`"Cube Room Entry" zone center=332.35,-896.12,128.29 size=24.63,191.52,255.35 angle=0.00`,
		`"Cube Room Wall" zone center=927.96,-972.34,127.68 size=447.37,39.25,255.30 angle=0.00`,
		`"Ending Room" zone center=1131.03,-192.36,127.65 size=41.88,382.56,255.23 angle=0.00`],
		``));
	maps.push(new MapFile('sp_a2_laser_relays', 'Laser Relays', 3, false, [
		`"Floor Panels Trigger" entity targetname=animset01_start_rl inputname=Trigger`,
		`"Laser Switch Glitch" entity targetname=relay3_powered_branch inputname=SetValue`,
		`"Door Entry" zone center=-320.25,-1071.59,63.66 size=127.88,32.77,127.25 angle=0.00`],
		`Technically, it's a [medical] experiment`));
	maps.push(new MapFile('sp_a2_turret_blocker', 'Turret Blocker', 3, false, [
		`"Door Trigger" entity targetname=info_sign-proxy inputname=OnProxyRelay1`,
		`"Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay9`],
		`A man [and] a woman`));
	maps.push(new MapFile('sp_a2_laser_vs_turret', 'Laser Vs Turret', 3, false, [
		`"OOB" zone center=153.49,-234.07,540.65 size=178.91,159.90,87.15 angle=0.00`,
		`"Lower Landing" zone center=336.95,-264.22,287.42 size=61.89,111.50,122.08 angle=0.00`,
		`"Re-Entry" zone center=360.34,-359.72,135.35 size=303.26,81.36,46.63 angle=0.00`],
		`[second high note]`));
	maps.push(new MapFile('sp_a2_pull_the_rug', 'Pull The Rug', 3, false, [
		`"Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2`,
		`"Room Entry" entity targetname=change_to_error_state_02 inputname=Trigger`,
		`"Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2`,
		`"Lift Peak" entity targetname=@elevator_turret_waterfall_rl inputname=Trigger`],
		`After all [these] years`));
	maps.push(new MapFile('sp_a2_column_blocker', 'Column Blocker', 4, false, [
		`"Cutscene Trigger" entity targetname=blackout_lights_off_fade inputname=Fade`,
		`"Observation Room" zone center=-848.50,-33.10,352.35 size=126.94,61.49,190.99 angle=0.00`],
		``));
	maps.push(new MapFile('sp_a2_laser_chaining', 'Laser Chaining', 4, false, [
		`"Door Entry" entity targetname=music.sp_a2_laser_chaining_b1 inputname=PlaySound`,
		`"Wall Portal" zone center=-367.28,-637.15,640.20 size=33.38,377.50,255.54 angle=0.00`,
		`"Door Activation" entity targetname=relay_02_indicator inputname=Check`,
		`"Catapult" zone center=548.04,63.63,-11.47 size=151.87,142.84,104.99 angle=0.00`],
		``));
	maps.push(new MapFile('sp_a2_triple_laser', 'Triple Laser', 4, false, [
		`"Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2`,
		`"Portal Entry" zone center=7197.16,-5336.25,137.26 size=58.26,123.87,237.42 angle=0.00`,
		`"Switch Glitch" entity targetname=@exit_door-testchamber_door inputname=Open`],
		`Look at things objectively, [see] what you don't need`));
	maps.push(new MapFile('sp_a2_bts1', 'Jailbreak', 4, false, [
		`"First Portal Entry" zone center=-9743.78,-479.05,449.45 size=96.38,126.04,129.56 angle=0.00`,
		`"Railing" zone center=-2825.00,-1679.50,45.00 size=62.00,297.00,110.00 angle=0.00`,
		`"Stairboost" zone center=-465.07,-635.72,72.00 size=118.08,161.22,239.94 angle=0.00`,
		`"Last Corner" zone center=818.00,-989.00,-11.00 size=68.00,132.00,106.00 angle=0.00`],
		``));
	maps.push(new MapFile('sp_a2_bts2', 'Escape', 4, false, [
		`"Turret Trigger" entity targetname=player_clip inputname=Enable`,
		`"Portal Passthrough" entity targetname=first_turret_arena_music_stop inputname=Trigger`,
		`"Stars" entity targetname=destruction_flashlight_o1 inputname=TurnOn`],
		``));
	maps.push(new MapFile('sp_a2_bts3', 'Turret Factory', 5, false, [
		`"Landing" entity targetname=lookat_entryhall_target_rl inputname=Trigger`,
		`"Brown Conveyor" zone center=6913.03,884.54,185.12 size=253.88,150.73,77.71 angle=0.00`,
		`"Railing" entity targetname=lookat_drop_to_panel_ride_rl inputname=Trigger`,
		`"Tube Room Drop" entity targetname=laser_cutter_room_kill_relay inputname=Trigger`,
		`"Portal Room" entity targetname=@music_sp_a2_bts3_b3 inputname=StopSound`,
		`"Panels" entity targetname=spirarooml_areaportal inputname=SetFadeEndDistance`,
		`"End Room" entity targetname=@music_sp_a2_bts3_b5 inputname=PlaySound`],
		``));
	maps.push(new MapFile('sp_a2_bts4', 'Turret Sabotage', 5, false, [
		`"Second Conveyor" entity targetname=light_01 inputname=TurnOn`,
		`"Second Room" entity targetname=proxy inputname=OnProxyRelay1`,
		`"Hallway" entity targetname=dim_wheatley_flashlight inputname=Enable`,
		`"Classroom" entity targetname=lookat_fair_doorway_relay inputname=Trigger`,
		`"Rubble Room" entity targetname=@music_sp_a2_bts4_b3 inputname=StopSound`],
		``));
	maps.push(new MapFile('sp_a2_bts5', 'Neurotoxin Sabotage', 5, false, [
		`"Door Trigger" entity targetname=airlock_door_01-proxy inputname=OnProxyRelay1`,
		`"Airlock Room" entity targetname=airlock_door_01-proxy inputname=OnProxyRelay3`,
		`"Lift" entity targetname=lift_blocker inputname=Enable`,
		`"Button Press" entity targetname=button_relay inputname=Trigger`],
		``));
	maps.push(new MapFile('sp_a2_bts6', 'Tube Ride', 5, false, [],
		``));
	maps.push(new MapFile('sp_a2_core', 'Core', 5, false, [
		`"First Room" entity targetname=music_sp_a2_core_b1 inputname=PlaySound`,
		`"Door Trap" entity targetname=rv_trap_fake_door_handle inputname=open`,
		`"Vault" entity targetname=rv_player_clip inputname=Kill`,
		`"Button Press" entity targetname=button_press_relay inputname=Trigger`,
		`"Cutscene Activation" entity targetname=begin_core_swap_relay inputname=Trigger`,
		`"Lift Cutscene Trigger" entity targetname=elevator_exit_door_close_relay inputname=Trigger`],
		``));
	maps.push(new MapFile('sp_a3_00', 'Long Fall', 6, false, [],
		``));
	maps.push(new MapFile('sp_a3_01', 'Underground', 6, false, [
		`"Second Portal Passthrough" entity targetname=ambient_sp_a3_01_b3 inputname=PlaySound`,
		`"Catwalk" entity targetname=helper_01 inputname=Disable`,
		`"Ravine" entity targetname=ambient_sp_a3_01_b5 inputname=PlaySound`,
		`"Long Shot Portal" zone center=4879.93,4269.74,-509.76 size=127.23,132.32,68.42 angle=0.00`,
		`"First Button Press" entity targetname=timer2b-TimerStart inputname=OnProxyRelay1`,
		`"Second Button Press" entity targetname=timer1b-TimerStart inputname=OnProxyRelay2`],
		``));
	maps.push(new MapFile('sp_a3_03', 'Cave Johnson', 6, false, [
		`"Catwalk Portal Entry" zone center=-6107.50,279.05,-4800.82 size=72.95,300.99,382.31 angle=0.00`,
		`"Portal Stand" zone center=-4976.03,1113.87,-2644.60 size=103.94,37.67,138.07 angle=0.00`],
		``));
	maps.push(new MapFile('sp_a3_jump_intro', 'Repulsion Intro', 6, false, [
		`"Lights Trigger" entity targetname=@dark_column_flicker_start inputname=Trigger`,
		`"First Room" entity targetname=ambient_sp_a3_jump_intro_b1 inputname=PlaySound`,
		`"Dropper Activation" entity targetname=room_1_cube_dropper-proxy inputname=OnProxyRelay1`,
		`"Second Floor" zone center=-1172.30,1152.00,1311.71 size=168.45,255.94,254.77 angle=0.00`,
		`"Last Portal Passthrough" zone center=-1631.89,797.21,1634.26 size=162.59,58.36,157.63 angle=0.00`],
		`Here's some advice the lab boys gave me [*] do not`));
	maps.push(new MapFile('sp_a3_bomb_flings', 'Bomb Flings', 6, false, [
		`"Railing" zone center=-256.10,335.97,-1281.08 size=255.42,351.87,253.79 angle=0.00`,
		`"Gel Drop" entity targetname=trigger_to_drop inputname=Trigger`],
		`Slight chance the [calcium] could harden`));
	maps.push(new MapFile('sp_a3_crazy_box', 'Crazy Box', 6, false, [
		`"First Room" entity targetname=ambient_sp_a3_crazy_box_b1 inputname=PlaySound`,
		`"2" entity targetname=achievement_crazy_box_entity inputname=Kill`],
		`Invent a special safety [door] that won't hit you`));
	maps.push(new MapFile('sp_a3_transition01', 'PotatOS', 6, false, [
		`"Door" entity targetname=pumproom_door_bottom_button inputname=Lock`,
		`"Lever" entity targetname=pump_machine_relay inputname=trigger`,
		`"Second Door" entity targetname=pumproom_door_top_button inputname=Lock`,
		`"Lone Panel" entity targetname=music_sp_a3_transition01_b4 inputname=PlaySound`],
		``));
	maps.push(new MapFile('sp_a3_speed_ramp', 'Propulsion Intro', 7, false, [
		`"Ending Portal Entry" zone center=-38.72,-639.96,896.17 size=58.49,127.75,127.29 angle=0.00`],
		`With your help, we're gonna change [the] world`));
	maps.push(new MapFile('sp_a3_speed_flings', 'Propulsion Flings', 7, false, [
		`"Blue Gel Bounce" zone center=2815.60,-109.17,-303.28 size=192.37,153.96,97.37 angle=0.00`,
		`"Ramp" zone center=3358.64,1153.00,127.56 size=61.32,253.94,378.90 angle=0.00`],
		`I mentioned earlier. [Again]: all you gotta do`));
	maps.push(new MapFile('sp_a3_portal_intro', 'Conversion Intro', 7, false, [
		`"First Room" entity targetname=1970s_door1door_lower inputname=Close`,
		`"Balcony" entity targetname=1970s_door2_door_lower inputname=Close`,
		`"Door Trigger" entity targetname=highdoor_door_upper inputname=Open`,
		`"Second Door Open" entity targetname=liftshaft_entrance_door-door_open inputname=Trigger`],
		``));
	maps.push(new MapFile('sp_a3_end', 'Three Gels', 7, false, [
		`"Fling" zone center=-1105.75,256.12,-3879.90 size=99.12,191.69,127.73 angle=0.00`,
		`"Ending Fling" entity targetname=helper01 inputname=Disable`],
		``));
	maps.push(new MapFile('sp_a4_intro', 'Test', 8, false, [
		`"Start Dialogue" zone center=-992.00,-480.00,320.00 size=128.00,128.00,192.00 angle=0.00`,
		`"Cube Throw" entity targetname=@exit_door1-player_in_door_trigger inputname=Enable`,
		`"Enter Elevator" entity targetname=test_chamber1_slow_relay inputname=Trigger`,
		`"First Solve" entity targetname=@exit_door2-proxy inputname=OnProxyRelay1`,
		`"Trigger Elevator" entity targetname=departure_elevator-logic_source_elevator_door_open inputname=Trigger`,
		`"Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable`],
		`Paradox idea didn't work. [And] it almost killed me`));
	maps.push(new MapFile('sp_a4_tb_intro', 'Funnel Intro', 8, false, [
		`"First Room" entity targetname=arrival_elevator-signs_off inputname=Trigger`,
		`"Zone" zone center=2015.92,733.66,-258.67 size=64.10,580.63,506.26 angle=0.00`,
		`"Reportal" zone center=1312.19,384.22,415.43 size=64.33,256.38,253.77 angle=0.00`,
		`"Door Activation" entity targetname=button_1_pressed inputname=Trigger`],
		`The good [news] is... well, none so far`));
	maps.push(new MapFile('sp_a4_tb_trust_drop', 'Ceiling Button', 8, false, [
		`"Drop" entity targetname=music3 inputname=PlaySound`,
		`"Button Press" entity targetname=dropper-proxy inputname=OnProxyRelay1`,
		`"Door Activation" entity targetname=button_1-proxy inputname=OnProxyRelay5`],
		`I knew we're in a lot [of] trouble`));
	maps.push(new MapFile('sp_a4_tb_wall_button', 'Wall Button', 8, false, [
		`"Chamber Movement" entity targetname=relay_pre_chamber_move inputname=Trigger`,
		`"Button Press" entity targetname=func_brush_indicators_orange inputname=Enable`,
		`"End Area" entity targetname=trigger_solve_warning inputname=Enable`],
		`Oh no... [*] it's happening sonner than I expected`));
	maps.push(new MapFile('sp_a4_tb_polarity', 'Polarity', 8, false, [
		`"Panels Trigger" entity targetname=falling_tile_1_relay inputname=Trigger`],
		``));
	maps.push(new MapFile('sp_a4_tb_catch', 'Funnel Catch', 8, false, [
		`"Door Entry" entity targetname=light_shadowed_01 inputname=TurnOn`,
		`"Button Press" entity targetname=indicator_lights_flicker_rl inputname=Trigger`,
		`"Door Activation" entity targetname=puzzle_completed_relay inputname=Trigger`],
		`Can get a little... [unbearable]`));
	maps.push(new MapFile('sp_a4_stop_the_box', 'Stop The Box', 8, false, [
		`"Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1`,
		`"Door Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2`],
		`No. [No]. That was the solution`));
	maps.push(new MapFile('sp_a4_laser_catapult', 'Laser Catapult', 8, false, [
		`"Test Start" entity targetname=diag_laser_catapult_test_start inputname=Trigger`,
		`"Floor Portal Passthrough" zone center=-255.88,-319.92,40.65 size=127.91,127.98,65.24 angle=0.00`],
		`Maintain any of the [crucial] functions required`));
	maps.push(new MapFile('sp_a4_laser_platform', 'Laser Platform', 8, false, [
		`"Button Press" entity targetname=box_drop_relay inputname=Trigger`,
		`"Door Activation" entity targetname=exit_check inputname=Check`],
		``));
	maps.push(new MapFile('sp_a4_speed_tb_catch', 'Propulsion Catch', 8, false, [
		`"Chamber Trigger" zone center=-608.05,1675.93,-127.98 size=287.79,104.09,127.98 angle=0.00`,
		`"Ramp" zone center=-977.54,1322.84,153.57 size=48.93,362.86,193.93 angle=0.00`],
		`Gonna love it, to [*] death`));
	maps.push(new MapFile('sp_a4_jump_polarity', 'Repulsion Polarity', 8, false, [
		`"Pipe Trigger" entity targetname=diag_jump_polarity_sorry inputname=Trigger`,
		`"Portal Exit" zone center=1423.97,1023.87,448.36 size=32.00,127.58,128.49 angle=0.00`],
		`He's got a surprise [for] us`));
	maps.push(new MapFile('sp_a4_finale1', 'Finale 1', 9, false, [
		`"Catapult Trigger" entity targetname=launch_sound1 inputname=PlaySound`,
		`"Second Catapult Trigger" entity targetname=music03 inputname=PlaySound`,
		`"Door Trigger" entity targetname=liftshaft_airlock_exit-proxy inputname=OnProxyRelay1`,
		`"Second Portal Passthrough" entity targetname=music06 inputname=PlaySound`],
		``));
	maps.push(new MapFile('sp_a4_finale2', 'Finale 2', 9, false, [
		`"Chamber Trigger" entity targetname=shake_chamber_move inputname=StartShake`,
		`"Door Trigger" entity targetname=walkway_push inputname=Disable`,
		`"Second Door Trigger" entity targetname=bts_door_2-proxy inputname=OnProxyRelay1`,
		`"Last Room" entity targetname=light_shadowed_05 inputname=TurnOn`],
		``));
	maps.push(new MapFile('sp_a4_finale3', 'Finale 3', 9, false, [
		`"Button Press" entity targetname=bomb_1_button_relay inputname=Trigger`,
		`"Pipe Burst" entity targetname=practice_paint_sprayer inputname=Start`,
		`"Door Trigger" entity targetname=airlock_door2_brush inputname=Disable`,
		`"Gel Portal Entry" entity targetname=light_shadowed_02 inputname=TurnOn`,
		`"Funnel" entity targetname=column_smash_a inputname=SetAnimation`,
		`"End Door Trigger" entity targetname=door_lair-proxy inputname=OnProxyRelay1`],
		``));
	maps.push(new MapFile('sp_a4_finale4', 'Finale 4', 9, false, [
		`"Elevator" entity targetname=breaker_socket_button inputname=Kill`,
		`"Space Core" entity targetname=socket1_sprite_kill_relay inputname=Trigger`,
		`"Rick" entity targetname=socket2_sprite_kill_relay inputname=Trigger`,
		`"Fact Core" entity targetname=socket3_sprite_kill_relay inputname=Trigger`],
		``));
	maps.push(new MapFile('mp_coop_start', 'Calibration', 0, true, [],
		``));
	maps.push(new MapFile('mp_coop_doors', 'Doors', 1, true, [
		`"Zone" zone center=-10272.05,-574.78,64.15 size=127.90,61.50,127.99 angle=0.00`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		``));
	maps.push(new MapFile('mp_coop_race_2', 'Buttons', 1, true, [
		`"Mid Room Blue" entity targetname=entry_airlock-relay_blue_in inputname=Trigger`,
		`"Mid Room Orange" entity targetname=entry_airlock-relay_orange_in inputname=Trigger`,
		`"Dot Button" entity targetname=timer_1 inputname=Start`,
		`"Moon Button" entity targetname=timer_2 inputname=Start`,
		`"Triangle Button" entity targetname=timer_3 inputname=Start`,
		`"X Button" entity targetname=timer_4 inputname=Start`,
		`"Door Activation" entity targetname=button_ball-proxy inputname=OnProxyRelay2`],
		``));
	maps.push(new MapFile('mp_coop_laser_2', 'Lasers', 1, true, [
		`"Mid Room Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger`,
		`"Mid Room Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger`,
		`"Stairs" entity targetname=ramp_up_relay1 inputname=Trigger`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`One of you is doing very [v]ery well`));
	maps.push(new MapFile('mp_coop_rat_maze', 'Rat Maze', 1, true, [
		`"Maze" entity targetname=blue_player_points_rl inputname=Enable`,
		`"End Portal" zone center=-254.71,-223.75,-416.04 size=66.51,127.81,127.51 angle=0.00`,
		`"Door Activation" entity targetname=@exit_door inputname=Open`],
		`Reflected in your final [sc]ore`));
	maps.push(new MapFile('mp_coop_laser_crusher', 'Laser Crusher', 1, true, [
		`"End Hop" zone center=2630.95,-1135.87,80.33 size=77.85,287.33,161.40 angle=0.00`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`Not just flattery, you are gre[a]t at science`));
	maps.push(new MapFile('mp_coop_teambts', 'Behind The Scenes', 1, true, [
		`"Lever 1" entity targetname=lever_1-proxy inputname=OnProxyRelay3`,
		`"Lever 2" entity targetname=lever_2-proxy inputname=OnProxyRelay3`],
		``));
	maps.push(new MapFile('mp_coop_fling_3', 'Flings', 2, true, [
		`"Blue Start" zone center=223.69,911.99,288.00 size=64.44,415.94,319.94 angle=0.00 player=0`,
		`"Orange Start" zone center=223.69,911.99,288.00 size=64.44,415.94,319.94 angle=0.00 player=1`,
		`"Middle Trigger Blue" entity targetname=airlock_2-relay_blue_in inputname=Trigger`,
		`"Middle Trigger Orange" entity targetname=airlock_2-relay_orange_in inputname=Trigger`,
		`"Wall Portal Exit" zone center=297.39,-384.02,704.00 size=41.16,127.86,127.93 angle=0.00`,
		`"Door Activation" entity targetname=button_ball-proxy inputname=OnProxyRelay2`],
		`Exactly fit an edgeless safet[y] cube`));
	maps.push(new MapFile('mp_coop_infinifling_train', 'Infinifling', 2, true, [
		`"Button" entity targetname=panel_fling_wall_timer inputname=Start`,
		`"End Area" entity targetname=manager_opendoor inputname=SetStateBTrue`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`Must be very, very prou[d]`));
	maps.push(new MapFile('mp_coop_come_along', 'Team Retrieval', 2, true, [
		`"Panels" entity targetname=button1-proxy inputname=OnProxyRelay1`,
		`"Sphere Button" entity targetname=trigger_slimeroom_drop_ball-proxy inputname=OnProxyRelay1`,
		`"Floor Portal" zone center=1023.93,1696.03,-352.00 size=127.74,127.57,155.94 angle=0.00`,
		`"Door Activation" entity targetname=button2-proxy inputname=OnProxyRelay1`],
		``));
	maps.push(new MapFile('mp_coop_fling_1', 'Vertical Flings', 2, true, [
		`"Portal Entry" zone center=607.94,63.93,-123.93 size=127.81,127.80,68.05 angle=0.00`,
		`"Button 1" entity targetname=race_button_1_checkmark inputname=Start`,
		`"Button 2" entity targetname=race_button_2_checkmark inputname=Start`,
		`"Door Activation" entity targetname=ball_button-proxy inputname=OnProxyRelay2`],
		``));
	maps.push(new MapFile('mp_coop_catapult_1', 'Catapults', 2, true, [
		`"Catapult" entity targetname=catapult_3-proxy inputname=OnProxyRelay3`,
		`"Re-Entry" zone center=830.52,288.26,511.57 size=252.98,190.40,127.08 angle=0.00`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		``));
	maps.push(new MapFile('mp_coop_multifling_1', 'Multifling', 2, true, [
		`"Mid Room Door" entity targetname=button2-proxy inputname=OnProxyRelay2`,
		`"Mid Room Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger`,
		`"Mid Room Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger`,
		`"Cube Button" entity targetname=dropper2-proxy inputname=OnProxyRelay1`,
		`"Catapult" entity targetname=cat4-proxy inputname=OnProxyRelay1`,
		`"Door Activation" entity targetname=button3-proxy inputname=OnProxyRelay2`],
		`Looming consequence of [death]`));
	maps.push(new MapFile('mp_coop_fling_crushers', 'Fling Crushers', 2, true, [
		`"Door Activaton" entity targetname=transition_exit_doorway_1 inputname=Open`,
		`"Catapult" entity targetname=faithplate_crushers-proxy inputname=OnProxyRelay3`,
		`"Wall Button" entity targetname=relay_crusher_timer_close_solve inputname=Trigger`,
		`"Door Button" entity targetname=transition_exit_doorway_2 inputname=Open`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`Earned a break [from] the official testing courses`));
	maps.push(new MapFile('mp_coop_fan', 'Industrial Fan', 2, true, [],
		``));
	maps.push(new MapFile('mp_coop_wall_intro', 'Cooperative Bridges', 3, true, [
		`"Starting Wall" zone center=-95.84,-2366.62,-255.72 size=191.61,130.69,254.67 angle=0.00`,
		`"Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger`,
		`"Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger`,
		`"Catapult" entity targetname=faith_plate-proxy inputname=OnProxyRelay3`,
		`"Door Activation" entity targetname=button-proxy inputname=OnProxyRelay2`],
		`Let me give you a cl[ue]`));
	maps.push(new MapFile('mp_coop_wall_2', 'Bridge Swap', 3, true, [
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`Testing track hall of fame for tha[t]`));
	maps.push(new MapFile('mp_coop_catapult_wall_intro', 'Fling Block', 3, true, [
		`"Sphere Button" entity targetname=@cube_dropper inputname=Trigger`,
		`"Middle Door" entity targetname=button-proxy inputname=OnProxyRelay1`,
		`"Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger`,
		`"Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`For completing this test, a reward for [t]esting`));
	maps.push(new MapFile('mp_coop_wall_block', 'Catapult Block', 3, true, [
		`"Middle Trigger Blue" entity targetname=relay_blue_in inputname=Trigger`,
		`"Middle Trigger Orange" entity targetname=relay_orange_in inputname=Trigger`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`Described it as impossible, dead[ly], cruel`));
	maps.push(new MapFile('mp_coop_catapult_2', 'Bridge Fling', 3, true, [
		`"Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger`,
		`"Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`To not reassemble you. He refu[s]ed`));
	maps.push(new MapFile('mp_coop_turret_walls', 'Turret Walls', 3, true, [
		`"Middle Trigger Blue" entity targetname=last_airlock-relay_blue_in inputname=Trigger`,
		`"Middle Trigger Orange" entity targetname=last_airlock-relay_orange_in inputname=Trigger`,
		`"Sphere Button" entity targetname=trigger_slimeroom_drop_ball-proxy inputname=OnProxyRelay1`,
		`"Door Activation" entity targetname=button-proxy inputname=OnProxyRelay2`],
		`Reconfigured it from my original [p]lans`));
	maps.push(new MapFile('mp_coop_turret_ball', 'Turret Assassin', 3, true, [
		`"Catapult" entity targetname=faith_plate_player-proxy inputname=OnProxyRelay3`,
		`"Middle Trigger Blue" entity targetname=airlock-relay_blue_in inputname=Trigger`,
		`"Middle Trigger Orange" entity targetname=airlock-relay_orange_in inputname=Trigger`,
		`"Portal Entry Blue" zone center=68.67,1440.08,645.06 size=54.60,191.79,185.48 angle=0.00 player=0`,
		`"Portal Entry Orange" zone center=68.67,1440.08,645.06 size=54.60,191.79,185.48 angle=0.00 player=1`],
		`You would've never completed them. So [a]gain`));
	maps.push(new MapFile('mp_coop_wall_5', 'Bridge Testing', 3, true, [
		`"First Room" entity targetname=Ptemplate_ball_training inputname=ForceSpawn`,
		`"Door Activation" entity targetname=power1-ptemplate_ball_door_1 inputname=ForceSpawn`,
		`"Door Activation 2" entity targetname=power2-ptemplate_ball_door_1 inputname=ForceSpawn`,
		`"Door Activation 3" entity targetname=camera_door_4-security_3_door_left inputname=Open`],
		``));
	maps.push(new MapFile('mp_coop_tbeam_redirect', 'Cooperative Funnels', 4, true, [
		`"Wall Button" entity targetname=button_platform inputname=pressin`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`Three. Seven. Hundred [and] seven`));
	maps.push(new MapFile('mp_coop_tbeam_drill', 'Funnel Drill', 4, true, [
		`"Catapult" entity targetname=catapult-proxy inputname=OnProxyRelay1`,
		`"Sphere Button" entity targetname=proxy inputname=OnProxyRelay1`,
		`"Ball Block" entity targetname=exit_enable inputname=Trigger`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`There. [I've] said it`));
	maps.push(new MapFile('mp_coop_tbeam_catch_grind_1', 'Funnel Catch Coop', 4, true, [
		`"Wall Portal" zone center=-477.97,-1759.98,-192.20 size=0.00,127.23,127.38 angle=0.00`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay2`],
		`Not sure I trust the two of you [together]`));
	maps.push(new MapFile('mp_coop_tbeam_laser_1', 'Funnel Laser', 4, true, [
		`"Catapult" entity targetname=faithplate-proxy inputname=OnProxyRelay1`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`Doing that just to [aggravate] me`));
	maps.push(new MapFile('mp_coop_tbeam_polarity', 'Cooperative Polarity', 4, true, [
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`I trust [you]. You are my favorite`));
	maps.push(new MapFile('mp_coop_tbeam_polarity2', 'Funnel Hop', 4, true, [
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`If [Orange] had said those things about me`));
	maps.push(new MapFile('mp_coop_tbeam_polarity3', 'Advanced Polarity', 4, true, [
		`"Panel Trigger" entity targetname=platform_exit-proxy inputname=OnProxyRelay1`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`So I can trust [you] one hundred percent`));
	maps.push(new MapFile('mp_coop_tbeam_maze', 'Funnel Maze', 4, true, [],
		`Before we can go any further, [*] I will need you to complete`));
	maps.push(new MapFile('mp_coop_tbeam_end', 'Turret Warehouse', 4, true, [
		`"Conveyor Hop" zone center=440.75,-105.61,105.85 size=142.44,434.30,203.13 angle=0.00`,
		`"Wall Portal Exit" zone center=1760.36,188.87,160.00 size=319.23,134.20,127.33 angle=0.00`,
		`"Blue Funnel Exit" entity targetname=relay_blue_in inputname=Trigger`,
		`"Orange Funnel Exit" entity targetname=relay_orange_in inputname=Trigger`],
		``));
	maps.push(new MapFile('mp_coop_paint_come_along', 'Repulsion Jumps', 5, true, [
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`The best cooperative [testing] team`));
	maps.push(new MapFile('mp_coop_paint_redirect', 'Double Bounce', 5, true, [
		`"Gel Drop" entity targetname=paint_sprayer inputname=Start`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`The number one request? [*] Less deadly tests`));
	maps.push(new MapFile('mp_coop_paint_bridge', 'Bridge Repulsion', 5, true, [
		`"Death" zone center=445.29,-681.97,-192.98 size=383.15,1056.00,120.86 angle=0.00`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`You will need him for the [final] track`));
	maps.push(new MapFile('mp_coop_paint_walljumps', 'Wall Repulsion', 5, true, [
		`"Middle Room Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger`,
		`"Middle Room Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`If they ever write a [historical] document of my heroic rescue`));
	maps.push(new MapFile('mp_coop_paint_speed_fling', 'Propulsion Crushers', 5, true, [
		`"Button Activation" entity targetname=paint_sprayer1_start inputname=Trigger`,
		`"Shot" zone center=965.34,886.51,-855.54 size=530.44,684.95,77.25 angle=0.00`,
		`"Door Activation" entity targetname=ball_button-proxy inputname=OnProxyRelay2`],
		`If that doesn't [motivate] you`));
	maps.push(new MapFile('mp_coop_paint_red_racer', 'Turret Ninja', 5, true, [
		`"Cube Drop" entity targetname=cube_dropper inputname=Trigger`,
		`"Floor Platform" zone center=-1552.37,515.37,-467.60 size=125.80,134.19,88.74 angle=0.00`,
		`"Gravity Trigger" zone center=-1308.00,512.00,346.00 size=616.00,128.00,28.00 angle=0.00`,
		`"Door Activation" entity targetname=team_trigger_door inputname=Enable`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		`Are you [as] excited as I am?`));
	maps.push(new MapFile('mp_coop_paint_speed_catch', 'Propulsion Retrieval', 5, true, [
		`"Gel Drop" entity targetname=paint_sprayer2_start inputname=Trigger`,
		`"Slanted Portal Exit" zone center=704.00,566.96,347.91 size=126.93,63.65,110.27 angle=0.00`,
		`"Panels" entity targetname=platform_button inputname=Press`,
		`"Cube Drop" entity targetname=box_buttons inputname=Press`,
		`"Door Activation" entity targetname=sphere_button-proxy inputname=OnProxyRelay2`],
		`The ratio of humans to monsters is about [*] a million to one.`));
	maps.push(new MapFile('mp_coop_paint_longjump_intro', 'Vault Entrance', 5, true, [
		`"Second Room" zone center=304.00,-4547.79,961.06 size=287.95,120.36,125.74 angle=0.00`,
		`"Gel Drop" entity targetname=relay_paint_start_2 inputname=Trigger`],
		``));
	maps.push(new MapFile('mp_coop_separation_1', 'Separation', 6, true, [
		`"Cube Drop" entity targetname=reflecto_cube_dropper-proxy inputname=OnProxyRelay1`,
		`"Door Activation" entity targetname=camera_triggers inputname=Enable`,
		`"Sphere Drop" entity targetname=dispenser_2-proxy inputname=OnProxyRelay1`,
		`"Button Activation" entity targetname=orange_door_2-proxy inputname=OnProxyRelay1`,
		`"End Wall" zone center=2816.02,-3135.98,64.44 size=383.90,127.98,128.66 angle=0.00`],
		``));
	maps.push(new MapFile('mp_coop_tripleaxis', 'Triple Axis', 6, true, [
		`"Crusher" entity targetname=crusher_sequence_start_rl inputname=Trigger`],
		``));
	maps.push(new MapFile('mp_coop_catapult_catch', 'Catapult Catch', 6, true, [
		`"Cube Area" zone center=1103.59,-639.85,-192.12 size=96.77,255.50,127.69 angle=0.00`,
		`"Door Activation" entity targetname=exit_door-proxy inputname=OnProxyRelay1`],
		``));
	maps.push(new MapFile('mp_coop_2paints_1bridge', 'Bridge Gels', 6, true, [
		`"Middle Trigger Blue" entity targetname=entry_airlock-relay_blue_in inputname=Trigger`,
		`"Middle Trigger Orange" entity targetname=entry_airlock-relay_orange_in inputname=Trigger`,
		`"Button Stick" entity targetname=team_trigger_door inputname=Enable`,
		`"End Trigger Blue" entity targetname=chamber_exit_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=chamber_exit_door-team_proxy inputname=OnProxyRelay3`],
		``));
	maps.push(new MapFile('mp_coop_paint_conversion', 'Maintenance', 6, true, [
		`"Portal Room" zone center=-1378.28,3262.04,182.64 size=187.19,316.02,124.72 angle=0.00`,
		`"Elevator" zone center=-1873.30,4928.08,-1312.67 size=1054.17,127.79,318.60 angle=0.00`,
		`"Fall" entity targetname=disassembler_start_relay inputname=Trigger`,
		`"End Area" entity targetname=paint_sprayer_white inputname=Start`,
		`"Stairs" entity targetname=ramp_up_relay inputname=Trigger`],
		``));
	maps.push(new MapFile('mp_coop_bridge_catch', 'Bridge Catch', 6, true, [
		`"Button" zone center=146.89,1343.92,14.03 size=37.33,127.50,12.00 angle=0.00`,
		`"Laser Catapult" entity targetname=catapult_1_wav inputname=PlaySound`,
		`"Catapult" entity targetname=catapult_1_wav2 inputname=PlaySound`,
		`"Bridge Activation" entity targetname=laser_socketed inputname=SetValue`,
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		``));
	maps.push(new MapFile('mp_coop_laser_tbeam', 'Double Lift', 6, true, [
		`"End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`],
		``));
	maps.push(new MapFile('mp_coop_paint_rat_maze', 'Gel Maze', 6, true, [
		`"Portal Entry" zone center=-573.35,-0.10,703.71 size=69.24,255.73,127.07 angle=0.00`,
		`"Cube Button" entity targetname=cube_dropper_01-proxy inputname=OnProxyRelay1`,
		`"Slanted Portal" zone center=575.95,95.71,577.80 size=127.83,56.84,114.41 angle=0.00`,
		`"Door Activation" entity targetname=@exit_door inputname=Open`],
		``));
	maps.push(new MapFile('mp_coop_paint_crazy_box', 'Crazier Box', 6, true, [
		`"Panels Trigger" entity targetname=exit_button_clips inputname=Disable`,
		`"Cube Receptacle" entity targetname=team_trigger_door inputname=Enable`,
		`"Door Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1`,
		`"Door Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3`,
		`"Blind Shot" entity targetname=bts_wall_undamaged inputname=Disable`],
		``));
	for (let map of maps) {
		map.addGenericTriggers();
	}
}