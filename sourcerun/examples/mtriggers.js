({
if (!src) return false;
src.cfg.add('mtriggers/SP/01_the-courtesy-call/01_container-ride', `sar_speedrun_cc_start "Container Ride" map=sp_a1_intro1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Sleep" entity targetname=return_to_bed_button inputname=Kill
sar_speedrun_cc_rule "Second Jump" entity targetname=@music_apple inputname=PlaySound
sar_speedrun_cc_rule "Room Trigger" entity targetname=relay_start_map inputname=Trigger
sar_speedrun_cc_rule "Second Room" entity targetname=drop_box_rl inputname=Trigger
sar_speedrun_cc_rule "Fizzler" entity targetname=departure_elevator-logic_source_elevator_door_open inputname=Trigger
sar_speedrun_cc_rule "End" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a1_intro1" sar_speedrun_category "Container Ride"
`);
src.cfg.add('mtriggers/SP/01_the-courtesy-call/02_portal-carousel', `sar_speedrun_cc_start "Portal Carousel" map=sp_a1_intro2 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=@entry_door-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Cube Portal" entity targetname=blue_3_portal_button inputname=Use
sar_speedrun_cc_rule "Cube Room" zone center=-31.5,397.97,-11 size=66.8,36,110 angle=0
// ROUTE VARIATION: following two not used in record route
sar_speedrun_cc_rule "Floor Button Portal" entity targetname=blue_1_portal_button inputname=Use
sar_speedrun_cc_rule "Floor Button Room" zone center=-678,94,-11 size=66.8,36,110 angle=0
sar_speedrun_cc_rule "Door Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Ending Portal" entity targetname=blue_2_portal_button inputname=Use
sar_speedrun_cc_rule "Ending Room" zone center=-429.97,511.69,-11 size=36,64.07,110 angle=0
sar_speedrun_cc_rule "Elevator Trigger" entity targetname=departure_elevator-elevator_arrive inputname=Trigger
sar_speedrun_cc_rule "End" entity targetname=departure_elevator-close inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a1_intro2" sar_speedrun_category "Portal Carousel"
`);
src.cfg.add('mtriggers/SP/01_the-courtesy-call/03_portal-gun', `sar_speedrun_cc_start "Portal Gun" map=sp_a1_intro3 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Drop Trigger" entity targetname=podium_collapse inputname=EnableRefire
sar_speedrun_cc_rule "Portal Entry" zone center=94.68,2260.19,-192.3 size=103.55,70.96,127.34 angle=0
sar_speedrun_cc_rule "Orange Portal Trigger" entity targetname=room_1_portal_deactivate_rl inputname=Trigger
sar_speedrun_cc_rule "End Door Trigger" entity targetname=door_3-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a1_intro3" sar_speedrun_category "Portal Gun"
`);
src.cfg.add('mtriggers/SP/01_the-courtesy-call/04_smooth-jazz', `sar_speedrun_cc_start "Smooth Jazz" map=sp_a1_intro4 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Dropper Trigger" entity targetname=logic_drop_box inputname=Trigger
sar_speedrun_cc_rule "Second Room" entity targetname=info_sign-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Cube Fizzle" entity targetname=section_2_box_2 inputname=Dissolve
sar_speedrun_cc_rule "Trap Room" entity targetname=room_2_portal_deactivate_rl inputname=Trigger
sar_speedrun_cc_rule "End Door Trigger" entity targetname=door_2-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a1_intro4" sar_speedrun_category "Smooth Jazz"
`);
src.cfg.add('mtriggers/SP/01_the-courtesy-call/05_cube-momentum', `sar_speedrun_cc_start "Cube Momentum" map=sp_a1_intro5 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Portal Trigger" entity targetname=room_1_portal_activate_rl inputname=Trigger
sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper_2-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Cube Grab" entity targetname=cube_dropper_2-cube_dropper_box inputname=Use
sar_speedrun_cc_rule "Door" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a1_intro5" sar_speedrun_category "Cube Momentum"
`);
src.cfg.add('mtriggers/SP/01_the-courtesy-call/06_future-starter', `sar_speedrun_cc_start "Future Starter" map=sp_a1_intro6 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=room_1_entry_door-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Portal Trigger" entity targetname=room_1_fling_portal_activate_rl inputname=Trigger
sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Second Room" entity targetname=music.sp_a1_intro6 inputname=PlaySound
sar_speedrun_cc_rule "Second Button Activation" entity targetname=button_2-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a1_intro6" sar_speedrun_category "Future Starter"
`);
src.cfg.add('mtriggers/SP/01_the-courtesy-call/07_secret-panel', `sar_speedrun_cc_start "Secret Panel" map=sp_a1_intro7 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Door Passthrough" entity targetname=ceiling_drips_2_particles inputname=Start
sar_speedrun_cc_rule "Waffle Shot" portal center=-2368,300,1500 size=5,100,300 angle=0
sar_speedrun_cc_rule "Transition Trigger" entity targetname=transition_airlock_door_close_rl inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a1_intro7" sar_speedrun_category "Secret Panel"
`);
src.cfg.add('mtriggers/SP/01_the-courtesy-call/08_wakeup', `sar_speedrun_cc_start "Wakeup" map=sp_a1_wakeup action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=training_door inputname=Open
sar_speedrun_cc_rule "Mid Entry" zone center=8201.53,1215.7,480.03 size=20,200,200 angle=0
sar_speedrun_cc_rule "Drop" zone center=10791.87,1305.97,-335.96 size=500,500,25 angle=0
sar_speedrun_cc_rule "Catwalk Dialogue" entity targetname=@glados inputname=RunScriptCode "parameter=sp_a1_wakeup_Do_Not_Look_Down()"
sar_speedrun_cc_rule "Elevator Dialogue" entity targetname=@glados inputname=RunScriptCode "parameter=sp_a1_wakeup_This_Is_Breaker_Room()"
sar_speedrun_cc_rule "Wheatley" entity targetname=socket_powered_rl inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a1_wakeup" sar_speedrun_category "Wakeup"
`);
src.cfg.add('mtriggers/SP/01_the-courtesy-call/09_incinerator', `sar_speedrun_cc_start "Incinerator" map=sp_a2_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Incinerator Room" entity targetname=chute_1_relay inputname=Trigger
sar_speedrun_cc_rule "Mid Room" entity targetname=incinerator_portal inputname=SetFadeEndDistance
sar_speedrun_cc_rule "Portal Gun Grab" entity targetname=pickup_portalgun_relay inputname=Trigger
sar_speedrun_cc_rule "Seamshot" portal center=-740,843,-10760 size=128,128,10 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_intro" sar_speedrun_category "Incinerator"
`);
src.cfg.add('mtriggers/SP/02_the-cold-boot/01_laser-intro', `sar_speedrun_cc_start "Laser Intro" map=sp_a2_laser_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Door Entry" entity targetname=start inputname=Trigger
sar_speedrun_cc_rule "Elevator Trigger" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger
sar_speedrun_cc_rule "Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_laser_intro" sar_speedrun_category "Laser Intro"
`);
src.cfg.add('mtriggers/SP/02_the-cold-boot/02_laser-stairs', `sar_speedrun_cc_start "Laser Stairs" map=sp_a2_laser_stairs action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Dropper Trigger" entity targetname=cube_dropper_01-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Button Activation" entity targetname=exit_button-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_laser_stairs" sar_speedrun_category "Laser Stairs"
`);
src.cfg.add('mtriggers/SP/02_the-cold-boot/03_dual-lasers', `sar_speedrun_cc_start "Dual Lasers" map=sp_a2_dual_lasers action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Switch Glitch" entity targetname=door_1-door_open_relay inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_dual_lasers" sar_speedrun_category "Dual Lasers"
`);
src.cfg.add('mtriggers/SP/02_the-cold-boot/04_laser-over-goo', `sar_speedrun_cc_start "Laser Over Goo" map=sp_a2_laser_over_goo action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Panels Trigger" entity targetname=InstanceAuto69-corridor_repair-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_1-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_laser_over_goo" sar_speedrun_category "Laser Over Goo"
`);
src.cfg.add('mtriggers/SP/02_the-cold-boot/05_catapult-intro', `sar_speedrun_cc_start "Catapult Intro" map=sp_a2_catapult_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Cube Push" entity targetname=hallway_sim_go inputname=Trigger
sar_speedrun_cc_rule "Catapult Trigger" entity targetname=catapult_target_relay inputname=Trigger
sar_speedrun_cc_rule "Second Catapult Trigger" entity targetname=launch_sound2b inputname=PlaySound
sar_speedrun_cc_rule "Wall Portal" zone center=-32.28,-1382.97,-159.77 size=448.43,113.99,320.45 angle=0
sar_speedrun_cc_rule "Door Passthrough" entity targetname=departure_elevator-blocked_elevator_tube_anim inputname=Trigger
sar_speedrun_cc_rule "Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_catapult_intro" sar_speedrun_category "Catapult Intro"
`);
src.cfg.add('mtriggers/SP/02_the-cold-boot/06_trust-fling', `sar_speedrun_cc_start "Trust Fling" map=sp_a2_trust_fling action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Panels Trigger" entity targetname=wall_panel_1-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Catapult Trigger" entity targetname=flingroom_1_circular_catapult_1_wav_1 inputname=PlaySound
sar_speedrun_cc_rule "Button Press" entity targetname=first_press_relay inputname=Trigger
sar_speedrun_cc_rule "Portal Passthrough" zone center=-107.03,-832.06,383.4 size=41.87,255.82,254.02 angle=0
sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_trust_fling" sar_speedrun_category "Trust Fling"
`);
src.cfg.add('mtriggers/SP/02_the-cold-boot/07_pit-flings', `sar_speedrun_cc_start "Pit Flings" map=sp_a2_pit_flings action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Room Entry" entity targetname=player_in_pit_branch inputname=SetValue
sar_speedrun_cc_rule "Platform Entry" entity targetname=exit_ledge_player_clip inputname=Kill
sar_speedrun_cc_rule "End Door" entity targetname=SAVE_CUBE inputname=FireEvent
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_pit_flings" sar_speedrun_category "Pit Flings"
`);
src.cfg.add('mtriggers/SP/02_the-cold-boot/08_fizzler-intro', `sar_speedrun_cc_start "Fizzler Intro" map=sp_a2_fizzler_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Panels Trigger" entity targetname=light_shadowed_01 inputname=TurnOn
sar_speedrun_cc_rule "Laser Receiver" entity targetname=@exit_door-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_fizzler_intro" sar_speedrun_category "Fizzler Intro"
`);
src.cfg.add('mtriggers/SP/03_the-return/01_ceiling-catapult', `sar_speedrun_cc_start "Ceiling Catapult" map=sp_a2_sphere_peek action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Catapult" entity targetname=launch_sound2b inputname=PlaySound
sar_speedrun_cc_rule "Button Press" entity targetname=box_button inputname=Use
sar_speedrun_cc_rule "Cube Grab" entity targetname=reflectocube_dropper_box inputname=Use
sar_speedrun_cc_rule "Laser Receiver" entity targetname=@exit_door-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_sphere_peek" sar_speedrun_category "Ceiling Catapult"
`);
src.cfg.add('mtriggers/SP/03_the-return/02_ricochet', `sar_speedrun_cc_start "Ricochet" map=sp_a2_ricochet action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=entry_music inputname=PlaySound
sar_speedrun_cc_rule "Cube Area" entity targetname=juggled_cube_music inputname=PlaySound
sar_speedrun_cc_rule "Catapult Trigger" entity targetname=floor_catapult_1_sound inputname=PlaySound
sar_speedrun_cc_rule "Ending Area" zone center=3357.7,1088.05,-63.97 size=123.03,383.85,895.99 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_ricochet" sar_speedrun_category "Ricochet"
`);
src.cfg.add('mtriggers/SP/03_the-return/03_bridge-intro', `sar_speedrun_cc_start "Bridge Intro" map=sp_a2_bridge_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_52-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Button Press" entity targetname=box_dropper_01-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Cube Portal Passthrough" entity targetname=autosave inputname=SaveDangerous
sar_speedrun_cc_rule "Player Portal Passthrough" zone center=756.05,63.97,-385.04 size=23.84,127.87,253.99 angle=0
sar_speedrun_cc_rule "End Wall" zone center=192.03,560.02,128.3 size=127.88,31.91,254.69 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_bridge_intro" sar_speedrun_category "Bridge Intro"
`);
src.cfg.add('mtriggers/SP/03_the-return/04_bridge-the-gap', `sar_speedrun_cc_start "Bridge The Gap" map=sp_a2_bridge_the_gap action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_bridge_the_gap" sar_speedrun_category "Bridge The Gap"
`);
src.cfg.add('mtriggers/SP/03_the-return/05_turret-intro', `sar_speedrun_cc_start "Turret Intro" map=sp_a2_turret_intro action=split

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

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_turret_intro" sar_speedrun_category "Turret Intro"
`);
src.cfg.add('mtriggers/SP/03_the-return/06_laser-relays', `sar_speedrun_cc_start "Laser Relays" map=sp_a2_laser_relays action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Floor Panels Trigger" entity targetname=animset01_start_rl inputname=Trigger
sar_speedrun_cc_rule "Laser Switch Glitch" entity targetname=relay3_powered_branch inputname=SetValue
sar_speedrun_cc_rule "Door Entry" zone center=-320.25,-1071.59,63.66 size=127.88,32.77,127.25 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_laser_relays" sar_speedrun_category "Laser Relays"
`);
src.cfg.add('mtriggers/SP/03_the-return/07_turret-blocker', `sar_speedrun_cc_start "Turret Blocker" map=sp_a2_turret_blocker action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=info_sign-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Turret Boost" zone center=-624,192,192 size=32,128,128 angle=0
sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay9
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_turret_blocker" sar_speedrun_category "Turret Blocker"
`);
src.cfg.add('mtriggers/SP/03_the-return/08_laser-vs-turret', `sar_speedrun_cc_start "Laser vs Turret" map=sp_a2_laser_vs_turret action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
// ROUTE VARIATION: next 4 not used in record route
sar_speedrun_cc_rule "Floor Button" entity targetname=button_1_pressed inputname=Trigger
sar_speedrun_cc_rule "Cube Grab" entity targetname=room_10_box2 inputname=Use
sar_speedrun_cc_rule "Laser Cube Grab" entity targetname=room_10_box3 inputname=Use
sar_speedrun_cc_rule "Ending Area" zone center=186,447,320 size=15,125,150 angle=0
// Next 3 only used in record route
sar_speedrun_cc_rule "OOB" zone center=153.49,-234.07,540.65 size=178.91,159.9,87.15 angle=0
sar_speedrun_cc_rule "Lower Landing" zone center=336.95,-264.22,287.42 size=61.89,111.5,122.08 angle=0
sar_speedrun_cc_rule "Re-Entry" zone center=360.34,-359.72,135.35 size=303.26,81.36,46.63 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_laser_vs_turret" sar_speedrun_category "Laser vs Turret"
`);
src.cfg.add('mtriggers/SP/03_the-return/09_pull-the-rug', `sar_speedrun_cc_start "Pull The Rug" map=sp_a2_pull_the_rug action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Room Entry" entity targetname=change_to_error_state_02 inputname=Trigger
sar_speedrun_cc_rule "Button Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Lift Peak" entity targetname=@elevator_turret_waterfall_rl inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_pull_the_rug" sar_speedrun_category "Pull The Rug"
`);
src.cfg.add('mtriggers/SP/04_the-surprise/01_column-blocker', `sar_speedrun_cc_start "Column Blocker" map=sp_a2_column_blocker action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Cutscene Trigger" entity targetname=blackout_lights_off_fade inputname=Fade
// ROUTE VARIATION: next two not used in record route
sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper_1-cube_dropper_relay inputname=Trigger
sar_speedrun_cc_rule "Door Activation" entity targetname=@exit_door-proxy inputname=OnProxyRelay2
// Next two only used in record route
sar_speedrun_cc_rule "Observation Room" zone center=-848.5,-33.1,352.35 size=126.94,61.49,190.99 angle=0
sar_speedrun_cc_rule "OOB" zone center=-900,250,300 size=150,120,300 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_column_blocker" sar_speedrun_category "Column Blocker"
`);
src.cfg.add('mtriggers/SP/04_the-surprise/02_laser-chaining', `sar_speedrun_cc_start "Laser Chaining" map=sp_a2_laser_chaining action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Door Entry" entity targetname=music.sp_a2_laser_chaining_b1 inputname=PlaySound
sar_speedrun_cc_rule "Wall Portal" zone center=-367.28,-637.15,640.2 size=33.38,377.5,255.54 angle=0
sar_speedrun_cc_rule "Door Activation" entity targetname=relay_02_indicator inputname=Check
sar_speedrun_cc_rule "Catapult" zone center=548.04,63.63,-11.47 size=151.87,142.84,104.99 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_laser_chaining" sar_speedrun_category "Laser Chaining"
`);
src.cfg.add('mtriggers/SP/04_the-surprise/03_triple-laser', `sar_speedrun_cc_start "Triple Laser" map=sp_a2_triple_laser action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Portal Entry" zone center=7197.16,-5336.25,137.26 size=58.26,123.87,237.42 angle=0
sar_speedrun_cc_rule "Switch Glitch" entity targetname=@exit_door-testchamber_door inputname=Open
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_triple_laser" sar_speedrun_category "Triple Laser"
`);
src.cfg.add('mtriggers/SP/04_the-surprise/04_jailbreak', `sar_speedrun_cc_start "Jailbreak" map=sp_a2_bts1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=chamber_door-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Button Press" entity targetname=jailbreak_chamber_lit-jailbreak_chamber_lit_cube_dropper-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Railing" zone center=-2825,-1679.5,45 size=62,297,110 angle=0
sar_speedrun_cc_rule "Stairboost" zone center=-465.07,-635.72,72 size=118.08,161.22,239.94 angle=0
sar_speedrun_cc_rule "Last Corner" zone center=818,-989,-11 size=68,132,106 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_bts1" sar_speedrun_category "Jailbreak"
`);
src.cfg.add('mtriggers/SP/04_the-surprise/05_escape', `sar_speedrun_cc_start "Escape" map=sp_a2_bts2 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Turret Trigger" entity targetname=player_clip inputname=Enable
sar_speedrun_cc_rule "Portal Passthrough" entity targetname=first_turret_arena_music_stop inputname=Trigger
sar_speedrun_cc_rule "Stairs" entity targetname=destruction_flashlight_o1 inputname=TurnOn
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_bts2" sar_speedrun_category "Escape"
`);
src.cfg.add('mtriggers/SP/05_the-escape/01_turret-factory', `sar_speedrun_cc_start "Turret Factory" map=sp_a2_bts3 action=split

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

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_bts3" sar_speedrun_category "Turret Factory"
`);
src.cfg.add('mtriggers/SP/05_the-escape/02_turret-sabotage', `sar_speedrun_cc_start "Turret Sabotage" map=sp_a2_bts4 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Second Conveyor" entity targetname=light_01 inputname=TurnOn
sar_speedrun_cc_rule "Second Room" entity targetname=proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Hallway" entity targetname=dim_wheatley_flashlight inputname=Enable
sar_speedrun_cc_rule "Classroom" entity targetname=lookat_fair_doorway_relay inputname=Trigger
sar_speedrun_cc_rule "Rubble Room" entity targetname=@music_sp_a2_bts4_b3 inputname=StopSound
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_bts4" sar_speedrun_category "Turret Sabotage"
`);
src.cfg.add('mtriggers/SP/05_the-escape/03_neurotoxin-sabotage', `sar_speedrun_cc_start "Neurotoxin Sabotage" map=sp_a2_bts5 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=airlock_door_01-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Airlock Room" entity targetname=airlock_door_01-proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Lift" entity targetname=lift_blocker inputname=Enable
sar_speedrun_cc_rule "Button Press" entity targetname=button_relay inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_bts5" sar_speedrun_category "Neurotoxin Sabotage"
`);
src.cfg.add('mtriggers/SP/05_the-escape/04_core', `sar_speedrun_cc_start "Core" map=sp_a2_core action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "First Room" entity targetname=music_sp_a2_core_b1 inputname=PlaySound
sar_speedrun_cc_rule "Door Trap" entity targetname=rv_trap_fake_door_handle inputname=open
sar_speedrun_cc_rule "Vault" entity targetname=rv_player_clip inputname=Kill
sar_speedrun_cc_rule "Button Press" entity targetname=button_press_relay inputname=Trigger
sar_speedrun_cc_rule "Cutscene Activation" entity targetname=begin_core_swap_relay inputname=Trigger
sar_speedrun_cc_rule "Lift Cutscene Trigger" entity targetname=elevator_exit_door_close_relay inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a2_core" sar_speedrun_category "Core"
`);
src.cfg.add('mtriggers/SP/06_the-fall/01_underground', `sar_speedrun_cc_start "Underground" map=sp_a3_01 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Second Portal Passthrough" entity targetname=ambient_sp_a3_01_b3 inputname=PlaySound
sar_speedrun_cc_rule "Catwalk" entity targetname=helper_01 inputname=Disable
sar_speedrun_cc_rule "Ravine" entity targetname=ambient_sp_a3_01_b5 inputname=PlaySound
sar_speedrun_cc_rule "Long Shot Portal" portal center=4879.93,4269.74,-544 size=127.23,132.32,5 angle=0
sar_speedrun_cc_rule "Portal Entry" zone center=4879.93,4269.74,-509.76 size=127.23,132.32,68.42 angle=0
sar_speedrun_cc_rule "First Button Press" entity targetname=timer2b-TimerStart inputname=OnProxyRelay1
sar_speedrun_cc_rule "Second Button Press" entity targetname=timer1b-TimerStart inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_01" sar_speedrun_category "Underground"
`);
src.cfg.add('mtriggers/SP/06_the-fall/02_cave-johnson', `sar_speedrun_cc_start "Cave Johnson" map=sp_a3_03 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Catwalk Portal Entry" zone center=-6107.5,279.05,-4800.82 size=72.95,300.99,382.31 angle=0
sar_speedrun_cc_rule "Portal Stand" zone center=-4976.03,1113.87,-2644.6 size=103.94,37.67,138.07 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_03" sar_speedrun_category "Cave Johnson"
`);
src.cfg.add('mtriggers/SP/06_the-fall/03_repulsion-intro', `sar_speedrun_cc_start "Repulsion Intro" map=sp_a3_jump_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Lights Trigger" entity targetname=@dark_column_flicker_start inputname=Trigger
sar_speedrun_cc_rule "First Room" entity targetname=ambient_sp_a3_jump_intro_b1 inputname=PlaySound
// ROUTE VARIATION: "Seamshot" and "Second Room Entry" not used in record route
sar_speedrun_cc_rule "Seamshot" portal center=-1390,910,1020 size=20,125,150 angle=0
sar_speedrun_cc_rule "Dropper Activation" entity targetname=room_1_cube_dropper-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Second Room Entry" zone center=-1664,1709,864 size=125,20,150 angle=0
sar_speedrun_cc_rule "Second Floor" zone center=-1172.3,1152,1311.71 size=168.45,255.94,254.77 angle=0
sar_speedrun_cc_rule "Last Portal Passthrough" zone center=-1631.89,797.21,1634.26 size=162.59,58.36,157.63 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_jump_intro" sar_speedrun_category "Repulsion Intro"
`);
src.cfg.add('mtriggers/SP/06_the-fall/04_bomb-flings', `sar_speedrun_cc_start "Bomb Flings" map=sp_a3_bomb_flings action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Railing" zone center=-256.1,335.97,-1281.08 size=255.42,351.87,253.79 angle=0
sar_speedrun_cc_rule "Gel Drop" entity targetname=trigger_to_drop inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_bomb_flings" sar_speedrun_category "Bomb Flings"
`);
src.cfg.add('mtriggers/SP/06_the-fall/05_crazy-box', `sar_speedrun_cc_start "Crazy Box" map=sp_a3_crazy_box action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "First Room" entity targetname=ambient_sp_a3_crazy_box_b1 inputname=PlaySound
sar_speedrun_cc_rule "Seamshot" portal center=896,-1024,2048 size=192,320,5 angle=0
sar_speedrun_cc_rule "Cube Grab" entity targetname=achievement_crazy_box_entity inputname=FireEvent
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_crazy_box" sar_speedrun_category "Crazy Box"
`);
src.cfg.add('mtriggers/SP/06_the-fall/06_potatos', `sar_speedrun_cc_start "PotatOS" map=sp_a3_transition01 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door" entity targetname=pumproom_door_bottom_button inputname=Lock
sar_speedrun_cc_rule "Lever" entity targetname=pump_machine_relay inputname=trigger
sar_speedrun_cc_rule "Second Door" entity targetname=pumproom_door_top_button inputname=Lock
sar_speedrun_cc_rule "Lone Panel" entity targetname=music_sp_a3_transition01_b4 inputname=PlaySound
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_transition01" sar_speedrun_category "PotatOS"
`);
src.cfg.add('mtriggers/SP/07_the-reunion/01_propulsion-intro', `sar_speedrun_cc_start "Propulsion Intro" map=sp_a3_speed_ramp action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Long Shot" portal center=-68,-639.96,896.17 size=5,127.75,127.29 angle=0
sar_speedrun_cc_rule "Ending Portal Entry" zone center=-38.72,-639.96,896.17 size=58.49,127.75,127.29 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_speed_ramp" sar_speedrun_category "Propulsion Intro"
`);
src.cfg.add('mtriggers/SP/07_the-reunion/02_propulsion-flings', `sar_speedrun_cc_start "Propulsion Flings" map=sp_a3_speed_flings action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Blue Gel Bounce" zone center=2815.6,-109.17,-303.28 size=192.37,153.96,97.37 angle=0
sar_speedrun_cc_rule "Ramp" zone center=3358.64,1153,127.56 size=61.32,253.94,378.9 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_speed_flings" sar_speedrun_category "Propulsion Flings"
`);
src.cfg.add('mtriggers/SP/07_the-reunion/03_conversion-intro', `sar_speedrun_cc_start "Conversion Intro" map=sp_a3_portal_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "First Room" entity targetname=1970s_door1door_lower inputname=Close
sar_speedrun_cc_rule "Balcony" entity targetname=1970s_door2_door_lower inputname=Close
sar_speedrun_cc_rule "Door Trigger" entity targetname=highdoor_door_upper inputname=Open
sar_speedrun_cc_rule "Second Door Open" entity targetname=liftshaft_entrance_door-door_open inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_portal_intro" sar_speedrun_category "Conversion Intro"
`);
src.cfg.add('mtriggers/SP/07_the-reunion/04_three-gels', `sar_speedrun_cc_start "Three Gels" map=sp_a3_end action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Fling" zone center=-1105.75,256.12,-3879.9 size=99.12,191.69,127.73 angle=0
sar_speedrun_cc_rule "Ending Fling" entity targetname=helper01 inputname=Disable
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a3_end" sar_speedrun_category "Three Gels"
`);
src.cfg.add('mtriggers/SP/08_the-itch/01_test', `sar_speedrun_cc_start "Test" map=sp_a4_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Start Dialogue" zone center=-992,-480,320 size=128,128,192 angle=0
sar_speedrun_cc_rule "Cube Throw" entity targetname=@exit_door1-player_in_door_trigger inputname=Enable
sar_speedrun_cc_rule "Enter Elevator" entity targetname=test_chamber1_slow_relay inputname=Trigger
sar_speedrun_cc_rule "First Solve" entity targetname=@exit_door2-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Trigger Elevator" entity targetname=departure_elevator-logic_source_elevator_door_open inputname=Trigger
sar_speedrun_cc_rule "Elevator Entry" entity targetname=departure_elevator-elevator_doorclose_playerclip inputname=Enable
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_intro" sar_speedrun_category "Test"
`);
src.cfg.add('mtriggers/SP/08_the-itch/02_funnel-intro', `sar_speedrun_cc_start "Funnel Intro" map=sp_a4_tb_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Zone" zone center=2015.92,733.66,-270 size=64.1,580.63,600 angle=0
sar_speedrun_cc_rule "Reportal" zone center=1312.19,384.22,415.43 size=64.33,256.38,253.77 angle=0
sar_speedrun_cc_rule "Door Activation" entity targetname=button_1_pressed inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_tb_intro" sar_speedrun_category "Funnel Intro"
`);
src.cfg.add('mtriggers/SP/08_the-itch/03_ceiling-button', `sar_speedrun_cc_start "Ceiling Button" map=sp_a4_tb_trust_drop action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Drop" entity targetname=music3 inputname=PlaySound
sar_speedrun_cc_rule "Crouch Fly" fly
sar_speedrun_cc_rule "Button Press" entity targetname=dropper-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Door Activation" entity targetname=button_1-proxy inputname=OnProxyRelay5
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_tb_trust_drop" sar_speedrun_category "Ceiling Button"
`);
src.cfg.add('mtriggers/SP/08_the-itch/04_wall-button', `sar_speedrun_cc_start "Wall Button" map=sp_a4_tb_wall_button action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Chamber Movement" entity targetname=relay_pre_chamber_move inputname=Trigger
sar_speedrun_cc_rule "Button Press" entity targetname=func_brush_indicators_orange inputname=Enable
sar_speedrun_cc_rule "End Area" entity targetname=trigger_solve_warning inputname=Enable
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_tb_wall_button" sar_speedrun_category "Wall Button"
`);
src.cfg.add('mtriggers/SP/08_the-itch/05_polarity', `sar_speedrun_cc_start "Polarity" map=sp_a4_tb_polarity action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Panels Trigger" entity targetname=falling_tile_1_relay inputname=Trigger
sar_speedrun_cc_rule "Crouch Fly" fly
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_tb_polarity" sar_speedrun_category "Polarity"
`);
src.cfg.add('mtriggers/SP/08_the-itch/06_funnel-catch', `sar_speedrun_cc_start "Funnel Catch" map=sp_a4_tb_catch action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Door Entry" entity targetname=light_shadowed_01 inputname=TurnOn
sar_speedrun_cc_rule "Button Press" entity targetname=indicator_lights_flicker_rl inputname=Trigger
sar_speedrun_cc_rule "Door Activation" entity targetname=puzzle_completed_relay inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_tb_catch" sar_speedrun_category "Funnel Catch"
`);
src.cfg.add('mtriggers/SP/08_the-itch/07_stop-the-box', `sar_speedrun_cc_start "Stop The Box" map=sp_a4_stop_the_box action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=door_0-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Button Press" entity targetname=cube_dropper-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Door Activation" entity targetname=button_1-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_stop_the_box" sar_speedrun_category "Stop The Box"
`);
src.cfg.add('mtriggers/SP/08_the-itch/08_laser-catapult', `sar_speedrun_cc_start "Laser Catapult" map=sp_a4_laser_catapult action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=@entry_door-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Test Start" entity targetname=diag_laser_catapult_test_start inputname=Trigger
// ROUTE VARIATION: not used in record route
sar_speedrun_cc_rule "Faith Plate Hit" entity targetname=launch_arm inputname=SetAnimation
sar_speedrun_cc_rule "Floor Portal Passthrough" zone center=-255.88,-319.92,40.65 size=127.91,127.98,65.24 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_laser_catapult" sar_speedrun_category "Laser Catapult"
`);
src.cfg.add('mtriggers/SP/08_the-itch/09_laser-platform', `sar_speedrun_cc_start "Laser Platform" map=sp_a4_laser_platform action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=entrance_door-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Button Press" entity targetname=box_drop_relay inputname=Trigger
sar_speedrun_cc_rule "Door Activation" entity targetname=exit_check inputname=Check
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_laser_platform" sar_speedrun_category "Laser Platform"
`);
src.cfg.add('mtriggers/SP/08_the-itch/10_propulsion-catch', `sar_speedrun_cc_start "Propulsion Catch" map=sp_a4_speed_tb_catch action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Chamber Trigger" zone center=-608.05,1675.93,-127.98 size=287.79,104.09,127.98 angle=0
// ROUTE VARIATION: not used in record route
sar_speedrun_cc_rule "Crouch Fly" fly
sar_speedrun_cc_rule "Ramp" zone center=-977.54,1322.84,153.57 size=48.93,362.86,193.93 angle=0
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_speed_tb_catch" sar_speedrun_category "Propulsion Catch"
`);
src.cfg.add('mtriggers/SP/08_the-itch/11_repulsion-polarity', `sar_speedrun_cc_start "Repulsion Polarity" map=sp_a4_jump_polarity action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Pipe Trigger" entity targetname=diag_jump_polarity_sorry inputname=Trigger
sar_speedrun_cc_rule "Crouch Fly" fly
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_jump_polarity" sar_speedrun_category "Repulsion Polarity"
`);
src.cfg.add('mtriggers/SP/09_the-part-where-he-kills-you/01_finale-1', `sar_speedrun_cc_start "Finale 1" map=sp_a4_finale1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Catapult Trigger" entity targetname=launch_sound1 inputname=PlaySound
sar_speedrun_cc_rule "Second Catapult Trigger" entity targetname=music03 inputname=PlaySound
sar_speedrun_cc_rule "Door Trigger" entity targetname=liftshaft_airlock_exit-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Second Portal Passthrough" entity targetname=music06 inputname=PlaySound
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_finale1" sar_speedrun_category "Finale 1"
`);
src.cfg.add('mtriggers/SP/09_the-part-where-he-kills-you/02_finale-2', `sar_speedrun_cc_start "Finale 2" map=sp_a4_finale2 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Chamber Trigger" entity targetname=shake_chamber_move inputname=StartShake
sar_speedrun_cc_rule "Door Trigger" entity targetname=walkway_push inputname=Disable
// ROUTE VARIATION: not used in record route
sar_speedrun_cc_rule "Crouch Fly" fly
sar_speedrun_cc_rule "Second Door Trigger" entity targetname=bts_door_2-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Last Room" entity targetname=light_shadowed_05 inputname=TurnOn
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_finale2" sar_speedrun_category "Finale 2"
`);
src.cfg.add('mtriggers/SP/09_the-part-where-he-kills-you/03_finale-3', `sar_speedrun_cc_start "Finale 3" map=sp_a4_finale3 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Door Trigger" entity targetname=airlock_door2_brush inputname=Disable
// ROUTE VARIATION: not used in record route (super reportal)
sar_speedrun_cc_rule "Bomb Activation" entity targetname=bomb_1_button_relay inputname=Trigger
sar_speedrun_cc_rule "Gel Portal Entry" entity targetname=light_shadowed_02 inputname=TurnOn
sar_speedrun_cc_rule "Funnel" entity targetname=column_smash_a inputname=SetAnimation
sar_speedrun_cc_rule "End Door Trigger" entity targetname=door_lair-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_finale3" sar_speedrun_category "Finale 3"
`);
src.cfg.add('mtriggers/SP/09_the-part-where-he-kills-you/04_finale-4', `sar_speedrun_cc_start "Finale 4" map=sp_a4_finale4 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Elevator" entity targetname=breaker_socket_button inputname=Kill
sar_speedrun_cc_rule "Space Core" entity targetname=socket1_sprite_kill_relay inputname=Trigger
sar_speedrun_cc_rule "Rick" entity targetname=socket2_sprite_kill_relay inputname=Trigger
sar_speedrun_cc_rule "Fact Core" entity targetname=socket3_sprite_kill_relay inputname=Trigger
sar_speedrun_cc_rule "Flags" flags action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=sp_a4_finale4" sar_speedrun_category "Finale 4"
`);
src.cfg.add('mtriggers/Coop/01_team-building/01_doors', `sar_speedrun_cc_start "Doors" map=mp_coop_doors action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Portal" portal center=-10272.05,-544.03,64.15 size=127.9,1,127.99 angle=0
sar_speedrun_cc_rule "Portal Entry" zone center=-10272.05,-574.78,64.15 size=127.9,61.5,127.99 angle=0
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_doors" sar_speedrun_category "Doors"
`);
src.cfg.add('mtriggers/Coop/01_team-building/02_buttons', `sar_speedrun_cc_start "Buttons" map=mp_coop_race_2 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Mid Room Blue" entity targetname=entry_airlock-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Mid Room Orange" entity targetname=entry_airlock-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Dot Button" entity targetname=timer_1 inputname=Start
sar_speedrun_cc_rule "Moon Button" entity targetname=timer_2 inputname=Start
sar_speedrun_cc_rule "Triangle Button" entity targetname=timer_3 inputname=Start
sar_speedrun_cc_rule "X Button" entity targetname=timer_4 inputname=Start
sar_speedrun_cc_rule "Door Activation" entity targetname=button_ball-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_race_2" sar_speedrun_category "Buttons"
`);
src.cfg.add('mtriggers/Coop/01_team-building/03_lasers', `sar_speedrun_cc_start "Lasers" map=mp_coop_laser_2 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Mid Room Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Mid Room Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Stairs" entity targetname=ramp_up_relay1 inputname=Trigger
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_laser_2" sar_speedrun_category "Lasers"
`);
src.cfg.add('mtriggers/Coop/01_team-building/04_rat-maze', `sar_speedrun_cc_start "Rat Maze" map=mp_coop_rat_maze action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Maze" entity targetname=blue_player_points_rl inputname=Enable
sar_speedrun_cc_rule "End Portal" zone center=-254.71,-223.75,-416.04 size=66.51,127.81,127.51 angle=0
sar_speedrun_cc_rule "Door Activation" entity targetname=@exit_door inputname=Open
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_rat_maze" sar_speedrun_category "Rat Maze"
`);
src.cfg.add('mtriggers/Coop/01_team-building/05_laser-crusher', `sar_speedrun_cc_start "Laser Crusher" map=mp_coop_laser_crusher action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "End Hop" zone center=2630.95,-1135.87,80.33 size=77.85,287.33,161.4 angle=0
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_laser_crusher" sar_speedrun_category "Laser Crusher"
`);
src.cfg.add('mtriggers/Coop/01_team-building/06_behind-the-scenes', `sar_speedrun_cc_start "Behind The Scenes" map=mp_coop_teambts action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Lever 1" entity targetname=lever_1-proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Lever 2" entity targetname=lever_2-proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_teambts" sar_speedrun_category "Behind The Scenes"
`);
src.cfg.add('mtriggers/Coop/02_mass-and-velocity/01_flings', `sar_speedrun_cc_start "Flings" map=mp_coop_fling_3 action=split

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

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_fling_3" sar_speedrun_category "Flings"
`);
src.cfg.add('mtriggers/Coop/02_mass-and-velocity/02_infinifling', `sar_speedrun_cc_start "Infinifling" map=mp_coop_infinifling_train action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Button" entity targetname=panel_fling_wall_timer inputname=Start
sar_speedrun_cc_rule "End Area" entity targetname=manager_opendoor inputname=SetStateBTrue
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_infinifling_train" sar_speedrun_category "Infinifling"
`);
src.cfg.add('mtriggers/Coop/02_mass-and-velocity/03_team-retrieval', `sar_speedrun_cc_start "Team Retrieval" map=mp_coop_come_along action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Panels" entity targetname=button1-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Sphere Button" entity targetname=trigger_slimeroom_drop_ball-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Floor Portal" zone center=1023.93,1696.03,-352 size=127.74,127.57,155.94 angle=0
sar_speedrun_cc_rule "Door Activation" entity targetname=button2-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_come_along" sar_speedrun_category "Team Retrieval"
`);
src.cfg.add('mtriggers/Coop/02_mass-and-velocity/04_vertical-flings', `sar_speedrun_cc_start "Vertical Flings" map=mp_coop_fling_1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Portal Entry" zone center=160,-96,-32 size=128,128,64 angle=0
sar_speedrun_cc_rule "Button 1" entity targetname=race_button_1_checkmark inputname=Start
sar_speedrun_cc_rule "Button 2" entity targetname=race_button_2_checkmark inputname=Start
sar_speedrun_cc_rule "Door Activation" entity targetname=ball_button-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_fling_1" sar_speedrun_category "Vertical Flings"
`);
src.cfg.add('mtriggers/Coop/02_mass-and-velocity/05_catapults', `sar_speedrun_cc_start "Catapults" map=mp_coop_catapult_1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Catapult" entity targetname=catapult_3-proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Re-Entry" zone center=830.52,288.26,511.57 size=252.98,190.4,127.08 angle=0
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_catapult_1" sar_speedrun_category "Catapults"
`);
src.cfg.add('mtriggers/Coop/02_mass-and-velocity/06_multifling', `sar_speedrun_cc_start "Multifling" map=mp_coop_multifling_1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Mid Room Door" entity targetname=button2-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Mid Room Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Mid Room Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Cube Button" entity targetname=dropper2-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Catapult" entity targetname=cat4-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Door Activation" entity targetname=button3-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_multifling_1" sar_speedrun_category "Multifling"
`);
src.cfg.add('mtriggers/Coop/02_mass-and-velocity/07_fling-crushers', `sar_speedrun_cc_start "Fling Crushers" map=mp_coop_fling_crushers action=split

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

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_fling_crushers" sar_speedrun_category "Fling Crushers"
`);
src.cfg.add('mtriggers/Coop/02_mass-and-velocity/08_industrial-fan', `sar_speedrun_cc_start "Industrial Fan" map=mp_coop_fan action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Fan Deactivation" entity targetname=@relay_loop_sound_stop inputname=Trigger
sar_speedrun_cc_rule "Door Activation" entity targetname=door-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Final Room Blue" zone center=-640.33,1087.46,233.03 size=8,60.08,114 angle=0 player=0
sar_speedrun_cc_rule "Final Room Orange" zone center=-640.33,1087.46,233.03 size=8,60.08,114 angle=0 player=1
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_fan" sar_speedrun_category "Industrial Fan"
`);
src.cfg.add('mtriggers/Coop/03_hard-light-surfaces/01_cooperative-bridges', `sar_speedrun_cc_start "Cooperative Bridges" map=mp_coop_wall_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Starting Wall" zone center=-95.84,-2366.62,-255.72 size=191.61,130.69,254.67 angle=0
sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Catapult" entity targetname=faith_plate-proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Button" entity targetname=cube_dropper-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Door Activation" entity targetname=button-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_wall_intro" sar_speedrun_category "Cooperative Bridges"
`);
src.cfg.add('mtriggers/Coop/03_hard-light-surfaces/02_bridge-swap', `sar_speedrun_cc_start "Bridge Swap" map=mp_coop_wall_2 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Reportal" zone center=-768,-16,192 size=128,16,128 angle=0 player=1
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_wall_2" sar_speedrun_category "Bridge Swap"
`);
src.cfg.add('mtriggers/Coop/03_hard-light-surfaces/03_fling-block', `sar_speedrun_cc_start "Fling Block" map=mp_coop_catapult_wall_intro action=split

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

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_catapult_wall_intro" sar_speedrun_category "Fling Block"
`);
src.cfg.add('mtriggers/Coop/03_hard-light-surfaces/04_catapult-block', `sar_speedrun_cc_start "Catapult Block" map=mp_coop_wall_block action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Blue Catapult" entity targetname=faith_plate_up-proxy inputname=OnProxyRelay3 player=0
sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Portal Open" portal center=-5984,-1056,-768 size=384,64,448 angle=0
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_wall_block" sar_speedrun_category "Catapult Block"
`);
src.cfg.add('mtriggers/Coop/03_hard-light-surfaces/05_bridge-fling', `sar_speedrun_cc_start "Bridge Fling" map=mp_coop_catapult_2 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Sloped Portal" portal center=1568,208,848 size=128,128,128 angle=0
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_catapult_2" sar_speedrun_category "Bridge Fling"
`);
src.cfg.add('mtriggers/Coop/03_hard-light-surfaces/06_turret-walls', `sar_speedrun_cc_start "Turret Walls" map=mp_coop_turret_walls action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Slope" zone center=-752,-1152,768 size=224,128,384 angle=0
sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=last_airlock-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=last_airlock-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Sphere Button" entity targetname=trigger_slimeroom_drop_ball-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Door Activation" entity targetname=button-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_turret_walls" sar_speedrun_category "Turret Walls"
`);
src.cfg.add('mtriggers/Coop/03_hard-light-surfaces/07_turret-assassin', `sar_speedrun_cc_start "Turret Assassin" map=mp_coop_turret_ball action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Catapult Orange" entity targetname=faith_plate_player-proxy inputname=OnProxyRelay3 player=1
sar_speedrun_cc_rule "Catapult Blue" entity targetname=faith_plate_player-proxy inputname=OnProxyRelay3 player=0
sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=airlock-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=airlock-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Portal Entry Blue" zone center=68.67,1440.08,645.06 size=54.6,191.79,185.48 angle=0 player=0
sar_speedrun_cc_rule "Portal Entry Orange" zone center=68.67,1440.08,645.06 size=54.6,191.79,185.48 angle=0 player=1
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_turret_ball" sar_speedrun_category "Turret Assassin"
`);
src.cfg.add('mtriggers/Coop/03_hard-light-surfaces/08_bridge-testing', `sar_speedrun_cc_start "Bridge Testing" map=mp_coop_wall_5 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "First Room" entity targetname=Ptemplate_ball_training inputname=ForceSpawn
sar_speedrun_cc_rule "Door Activation" entity targetname=power1-ptemplate_ball_door_1 inputname=ForceSpawn
sar_speedrun_cc_rule "Door Activation 2" entity targetname=power2-ptemplate_ball_door_1 inputname=ForceSpawn
sar_speedrun_cc_rule "Door Activation 3" entity targetname=camera_door_4-security_3_door_left inputname=Open
sar_speedrun_cc_rule "Strafe Portal Blue" zone center=576,-2304,64 size=128,128,128 angle=0 player=0
sar_speedrun_cc_rule "Strafe Portal Orange" zone center=576,-2304,64 size=128,128,128 angle=0 player=1
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_wall_5" sar_speedrun_category "Bridge Testing"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/01_cooperative-funnels', `sar_speedrun_cc_start "Cooperative Funnels" map=mp_coop_tbeam_redirect action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Wall Button" entity targetname=button_platform inputname=pressin
sar_speedrun_cc_rule "Portal Shot" portal center=-516,896,448 size=64,128,128 angle=0
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_redirect" sar_speedrun_category "Cooperative Funnels"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/02_funnel-drill', `sar_speedrun_cc_start "Funnel Drill" map=mp_coop_tbeam_drill action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Catapult" entity targetname=catapult-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Replace" portal center=1824,704,32 size=192,128,64 angle=0 player=1
sar_speedrun_cc_rule "Sphere Button" entity targetname=proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Ball Block" entity targetname=exit_enable inputname=Trigger
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_drill" sar_speedrun_category "Funnel Drill"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/03_funnel-catch-coop', `sar_speedrun_cc_start "Funnel Catch Coop" map=mp_coop_tbeam_catch_grind_1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Ground" zone center=-96,-2848,-576 size=100,100,50 angle=0 player=1
sar_speedrun_cc_rule "Portal" portal center=-384,-1151.25,250 size=127.38,127.38,25 angle=0
sar_speedrun_cc_rule "Wall Portal" portal center=-477.97,-1759.98,-192.2 size=10,127.23,127.38 angle=0
sar_speedrun_cc_rule "Wall Portal Exit" zone center=-377.97,-1759.98,-192.2 size=200,127.23,127.38 angle=0
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_catch_grind_1" sar_speedrun_category "Funnel Catch Coop"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/04_funnel-laser', `sar_speedrun_cc_start "Funnel Laser" map=mp_coop_tbeam_laser_1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Catapult" entity targetname=faithplate-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_laser_1" sar_speedrun_category "Funnel Laser"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/05_cooperative-polarity', `sar_speedrun_cc_start "Cooperative Polarity" map=mp_coop_tbeam_polarity action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_polarity" sar_speedrun_category "Cooperative Polarity"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/06_funnel-hop', `sar_speedrun_cc_start "Funnel Hop" map=mp_coop_tbeam_polarity2 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Crouch Fly Blue" fly player=0
sar_speedrun_cc_rule "Crouch Fly Orange" fly player=1
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_polarity2" sar_speedrun_category "Funnel Hop"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/07_advanced-polarity', `sar_speedrun_cc_start "Advanced Polarity" map=mp_coop_tbeam_polarity3 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Panel Trigger" entity targetname=platform_exit-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_polarity3" sar_speedrun_category "Advanced Polarity"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/08_funnel-maze', `sar_speedrun_cc_start "Funnel Maze" map=mp_coop_tbeam_maze action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Crouch Fly" fly
sar_speedrun_cc_rule "Cube Grab" entity targetname=cube_dropper_box inputname=Use
sar_speedrun_cc_rule "Button Activation" entity targetname=button_2-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_maze" sar_speedrun_category "Funnel Maze"
`);
src.cfg.add('mtriggers/Coop/04_excursion-funnels/09_turret-warehouse', `sar_speedrun_cc_start "Turret Warehouse" map=mp_coop_tbeam_end action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Conveyor Hop" zone center=440.75,-105.61,105.85 size=142.44,434.3,203.13 angle=0
sar_speedrun_cc_rule "Wall Portal Exit" zone center=1760.36,188.87,160 size=319.23,134.2,127.33 angle=0
sar_speedrun_cc_rule "Blue Funnel Exit" entity targetname=relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Orange Funnel Exit" entity targetname=relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tbeam_end" sar_speedrun_category "Turret Warehouse"
`);
src.cfg.add('mtriggers/Coop/05_mobility-gels/01_repulsion-jumps', `sar_speedrun_cc_start "Repulsion Jumps" map=mp_coop_paint_come_along action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Boost" zone center=64,32,344 size=640,448,440 angle=0
sar_speedrun_cc_rule "Final Portal" portal center=32,384,576 size=64,128,128 angle=0
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_come_along" sar_speedrun_category "Repulsion Jumps"
`);
src.cfg.add('mtriggers/Coop/05_mobility-gels/02_double-bounce', `sar_speedrun_cc_start "Double Bounce" map=mp_coop_paint_redirect action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Gel Drop" entity targetname=paint_sprayer inputname=Start
sar_speedrun_cc_rule "Fling Blue" zone center=768,356,-568 size=128,256,32 angle=0 player=0
sar_speedrun_cc_rule "Fling Orange" zone center=768,356,-568 size=128,256,32 angle=0 player=1
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_redirect" sar_speedrun_category "Double Bounce"
`);
src.cfg.add('mtriggers/Coop/05_mobility-gels/03_bridge-repulsion', `sar_speedrun_cc_start "Bridge Repulsion" map=mp_coop_paint_bridge action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Long Shot" portal center=-635,-192,575 size=10,128,128 angle=0
sar_speedrun_cc_rule "Death" entity targetname=blue inputname=Dissolve
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_bridge" sar_speedrun_category "Bridge Repulsion"
`);
src.cfg.add('mtriggers/Coop/05_mobility-gels/04_wall-repulsion', `sar_speedrun_cc_start "Wall Repulsion" map=mp_coop_paint_walljumps action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Middle Room Blue" entity targetname=airlock_1-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Middle Room Orange" entity targetname=airlock_1-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_walljumps" sar_speedrun_category "Wall Repulsion"
`);
src.cfg.add('mtriggers/Coop/05_mobility-gels/05_propulsion-crushers', `sar_speedrun_cc_start "Propulsion Crushers" map=mp_coop_paint_speed_fling action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Button Activation" entity targetname=paint_sprayer1_start inputname=Trigger
sar_speedrun_cc_rule "Portal" portal center=-897.5,127.23,-321.72 size=10,128,128 angle=0
sar_speedrun_cc_rule "Death" entity targetname=blue inputname=Dissolve
sar_speedrun_cc_rule "Door Activation" entity targetname=ball_button-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_speed_fling" sar_speedrun_category "Propulsion Crushers"
`);
src.cfg.add('mtriggers/Coop/05_mobility-gels/06_turret-ninja', `sar_speedrun_cc_start "Turret Ninja" map=mp_coop_paint_red_racer action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Cube Drop" entity targetname=cube_dropper inputname=Trigger
sar_speedrun_cc_rule "Floor Platform" zone center=-1552.37,515.37,-467.6 size=125.8,134.19,88.74 angle=0
sar_speedrun_cc_rule "Gravity Trigger" zone center=-1096,512,310 size=1040,128,100 angle=0
sar_speedrun_cc_rule "Door Activation" entity targetname=team_trigger_door inputname=Enable
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_red_racer" sar_speedrun_category "Turret Ninja"
`);
src.cfg.add('mtriggers/Coop/05_mobility-gels/07_propulsion-retrieval', `sar_speedrun_cc_start "Propulsion Retrieval" map=mp_coop_paint_speed_catch action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Gel Drop" entity targetname=paint_sprayer2_start inputname=Trigger
sar_speedrun_cc_rule "Slanted Portal Exit" zone center=704,566.96,347.91 size=126.93,63.65,110.27 angle=0
sar_speedrun_cc_rule "Panels" entity targetname=platform_button inputname=Press
sar_speedrun_cc_rule "Cube Drop" entity targetname=box_buttons inputname=Press
sar_speedrun_cc_rule "Door Activation" entity targetname=sphere_button-proxy inputname=OnProxyRelay2
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_speed_catch" sar_speedrun_category "Propulsion Retrieval"
`);
src.cfg.add('mtriggers/Coop/05_mobility-gels/08_vault-entrance', `sar_speedrun_cc_start "Vault Entrance" map=mp_coop_paint_longjump_intro action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Second Room Blue" zone center=304,-4547.79,961.06 size=287.95,120.36,125.74 angle=0 player=0
sar_speedrun_cc_rule "Second Room Orange" zone center=304,-4547.79,961.06 size=287.95,120.36,125.74 angle=0 player=1
sar_speedrun_cc_rule "Gel Drop" entity targetname=relay_paint_start_2 inputname=Trigger
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_longjump_intro" sar_speedrun_category "Vault Entrance"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/01_separation', `sar_speedrun_cc_start "Separation" map=mp_coop_separation_1 action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Cube Drop" entity targetname=reflecto_cube_dropper-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Door Activation" entity targetname=camera_triggers inputname=Enable
sar_speedrun_cc_rule "Sphere Drop" entity targetname=dispenser_2-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Button Activation" entity targetname=orange_door_2-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Wall" zone center=2816.02,-3135.98,64.44 size=383.9,127.98,128.66 angle=0
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_separation_1" sar_speedrun_category "Separation"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/02_triple-axis', `sar_speedrun_cc_start "Triple Axis" map=mp_coop_tripleaxis action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Crusher" entity targetname=crusher_sequence_start_rl inputname=Trigger
sar_speedrun_cc_rule "Crouch Fly Blue" fly player=0
sar_speedrun_cc_rule "Crouch Fly Orange" fly player=1
sar_speedrun_cc_rule "Jump Blue" zone center=2432,2272,176 size=256,192,224 angle=0 player=0
sar_speedrun_cc_rule "Jump Orange" zone center=2432,2272,176 size=256,192,224 angle=0 player=1
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_tripleaxis" sar_speedrun_category "Triple Axis"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/03_catapult-catch', `sar_speedrun_cc_start "Catapult Catch" map=mp_coop_catapult_catch action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Cube Area" zone center=976,-416,-192 size=352,160,128 angle=0
sar_speedrun_cc_rule "Door Activation" entity targetname=exit_door-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Passthrough Orange" zone center=354,704,320 size=36,128,128 angle=0 player=1
sar_speedrun_cc_rule "Passthrough Blue" zone center=354,704,320 size=36,128,128 angle=0 player=0
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_catapult_catch" sar_speedrun_category "Catapult Catch"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/04_bridge-gels', `sar_speedrun_cc_start "Bridge Gels" map=mp_coop_2paints_1bridge action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Middle Trigger Blue" entity targetname=entry_airlock-relay_blue_in inputname=Trigger
sar_speedrun_cc_rule "Middle Trigger Orange" entity targetname=entry_airlock-relay_orange_in inputname=Trigger
sar_speedrun_cc_rule "Button Stick" entity targetname=team_trigger_door inputname=Enable
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=chamber_exit_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=chamber_exit_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_2paints_1bridge" sar_speedrun_category "Bridge Gels"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/05_maintenance', `sar_speedrun_cc_start "Maintenance" map=mp_coop_paint_conversion action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Portal Room" zone center=-1378.28,3262.04,182.64 size=187.19,316.02,124.72 angle=0
sar_speedrun_cc_rule "Elevator" zone center=-1873.3,4928.08,-1312.67 size=1054.17,127.79,318.6 angle=0
sar_speedrun_cc_rule "Fall" entity targetname=disassembler_start_relay inputname=Trigger
sar_speedrun_cc_rule "End Area" entity targetname=paint_sprayer_white inputname=Start
sar_speedrun_cc_rule "Stairs" entity targetname=ramp_up_relay inputname=Trigger
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_conversion" sar_speedrun_category "Maintenance"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/06_bridge-catch', `sar_speedrun_cc_start "Bridge Catch" map=mp_coop_bridge_catch action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Button Jump" zone center=146.89,1343.92,14.03 size=37.33,127.5,12 angle=0
sar_speedrun_cc_rule "Right Catapult" entity targetname=catapult_1_wav inputname=PlaySound
sar_speedrun_cc_rule "Left Catapult Blue" entity targetname=catapult_1_wav2 inputname=PlaySound player=0
sar_speedrun_cc_rule "Left Catapult Orange" entity targetname=catapult_1_wav2 inputname=PlaySound player=1
sar_speedrun_cc_rule "Bridge Activation" entity targetname=laser_socketed inputname=SetValue
sar_speedrun_cc_rule "Passthrough Blue" zone center=896,472,896 size=128,80,256 angle=0 player=0
sar_speedrun_cc_rule "Passthrough Orange" zone center=896,472,896 size=128,80,256 angle=0 player=1
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_bridge_catch" sar_speedrun_category "Bridge Catch"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/07_double-lift', `sar_speedrun_cc_start "Double Lift" map=mp_coop_laser_tbeam action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Crouch Fly Blue" fly player=0
sar_speedrun_cc_rule "Crouch Fly Orange" fly player=1
sar_speedrun_cc_rule "End Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "End Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_laser_tbeam" sar_speedrun_category "Double Lift"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/08_gel-maze', `sar_speedrun_cc_start "Gel Maze" map=mp_coop_paint_rat_maze action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Portal Entry" zone center=-573.35,-0.1,703.71 size=69.24,255.73,127.07 angle=0
sar_speedrun_cc_rule "Cube Button" entity targetname=cube_dropper_01-proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Slanted Portal" zone center=575.95,95.71,577.8 size=127.83,56.84,114.41 angle=0
sar_speedrun_cc_rule "Door Activation" entity targetname=@exit_door inputname=Open
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_rat_maze" sar_speedrun_category "Gel Maze"
`);
src.cfg.add('mtriggers/Coop/06_art-therapy/09_crazier-box', `sar_speedrun_cc_start "Crazier Box" map=mp_coop_paint_crazy_box action=split

sar_speedrun_cc_rule "Start" load action=force_start
sar_speedrun_cc_rule "Cube Preserve" zone center=64,416,768 size=64,192,256 angle=0 player=1
sar_speedrun_cc_rule "Cube Receptacle" entity targetname=team_trigger_door inputname=Enable
sar_speedrun_cc_rule "Door Trigger Blue" entity targetname=team_door-team_proxy inputname=OnProxyRelay1
sar_speedrun_cc_rule "Door Trigger Orange" entity targetname=team_door-team_proxy inputname=OnProxyRelay3
sar_speedrun_cc_rule "Flags 1" flags
sar_speedrun_cc_rule "Flags 2" flags "ccafter=Flags 1" action=stop

sar_speedrun_cc_finish

sar_on_load cond "!var:no_mtriggers=1 & cm & map=mp_coop_paint_crazy_box" sar_speedrun_category "Crazier Box"
`);
})();