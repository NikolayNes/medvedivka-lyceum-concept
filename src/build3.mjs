// Концепт-сайт школи v3: «Поле і небо», табло дня, плитки сервісів, цінності з доказами, ступені, PWA.
// node src/build3.mjs -> ../index.html, ../manifest.webmanifest, ../sw.js
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

const css = `
:root{--sky:#1f4e79;--sky2:#e7eef6;--wheat:#f2c14e;--wheat2:#fdf3d7;--field:#2e7d5b;--field2:#e3f1ea;--bg:#f7f4ec;--card:#fff;--ink:#1b1b1b;--ink2:#41464f;--mut:#6d7280;--line:#e5e0d3;--r:18px;--max:1200px}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font:400 17px/1.65 Inter,system-ui,sans-serif;color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}img{display:block;max-width:100%}
:focus-visible{outline:3px solid var(--sky);outline-offset:3px;border-radius:6px}
.skip{position:absolute;left:-9999px;top:8px;background:var(--ink);color:#fff;padding:10px 16px;border-radius:8px;z-index:100}.skip:focus{left:12px}
.w{max-width:var(--max);margin:0 auto;padding:0 24px}
svg.i{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}
h1,h2,h3{font-family:"Inter Tight",Inter,sans-serif;letter-spacing:-.025em;margin:0}
h1{font-weight:800;font-size:clamp(40px,6vw,76px);line-height:1}
h2{font-weight:800;font-size:clamp(28px,3.4vw,42px);line-height:1.08}
h3{font-weight:700;font-size:20px;line-height:1.25}
.concept{background:var(--ink);color:#cfd3da;font-size:13px;text-align:center;padding:7px 16px}.concept a{color:#fff;text-decoration:underline}
/* табло дня */
.status{background:var(--field);color:#fff}.status .w{display:flex;align-items:center;gap:14px;min-height:46px;font-size:15px;flex-wrap:wrap;padding-top:6px;padding-bottom:6px}
.status .dot{width:10px;height:10px;border-radius:50%;background:#7cf0b0;box-shadow:0 0 0 0 rgba(124,240,176,.7);animation:pulse 2s infinite}
@keyframes pulse{70%{box-shadow:0 0 0 10px rgba(124,240,176,0)}100%{box-shadow:0 0 0 0 rgba(124,240,176,0)}}
.status b{font-weight:700}.status .demo{margin-left:auto;font-size:12.5px;opacity:.8;border:1px solid rgba(255,255,255,.4);border-radius:99px;padding:2px 10px}
.status button{background:rgba(255,255,255,.14);border:0;color:#fff;border-radius:99px;padding:5px 12px;font:600 13px Inter;cursor:pointer}.status .a11y-open{margin-left:auto;display:inline-flex;gap:8px;align-items:center;background:#fff;color:var(--ink);font-size:14px;padding:6px 14px}.status .a11y-open svg{width:18px;height:18px}
.status.dist{background:var(--sky)}.status.alarm{background:#b3261e}
/* шапка */
header.top{position:sticky;top:0;z-index:30;background:rgba(247,244,236,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.hd{display:flex;align-items:center;height:76px;gap:22px}
.brand{display:flex;gap:12px;align-items:center;white-space:nowrap}.brand b{display:block;font:800 17px/1.15 "Inter Tight"}.brand small{color:var(--mut);font-size:12.5px}
nav.mn{margin-left:auto;display:flex;gap:2px}nav.mn a{white-space:nowrap;padding:9px 12px;font-weight:600;font-size:15px;border-radius:10px;color:var(--ink2)}nav.mn a:hover,nav.mn a.on{background:#fff;color:var(--ink)}
.hbtn{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 14px;border-radius:12px;border:1px solid var(--line);background:#fff;font:600 14px Inter;cursor:pointer;color:var(--ink)}
.hbtn.j{background:var(--sky);color:#fff;border-color:var(--sky);white-space:nowrap}
.burger{display:none}
/* герой */
.hero{padding:64px 0 40px;display:grid;grid-template-columns:1.25fr 1fr;gap:48px;align-items:center}
.kick{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:14px;color:var(--field);background:var(--field2);padding:6px 14px;border-radius:99px}
.hero h1{margin:20px 0 14px}
.rot{font:700 clamp(22px,2.4vw,30px)/1.25 "Inter Tight";color:var(--ink2);min-height:2.6em;margin:0 0 26px}.rot em{font-style:normal;color:var(--sky);background:linear-gradient(transparent 62%,var(--wheat) 62%)}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:14px;font:700 15.5px Inter;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--ink)}.btn:hover{border-color:var(--ink)}
.btn.p{background:var(--sky);color:#fff;border-color:var(--sky)}.btn.p:hover{background:#173d60}
.frames{position:relative;height:430px}
.fr{position:absolute;border-radius:24px;overflow:hidden;border:8px solid #fff;box-shadow:0 20px 40px rgba(31,78,121,.18)}.fr img{width:100%;height:100%;object-fit:cover}
.fr1{width:300px;height:225px;left:0;top:20px;transform:rotate(-3deg)}.fr2{width:290px;height:218px;right:0;top:0;transform:rotate(3deg)}.fr3{width:300px;height:225px;left:22%;bottom:0;transform:rotate(-1deg)}
.badge{position:absolute;right:4%;bottom:34px;background:var(--wheat);border-radius:18px;padding:14px 18px;font:700 14px/1.3 Inter;box-shadow:0 10px 24px rgba(0,0,0,.12)}.badge b{display:block;font:800 30px "Inter Tight";line-height:1}
.orn{position:absolute;inset:auto auto -30px -40px;width:170px;height:170px;opacity:.5}
/* плитки */
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:8px 0 0}
.tile{background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:20px;display:flex;gap:14px;align-items:center;transition:.2s}.tile:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(31,78,121,.1);border-color:transparent}
.tile .ic{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;flex:none}.tile b{font-weight:700;font-size:16px;line-height:1.25;display:block}.tile small{color:var(--mut);font-size:13.5px}
.c1{background:var(--sky2);color:var(--sky)}.c2{background:var(--wheat2);color:#9a6b00}.c3{background:var(--field2);color:var(--field)}.c4{background:#fbe6e3;color:#b3261e}
section.s{padding:72px 0}
.sh{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:30px}.sh p{margin:8px 0 0;color:var(--mut)}.sh a{font-weight:700;color:var(--sky);display:flex;gap:6px;align-items:center;white-space:nowrap}
/* новини */
.ng{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.nc{background:#fff;border:1px solid var(--line);border-radius:22px;overflow:hidden;display:flex;flex-direction:column;transition:.2s}.nc:hover{box-shadow:0 14px 30px rgba(31,78,121,.1);transform:translateY(-3px)}
.nc .im{aspect-ratio:4/3;overflow:hidden;background:var(--sky2)}.nc .im img{width:100%;height:100%;object-fit:cover}
.nc .ph{aspect-ratio:4/3;display:flex;flex-direction:column;justify-content:space-between;padding:22px;background:var(--sky);color:#fff;position:relative;overflow:hidden}.nc .ph.a2{background:var(--field)}.nc .ph.a3{background:#9a6b00}.nc .ph b{font:800 76px/0.9 "Inter Tight";color:var(--wheat)}.nc .ph span{font:700 18px Inter;opacity:.9}.nc .ph svg{position:absolute;right:-14px;bottom:-14px;width:150px;height:150px;stroke-width:1;opacity:.22}
.nc .bd{padding:18px 20px 22px;display:flex;flex-direction:column;gap:10px;flex:1}.meta{display:flex;gap:10px;align-items:center;font-size:13.5px;color:var(--mut)}
.tag{font-weight:700;font-size:12px;padding:3px 10px;border-radius:99px}.t-Учням{background:var(--wheat2);color:#8a5d00}.t-Батькам{background:var(--sky2);color:var(--sky)}.t-Громаді{background:var(--field2);color:var(--field)}
.nc p{margin:0;color:var(--ink2);font-size:15px}
/* цифри */
.nums{background:var(--sky);color:#fff;border-radius:28px;display:grid;grid-template-columns:repeat(4,1fr);padding:34px 20px}.nums div{text-align:center;padding:6px 10px;border-right:1px solid rgba(255,255,255,.18)}.nums div:last-child{border:0}.nums b{display:block;font:800 clamp(34px,4vw,52px)/1 "Inter Tight";color:var(--wheat)}.nums span{font-size:14.5px;opacity:.9}
/* цінності */
.vals{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.val{background:#fff;border:1px solid var(--line);border-radius:24px;padding:28px;display:grid;grid-template-columns:1fr 130px;gap:20px;align-items:center}
.val h3{font-size:24px;margin-bottom:8px}.val p{margin:0 0 12px;color:var(--ink2);font-size:15.5px}.val a{font-weight:700;color:var(--sky);font-size:14.5px}.val img{width:130px;height:130px;border-radius:50%;object-fit:cover;border:5px solid var(--wheat2)}
/* ступені */
.lv{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.lvc{border-radius:24px;padding:28px;color:var(--ink)}.lvc .n{font:800 15px Inter;opacity:.7}.lvc h3{font-size:26px;margin:6px 0 10px}.lvc p{margin:0;font-size:15.5px;color:var(--ink2)}
/* чому ми */
.why{display:grid;grid-template-columns:1fr 1.3fr;gap:40px;background:#fff;border:1px solid var(--line);border-radius:30px;padding:44px}
.wl{list-style:none;margin:0;padding:0;display:grid;gap:14px}.wl li{display:flex;gap:14px;align-items:flex-start}.wl .ic{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;flex:none}.wl b{display:block}.wl span{color:var(--ink2);font-size:15px}
/* галерея */
.gal{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.gal button{border:0;padding:0;aspect-ratio:4/3;border-radius:14px;overflow:hidden;cursor:zoom-in}.gal img{width:100%;height:100%;object-fit:cover;transition:.4s}.gal button:hover img{transform:scale(1.05)}.gal .big{grid-column:span 2;grid-row:span 2}
/* довіра */
.trust{display:grid;grid-template-columns:1.1fr 1fr;gap:30px;align-items:center;background:var(--wheat2);border-radius:30px;padding:44px}
.chk{display:grid;grid-template-columns:1fr 1fr;gap:8px}.chk a{background:#fff;border-radius:12px;padding:10px 12px;font-size:14px;font-weight:600;display:flex;gap:8px;align-items:center}.chk svg{color:var(--field);width:18px;height:18px}
/* внутрішні */
.crumbs{font-size:14px;color:var(--mut);padding:30px 0 0}.crumbs a:hover{color:var(--sky)}
.pg h1{font-size:clamp(34px,4.6vw,56px);margin:14px 0 16px}.lead{font-size:19px;color:var(--ink2);max-width:760px;margin:0}
.nl a{display:grid;grid-template-columns:140px 1fr;gap:24px;padding:22px 0;border-bottom:1px solid var(--line)}.nl a:hover h3{color:var(--sky)}.nl time{color:var(--mut)}.nl p{margin:6px 0 0;color:var(--ink2);font-size:15.5px}
.article{max-width:760px}.article p{margin:0 0 16px;font-size:18px}.article .im{border-radius:18px;overflow:hidden;margin:24px 0;max-width:420px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:48px}
.tl{list-style:none;margin:0;padding:0}.tl li{display:grid;grid-template-columns:86px 1fr;gap:16px;padding:16px 0;border-bottom:1px solid var(--line)}.tl b{font:800 20px "Inter Tight";color:var(--sky)}
.pp{display:flex;gap:16px;align-items:center;padding:18px;background:#fff;border:1px solid var(--line);border-radius:16px;margin-bottom:12px}.pp .av{width:54px;height:54px;border-radius:50%;background:var(--wheat2);display:grid;place-items:center;font-weight:800;color:#8a5d00;flex:none}.pp small{display:block;color:var(--mut);font-size:14px}
.txt p{margin:0 0 14px;color:var(--ink2)}
.docs{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden}.docs a{display:flex;gap:14px;align-items:center;padding:15px 20px;border-bottom:1px solid var(--line);font-weight:600}.docs a:last-child{border:0}.docs a:hover{background:var(--bg);color:var(--sky)}.docs .ok{color:var(--field)}.docs .go{margin-left:auto;color:var(--mut)}.docs small{display:block;font-weight:400;color:var(--mut);font-size:13px}
.search{width:100%;max-width:520px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;font:500 16px Inter;background:#fff;margin-bottom:18px}
.ci{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden}.ci div{display:flex;gap:16px;padding:20px 22px;border-bottom:1px solid var(--line)}.ci div:last-child{border:0}.ci small{display:block;color:var(--mut);font-size:13.5px}.ci b{font-weight:700}
.map{border:1px solid var(--line);border-radius:20px;overflow:hidden;min-height:360px}.map iframe{width:100%;height:100%;min-height:360px;border:0}
/* футер */
footer{background:#13283d;color:#b9c4d2;margin-top:80px;font-size:14.5px}footer .w{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:40px;padding-top:52px;padding-bottom:40px}footer b{color:#fff;display:block;margin-bottom:10px;font-size:15.5px}footer a{display:block;padding:3px 0}footer a:hover{color:#fff}
.fb{border-top:1px solid #23415f}.fb .w{display:flex;justify-content:space-between;padding:16px 24px;grid-template-columns:none;flex-wrap:wrap;gap:8px}
.bnav{display:none}
.lb{position:fixed;inset:0;background:rgba(19,40,61,.93);display:none;place-items:center;z-index:60;cursor:zoom-out}.lb.on{display:grid}.lb img{max-width:92vw;max-height:88vh;border-radius:12px;min-width:min(90vw,640px)}
/* доступність */
.a11y{background:#fff;border-bottom:1px solid var(--line);font-size:15px}.a11y .w{display:flex;flex-wrap:wrap;gap:12px 28px;padding-top:14px;padding-bottom:14px;align-items:center}
.ag{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.ag span{font-weight:700;margin-right:4px}.ag button{min-width:42px;height:40px;padding:0 12px;border:1px solid #555;background:#fff;color:#000;border-radius:10px;font:700 15px Inter;cursor:pointer}.ag button[aria-pressed=true]{outline:3px solid var(--sky);outline-offset:1px}
.sw1{background:#fff!important;color:#000!important}.sw2{background:#000!important;color:#fff!important}.sw3{background:#9dd1ff!important;color:#063462!important}
html.fs2 body{font-size:20px}html.fs3 body{font-size:23px}html.fs2 .lead,html.fs3 .lead{font-size:1.15em}
html.cs1{--bg:#fff;--card:#fff;--ink:#000;--ink2:#000;--mut:#000;--line:#000;--sky:#000;--sky2:#fff;--wheat2:#fff;--field2:#fff;--field:#000}
html.cs2{--bg:#000;--card:#000;--ink:#fff;--ink2:#fff;--mut:#fff;--line:#fff;--sky:#ff0;--sky2:#000;--wheat:#ff0;--wheat2:#000;--field:#ff0;--field2:#000}html.cs2 .tile,html.cs2 .nc,html.cs2 .val,html.cs2 .why,html.cs2 .docs,html.cs2 .ci,html.cs2 .btn,html.cs2 .hbtn,html.cs2 header.top,html.cs2 .pp,html.cs2 .chk a,html.cs2 .search,html.cs2 .fr{background:#000!important;color:#fff!important;border-color:#fff!important}html.cs2 .btn.p,html.cs2 .hbtn.j{background:#ff0!important;color:#000!important}html.cs2 .nums{background:#000;border:2px solid #fff}
html.cs3{--bg:#9dd1ff;--card:#9dd1ff;--ink:#063462;--ink2:#063462;--mut:#063462;--line:#063462;--sky:#063462;--sky2:#9dd1ff;--wheat2:#9dd1ff;--field2:#9dd1ff;--field:#063462}html.cs3 .tile,html.cs3 .nc,html.cs3 .val,html.cs3 .why,html.cs3 .docs,html.cs3 .ci,html.cs3 .btn,html.cs3 header.top,html.cs3 .pp,html.cs3 .chk a,html.cs3 .search,html.cs3 .hbtn{background:#9dd1ff!important}
html.cs1 img,html.cs2 img,html.cs3 img{filter:grayscale(1)}
html.ls1 body{letter-spacing:.08em;word-spacing:.16em;line-height:1.95}
html.im1 main img,html.im1 .frames,html.im1 .gal,html.im1 .nc .im,html.im1 .val img{display:none!important}
html.ln1 main a,html.ln1 footer a{text-decoration:underline!important;text-underline-offset:3px}
html.an1 *{animation:none!important;transition:none!important;scroll-behavior:auto!important}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
@media(max-width:1000px){.hero,.two,.why,.trust{grid-template-columns:1fr}.frames{height:360px;max-width:560px}.tiles{grid-template-columns:1fr 1fr}.ng{grid-template-columns:1fr 1fr}.vals{grid-template-columns:1fr}.lv{grid-template-columns:1fr}nav.mn{display:none}.burger{display:inline-flex}nav.mn.open{display:flex;flex-direction:column;position:absolute;top:76px;left:0;right:0;background:var(--bg);padding:8px 16px 16px;border-bottom:1px solid var(--line)}.gal{grid-template-columns:repeat(3,1fr)}footer .w{grid-template-columns:1fr}.hd .hbtn.j span{display:none}}
@media(max-width:620px){body{font-size:16px;padding-bottom:70px}.w{padding:0 16px}.hero{padding:34px 0 24px}.frames{height:270px}.fr1,.fr2,.fr3{width:200px;height:150px;border-width:5px}.fr3{left:18%}.badge{padding:10px 14px}.badge b{font-size:22px}.tiles{grid-template-columns:1fr}.tile{padding:14px 16px}.ng{grid-template-columns:1fr}.nums{grid-template-columns:1fr 1fr;row-gap:22px}.nums div:nth-child(2){border:0}.val{grid-template-columns:1fr 84px;padding:22px}.val img{width:84px;height:84px}.why,.trust{padding:26px}.chk{grid-template-columns:1fr}.gal{grid-template-columns:repeat(2,1fr)}.gal .big{grid-column:span 2;grid-row:auto}section.s{padding:48px 0}.nl a{grid-template-columns:1fr;gap:4px}.status .w{gap:8px 10px;font-size:14px}.status .a11y-open{margin-left:0}.status #stDemo{display:none}.hd .hbtn.j{padding:0 12px}.brand small{display:none}
.bnav{display:grid;grid-template-columns:repeat(4,1fr);position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--line);z-index:40;padding:6px 0 max(6px,env(safe-area-inset-bottom))}.bnav a{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11.5px;font-weight:600;color:var(--ink2)}.bnav a.on{color:var(--sky)}}
`;

const ICONS = {
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', arr: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  food: '<path d="M4 11h16a8 8 0 0 1-16 0Z"/><path d="M8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>', bag: '<rect x="5" y="7" width="14" height="14" rx="3"/><path d="M9 7a3 3 0 0 1 6 0M9 13h6"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>', cap: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  heart: '<path d="M12 20s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.5-8 11-8 11Z"/>', laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>', home: '<path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/>',
  news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.4.6 4 2.6 4 6"/>',
  bunker: '<path d="M3 20h18M5 20V10l7-5 7 5v10"/><path d="M9 20v-5h6v5"/>', book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19V5"/>',
  check: '<path d="m5 12 4 4 10-10"/>', bus: '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M8 20v-3M16 20v-3"/>', star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
  dove: '<path d="M4 14c3 0 5-2 6-5 1 3 4 5 8 5-2 3-5 5-9 5-2 0-4-1-5-2"/><path d="M14 6c1-2 3-3 5-3"/>', run: '<circle cx="14" cy="4" r="2"/><path d="m8 21 3-6 3 2v4M6 12l3-3 4 1 3 4 3 1"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', road: '<path d="M7 21 10 3M17 21 14 3M12 6v2M12 11v2M12 16v2"/>'
};
const icon = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const sym = Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');

const html = `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#1f4e79">
<title>${S.short} - концепт нового сайту</title>
<meta name="description" content="Концепт-макет нового сайту ${S.full}. Не є офіційним сайтом закладу.">
<meta property="og:title" content="${S.short} - концепт нового сайту"><meta property="og:image" content="${S.photos[0]}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@700;800&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<a class="skip" href="#app">Перейти до змісту</a>
<div class="concept">Концепт-макет нового сайту для обговорення · не є офіційним сайтом закладу · офіційний сайт: <a href="${S.oldSite}" target="_blank" rel="noopener">${S.oldSite.replace('http://', '')}</a></div>
<div class="status" id="status" role="status"><div class="w"><span class="dot"></span><span id="stText"></span><button id="stDemo" title="Демонстрація: школа перемикає режим однією кнопкою">змінити режим (демо)</button><button class="a11y-open" id="a11yBtn" aria-expanded="false" aria-controls="a11y">${icon('eye')}<span>Людям з порушенням зору</span></button></div></div>
<div class="a11y" id="a11y" role="region" aria-label="Налаштування доступності" hidden><div class="w">
  <div class="ag"><span>Шрифт</span><button data-k="fs" data-v="1" aria-label="Звичайний шрифт">A</button><button data-k="fs" data-v="2" aria-label="Великий шрифт" style="font-size:19px">A</button><button data-k="fs" data-v="3" aria-label="Дуже великий шрифт" style="font-size:23px">A</button></div>
  <div class="ag"><span>Кольори</span><button data-k="cs" data-v="0" aria-label="Звичайні кольори">Ц</button><button data-k="cs" data-v="1" class="sw1" aria-label="Чорне на білому">Ц</button><button data-k="cs" data-v="2" class="sw2" aria-label="Біле на чорному">Ц</button><button data-k="cs" data-v="3" class="sw3" aria-label="Синє на блакитному">Ц</button></div>
  <div class="ag"><span>Інтервал</span><button data-k="ls" data-v="0">Звичайний</button><button data-k="ls" data-v="1">Широкий</button></div>
  <div class="ag"><span>Зображення</span><button data-k="im" data-v="0">Показати</button><button data-k="im" data-v="1">Сховати</button></div>
  <div class="ag"><button data-k="an" data-v="tog">Зупинити анімацію</button><button data-k="ln" data-v="tog">Підкреслити посилання</button><button id="a11yReset">Скинути</button><button id="a11yClose" aria-label="Закрити панель">✕</button></div>
</div></div>
<header class="top"><div class="w hd">
  <a class="brand" href="#/" aria-label="${S.short} - на головну"><svg width="42" height="48" viewBox="0 0 42 48" aria-hidden="true"><path d="M21 1 2 7v15c0 12 8 21 19 25 11-4 19-13 19-25V7L21 1Z" fill="#1f4e79"/><path d="M6 30c4 7 9 11 15 13 6-2 11-6 15-13H6Z" fill="#f2c14e"/><path d="M11 19c3-3 7-3 10 0 3-3 7-3 10 0" stroke="#f2c14e" stroke-width="2.4" fill="none" stroke-linecap="round"/><text x="21" y="15" text-anchor="middle" font-family="Inter Tight,Inter" font-weight="800" font-size="10" fill="#fff">${S.mark}</text></svg><div><b>${S.short}</b><small>${S.owner}</small></div></a>
  <nav class="mn" id="mn" aria-label="Головне меню"><a href="#/about">Про ліцей</a><a href="#/news">Новини</a><a href="#/parents">Батькам і учням</a><a href="#/st30">Прозорість</a><a href="#/contacts">Контакти</a></nav>
  <a class="hbtn j" href="${S.journal}" target="_blank" rel="noopener">${icon('book')}<span>Електронний журнал</span></a>
  <button class="hbtn burger" aria-label="Меню" onclick="mn.classList.toggle('open')">${icon('menu')}</button>
</div></header>
<main id="app" tabindex="-1"></main>
<footer><div class="w">
  <div><b>${S.full}</b>${S.address}<br><a href="tel:${S.phoneTel}">${S.phone}</a><a href="mailto:${S.email}">${S.email}</a><br>Засновник: ${S.owner}</div>
  <div><b>Розділи</b><a href="#/about">Про ліцей</a><a href="#/news">Новини</a><a href="#/parents">Батькам і учням</a><a href="#/st30">Прозорість</a><a href="#/contacts">Контакти</a></div>
  <div><b>Корисне</b><a href="${S.journal}" target="_blank" rel="noopener">Електронний журнал «Нові знання»</a><a href="https://mon.gov.ua" target="_blank" rel="noopener">МОН України</a><a href="https://sqe.gov.ua" target="_blank" rel="noopener">Державна служба якості освіти</a><a href="https://testportal.gov.ua" target="_blank" rel="noopener">УЦОЯО - НМТ</a></div>
</div><div class="fb"><div class="w"><span>Концепт-макет · не є офіційним сайтом закладу</span><span>Розробка: Микола Несвітій</span></div></div></footer>
<nav class="bnav" aria-label="Швидке меню"><a href="#/">${icon('home')}Головна</a><a href="#/news">${icon('news')}Новини</a><a href="#/parents">${icon('users')}Батькам</a><a href="#/contacts">${icon('phone')}Контакти</a></nav>
<div class="lb" id="lb" onclick="this.classList.remove('on')"><img id="lbi" alt=""></div>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${sym}</defs></svg>
<script>
const D=${JSON.stringify(DATA)};
const S=D.S,ic=n=>'<svg class="i" aria-hidden="true"><use href="#i-'+n+'"/></svg>',esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const M=['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
const dt=d=>{const[a,b,c]=d.split('.');return +a+' '+M[+b-1]+' '+c};
const crumbs=(...x)=>'<div class="crumbs"><a href="#/">Головна</a>'+x.map(t=>' / '+t).join('')+'</div>';
const NI={'Учням':'run','Батькам':'road','Громаді':'flag'};
const nCard=n=>'<a class="nc" href="#/news/'+n.id+'">'+(n.img?'<div class="im"><img src="'+n.img+'" alt="" loading="lazy"></div>':'<div class="ph '+({Учням:'a3',Батькам:'',Громаді:'a2'}[n.aud])+'"><div><b>'+(+n.date.split('.')[0])+'</b><br><span>'+M[+n.date.split('.')[1]-1]+'</span></div>'+ic(/мир/i.test(n.title)?'dove':NI[n.aud])+'</div>')+'<div class="bd"><div class="meta"><span class="tag t-'+n.aud+'">'+n.aud+'</span>'+dt(n.date)+'</div><h3>'+esc(n.title)+'</h3><p>'+esc(n.lead.slice(0,120))+'…</p></div></a>';
const TILES=[['clock','c1','Режим і дзвінки','Початок уроків, перерви','#/parents'],['cal','c2','Канікули і календар','Структура навчального року','#/parents'],['food','c3','Харчування','Меню та організація','#/parents'],['bunker','c4','Укриття','Дії під час тривоги','#/parents'],['bag','c2','Вступ до 1 класу','Документи та зарахування','#/parents'],['heart','c4','Психолог','Підтримка дітей і батьків','#/parents'],['book','c1','Електронний журнал','Оцінки та домашні завдання',S.journal],['doc','c3','Прозорість','Документи за ст. 30','#/st30']];
const tile=([i,c,t,s,h])=>'<a class="tile" href="'+h+'"'+(h.startsWith('http')?' target="_blank" rel="noopener"':'')+'><div class="ic '+c+'">'+ic(i)+'</div><div><b>'+t+'</b><small>'+s+'</small></div></a>';
const P={
'':()=>'<div class="w"><section class="hero"><div><span class="kick">'+ic('pin')+S.place+'</span><h1>'+S.short+'</h1><p class="rot" aria-live="polite">Наш ліцей - це де <em id="rot">'+S.rot[0]+'</em></p><div class="btns"><a class="btn p" href="#/parents">Вступ 2026/2027 '+ic('arr')+'</a><a class="btn" href="#/contacts">Контакти</a></div></div>'
 +'<div class="frames"><svg class="orn" viewBox="0 0 100 100" aria-hidden="true"><g fill="#c8102e" opacity=".55"><rect x="45" y="5" width="10" height="10"/><rect x="35" y="15" width="10" height="10"/><rect x="55" y="15" width="10" height="10"/><rect x="25" y="25" width="10" height="10"/><rect x="65" y="25" width="10" height="10"/><rect x="45" y="25" width="10" height="10"/><rect x="35" y="35" width="10" height="10"/><rect x="55" y="35" width="10" height="10"/><rect x="45" y="45" width="10" height="10"/></g></svg><div class="fr fr1"><img src="'+S.photos[0]+'" alt="Учні ліцею з прапором України"></div><div class="fr fr2"><img src="'+S.photos[1]+'" alt="Першокласники на святі"></div><div class="fr fr3"><img src="'+S.photos[8]+'" alt="Діти у вишиванках"></div><div class="badge"><b>з 1912</b>року вчимо<br>над Берестовою</div></div></section>'
 +'<div class="tiles">'+TILES.map(tile).join('')+'</div></div>'
 +'<div class="w"><section class="s"><div class="sh"><div><h2>Новини</h2><p>Що відбувається в ліцеї цього тижня</p></div><a href="#/news">Усі новини '+ic('arr')+'</a></div><div class="ng">'+D.news.slice(0,3).map(nCard).join('')+'</div></section></div>'
 +'<div class="w"><div class="nums">'+S.stats.map(([b,s])=>'<div><b>'+b+'</b><span>'+s+'</span></div>').join('')+'</div></div>'
 +'<div class="w"><section class="s"><div class="sh"><div><h2>Наш ліцей - це…</h2><p>Не слова, а те, що ми справді робимо</p></div></div><div class="vals">'+S.values.map(([t,p,nid,img])=>'<div class="val"><div><h3>'+t+'</h3><p>'+p+'</p><a href="#/news/'+nid+'">Як це було '+ic('arr')+'</a></div><img src="'+img+'" alt="" loading="lazy"></div>').join('')+'</div></section></div>'
 +'<div class="w"><section class="s" style="padding-top:0"><div class="sh"><div><h2>Ступені навчання</h2><p>Від першого дзвоника до випускного - в одній школі</p></div></div><div class="lv">'+S.levels.map(([n,t,p,bg])=>'<div class="lvc" style="background:'+bg+'"><div class="n">'+n+'</div><h3>'+t+'</h3><p>'+p+'</p></div>').join('')+'</div></section></div>'
 +'<div class="w"><div class="why"><div><h2>Чому обирають нас</h2><p style="color:var(--ink2);margin:14px 0 22px">Ліцей має вільні місця в усіх класах. Приходьте познайомитися - покажемо школу і відповімо на питання.</p><a class="btn p" href="tel:'+S.phoneTel+'">'+ic('phone')+'Записатися на знайомство</a></div><ul class="wl">'+S.why.map(([i,c,b,s])=>'<li><div class="ic '+c+'">'+ic(i)+'</div><div><b>'+b+'</b><span>'+s+'</span></div></li>').join('')+'</ul></div></div>'
 +'<div class="w"><section class="s"><div class="sh"><div><h2>Життя ліцею</h2><p>Свята, походи, перший дзвоник</p></div><a href="#/about">Більше фото '+ic('arr')+'</a></div><div class="gal">'+S.photos.slice(0,7).map((p,i)=>'<button class="'+(i===0?'big':'')+'" data-src="'+p+'" aria-label="Відкрити фото"><img src="'+p+'" alt="Фото з життя ліцею" loading="lazy"></button>').join('')+'</div></section></div>'
 +'<div class="w"><div class="trust"><div><h2>Відкритість</h2><p style="color:var(--ink2);margin:14px 0 22px">Усі документи за статтею 30 Закону «Про освіту» зібрано в одному розділі, з пошуком і датою оновлення - для батьків і для перевірок.</p><a class="btn p" href="#/st30">'+ic('doc')+'Усі документи ('+D.st30.length+')</a></div><div class="chk">'+D.st30.slice(0,8).map(d=>'<a href="#/st30">'+ic('check')+esc(d.t)+'</a>').join('')+'</div></div></div>',
'about':()=>'<div class="w pg">'+crumbs('Про ліцей')+'<h1>Про ліцей</h1><p class="lead">'+S.lead2+'</p><section class="s" style="padding-top:44px"><div class="two"><div><h2 style="margin-bottom:16px">Історія</h2><ul class="tl">'+S.timeline.map(([y,t])=>'<li><b>'+y+'</b><span>'+t+'</span></li>').join('')+'</ul></div><div><h2 style="margin-bottom:16px">Адміністрація</h2>'+S.team.map(([n,r])=>'<div class="pp"><div class="av">'+n.split(' ').slice(0,2).map(w=>w[0]).reverse().join('')+'</div><div><b>'+n+'</b><small>'+r+'</small></div></div>').join('')+'</div></div></section><section class="s" style="padding-top:0"><h2 style="margin-bottom:16px">Про заклад</h2><div class="txt">'+D.about.split('\\n').slice(0,14).map(l=>'<p>'+esc(l)+'</p>').join('')+'</div></section><section class="s" style="padding-top:0"><h2 style="margin-bottom:16px">Фотогалерея</h2><div class="gal">'+S.photos.map(p=>'<button data-src="'+p+'" aria-label="Відкрити фото"><img src="'+p+'" alt="Фото з життя ліцею" loading="lazy"></button>').join('')+'</div></section></div>',
'news':()=>'<div class="w pg">'+crumbs('Новини')+'<h1>Новини</h1><div class="nl">'+D.news.map(n=>'<a href="#/news/'+n.id+'"><time>'+dt(n.date)+'</time><div><span class="tag t-'+n.aud+'">'+n.aud+'</span><h3 style="margin-top:6px">'+esc(n.title)+'</h3><p>'+esc(n.lead.slice(0,170))+'…</p></div></a>').join('')+'</div></div>',
'news/':id=>{const n=D.news.find(x=>x.id==id);if(!n)return P.news();return '<div class="w pg">'+crumbs('<a href="#/news">Новини</a>',esc(n.title.slice(0,40)))+'<article class="article"><h1>'+esc(n.title)+'</h1><div class="meta"><span class="tag t-'+n.aud+'">'+n.aud+'</span>'+dt(n.date)+'</div>'+(n.img?'<div class="im"><img src="'+n.img+'" alt=""></div>':'<div style="height:22px"></div>')+n.body.split('\\n').map(l=>'<p>'+esc(l)+'</p>').join('')+'<a class="btn" href="#/news">До всіх новин</a></article></div>'},
'parents':()=>'<div class="w pg">'+crumbs('Батькам і учням')+'<h1>Батькам і учням</h1><p class="lead">Найпотрібніше для родин учнів - в один дотик.</p><section class="s" style="padding-top:36px"><div class="tiles">'+S.parents.map(([i,c,t,s,h])=>tile([i,c,t,s,S.oldSite+h])).join('').replace(/href="http/g,'target="_blank" rel="noopener" href="http')+'</div></section></div>',
'st30':()=>'<div class="w pg">'+crumbs('Прозорість')+'<h1>Прозорість та інформаційна відкритість</h1><p class="lead">Документи закладу відповідно до статті 30 Закону України «Про освіту». Біля кожного документа - дата останнього оновлення.</p><section class="s" style="padding-top:34px"><input class="search" id="q" placeholder="Знайти документ: статут, кошторис, ліцензія…" aria-label="Пошук документа"><div class="docs">'+D.st30.map(d=>'<a href="'+d.h+'" target="_blank" rel="noopener"><span class="ok">'+ic('check')+'</span><span>'+esc(d.t)+'<small>розділ відкритий · дата оновлення з’явиться після перенесення</small></span>'+'<span class="go">'+ic('arr')+'</span></a>').join('')+'</div></section></div>',
'contacts':()=>'<div class="w pg">'+crumbs('Контакти')+'<h1>Контакти</h1><section class="s" style="padding-top:28px"><div class="two"><div class="ci"><div>'+ic('pin')+'<span><small>Адреса</small><b>'+S.address+'</b></span></div><div>'+ic('phone')+'<span><small>Телефон</small><b><a href="tel:'+S.phoneTel+'">'+S.phone+'</a></b></span></div><div>'+ic('mail')+'<span><small>Електронна пошта</small><b><a href="mailto:'+S.email+'">'+S.email+'</a></b></span></div><div>'+ic('users')+'<span><small>Директор</small><b>'+S.team[0][0]+'</b></span></div></div><div class="map"><iframe title="Карта: '+S.short+'" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox='+S.bbox+'&layer=mapnik&marker='+S.lat+','+S.lon+'"></iframe></div></div></section></div>'
};
let rotT;
function route(){const h=location.hash.replace(/^#\\/?/,'');const m=h.match(/^news\\/(\\d+)/);app.innerHTML=m?P['news/'](m[1]):(P[h]||P[''])();const sec=h.split('/')[0];document.querySelectorAll('nav.mn a,.bnav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#/'+sec));mn.classList.remove('open');window.scrollTo(0,0);if(location.hash&&location.hash!=='#/')app.focus({preventScroll:true});
document.querySelectorAll('.gal button').forEach(b=>b.onclick=()=>{lbi.src=b.dataset.src;lb.classList.add('on')});const q=document.getElementById('q');if(q)q.oninput=()=>document.querySelectorAll('.docs a').forEach(a=>a.style.display=a.innerText.toLowerCase().includes(q.value.toLowerCase())?'':'none');
clearInterval(rotT);const r=document.getElementById('rot');if(r){let i=0;rotT=setInterval(()=>{if(document.documentElement.classList.contains('an1'))return;i=(i+1)%S.rot.length;r.textContent=S.rot[i]},2800)}}
window.onhashchange=route;route();
const ST=[['','Сьогодні','навчання очно, за звичайним розкладом'],['dist','Сьогодні','дистанційне навчання - посилання на уроки в електронному журналі'],['alarm','Повітряна тривога','учні та працівники в укритті, уроки тривають в укритті']];let si=0;
const now=new Date(),dd=now.getDate()+' '+M[now.getMonth()];
function st(){status.className='status '+ST[si][0];stText.innerHTML='<b>'+ST[si][1]+(si<2?', '+dd:'')+':</b> '+ST[si][2]}st();stDemo.onclick=()=>{si=(si+1)%ST.length;st()};
const A={fs:'1',cs:'0',ls:'0',im:'0',ln:'0',an:'0'};try{Object.assign(A,JSON.parse(localStorage.getItem('a11y')||'{}'))}catch(e){}
function applyA(){document.documentElement.className=['fs'+A.fs,'cs'+A.cs,'ls'+A.ls,'im'+A.im,'ln'+A.ln,'an'+A.an].join(' ');document.querySelectorAll('.ag button[data-k]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v==='tog'?String(A[b.dataset.k]==='1'):String(A[b.dataset.k]===b.dataset.v)));try{localStorage.setItem('a11y',JSON.stringify(A))}catch(e){}}
document.querySelectorAll('.ag button[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;A[k]=b.dataset.v==='tog'?(A[k]==='1'?'0':'1'):b.dataset.v;applyA()});
a11yReset.onclick=()=>{Object.assign(A,{fs:'1',cs:'0',ls:'0',im:'0',ln:'0',an:'0'});applyA()};
const tg=o=>{a11y.hidden=!o;a11yBtn.setAttribute('aria-expanded',String(o));if(o)a11y.querySelector('button').focus()};a11yBtn.onclick=()=>tg(a11y.hidden);a11yClose.onclick=()=>{tg(false);a11yBtn.focus()};applyA();
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
</script>
</body></html>`;
writeFileSync(D + 'index.html', html);
writeFileSync(D + 'manifest.webmanifest', JSON.stringify({ name: S.short, short_name: S.short.split(' ')[0], start_url: './', display: 'standalone', background_color: '#f7f4ec', theme_color: '#1f4e79', lang: 'uk', icons: [{ src: S.photos[0], sizes: '290x217', type: 'image/jpeg' }] }, null, 1));
writeFileSync(D + 'sw.js', `const C='school-v3';const F=['./','index.html','manifest.webmanifest',${S.photos.map(p => `'${p}'`).join(',')}];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});`);
console.log('v3 index.html', html.length);
