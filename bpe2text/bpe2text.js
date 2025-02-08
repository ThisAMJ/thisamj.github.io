var splits = null;
const dom = new DOMParser();

function fileSelect(event) {
	var file = event.target.files[0];

	var reader = new FileReader();
	reader.addEventListener('load', event => {
		splits = xml2json(dom.parseFromString(event.target.result, "text/xml"));
		if (!splits.hasOwnProperty("Run")) {
			console.error("Invalid splits file!");
			return;
		}
		if (splits.Run.hasOwnProperty("GameIcon")) delete splits.Run.GameIcon;
		console.log(splits);
		document.getElementById('output').innerText = convertThing(splits);
		document.getElementById('copy').style.display = "inline-block";
	});
	reader.readAsText(file);
}

var lastClick = null;
function copyThing() {
	let text = document.getElementById('output').innerText;
	navigator.clipboard.writeText(text);
	document.getElementById('copytext').style.transition = "opacity 250ms";
	document.getElementById('copytext').style.opacity = "1";
	// cancel existing
	if (lastClick) clearTimeout(lastClick);
	lastClick = setTimeout(() => {
		document.getElementById('copytext').style.transition = "opacity 1s";
		document.getElementById('copytext').style.opacity = "0";
	}, 1000);
	console.log("Copied to clipboard!");
}

function convertTime(from) {
	let parts = from.split(":"), secs;
	secs = 3600 * parseInt(parts[0]);
	secs += 60 * parseInt(parts[1]);
	secs += parseFloat(parts[2]);
	return secs
}

function convertThing(splits) {
	attempts = splits.Run.AttemptHistory.Attempt;
	attemptHistory = attempts.map(e => e["@id"]);
	segments = splits.Run.Segments.Segment;
	attemptData = [];
	let i = 0;
	for (let attempt of attemptHistory) {
		let segmentHistory = segments.map(e => e.SegmentHistory.Time.filter(e => e["@id"] == attempt).map(e => e.hasOwnProperty("GameTime") ? convertTime(e.GameTime) : -1));
		if (!segmentHistory.some(e => e.length > 0)) continue;
		segmentHistory = segmentHistory.map(e => e.length > 0 ? e[0] : -1);
		while (segmentHistory[segmentHistory.length - 1] == -1) segmentHistory.pop();
		if (segmentHistory.some(e => e == -1)) continue;
		for (let i = 1; i < segmentHistory.length; i++) {
			segmentHistory[i] += segmentHistory[i - 1];
		}
		attemptData[i++] = {id: attempt, segments: segmentHistory};
	}
	attemptData[i++] = {id: "pb", segments: segments.map(e => {
		let target = e.SplitTimes.SplitTime;
		if (target.hasOwnProperty('length')) {
			target = target.find(e => e["@name"] == "Personal Best");
		}
		if (!target.hasOwnProperty("GameTime")) {
			return 0;
		}
		return convertTime(target.GameTime);
	})};
	bestpaceever = [];
	i = 0;
	for (let segment of segments) {
		let best = Infinity;
		if (i == 0) {
			let gold = segment.BestSegmentTime;
			if (gold.hasOwnProperty("GameTime")) {
				best = convertTime(gold.GameTime);
			}
		}
		for (let attempt of attemptData) {
			if (attempt.segments.length <= i) continue;
			if (attempt.segments[i] == 0) continue;
			if (i > 0 && attempt.segments[i - 1] == attempt.segments[i]) continue;
			if (attempt.segments[i] < best) best = attempt.segments[i];
		}
		bestpaceever.push(best);
		i++;
	}
	// format h:mm:ss.sss (or mm:ss.sss if less than an hour, or m:ss.sss if less than 10 minutes etc)
	bestpaceever = bestpaceever.map(e => {
		let secs = e;
		let mins = Math.floor(secs / 60);
		secs -= mins * 60;
		let hours = Math.floor(mins / 60);
		mins -= hours * 60;
		if (hours != 0) return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toFixed(3).padStart(6, "0")}`;
		if (mins != 0) return `${mins}:${secs.toFixed(3).padStart(6, "0")}`;
		return `${secs.toFixed(3).padStart(6, "0")}`;
	})

	console.log(bestpaceever.join('\n'));
	return bestpaceever.join('\n');
}
