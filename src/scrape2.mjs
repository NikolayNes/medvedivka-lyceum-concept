import { createRequire } from 'node:module'; import { writeFileSync, mkdirSync } from 'node:fs';
const require=createRequire('/Users/nikolay/Desktop/Projects/playwright_project/package.json'); const { chromium }=require('playwright');
const U='http://medvedivka-lyceum.kh.sch.in.ua', D=decodeURIComponent(new URL('..',import.meta.url).pathname);
const b=await chromium.launch(); const p=await b.newPage();
const col=async u=>{await p.goto(U+u,{waitUntil:'domcontentloaded',timeout:40000});return await p.evaluate(()=>{const c=document.querySelector('.content_column')||document.body;return {text:c.innerText,imgs:[...c.querySelectorAll('img')].map(i=>i.src).filter(s=>/\/Files\//.test(s)&&!/slider/.test(s)),links:[...c.querySelectorAll('a')].map(a=>({t:a.innerText.trim(),h:a.href}))}})};
const out={};
for(const [k,u] of Object.entries({contacts:'/kontakti/',about:'/pro_shkolu/',admin:'/pro_shkolu/administraciya_liceyu/',bells:'/uchnyam/rezhim_roboti_rozklad_dzvinkiv/',food:'/organizaciya_osvitnjogo_procesu/organizaciya_harchuvannya/',museum:'/organizaciya_osvitnjogo_procesu/muzej/',network:'/pro_shkolu/merezha_zakladu_osviti/',first:'/uchnyam/batjkam_majbutnih_pershoklasnikiv/',lic:'/prozoristj_ta_informacijna_vidkritistj_zakladu_osviti_st_30/licenzovanij_obsyag_ta_faktichna_kiljkistj_osib_yaki_navchayutjsya_u_zakladi/'})){try{const r=await col(u);out[k]={text:r.text.replace(/Кiлькiсть переглядiв[\s\S]*/,'').trim().slice(0,3000),imgs:r.imgs.slice(0,6)}}catch(e){out[k]={text:'',imgs:[]}}}
const nl=await col('/news/'); const ids=[...new Set(nl.links.filter(l=>/\/news\/id\/\d+/.test(l.h)).map(l=>l.h))].slice(0,9);
out.news=[];
for(const h of ids){const r=await col(h.replace(U,''));const lines=r.text.split('\n').map(s=>s.trim()).filter(Boolean);const di=lines.findIndex(l=>/^\d{2}\.\d{2}\.20\d{2}/.test(l));out.news.push({url:h,date:(lines[di]||'').slice(0,10),title:lines.find((l,i)=>i>0&&!/Ви знаходитесь|Головна|Новини/.test(l)&&l.length>8)||'',text:r.text.replace(/Кiлькiсть переглядiв[\s\S]*/,'').trim().slice(0,1800),imgs:r.imgs.slice(0,4)})}
mkdirSync(D+'img/news',{recursive:true}); let n=0;
for(const x of out.news){x.local=[];for(const s of x.imgs){try{const r=await fetch(s);const buf=Buffer.from(await r.arrayBuffer());if(buf.length<20000)continue;const f=`img/news/n${++n}.jpg`;writeFileSync(D+f,buf);x.local.push(f)}catch{}}}
writeFileSync(D+'src/data.json',JSON.stringify(out,null,1)); await b.close();
for(const x of out.news)console.log(x.date,'|',x.title.slice(0,80),'|',x.local.length);
for(const k of ['contacts','admin','bells','about','network','lic'])console.log('=='+k,out[k].text.slice(0,600).replace(/\n+/g,' / '));
