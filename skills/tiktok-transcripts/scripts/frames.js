// Run on a single TikTok video page with the browser's JavaScript tool, then call:
//   await ttFrames()                          // 4 evenly spaced frames across the whole video
//   await ttFrames({n: 2, from: 20, to: 30})  // 2 larger frames from a 10-second window
//   await ttFrames({n: 1, from: 33, to: 35})  // one frame as large as the viewport allows
//   await ttFrames({n: 4, from: 28, to: 44, crop: [0.05, 0.52, 0.95, 0.84]})
//                                             // magnify one region of the frame (a screen recording
//                                             // or picture-in-picture inset): [left, top, right, bottom]
//                                             // as fractions of the video frame
//   ttFramesOff()                             // remove the overlay when finished
// It pauses the video, seeks to each timestamp, and paints the frames as a grid on a
// full-viewport overlay so ONE screenshot captures them all. Take the screenshot right after.
// Nothing is downloaded and no pixels leave the page.
window.ttFramesOff = () => document.getElementById('tt-sheet')?.remove();
window.ttFrames = async function ({ n = 4, from = 0, to = null, crop = null } = {}) {
  window.ttFramesOff();
  // On a video page the first <video> is the one in the URL; later ones are the "up next" feed.
  const v = [...document.querySelectorAll('video')].find((el) => el.duration > 0);
  if (!v) return JSON.stringify({ error: 'no playable <video> on this page (photo post, or still loading)' });
  v.pause();
  v.muted = true;

  const W = document.documentElement.clientWidth || 800;
  const H = document.documentElement.clientHeight || 600;
  const dpr = window.devicePixelRatio || 1;
  const [cx0, cy0, cx1, cy1] = crop || [0, 0, 1, 1];
  const sx = cx0 * v.videoWidth, sy = cy0 * v.videoHeight;
  const sw = (cx1 - cx0) * v.videoWidth, sh = (cy1 - cy0) * v.videoHeight;
  const ar = sw / sh;
  // Pick the grid that gives the largest frames: a row for portrait frames, a stack for wide crops.
  let cols = n, fw = 0, fh = 0;
  for (let c = 1; c <= n; c++) {
    const rows = Math.ceil(n / c);
    let w = W / c, h = w / ar;
    if (h * rows > H) { h = H / rows; w = h * ar; }
    if (w * h > fw * fh) { cols = c; fw = w; fh = h; }
  }

  const c = document.createElement('canvas');
  c.id = 'tt-sheet';
  c.width = W * dpr;
  c.height = H * dpr;
  c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:2147483647;background:#000';
  const ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingQuality = 'high';

  const end = to ?? v.duration;
  const times = [], stale = [];
  for (let i = 0; i < n; i++) {
    const t = Math.min(from + ((end - from) * (i + 0.5)) / n, v.duration - 0.05);
    const ok = await new Promise((res) => {
      const done = (good) => { v.removeEventListener('seeked', onSeek); res(good); };
      const onSeek = () => done(true);
      v.addEventListener('seeked', onSeek);
      v.currentTime = t;
      setTimeout(() => done(false), 4000); // unbuffered or stalled: frame may be the previous one
    });
    await new Promise((r) => setTimeout(r, 150)); // let the decoded frame reach the element
    if (!ok) stale.push(+t.toFixed(1));
    const x = (i % cols) * fw, y = Math.floor(i / cols) * fh;
    ctx.drawImage(v, sx, sy, sw, sh, x, y, fw, fh);
    ctx.fillStyle = 'rgba(0,0,0,.75)';
    ctx.fillRect(x, y, 50, 17);
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.fillText(t.toFixed(1) + 's', x + 4, y + 13);
    times.push(+t.toFixed(1));
  }
  // Attach outside <body>: TikTok re-renders the body while a page settles and would drop the overlay.
  document.documentElement.appendChild(c);
  await new Promise((r) => setTimeout(r, 400));
  if (!c.isConnected) document.documentElement.appendChild(c);
  return JSON.stringify({ seconds: +v.duration.toFixed(1), times, stale, frame: [Math.round(fw), Math.round(fh)], grid: [cols, Math.ceil(n / cols)], viewport: [W, H], overlay: c.isConnected });
};
