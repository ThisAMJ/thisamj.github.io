var maps = [], slider, pre;

async function doStuff() {

	slider = document.createElement("input")
	slider.type = "range", slider.min = "0", slider.value = "0";
	document.body.appendChild(slider);

	pre = document.createElement("pre");
	pre.style.margin = "none";
	document.body.appendChild(pre);

	pre.innerHTML = "loading maps..."
	await addMaps();
	slider.oninput = function() {
		let map = maps[slider.value];
		let desired = [];
		desired.push("Categories: " + map.categories.join(", "));
		desired.push("Mtriggers:<br>" + map.triggers.join("<br>"));
		desired.push("Fade: " + map.fade);
		desired.push("Native to CM: " + (map.cmNative ? "Yes" : "No"));
		desired.push(map.formattedWiki);
		desired.push(`<a href="https://wiki.portal2.sr/index.php?title=${map.wikiname}&action=edit">Edit this page</a><br>
					  <a href="https://wiki.portal2.sr/index.php?title=${map.wikiname}&action=history">View history of this page</a>`);
		pre.innerHTML = desired.join("<br><br>");
	}
	slider.max = (maps.length - 1).toString();
	pre.innerHTML = "loading wiki...";
	await updateWikiData();
	pre.innerHTML = "loading mtriggers...";
	await updateMtriggers();


	// pre.innerHTML = maps.map(e => {return e.splitname + "<br>" + e.categories.join(",")}).join("<br><br>")

	slider.oninput();

	console.log("loaded");

}

function creationString(readable, includeMtriggers, includeWiki) {
	console.log(maps.map(e => {return `maps.push(${e.selfStr(readable, includeMtriggers, includeWiki)});`}).join("\n"));
}

function exportAll() {
	let t = maps.map(e => {return e.createMtriggerString()}), o = [];
	t.forEach(e => {if (e != '') o.push(e)}); //remove blank lines
	o = o.join('\n\n').padByDelim('"');
	console.log(o);
	o.clip(); // copy categories to clipboard
	alert("Paste into a cfg linked to autoexec");
	t = maps.map(e => {return e.triggers.length > 0 ? `cond "var:mtriggers=1 & cm & map=${e.filename}" sar_speedrun_category "${e.splitname}"` : ''});
	o = [];
	t.forEach(e => {if (e != '') o.push(e)});
	o = o.join('\n').padByDelim('"');
	console.log(o);
	o.clip();
	alert("Paste into onload cfg");
}

doStuff();

