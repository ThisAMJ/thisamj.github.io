let examples = [
    {
        "name": "srconfigs",
        "run": function() {
            src.cmd.reset();
            src.cmd.executeCommand(`
                clear
                __deleteallcfgs
                __fetchcfg autoexec "https://raw.githubusercontent.com/p2sr/srconfigs/master/autoexec.cfg"
                __fetchcfg aliases "https://raw.githubusercontent.com/p2sr/srconfigs/master/aliases.cfg"
                __fetchcfg cm_ghost "https://raw.githubusercontent.com/p2sr/srconfigs/master/cm_ghost.cfg"
                __fetchcfg con_filter "https://raw.githubusercontent.com/p2sr/srconfigs/master/con_filter.cfg"
                __fetchcfg extra "https://raw.githubusercontent.com/p2sr/srconfigs/master/extra.cfg"
                __fetchcfg mkcats "https://raw.githubusercontent.com/p2sr/srconfigs/master/mkcats.cfg"
                __fetchcfg cats/ac "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/ac.cfg"
                __fetchcfg cats/amc "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/amc.cfg"
                __fetchcfg cats/anypc "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/anypc.cfg"
                __fetchcfg cats/celeste "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/celeste.cfg"
                __fetchcfg cats/chapter_il "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/chapter_il.cfg"
                __fetchcfg cats/coop_cm "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/coop_cm.cfg"
                __fetchcfg cats/fullgame "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/fullgame.cfg"
                __fetchcfg cats/il "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/il.cfg"
                __fetchcfg cats/reverse "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/reverse.cfg"
                __fetchcfg cats/solocoop "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/solocoop.cfg"
                __fetchcfg cats/sp_cm "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/sp_cm.cfg"
                __fetchcfg cats/workshop "https://raw.githubusercontent.com/p2sr/srconfigs/master/cats/workshop.cfg"
                __fetchcfg chapter_cats/aptag "https://raw.githubusercontent.com/p2sr/srconfigs/master/chapter_cats/aptag.cfg"
                __fetchcfg chapter_cats/mel "https://raw.githubusercontent.com/p2sr/srconfigs/master/chapter_cats/mel.cfg"
                __fetchcfg chapter_cats/portal2 "https://raw.githubusercontent.com/p2sr/srconfigs/master/chapter_cats/portal2.cfg"
                __fetchcfg chapter_cats/aptag_detect "https://raw.githubusercontent.com/p2sr/srconfigs/master/chapter_cats/aptag_detect.cfg"
                __fetchcfg chapter_cats/mel_detect "https://raw.githubusercontent.com/p2sr/srconfigs/master/chapter_cats/mel_detect.cfg"
                __fetchcfg chapter_cats/portal2_detect "https://raw.githubusercontent.com/p2sr/srconfigs/master/chapter_cats/portal2_detect.cfg"
                __fetchcfg dialogue_toasts/coop "https://raw.githubusercontent.com/p2sr/srconfigs/master/dialogue_toasts/coop.cfg"
                __fetchcfg dialogue_toasts/sp "https://raw.githubusercontent.com/p2sr/srconfigs/master/dialogue_toasts/sp.cfg"
                __fetchcfg map_detect/aptag "https://raw.githubusercontent.com/p2sr/srconfigs/master/map_detect/aptag.cfg"
                __fetchcfg map_detect/mel "https://raw.githubusercontent.com/p2sr/srconfigs/master/map_detect/mel.cfg"
                __fetchcfg map_detect/portal2 "https://raw.githubusercontent.com/p2sr/srconfigs/master/map_detect/portal2.cfg"
                __fetchcfg map_detect/reloaded "https://raw.githubusercontent.com/p2sr/srconfigs/master/map_detect/reloaded.cfg"
                __fetchcfg map_list/aptag "https://raw.githubusercontent.com/p2sr/srconfigs/master/map_list/aptag.cfg"
                __fetchcfg map_list/mel "https://raw.githubusercontent.com/p2sr/srconfigs/master/map_list/mel.cfg"
                __fetchcfg map_list/portal2 "https://raw.githubusercontent.com/p2sr/srconfigs/master/map_list/portal2.cfg"
                __fetchcfg map_list/reloaded "https://raw.githubusercontent.com/p2sr/srconfigs/master/map_list/reloaded.cfg"
                // no mtriggers, too lazy and it'd take too long to DL
                __srcstart
            `);
        }
    }, {
        "name": "sartris classic",
        "run": function() {
            src.cmd.reset();
            src.cmd.executeCommand('clear; __deleteallcfgs');
            src.cfg.set('autoexec', `
            plugin_load sar
            exec tetris/tetris
            map sp_a2_laser_chaining
            bind e sartris_toggle
            bind r sartris_newgame
            bind q +sartris_rotate_cw
            bind w +sartris_rotate_ccw
            bind a +sartris_left
            bind s +sartris_drop
            bind d +sartris_right
            `.replace(/^[^a-zA-Z]*/g, '').replace(/\n[^a-zA-Z]*/g, '\n'))
            src.cmd.executeCommand(`
                __fetchcfg tetris/tetris "https://raw.githubusercontent.com/ThisAMJ/SARtris/main/tetris/tetris.cfg"
                __fetchcfg tetris/data "https://raw.githubusercontent.com/ThisAMJ/SARtris/main/tetris/data.cfg"
                __fetchcfg tetris/display "https://raw.githubusercontent.com/ThisAMJ/SARtris/main/tetris/display.cfg"
                __fetchcfg tetris/capture "https://raw.githubusercontent.com/ThisAMJ/SARtris/main/tetris/capture.cfg"
                __fetchcfg tetris/restore "https://raw.githubusercontent.com/ThisAMJ/SARtris/main/tetris/restore.cfg"
                __fetchcfg tetris/util "https://raw.githubusercontent.com/ThisAMJ/SARtris/main/tetris/util.cfg"
                __srcstart
            `);
        }
    }
];
