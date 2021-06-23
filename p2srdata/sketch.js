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
		// desired.push("Categories: " + map.categories.join(", "));
		desired.push("Mtriggers:<br>" + map.triggers.join("<br>"));
		desired.push("Fade: " + map.fade);
		// desired.push("Native to CM: " + (map.cmNative ? "Yes" : "No"));
		// desired.push(map.formattedWiki);
		desired.push(`<a href="https://wiki.portal2.sr/index.php?title=${map.wikiname}&action=edit">Edit this page</a><br>
					  <a href="https://wiki.portal2.sr/index.php?title=${map.wikiname}&action=history">View history of this page</a>`);
		pre.innerHTML = desired.join("<br><br>");
	}
	slider.max = (maps.length - 1).toString();
	// pre.innerHTML = "loading wiki...";
	// await updateWikiData();
	// pre.innerHTML = "loading mtriggers...";
	// await updateMtriggers();


	// pre.innerHTML = maps.map(e => {return e.splitname + "<br>" + e.categories.join(",")}).join("<br><br>")

	slider.oninput();

	console.log("loaded");

}

function creationString(readable, includeMtriggers, includeWiki) {
	console.log(maps.map(e => {return `maps.push(${e.selfStr(readable, includeMtriggers, includeWiki)});`}).join("\n"));
}

function exportAll() {
	let t = [];
	{
		t = maps.map(e => {return e.createMtriggerString()}).filter(e => e != '').join('\n\n').padByDelim('"');
		t = "sar_alias mt_s sar_speedrun_cc_start\n" + t;
		t = "sar_alias mt_r sar_speedrun_cc_rule\n" + t;
		t = "sar_alias mt_e sar_speedrun_cc_finish\n\n" + t;
		t = t + "\n\nsar_alias mt_s nop\n";
		t = t + "sar_alias mt_r nop\n";
		t = t + "sar_alias mt_e nop\n";

		t.clip(); // copy categories to clipboard
		alert("Paste into cfg/sar/mtriggers");
	}

	{
		t = maps.filter(e => e.triggers.length > 0).map(e => {return `cond map=${e.filename} sar_speedrun_category "${e.splitname}"`});
		t = t.join('\n').padByDelim('"');

		t.clip();
		alert("Paste into cfg/sar/onloads/mtriggers");
	}

	{
		t = maps.filter(e => e.fade != '').map(e => {return `cond map=${e.filename} sar_toast_create fade "${e.fade}"`}).join('\n').padByDelim("sar_toast_create");
		t.clip();
		alert("Paste into cfg/sar/onloads/fades");
	}
	
}

doStuff();

