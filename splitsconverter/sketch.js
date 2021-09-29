var splits = null;
const dom = new DOMParser();

async function dropHandler(event) {
	event.preventDefault();
	if (event.dataTransfer.items) {
		for (let i = 0; i < event.dataTransfer.items.length; i++) {
			if (event.dataTransfer.items[i].kind == 'file') {
				let file = event.dataTransfer.items[i].getAsFile();
				let ext = file.name.split('.').pop();
				if (file.type == '') continue;
				let content = await file.text();
				let fromType;
				switch (ext) {
					case 'lss':
						fromType = 'Livesplit';
						break;
					case 'sls': // slt splits extension?
						fromType = 'SLT';
						break;
					case 'zip':
						let zip = new JSZip();
						console.log(await zip.loadAsync(content));
					default:
						fromType = 'Adrift';
				}
				console.log(ext, content);
			}
		}
	}
}

let dragHandler = event => event.preventDefault();

function fileSelect(event) {
	var file = event.target.files[0];

	var reader = new FileReader();
	reader.addEventListener('load', event => {
		splits = xml2json(dom.parseFromString(event.target.result, 'text/xml'));
		console.log(splits);
	});
	reader.readAsText(file);
}

function convertTime(from, fromType, toType) {
	if (fromType == toType) return from;
	let secs = from;
	switch (fromType) {
		case 'Livesplit':
			secs = from.split(':').reduce((a, e, i) => 
				parseFloat(a) + (Math.pow(60, 2 - i) * e)
			);
			break;
		case 'Adrift':
			secs = from / 1000000;
			break;
	}

	switch (toType) {
		case 'Livesplit':
			// Livesplit uses HH:MM:SS.MMM
			return `${Math.floor(secs / 3600)}:${Math.floor(secs / 60)}:${(secs % 60).toFixed(3)}`;
		case 'Adrift':
			// Adrift uses microseconds (1 millionth of a second)
			return Math.round(secs * 1000000);

		default: return secs;
	}
}

function convert(splits, from, to) {
	var out = new JSZip();
	if (!splits) {
		console.error('No splits selected!');
		return false;
	}

	var file = {
		segments: [],
		gameName: '',
		catName:  '',
	}

	{
		out.file('config', `
			# Config options
			#
			# Option            Description               Default
			#
			# game              Game                      Portal 2
			# category          Category                  Inbounds NoSLA
			# col_background    Background color          #00000000
			# col_text          Text color                #FFFFFFFF
			# col_timer         Timer color               #FFFFFFFF
			# col_timer_ahead   Timer color when ahead    #33FF33FF
			# col_timer_behind  Timer color when behind   #FF3333FF
			# col_active_split  Color of active split     #4C7FCCFF
			# col_split_gold    Color of gold split       #FFE54CFF
			# col_split_ahead   Color of green split      #FFFFFFFF
			# col_split_behind  Color of red split        #FFFFFFFF
			#
			game     ${splits.Run.GameName}
			category ${splits.Run.CategoryName}
		`.trim().replaceAll('\t', ''));
	} // create config

	{
		let segs = [], segments = splits.Run.Segments.Segment;
		for (let i = 0; i < segments.length; i++) {
			if (segments[i].Name.startsWith('-')) {
				let startI = i;
				let inside = [];
				let getName = e => e.startsWith('-') ? e.substring(1) : e.startsWith('{') && e.indexOf('}') > -1 ? e.substring(e.indexOf('}') + 1) : e;
				while (segments[i].Name.startsWith('-') && i < segments.length) {
					inside.push(getName(segments[i].Name));
					i++;
				}
				inside.push(getName(segments[i].Name));
				segs.push(segments[i].Name.substring(1, segments[i].Name.indexOf('}')));
				inside.forEach(e => segs.push(`\t${e}`));
			} else {
				segs.push(segments[i].Name);
			}
		}
		segs = segs.map(e => e.replaceAll('&amp;', '&'));
		segs.push('')
		out.file('splits', segs.join('\n'));
	} // get splits

	{
		let segments = splits.Run.Segments.Segment;
		let golds = segments.map(e => convertTime(e.BestSegmentTime.GameTime));
		golds.push('')
		out.file('golds', golds.join("\n"));
	} // get golds

	{
		var runs = splits.Run.AttemptHistory.Attempt.map(e => ({
			completed: e.hasOwnProperty('GameTime'),
			date: new Date(e['@started']),
			segments: splits.Run.Segments.Segment.map(f => f.SegmentHistory.Time.filter(f => f['@id'] == e['@id'])[0].map(e => convertTime(e.GameTime, 'Livesplit')))
		}));

		if (targetWantsCumulativeTime) {
			for (let i = 0, sz = runs.length; i < sz; i++) {
				runs[i].segments = runs[i].segments.map((e, f, g) => e + (f > 0 ? g[f - 1] : 0));
			}
		}

		var completedRuns = runs.filter(e => e.completed);

		let pad = e => e.toString().padStart(2, '0');

		var runs = out.folder('runs');
		for (let i = 0, sz = completedRuns.length; i < sz; i++) {
			runs.file((e => 
				`${e.getFullYear()}-${pad(e.getMonth())}-${pad(e.getDate())}_${pad(e.getHours())}.${pad(e.getMinutes())}.${pad(e.getSeconds())}`
			)(completedRuns[i].date), completedRuns[i].segments.join('\n'));
		}
	} // get runs

	{
		let pb = splits.Run.Segments.Segment.map(e => convertTime(e.SplitTimes.SplitTime.GameTime, 'Livesplit'));
		out.file('pb', pb.join('\n'));
	} // get pb



	let hasFiles = false;
	for (var key in out.files) {
		if (out.files.hasOwnProperty(key)) {
			hasFiles = true;
			break;
		}
	}
	if (hasFiles) {
		out.saveAs('splits.zip');
		console.log('Splits saved successfully!');
		return true;
	} else {
		console.warn('No files in zip, not saving!');
		return false;
	}
}
