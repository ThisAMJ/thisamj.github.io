var maps = [], slider, pre;

async function doStuff() {

	slider = document.createElement("input")
	slider.type = "range", slider.min = "0", slider.value = "0";
	slider.oninput = function() {
		let map = maps[slider.value]
		let desired = [];
		desired.push("Categories: " + map.categories.join(", "));
		desired.push("Mtriggers:<br>" + map.triggers.join("<br>"));
		desired.push("Fade: " + map.fade);
		desired.push(map.formattedWiki);
		desired.push(`<a href="https://wiki.portal2.sr/index.php?title=${map.wikiname}&action=edit">Edit this page</a><br>
					  <a href="https://wiki.portal2.sr/index.php?title=${map.wikiname}&action=history">View history of this page</a>`)
		pre.innerHTML = desired.join("<br><br>");
	}
	document.body.appendChild(slider);

	pre = document.createElement("pre");
	pre.style.margin = "none";
	document.body.appendChild(pre);

	pre.innerHTML = "loading maps..."
	await addMaps();
	slider.max = (maps.length - 1).toString();
	pre.innerHTML = "loading wiki..."
	await updateWikiData();


	// pre.innerHTML = maps.map(e => {return e.splitname + "<br>" + e.categories.join(",")}).join("<br><br>")

	slider.oninput();

	console.log("loaded");

}

function creationString(readable, includeWiki) {
	console.log(maps.map(e => {return `maps.push(${e.selfStr(readable, includeWiki)});`}).join("\n"));
}

doStuff();

