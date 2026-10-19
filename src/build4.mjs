// Концепт-сайт v4 - преміальний стиль за зразком дорогих приватних шкіл Києва.
// node src/build4.mjs -> ../index.html (+ manifest, sw.js)
import { readFileSync, writeFileSync } from 'node:fs';
const D = decodeURIComponent(new URL('..', import.meta.url).pathname);
const data = JSON.parse(readFileSync(D + 'src/data.json', 'utf8'));
const S = JSON.parse(readFileSync(D + 'src/school.json', 'utf8'));
const st30 = readFileSync(D + 'src/st30.txt', 'utf8').trim().split('\n').map(l => l.split('|')).filter(([h]) => h.split('/').length > 3).map(([h, t]) => ({ h: S.oldSite + h, t }));
const clean = t => t.split('\n').map(s => s.trim()).filter(s => s && !/^Ви знаходитесь|^20\d\d-\d\d-\d\d$/.test(s));
const AUD = t => /спорт|олімп|козац/i.test(t) ? 'Учням' : /дорог|безпек/i.test(t) ? 'Батькам' : 'Громаді';
const news = data.news.map((n, i) => ({ id: i + 1, date: n.date, title: n.title, lead: n.lead, aud: AUD(n.title), body: clean(n.text).filter(l => l !== n.title).join('\n').replace(/([.!?])(?=[А-ЯІЇЄҐ«])/g, '$1 '), img: S.newsImg[i] || '' }));
const about = clean(data.about.text).filter(l => !/^Комунальний заклад|^Поштова|^Телефон|^Електронна|^Сайт/.test(l)).join('\n');
const DATA = { S, news, st30, about };

const ICONS = {
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', arr: '<path d="M5 12h14M13 6l6 6-6 6"/>', check: '<path d="m5 12 4 4 10-10"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19V5"/>', doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', food: '<path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',
  bag: '<rect x="5" y="7" width="14" height="14" rx="3"/><path d="M9 7a3 3 0 0 1 6 0"/>', heart: '<path d="M12 20s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.5-8 11-8 11Z"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>', laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/>', bunker: '<path d="M3 20h18M5 20V10l7-5 7 5v10"/><path d="M9 20v-5h6v5"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/>',
  home: '<path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/>', news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>'
};
const sym = Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');

const css = `
:root{--ink:#12263f;--ink2:#3f4a5a;--mut:#6f7785;--bg:#f6f5f0;--card:#fff;--soft:#eceee9;--line:#e1e0d8;--acc:#f2c14e;--acc2:#fbf0cf;--navy:#12263f;--r:20px;--max:1240px}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font:400 17px/1.65 Inter,system-ui,sans-serif;color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}img{display:block;max-width:100%}
:focus-visible{outline:3px solid var(--acc);outline-offset:3px;border-radius:6px}
.skip{position:absolute;left:-9999px;top:8px;background:var(--ink);color:#fff;padding:10px 16px;border-radius:8px;z-index:100}.skip:focus{left:12px}
.w{max-width:var(--max);margin:0 auto;padding:0 28px}
svg.i{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
.disp{font-family:Oswald,"Inter Tight",sans-serif;text-transform:uppercase;letter-spacing:.01em}
h1,h2,h3{margin:0;font-weight:500}
h2.disp{font-size:clamp(34px,4.6vw,64px);line-height:1}
h3{font:700 20px/1.3 Inter}
.concept{position:fixed;left:16px;bottom:16px;z-index:60;background:rgba(11,22,38,.88);backdrop-filter:blur(8px);color:#cfd6e0;font-size:12.5px;line-height:1.4;padding:8px 14px;border-radius:12px;max-width:360px}.concept a{color:#fff;text-decoration:underline}.concept button{background:none;border:0;color:#fff;font-size:16px;cursor:pointer;margin-left:8px;padding:0 2px;vertical-align:middle}
/* шапка */
header.top{position:fixed;left:0;right:0;top:0;z-index:50;transition:background .3s,top .3s,box-shadow .3s;color:#fff}
header.top.solid{top:0;background:rgba(255,255,255,.97);color:var(--ink);box-shadow:0 1px 0 var(--line)}
.hd{display:flex;align-items:center;gap:20px;height:84px}
.brand{display:flex;gap:12px;align-items:center;white-space:nowrap}.brand b{font:600 19px/1 Oswald;text-transform:uppercase;letter-spacing:.03em;display:block}.brand small{font-size:12px;opacity:.75;display:block;margin-top:4px}
nav.mn{margin-left:auto;display:flex;gap:2px}nav.mn a{padding:9px 12px;font-weight:500;font-size:15px;border-radius:8px;white-space:nowrap;opacity:.92}nav.mn a:hover{opacity:1;background:rgba(255,255,255,.14)}header.solid nav.mn a:hover{background:var(--soft)}
.cta{display:inline-flex;align-items:center;gap:10px;padding:13px 20px;border-radius:12px;background:var(--acc);color:var(--ink);font:700 15px Inter;white-space:nowrap;border:0;cursor:pointer}.cta:hover{filter:brightness(1.05)}
.ghost{display:inline-flex;align-items:center;gap:10px;padding:13px 20px;border-radius:12px;border:1.5px solid rgba(255,255,255,.75);color:#fff;font:700 15px Inter;white-space:nowrap;background:rgba(255,255,255,.06);backdrop-filter:blur(6px)}.ghost:hover{background:rgba(255,255,255,.16)}
.burger{display:none;background:none;border:0;color:inherit;cursor:pointer}.ls{display:none}.hd>*{flex-shrink:0}.hcta{letter-spacing:0}
@media(max-width:1380px){.hd .lf{display:none}.hd .ls{display:inline}nav.mn a{padding:9px 9px}}
/* герой */
.hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:flex-end;color:#fff;overflow:hidden}
.hero picture,.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,22,38,.55) 0%,rgba(10,22,38,.05) 30%,rgba(10,22,38,.15) 55%,rgba(10,22,38,.82) 100%)}
.hero .w{position:relative;z-index:2;width:100%;padding-bottom:64px;display:grid;grid-template-columns:1.4fr 1fr;gap:40px;align-items:end}
.lbl{font:600 14px Inter;letter-spacing:.14em;text-transform:uppercase;opacity:.9}
.hero h1{font:300 clamp(54px,9.5vw,148px)/1 Oswald;text-transform:uppercase;letter-spacing:-.005em;margin:14px 0 14px}
.hero h1 b{font-weight:600;display:block;margin-top:.1em}
.hero p.sub{font-size:20px;max-width:560px;margin:0 0 28px;opacity:.95}
.hbtns{display:flex;gap:12px;flex-wrap:wrap}
.glass{justify-self:end;background:rgba(255,255,255,.12);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.25);border-radius:18px;padding:18px 20px;max-width:380px;display:grid;gap:10px;font-size:15px}
.glass .st{display:flex;gap:10px;align-items:center;font-weight:600}.dot{width:10px;height:10px;border-radius:50%;background:#7cf0b0;box-shadow:0 0 0 0 rgba(124,240,176,.7);animation:pulse 2s infinite}
@keyframes pulse{70%{box-shadow:0 0 0 10px rgba(124,240,176,0)}100%{box-shadow:0 0 0 0 rgba(124,240,176,0)}}
.glass button{justify-self:start;background:none;border:0;color:#fff;opacity:.8;font:600 13px Inter;cursor:pointer;padding:0;text-decoration:underline}
.scroll{position:absolute;left:50%;bottom:18px;z-index:2;transform:translateX(-50%);font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.7}
/* цифри */
.nums{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:-1px;padding:64px 0 24px}
.num{background:var(--card);border-radius:var(--r);padding:26px 26px 22px}.num small{display:block;color:var(--mut);font-size:14px;margin-bottom:6px}.num b{font:300 64px/1 Oswald;display:block;color:var(--ink)}.num b em{font-style:normal;font-size:26px;margin-left:6px}.num span{color:var(--ink2);font-size:15px}
/* заява */
.state{display:grid;grid-template-columns:1.1fr 1fr;gap:56px;padding:72px 0;align-items:start}
.state h2{font:500 clamp(30px,3.6vw,52px)/1.04 Oswald;text-transform:uppercase}
.state p{color:var(--ink2);font-size:18px;max-width:560px;margin:22px 0 26px}
.mos{display:grid;grid-template-columns:1.1fr 1fr;grid-auto-rows:230px;gap:12px}.mos button{border:0;padding:0;border-radius:16px;overflow:hidden;cursor:zoom-in;background:var(--soft)}.mos img{width:100%;height:100%;object-fit:cover;transition:transform .6s}.mos button:hover img{transform:scale(1.05)}.mos .t2{grid-row:span 2}
.dark{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:12px;background:var(--ink);color:#fff;font:700 15px Inter}.dark:hover{background:#1c3657}
/* ступені */
.sec{padding:80px 0}.sh{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:34px}.sh p{color:var(--mut);margin:12px 0 0;max-width:520px}
.lv{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.lvc{background:var(--card);border-radius:var(--r);padding:30px;display:flex;flex-direction:column;gap:14px;min-height:280px}.lvc .n{font:300 54px/1 Oswald;color:var(--acc)}.lvc h3{font:500 30px/1 Oswald;text-transform:uppercase}.lvc .g{font-weight:600;color:var(--mut);font-size:14px;letter-spacing:.08em;text-transform:uppercase}.lvc p{color:var(--ink2);margin:0}
/* смуга */
.band{background:var(--navy);color:#fff;border-radius:28px;padding:56px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.band h2{font:500 clamp(30px,3.4vw,48px)/1.05 Oswald;text-transform:uppercase}.band p{color:#c7d2e0;font-size:17px}
.why{display:grid;grid-template-columns:1fr 1fr;gap:12px}.why div{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:18px}.why b{display:block;font-size:17px;margin-bottom:4px}.why span{color:#c7d2e0;font-size:14.5px}
/* новини */
.ng{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:18px}
.nc{background:var(--card);border-radius:var(--r);overflow:hidden;display:flex;flex-direction:column;transition:transform .25s}.nc:hover{transform:translateY(-4px)}.nc:hover h3{text-decoration:underline;text-underline-offset:4px}
.nc .im{height:230px;overflow:hidden;background:var(--soft)}.nc .im img{width:100%;height:100%;object-fit:cover}
.nc .ph{height:230px;background:var(--navy);color:#fff;display:flex;flex-direction:column;justify-content:flex-end;padding:22px}.nc .ph b{font:300 84px/.9 Oswald;color:var(--acc)}.nc .ph span{font:500 18px Oswald;text-transform:uppercase;letter-spacing:.06em}
.nc .bd{padding:22px 24px 26px;display:flex;flex-direction:column;gap:10px}.meta{display:flex;gap:10px;align-items:center;font-size:13.5px;color:var(--mut)}.tag{font-weight:700;font-size:12px;padding:3px 10px;border-radius:99px;background:var(--acc2);color:#7a5500}
.nc p{margin:0;color:var(--ink2);font-size:15px}
/* вступ */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.step{background:var(--card);border-radius:var(--r);padding:28px}.step .n{font:300 46px/1 Oswald;color:var(--acc)}.step h3{margin:10px 0 8px}.step p{color:var(--ink2);margin:0;font-size:15.5px}
/* послуги для батьків */
.qk{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.q{background:var(--card);border-radius:16px;padding:18px;display:flex;gap:12px;align-items:center;font-weight:600;font-size:15.5px;transition:background .2s}.q:hover{background:var(--acc2)}.q .ic{width:42px;height:42px;border-radius:12px;background:var(--soft);display:grid;place-items:center;flex:none}
/* документи */
.docs{background:var(--card);border-radius:var(--r);overflow:hidden}.docs a{display:flex;gap:14px;align-items:center;padding:15px 22px;border-bottom:1px solid var(--line);font-weight:600}.docs a:last-child{border:0}.docs a:hover{background:var(--acc2)}.docs .ok{color:#2e7d5b}.docs .go{margin-left:auto;color:var(--mut)}
.search{width:100%;max-width:560px;padding:15px 18px;border:1px solid var(--line);border-radius:12px;font:500 16px Inter;background:#fff;margin-bottom:18px}
/* внутрішні */
.pg{padding-top:150px}.crumbs{font-size:14px;color:var(--mut)}.pg h1{font:500 clamp(44px,6vw,84px)/.95 Oswald;text-transform:uppercase;margin:14px 0 18px}.lead{font-size:19px;color:var(--ink2);max-width:760px;margin:0}
.two{display:grid;grid-template-columns:1fr 1fr;gap:48px}
.tl{list-style:none;margin:0;padding:0}.tl li{display:grid;grid-template-columns:90px 1fr;gap:16px;padding:18px 0;border-bottom:1px solid var(--line)}.tl b{font:400 30px/1 Oswald;color:var(--ink)}
.pp{display:flex;gap:16px;align-items:center;padding:18px;background:var(--card);border-radius:16px;margin-bottom:12px}.pp .av{width:54px;height:54px;border-radius:50%;background:var(--acc2);display:grid;place-items:center;font:600 18px Oswald;flex:none}.pp small{display:block;color:var(--mut);font-size:14px}
.txt p{margin:0 0 14px;color:var(--ink2)}
.gal{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.gal button{border:0;padding:0;aspect-ratio:4/3;border-radius:14px;overflow:hidden;cursor:zoom-in}.gal img{width:100%;height:100%;object-fit:cover}
.nl a{display:grid;grid-template-columns:150px 1fr;gap:24px;padding:24px 0;border-bottom:1px solid var(--line)}.nl a:hover h3{text-decoration:underline}.nl time{color:var(--mut)}.nl p{margin:6px 0 0;color:var(--ink2)}
.article{max-width:780px}.article p{margin:0 0 16px;font-size:18px}.article .im{border-radius:18px;overflow:hidden;margin:24px 0;max-width:440px}
.btn{display:inline-flex;align-items:center;gap:10px;padding:13px 20px;border-radius:12px;border:1px solid var(--line);background:#fff;font:700 15px Inter}
.ci{background:var(--card);border-radius:var(--r);overflow:hidden}.ci div{display:flex;gap:16px;padding:20px 22px;border-bottom:1px solid var(--line)}.ci div:last-child{border:0}.ci small{display:block;color:var(--mut);font-size:13.5px}.ci b{font-weight:700}
.map{border-radius:var(--r);overflow:hidden;min-height:380px;background:var(--soft)}.map iframe{width:100%;height:100%;min-height:380px;border:0}
/* футер */
footer{background:#0b1626;color:#a9b4c3;margin-top:90px;font-size:14.5px}footer .big{font:300 clamp(40px,7vw,104px)/1.08 Oswald;text-transform:uppercase;color:#fff;padding:64px 0 34px;border-bottom:1px solid #1d2c42}footer .big b{font-weight:600;display:inline-block;margin-top:.08em}
footer .cols{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px;padding:36px 0}footer h4{color:#fff;margin:0 0 10px;font:600 15px Inter}footer a{display:block;padding:3px 0}footer a:hover{color:#fff}
.fb{border-top:1px solid #1d2c42;padding:16px 0;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.lb{position:fixed;inset:0;background:rgba(11,22,38,.94);display:none;place-items:center;z-index:90;cursor:zoom-out}.lb.on{display:grid}.lb img{max-width:92vw;max-height:88vh;border-radius:12px;min-width:min(90vw,640px)}
.bnav{display:none}
/* доступність */
.a11y{position:fixed;left:0;right:0;top:0;z-index:80;background:#fff;color:#000;border-bottom:2px solid var(--ink);font-size:15px}.a11y .w{display:flex;flex-wrap:wrap;gap:12px 28px;padding-top:14px;padding-bottom:14px;align-items:center}
.ag{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.ag span{font-weight:700;margin-right:4px}.ag button{min-width:42px;height:40px;padding:0 12px;border:1px solid #555;background:#fff;color:#000;border-radius:10px;font:700 15px Inter;cursor:pointer}.ag button[aria-pressed=true]{outline:3px solid #12263f;outline-offset:1px}
.sw1{background:#fff!important;color:#000!important}.sw2{background:#000!important;color:#fff!important}.sw3{background:#9dd1ff!important;color:#063462!important}
.a11y-open{display:inline-flex;gap:8px;align-items:center;background:none;border:1.5px solid currentColor;border-radius:10px;color:inherit;font:600 13.5px Inter;padding:8px 12px;cursor:pointer;opacity:.9;white-space:nowrap}
html.fs2 body{font-size:20px}html.fs3 body{font-size:23px}
html.cs1{--bg:#fff;--card:#fff;--ink:#000;--ink2:#000;--mut:#000;--line:#000;--soft:#fff;--acc:#000;--acc2:#eee;--navy:#000}
html.cs2{--bg:#000;--card:#000;--ink:#fff;--ink2:#fff;--mut:#fff;--line:#fff;--soft:#000;--acc:#ff0;--acc2:#222;--navy:#000}html.cs2 .card,html.cs2 .num,html.cs2 .lvc,html.cs2 .nc,html.cs2 .step,html.cs2 .q,html.cs2 .docs,html.cs2 .ci,html.cs2 .pp{border:1px solid #fff}html.cs2 header.top.solid{background:#000;color:#fff}html.cs2 .cta{background:#ff0;color:#000}
html.cs3{--bg:#9dd1ff;--card:#bfe2ff;--ink:#063462;--ink2:#063462;--mut:#063462;--line:#063462;--soft:#9dd1ff;--acc:#063462;--acc2:#9dd1ff;--navy:#063462}
html.cs1 img,html.cs2 img,html.cs3 img{filter:grayscale(1)}
html.ls1 body{letter-spacing:.08em;word-spacing:.16em;line-height:1.95}
html.im1 main img,html.im1 .mos,html.im1 .gal,html.im1 .nc .im{display:none!important}html.im1 .hero{background:var(--navy)}
html.ln1 main a{text-decoration:underline!important;text-underline-offset:3px}
html.an1 *{animation:none!important;transition:none!important}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
@media(max-width:1180px){.hd .a11y-open{margin-left:auto}nav.mn{display:none}.burger{display:inline-flex}nav.mn.open{display:flex;flex-direction:column;position:absolute;top:84px;left:0;right:0;background:#fff;color:var(--ink);padding:10px 20px 20px;box-shadow:0 10px 20px rgba(0,0,0,.1)}.hd .a11y-open span{display:none}}
@media(max-width:980px){.hero .w,.state,.band,.two{grid-template-columns:1fr}.glass{justify-self:start}.nums{grid-template-columns:1fr 1fr}.lv,.steps{grid-template-columns:1fr}.ng{grid-template-columns:1fr 1fr}.qk{grid-template-columns:1fr 1fr}.gal{grid-template-columns:repeat(3,1fr)}footer .cols{grid-template-columns:1fr}.band{padding:34px}}
@media(max-width:620px){body{font-size:16px;padding-bottom:68px}.w{padding:0 18px}.hd{height:70px}.brand small{display:none}.hd .cta{display:none}.hero .w{padding-bottom:40px}.hero p.sub{font-size:17px}.num b{font-size:48px}.ng,.qk{grid-template-columns:1fr}.why{grid-template-columns:1fr}.mos{grid-auto-rows:150px}.sec{padding:56px 0}.state{padding:48px 0}.nl a{grid-template-columns:1fr;gap:4px}.gal{grid-template-columns:repeat(2,1fr)}.pg{padding-top:120px}
.concept{left:10px;right:10px;bottom:78px;max-width:none;font-size:11.5px}.hd{gap:10px}.bnav{display:grid;grid-template-columns:repeat(4,1fr);position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--line);z-index:45;padding:6px 0 max(6px,env(safe-area-inset-bottom))}.bnav a{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11.5px;font-weight:600;color:var(--ink2)}}
`;

const html = `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#12263f">
<title>${S.short} - концепт нового сайту</title>
<meta property="og:title" content="${S.short} - концепт нового сайту"><meta property="og:image" content="img/hero/hero-1100.jpg">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="img/hero/hero-2200.jpg" media="(min-width:700px)"><link rel="preload" as="image" href="img/hero/hero-1100.jpg" media="(max-width:699px)">
<style>${css}</style>
</head>
<body>
<a class="skip" href="#app">Перейти до змісту</a>
<div class="concept">Концепт-макет для обговорення, не офіційний сайт закладу. Пейзаж на першому екрані - ілюстрація. Офіційний сайт: <a href="${S.oldSite}" target="_blank" rel="noopener">${S.oldSite.replace('http://', '')}</a><button aria-label="Сховати" onclick="this.parentNode.remove()">✕</button></div>
<div class="a11y" id="a11y" role="region" aria-label="Налаштування доступності" hidden><div class="w">
  <div class="ag"><span>Шрифт</span><button data-k="fs" data-v="1" aria-label="Звичайний шрифт">A</button><button data-k="fs" data-v="2" aria-label="Великий шрифт" style="font-size:19px">A</button><button data-k="fs" data-v="3" aria-label="Дуже великий шрифт" style="font-size:23px">A</button></div>
  <div class="ag"><span>Кольори</span><button data-k="cs" data-v="0" aria-label="Звичайні кольори">Ц</button><button data-k="cs" data-v="1" class="sw1" aria-label="Чорне на білому">Ц</button><button data-k="cs" data-v="2" class="sw2" aria-label="Біле на чорному">Ц</button><button data-k="cs" data-v="3" class="sw3" aria-label="Синє на блакитному">Ц</button></div>
  <div class="ag"><span>Інтервал</span><button data-k="ls" data-v="0">Звичайний</button><button data-k="ls" data-v="1">Широкий</button></div>
  <div class="ag"><span>Зображення</span><button data-k="im" data-v="0">Показати</button><button data-k="im" data-v="1">Сховати</button></div>
  <div class="ag"><button data-k="an" data-v="tog">Зупинити анімацію</button><button data-k="ln" data-v="tog">Підкреслити посилання</button><button id="a11yReset">Скинути</button><button id="a11yClose" aria-label="Закрити панель">✕</button></div>
</div></div>
<header class="top" id="hdr"><div class="w hd">
  <a class="brand" href="#/" aria-label="${S.short} - на головну"><svg width="40" height="46" viewBox="0 0 42 48" aria-hidden="true"><path d="M21 1 2 7v15c0 12 8 21 19 25 11-4 19-13 19-25V7L21 1Z" fill="#12263f" stroke="#fff" stroke-width="1.5"/><path d="M6 30c4 7 9 11 15 13 6-2 11-6 15-13H6Z" fill="#f2c14e"/><path d="M11 21c3-3 7-3 10 0 3-3 7-3 10 0" stroke="#f2c14e" stroke-width="2.2" fill="none" stroke-linecap="round"/><text x="21" y="16" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="10" fill="#fff">${S.mark}</text></svg><div><b>${S.short}</b><small>${S.owner}</small></div></a>
  <nav class="mn" id="mn" aria-label="Головне меню"><a href="#/about">Про ліцей</a><a href="#/news">Новини</a><a href="#/parents">Батькам</a><a href="#/st30">Документи</a><a href="#/contacts">Контакти</a></nav>
  <button class="a11y-open" id="a11yBtn" aria-expanded="false" aria-controls="a11y" title="Версія для людей з порушенням зору"><svg class="i"><use href="#i-eye"/></svg><span class="lf">Людям з порушенням зору</span><span class="ls">Доступність</span></button>
  <a class="cta hcta" href="#/contacts"><span class="lf">Записатися на знайомство</span><span class="ls">Записатися</span></a>
  <button class="burger" aria-label="Меню" onclick="mn.classList.toggle('open')"><svg class="i"><use href="#i-menu"/></svg></button>
</div></header>
<main id="app" tabindex="-1"></main>
<footer><div class="w">
  <div class="big">Медведівський<br><b>ліцей</b></div>
  <div class="cols"><div><h4>${S.full}</h4>${S.address}<br><a href="tel:${S.phoneTel}">${S.phone}</a><a href="mailto:${S.email}">${S.email}</a></div>
  <div><h4>Розділи</h4><a href="#/about">Про ліцей</a><a href="#/news">Новини</a><a href="#/parents">Батькам і учням</a><a href="#/st30">Документи</a><a href="#/contacts">Контакти</a></div>
  <div><h4>Корисне</h4><a href="${S.journal}" target="_blank" rel="noopener">Електронний журнал «Нові знання»</a><a href="https://mon.gov.ua" target="_blank" rel="noopener">МОН України</a><a href="https://sqe.gov.ua" target="_blank" rel="noopener">Державна служба якості освіти</a><a href="https://testportal.gov.ua" target="_blank" rel="noopener">УЦОЯО - НМТ</a></div></div>
  <div class="fb"><span>Концепт-макет · не є офіційним сайтом закладу</span><span>Розробка: Микола Несвітій</span></div>
</div></footer>
<nav class="bnav" aria-label="Швидке меню"><a href="#/"><svg class="i"><use href="#i-home"/></svg>Головна</a><a href="#/news"><svg class="i"><use href="#i-news"/></svg>Новини</a><a href="#/parents"><svg class="i"><use href="#i-users"/></svg>Батькам</a><a href="#/contacts"><svg class="i"><use href="#i-phone"/></svg>Контакти</a></nav>
<div class="lb" id="lb" onclick="this.classList.remove('on')"><img id="lbi" alt=""></div>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${sym}</defs></svg>
<script>
const D=${JSON.stringify(DATA)};
const S=D.S,ic=n=>'<svg class="i" aria-hidden="true"><use href="#i-'+n+'"/></svg>',esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const M=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
const dt=d=>{const[a,b,c]=d.split('.');return +a+' '+M[+b-1]+' '+c};
const crumbs=(...x)=>'<div class="crumbs"><a href="#/">Головна</a>'+x.map(t=>' / '+t).join('')+'</div>';
const nCard=n=>'<a class="nc" href="#/news/'+n.id+'">'+(n.img?'<div class="im"><img src="'+n.img+'" alt="" loading="lazy"></div>':'<div class="ph"><b>'+(+n.date.split('.')[0])+'</b><span>'+M[+n.date.split('.')[1]-1]+'</span></div>')+'<div class="bd"><div class="meta"><span class="tag">'+n.aud+'</span>'+dt(n.date)+'</div><h3>'+esc(n.title)+'</h3><p>'+esc(n.lead.slice(0,120))+'…</p></div></a>';
const QK=[['clock','Режим і дзвінки','/uchnyam/rezhim_roboti_rozklad_dzvinkiv/'],['cal','Структура року','/organizaciya_osvitnjogo_procesu/struktura_navchaljnogo_roku/'],['food','Харчування','/organizaciya_osvitnjogo_procesu/organizaciya_harchuvannya/'],['bunker','Безпека й укриття','/uchnyam/bezpeka_zhittyediyaljnosti/'],['bag','Вступ до 1 класу','/uchnyam/batjkam_majbutnih_pershoklasnikiv/'],['heart','Психолог','/uchnyam/psihologichna_pidtrimka/'],['doc','Розклад уроків','/uchnyam/rozklad_urokiv/'],['cap','НМТ і вступ','/uchnyam/nmt_zno-2025/']];
const q=([i,t,h])=>'<a class="q" href="'+S.oldSite+h+'" target="_blank" rel="noopener"><span class="ic">'+ic(i)+'</span>'+t+'</a>';
const P={
'':()=>'<section class="hero"><picture><source media="(max-width:699px)" srcset="img/hero/hero-1100.jpg"><img class="bg" src="img/hero/hero-2200.jpg" alt="Осінній пейзаж: річка серед полів і дерев"></picture>'
 +'<div class="w"><div><div class="lbl">1-11 клас · с. Медведівка · з 1912 року</div><h1>Медведівський<b>ліцей</b></h1><p class="sub">Школа над Берестовою, де знають кожного учня. Невеликі класи, сильна українська філологія і 114 років традицій.</p>'
 +'<div class="hbtns"><a class="cta" href="#/parents">Вступ до 1 класу '+ic('arr')+'</a><a class="ghost" href="#/contacts">Записатися на знайомство</a><a class="ghost" href="'+S.journal+'" target="_blank" rel="noopener">'+ic('book')+'Електронний журнал</a></div></div>'
 +'<div class="glass" role="status"><div class="st"><span class="dot"></span><span id="stText"></span></div><div style="opacity:.85">'+ic('pin')+' '+S.address.replace('64011, ','')+'</div><button id="stDemo">змінити режим (демо)</button></div></div><div class="scroll">Гортайте</div></section>'
 +'<div class="w"><div class="nums">'+[['Історія','114','років','з 1912 року'],['Учні','111','','у 10 класах'],['Класи','до 18','','учнів - увага кожному'],['Команда','20','','педагогів, більшість - вищої категорії']].map(([s,b,e,t])=>'<div class="num"><small>'+s+'</small><b>'+b+(e?'<em>'+e+'</em>':'')+'</b><span>'+t+'</span></div>').join('')+'</div>'
 +'<section class="state"><div><h2>Медведівський ліцей - школа, де знають кожного учня і пам’ятають своїх героїв</h2><p>Опорна школа для дітей Медведівки й сусідніх сіл. Навчання українською, у старших класах - профіль української філології. Свята у вишиванках, походи, олімпійський тиждень і уроки пам’яті - це не слова, а наше щоденне життя.</p><a class="dark" href="#/about">Більше про ліцей '+ic('arr')+'</a></div>'
 +'<div class="mos">'+[1,8,0].map((k,i)=>'<button class="'+(i===0?'t2':'')+'" data-src="'+S.photos[k]+'" aria-label="Відкрити фото"><img src="'+S.photos[k]+'" alt="Фото з життя ліцею"></button>').join('')+'</div></section></div>'
 +'<div class="w"><section class="sec" style="padding-top:20px"><div class="sh"><div><h2 class="disp">Ступені навчання</h2><p>Від першого дзвоника до випускного - в одній школі.</p></div></div><div class="lv">'+[['01','1-4 класи','Початкова школа','Нова українська школа: перші кроки в навчанні в теплій атмосфері невеликого класу.'],['02','5-9 класи','Гімназія','Базова середня освіта; у 8-9 класах - поглиблене вивчення української мови.'],['03','10-11 класи','Ліцей','Профіль української філології та підготовка до НМТ.']].map(([n,g,t,p])=>'<div class="lvc"><div class="n">'+n+'</div><div class="g">'+g+'</div><h3>'+t+'</h3><p>'+p+'</p></div>').join('')+'</div></section></div>'
 +'<div class="w"><div class="band"><div><h2>Чому родини обирають Медведівський ліцей</h2><p style="margin:18px 0 26px">У ліцеї є вільні місця в усіх класах. Приходьте познайомитися - покажемо школу й відповімо на питання.</p><a class="cta" href="tel:'+S.phoneTel+'">'+ic('phone')+'Записатися на знайомство</a></div><div class="why">'+[['Невеликі класи','до 18 учнів - учитель знає кожну дитину'],['Сильна українська','профіль української філології, поглиблене вивчення з 8 класу'],['Традиції','свята у вишиванках, музей, пам’ять про героїв'],['Рух і спорт','олімпійський тиждень, походи, спортивні свята']].map(([b,s])=>'<div><b>'+b+'</b><span>'+s+'</span></div>').join('')+'</div></div></div>'
 +'<div class="w"><section class="sec"><div class="sh"><div><h2 class="disp">Життя ліцею</h2><p>Останні події - так, як їх бачать батьки.</p></div><a class="dark" href="#/news">Усі новини '+ic('arr')+'</a></div><div class="ng">'+D.news.slice(0,3).map(nCard).join('')+'</div></section></div>'
 +'<div class="w"><section class="sec" style="padding-top:0"><div class="sh"><div><h2 class="disp">Як вступити</h2><p>Три кроки до навчання в ліцеї.</p></div></div><div class="steps">'+[['01','Зателефонуйте або напишіть','Розкажемо про ліцей і вільні місця - '+S.phone+'.'],['02','Познайомтеся зі школою','Покажемо класи, познайомимо з учителями, відповімо на питання.'],['03','Подайте документи','Перелік документів і порядок зарахування - у розділі для батьків.']].map(([n,t,p])=>'<div class="step"><div class="n">'+n+'</div><h3>'+t+'</h3><p>'+p+'</p></div>').join('')+'</div></section></div>'
 +'<div class="w"><section class="sec" style="padding-top:0"><div class="sh"><div><h2 class="disp">Батькам і учням</h2><p>Найпотрібніше - в один дотик.</p></div></div><div class="qk">'+QK.map(q).join('')+'</div></section></div>'
 +'<div class="w"><section class="sec" style="padding-top:0"><div class="band" style="background:var(--acc2);color:var(--ink)"><div><h2>Відкритість</h2><p style="color:var(--ink2);margin:16px 0 24px">Усі документи за статтею 30 Закону «Про освіту» - в одному розділі, з пошуком і датою оновлення.</p><a class="dark" href="#/st30">'+ic('doc')+'Усі документи ('+D.st30.length+')</a></div><div class="why">'+D.st30.slice(0,6).map(d=>'<div style="background:#fff;border-color:var(--line)"><b style="font-size:15px">'+esc(d.t)+'</b></div>').join('')+'</div></div></section></div>',
'about':()=>'<div class="w pg">'+crumbs('Про ліцей')+'<h1>Про ліцей</h1><p class="lead">'+S.lead2+'</p><section class="sec" style="padding-top:44px"><div class="two"><div><h2 class="disp" style="font-size:40px;margin-bottom:16px">Історія</h2><ul class="tl">'+S.timeline.map(([y,t])=>'<li><b>'+y+'</b><span>'+t+'</span></li>').join('')+'</ul></div><div><h2 class="disp" style="font-size:40px;margin-bottom:16px">Адміністрація</h2>'+S.team.map(([n,r])=>'<div class="pp"><div class="av">'+n.split(' ').slice(0,2).map(w=>w[0]).reverse().join('')+'</div><div><b>'+n+'</b><small>'+r+'</small></div></div>').join('')+'</div></div></section><section class="sec" style="padding-top:0"><h2 class="disp" style="font-size:40px;margin-bottom:16px">Про заклад</h2><div class="txt">'+D.about.split('\\n').slice(0,14).map(l=>'<p>'+esc(l)+'</p>').join('')+'</div></section><section class="sec" style="padding-top:0"><h2 class="disp" style="font-size:40px;margin-bottom:16px">Фотогалерея</h2><div class="gal">'+S.photos.map(p=>'<button data-src="'+p+'" aria-label="Відкрити фото"><img src="'+p+'" alt="Фото з життя ліцею" loading="lazy"></button>').join('')+'</div></section></div>',
'news':()=>'<div class="w pg">'+crumbs('Новини')+'<h1>Новини</h1><div class="nl">'+D.news.map(n=>'<a href="#/news/'+n.id+'"><time>'+dt(n.date)+'</time><div><span class="tag">'+n.aud+'</span><h3 style="margin-top:8px">'+esc(n.title)+'</h3><p>'+esc(n.lead.slice(0,170))+'…</p></div></a>').join('')+'</div></div>',
'news/':id=>{const n=D.news.find(x=>x.id==id);if(!n)return P.news();return '<div class="w pg">'+crumbs('<a href="#/news">Новини</a>',esc(n.title.slice(0,40)))+'<article class="article"><h1 style="font-size:clamp(36px,4.6vw,60px)">'+esc(n.title)+'</h1><div class="meta"><span class="tag">'+n.aud+'</span>'+dt(n.date)+'</div>'+(n.img?'<div class="im"><img src="'+n.img+'" alt=""></div>':'<div style="height:22px"></div>')+n.body.split('\\n').map(l=>'<p>'+esc(l)+'</p>').join('')+'<a class="btn" href="#/news">До всіх новин</a></article></div>'},
'parents':()=>'<div class="w pg">'+crumbs('Батькам і учням')+'<h1>Батькам і учням</h1><p class="lead">Найпотрібніша інформація для родин учнів ліцею.</p><section class="sec" style="padding-top:36px"><div class="qk">'+QK.map(q).join('')+'</div></section></div>',
'st30':()=>'<div class="w pg">'+crumbs('Документи')+'<h1>Прозорість</h1><p class="lead">Документи закладу відповідно до статті 30 Закону України «Про освіту». Біля кожного документа - дата останнього оновлення.</p><section class="sec" style="padding-top:34px"><input class="search" id="q" placeholder="Знайти документ: статут, кошторис, ліцензія…" aria-label="Пошук документа"><div class="docs">'+D.st30.map(d=>'<a href="'+d.h+'" target="_blank" rel="noopener"><span class="ok">'+ic('check')+'</span>'+esc(d.t)+'<span class="go">'+ic('arr')+'</span></a>').join('')+'</div></section></div>',
'contacts':()=>'<div class="w pg">'+crumbs('Контакти')+'<h1>Контакти</h1><section class="sec" style="padding-top:28px"><div class="two"><div class="ci"><div>'+ic('pin')+'<span><small>Адреса</small><b>'+S.address+'</b></span></div><div>'+ic('phone')+'<span><small>Телефон</small><b><a href="tel:'+S.phoneTel+'">'+S.phone+'</a></b></span></div><div>'+ic('mail')+'<span><small>Електронна пошта</small><b><a href="mailto:'+S.email+'">'+S.email+'</a></b></span></div><div>'+ic('users')+'<span><small>Директор</small><b>'+S.team[0][0]+'</b></span></div></div><div class="map"><iframe title="Карта" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox='+S.bbox+'&layer=mapnik&marker='+S.lat+','+S.lon+'"></iframe></div></div></section></div>'
};
const ST=[['Сьогодні','навчання очно'],['Сьогодні','дистанційне навчання'],['Повітряна тривога','учні в укритті']];let si=0;
function st(){const e=document.getElementById('stText');if(!e)return;const d=new Date();e.innerHTML='<b>'+ST[si][0]+(si<2?', '+d.getDate()+' '+M[d.getMonth()]:'')+':</b> '+ST[si][1];const dot=document.querySelector('.dot');if(dot)dot.style.background=si===2?'#ff6b5e':si===1?'#8ec5ff':'#7cf0b0'}
function route(){const h=location.hash.replace(/^#\\/?/,'');const m=h.match(/^news\\/(\\d+)/);app.innerHTML=m?P['news/'](m[1]):(P[h]||P[''])();mn.classList.remove('open');window.scrollTo(0,0);onScroll();
document.querySelectorAll('.gal button,.mos button').forEach(b=>b.onclick=()=>{lbi.src=b.dataset.src;lb.classList.add('on')});const qq=document.getElementById('q');if(qq)qq.oninput=()=>document.querySelectorAll('.docs a').forEach(a=>a.style.display=a.innerText.toLowerCase().includes(qq.value.toLowerCase())?'':'none');
st();const sd=document.getElementById('stDemo');if(sd)sd.onclick=()=>{si=(si+1)%3;st()};}
function onScroll(){const home=!location.hash||location.hash==='#/'||location.hash==='#';hdr.classList.toggle('solid',!home||window.scrollY>60)}
window.addEventListener('scroll',onScroll,{passive:true});window.onhashchange=route;route();
const A={fs:'1',cs:'0',ls:'0',im:'0',ln:'0',an:'0'};try{Object.assign(A,JSON.parse(localStorage.getItem('a11y')||'{}'))}catch(e){}
function applyA(){document.documentElement.className=['fs'+A.fs,'cs'+A.cs,'ls'+A.ls,'im'+A.im,'ln'+A.ln,'an'+A.an].join(' ');document.querySelectorAll('.ag button[data-k]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v==='tog'?String(A[b.dataset.k]==='1'):String(A[b.dataset.k]===b.dataset.v)));try{localStorage.setItem('a11y',JSON.stringify(A))}catch(e){}}
document.querySelectorAll('.ag button[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;A[k]=b.dataset.v==='tog'?(A[k]==='1'?'0':'1'):b.dataset.v;applyA()});
a11yReset.onclick=()=>{Object.assign(A,{fs:'1',cs:'0',ls:'0',im:'0',ln:'0',an:'0'});applyA()};
const tg=o=>{a11y.hidden=!o;a11yBtn.setAttribute('aria-expanded',String(o));if(o)a11y.querySelector('button').focus()};a11yBtn.onclick=()=>tg(a11y.hidden);a11yClose.onclick=()=>{tg(false);a11yBtn.focus()};applyA();
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
</script>
</body></html>`;
writeFileSync(D + 'index.html', html);
writeFileSync(D + 'manifest.webmanifest', JSON.stringify({ name: S.short, short_name: 'Медведівка', start_url: './', display: 'standalone', background_color: '#f6f5f0', theme_color: '#12263f', lang: 'uk', icons: [{ src: 'img/hero/hero-1100.jpg', sizes: '1100x614', type: 'image/jpeg' }] }, null, 1));
writeFileSync(D + 'sw.js', `const C='school-v4';const F=['./','index.html','manifest.webmanifest','img/hero/hero-1100.jpg',${S.photos.map(p => `'${p}'`).join(',')}];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});`);
console.log('v4 index.html', html.length);
