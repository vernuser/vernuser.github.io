/*
 * 全站共享小部件：页脚（旅店已开放 xx 天）+ 悬浮音乐播放器
 * 用法：
 *   import { WIDGET_CSS, siteFooter, musicPlayer } from './site-widgets.mjs';
 *   <style> 里拼上 ${WIDGET_CSS}；</body> 前拼上 ${siteFooter()}${musicPlayer()}
 * 换歌单：直接改下面的 TRACKS（网易云外链格式 id=歌曲ID.mp3，VIP 歌会拿不到音频）。
 * 运行：被各生成脚本引用，无独立入口。
 */

export const OPEN_SINCE = '2023-04-12'; // 旅店开店日（与 about 页一致）

/* 默认歌单：HOYO-MiX（构建期已用 curl 验证外链可出音频流）；换歌直接改这里 */
export const TRACKS = [
  { title: '野火 Wildfire', artist: 'HOYO-MiX', url: 'https://music.163.com/song/media/outer/url?id=2045806409.mp3' },
  { title: '疾如猛火 Rapid as Wildfires', artist: '陈致逸/HOYO-MiX', url: 'https://music.163.com/song/media/outer/url?id=1492283139.mp3' },
  { title: 'Moon Halo', artist: 'HOYO-MiX', url: 'https://music.163.com/song/media/outer/url?id=1859652717.mp3' },
  { title: 'Nightglow (Instrumental)', artist: 'HOYO-MiX', url: 'https://music.163.com/song/media/outer/url?id=1334673828.mp3' },
  { title: '皎洁的笑颜 Moonlike Smile', artist: '陈致逸/HOYO-MiX', url: 'https://music.163.com/song/media/outer/url?id=1833805540.mp3' },
  { title: '坠叶与晚星 Falling Leaves and Even-Stars', artist: 'HOYO-MiX', url: 'https://music.163.com/song/media/outer/url?id=3437729518.mp3' }
];

export const WIDGET_CSS = `
/* 页脚 */
.site-footer{position:relative;z-index:1;padding:22px 16px 30px;text-align:center;font-size:12.5px;color:rgba(233,242,253,.62);letter-spacing:.05em}
.site-footer b{color:#7cc4ec;font-weight:600;font-variant-numeric:tabular-nums;font-size:13.5px}
.site-footer .star{margin:0 10px;color:rgba(233,242,253,.35)}

/* 悬浮音乐播放器（左下角） */
.mp-root{position:fixed;left:18px;bottom:18px;z-index:80}
.mp-disc{
  width:52px;height:52px;border-radius:50%;cursor:pointer;padding:0;position:relative;
  border:2px solid rgba(255,255,255,.5);
  background:radial-gradient(circle,#0d2137 0 20%,#16283f 21% 36%,#0d2137 37% 54%,#16283f 55% 70%,#0d2137 71% 100%);
  box-shadow:0 10px 26px rgba(4,12,24,.55);
  animation:mp-spin 7s linear infinite;animation-play-state:paused;
  transition:transform .3s ease,box-shadow .3s ease;
}
.mp-disc:hover{transform:scale(1.06);box-shadow:0 14px 32px rgba(4,12,24,.65)}
.mp-disc.playing{animation-play-state:running}
.mp-disc::before{content:'';position:absolute;left:50%;top:7px;bottom:7px;width:2px;margin-left:-1px;background:linear-gradient(rgba(255,255,255,.4),rgba(255,255,255,.06))}
.mp-disc::after{content:'';position:absolute;inset:0;margin:auto;width:15px;height:15px;border-radius:50%;background:linear-gradient(140deg,#3aa3e3,#62a33d);border:2px solid rgba(255,255,255,.75)}
@keyframes mp-spin{to{transform:rotate(360deg)}}
.mp-panel{
  position:absolute;left:0;bottom:64px;width:302px;max-width:calc(100vw - 32px);
  border-radius:16px;background:rgba(10,24,42,.86);border:1px solid rgba(255,255,255,.2);
  backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%);
  box-shadow:0 18px 44px rgba(4,12,24,.55);padding:14px 14px 8px;color:#eaf3ff;
  opacity:0;transform:translateY(8px);pointer-events:none;
  transition:opacity .3s ease,transform .3s ease;
}
.mp-panel.open{opacity:1;transform:none;pointer-events:auto}
.mp-head{display:flex;align-items:baseline;gap:8px;min-width:0}
.mp-title{font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-artist{font-size:11px;color:rgba(233,242,253,.55);margin-left:auto;flex:none;white-space:nowrap}
.mp-progress{display:flex;align-items:center;gap:8px;margin-top:10px}
.mp-bar{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.18);cursor:pointer;position:relative}
.mp-bar i{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:2px;background:linear-gradient(90deg,#3aa3e3,#7cc4ec)}
.mp-time{font-size:10.5px;color:rgba(233,242,253,.6);font-variant-numeric:tabular-nums;flex:none}
.mp-ctrls{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:10px}
.mp-ctrls button{
  width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,.2);
  background:rgba(255,255,255,.08);color:#fff;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;
  transition:background .25s ease,transform .25s ease;
}
.mp-ctrls button:hover{background:rgba(58,163,227,.5);transform:scale(1.06)}
.mp-ctrls button svg{width:14px;height:14px}
.mp-ctrls .mp-playbtn{width:40px;height:40px;background:linear-gradient(140deg,#3aa3e3,#62a33d);border-color:transparent}
.mp-playlist{list-style:none;margin:10px 0 2px;padding:5px 2px 3px;border-top:1px dashed rgba(255,255,255,.16);max-height:148px;overflow-y:auto}
.mp-playlist li{padding:6px 9px;border-radius:8px;font-size:12.5px;color:rgba(233,242,253,.85);cursor:pointer;display:flex;gap:8px;align-items:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-playlist li:hover{background:rgba(255,255,255,.08)}
.mp-playlist li.on{color:#fff;background:rgba(58,163,227,.28)}
.mp-playlist li .idx{font-size:10.5px;color:rgba(233,242,253,.5);flex:none;width:14px}
@media(max-width:640px){
  .mp-root{left:12px;bottom:12px}
  .mp-disc{width:46px;height:46px}
}
`;

/** 页脚：旅店已开放 xx 天（天数由浏览器实时计算，静态站也不会过期） */
export function siteFooter() {
  return `<footer class="site-footer">
  ✦ 旅店已开放 <b id="sfDays">…</b> 天<span class="star">·</span>愿终有一天能与你重要的人重逢
</footer>
<script>
(function () {
  var el = document.getElementById('sfDays');
  if (!el) return;
  var open = Math.max(1, Math.ceil((Date.now() - new Date('${OPEN_SINCE}T00:00:00+08:00').getTime()) / 864e5));
  el.textContent = open.toLocaleString('en-US');
})();
</script>`;
}

/** 悬浮音乐播放器：右下角唱片按钮，点击展开面板（播放/切歌/进度/歌单） */
export function musicPlayer() {
  const ICONS = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 6h2v12H7zM20 6v12L9.5 12z"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 6h2v12h-2zM4 6v12l10.5-6z"/></svg>'
  };
  return `<div class="mp-root">
  <button class="mp-disc" id="mpDisc" type="button" aria-label="音乐播放器" title="音乐播放器"></button>
  <div class="mp-panel" id="mpPanel">
    <div class="mp-head"><span class="mp-title" id="mpTitle">…</span><span class="mp-artist" id="mpArtist"></span></div>
    <div class="mp-progress">
      <span class="mp-bar" id="mpBar"><i id="mpFill"></i></span>
      <span class="mp-time" id="mpTime">0:00 / 0:00</span>
    </div>
    <div class="mp-ctrls">
      <button type="button" id="mpPrev" title="上一首">${ICONS.prev}</button>
      <button type="button" class="mp-playbtn" id="mpPlay" title="播放/暂停">${ICONS.play}</button>
      <button type="button" id="mpNext" title="下一首">${ICONS.next}</button>
    </div>
    <ul class="mp-playlist" id="mpListEl"></ul>
  </div>
</div>
<audio id="mpAudio" preload="none"></audio>
<script>
(function () {
  var TR = ${JSON.stringify(TRACKS)};
  if (!TR.length) return;
  var audio = document.getElementById('mpAudio');
  var disc = document.getElementById('mpDisc');
  var panel = document.getElementById('mpPanel');
  var titleEl = document.getElementById('mpTitle');
  var artistEl = document.getElementById('mpArtist');
  var fill = document.getElementById('mpFill');
  var timeEl = document.getElementById('mpTime');
  var bar = document.getElementById('mpBar');
  var playBtn = document.getElementById('mpPlay');
  var listEl = document.getElementById('mpListEl');
  var cur = 0, errs = 0;

  function fmt(s) {
    if (!isFinite(s)) return '0:00';
    s = Math.max(0, Math.round(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function renderList() {
    listEl.innerHTML = TR.map(function (t, i) {
      return '<li class="' + (i === cur ? 'on' : '') + '" data-i="' + i + '"><span class="idx">' + (i + 1) + '</span><span style="overflow:hidden;text-overflow:ellipsis">' + t.title + (t.artist ? ' · ' + t.artist : '') + '</span></li>';
    }).join('');
  }
  function setPlayIcon(on) {
    playBtn.innerHTML = on
      ? '${ICONS.pause}'
      : '${ICONS.play}';
    disc.classList.toggle('playing', on);
  }
  function load(i, autoplay) {
    cur = ((i % TR.length) + TR.length) % TR.length;
    var t = TR[cur];
    audio.src = t.url;
    titleEl.textContent = t.title;
    artistEl.textContent = t.artist || '';
    fill.style.width = '0';
    timeEl.textContent = '0:00 / 0:00';
    renderList();
    if (autoplay) audio.play().catch(function () {});
  }
  function next(auto) { errs = auto ? errs : 0; load(cur + 1, playing || !!auto); }
  function prev() { load(cur - 1, playing); }

  disc.addEventListener('click', function () { panel.classList.toggle('open'); });
  playBtn.addEventListener('click', function () {
    if (!audio.src) { load(cur, true); return; }
    if (audio.paused) audio.play().catch(function () {}); else audio.pause();
  });
  document.getElementById('mpNext').addEventListener('click', function () { next(false); });
  document.getElementById('mpPrev').addEventListener('click', prev);
  audio.addEventListener('play', function () { setPlayIcon(true); playing = true; });
  audio.addEventListener('pause', function () { setPlayIcon(false); playing = false; });
  audio.addEventListener('ended', function () { next(true); });
  audio.addEventListener('error', function () {
    errs++;
    if (errs >= TR.length) { titleEl.textContent = '歌单加载失败'; setPlayIcon(false); return; }
    next(true);
  });
  audio.addEventListener('playing', function () { errs = 0; });
  audio.addEventListener('timeupdate', function () {
    var d = audio.duration;
    fill.style.width = (d ? (audio.currentTime / d) * 100 : 0) + '%';
    timeEl.textContent = fmt(audio.currentTime) + ' / ' + fmt(d);
  });
  bar.addEventListener('click', function (e) {
    var r = bar.getBoundingClientRect();
    if (isFinite(audio.duration)) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
  listEl.addEventListener('click', function (e) {
    var li = e.target.closest('li[data-i]');
    if (!li) return;
    playing = true;
    load(parseInt(li.dataset.i, 10), true);
  });

  load(0, false);
})();
</script>`;
}
