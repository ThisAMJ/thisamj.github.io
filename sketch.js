let maps = [], slider, pre;

async function doStuff() {

	await addMaps();
	await updateWikiData();


	slider = document.createElement("input")
	slider.type = "range", slider.min = "0";
	slider.max = (maps.length - 1).toString();
	slider.oninput = function() {pre.innerHTML = maps[slider.value].formattedWiki;}
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

