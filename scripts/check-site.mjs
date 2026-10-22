import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const course=JSON.parse(await fs.readFile(root+'/src/course.json','utf8'));
const data=JSON.parse(await fs.readFile(root+'/src/content.json','utf8'));
const pages=new Map();
for(const name of ['index.html','practice.html','deep.html','poster.html','self-review.html','courses.html']){
 const html=await fs.readFile(dist+'/'+name,'utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,name+': duplicate IDs');assert.ok(!html.includes('{{'));
 pages.set(name,{html,ids:new Set(ids)});
}
let links=0;
for(const [name,{html}] of pages)for(const m of html.matchAll(/\b(?:href|src|data-src)="([^"]+)"/g)){
 const u=new URL(m[1].replaceAll('&amp;','&'),'https://course.invalid/'+name);if(u.origin!=='https://course.invalid')continue;
 if(u.pathname.startsWith('/courses/')){assert.equal(course.id,'qwen-office-basics');assert.equal(u.pathname,'/courses/qwen-office-advanced/index.html');assert.equal(u.hash,'#slide-cover');continue;}
 const f=decodeURIComponent(u.pathname).slice(1)||'index.html';assert.ok(!f.includes('..'));assert.ok((await fs.stat(dist+'/'+f)).isFile(),name+': '+f);
 if(u.hash)assert.ok(pages.get(f)?.ids.has(decodeURIComponent(u.hash.slice(1))),f+u.hash);links++;
}
const html=pages.get('index.html').html;
assert.equal((html.match(/class="lesson(?: active)?"/g)||[]).length,data.slides.length+2);
assert.equal((html.match(/class="fullscreen-preview"/g)||[]).length,18);
assert.equal((html.match(/<aside class="explanation"/g)||[]).length,18);
assert.ok(!html.includes('deck-scale.js'));
assert.ok(pages.get('practice.html').ids.has('start'));assert.ok(pages.get('practice.html').ids.has('prepare'));assert.ok(pages.get('practice.html').ids.has('done'));
assert.ok(pages.get('deep.html').html.includes(`data-page-id="${course.id}:deep"`));
assert.ok(course.format.startsWith('18 页'));assert.equal(course.repository,'zhangjian0410/'+JSON.parse(await fs.readFile(root+'/package.json','utf8')).name);
for(const kind of ['pdf','pptx'])assert.ok((await fs.stat(dist+'/downloads/'+course.id+'.'+kind)).size>1000);
console.log(`PASS ${course.id}:18slides,18notes,${pages.size}pages,${links}local links and previews`);

// Usability contract: practical teaching pages enter the actual task directly.
const examples={"slide-cap1":[4,"练习：群聊整理成周报"],"slide-cap2":[2,"练习：生成第一份 PPT"],"slide-cap6":[5,"练习：把好指令存为技能"],"slide-method":[2,"练习：用四步法做 PPT"],"slide-demo":[2,"练习：生成第一份 PPT"]};
for(const [id,[n,label]] of Object.entries(examples)){const slide=data.slides.find(s=>s.id===id);assert.equal(slide.explanation.link.href,'practice.html#task-'+n);assert.ok(html.includes('href="practice.html#task-'+n+'">'+label+'</a>'));}
