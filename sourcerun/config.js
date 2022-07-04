(function() {
if (!src) return false;
src.cfg.add('autoexec', `// srconfigs 0.7.0 - autoexec

// +============= IMPORTANT  NOTICE =============+
// | Unless you know what you're doing, DO NOT   |
// | MODIFY THIS FILE!                           |
// | Chances are, any config changes you're      |
// | trying to make should be done in extra.cfg, |
// | *not* here. Otherwise, easily updating      |
// | srconfigs without losing your changes will  |
// | become near-impossible. Check the README    |
// | for more details.                           |
// +=============================================+

// Load SAR
plugin_load sar

// Update SAR if needed
sar_update pre exit
// sar_update release exit

sar_function srconfigs_about "echo $'srconfigs are a set of config files for speedrunning Portal 2 and its mods.$'; echo $'More information at: https://github.com/p2sr/srconfigs$'; echo $'Version: 0.7.0$'"

// Handy svar so things can detect srconfigs if they need
svar_set __srconfigs 1

// Disable a weird HUD that can appear in demo playback
sar_disable_coop_score_hud 1

// Blacklist all commands from demo playback; they just cause issues
sar_demo_blacklist_all 1

// Stop the game from going to sleep when it loses focus
sar_disable_no_focus_sleep 1
cond "!game=reloaded" sar_on_config_exec snd_mute_losefocus 0

// Allow OOB vision
r_portal_use_pvs_optimization 0

// Fix portal rendering
r_portal_fastpath 0
r_PortalTestEnts 0

// Fix Mel / Speedrun Mod crashes
save_screenshot 0

// Developer 1 settings; the actual developer mode is set in
// per-category configs
contimes 6
phys_penetration_error_time 0

// Helper alias for saveload binds
sar_function saveload "save $1; load $1"

// This alias is deprecated, but I'll keep it around for a bit for back
// compat. This is functionally equivalent as 'load' doesn't work in
// coop anyway
sar_alias do_load non_cm_only load

// Reloaded-specific commands
cond "game=reloaded" hud_saytext_time 0
cond "game=reloaded" alias +attack3     "ent_fire @caller Trigger"
cond "game=reloaded" alias -attack3     nop
cond "game=reloaded" alias +remote_view "ent_fire @toggle_ghosting Trigger"
cond "game=reloaded" alias -remote_view nop

// persistent svar defaults
sar_function __set_if_empty "sar_expand svar_set __tmp $'x$$$1$'; cond $'var:__tmp=x$' svar_set $1 $'$2$'"
sar_function __set_if_empty_persist "__set_if_empty $1 $'$2$'; svar_persist $1"
__set_if_empty_persist      no_dialogue_toasts 0
__set_if_empty_persist   no_dialogue_toasts_sp 0
__set_if_empty_persist no_dialogue_toasts_coop 0
__set_if_empty_persist    no_taunt_toasts_coop 0
__set_if_empty_persist      show_map_name_coop 1
__set_if_empty_persist        show_blank_fades 1
__set_if_empty_persist      coop_cm_enable_hud 0
__set_if_empty_persist      coop_no_stopvideos 0
__set_if_empty_persist      coop_no_remoteview 0
__set_if_empty_persist      cm_attempt_counter 1
__set_if_empty_persist         cm_ghost_server -1
__set_if_empty_persist         cm_keep_pb_only 0
__set_if_empty_persist  chapter_il_betsrighter 1
__set_if_empty_persist          chapter_il_fly 1
__set_if_empty_persist          useswap_invert 0
__set_if_empty_persist            useswap_both 0
__set_if_empty_persist   supershoot_use_orange 0
__set_if_empty_persist       fullbright_amount 0.1
__set_if_empty_persist   anypc_transition_time 0
__set_if_empty_persist        demo_folder_name "demos"
__set_if_empty_persist      fullgame_demo_name "%Y-%m-%d_%H-%M-%S/fullgame"
__set_if_empty_persist         anypc_demo_name "%Y-%m-%d_%H-%M-%S/anypc"
__set_if_empty_persist         sp_cm_demo_name "chapter$chapter/$map/$map"
__set_if_empty_persist           amc_demo_name "$role/%Y-%m-%d_%H-%M-%S/amc"
__set_if_empty_persist            ac_demo_name "$role/%Y-%m-%d_%H-%M-%S/ac"
__set_if_empty_persist       coop_cm_demo_name "$role/course$course/$map/$map"
__set_if_empty_persist            il_demo_name "chapter$chapter/$map/$map"
__set_if_empty_persist    chapter_il_demo_name "$role/$chapter_course/%Y-%m-%d_%H-%M-%S/$chapter_course"

// Always keep a backup of the last few demos, just in case you
// accidentally overwrite something
sar_demo_overwrite_bak 3

// Don't show in-game input hints
gameinstructor_enable 0

// SAR HUD
sar_hud_order_bottom text
sar_hud_font_index 68
sar_hud_x 5
sar_hud_y 5
sar_hud_spacing 5
sar_hud_bg 1
sar_hud_velocity 3
sar_hud_position 2
sar_hud_angles 1
cond "!game=mel" sar_hud_demo 2
sar_toast_tag_set_color error FF3333

// We always want to be recording, so set this, even if the category
// uses autorecord
sar_record_at_demo_name ""
// HACKHACK: we don't record demos in Mel
cond "!game=mel" sar_record_at 0
// HACKHACK: really fucking cursed special case to mitigate inexplicable
// game crash
cond "!game=mel" sar_on_load cond  "map=mp_coop_wall_5" sar_record_at 120
cond "!game=mel" sar_on_load cond "!map=mp_coop_wall_5" sar_record_at 0

// Utility function used below and in aliases.cfg
sar_function __choose "cond $'$1$' $2; cond $'!($1)$' $3"

// Add all the exposed aliases
exec aliases

// Toast settings
sar_toast_width 500
sar_toast_setpos bottom center

// Perform map detection, setting the appropriate svars
cond "game=portal2 | game=srm" sar_on_load exec map_detect/portal2
cond "game=aptag"              sar_on_load exec map_detect/aptag
cond "game=mel"                sar_on_load exec map_detect/mel
cond "game=reloaded"           sar_on_load exec map_detect/reloaded

// Black magic to create categories
sar_function __force_warn echo "Forcing category $1. Run 'auto' to re-enable automatic category selection."
// Stores the number of categories (increased whenever a category is added)
svar_set __detect_len 0
// Iterate over all categories
// $__loopcmd is executed every iteration and $__cat_i is the current index,
// which increments until it reaches $__detect_len
sar_function __cat_loop   "svar_set __loopcmd $'$1$'; svar_set __cat_i 0; __cat_loop_h"
sar_function __cat_loop_h cond "!var:__cat_i=$__detect_len" "$__loopcmd; svar_add __cat_i 1; __cat_loop_h"
// Loop through the categories and set $category if the condition is true.
// If the category has changed, stop demo recording
sar_function __detect "svar_set __old_category $category; svar_set category $__detect_default; __cat_loop $'sar_expand sar_expand __detect_$$$$__cat_$$__cat_i$'; sar_expand cond $'!var:category=$$__old_category$' stop"
// HACKHACK: we don't record demos in Mel
cond "game=mel"  sar_alias __record nop
cond "!game=mel" sar_alias __record cond "!var:__suppress_record=1" record ""
// The 'cat command' is ran every load while using a category, as well as
// when switching to it.
sar_function add_cat_cmd "sar_alias $1 $'stop; svar_set category $1; __force_warn $1; svar_set __force_cat 1; __run_cat_$1; __record$'; svar_set __cat_$__detect_len $1; sar_alias __run_cat_$1 $'$2$'; sar_alias __detect_$1 nop; svar_add __detect_len 1"
sar_function add_cat add_cat_cmd $1 "exec cats/$1"
sar_function detect_cat sar_alias __detect_$1 cond "$2" svar_set category $1
sar_function default_cat svar_set __detect_default $1

sar_alias list_cats __cat_loop __list_cats_h1
sar_function __list_cats_h1 "sar_expand echo $$__cat_$__cat_i; sar_expand svar_capture_quiet __tmp $'sar_alias __detect_$$__cat_$__cat_i$'; sar_expand __list_cats_h2 $$__tmp"
sar_function __list_cats_h2 "svar_set __list_cats_1 $1; __choose $'var:__list_cats_1=cond$' $'echo $2$' $'echo [Manual]$'"

// Category autoselection
sar_alias auto cond "var:__force_cat=1" "svar_set __force_cat 0; stop; __detect; sar_expand __run_cat_$category; __record"
sar_on_load cond "!var:__force_cat=1" __detect

// Expect the category exec to specifically suppress recording every
// load if it wants to
sar_on_load svar_set __suppress_record 0

// Run category exec on load
sar_on_load sar_expand __run_cat_$category

// Remove the tile animations, but not in Any%
sar_on_load __choose "var:category=anypc" "ui_transition_effect 1" "ui_transition_effect 0"
ui_transition_effect 0

// If we're suppressing recording, unset sar_record_at
cond "!game=mel" sar_on_load cond "var:__suppress_record=1" sar_record_at -1

// Create the built-in categories
add_cat fullgame
cond "game=portal2" add_cat anypc
cond "game=portal2" add_cat sp_cm
cond "game=portal2" add_cat amc
cond "game=portal2" add_cat ac
cond "game=portal2" add_cat coop_cm
cond "game=srm" add_cat celeste
cond "game=mel | game=aptag | game=reloaded" add_cat il
cond "game=portal2 | game=srm | game=mel | game=aptag" add_cat chapter_il

// Add the auto-selection for all the built-in categories
default_cat fullgame
detect_cat fullgame "!cm & !coop & var:builtin_map=1"
cond "game=portal2" detect_cat sp_cm     "cm & !coop & var:builtin_map=1"
cond "game=portal2" detect_cat amc      "!cm &  coop & var:builtin_map=1"
cond "game=portal2" detect_cat coop_cm   "cm &  coop & var:builtin_map=1"

// Coop map name toasts
sar_toast_tag_set_duration map_name forever
sar_on_load sar_toast_tag_dismiss_all map_name
sar_on_load cond "game=portal2 & coop & var:show_map_name_coop=1 & (var:category=amc | var:category=ac | var:category=chapter_il)" sar_expand sar_toast_create map_name "$formatted_map"

// Coop taunt toasts
sar_toast_tag_set_duration taunt forever
sar_on_load sar_toast_tag_dismiss_all taunt
sar_on_load cond "game=portal2 & coop & !var:no_taunt_toasts_coop=1 & (var:category=amc | var:category=ac | var:category=chapter_il)" __taunt_toast
sar_alias __taunt_toast cond "map=mp_coop_lobby_3 & (var:__lobby=2 | var:__lobby=3) | map=mp_coop_rat_maze" sar_toast_create taunt "[taunt]"

// Dialogue fade toasts
sar_toast_tag_set_duration fade forever
sar_on_load sar_toast_tag_dismiss_all fade
sar_on_load cond "game=portal2 &  coop & !var:no_dialogue_toasts=1 & !var:no_dialogue_toasts_coop=1 & (var:category=amc | var:category=ac | var:category=chapter_il)" exec dialogue_toasts/coop
sar_on_load cond "game=portal2 & !coop & !var:no_dialogue_toasts=1 & !var:no_dialogue_toasts_sp=1   & (var:category=fullgame | var:category=chapter_il)"              exec dialogue_toasts/sp

// CM attempt counter
sar_on_load svar_set __attempt_counter 0
sar_on_load cond "var:cm_attempt_counter=1 & (var:category=sp_cm | var:category=coop_cm)" svar_set __attempt_counter 1
sar_on_load cond "!(same_map & var:__attempt_counter=1)" svar_set __attempts 0
sar_on_load cond   "same_map & var:__attempt_counter=1"  svar_add __attempts 1
sar_on_load cond "!var:__attempt_counter=1" sar_hud_set_text 100 ""
sar_on_load cond  "var:__attempt_counter=1" sar_expand sar_hud_set_text 100 "Attempts: $__attempts"

// CM ghost server
exec cm_ghost
sar_alias chat "__choose coop sar_chat ghost_chat"

// Show speedrun result after CM run
sar_on_flags cond "var:category=sp_cm | var:category=coop_cm" sar_speedrun_result

// We want to dispatch aliases to handle coop resetting where needed
// This general framework allows a) both players to run a command when
// the reset is run and b) a command to be run after both players finish
// resetting.
sar_function setup_coop_reset "sar_alias do_reset _coop_reset; sar_alias _coop_reset_both $'$1$'; sar_alias _coop_reset_done $'$2$'"
sar_alias _coop_reset "cond coop sar_coop_reset_progress; _coop_reset_both; cond !coop _coop_reset_done"
sar_on_coop_reset_remote _coop_reset_both
sar_on_coop_reset_done _coop_reset_done

// Category cond aliases for rule differences
sar_alias cm_only     cond  "var:category=sp_cm |  var:category=coop_cm"
sar_alias non_cm_only cond "!var:category=sp_cm & !var:category=coop_cm"

// Add the mtrigger categories and the sar_on_load execs
// We do this *after* running the category exec, so that no_mtriggers is set if
// necessary
cond "game=portal2" exec mtriggers/mtriggers

// Same for the chapter categories
cond "!game=reloaded" sar_function run_cur_chapter "svar_set __cur_chapter $'$chapter$'; chapter_il"
cond "!game=reloaded" sar_function run_chapter     "svar_set __cur_chapter $'$1$'; chapter_il"
cond "game=portal2 | game=srm" exec chapter_cats/portal2
cond "game=aptag"              exec chapter_cats/aptag
cond "game=mel"                exec chapter_cats/mel

sar_on_coop_spawn cond "!var:coop_no_stopvideos=1 & !map=mp_coop_start" stopvideos
sar_on_coop_spawn cond "!var:coop_no_remoteview=1" +remote_view

// ss_pip_align <top|center|bottom> <left|center|right> [padding=25]
// Aligns remote view
sar_alias __get_screen_size "__tmp_toast_save; sar_toast_setpos top left; svar_from_cvar height sar_toast_y; svar_from_cvar width sar_toast_x; sar_toast_setpos bottom right; svar_from_cvar __tmp sar_toast_y; svar_add height __tmp; svar_from_cvar __tmp sar_toast_x; svar_add width __tmp; svar_from_cvar __tmp sar_toast_width; svar_add width __tmp; __tmp_toast_restore"
__get_screen_size
sar_function   ss_pip_align      "__get_screen_size; svar_set __ss_pip_aligny $'$1$'; svar_set __ss_pip_alignx $'$2$'; svar_set __ss_pip_padding $'$3$'; __set_if_empty __ss_pip_padding 25; ss_pipscale 0.3; __ss_pip_align_h x width left right; __ss_pip_align_h y height top bottom; sar_expand $'ss_pip_bottom_offset $$__ss_pip_y; ss_pip_right_offset $$__ss_pip_x$'"
sar_function __ss_pip_align_h    "cond $'var:__ss_pip_align$1=$3$' $'__ss_pip_align $1 $2 70; svar_sub __ss_pip_$1 __ss_pip_padding$'; cond $'var:__ss_pip_align$1=center$' __ss_pip_align $1 $2 35; cond $'var:__ss_pip_align$1=$4$' svar_set __ss_pip_$1 $__ss_pip_padding"
sar_function __ss_pip_align      "sar_expand svar_set __ss_pip_$1 $$$2; svar_mul __ss_pip_$1 $3; svar_div __ss_pip_$1 100"
sar_alias      ss_pip_fullscreen "ss_pipscale 1; ss_pip_bottom_offset 0; ss_pip_right_offset 0"

// When we open the game, assume we're running fullgame at first, just
// as a sane default
svar_set category fullgame
exec cats/fullgame

// clear
srconfigs_about
sar_about
echo "" // Separate srconfigs output from other stuff
exec con_filter

// Exec personal config
exec extra
`);
src.cfg.add('aliases', `// THE 'nop's IN ALIASES ARE IMPORTANT! They stop the keycode
// being carried across into the alias.

// Dialogue toggle
cond "!game=srm" sar_function snd_setdialogue "snd_setmixer potatosVO vol $1; snd_setmixer gladosVO vol $2; snd_setmixer announcerVO vol $3; snd_setmixer wheatleyVO vol $4; snd_setmixer caveVO vol $5; snd_setmixer coreVO vol $6; snd_disable_mixer_duck $7"
cond  "game=srm" sar_function snd_setdialogue "snd_disable_mixer_duck $7; puzzlemaker_play_sounds $8"
sar_alias +dialogue "sar_hud_set_text 0 Dialogue #55FF55ON;  sar_alias dialogue_toggle -dialogue; snd_setdialogue 0.4  0.7  0.7  0.7  0.88 0.75 0 1; nop"
sar_alias -dialogue "sar_hud_set_text 0 Dialogue #FF5555OFF; sar_alias dialogue_toggle +dialogue; snd_setdialogue 0.01 0.01 0.01 0.01 0.01 0.01 1 0; nop"
+dialogue
sar_hud_show_text 0
// The dialogue stuff (both snd_setmixer and the P2SM thing) is overriden by
// config.cfg after this runs; toggle dialogue twice after that to override it
sar_on_config_exec "dialogue_toggle; dialogue_toggle"

// Funneling toggle
cond "game=portal2" svar_set __funneling_ban_text "fullgame, coop, or chapter IL"
cond "game=mel"     svar_set __funneling_ban_text "Mel"
cond "game=srm"     svar_set __funneling_ban_text "P2SM"
sar_alias +funneling "sar_hud_set_text 1 Funneling #55FF55ON;  sar_alias funneling_toggle -funneling; sv_player_funnel_into_portals 1; nop"
sar_alias -funneling __choose "game=portal2 & (var:category=fullgame | var:category=anypc | var:category=amc | var:category=ac | var:category=chapter_il) | game=mel | game=srm" "__funneling_maybe_disallow" "__funneling_allow"
sar_function __funneling_maybe_disallow "svar_from_cvar __tmp sv_cheats; __choose $'var:__tmp=1$' __funneling_allow __funneling_disallow"
sar_function __funneling_disallow  sar_toast_create error "Disabling funneling is not allowed in $__funneling_ban_text runs"
sar_alias __funneling_allow    "sar_hud_set_text 1 Funneling #FF5555OFF; sar_alias funneling_toggle +funneling; sv_player_funnel_into_portals 0"
+funneling
sar_hud_show_text 1

// Fullbright toggle
sar_function ambient_rgb "mat_ambient_light_r $1; mat_ambient_light_g $1; mat_ambient_light_b $1"
sar_function +fullbright "sar_hud_set_text 2 Fullbright #55FF55ON;  sar_alias fullbright_toggle -fullbright; ambient_rgb $fullbright_amount; nop"
sar_alias    -fullbright "sar_hud_set_text 2 Fullbright #FF5555OFF; sar_alias fullbright_toggle +fullbright; ambient_rgb 0; nop"
-fullbright
sar_hud_hide_text 2

// Sensitivity toggle
sar_function +customsens "sar_hud_set_text 3 Sensitivity #FF5555$1; __cache_sens; sensitivity $1; svar_set __customsens_on 1"
sar_function -customsens "sar_hud_set_text 3 Sensitivity #55FF55$__old_sens; cond $'var:__customsens_on=1$' sensitivity $__old_sens; svar_set __customsens_on 0"
sar_alias __cache_sens cond "!var:__customsens_on=1" svar_from_cvar __old_sens sensitivity
sar_function __customsens_override "svar_from_cvar __tmp1 sensitivity; __choose $'var:__tmp1=$1$' -customsens $'+customsens $1$'"
sar_function customsens_toggle "svar_set __tmp $__customsens_on; __choose $'var:__tmp=1$' $'__customsens_override $1$' $'+customsens $1$'"
// Set __old_sens right now, so that running -customsens before a toggle
// doesn't break anything
svar_from_cvar __old_sens sensitivity
-customsens
sar_hud_hide_text 3
// Backwards compatibility
sar_function +lowsens "+customsens 0.01"
sar_function -lowsens "-customsens"
sar_alias lowsens_toggle "customsens_toggle 0.01"

// Stop altered sensitivity being saved in config.cfg
sar_on_exit "-customsens"

// Use-swap toggle
sar_function +useswap "sar_hud_set_text 4 Use-swap #55FF55ON;  svar_set __useswap 1; cond $'var:useswap_invert=1$' svar_set __useswap 0; sar_alias useswap_toggle -useswap"
sar_function -useswap "sar_hud_set_text 4 Use-swap #FF5555OFF; svar_set __useswap 0; cond $'var:useswap_invert=1$' svar_set __useswap 1; sar_alias useswap_toggle +useswap"
-useswap
sar_hud_hide_text 4

// Supershoot toggle
sar_alias +supershoot "sar_hud_set_text 5 Supershoot #55FF55ON;  svar_set __supershoot 1; sar_alias supershoot_toggle -supershoot; nop"
sar_alias -supershoot "sar_hud_set_text 5 Supershoot #FF5555OFF; svar_set __supershoot 0; sar_alias supershoot_toggle +supershoot; nop"
-supershoot
sar_hud_hide_text 5

// FPS toggle
sar_alias    +30fps "sar_hud_set_text 6 30FPS #55FF55ON; svar_from_cvar __old_fps fps_max; fps_max 30; sar_alias 30fps_toggle -30fps; nop"
sar_function -30fps "sar_hud_set_text 6 30FPS #FF5555OFF; fps_max $__old_fps; sar_alias 30fps_toggle +30fps"
sar_alias    30fps_toggle +30fps
// Set __old_fps right now, so that running -30fps before a toggle
// doesn't break anything
svar_from_cvar __old_fps fps_max
-30fps
sar_hud_hide_text 6

// Contimes toggle
sar_alias +contimes "sar_hud_set_text 7 Contimes #55FF55ON;  con_drawnotify 1; sar_alias contimes_toggle -contimes; nop"
sar_alias -contimes "sar_hud_set_text 7 Contimes #FF5555OFF; con_drawnotify 0; sar_alias contimes_toggle +contimes; nop"
-contimes
sar_hud_hide_text 7

// Mouse wheel bind aliases
sar_function __+supershoot __choose "var:supershoot_use_orange=1" "+attack2 $1" "+attack $1"
sar_function __-supershoot __choose "var:supershoot_use_orange=1" "-attack2 $1" "-attack $1"
sar_function +scrollup    __choose "var:__supershoot=1" "__+supershoot $1" "+scrollup1 $1"
sar_function -scrollup    __choose "var:__supershoot=1" "__-supershoot $1" "-scrollup1 $1"
sar_function +scrolldown  __choose "var:__supershoot=1" "__+supershoot $1" "+scrolldown1 $1"
sar_function -scrolldown  __choose "var:__supershoot=1" "__-supershoot $1" "-scrolldown1 $1"
sar_function +scrollup1   __choose "var:__useswap=1" "+use $1" "+jump $1"
sar_function -scrollup1   __choose "var:__useswap=1" "-use $1" "-jump $1"
sar_function +scrolldown1 __choose "var:__useswap=1 & var:useswap_both=1" "+use $1" "+jump $1"
sar_function -scrolldown1 __choose "var:__useswap=1 & var:useswap_both=1" "-use $1" "-jump $1"

// extra.cfg could change the behaviour of -useswap; make sure it's
// disabled later
sar_on_config_exec -useswap
`);
src.cfg.add('cm_ghost', `// We'll prompt the user as to whether they want to connect using toasts

// Util functions for temporarily fucking with cvars
sar_function __tmp_cvar_save    "svar_from_cvar __tmp_cvar_$1 $1"
sar_function __tmp_cvar_restore "sar_expand $1 $$__tmp_cvar_$1"

// Capture svars quietly by temporarily filtering all console output
sar_function svar_capture_quiet "__tmp_cvar_save sar_con_filter; __tmp_cvar_save sar_con_filter_default; sar_con_filter 1; sar_con_filter_default 0; svar_capture $'$1$' $'$2$'; __tmp_cvar_restore sar_con_filter; __tmp_cvar_restore sar_con_filter_default"

// Temporarily save binds to svars so we can let the user just press a key
sar_function __tmp_bind_save    "svar_capture_quiet __tmp $'bind $1$'; sar_expand __tmp_bind_save_h $$__tmp"
sar_function __tmp_bind_save_h  "svar_set __tmp $2; cond $'!var:__tmp=is$' svar_set __tmp_bind_$1 $'$3$'"
sar_function __tmp_bind_restore "sar_expand svar_set __tmp $'$$__tmp_bind_$1$$-x$'; __choose $'var:__tmp=x$' $'unbind $1$' $'sar_expand bind $1 $$'$$__tmp_bind_$1$$'$'"

// Temporarily save the user's toast settings so we can make the toast
// big and imposing, like someone who is not zach
sar_alias __tmp_toast_save    "__tmp_cvar_save sar_toast_x; __tmp_cvar_save sar_toast_y; __tmp_cvar_save sar_toast_align; __tmp_cvar_save sar_toast_anchor; __tmp_cvar_save sar_toast_disable; __tmp_cvar_save sar_toast_width; __tmp_cvar_save sar_toast_background; __tmp_cvar_save sar_toast_compact; __tmp_cvar_save sar_toast_font"
sar_alias __tmp_toast_restore "__tmp_cvar_restore sar_toast_x; __tmp_cvar_restore sar_toast_y; __tmp_cvar_restore sar_toast_align; __tmp_cvar_restore sar_toast_anchor; __tmp_cvar_restore sar_toast_disable; __tmp_cvar_restore sar_toast_width; __tmp_cvar_restore sar_toast_background; __tmp_cvar_restore sar_toast_compact; __tmp_cvar_restore sar_toast_font"

// Aliases for actually doing the prompt
sar_toast_tag_set_duration cm_ghost_warning forever
sar_alias __cm_ghost_warning "svar_set __cm_ghost_warning 1; sar_toast_tag_dismiss_all speedrun; __tmp_toast_save; sar_toast_font 68; sar_toast_width 500; sar_toast_setpos top center; __tmp_bind_save y; __tmp_bind_save n; bind y __cm_ghost_accept; bind n __cm_ghost_reject; __cm_ghost_warning_text"
sar_function __cm_ghost_warning_text "sar_toast_create cm_ghost_warning $'This can be changed later via the 'cm_ghost_server' svar.$'; sar_toast_create cm_ghost_warning $'Press N to stay disconnected$'; sar_toast_create cm_ghost_warning $'Press Y to connect to the server$'; sar_toast_create cm_ghost_warning $'There is a world-wide 'ghost server' that players can connect to and chat on while playing Challenge Mode.$'; echo $'----> Press Y or N ingame, not here! <----$'"
sar_alias __cm_ghost_accept "svar_set cm_ghost_server 1; __cm_ghost_warning_done; __cm_ghost_tryconnect"
sar_alias __cm_ghost_reject "svar_set cm_ghost_server 0; __cm_ghost_warning_done"
sar_alias __cm_ghost_warning_done "svar_set __cm_ghost_warning 0; sar_toast_tag_dismiss_all cm_ghost_warning; __tmp_toast_restore; __tmp_bind_restore y; __tmp_bind_restore n"
sar_on_exit cond "var:__cm_ghost_warning=1" "__cm_ghost_warning_done"

// Show the prompt on first load if we've not decided whether to connect
sar_on_load cond "var:category=sp_cm & var:cm_ghost_server=-1" "__cm_ghost_warning"

// Aliases to actually connect
sar_alias __cm_ghost_tryconnect cond "var:category=sp_cm & var:cm_ghost_server=1 & !var:__cm_ghosts=1" "svar_set __cm_ghosts 1; ghost_connect cm.portal2.sr"
sar_on_load __cm_ghost_tryconnect
sar_on_load cond "!(var:category=sp_cm & var:cm_ghost_server=1) & var:__cm_ghosts=1" "svar_set __cm_ghosts 0; ghost_disconnect"
`);
src.cfg.add('chapter_cats/portal2', `sar_speedrun_cc_start "Chapter 1"
sar_speedrun_cc_rule "Container Start" entity map=sp_a1_intro1 action=start targetname=camera_intro inputname=TeleportToView
sar_speedrun_cc_rule "Vault Start" entity map=sp_a1_intro1 action=start targetname=camera_1 inputname=TeleportPlayerToProxy
sar_speedrun_cc_rule "End" end map=sp_a2_intro action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Chapter 2"
sar_speedrun_cc_rule "Start" load map=sp_a2_laser_intro action=start
sar_speedrun_cc_rule "End" end map=sp_a2_fizzler_intro action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Chapter 3"
sar_speedrun_cc_rule "Start" load map=sp_a2_sphere_peek action=start
sar_speedrun_cc_rule "End" end map=sp_a2_pull_the_rug action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Chapter 4"
sar_speedrun_cc_rule "Start" load map=sp_a2_column_blocker action=start
sar_speedrun_cc_rule "End" end map=sp_a2_bts2 action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Chapter 5"
sar_speedrun_cc_rule "Start" load map=sp_a2_bts3 action=start
sar_speedrun_cc_rule "End" end map=sp_a2_core action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Chapter 6"
sar_speedrun_cc_rule "Cutscene Start" load map=sp_a3_00 action=start
sar_speedrun_cc_rule "Start" load map=sp_a3_01 action=start
sar_speedrun_cc_rule "End" end map=sp_a3_transition01 action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Chapter 7"
sar_speedrun_cc_rule "Start" load map=sp_a3_speed_ramp action=start
sar_speedrun_cc_rule "End" end map=sp_a3_end action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Chapter 8"
sar_speedrun_cc_rule "Start" load map=sp_a4_intro action=start
sar_speedrun_cc_rule "End" end map=sp_a4_jump_polarity action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Chapter 9"
sar_speedrun_cc_rule "Start" load map=sp_a4_finale1 action=start
sar_speedrun_cc_rule "End" entity map=sp_a4_finale4 action=stop targetname=@glados inputname=RunScriptCode "parameter=BBPortalPlaced()"
sar_speedrun_cc_finish

sar_speedrun_cc_start "Course 1"
sar_speedrun_cc_rule "Start" load map=mp_coop_doors action=start
sar_speedrun_cc_rule "End" end map=mp_coop_teambts action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Course 2"
sar_speedrun_cc_rule "Start" load map=mp_coop_fling_3 action=start
sar_speedrun_cc_rule "End" end map=mp_coop_fan action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Course 3"
sar_speedrun_cc_rule "Start" load map=mp_coop_wall_intro action=start
sar_speedrun_cc_rule "End" end map=mp_coop_wall_5 action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Course 4"
sar_speedrun_cc_rule "Start" load map=mp_coop_tbeam_redirect action=start
sar_speedrun_cc_rule "End" end map=mp_coop_tbeam_end action=stop
sar_speedrun_cc_finish

sar_speedrun_cc_start "Course 5"
sar_speedrun_cc_rule "Start" load map=mp_coop_paint_come_along action=start
sar_speedrun_cc_rule "End" entity map=mp_coop_paint_longjump_intro action=stop targetname=vault-movie_outro inputname=PlayMovieForAllPlayers
sar_speedrun_cc_finish

sar_speedrun_cc_start "Course 6"
sar_speedrun_cc_rule "Start" load map=mp_coop_separation_1 action=start
sar_speedrun_cc_rule "End" entity map=mp_coop_paint_crazy_box action=stop targetname=movie_outro inputname=PlayMovieForAllPlayers
sar_speedrun_cc_finish
`);
src.cfg.add('cats/fullgame', `// Speedrun category
cond "game=portal2 | game=srm" sar_speedrun_category Singleplayer
cond "game=mel | game=aptag" sar_speedrun_category RTA
cond "game=reloaded" sar_speedrun_category "Chambers RTA"
svar_set no_mtriggers 1
cond "game=portal2 | game=srm | game=mel" +funneling

// Speedrun timing
cond "game=portal2" sar_speedrun_offset 16868
cond "game=reloaded" sar_speedrun_offset 2394
cond "game=srm | game=mel | game=aptag" sar_speedrun_offset 0

sar_speedrun_time_pauses 0
cond "game=portal2 & map=sp_a1_wakeup" sar_speedrun_time_pauses 1

sar_speedrun_smartsplit 1

// Demo recording
sar_autorecord 1
sar_expand sar_expand sar_record_prefix "$demo_folder_name/fullgame/$fullgame_demo_name"
sar_speedrun_autostop 2
sar_challenge_autostop 0

// Fast loads
sar_fast_load_preset full

// Prevent accidental CM wrongwarp
sar_cm_rightwarp 1

// Enable developer mode for con_drawnotify etc
__choose "game=reloaded" "developer 0" "developer 1"

// Don't start a new run in credits etc
cond "map=sp_a5_credits | map=credits | map=credits_museum | map=celeste_moonroom" svar_set __suppress_record 1

// Category-specific aliases
cond "game=portal2"  sar_alias do_reset "sar_speedrun_reset; stop; sv_allow_mobile_portals 0; load containerridesave"
cond "game=srm"      sar_alias do_reset "sar_speedrun_reset; stop; sv_allow_mobile_portals 0; map sp_a1_intro1"
cond "game=mel"      sar_alias do_reset "sar_speedrun_reset; map st_a1_tramride"
cond "game=aptag"    sar_alias do_reset "sar_speedrun_reset; stop; map gg_intro_wakeup"
cond "game=reloaded" sar_alias do_reset "sar_speedrun_reset; stop; load crs"
`);
src.cfg.add('con_filter', `sar_con_filter_reset
sar_con_filter 1
sar_con_filter_default 1
sar_con_filter_suppress_blank_lines 1
sar_con_filter_block "cl_thirdperson"
sar_con_filter_block "^Unknown command: restart_level"
sar_con_filter_block "^Unknown command: select_map"
sar_con_filter_block "end_movie" // stopvideos
sar_con_filter_block "^m_currentState ="
sar_con_filter_block "^Joystick "
sar_con_filter_block "^Did not detect any valid joysticks.$"
sar_con_filter_block "^Initializing joystick "
sar_con_filter_block "^Unable to initialize rumble for joystick "
sar_con_filter_block "^Three keys down for a button "
sar_con_filter_block "^r_rootlod is temporarily unsupported"
sar_con_filter_block "^     demofilestamp: HL2DEMO$" "^$"
sar_con_filter_block "^--- Missing Vgui material "
sar_con_filter_block "^Queued Material System: ENABLED!$"
sar_con_filter_block "^Queued Material System: DISABLED!$"
sar_con_filter_block "^Stopping All Sounds...$"
sar_con_filter_block "^Stopping: Channel:"
sar_con_filter_block "^---- Host_Changelevel ----$"
sar_con_filter_block "^PORTAL RELOADED MAP LOADED$"
sar_con_filter_block "^### SPEEDRUN MOD ###"
sar_con_filter_block "^SMSM::"
sar_con_filter_block "), but it has no attachment named "
sar_con_filter_block ", unknown sound operator attribute "
sar_con_filter_block "^CModelLoader::Map_IsValid:"
sar_con_filter_block "^blocking issue in occlusion queries!"
sar_con_filter_block "^Attempted to HideLoadingPlaque"
sar_con_filter_block "^Hunk_OnMapStart:"
sar_con_filter_block "^Set Gravity"
sar_con_filter_block "^Sound Initialization: Start$" "^Sound Initialization: Finish, "
sar_con_filter_block "^UTIL_TranslateSoundName directly referenced wave"
sar_con_filter_block "^Host_WriteConfiguration: Wrote cfg/config.cfg$"
sar_con_filter_block "^==== calling mapspawn.nut$"
sar_con_filter_block "^--------------- FIXING PLAYER POSITION FOR "
sar_con_filter_block "^Load took: "
sar_con_filter_block "^Invalid file size for "
sar_con_filter_block "^state = "
sar_con_filter_block "^SignalXWriteOpportunity("
sar_con_filter_block "^[PORTAL2 PUZZLEMAKER]  --------START loading assets--------$" "^$"
sar_con_filter_block "^[PORTAL2 PUZZLEMAKER]  ---------END loading assets---------$" "^$"
sar_con_filter_block "^Teleporting to default start pos$"
sar_con_filter_block "^Sending full update to Client "
sar_con_filter_block "^Attempting to pack entities on server with invalid local client state."
sar_con_filter_block "^CLeaderboardRequestQueue::Request$" "^  }$"
sar_con_filter_block "^UncacheUnusedMaterials - "
sar_con_filter_block "^CLeaderboardRequestQueue::OnStartNewQuery"
sar_con_filter_block "cheats turned on in this app session$"
sar_con_filter_block "^Can't use cheat cvar r_flashlightbrightness"
sar_con_filter_block "^Can't set cl_mouselook"
sar_con_filter_block "^LeaderboardRequestQueue: ProcessResults finished.$"
sar_con_filter_block "^CLeaderboardRequestQueue::OnQueryFinished$" "^  }$"
sar_con_filter_block "^Setting cl_fov to "
sar_con_filter_block "^exec: couldn't exec skill1.cfg$"
sar_con_filter_block "^Bogus constraint "
sar_con_filter_block "^Attempted to create unknown entity type "
sar_con_filter_block "^Attempting to create unknown particle system "
sar_con_filter_block "^Can't init info_lighting_relative$"
sar_con_filter_block "refers to itself as a target!$"
sar_con_filter_block "^prop_dynamic: Could not find lighting origin entity named "
sar_con_filter_block "^Portal 2" "^$" // skips the 'Map: Players: Build: Server Number:' bit, also works in coop
sar_con_filter_block "^Created class baseline: "
sar_con_filter_block "^CreateEvent: event 'player_connect_full' not registered.$"
sar_con_filter_block "^    Processing view challenge_besttime"
sar_con_filter_block "^    Processing view challenge_portals"
sar_con_filter_block "^        Gamer data loaded: "
sar_con_filter_block "^Avatar image for user "
sar_con_filter_block "^Steamworks Stats: "
sar_con_filter_block "^PlayerLocal::UpdateLeaderboardData for "
sar_con_filter_block "^Uploading score for leaderboard"
sar_con_filter_block "^Leaderboard score uploaded"
sar_con_filter_block "^Created CMatchSessionOnlineHost:$" "^InitializeDlcMachineSettings: [mask:"
sar_con_filter_block "^CMatchSessionOnlineHost::InitializeGameSettings" "^            starting: "
sar_con_filter_block "^Created CMatchSessionOfflineCustom:$" "^InitializeDlcMachineSettings: [mask:"
sar_con_filter_block "^CMatchSessionOfflineCustom::InitializeGameSettings" "^            starting: "
sar_con_filter_block "^Created CMatchSessionOnlineCustom:$" "^InitializeDlcMachineSettings: [mask:"
sar_con_filter_block "^CMatchSessionOnlineCustom::InitializeGameSettings" "^            starting: "
sar_con_filter_block "^[0] Could not find Hud Element: CHUDChallengeStats$"
sar_con_filter_block "^Redownloading all lightmaps$"
sar_con_filter_block "^R_RedownloadAllLightmaps took "
sar_con_filter_block ", no player$" // Cannot execute "snd_ducktovolume 0.2", no player
sar_con_filter_block "^Setting arrival movie to "
sar_con_filter_block "^Requesting full game update ("
sar_con_filter_block "^CColorCorrectionSystem: Missing"
sar_con_filter_block "^Commentary: Loading commentary data from"
sar_con_filter_block "^Can't find factory for entity: wearable_item$"
sar_con_filter_block "^NULL Ent in UTIL_PrecacheOther$"
sar_con_filter_block "^Execing config: "
sar_con_filter_block "^Completed demo, recording time"
sar_con_filter_block "^Destroying CMatchSessionOfflineCustom:$" "^  }$"
sar_con_filter_block " from server (Server shutting down)$"
sar_con_filter_block "^Steamworks Stats: Ending SERVER session id: "
sar_con_filter_block "^Steamworks Stats: Ending CLIENT session id: "
sar_con_filter_block "^OnEngineClientSignonStateChange$"
sar_con_filter_block "^  Adjusting game players" "^            game players ="
sar_con_filter_block "^maxplayers set to "
sar_con_filter_block "^---- Host_NewGame ----$"
sar_con_filter_block "^Network: IP "
sar_con_filter_block "^Opened Steam Socket NS_SERVER"
sar_con_filter_block "^Opened Steam Socket NS_CLIENT"
sar_con_filter_block "^***********************************$" "^*         NO GAME SESSION         *$"
sar_con_filter_block "^* some features might be disabled *$" "^***********************************$"
sar_con_filter_block "STEAM USERID validated$"
sar_con_filter_block "because its velocity is outside of the threshold"
sar_con_filter_block " is adjusting velocity of "
sar_con_filter_block ", requiring pw no, lobby id "
sar_con_filter_block "^Substituting model models/" // gpu_level
sar_con_filter_block "has no model name!$"
sar_con_filter_block ": no sequence named:"
sar_con_filter_block "^Failed to load models"
sar_con_filter_block "^Commentary: Could not find commentary data file"
sar_con_filter_block "^Setting Mixer Default_Mix: "
sar_con_filter_block "Sending UDP connect to public IP"
sar_con_filter_block "^RememberIPAddressForLobby: lobby"
sar_con_filter_block "^=======================Trying to GivePlayerPo"
sar_con_filter_block "^=======================Trying to UpgradePlayerPo"
sar_con_filter_block "^Weapon_portalgun has no owner when trying to upgrade!$"
sar_con_filter_block "^Portalgun upgrade failed! Player not holding a portalgun.$"
sar_con_filter_block "^Upgrading Portalgun$"
sar_con_filter_block "^*** ERROR: Bone access not allowed"
sar_con_filter_block "^Portal placed on a no portal material.$"
sar_con_filter_block "^Portal overlapped another portal.$"
sar_con_filter_block "^Portal corner has no surface behind it.$"
sar_con_filter_block "^PortalPlacement: "
sar_con_filter_block "^!!! Failed to find portal"
sar_con_filter_block "^!!!!fizzle portals$"
sar_con_filter_block "^Parent cvar in client.dll not allowed"
sar_con_filter_block "^SAVEGAME: "
sar_con_filter_block "bytes of save data$"
sar_con_filter_block "^m_face->glyph->bitmap"
sar_con_filter_block "^GetCharRGBA - selected_face->glyph->bitmap"
sar_con_filter_block "reported ENTITY_CHANGE_NONE but"
sar_con_filter_block "^Starting elevator "
sar_con_filter_block "^Trying to teleport to @"
sar_con_filter_block "^Using default elevator speed 300$"
sar_con_filter_block "^Level not found in elevator_motifs defaulting to transition$"
sar_con_filter_block "^Loading game from //DEFAULT_WRITE_PATH/SAVE"
sar_con_filter_block "^Loading game from SAVE/"
sar_con_filter_block "^ERROR: couldn't open.$"
sar_con_filter_block "^Unable to remove "
sar_con_filter_block "File is missing from disk/repository.$"
sar_con_filter_block "^Failed to open client state file SAVE/"
sar_con_filter_block "^ILocalize::AddFile() failed to load file "
sar_con_filter_block "^CUIGameData::OpenWaitScreen"
sar_con_filter_block "^PlayerLocal::Steam_OnUserStatsReceived..."
sar_con_filter_block "^User0 stats retrieved.$"
sar_con_filter_block "^[Cloud]:"
sar_con_filter_block "^resource/closecaption_"
sar_con_filter_block "^Ignoring non-unicode close caption file "
sar_con_filter_block "^cc_lang ="
sar_con_filter_block "doesn't point to an existing ConVar$"
sar_con_filter_block "^Couldn't load scripts/"
sar_con_filter_block "^Script not found ("
sar_con_filter_block "has no sequence for act:"
sar_con_filter_block " not found.$"
sar_con_filter_block "^Requesting texture value from var"
sar_con_filter_block " registration of demo custom data callback.$"
sar_con_filter_block ": can't be found on disk$"
sar_con_filter_block "^Failed to load error.mdl!$"
sar_con_filter_block "^Connection to Steam servers successful.$"
sar_con_filter_block "^Connection to Steam servers lost.$"
sar_con_filter_block "^Could not establish connection to Steam servers.$"
sar_con_filter_block "^CClientSteamContext OnSteamServer"
sar_con_filter_block "^Unable to enumerate user's "
sar_con_filter_block "^=========== Failed to retrieve Steam stats ("
sar_con_filter_block "^Requesting Steam stats... ("
sar_con_filter_block "VAC secure mode" //  is activated.$  disabled.$
sar_con_filter_block "^Unable to load sprite material"
sar_con_filter_block "^FCVAR_CHEAT cvars reverted to defaults.$"
sar_con_filter_block "^Host_NewGame on map "
sar_con_filter_block "^Receiving uncompressed update from server$"
sar_con_filter_block " failed, no such sound script entry$"
sar_con_filter_block "^Recording to "
sar_con_filter_block "^Error: sound operator elapsed_time requires valid channale pointer, being called without one$"
sar_con_filter_block "^Error: Sound operator elapsed_time requires valid channel pointer, being called without one$"
sar_con_filter_block "^AddMultiDamage:  g_MultiDamage.GetDamageForce() == vec3_origin$"
sar_con_filter_block "^CBaseEntity::TakeDamage:  with inputInfo.GetDamageForce() == vec3_origin$"
sar_con_filter_block "^CSceneEntity @sphere"
sar_con_filter_block "^===== Setting Wheatley glance concerned idle$"
sar_con_filter_block "^==Stopping "
sar_con_filter_block "^==Starting "
sar_con_filter_block "^Paused for 0 non-simulated ticks.$"
sar_con_filter_block " unpaused the game$"
sar_con_filter_block " is multiply defined in material "
sar_con_filter_block "^Map Bug:  "
sar_con_filter_block "^Couldn't find any entities named "
sar_con_filter_block "^Attempted to precache unknown particle system"
sar_con_filter_block "^Attempted to attach particle effect"
sar_con_filter_block "^Invalid attach type specified for particle effect"
sar_con_filter_block "has no particle system name specified!$"
sar_con_filter_block "^Could not find area portal window named "
sar_con_filter_block "has propdata which means that it be used on a prop_physics. DELETED.$"
sar_con_filter_block "has no propdata which means it must be used on a prop_static. DELETED.$"
sar_con_filter_block "but AI has forced them to do something different$"
sar_con_filter_block "^Ignoring player blocking train!$"
sar_con_filter_block "^Fixing player blocking train!$"
sar_con_filter_block "^Can't find a nearby track !!!"
sar_con_filter_block ": Blocked by player$"
sar_con_filter_block " uses unknown shader "
sar_con_filter_block "^Unexpected NULL texture in CShaderAPIDx8::SetRenderTargetEx()$" // possibly unneccessary, https://discord.com/channels/146404426746167296/146404470962651136/599223145987047429
sar_con_filter_block "^ShaderAPIDx8::CreateD3DTexture: Invalid color format!$"
sar_con_filter_block "^Can't init playtest_manager$"
sar_con_filter_block "^!! ERROR: bad input/output link:$"
sar_con_filter_block "^!! env_tonemap_controller"
sar_con_filter_block "^Interpenetrating entities!"
sar_con_filter_block "^AN ERROR HAS OCCURED [" "^[this] TABLE$"
sar_con_filter_block "^[this] TABLE$"
sar_con_filter_block " encountered an error in RunScript()$"
sar_con_filter_block "^Moving brush intersected portal plane.$"
sar_con_filter_block "failed to link to partner named: "
sar_con_filter_block "^Warning: env_projected_texture ("
sar_con_filter_block "has an invalid spotlight width"
sar_con_filter_block "has invalid glow size"
sar_con_filter_block "^SurfFlagsToSortGroup:" "^- Look near"
sar_con_filter_block "^Binding uncached material "
sar_con_filter_block "^Discarding missing sequence (null) on load."
sar_con_filter_block "^Can't find landmark "
sar_con_filter_block "^Can't find the world$"
sar_con_filter_block "doesn't have a landmark"
sar_con_filter_block "^Bad pstudiohdr in GetSequenceLinearMotion()!$"
sar_con_filter_block "^Bink video "
sar_con_filter_block "^VideoPanel::OnClose()"
sar_con_filter_block "^Credits starting: PixelMarginX: "
sar_con_filter_block " has a bad look target ("
sar_con_filter_block "^Dead end link: "
sar_con_filter_block "^vcd error, gesture"
sar_con_filter_block "^*************************************************************************************************$"
sar_con_filter_block "is awaiting refire. OUTPUTS WILL NOT BE FIRED!!!$"
sar_con_filter_block "^eyes_updown"
sar_con_filter_block "^eyes_rightleft"
sar_con_filter_block "^Playing demo from "
sar_con_filter_block "^Trying to parse "
sar_con_filter_block "^Demo playback finished ("
sar_con_filter_block "^VScript error: DoEntFire was passed an invalid entity instance.$"
sar_con_filter_block "^==========GRABBED A TURRET!$"

// Tested in coop
sar_con_filter_block "^-> Reservation cookie"
sar_con_filter_block "^LobbySetData:"
sar_con_filter_block "^Accepted P2P connection with"
sar_con_filter_block "^playvideo_end_level_transition"
sar_con_filter_block "^Generated 0.0.0.1:1 for "
sar_con_filter_block "^Received connection fail for user "
sar_con_filter_block "^  Attempted to send "
sar_con_filter_block "Destroyed NS_SERVER connection to"
sar_con_filter_block "^DLCMANAGER: RequestDlcUpdate has no new content.$"
sar_con_filter_block "^Performance warning: Add "
sar_con_filter_block "^[ spawning ] - "
sar_con_filter_block "@@@@@@@@@ INCREMENTING INDEX TO: "
sar_con_filter_block "^Precache called on a point_template that has no templates: "
sar_con_filter_block "^ERROR!: Can't create physics object for "
sar_con_filter_block " with conflicting collision settings, removing "
sar_con_filter_block " does not have attachment '"
sar_con_filter_block "^pPlayerLocal("
sar_con_filter_block "^================DUMPING CREDITS$" "^================END DUMP$"
sar_con_filter_block "^Executing listen server config file$"
sar_con_filter_block "^exec: couldn't exec listenserver.cfg$"
sar_con_filter_block "^Processing Split Screen connection packet.$"
sar_con_filter_block "^GetUserSetting: cvar 'name' unknown.$"
sar_con_filter_block "^No pure server whitelist. sv_pure = 0$"
sar_con_filter_block "^Couldn't find customization file 'materials/vgui/logos/spray_bullseye.vtf'.$"
sar_con_filter_block "^Cannot verify load for invalid steam ID ["
sar_con_filter_block "^Compressing fragments for"
sar_con_filter_block "^TAUNT owned: "
sar_con_filter_block "^TAUNT used: "
sar_con_filter_block "^Empty ambient_generic "
sar_con_filter_block "^CSoundEmitterSystemBase::GetParametersForSound"
sar_con_filter_block "^EmitSound: "
sar_con_filter_block "^dmg: " "^*******************DEATH***************************$"
sar_con_filter_block "^*******************DEATH***************************$" "^player: "
sar_con_filter_block "^Shadow memory (m_Shadow"
sar_con_filter_block "using obsolete or unknown material type.$"
sar_con_filter_block "^Can't init ai_addon_builder$"
sar_con_filter_block "^May not have cleaned up on NPC death$"
sar_con_filter_block "^=================TURRET NAME:"
sar_con_filter_block "^***Spawning a turret to shoot at dummy!$"
sar_con_filter_block "^Turret model swapped"
sar_con_filter_block "^Error: Material "
sar_con_filter_block " has a normal map and "
sar_con_filter_block " but there is no matching entry in propdata.txt.$"
sar_con_filter_block "^KeyValues Error: "
sar_con_filter_block "^VertexLitGeneric"
sar_con_filter_block "^PM  Got a velocity too low on Z$"
sar_con_filter_block "^Unhandled animation event "
sar_con_filter_block " used on world geometry without rebuilding map."
sar_con_filter_block " There is probably no script entry matching this name."
sar_con_filter_block "^Can't find soundscape:"
sar_con_filter_block "mdl : missmatched parent bones on "
sar_con_filter_block "^C_GameInstructor::ReadSaveData failed to read"
sar_con_filter_block "' while system disabled.$"
sar_con_filter_block "^CL_QueueEvent: missing server class info" "^Raw$"
sar_con_filter_block "^PKT  >>  "
`);
src.cfg.add('dialogue_toasts/sp', `cond "map=sp_a1_intro1"                                    sar_toast_create fade "in a dire e[mer]gency"
cond "map=sp_a1_intro2"                                    sar_toast_create fade "Aperture Science Reintegration [As]sociate"
cond "map=sp_a1_intro3"                                    sar_toast_create fade "asked that [first]. ... I'm just gonna [wait]"
cond "map=sp_a1_intro4           & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a1_intro5"                                    sar_toast_create fade "personality [constructs] will remain"
cond "map=sp_a1_intro6"                                    sar_toast_create fade "please [return] to your primitive tribe"
cond "map=sp_a1_intro7           & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a1_wakeup           & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_intro"                                     sar_toast_create fade "testing [for] the rest of your life"
cond "map=sp_a2_laser_intro      & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_laser_stairs"                              sar_toast_create fade "that's what it says: a [horrible] person"
cond "map=sp_a2_dual_lasers"                               sar_toast_create fade "you on beating [the] odds and"
cond "map=sp_a2_laser_over_goo   & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_catapult_intro"                            sar_toast_create fade "room full of air [for] the rest"
cond "map=sp_a2_trust_fling      & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_pit_flings       & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_fizzler_intro    & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_sphere_peek      & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_ricochet"                                  sar_toast_create fade "I did see some humans. [*]"
cond "map=sp_a2_bridge_intro"                              sar_toast_create fade "guess 'sharks'? Because [that's] wrong"
cond "map=sp_a2_bridge_the_gap"                            sar_toast_create fade "there's lots of room [here]"
cond "map=sp_a2_turret_intro     & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_laser_relays"                              sar_toast_create fade "Technically, it's a [medical] experiment"
cond "map=sp_a2_turret_blocker"                            sar_toast_create fade "A man [and] a woman"
cond "map=sp_a2_laser_vs_turret"                           sar_toast_create fade "[2nd high note]"
cond "map=sp_a2_pull_the_rug"                              sar_toast_create fade "After all [these] years"
cond "map=sp_a2_column_blocker   & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_laser_chaining   & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_triple_laser"                              sar_toast_create fade "look at things objectively, [see] what you"
cond "map=sp_a2_bts1             & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_bts2             & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_bts3             & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_bts4             & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_bts5             & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_bts6             & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a2_core             & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a3_00               & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a3_01               & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a3_03               & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a3_jump_intro"                                sar_toast_create fade "lab boys gave me: [*] do not"
cond "map=sp_a3_bomb_flings"                               sar_toast_create fade "had fluorescent [calcium] in it"
cond "map=sp_a3_crazy_box"                                 sar_toast_create fade "special safety door [*] that won't"
cond "map=sp_a3_transition01     & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a3_speed_ramp"                                sar_toast_create fade "With your help, we're gonna [change] the world"
cond "map=sp_a3_speed_flings"                              sar_toast_create fade "I mentioned earlier. [Again]: all you gotta do"
cond "map=sp_a3_portal_intro     & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a3_end              & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a4_intro"                                     sar_toast_create fade "paradox idea didn't work. [And] it almost"
cond "map=sp_a4_tb_intro"                                  sar_toast_create fade "The good [news] is..."
cond "map=sp_a4_tb_trust_drop"                             sar_toast_create fade "I know we're in a lot [of] trouble"
cond "map=sp_a4_tb_wall_button"                            sar_toast_create fade "Oh no... [*] it's happening"
cond "map=sp_a4_tb_polarity      & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a4_tb_catch"                                  sar_toast_create fade "can get a little... [unbearable]"
cond "map=sp_a4_stop_the_box"                              sar_toast_create fade "No. [No]. That was the solution"
cond "map=sp_a4_laser_catapult"                            sar_toast_create fade "any of the [crucial] functions required"
cond "map=sp_a4_laser_platform   & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a4_speed_tb_catch"                            sar_toast_create fade "gonna love it, to [*] death"
cond "map=sp_a4_jump_polarity"                             sar_toast_create fade "got a surprise [for] us"
cond "map=sp_a4_finale1          & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a4_finale2          & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a4_finale3          & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
cond "map=sp_a4_finale4          & var:show_blank_fades=1" sar_toast_create fade "[no fade]"
`);
src.cfg.add('map_detect/portal2', `sar_function setmap "svar_set chapter $1; svar_set course $1; svar_set map $2; svar_set formatted_map $'$3$'; svar_set builtin_map 1"

svar_set builtin_map 0
svar_set chapter 0
svar_set course 0
svar_set chapter_name unknown
svar_set course_name unknown
svar_set map unknown
svar_set role unknown

cond "!coop" svar_set role sp
cond "coop & orange"  svar_set role orange
cond "coop & !orange" svar_set role blue

cond "map=sp_a5_credits"    setmap 0 credits          "Credits"
cond "map=credits"          setmap 0 credits          "Credits"
cond "map=mp_coop_credits"  setmap 0 credits          "Credits"
cond "map=credits_museum"   setmap 0 credits-museum   "Credits Museum"
cond "map=celeste_moonroom" setmap 0 celeste-moonroom "Moon Room"

cond "map=sp_a1_intro1"  setmap 1 container-ride  "Container Ride"
cond "map=sp_a1_intro2"  setmap 1 portal-carousel "Portal Carousel"
cond "map=sp_a1_intro3"  setmap 1 portal-gun      "Portal Gun"
cond "map=sp_a1_intro4"  setmap 1 smooth-jazz     "Smooth Jazz"
cond "map=sp_a1_intro5"  setmap 1 cube-momentum   "Cube Momentum"
cond "map=sp_a1_intro6"  setmap 1 future-starter  "Future Starter"
cond "map=sp_a1_intro7"  setmap 1 secret-panel    "Secret Panel"
cond "map=sp_a1_wakeup"  setmap 1 wakeup          "Wakeup"
cond "map=sp_a2_intro"   setmap 1 incinerator     "Incinerator"

cond "map=sp_a2_laser_intro"     setmap 2 laser-intro    "Laser Intro"
cond "map=sp_a2_laser_stairs"    setmap 2 laser-stairs   "Laser Stairs"
cond "map=sp_a2_dual_lasers"     setmap 2 dual-lasers    "Dual Lasers"
cond "map=sp_a2_laser_over_goo"  setmap 2 laser-over-goo "Laser Over Goo"
cond "map=sp_a2_catapult_intro"  setmap 2 catapult-intro "Catapult Intro"
cond "map=sp_a2_trust_fling"     setmap 2 trust-fling    "Trust Fling"
cond "map=sp_a2_pit_flings"      setmap 2 pit-flings     "Pit Flings"
cond "map=sp_a2_fizzler_intro"   setmap 2 fizzler-intro  "Fizzler Intro"

cond "map=sp_a2_sphere_peek"      setmap 3 ceiling-catapult "Ceiling Catapult"
cond "map=sp_a2_ricochet"         setmap 3 ricochet         "Ricochet"
cond "map=sp_a2_bridge_intro"     setmap 3 bridge-intro     "Bridge Intro"
cond "map=sp_a2_bridge_the_gap"   setmap 3 bridge-the-gap   "Bridge The Gap"
cond "map=sp_a2_turret_intro"     setmap 3 turret-intro     "Turret Intro"
cond "map=sp_a2_laser_relays"     setmap 3 laser-relays     "Laser Relays"
cond "map=sp_a2_turret_blocker"   setmap 3 turret-blocker   "Turret Blocker"
cond "map=sp_a2_laser_vs_turret"  setmap 3 laser-vs-turret  "Laser vs Turret"
cond "map=sp_a2_pull_the_rug"     setmap 3 pull-the-rug     "Pull the Rug"

cond "map=sp_a2_column_blocker"  setmap 4 column-blocker "Column Blocker"
cond "map=sp_a2_laser_chaining"  setmap 4 laser-chaining "Laser Chaining"
cond "map=sp_a2_triple_laser"    setmap 4 triple-laser   "Triple Laser"
cond "map=sp_a2_bts1"            setmap 4 jailbreak      "Jailbreak"
cond "map=sp_a2_bts2"            setmap 4 escape         "Escape"

cond "map=sp_a2_bts3"  setmap 5 turret-factory      "Turret Factory"
cond "map=sp_a2_bts4"  setmap 5 turret-sabotage     "Turret Sabotage"
cond "map=sp_a2_bts5"  setmap 5 neurotoxin-sabotage "Neurotoxin Sabotage"
cond "map=sp_a2_bts6"  setmap 5 tube-ride           "Tube Ride"
cond "map=sp_a2_core"  setmap 5 core                "Core"

cond "map=sp_a3_00"            setmap 6 long-fall       "Long Fall"
cond "map=sp_a3_01"            setmap 6 underground     "Underground"
cond "map=sp_a3_03"            setmap 6 cave-johnson    "Cave Johnson"
cond "map=sp_a3_jump_intro"    setmap 6 repulsion-intro "Repulsion Intro"
cond "map=sp_a3_bomb_flings"   setmap 6 bomb-flings     "Bomb Flings"
cond "map=sp_a3_crazy_box"     setmap 6 crazy-box       "Crazy Box"
cond "map=sp_a3_transition01"  setmap 6 potatos         "PotatOS"

cond "map=sp_a3_speed_ramp"    setmap 7 propulsion-intro  "Propulsion Intro"
cond "map=sp_a3_speed_flings"  setmap 7 propulsion-flings "Propulsion Flings"
cond "map=sp_a3_portal_intro"  setmap 7 conversion-intro  "Conversion Intro"
cond "map=sp_a3_end"           setmap 7 three-gels        "Three Gels"

cond "map=sp_a4_intro"           setmap 8 test               "Test"
cond "map=sp_a4_tb_intro"        setmap 8 funnel-intro       "Funnel Intro"
cond "map=sp_a4_tb_trust_drop"   setmap 8 ceiling-button     "Ceiling Button"
cond "map=sp_a4_tb_wall_button"  setmap 8 wall-button        "Wall Button"
cond "map=sp_a4_tb_polarity"     setmap 8 polarity           "Polarity"
cond "map=sp_a4_tb_catch"        setmap 8 funnel-catch       "Funnel Catch"
cond "map=sp_a4_stop_the_box"    setmap 8 stop-the-box       "Stop the Box"
cond "map=sp_a4_laser_catapult"  setmap 8 laser-catapult     "Laser Catapult"
cond "map=sp_a4_laser_platform"  setmap 8 laser-platform     "Laser Platform"
cond "map=sp_a4_speed_tb_catch"  setmap 8 propulsion-catch   "Propulsion Catch"
cond "map=sp_a4_jump_polarity"   setmap 8 repulsion-polarity "Repulsion Polarity"

cond "map=sp_a4_finale1"  setmap 9 finale-1 "Finale 1"
cond "map=sp_a4_finale2"  setmap 9 finale-2 "Finale 2"
cond "map=sp_a4_finale3"  setmap 9 finale-3 "Finale 3"
cond "map=sp_a4_finale4"  setmap 9 finale-4 "Finale 4"

cond "map=mp_coop_start"   setmap 0 calibration "Calibration"
cond "map=mp_coop_lobby_3" setmap 0 lobby "Lobby"

cond "map=mp_coop_doors"          setmap 1 doors             "Doors"
cond "map=mp_coop_race_2"         setmap 1 buttons           "Buttons"
cond "map=mp_coop_laser_2"        setmap 1 lasers            "Lasers"
cond "map=mp_coop_rat_maze"       setmap 1 rat-maze          "Rat Maze"
cond "map=mp_coop_laser_crusher"  setmap 1 laser-crusher     "Laser Crusher"
cond "map=mp_coop_teambts"        setmap 1 behind-the-scenes "Behind the Scenes"

cond "map=mp_coop_fling_3"            setmap 2 flings          "Flings"
cond "map=mp_coop_infinifling_train"  setmap 2 infinifling     "Infinifling"
cond "map=mp_coop_come_along"         setmap 2 team-retrieval  "Team Retrieval"
cond "map=mp_coop_fling_1"            setmap 2 vertical-flings "Vertical Flings"
cond "map=mp_coop_catapult_1"         setmap 2 catapults       "Catapults"
cond "map=mp_coop_multifling_1"       setmap 2 multifling      "Multifling"
cond "map=mp_coop_fling_crushers"     setmap 2 fling-crushers  "Fling Crushers"
cond "map=mp_coop_fan"                setmap 2 industrial-fan  "Industrial Fan"

cond "map=mp_coop_wall_intro"           setmap 3 cooperative-bridges "Cooperative Bridges"
cond "map=mp_coop_wall_2"               setmap 3 bridge-swap         "Bridge Swap"
cond "map=mp_coop_catapult_wall_intro"  setmap 3 fling-block         "Fling Block"
cond "map=mp_coop_wall_block"           setmap 3 catapult-block      "Catapult Block"
cond "map=mp_coop_catapult_2"           setmap 3 bridge-fling        "Bridge Fling"
cond "map=mp_coop_turret_walls"         setmap 3 turret-walls        "Turret Walls"
cond "map=mp_coop_turret_ball"          setmap 3 turret-assassin     "Turret Assassin"
cond "map=mp_coop_wall_5"               setmap 3 bridge-testing      "Bridge Testing"

cond "map=mp_coop_tbeam_redirect"       setmap 4 cooperative-funnels  "Cooperative Funnels"
cond "map=mp_coop_tbeam_drill"          setmap 4 funnel-drill         "Funnel Drill"
cond "map=mp_coop_tbeam_catch_grind_1"  setmap 4 funnel-catch         "Funnel Catch"
cond "map=mp_coop_tbeam_laser_1"        setmap 4 funnel-laser         "Funnel Laser"
cond "map=mp_coop_tbeam_polarity"       setmap 4 cooperative-polarity "Cooperative Polarity"
cond "map=mp_coop_tbeam_polarity2"      setmap 4 funnel-hop           "Funnel Hop"
cond "map=mp_coop_tbeam_polarity3"      setmap 4 advanced-polarity    "Advanced Polarity"
cond "map=mp_coop_tbeam_maze"           setmap 4 funnel-maze          "Funnel Maze"
cond "map=mp_coop_tbeam_end"            setmap 4 turret-warehouse     "Turret Warehouse"

cond "map=mp_coop_paint_come_along"      setmap 5 repulsion-jumps      "Repulsion Jumps"
cond "map=mp_coop_paint_redirect"        setmap 5 double-bounce        "Double Bounce"
cond "map=mp_coop_paint_bridge"          setmap 5 bridge-repulsion     "Bridge Repulsion"
cond "map=mp_coop_paint_walljumps"       setmap 5 wall-repulsion       "Wall Repulsion"
cond "map=mp_coop_paint_speed_fling"     setmap 5 propulsion-crushers  "Propulsion Crushers"
cond "map=mp_coop_paint_red_racer"       setmap 5 turret-ninja         "Turret Ninja"
cond "map=mp_coop_paint_speed_catch"     setmap 5 propulsion-retrieval "Propulsion Retrieval"
cond "map=mp_coop_paint_longjump_intro"  setmap 5 vault-entrance       "Vault Entrance"

cond "map=mp_coop_separation_1"      setmap 6 separation     "Separation"
cond "map=mp_coop_tripleaxis"        setmap 6 triple-axis    "Triple Axis"
cond "map=mp_coop_catapult_catch"    setmap 6 catapult-catch "Catapult Catch"
cond "map=mp_coop_2paints_1bridge"   setmap 6 bridge-gels    "Bridge Gels"
cond "map=mp_coop_paint_conversion"  setmap 6 maintenance    "Maintenance"
cond "map=mp_coop_bridge_catch"      setmap 6 bridge-catch   "Bridge Catch"
cond "map=mp_coop_laser_tbeam"       setmap 6 double-lift    "Double Lift"
cond "map=mp_coop_paint_rat_maze"    setmap 6 gel-maze       "Gel Maze"
cond "map=mp_coop_paint_crazy_box"   setmap 6 crazier-box    "Crazier Box"

cond "!coop & var:chapter=1" svar_set chapter_name the-courtesy-call
cond "!coop & var:chapter=2" svar_set chapter_name the-cold-boot
cond "!coop & var:chapter=3" svar_set chapter_name the-return
cond "!coop & var:chapter=4" svar_set chapter_name the-surprise
cond "!coop & var:chapter=5" svar_set chapter_name the-escape
cond "!coop & var:chapter=6" svar_set chapter_name the-fall
cond "!coop & var:chapter=7" svar_set chapter_name the-reunion
cond "!coop & var:chapter=8" svar_set chapter_name the-itch
cond "!coop & var:chapter=9" svar_set chapter_name the-part-where-he-kills-you

cond "coop & var:chapter=1" svar_set chapter_name team-building
cond "coop & var:chapter=2" svar_set chapter_name mass-and-velocity
cond "coop & var:chapter=3" svar_set chapter_name hard-light-surfaces
cond "coop & var:chapter=4" svar_set chapter_name excursion-funnels
cond "coop & var:chapter=5" svar_set chapter_name mobility-gels
cond "coop & var:chapter=6" svar_set chapter_name art-therapy

sar_expand svar_set course_name $chapter_name

cond "coop"  sar_expand svar_set chapter_course "course$chapter"
cond "!coop" sar_expand svar_set chapter_course "chapter$chapter"
`);
})();
