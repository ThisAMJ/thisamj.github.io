let data = new P2Data();
let mapI = 0;

function display() {
	let desired = [];
	mapI = Math.max(0, Math.min(data.maps.length - 1, mapI));
	map = data.maps[mapI];
	if (map) {
		let prevXSS = e => e.toString().replaceAll('<script', '&lt;script').replaceAll('</script', '&lt;/script');
		let pushSafe = e => desired.push(prevXSS(e));

		let linkNewTab = (e, f) => `<a href="${e}" target="_blank">${f}</a>`;
		let demoLink = e => 'https://board.portal2.sr/getDemo?id=' + e.demoID;
		let vidLink = e => 'https://youtu.be/' + e.youtubeID;
		let steamLink = e => 'https://www.steamcommunity.com/profiles/' + e.steamID;

		let timeScore = e => `${Math.floor(e.score / 60).toString().padStart(2, '0')}:${Math.floor(e.score % 60).toString().padStart(2, '0')}.${Math.floor(e.score * 1000 % 1000).toString().padEnd(3, '0')}`;
		let getDate = e => e.date == null ? 'Unknown' : `<abbr title="${e.date.toUTCString()}">${e.date.getUTCDate().toString().padStart(2, '0')}/${(e.date.getUTCMonth() + 1).toString().padStart(2, '0')}/${e.date.getUTCFullYear()}</abbr>`;
		
		let grey = e => `<span style="color:#888">${e}</span>`;
		let td = e => `<td>${e}</td>`;

		let missingTxt = grey('Missing');
		let wr, prev;

		pushSafe((e => {
					let out = [];
					if (e.cmboard.length == 0) return '';
					out.push(`Top 10:<br><table style="width:100%"><col style="width:36%"><col style="width:15%"><col style="width:8%"><col style="width:8%"><col style="width:15%"><col style="width:9%"><col style="width:9%"><thead><tr><th>Runner${e.coop ? 's' : ''}</th><th>Time</th><th>ΔNext</th><th>ΔWR</th><th>Date</th><th>Demo</th><th>Video</th></tr></thead>`);
					if (e.coop) {
						let times = e.cmboard.filter(e => e.scoreRank <= 10).sort((a, b) => a.scoreRank - b.scoreRank);
						let grouped = [];
						for (let i = 0; i < times.length; i++) {
							if (i == times.length) grouped.push([times[i]]);
							else if (times[i + 1] && times[i].score == times[i + 1].score) grouped.push([times[i], times[++i]]);
							else grouped.push([times[i]]);
						}
						for (let e of grouped.slice(0, 10)) {
							out.push('<tr>');
							out.push(td(linkNewTab(steamLink(e[0]), e[0].runner) + '<br>' + (e[1] ? linkNewTab(steamLink(e[1]), e[1].runner) : '')));
							out.push(td(timeScore(e[0])));
							out.push(td(typeof prev == 'undefined' ? '' : e[0].score == prev ? 'Tie' : `<span style="color:yellow">+${(e[0].score - prev).toFixed(3)}</span>`));
							out.push(td(typeof wr   == 'undefined' ? '' : e[0].score == wr   ? 'Tie' : `<span style="color:red   ">+${(e[0].score - wr  ).toFixed(3)}</span>`));
							out.push(td(getDate(e[0])));
							out.push(td((e[0].hasOwnProperty('demoID')    ? linkNewTab(demoLink(e[0]), e[0].runner) : missingTxt) + '<br>' + (e[1] ? e[1].hasOwnProperty('demoID')    ? linkNewTab(demoLink(e[1]), e[1].runner) : missingTxt : grey('Unpaired'))));
							out.push(td((e[0].hasOwnProperty('youtubeID') ? linkNewTab(vidLink(e[0]),  e[0].runner) : missingTxt) + '<br>' + (e[1] ? e[1].hasOwnProperty('youtubeID') ? linkNewTab(vidLink(e[1]),  e[1].runner) : missingTxt : grey('Unpaired'))));
							out.push('</tr>');
							prev = e[0].score;
							if (typeof wr == 'undefined') wr = prev;
						}
					} else {
						let times = e.cmboard.filter(e => e.scoreRank <= 10).sort((a, b) => a.scoreRank - b.scoreRank).slice(0, 10);
						for (let e of times) {
							out.push('<tr>');
							out.push(td(linkNewTab(steamLink(e), e.runner)));
							out.push(td(timeScore(e)));
							out.push(td(typeof prev == 'undefined' ? '' : e.score == prev ? 'Tie' : `<span style="color:yellow">+${(e.score - prev).toFixed(3)}</span>`));
							out.push(td(typeof wr   == 'undefined' ? '' : e.score == wr   ? 'Tie' : `<span style="color:red   ">+${(e.score - wr  ).toFixed(3)}</span>`));
							out.push(td(getDate(e)));
							out.push(td(e.hasOwnProperty('demoID')    ? linkNewTab(demoLink(e), 'Link') : missingTxt));
							out.push(td(e.hasOwnProperty('youtubeID') ? linkNewTab(vidLink(e),  'Link') : missingTxt));
							out.push('</tr>');
							prev = e.score;
							if (typeof wr == 'undefined') wr = prev;
						}
					}
					out.push('</table>');
					return out.join('');
				})(map));
		pushSafe('Fade: ' + (map.fade == '' ? 'None' : map.fade));
		pushSafe('Native to CM: ' + (map.cmAvailability == 1 ? 'Yes' : map.cmAvailability == 0 ? 'Not by default' : 'No'));
		pushSafe(map.formattedWiki == '' ? `<h1 class=p2title>${map.splitname}</h1>` : map.formattedWiki);
		pushSafe('Mtriggers: ' + (map.triggers.length > 0 ? `<br><pre>${map.triggers.join('\n')}</pre>` : 'None'));
		pushSafe('Categories: ' + map.categories.map(e => linkNewTab('https://wiki.portal2.sr/Category:' + e, e)).join(', '));
		pushSafe(map.chamberID > -1 ? linkNewTab('https://board.portal2.sr/chamber/' + map.chamberID, 'View CM Leaderboard') : '');
		pushSafe(linkNewTab('https://wiki.portal2.sr/index.php?action=edit&title='    + map.wikiname, 'Edit this page') + '<br>' +
				 linkNewTab('https://wiki.portal2.sr/index.php?action=history&title=' + map.wikiname, 'View history of this page'));
	}
	document.querySelector('pre').innerHTML = desired.join('<br><br>').replaceEvery('<br><br><br>', '<br><br>').replaceEvery('<br><pre>', '<pre>').replaceEvery('</pre><br>', '</pre>');
}

function searchDisplay() {
	let search = document.querySelector('#sidebar-search').value, result = '';
	for (let i = 1; i <= data.chapters.sp.length; i++) {
		let chaptermaps = data.maps.filter(e => e.chapter == i && !e.coop && (search == '' || e.splitname.toLowerCase().indexOf(search.toLowerCase()) > -1))
		if (chaptermaps.length > 0) {
			result += `Chapter ${i}: ${data.chapters.sp[i - 1]}<ul>${chaptermaps.map(e => `<li><a href="#" onclick="mapI=${data.maps.indexOf(e)};display(); return false">${e.splitname}</a></li>`).join('')}</ul>`
		}
	}
	for (let i = 0; i < data.chapters.mp.length; i++) {
		let chaptermaps = data.maps.filter(e => e.chapter == i && e.coop && (search == '' || e.splitname.toLowerCase().indexOf(search.toLowerCase()) > -1))
		if (chaptermaps.length > 0) {
			result += `Course ${i}: ${data.chapters.mp[i]}<ul>${chaptermaps.map(e => `<li><a href="#" onclick="mapI=${data.maps.indexOf(e)};display(); return false">${e.splitname}</a></li>`).join('')}</ul>`
		}
	}

	document.querySelector('#sidebar-maps').innerHTML = result;
}
function test() {
	console.log('eyo')
}

window.onload = async function() {
	searchDisplay()
	display();
	await data.getMtriggers();
	display();
	if (confirm('Download wiki text? (~60KB)')) await data.getWiki();
	data.formatWiki();
	display();
	if (confirm('Download CM leaderboards? (~1.6MB)')) await data.getBoards();
	display();
}
