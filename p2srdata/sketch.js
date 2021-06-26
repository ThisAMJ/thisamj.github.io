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
		
		t = t.replaceAll("\nmt_st", "; mt_st");
		t = t.replaceAll("mt_f\nmt_e", "mt_f; mt_e");
		t = t.replaceAll("mt_f1\nmt_f2\nmt_e", "mt_f1; mt_f2; mt_e");

		t = `
		sar_alias mt_s  sar_speedrun_cc_start
		sar_alias mt_r  sar_speedrun_cc_rule
		sar_alias mt_st mt_r "Start" load action=force_start
		sar_alias mt_f  mt_r "Flags" flags action=stop
		sar_alias mt_f1 mt_r "Flags 1" flags
		sar_alias mt_f2 mt_r "Flags 2" flags "ccafter=Flags 1" action=stop
		sar_alias mt_e  sar_speedrun_cc_finish
		`.replaceAll('\t','').trim() + '\n\n' + t + '\n\n' + `
		sar_alias mt_s  nop
		sar_alias mt_st nop
		sar_alias mt_r  nop
		sar_alias mt_f  nop
		sar_alias mt_f1 nop
		sar_alias mt_f2 nop
		sar_alias mt_e  nop
		`.replaceAll('\t','').trim();

		console.log(t);
		t.clip(); // copy categories to clipboard
		alert("Paste into cfg/sar/mtriggers");
	}

	{
		t = maps.filter(e => e.triggers.length > 0).map(e => {return `cond map=${e.filename} sar_speedrun_category "${e.splitname}"`});
		t = t.join('\n').padByDelim('"');

		console.log(t);
		t.clip();
		alert("Paste into cfg/sar/onloads/mtriggers");
	}

	{
		t = maps.filter(e => e.fade != '').map(e => {return `cond map=${e.filename} sar_toast_create fade "${e.fade}"`}).join('\n').padByDelim("sar_toast_create");
		
		console.log(t);
		t.clip();
		alert("Paste into cfg/sar/onloads/fades");
	}
	
}

function allTriggersByUsage() {
	let allTriggers = maps.map(e => {return e.triggers.join('\n')}).join('\n').split('\n').sort();
	let str = allTriggers[0], count = 0, strs = [], counts = [];
	// count occurences
	for (let i = 0; i < allTriggers.length; i++) {
		if (str == allTriggers[i]) {
			count++;
		} else {
			strs.push(str);
			counts.push(count);
			count = 1;
		}

		str = allTriggers[i];
	}
	strs.push(str);
	counts.push(count);
	// jank as fuck insertion sort
	// cbf doing this properly
	for (let i = 0; i < strs.length; i++) {
		strs[i] = `${counts[i]} occurrence(s) - ${strs[i]}`
		for (let j = i; j > 0; j--) {
			if (counts[j] > counts[j - 1]) {
				[strs[j], strs[j - 1]] = [strs[j - 1], strs[j]];
				[counts[j], counts[j - 1]] = [counts[j - 1], counts[j]];
			} else continue;
		}
	}
	console.log(strs.join('\n'));
}

doStuff();

