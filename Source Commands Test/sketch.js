const q = e => document.getElementById(e);
function run() {
	let txt = source.removeComments(q('input').value);
	let args = source.getCommandArgs(txt);

	let compressed = source.compress(txt, {
		minimizeLines: q('minLines').checked,
		minifyInsideQuotes: q('minQuotes').checked,
		removeTrailingQuotes: q('remTrail').checked,
	}).join('\n');

	q('args').value = args.map(e => `ArgC = ${e.length}\n CMD${e.length ? e.map((e, f) => (f == 0 ? '' : f < 10 ? ('$' + f) : '  ') + ' = ' + e).join('\n  ') : ''}`).join('\n\n\n');
	q('compressedtext').innerHTML = `Compression (${formatBytes(compressed.length, 3, false)}) (Saves ${formatBytes(q('input').value.length - compressed.length, 3, false)})`;
	q('compressed').value = compressed;
}

window.onload = async function() {
	q('input').allowTab();
	q('input').oninput = function() {run()}
	run();
	q('input').select();
}
