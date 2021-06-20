let maps = [], slider, p;

async function doStuff() {
	await addMaps();
	await updateWikiData();
	slider = document.createElement("input")
	slider.type = "range", slider.min = "0";
	slider.max = (maps.length - 1).toString();
	slider.oninput = function() {p.innerHTML = maps[slider.value].wikicontent.replaceAll("\n", "<br>");}
	document.body.appendChild(slider);
	p = document.createElement("p");
	// p.innerHTML = maps.map(e => {return e.splitname + "<br>" + e.categories.join(",")}).join("<br><br>")
	document.body.appendChild(p);
	slider.oninput();
	console.log("loaded");
	let selfStrs = [];
	for (let map of maps) {
		selfStrs.push(`maps.push(${map.selfStr(true, false)});`)
	}
	console.log("self creation string:");
	console.log(selfStrs.join("\n"));


	maps.forEach(e => {
	    e.categories = [];
	    e.wikicontent.split("\n").forEach(f => {
	        if (f.startsWith("[[Category:")) e.categories.push(f.substring(11, f.length - 2));
	    });
	});
}

doStuff();

