(function() {
if (!src) return false;
src.cfg.add('autoexec', true, `// It's important that tetris is only initialised once
svar_set sartris_root "minigames/tetris"
exec util
lcg_set_state ${Math.floor(Math.random() * 10000)}
cond "!var:sartris_init=1" "svar_set sartris_init 1; sar_expand exec $sartris_root/runonce"
// The actual init is in runonce.cfg
sar_on_tick_enable

bind a "sartris_player_move -1 0"
bind w "sartris_player_rot 1"
bind s "sartris_player_move 0 1"
bind d "sartris_player_move 1 0"
`);
	src.cfg.add('minigames/tetris/runonce', false, `
svar_set sartris_version "0.0.3"
svar_set sartris_build "22/02/2022"
sar_function sartris_about "echo $'SARtris Classic v$sartris_version (Built $sartris_build)$'; echo $'Created and maintained by AMJ$'; echo $'More information (not yet) available at thisamj.github.io/sartris$'"
sartris_about

// Define tetrominoes
sar_expand exec $sartris_root/tetrominoes

sar_function sartris_clear_lines "svar_set __sartris_clear_i 19; repeat $'__sartris_clear_lines; svar_sub __sartris_clear_i 1$' 20"
sar_function __sartris_clear_lines "svar_set __sartris_clear_j 0; sartris_line_check; less_than 0 1; while $'!var:__sartris_line_check=$sartris_tex_empty & var:less_than_ret=1$' ___sartris_clear_lines; cond $'var:less_than_ret=0$' sartris_clear_line $__sartris_clear_i"
sar_function ___sartris_clear_lines "sartris_line_check; less_than $__sartris_clear_j 20; svar_add __sartris_clear_j 1"
sar_function sartris_line_check "sar_expand svar_set __sartris_line_check $'$$sartris_dbuf_$__sartris_clear_i$-_$__sartris_clear_j$'"
sar_function sartris_clear_line "_sartris_clear_line $1; svar_add __sartris_clear_i 1"
sar_function _sartris_clear_line "__sartris_line_drop $1; svar_set __tmp $1; svar_sub __tmp 1; cond $'!var:__tmp=0$' sar_expand _sartris_clear_line $$__tmp"

sar_function __sartris_line_drop    "svar_set __sartris_line_drop_i 0; repeat $'__sartris_line_drop_h $1; svar_add __sartris_line_drop_i 1$' 10"
sar_function __sartris_line_drop_h  "svar_set __tmp $1; svar_sub __tmp 1; sar_expand sar_expand sartris_dbuf_set  $__sartris_line_drop_i $1 $'$$$$sartris_dbuf_$$__tmp$$-_$__sartris_line_drop_i$'"
// sar_function __sartris_clear_line "___sartris_clear_line $1 0; ___sartris_clear_line $1 1; ___sartris_clear_line $1 2; ___sartris_clear_line $1 3; ___sartris_clear_line $1 4; ___sartris_clear_line $1 5; ___sartris_clear_line $1 6; ___sartris_clear_line $1 7; ___sartris_clear_line $1 8; ___sartris_clear_line $1 9"
// sar_function ___sartris_clear_line "svar_set __tmp $1; svar_sub __tmp 1; sar_expand sar_expand sartris_dbuf_set $1 $2 $'$$$$sartris_dbuf_$$__tmp$-_$2$'"
// sar_function sartris_set_top 

sar_function sartris_player_lock "sartris_player_collide_undraw 0 1 $sartris_player_rot; __choose $'var:sartris_player_collide_ret=1$' $'sartris_player_draw; sartris_clear_lines; sartris_player_new; sartris_player_draw$' $'$1$'"
sar_function sartris_player_gravity "sartris_player_lock $'sartris_player_move 0 1 $sartris_player_rot$'"
sar_function sartris_player_move "sartris_player_lock nop; sartris_player_collide_undraw $1 $2 $sartris_player_rot; cond $'var:sartris_player_collide_ret=0$' $'svar_add sartris_player_x $1; svar_add sartris_player_y $2$'; sartris_player_draw"
sar_function __sartris_player_move "sartris_player_undraw; svar_add sartris_player_x $1; svar_add sartris_player_y $2; sartris_player_draw"
sar_function sartris_player_rot "svar_set sartris_player_rotdesired $sartris_player_rot; svar_add sartris_player_rotdesired $1; svar_mod sartris_player_rotdesired 4; sar_expand sartris_player_collide_undraw 0 0 $$sartris_player_rotdesired; cond $'var:sartris_player_collide_ret=0$' $'sar_expand svar_set sartris_player_rot $$sartris_player_rotdesired$'; sartris_player_draw"

// sartris_player_collide <x_off> <y_off> <rot>
// Return var: sartris_player_collide_ret
sar_alias sartris_player_collide_undraw "sartris_player_undraw; sartris_player_collide"
sar_function sartris_player_collide "svar_set sartris_player_collide_ret 0; sartris_player_minocoord_foreach $'__sartris_player_collide $1 $2$' $3"
sar_function __sartris_player_collide "svar_add __tmp_x $1; svar_add __tmp_y $2; sar_expand less_than $$__tmp_x 0; sar_expand cond $'var:less_than_ret=1 | !var:sartris_dbuf_$$__tmp_y$$-_$$__tmp_x=$sartris_tex_empty$' svar_set sartris_player_collide_ret 1; sar_expand less_than $$__tmp_x 10; cond $'var:less_than_ret=0$' svar_set sartris_player_collide_ret 1; sar_expand less_than $$__tmp_y 20; cond $'var:less_than_ret=0$' svar_set sartris_player_collide_ret 1"

sar_function sartris_player_minocoord_foreach "svar_set __tmp_sartris_player $'$1$'; svar_set __tmp_minocoord_rot $'$2$'; or __tmp_minocoord_rot $sartris_player_rot; sar_expand sartris_minocoord_for __sartris_player_minocoord_foreach $sartris_player_piece $$__tmp_minocoord_rot"
sar_function __sartris_player_minocoord_foreach "svar_add __tmp_x $sartris_player_x; svar_add __tmp_y $sartris_player_y; sar_expand $__tmp_sartris_player $$__tmp_x $$__tmp_y"

sar_function sartris_next_minocoord_foreach "sartris_minocoord_for $'$1$' $sartris_next_piece 0"

sar_function sartris_minocoord_for "svar_set __sartris_minocoord_for $'$1$'; svar_set __sartris_minocoord_piece $2; svar_set __sartris_minocoord_rot $3; svar_set __sartris_minocoord_i 0; repeat $'__sartris_minocoord_for; svar_add __sartris_minocoord_i 1$' 4"
sar_function __sartris_minocoord_for "sar_expand $'svar_set __tmp_x $$__mino_$__sartris_minocoord_piece$-$__sartris_minocoord_rot$-$__sartris_minocoord_i$-_x; svar_set __tmp_y $$__mino_$__sartris_minocoord_piece$-$__sartris_minocoord_rot$-$__sartris_minocoord_i$-_y$'; sar_expand $$__sartris_minocoord_for $$__tmp_x $$__tmp_y"

svar_set sartris_hud_offset 1000
sar_expand exec $sartris_root/display

sar_function sartris_player_new "svar_set sartris_player_piece $'$sartris_next_piece$'; rand 7; sar_expand svar_set sartris_next_piece $$rand_ret; svar_set sartris_player_x 4; sar_expand svar_set sartris_player_y $'$$__mino_$sartris_next_piece$-top$'; svar_set sartris_player_rot 0; sartris_next_draw"
sartris_player_new; sartris_player_new
sartris_player_draw

sar_on_tick_clear
sar_on_tick "sartris_tick"
sar_function sartris_tick "svar_add sartris_gravity 1; svar_mod sartris_gravity 60; cond $'var:sartris_gravity=0$' sartris_player_gravity"
sar_on_tick "sartris_draw"

svar_set sartris_init 0`);
	src.cfg.add('minigames/tetris/display', false, `// minigameDisplayHgt = Height of minigame in hud lines
// svar_set minigameDisplayIdx 0
// sar_expand repeat "sar_expand sar_expand sar_hud_set_text $$minigameDisplayIdx $$$$minigameDisplayBuf$$minigameDisplayIdx; svar_add minigameDisplayIdx 1" $minigameDisplayHgt

// Textures
svar_set sartris_tex_empty  "#7F7F7F.."
svar_set sartris_tex_piece0 "#00FFFF[]" // I piece
svar_set sartris_tex_piece1 "#0000FF[]" // J piece
svar_set sartris_tex_piece2 "#FF7F00[]" // L piece
svar_set sartris_tex_piece3 "#FFFF00[]" // O piece
svar_set sartris_tex_piece4 "#800080[]" // T piece
svar_set sartris_tex_piece5 "#00FF00[]" // S piece
svar_set sartris_tex_piece6 "#FF0000[]" // Z piece

sar_expand svar_set sartris_tex_empty_x4 "$sartris_tex_empty$sartris_tex_empty$sartris_tex_empty$sartris_tex_empty"

// Display buffer for the game grid
sar_function   sartris_dbuf_set     "svar_set sartris_dbuf_$2_$1 $'$3$'"
sar_alias      sartris_dbuf_clear   "svar_set __tmp -2; repeat __sartris_dbuf_clear_r 22"
sar_alias    __sartris_dbuf_clear_r "svar_set __tmp1 0; repeat __sartris_dbuf_clear_c 10; svar_add __tmp 1"
sar_function __sartris_dbuf_clear_c "sartris_dbuf_set $__tmp1 $__tmp $sartris_tex_empty; svar_add __tmp1 1"
sartris_dbuf_clear

// Display buffer for the Next piece display
// Got lazy here
sar_function   sartris_nbuf_set     "svar_set sartris_nbuf_$2_$1 $'$3$'"
sar_alias      sartris_nbuf_clear   "svar_set __tmp 1; repeat __sartris_nbuf_clear_r 4"
sar_alias    __sartris_nbuf_clear_r "svar_set __tmp1 0; repeat __sartris_nbuf_clear_c 4; svar_add __tmp 1"
sar_function __sartris_nbuf_clear_c "sartris_nbuf_set $__tmp1 $__tmp $'  $'; svar_add __tmp1 1"

sar_function   sartris_nbuf_compose "svar_set __tmp 0; repeat __sartris_nbuf_compose_r 5"
sar_function __sartris_nbuf_compose_r "sar_expand svar_set sartris_nbuf_$__tmp $'$$sartris_nbuf_$__tmp$-_0$$sartris_nbuf_$__tmp$-_1$$sartris_nbuf_$__tmp$-_2$$sartris_nbuf_$__tmp$-_3$'; svar_add __tmp 1"

sartris_nbuf_clear

sar_alias sartris_player_undraw sartris_player_minocoord_foreach __sartris_player_undraw
sar_function __sartris_player_undraw sartris_dbuf_set $1 $2 $sartris_tex_empty

sar_alias sartris_player_draw sartris_player_minocoord_foreach __sartris_player_draw
sar_function __sartris_player_draw sar_expand sartris_dbuf_set $1 $2 $$sartris_tex_piece$sartris_player_piece

sar_function sartris_next_draw "sartris_nbuf_clear; sartris_next_minocoord_foreach __sartris_next_draw; sartris_nbuf_set 0 0 $'#7F7F7F NEXT: $'; sartris_nbuf_compose"
sar_function __sartris_next_draw "svar_add __tmp_x 1; svar_add __tmp_y 1; svar_add __tmp_y __mino_$sartris_next_piece$-top; sar_expand sartris_nbuf_set $$__tmp_x $$__tmp_y $$sartris_tex_piece$sartris_next_piece"

// sar_function sartris_nbuf_reset "svar_set __sartris_dbuf_0 $'  NEXT: $'; svar_set __sartris_dbuf_1 $'$sartris_tex_empty_x4$'; svar_set __sartris_dbuf_2 $'$sartris_tex_empty_x4$'; svar_set __sartris_dbuf_3 $'$sartris_tex_empty_x4$'; svar_set __sartris_dbuf_4 $'$sartris_tex_empty_x4$'"
sar_function sartris_draw "svar_set __stris_dii 0; svar_set __stris_dih $sartris_hud_offset; repeat $'sartris_draw_row; svar_add __stris_dii 1; svar_add __stris_dih 1$' 20"
sar_function sartris_draw_row "sar_expand sar_hud_set_text $__stris_dih $'$$sartris_dbuf_$__stris_dii$-_0$$sartris_dbuf_$__stris_dii$-_1$$sartris_dbuf_$__stris_dii$-_2$$sartris_dbuf_$__stris_dii$-_3$$sartris_dbuf_$__stris_dii$-_4$$sartris_dbuf_$__stris_dii$-_5$$sartris_dbuf_$__stris_dii$-_6$$sartris_dbuf_$__stris_dii$-_7$$sartris_dbuf_$__stris_dii$-_8$$sartris_dbuf_$__stris_dii$-_9  $$sartris_nbuf_$__stris_dii$'"`);
	src.cfg.add('minigames/tetris/tetrominoes', false, `// tetrominoes for tetris

//                   0-6    0-3  0-3  
// stored as __mino_<piece><rot><block>_{x,y}

sar_function __mino_definedefinerot "sar_function __mino_definerot$1 $'svar_set __mino_$$1$10_x $$2; svar_set __mino_$$1$10_y $$3; svar_set __mino_$$1$11_x $$4; svar_set __mino_$$1$11_y $$5; svar_set __mino_$$1$12_x $$6; svar_set __mino_$$1$12_y $$7; svar_set __mino_$$1$13_x $$8; svar_set __mino_$$1$13_y $$9$'"
__mino_definedefinerot 0; __mino_definedefinerot 1; __mino_definedefinerot 2; __mino_definedefinerot 3

// I piece (0)
// Rot 0      1      2      3
// [    ] [  0 ] [    ] [  0 ]
// [    ] [  1 ] [    ] [  1 ]
// [0123] [  2 ] [0123] [  2 ]
// [    ] [  3 ] [    ] [  3 ]
svar_set __mino_0top -1
__mino_definerot0 0 -1 1 0 1 1 1 2 1
__mino_definerot1 0 1 -1 1 0 1 1 1 2
__mino_definerot2 0 -1 1 0 1 1 1 2 1
__mino_definerot3 0 1 -1 1 0 1 1 1 2

// J piece (1)
// Rot 0      1      2      3
// [    ] [ 01 ] [0   ] [ 0  ]
// [012 ] [ 2  ] [123 ] [ 1  ]
// [  3 ] [ 3  ] [    ] [23  ]
// [    ] [    ] [    ] [    ]
svar_set __mino_1top 0
__mino_definerot0 1 -1 0 0 0 1 0 1 1
__mino_definerot1 1 0 -1 1 -1 0 0 0 1
__mino_definerot2 1 -1 -1 -1 0 0 0 1 0
__mino_definerot3 1 0 -1 0 0 -1 1 0 1

// L piece (2)
// Rot 0      1      2      3
// [    ] [ 0  ] [  0 ] [01  ]
// [012 ] [ 1  ] [123 ] [ 2  ]
// [3   ] [ 23 ] [    ] [ 3  ]
// [    ] [    ] [    ] [    ]
svar_set __mino_2top 0
__mino_definerot0 2 -1 0 0 0 1 0 -1 1
__mino_definerot1 2 0 -1 0 0 0 1 1 1
__mino_definerot2 2 1 -1 -1 0 0 0 1 0
__mino_definerot3 2 -1 -1 0 -1 0 0 0 1

// O piece (3)
// Rot 0      1      2      3
// [    ] [    ] [    ] [    ]
// [ 01 ] [ 01 ] [ 01 ] [ 01 ]
// [ 23 ] [ 23 ] [ 23 ] [ 23 ]
// [    ] [    ] [    ] [    ]
svar_set __mino_3top 0
__mino_definerot0 3 0 0 1 0 0 1 1 1
__mino_definerot1 3 0 0 1 0 0 1 1 1
__mino_definerot2 3 0 0 1 0 0 1 1 1
__mino_definerot3 3 0 0 1 0 0 1 1 1

// T piece (4)
// Rot 0      1      2      3
// [ 0  ] [ 0  ] [    ] [ 0  ]
// [123 ] [12  ] [012 ] [ 12 ]
// [    ] [ 3  ] [ 3  ] [ 3  ]
// [    ] [    ] [    ] [    ]
svar_set __mino_4top 1
__mino_definerot0 4 0 -1 -1 0 0 0 1 0
__mino_definerot1 4 0 -1 -1 0 0 0 0 1
__mino_definerot2 4 -1 0 0 0 1 0 0 1
__mino_definerot3 4 0 -1 0 0 1 0 0 1

// S piece (5)
// Rot 0      1      2      3
// [    ] [ 0  ] [    ] [ 0  ]
// [ 01 ] [ 12 ] [ 01 ] [ 12 ]
// [23  ] [  3 ] [23  ] [  3 ]
// [    ] [    ] [    ] [    ]
svar_set __mino_5top 0
__mino_definerot0 5 0 0 1 0 -1 1 0 1
__mino_definerot1 5 0 -1 0 0 1 0 1 1
__mino_definerot2 5 0 0 1 0 -1 1 0 1
__mino_definerot3 5 0 -1 0 0 1 0 1 1

// Z piece (6)
// Rot 0      1      2      3
// [    ] [  0 ] [    ] [  0 ]
// [01  ] [ 12 ] [01  ] [ 12 ]
// [ 23 ] [ 3  ] [ 23 ] [ 3  ]
// [    ] [    ] [    ] [    ]
svar_set __mino_6top 0
__mino_definerot0 6 -1 0 0 0 0 1 1 1
__mino_definerot1 6 1 -1 0 0 1 0 0 1
__mino_definerot2 6 -1 0 0 0 0 1 1 1
__mino_definerot3 6 1 -1 0 0 1 0 0 1

sar_function __mino_definerot0 nop; sar_function __mino_definerot1 nop; sar_function __mino_definerot2 nop; sar_function __mino_definerot3 nop; sar_function __mino_definedefinerot nop`);
	src.cfg.add('util', false, `
// If cond "$1" is true, do $2, otherwise do $3
sar_function __choose "cond $'$1$' $'$2$'; cond $'!($1)$' $'$3$'"

// 2^31-1
svar_set __i32_max 2147483647

sar_function __tmp_cvar_save    cond "!var:__tmp_init_cvar_$1=1" "svar_set __tmp_init_cvar_$1 1; svar_from_cvar __tmp_cvar_$1 $1"
sar_function __tmp_cvar_restore cond  "var:__tmp_init_cvar_$1=1" "svar_set __tmp_init_cvar_$1 0; sar_expand $1 $$'$$__tmp_cvar_$1$$'"

sar_alias __tmp_toast_save    "__tmp_cvar_save sar_toast_x; __tmp_cvar_save sar_toast_y; __tmp_cvar_save sar_toast_align; __tmp_cvar_save sar_toast_anchor; __tmp_cvar_save sar_toast_disable; __tmp_cvar_save sar_toast_width; __tmp_cvar_save sar_toast_background; __tmp_cvar_save sar_toast_compact; __tmp_cvar_save sar_toast_font"
sar_alias __tmp_toast_restore "__tmp_cvar_restore sar_toast_x; __tmp_cvar_restore sar_toast_y; __tmp_cvar_restore sar_toast_align; __tmp_cvar_restore sar_toast_anchor; __tmp_cvar_restore sar_toast_disable; __tmp_cvar_restore sar_toast_width; __tmp_cvar_restore sar_toast_background; __tmp_cvar_restore sar_toast_compact; __tmp_cvar_restore sar_toast_font"

sar_function or "sar_expand svar_set __tmp $'x$$$1$'; cond $'var:__tmp=x$' svar_set $'$1$' $'$2$'"

// Svar capture without clogging console
sar_function svar_capture_quiet "__tmp_cvar_save sar_con_filter; __tmp_cvar_save sar_con_filter_default; sar_con_filter 1; sar_con_filter_default 0; svar_capture $'$1$' $'$2$'; __tmp_cvar_restore sar_con_filter; __tmp_cvar_restore sar_con_filter_default"

// Registers a command to be ran every tick.
// Dependencies: less_than, while
sar_toast_tag_set_color sarontickwarning FF3333
sar_toast_tag_set_duration sarontickwarning forever
sar_function sar_on_tick "sar_function __sar_on_tick_$__sar_on_tick_len $'$1$'; svar_add __sar_on_tick_len 1"
sar_alias sar_on_tick_clear       svar_set __sar_on_tick_len 0
sar_alias sar_on_tick_remove_last svar_sub __sar_on_tick_len 1
sar_on_tick_clear
sar_function __on_tick "svar_set __on_tick_i 0; sar_expand less_than $$__on_tick_i $__sar_on_tick_len; while $'var:less_than_ret=1$' $'sar_expand __sar_on_tick_$$__on_tick_i; svar_add __on_tick_i 1; sar_expand less_than $$__on_tick_i $__sar_on_tick_len$'"
sar_function sar_on_tick_enable  cond "!var:__on_tick_init=1" sar_expand "sar_toast_create sarontickwarning $$'No runs! sar_on_tick enabled$$'; sar_alias _on_tick seq __on_tick _on_tick; _on_tick; svar_set __on_tick_init 1"
sar_function sar_on_tick_disable cond  "var:__on_tick_init=1" "sar_toast_tag_dismiss_all sarontickwarning; sar_alias _on_tick nop; svar_set __on_tick_init 0"

// Returns 1 if $1 < 0, otherwise 0
// Updated from RainbowPhoenixx's version
// Return variable: neg_ret
sar_function neg "svar_set neg_ret 1; svar_set __tmp_neg $'$1$'; svar_add __tmp_neg 0; svar_append __tmp_neg __i32_max; svar_sub __tmp_neg __i32_max; cond $'var:__tmp_neg=0$' svar_set neg_ret 0"
// Returns 1 if $1 < $2, otherwise 0
// Updated from RainbowPhoenixx's version
// Return variable: less_than_ret
// Dependencies: neg
sar_function less_than "svar_set __tmp_less_than $'$1$'; svar_sub __tmp_less_than $'$2$'; sar_expand $'neg $$__tmp_less_than$'; sar_expand $'svar_set less_than_ret $$neg_ret$'"

// Get current session tick
// Updated from mlugg's version
// Return variable: gettick_ret
// Dependencies: svar_capture_quiet
sar_function gettick  "svar_capture_quiet gettick_ret sar_session; sar_expand __gettick $$gettick_ret"
sar_function __gettick "svar_set gettick_ret $'$4$'"
// Generates a random number such that 0 <= n < $1
// Updated from RainbowPhoenixx's version
// https://en.wikipedia.org/wiki/Linear_congruential_generator
// Return variable: rand_ret
// Dependencies: gettick, neg
svar_set __lcg_a 1103515
svar_set __lcg_b 12345
svar_set __lcg_m 42949672
sar_alias lcg_set_state svar_set __lcg_state
sar_function lcg_init_seed "gettick; sar_expand lcg_set_state $'$$gettick_ret$'"
sar_function lcg_advance_state "svar_mul __lcg_state __lcg_a; svar_add __lcg_state __lcg_b; svar_mod __lcg_state __lcg_m; sar_expand neg $$__lcg_state; cond $'var:neg_ret=1$' svar_add __lcg_state __i32_max"
sar_on_config_exec lcg_init_seed // introduces some base randomness since config exec is based on network
sar_function __rng "lcg_advance_state; sar_expand svar_set $1_ret $'$$__lcg_state$'; svar_mod $1_ret $2"
sar_alias rng    __rng rng
sar_alias rand   __rng rand
sar_alias random __rnd random

// Appends / prepends the contents of svar $2 to svar $1
sar_function svar_append  sar_expand svar_set "$1" "$$$1$$$2"
sar_function svar_prepend sar_expand svar_set "$1" "$$$2$$$1"

// Sets svar $1 to its absolute value
// Dependencies: neg
sar_function svar_abs "sar_expand neg $'$$$1$'; cond $'var:neg_ret=1$' sar_expand $'svar_set __tmp_abs $$'$$$1$$'; svar_mul __tmp_abs 2; svar_sub $$'$1$$' __tmp_abs$'"

// Repeats command $1 $2 times
// Dependencies: neg
sar_function repeat "svar_set __tmp_repeat $'$2$'; svar_sub __tmp_repeat 1; sar_expand neg $$__tmp_repeat; cond $'var:neg_ret=0$' sar_expand $'$1; repeat $$'$1$$' $$__tmp_repeat$'"
sar_function repeat "svar_set __tmp_repeat $'$2$'; svar_sub __tmp_repeat 1; cond $'!var:__tmp_repeat=-1$' sar_expand $'$1; repeat $$'$1$$' $$__tmp_repeat$'"

// Repeats command $2 while cond $1 is true
svar_set while_limit 500
sar_function while   "svar_set while_i 0; _while $'$1$' $'$2$'"
sar_function _while  "svar_add while_i 1; cond $'$1$' __while $'$1$' $'$2$'"
sar_function __while "$2; cond $'var:while_i=$while_limit$' echo $'While recursion limit ($while_limit) reached$'; cond $'!var:while_i=$while_limit$' _while $'$1$' $'$2$'"`);
})();
