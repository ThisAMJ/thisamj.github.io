const q = e => document.getElementById(e);
function run() {
	let txt = q('input').value;
	let args = src.cmd.parseArguments(txt);
	
	let compressed = compress(args);
	q('args').value = args.map(e => `ArgC = ${e.length}\n CMD${e.length ? e.map((e, f) => (f == 0 ? '' : f < 10 ? ('$' + f) : '  ') + ' = ' + e).join('\n  ') : ''}`).join('\n\n\n');
	q('compressedtext').innerHTML = `Compression (${formatBytes(compressed.length, 3, false)}) (Saves ${formatBytes(q('input').value.length - compressed.length, 3, false)})`;
	q('compressed').value = compressed;
}

function compress(args) {
	return ''
}

window.onload = async function() {
	src.cmd.executeCommand('plugin_load "../../sourcerun/plugins/sar"');
	setTimeout(function() {
		q('input').allowTab();
		q('input').oninput = function() {run()}
		run();
		q('input').select();
	}, 100);
}
