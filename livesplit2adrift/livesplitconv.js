var splits = null;
const dom = new DOMParser();

function fileSelect(event) {
	var file = event.target.files[0];

	var reader = new FileReader();
	reader.addEventListener('load', event => {
		splits = xml2json(dom.parseFromString(event.target.result, "text/xml"));
		console.log(splits);
	});
	reader.readAsText(file);
}

function convertTime(from) {
	let parts = from.split(":"), secs;
	secs = 3600 * parseInt(parts[0]);
	secs += 60 * parseInt(parts[1]);
	secs += parseFloat(parts[2]);
	return Math.round(secs * 1000000); // microseconds
}

function saveSplits() {
	var zip = new JSZip();
	if (!splits) {
		console.error("No splits selected!");
		return false;
	}
	
	{
		let out = [
			"#Config options",
			"#",
			"#game              Game                      (Default Portal 2)",
			"#category          Category                  (Default Inbounds NoSLA)",
			"#col_background    Background color          (Default #00000000)",
			"#col_text          Text color                (Default #FFFFFFFF)",
			"#col_timer         Timer color               (Default #FFFFFFFF)",
			"#col_timer_ahead   Timer color when ahead    (Default #33FF33FF)",
			"#col_timer_behind  Time color when behind    (Default #FF3333FF)",
			"#col_active_split  Color of active split     (Default #4C7FCCFF)",
			"#col_split_gold    Color of gold split time  (Default #FFE54CFF)",
			"#col_split_ahead   Color of green split      (Default #FFFFFFFF)",
			"#col_split_behind  Color of red split        (Default #FFFFFFFF)",
			"#",
			`game ${splits.Run.GameName}`,
			`category ${splits.Run.CategoryName}`
		];
		zip.file("config", out.join("\n"));
	} // create config

	let splitNames = [];
	{
		let segs = [], segments = splits.Run.Segments.Segment;
		for (let i = 0; i < segments.length; i++) {
			if (segments[i].Name.startsWith("-")) {
				let startI = i;
				let inside = [];
				let getName = function(e) {
					return e.startsWith("-") ? e.substring(1) : e.startsWith("{") && e.indexOf("}") > -1 ? e.substring(e.indexOf("}") + 1) : e;
				}
				while (segments[i].Name.startsWith("-") && i < segments.length) {
					inside.push(getName(segments[i].Name));
					i++;
				}
				inside.push(getName(segments[i].Name));
				segs.push(segments[i].Name.substring(1, segments[i].Name.indexOf("}")));
				inside.forEach(e => splitNames.push(e));
				inside.forEach(e => segs.push(`\t${e}`));
			} else {
				segs.push(segments[i].Name);
			}
		}
		segs = segs.map(e => e.replaceAll("&amp;", "&"));
		zip.file("splits", segs.join("\n") + "\n");
	} // get splits

	{
		let segments = splits.Run.Segments.Segment;
		let golds = segments.map(e => convertTime(e.BestSegmentTime.GameTime, 1));
		golds.push("")
		zip.file("golds", golds.join("\n"));
	} // get golds

	{
		var runs = zip.folder("runs"), attemptHistory = splits.Run.AttemptHistory.Attempt, completedRunIDs = [], completedRunDate = [];
		for (let i = 0; i < attemptHistory.length; i++) {
			if (attemptHistory[i].hasOwnProperty("GameTime")) {
				completedRunIDs.push(parseInt(attemptHistory[i]["@id"]));
				completedRunDate.push(new Date(attemptHistory[i]["@started"]));
			}
		}
		completedRunIDs = attemptHistory.map(e => {if (e.hasOwnProperty("GameTime")) return parseInt(e["@id"])}).filter(e => e > -1);

		let out = completedRunIDs.map(e => []), segments = splits.Run.Segments.Segment;
		for (let i = 0; i < segments.length; i++) {
			let attempts = segments[i].SegmentHistory.Time;
			for (let j = 0; j < attempts.length; j++) {
				let ind = completedRunIDs.indexOf(parseInt(attempts[j]["@id"]));
				if (ind > -1) {
					if (!attempts[j].hasOwnProperty("GameTime")) {
						out[ind].push(-1);
						continue;
					}
					out[ind].push(convertTime(attempts[j].GameTime, 1));
				}
			}
		}
		out = out.map(e => {
			for (let i = 1; i < e.length; i++) {
				if (e[i] != -1) e[i] += e[i - 1];
			}
			return e;
		}).filter(e => !e.some(e => e == -1)); // if any times are missing, disregard

		let pad = function(e) {return e.toString().padStart(2, "0");}
		for (let i = 0; i < out.length; i++) {
			let name = completedRunDate[i].getFullYear();
			name += "-" + pad(completedRunDate[i].getMonth() + 1);
			name += "-" + pad(completedRunDate[i].getDate());
			name += "_" + pad(completedRunDate[i].getHours());
			name += "." + pad(completedRunDate[i].getMinutes());
			name += "." + pad(completedRunDate[i].getSeconds());
			runs.file(name, out[i].join("\n"));
		}

		console.log("Data for Jaio's No-Reset sheet: (Control+Shift+V on Run # A1 to paste)");
		let len = out.map(e => e.length).reduce((a, b) => Math.max(a, b), 0);
		let fullruns = out.filter(e => e.length == len);
		text = (Array.from({length: len}, (_, f) => f).map(e => fullruns.map((_, i, g) => {
			if (isNaN(g[i][e])) return "";
			// let microseconds = (g[i][e] - (e == 0 ? 0 : g[i][e - 1]))
			let microseconds = g[i][e];
			let secs = microseconds / 1000000;
			let mins = Math.floor(secs / 60);
			secs -= mins * 60;
			let hours = Math.floor(mins / 60);
			mins -= hours * 60;
			return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toFixed(3).padStart(6, "0")}`;
		}).join("\t")).map((e, f) => `${splitNames[f]}\t${e}`).join("\n"));
		text = "Run #\t" + fullruns.map((_, i) => i + 1).join("\t")
			+ "\n" + "Date\t" + fullruns.map((_, i) => completedRunDate[i].toLocaleString()).join("\t")
			+ "\n" + "Final Time\t" + fullruns.map((e, i) => {
				let col = num => {
					let str = '';
					while (num > 0) {
						let remainder = num % 26;
						num = Math.floor(num / 26);
						if (remainder == 0) {
							remainder = 26;
							num--;
						}
						str = String.fromCharCode(64 + remainder) + str;
					}
					return str;
				}
				return `=IF(ISBLANK(${col(i + 2)}5), "", SECSTOTIME(SUM(${col(i + 2)}$205:${col(i + 2)}$354)))`
			}).join("\t")
			+ "\n" + "Comment"
			+ "\n" + text;
		// copy to clipboard
		navigator.clipboard.writeText(text);
		console.log(text);
		console.log("Copied to clipboard!");
	} // get runs

	{
		let pb = [], segments = splits.Run.Segments.Segment;
		for (let i = 0; i < segments.length; i++) {
			pb.push(convertTime(segments[i].SplitTimes.SplitTime.GameTime, 1));
		}
		zip.file("pb", pb.join("\n"));
	} // get pb

	let hasFiles = false;
	for (var key in zip.files) {
		if (zip.files.hasOwnProperty(key)) {
			hasFiles = true;
			break;
		}
	}
	if (hasFiles) {
		zip.saveAs("splits.zip");
		console.log("Splits saved successfully!");
		return true;
	} else {
		console.warn("No files in zip, not saving!");
		return false;
	}
}
