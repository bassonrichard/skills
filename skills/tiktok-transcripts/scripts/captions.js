// Run in a tiktok.com page with the browser's JavaScript tool, then call:
//   await ttCaptions()                      // on a video page: that video (read from the page itself)
//                                           // on a collection/profile: the first 15 videos
//   await ttCaptions({offset: 15})          // next batch of a long collection
//   await ttCaptions({timed: true})         // prefix each cue with its start second, e.g. "[12s] ..."
// Returns a JSON string. Reads TikTok's own caption tracks; downloads no video.
window.ttCaptions = async function ({ offset = 0, limit = 15, timed = false, delay = 1500 } = {}) {
  const clean = (u) => u.split('?')[0];
  const KEY = '__UNIVERSAL_DATA_FOR_REHYDRATION__';
  const itemFrom = (json) => JSON.parse(json).__DEFAULT_SCOPE__?.['webapp.video-detail']?.itemInfo?.itemStruct;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const onVideo = location.pathname.match(/\/(?:video|photo)\/(\d+)/);
  let links, expected = null;

  if (onVideo) {
    links = [clean(location.href)];
  } else {
    // Collections and profiles lazy-load cards: scroll until the count stops growing.
    const grab = () => [...new Set([...document.querySelectorAll('a[href*="/video/"], a[href*="/photo/"]')].map((a) => clean(a.href)))];
    let prev = -1;
    for (let i = 0; i < 40 && grab().length !== prev; i++) {
      prev = grab().length;
      window.scrollTo(0, document.documentElement.scrollHeight);
      await sleep(1500);
    }
    links = grab();
    // The header states how many videos the collection holds; a shortfall means private/removed videos.
    const m = document.body.innerText.match(/(\d[\d,.]*)\s+videos?\b/i);
    expected = m ? Number(m[1].replace(/[,.]/g, '')) : null;
  }

  const batch = links.slice(offset, offset + limit);
  const videos = [];
  let rateLimited = false;
  for (let i = 0; i < batch.length; i++) {
    const url = batch[i];
    const v = { url };
    try {
      let it = null;
      // A freshly loaded video page already embeds its own data: no request needed.
      const own = onVideo && document.getElementById(KEY);
      if (own) { const cand = itemFrom(own.textContent); if (cand?.id === onVideo[1]) it = cand; }
      if (!it) {
        if (i > 0) await sleep(delay); // be a polite client: fast bursts trip TikTok's rate limiter
        const html = await fetch(url, { credentials: 'include' }).then((r) => r.text());
        const m = html.match(new RegExp(`<script id="${KEY}"[^>]*>([\\s\\S]*?)</script>`));
        if (!m) {
          // TikTok answered with its verification page instead of the video page.
          // Stop here: hammering makes it worse. The caller opens the remaining pages one at a time.
          rateLimited = true;
          break;
        }
        it = itemFrom(m[1]);
      }
      if (!it) throw new Error('video data missing: private, removed, region-locked, or page format changed');
      v.author = it.author?.nickname;
      v.handle = it.author?.uniqueId;
      v.description = it.desc;
      v.seconds = it.video?.duration;
      if (it.imagePost) { v.type = 'photo'; v.images = it.imagePost.images?.length; }
      const subs = (it.video?.subtitleInfos || []).filter((s) => s.Format === 'webvtt');
      v.tracks = subs.map((s) => `${s.LanguageCodeName}:${s.Source}`);
      // ASR = the original spoken language; other sources are machine translations of it.
      const sub = subs.find((s) => s.Source === 'ASR') || subs[0];
      v.transcript = '';
      if (sub) {
        const vtt = await fetch(sub.Url).then((r) => r.text());
        const out = [];
        let start = null;
        for (const line of vtt.split('\n').map((l) => l.trim())) {
          if (!line || /^WEBVTT/.test(line) || /^\d+$/.test(line)) continue;
          const t = line.match(/^(?:(\d+):)?(\d+):(\d+)[.,]\d+\s+-->/);
          if (t) { start = (+(t[1] || 0)) * 3600 + (+t[2]) * 60 + (+t[3]); continue; }
          out.push(timed && start !== null ? `[${start}s] ${line}` : line);
        }
        v.language = sub.LanguageCodeName;
        v.transcript = out.join(' ');
      }
    } catch (e) {
      v.error = String(e);
    }
    videos.push(v);
  }
  return JSON.stringify({
    page: clean(location.href), expected, found: links.length, offset, returned: videos.length,
    rateLimited, pending: rateLimited ? batch.slice(videos.length) : [], videos,
  });
};
