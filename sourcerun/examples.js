let examples = [
    {
        "name": "srconfigs",
        "run": function() {
            src.cmd.reset();
            src.cmd.executeCommand(`
                clear
                __deleteallcfgs
            `);
            queryAPI('https://github.com/p2sr/srconfigs/archive/master.zip', r => r.arrayBuffer()).then(blob => {
                
                // unzip the file and then add the .cfgs
                JSZip.loadAsync(blob).then(zip => {
                    zip.forEach((relativePath, zipEntry) => {
                        if (zipEntry.name.endsWith('.cfg')) {
                            zipEntry.async('string').then(cfg => {
                                src.cfg.set(zipEntry.name.replace(/\.cfg$/, ''), cfg);
                            });
                        }
                    });
                });

                src.cmd.executeCommand(`__srcstart`);
            });
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
