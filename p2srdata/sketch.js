let maps = [], slider, pre;

async function doStuff() {

	await addMaps();
	await updateWikiData();


	slider = document.createElement("input")
	slider.type = "range", slider.min = "0";
	slider.max = (maps.length - 1).toString();
	slider.oninput = function() {
		let map = maps[slider.value]
		let desired = [];
		desired.push("Categories: " + map.categories.join(", "));
		desired.push("Mtriggers:<br>" + map.triggers.join("<br>"));
		desired.push("Fade: " + map.fade);
		desired.push(map.formattedWiki);
		desired.push("<a href=\"https://wiki.portal2.sr/index.php?title=map.wikiname&action=edit\">Edit This Page</a>")
		pre.innerHTML = desired.join("<br><br>");
	}
	document.body.appendChild(slider);

	pre = document.createElement("pre");
	pre.style.margin = "none";
	document.body.appendChild(pre);
	// pre.innerHTML = maps.map(e => {return e.splitname + "<br>" + e.categories.join(",")}).join("<br><br>")

	slider.oninput();

	console.log("loaded");

	// console.log("self creation string:");
	// console.log(maps.map(e => {return `maps.push(${e.selfStr(true, false)});`}).join("\n"))

}

doStuff();

