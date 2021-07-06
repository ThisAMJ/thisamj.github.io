let aliases = [], functions = [];
let targetnames = [], inputnames = [], trigEnds = [];
function compile() {
	targetnames = [], inputnames = [], trigEnds = [];


	aliases = [], functions = []
	let varCount = 0, allowedChars = "1!2@3#4$5%6^7&8*9(0)-_=+qwertyuiop[{]}\\|asdfghjkl:'zxcvbnm,<.>/?";
	// if you run out of characters, it'll just break :(
	
	let txt = ['sar_alias ` sar_alias', '` ~ sar_function'];
	cached = document.querySelector("#txt").value;
	localStorage.setItem('readableHeader', cached);
	txt = txt.concat(cached.split("\n"));

	{
		for (let i = 0; i < txt.length; i++) {
			if (txt[i].indexOf("//") > -1) txt[i] = txt[i].substring(0, txt[i].indexOf("//")); // remove comments
			txt[i] = txt[i].trim().replaceEvery("  ", " ");
			txt[i] = txt[i].replaceAll('; ', ';'); // squish command concats
		}
		txt = txt.filter(e => e != "");
	} // initial squish

	{
		for (let i = 0; i < txt.length; i++) {
			if (txt[i].startsWith("alias ")) {
				txt[i] = txt[i].replace("alias ", "` ");
				let variableName = txt[i].substring(2, txt[i].indexOf(" ", 2));
				aliases.push([variableName, allowedChars[varCount]]);
				varCount++;
			}
			if (txt[i].startsWith("funct ")) {
				txt[i] = txt[i].replace("funct ", "~ ");
				let variableName = txt[i].substring(2, txt[i].indexOf(" ", 2));
				functions.push([variableName, allowedChars[varCount]]);
				varCount++;
			}
			txt[i] = compileVariables(txt[i]).replaceAll(" funct ", " ~ ");


			let inFunction = functions.filter(e => txt[i].startsWith(e[1] + ' '));
			if (inFunction.length > 0) { // if this line starts with a function reference
				let variableName = txt[i].split(" ")[1];
				let char = allowedChars[varCount];
				if (i < txt.length - 2 && !txt[i + 1].startsWith(inFunction[0][0] + ' ')) {
					char = inFunction[0][1];
				} else {
					varCount++;
				}
				functions.push([variableName, char]);
				txt[i] = txt[i].replace(variableName, char);
			}
		}
	} // alias and function compilation. smart redefinition too!
	

	txt = txt.map(e => squishCommand(e));
	txt = [txt.join(";")]; // join header into single line

	if (!document.querySelector("#includeHeader").checked) {
		txt = [];
	} 

	if (document.querySelector("#includeContent").checked) {
		let body = "";
		{
			body = `
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
			sar_speedrun_cc_rule "Cube Room" zone center=-31.50,415.97,-12.66 size=66.80,20.00,102.39 angle=0.00
			sar_speedrun_cc_rule "Button Room" zone center=-429.57,511.69,-11.92 size=36.80,64.07,110.17 angle=0.00
			sar_speedrun_cc_rule "Ending Room" zone center=-699.63,96.04,-3.06 size=8.68,64.14,107.93 angle=0.00
			sar_speedrun_cc_rule "Exit Door" zone center=-319.62,624.13,-0.38 size=127.17,30.40,127.17 angle=0.00
			sar_speedrun_cc_rule "End" entity targetname=departure_elevator-close inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Portal Gun" map=sp_a1_intro3 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Drop Trigger" entity targetname=podium_collapse inputname=EnableRefire
			sar_speedrun_cc_rule "Portal Entry" zone center=94.68,2260.19,-192.30 size=103.55,70.96,127.34 angle=0.00
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
			sar_speedrun_cc_rule "Waffle Shot" portal center=-2368.00,300.00,1400.00 size=5.00,100.00,150.00 angle=0.00
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
			sar_speedrun_cc_rule "Wall Portal" zone center=-32.28,-1382.97,-159.77 size=448.43,113.99,320.45 angle=0.00
			sar_speedrun_cc_rule "Door Passthrough" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger
			sar_speedrun_cc_rule "Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Trust Fling" map=sp_a2_trust_fling action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Panels Trigger" entity targetname=wall_panel_1-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Catapult Trigger" entity targetname=flingroom_1_circular_catapult_1_wav_1 inputname=PlaySound
			sar_speedrun_cc_rule "Button Press" entity targetname=first_press_relay inputname=Trigger
			sar_speedrun_cc_rule "Portal Passthrough" zone center=-107.03,-832.06,383.40 size=41.87,255.82,254.02 angle=0.00
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
			sar_speedrun_cc_rule "Ending Area" zone center=3357.70,1088.05,-63.97 size=123.03,383.85,895.99 angle=0.00
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Intro" map=sp_a2_bridge_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_52-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Button Press" entity targetname=autosave inputname=SaveDangerous
			sar_speedrun_cc_rule "Cube Portal Passthrough" entity targetname=box_dropper_01-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Player Portal Passthrough" zone center=756.05,63.97,-385.04 size=23.84,127.87,253.99 angle=0.00
			sar_speedrun_cc_rule "End Wall" zone center=192.03,560.02,128.30 size=127.88,31.91,254.69 angle=0.00
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
			sar_speedrun_cc_rule "First Portal" zone center=587.40,-1697.66,-75.02 size=22.61,130.61,105.89 angle=0.00
			sar_speedrun_cc_rule "Second Portal" zone center=640.03,-1262.09,-64.10 size=128.01,28.11,127.27 angle=0.00
			sar_speedrun_cc_rule "Floor Portal" zone center=1071.63,-1311.99,-116.33 size=160.02,127.95,23.27 angle=0.00
			sar_speedrun_cc_rule "Cube Room Entry" zone center=332.35,-896.12,128.29 size=24.63,191.52,255.35 angle=0.00
			sar_speedrun_cc_rule "Cube Room Wall" zone center=927.96,-972.34,127.68 size=447.37,39.25,255.30 angle=0.00
			sar_speedrun_cc_rule "Ending Room" zone center=1131.03,-192.36,127.65 size=41.88,382.56,255.23 angle=0.00
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Relays" map=sp_a2_laser_relays action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Floor Panels Trigger" entity targetname=animset01_start_rl inputname=Trigger
			sar_speedrun_cc_rule "Laser Switch Glitch" entity targetname=relay3_powered_branch inputname=SetValue
			sar_speedrun_cc_rule "Door Entry" zone center=-320.25,-1071.59,63.66 size=127.88,32.77,127.25 angle=0.00
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
			sar_speedrun_cc_rule "OOB" zone center=153.49,-234.07,540.65 size=178.91,159.90,87.15 angle=0.00
			sar_speedrun_cc_rule "Lower Landing" zone center=336.95,-264.22,287.42 size=61.89,111.50,122.08 angle=0.00
			sar_speedrun_cc_rule "Re-Entry" zone center=360.34,-359.72,135.35 size=303.26,81.36,46.63 angle=0.00
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
			sar_speedrun_cc_rule "Observation Room" zone center=-848.50,-33.10,352.35 size=126.94,61.49,190.99 angle=0.00
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Chaining" map=sp_a2_laser_chaining action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Entry" entity targetname=music.sp_a2_laser_chaining_b1 inputname=PlaySound
			sar_speedrun_cc_rule "Wall Portal" zone center=-367.28,-637.15,640.20 size=33.38,377.50,255.54 angle=0.00
			sar_speedrun_cc_rule "Door Activation" entity targetname=relay_02_indicator inputname=Check
			sar_speedrun_cc_rule "Catapult" zone center=548.04,63.63,-11.47 size=151.87,142.84,104.99 angle=0.00
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Triple Laser" map=sp_a2_triple_laser action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Portal Entry" zone center=7197.16,-5336.25,137.26 size=58.26,123.87,237.42 angle=0.00
			sar_speedrun_cc_rule "Switch Glitch" entity targetname=@exit_door-testchamber_door inputname=Open
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Jailbreak" map=sp_a2_bts1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "First Portal Entry" zone center=-9743.78,-479.05,449.45 size=96.38,126.04,129.56 angle=0.00
			sar_speedrun_cc_rule "Railing" zone center=-2825.00,-1679.50,45.00 size=62.00,297.00,110.00 angle=0.00
			sar_speedrun_cc_rule "Stairboost" zone center=-465.07,-635.72,72.00 size=118.08,161.22,239.94 angle=0.00
			sar_speedrun_cc_rule "Last Corner" zone center=818.00,-989.00,-11.00 size=68.00,132.00,106.00 angle=0.00
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
			sar_speedrun_cc_rule "Brown Conveyor" zone center=6913.03,884.54,185.12 size=253.88,150.73,77.71 angle=0.00
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
			sar_speedrun_cc_start "Underground" map=sp_a3_01 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Second Portal Passthrough" entity targetname=ambient_sp_a3_01_b3 inputname=PlaySound
			sar_speedrun_cc_rule "Catwalk" entity targetname=helper_01 inputname=Disable
			sar_speedrun_cc_rule "Ravine" entity targetname=ambient_sp_a3_01_b5 inputname=PlaySound
			sar_speedrun_cc_rule "Long Shot Portal" portal center=4879.93,4269.74,-544.00 size=127.23,132.32,5.00 angle=0.00
			sar_speedrun_cc_rule "Portal Entry" zone center=4879.93,4269.74,-509.76 size=127.23,132.32,68.42 angle=0.00
			sar_speedrun_cc_rule "First Button Press" entity targetname=timer2b-TimerStart inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Second Button Press" entity targetname=timer1b-TimerStart inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Cave Johnson" map=sp_a3_03 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Catwalk Portal Entry" zone center=-6107.50,279.05,-4800.82 size=72.95,300.99,382.31 angle=0.00
			sar_speedrun_cc_rule "Portal Stand" zone center=-4976.03,1113.87,-2644.60 size=103.94,37.67,138.07 angle=0.00
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Repulsion Intro" map=sp_a3_jump_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Lights Trigger" entity targetname=@dark_column_flicker_start inputname=Trigger
			sar_speedrun_cc_rule "First Room" entity targetname=ambient_sp_a3_jump_intro_b1 inputname=PlaySound
			sar_speedrun_cc_rule "Dropper Activation" entity targetname=room_1_cube_dropper-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Second Floor" zone center=-1172.30,1152.00,1311.71 size=168.45,255.94,254.77 angle=0.00
			sar_speedrun_cc_rule "Last Portal Passthrough" zone center=-1631.89,797.21,1634.26 size=162.59,58.36,157.63 angle=0.00
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bomb Flings" map=sp_a3_bomb_flings action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Railing" zone center=-256.10,335.97,-1281.08 size=255.42,351.87,253.79 angle=0.00
			sar_speedrun_cc_rule "Gel Drop" entity targetname=trigger_to_drop inputname=Trigger
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Crazy Box" map=sp_a3_crazy_box action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "First Room" entity targetname=ambient_sp_a3_crazy_box_b1 inputname=PlaySound
			sar_speedrun_cc_rule "Seamshot" portal center=896.00,-1024.00,2048.00 size=192.00,320.00,5.00 angle=0.00
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
			sar_speedrun_cc_rule "Long Shot" portal center=-68.00,-639.96,896.17 size=5.00,127.75,127.29 angle=0.00
			sar_speedrun_cc_rule "Ending Portal Entry" zone center=-38.72,-639.96,896.17 size=58.49,127.75,127.29 angle=0.00
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Propulsion Flings" map=sp_a3_speed_flings action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Blue Gel Bounce" zone center=2815.60,-109.17,-303.28 size=192.37,153.96,97.37 angle=0.00
			sar_speedrun_cc_rule "Ramp" zone center=3358.64,1153.00,127.56 size=61.32,253.94,378.90 angle=0.00
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
			sar_speedrun_cc_rule "Fling" zone center=-1105.75,256.12,-3879.90 size=99.12,191.69,127.73 angle=0.00
			sar_speedrun_cc_rule "Ending Fling" entity targetname=helper01 inputname=Disable
			sar_speedrun_cc_rule "Flags" flags action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Test" map=sp_a4_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Start Dialogue" zone center=-992.00,-480.00,320.00 size=128.00,128.00,192.00 angle=0.00
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
			sar_speedrun_cc_rule "Zone" zone center=2015.92,733.66,-258.67 size=64.10,580.63,506.26 angle=0.00
			sar_speedrun_cc_rule "Reportal" zone center=1312.19,384.22,415.43 size=64.33,256.38,253.77 angle=0.00
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
			sar_speedrun_cc_rule "Floor Portal Passthrough" zone center=-255.88,-319.92,40.65 size=127.91,127.98,65.24 angle=0.00
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
			sar_speedrun_cc_rule "Chamber Trigger" zone center=-608.05,1675.93,-127.98 size=287.79,104.09,127.98 angle=0.00
			sar_speedrun_cc_rule "Ramp" zone center=-977.54,1322.84,153.57 size=48.93,362.86,193.93 angle=0.00
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
			sar_speedrun_cc_start "Doors" map=mp_coop_doors action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal" portal center=-10272.05,-544.03,64.15 size=127.90,1.00,127.99 angle=0.00
			sar_speedrun_cc_rule "Portal Entry" zone center=-10272.05,-574.78,64.15 size=127.90,61.50,127.99 angle=0.00
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
			sar_speedrun_cc_rule "End Portal" zone center=-254.71,-223.75,-416.04 size=66.51,127.81,127.51 angle=0.00
			sar_speedrun_cc_rule "Door Activation" entity targetname=@exit_door inputname=Open
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Laser Crusher" map=mp_coop_laser_crusher action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "End Hop" zone center=2630.95,-1135.87,80.33 size=77.85,287.33,161.40 angle=0.00
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
			sar_speedrun_cc_rule "Blue Start" zone center=223.69,911.99,288.00 size=64.44,415.94,319.94 angle=0.00 player=0
			sar_speedrun_cc_rule "Orange Start" zone center=223.69,911.99,288.00 size=64.44,415.94,319.94 angle=0.00 player=1
			sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_2-relay_blue_in inputname=Trigger
			sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_2-relay_orange_in inputname=Trigger
			sar_speedrun_cc_rule "Wall Portal Exit" zone center=297.39,-384.02,704.00 size=41.16,127.86,127.93 angle=0.00
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
			sar_speedrun_cc_rule "Floor Portal" zone center=1023.93,1696.03,-352.00 size=127.74,127.57,155.94 angle=0.00
			sar_speedrun_cc_rule "Door Activation" entity targetname=button2-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Vertical Flings" map=mp_coop_fling_1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Portal Entry" zone center=607.94,63.93,-123.93 size=127.81,127.80,68.05 angle=0.00
			sar_speedrun_cc_rule "Button 1" entity targetname=race_button_1_checkmark inputname=Start
			sar_speedrun_cc_rule "Button 2" entity targetname=race_button_2_checkmark inputname=Start
			sar_speedrun_cc_rule "Door Activation" entity targetname=ball_button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Catapults" map=mp_coop_catapult_1 action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Catapult" entity targetname=catapult_3-proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Re-Entry" zone center=830.52,288.26,511.57 size=252.98,190.40,127.08 angle=0.00
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
			sar_speedrun_cc_rule "Final Room Blue" zone center=-640.33,1087.46,233.03 size=8.00,60.08,114.00 angle=0.00 player=0
			sar_speedrun_cc_rule "Final Room Orange" zone center=-640.33,1087.46,233.03 size=8.00,60.08,114.00 angle=0.00 player=1
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Cooperative Bridges" map=mp_coop_wall_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Starting Wall" zone center=-95.84,-2366.62,-255.72 size=191.61,130.69,254.67 angle=0.00
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
			sar_speedrun_cc_rule "Portal Entry Blue" zone center=68.67,1440.08,645.06 size=54.60,191.79,185.48 angle=0.00 player=0
			sar_speedrun_cc_rule "Portal Entry Orange" zone center=68.67,1440.08,645.06 size=54.60,191.79,185.48 angle=0.00 player=1
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
			sar_speedrun_cc_rule "Portal" portal center=-384.00,-1151.25,250.00 size=127.38,127.38,25.00 angle=0.00
			sar_speedrun_cc_rule "Wall Portal Exit" zone center=-472.97,-1759.98,-192.20 size=10.00,127.23,127.38 angle=0.00
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
			sar_speedrun_cc_rule "Conveyor Hop" zone center=440.75,-105.61,105.85 size=142.44,434.30,203.13 angle=0.00
			sar_speedrun_cc_rule "Wall Portal Exit" zone center=1760.36,188.87,160.00 size=319.23,134.20,127.33 angle=0.00
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
			sar_speedrun_cc_rule "Long Shot" portal center=-635.00,-192.00,575.00 size=10.00,128.00,128.00 angle=0.00
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
			sar_speedrun_cc_rule "Portal" portal center=-897.50,127.23,-321.72 size=10.00,128.00,128.00 angle=0.00
			sar_speedrun_cc_rule "Door Activation" entity targetname=ball_button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Turret Ninja" map=mp_coop_paint_red_racer action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Cube Drop" entity targetname=cube_dropper inputname=Trigger
			sar_speedrun_cc_rule "Floor Platform" zone center=-1552.37,515.37,-467.60 size=125.80,134.19,88.74 angle=0.00
			sar_speedrun_cc_rule "Gravity Trigger" zone center=-1308.00,512.00,346.00 size=616.00,128.00,28.00 angle=0.00
			sar_speedrun_cc_rule "Door Activation" entity targetname=team_trigger_door inputname=Enable
			sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Propulsion Retrieval" map=mp_coop_paint_speed_catch action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Gel Drop" entity targetname=paint_sprayer2_start inputname=Trigger
			sar_speedrun_cc_rule "Slanted Portal Exit" zone center=704.00,566.96,347.91 size=126.93,63.65,110.27 angle=0.00
			sar_speedrun_cc_rule "Panels" entity targetname=platform_button inputname=Press
			sar_speedrun_cc_rule "Cube Drop" entity targetname=box_buttons inputname=Press
			sar_speedrun_cc_rule "Door Activation" entity targetname=sphere_button-proxy inputname=OnProxyRelay2
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Vault Entrance" map=mp_coop_paint_longjump_intro action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Second Room" zone center=304.00,-4547.79,961.06 size=287.95,120.36,125.74 angle=0.00
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
			sar_speedrun_cc_rule "End Wall" zone center=2816.02,-3135.98,64.44 size=383.90,127.98,128.66 angle=0.00
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
			sar_speedrun_cc_rule "Cube Area" zone center=1103.59,-639.85,-192.12 size=96.77,255.50,127.69 angle=0.00
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
			sar_speedrun_cc_rule "Portal Room" zone center=-1378.28,3262.04,182.64 size=187.19,316.02,124.72 angle=0.00
			sar_speedrun_cc_rule "Elevator" zone center=-1873.30,4928.08,-1312.67 size=1054.17,127.79,318.60 angle=0.00
			sar_speedrun_cc_rule "Fall" entity targetname=disassembler_start_relay inputname=Trigger
			sar_speedrun_cc_rule "End Area" entity targetname=paint_sprayer_white inputname=Start
			sar_speedrun_cc_rule "Stairs" entity targetname=ramp_up_relay inputname=Trigger
			sar_speedrun_cc_rule "Flags 1" flags
			sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop
			sar_speedrun_cc_finish
			sar_speedrun_cc_start "Bridge Catch" map=mp_coop_bridge_catch action=split
			sar_speedrun_cc_rule "Start" load action=force_start
			sar_speedrun_cc_rule "Button" zone center=146.89,1343.92,14.03 size=37.33,127.50,12.00 angle=0.00
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
			sar_speedrun_cc_rule "Portal Entry" zone center=-573.35,-0.10,703.71 size=69.24,255.73,127.07 angle=0.00
			sar_speedrun_cc_rule "Cube Button" entity targetname=cube_dropper_01-proxy inputname=OnProxyRelay1
			sar_speedrun_cc_rule "Slanted Portal" zone center=575.95,95.71,577.80 size=127.83,56.84,114.41 angle=0.00
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
			sar_speedrun_cc_finish
			`.trim().replaceAll('\t', '').split('\n');
		} // import raw mtriggers

		for (let i = 0; i < body.length; i++) {
			let args = body[i].split(" "), argsTemp = [args[0]], temp = "", inQuotes = false;
			let afterFirst = body[i].substring(args[0].length + 1);
			for (let j = 0; j < afterFirst.length; j++) {
				if (afterFirst[j] == '"') {
					if (inQuotes) {
						argsTemp.push('"' + temp + '"');
						temp = "";
					}
					inQuotes = !inQuotes;
				} else if (afterFirst[j] == ' ' && !inQuotes) {
					if (afterFirst[j - 1] != '"') {
						argsTemp.push(temp);
						temp = "";
					}
				} else {
					temp += afterFirst[j];
				}
			}
			argsTemp.push(temp);
			args = argsTemp.filter(e => e != "");

			switch (args[0]) {
				case "sar_speedrun_cc_start":
					args[2] = args[2].replace('map=', '');
					args[3] = args[3].replace('action=split', '');
					let coop = args[2].indexOf('mp_coop_') > -1;
					args[0] = coop ? '%startMP%' : '%startSP%';
					args[2] = args[2].replace('sp_a', '').replace('mp_coop_', '');
					break;
				case "sar_speedrun_cc_rule":
					switch (args[2]) {
						case "load":
							args = ["%genericStartRule%"];
							break;
						case "entity":
							args[0] = "%entityRule%";
							args[2] = "";
							args[3] = args[3].replace('targetname=', '');
							args[4] = args[4].replace('inputname=', '');

							{
								if (args.join(" ") == '%entityRule% "End Trigger Blue"  team_door-team_proxy OnProxyRelay1') {
									args = ["%endTriggerBlue%"];
								} else if (args.join(" ") == '%entityRule% "End Trigger Orange"  team_door-team_proxy OnProxyRelay3') {
									args = ["%endTriggerOrange%"];
								}
							} // End Trigger Blue/Orange
							
							{
								if (args[1] == `"Middle Trigger Blue"` && args[4] == "Trigger") {
									args[0] = "%midTriggerBlue%";
									args[1] = "";
									args[4] = "";
								} else if (args[1] == `"Middle Trigger Orange"` && args[4] == "Trigger") {
									args[0] = "%midTriggerOrange%";
									args[1] = "";
									args[4] = "";
								}
							} // Middle Trigger Blue/Orange


							//You can try to shuffle these around to optimise the usage better, I think I've done pretty well
							let shortcuts = [
							["%TargetNamePlayerClip%"   , ""             , "departure_elevator-elevator_doorclose_playerclip", ""             ],
							["%TargetNameAirlockOrange%", ""             , "airlock_1-relay_orange_in"                       , ""             ],
							["%InputNameOnProxyRelay1%" , ""             , ""                                                , "OnProxyRelay1"],
							["%InputNameOnProxyRelay2%" , ""             , ""                                                , "OnProxyRelay2"],
							["%InputNamePlaySound%"     , ""             , ""                                                , "PlaySound"    ],
							["%InputNameTrigger%"       , ""             , ""                                                , "Trigger"      ],
							["%NameEndsWithActivation%" , " Activation\"", ""                                                , ""             ],
							["%InputNameOnProxyRelay3%" , ""             , ""                                                , "OnProxyRelay3"],
							["%InputNameEnable%"        , ""             , ""                                                , "Enable"       ],
							["%InputNameStart%"         , ""             , ""                                                , "Start"        ],
							["%InputNameTurnOn%"        , ""             , ""                                                , "TurnOn"       ],
							["%InputNameDisable%"       , ""             , ""                                                , "Disable"      ],
							["%NameEndsWithRoom%"       , " Room\""      , ""                                                , ""             ],
							["%InputNameOpen%"          , ""             , ""                                                , "Open"         ],
							]
							for (let j = 0; j < shortcuts.length; j++) {
								let i1 = 1;
								while (shortcuts[j][i1] == "") i1++;

								ind = i1 == 1 ? 1 : i1 + 1;
								if (ind < args.length) {
									if (args[ind].endsWith(shortcuts[j][i1])) {
										args[0] = shortcuts[j][0];
										args[ind] = "";
									}
								}
							}
							if (args[0] == "%entityRule%") {
								targetnames.push(args[3]);
								inputnames.push(args[4]);
								let s = args[1].split(" ");
								if (s.length > 1) {
									trigEnds.push(s[s.length - 1])
								}
							}

							break;
						case "zone":
							args[0] = "%zoneRule%";
							// console.log(args[1]) // promising filesave later?
							args[2] = "";
							args[3] = args[3].replace('center=', '');
							args[3] = args[3].split(',').map(e => parseFloat(e).toString()).join(',')
							args[4] = args[4].replace('size=', '');
							args[4] = args[4].split(',').map(e => parseFloat(e).toString()).join(',')
							args[5] = args[5].replace('angle=0.00', '');
							break;
						case "portal":
							args[0] = "%portalRule%";
							// console.log(args[1]) // promising filesave later?
							args[2] = "";
							args[3] = args[3].replace('center=', '');
							args[3] = args[3].split(',').map(e => parseFloat(e).toString()).join(',')
							args[4] = args[4].replace('size=', '');
							args[4] = args[4].split(',').map(e => parseFloat(e).toString()).join(',')
							args[5] = args[5].replace('angle=0.00', '');
							break;
						case "fly":
							switch (args[1]) {
								case `"Crouch Fly"`:
									args = ["%flyRule%"];
									break;
								case `"Crouch Fly Blue"`:
									args = ["%flyRuleCoopBlue%"];
									break;
								case `"Crouch Fly Orange"`:
									args = ["%flyRuleCoopOrange%"];
									break;
							}
							break;
						case "flags":
							switch (args[1]) {
								case `"Flags"`:
									args = ["%genericSPFlagsRule%"];
									break;
								case `"Flags 1"`:
									args = ["%genericMPFlag1Rule%"];
									break;
								case `"Flags 2"`:
									args = ["%genericMPFlag2Rule%"];
									break;
							}
							break;
					}
					break;
				case "sar_speedrun_cc_finish":
					args[0] = "%endCategory%"
					break;
			}
			body[i] = args.join(" ").trim().replaceEvery("  ", " ");
			body[i] = compileVariables(body[i]);
			body[i] = squishCommand(body[i]);
		}
		body = body.join('\n');
		body = body.replaceAll(cV("\n%genericStartRule%"), cV(";%genericStartRule%"));
		body = body.replaceAll(cV("\n%flyRuleCoopBlue%\n%flyRuleCoopOrange%"), cV("\n%flyRuleCoopBoth%"));
		body = body.replaceAll(cV("\n%genericSPFlagsRule%\n%endCategory%"), cV("\n%genericSPFlagRules%"));
		body = body.replaceAll(cV("\n%genericMPFlag1Rule%\n%genericMPFlag2Rule%\n%endCategory%"), cV("\n%genericMPFlagRules%"));
		body = body.replaceAll(cV("\n%endTriggerBlue%\n%endTriggerOrange%\n%genericMPFlagRules%"), cV("\n%endTriggerAndMPFlagRules%"));

		txt.push(body);
	}

	if (document.querySelector("#includeFooter").checked) {
		let footer = [];
		for (let i = 0; i < aliases.length; i++) {
			if (footer.indexOf(`\` ${aliases[i][1]}"`) == -1) footer.push(`\` ${aliases[i][1]}"`);
		}
		for (let i = 0; i < functions.length; i++) {
			if (footer.indexOf(`~ ${functions[i][1]}"`) == -1) footer.push(`~ ${functions[i][1]}"`);
		}
		footer.push('` ~"');
		footer.push('` `"');
		txt.push(footer.join(";"))
	} //undefine aliases and functions

	document.querySelector("#out").value = txt.join("\n");
	document.querySelector("#outpre").innerHTML = `Compiled: (${txt.join("\n").length} bytes)`;

	console.clear();
	console.log("Trigger ending words:\n" + sortByOccurrences(trigEnds));
	console.log("Targetnames:\n" + sortByOccurrences(targetnames));
	console.log("Inputnames:\n" + sortByOccurrences(inputnames));
}

function sortByOccurrences(arr) {
	let a = arr.sort(), b = [], t = a[0], count = 0;
	for (let i = 0; i < a.length; i++) {
		if (a[i] == t) {
			count++;
		} else {
			b.push([t, (count - 1) * t.length]);
			count = 1;
		}
		t = a[i];
	}
	b.sort((a, b) => {return b[1] - a[1]});
	return b.map(e => `${e[1]} weight : ${e[0]}`).filter(e => parseInt(e.split(" ")[0]) > 1).join("\n");
}

function cV(txt) {
	return compileVariables(txt);
}

function compileVariables(txt) {
	for (let i = 0; i < aliases.length; i++) {
		txt = txt.replaceAll(aliases[i][0], aliases[i][1]);
	}
	for (let i = 0; i < functions.length; i++) {
		txt = txt.replaceAll(functions[i][0], functions[i][1]);
	}
	return txt;
}

function squishCommand(txt) {
	let split = txt.split('"');
	let change = [split[0].trim()];
	for (let j = 0; j < split.length; j++) {
		if (j % 2 == 0) {
			change.push(split.length - 1 > j ? split[j + 1] : '');
		} else {
			change.push(split.length - 1 > j ? split[j + 1].trim() : '');
		}
	}
	change = change.join('"');
	return change.substring(0, change.length - 1);
}

function txtUpdate() {
	if (document.querySelector("#liveUpdate").checked) compile();
}

function toggleLiveUpdate() {
	document.querySelector("button").style.visibility = document.querySelector("#liveUpdate").checked ? "hidden" : "visible";
}

let cached = localStorage.getItem('readableHeader');
if (cached == null) document.querySelector("#txt").value = "// Readable header goes here!";
else document.querySelector("#txt").value = cached;
compile();