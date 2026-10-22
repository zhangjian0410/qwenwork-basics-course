// Generic HTML-only course builder — v3 (rich, illustrated, aligned).
// Reads src/course.json + src/content.json and emits dist/*.html.
// Renders slides as readable, illustrated HTML (no proprietary webp exports).
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const course = JSON.parse(await fs.readFile(path.join(root, 'src/course.json'), 'utf8'));
const data = JSON.parse(await fs.readFile(path.join(root, 'src/content.json'), 'utf8'));

const totalPages = data.slides.length + 2;
const manifest=JSON.parse(await fs.readFile(path.join(root,'src/assets/slides/manifest.json'),'utf8'));
if(manifest.pages!==totalPages || manifest.pdfSha256!==createHash('sha256').update(await fs.readFile(path.join(root,'src/downloads',course.id+'.pdf'))).digest('hex'))throw new Error('PDF previews are stale: regenerate before building');
if(manifest.images.length!==totalPages || manifest.images.some((x,i)=>x.file!=='slide-'+String(i+1).padStart(2,'0')+'.webp'))throw new Error('Invalid preview manifest');
for(const item of manifest.images){if(createHash('sha256').update(await fs.readFile(path.join(root,'src/assets/slides',item.file))).digest('hex')!==item.sha256)throw new Error('Slide preview mismatch: '+item.file);}
const e = s => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const lines = s => e(s).replaceAll('\n', '<br>');
// Cover and ending included in totalPages.
const pageLabel = n => String(n).padStart(2, '0') + ' / ' + String(totalPages).padStart(2, '0');

const PRODUCER = 'AI经营交付效能专项组';
const CREDIT = `出品 · ${PRODUCER}`;

/* ---------- inline SVG icons & hero illustrations (图文) ---------- */
const GLYPH = {
  concept: '<path d="M22 4a16 16 0 0 1 10 28.4A16 16 0 1 1 22 4Zm.6 5.4a10.7 10.7 0 1 0 0 21.2 10.7 10.7 0 0 0 0-21.2Zm-.1 4.2v6.4h6.4V15.6Zm0 9.2v3.6h6.4v-3.6Z" fill="#fff"/>',
  cards: '<rect x="6" y="8" width="12" height="12" rx="2.4" fill="#fff"/><rect x="22" y="8" width="12" height="12" rx="2.4" fill="#cfe4ff"/><rect x="38" y="8" width="12" height="12" rx="2.4" fill="#fff"/><path d="M19 14h2.5M35 14h2.5" stroke="#1669db" stroke-width="2.4"/>',
  panels: '<rect x="7" y="7" width="22" height="20" rx="3" fill="#fff"/><rect x="35" y="7" width="22" height="20" rx="3" fill="#cfe4ff"/>',
  table: '<rect x="6" y="7" width="46" height="20" rx="2.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M6 17h46M22 7v20M34 7v20" stroke="#fff" stroke-width="1.6"/><rect x="6" y="7" width="16" height="10" fill="#cfe4ff" opacity=".55"/>',
  business: '<path d="M8 9h32a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H22l-8 7v-7h-0a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3Z" fill="#fff"/><circle cx="17" cy="17" r="1.7" fill="#1669db"/><circle cx="25" cy="17" r="1.7" fill="#1669db"/><circle cx="33" cy="17" r="1.7" fill="#1669db"/>',
  formula: '<path d="M10 15h18M10 15l5-5M10 15l5 5M40 15h10M44 9v12" stroke="#fff" stroke-width="2.6" fill="none"/><path d="M28 9h14" stroke="#fff" stroke-width="2.6"/>',
  case: '<rect x="6" y="9" width="20" height="22" rx="3" fill="#fff"/><path d="M40 20l8-8m0 0v6m0-6h-6" stroke="#fff" stroke-width="2.6" fill="none"/><rect x="40" y="20" width="20" height="11" rx="2" fill="#cfe4ff"/>',
  steps: '<path d="M6 30l10-10 9 0 10-10 9 0 10-10" stroke="#fff" stroke-width="2.6" fill="none"/><rect x="6" y="30" width="10" height="6" fill="#cfe4ff"/><rect x="25" y="20" width="10" height="16" fill="#cfe4ff"/><rect x="44" y="10" width="10" height="26" fill="#fff"/>',
  package: '<rect x="18" y="13" width="24" height="24" rx="3" fill="#fff"/><path d="M18 25h24M30 13v24" stroke="#1669db" stroke-width="1.8"/>',
};
const iconBadge = kind => `<div class="slide-icon" aria-hidden="true"><svg viewBox="0 0 56 40" width="56" height="40">${GLYPH[kind] || GLYPH.concept}</svg></div>`;
const hero = (kind, caption) => {
  const map = {
    concept: '<g fill="none" stroke="#1669db" stroke-width="2"><circle cx="160" cy="100" r="58"/><circle cx="160" cy="100" r="34"/><circle cx="160" cy="100" r="12" fill="#479df2" stroke="none"/></g>',    cards: '<g><rect x="24" y="60" width="78" height="80" rx="10" fill="#dcecff"/><rect x="128" y="60" width="78" height="80" rx="10" fill="#bcdcff"/><rect x="232" y="60" width="78" height="80" rx="10" fill="#dcecff"/><path d="M104 100h24M208 100h24" stroke="#1669db" stroke-width="3"/></g>',
    panels: '<g><rect x="40" y="50" width="240" height="40" rx="8" fill="#bcdcff"/><rect x="40" y="110" width="112" height="48" rx="8" fill="#dcecff"/><rect x="168" y="110" width="112" height="48" rx="8" fill="#dcecff"/></g>',
    table: '<g><rect x="30" y="46" width="260" height="108" rx="10" fill="#eaf3ff" stroke="#9fcaff"/><path d="M30 84h260M30 122h260M130 46v108M210 46v108" stroke="#9fcaff" stroke-width="2"/></g>',
    business: '<g><rect x="34" y="48" width="150" height="46" rx="12" fill="#bcdcff"/><rect x="176" y="106" width="150" height="46" rx="12" fill="#dcecff"/><path d="M120 94l56 12" stroke="#1669db" stroke-width="3"/></g>',
    formula: '<g><rect x="40" y="74" width="240" height="52" rx="10" fill="#eaf3ff"/><path d="M70 100h40M70 100l14-14M70 100l14 14M210 100h34" stroke="#1669db" stroke-width="4" fill="none"/><path d="M150 84h60" stroke="#1669db" stroke-width="4"/></g>',
    case: '<g><rect x="34" y="58" width="120" height="84" rx="10" fill="#dcecff"/><rect x="206" y="78" width="120" height="64" rx="10" fill="#bcdcff"/><path d="M158 98h36M176 80l18 18M194 80l-18 18" stroke="#1669db" stroke-width="3" fill="none"/></g>',
    steps: '<g><path d="M40 132l44-44M84 88l44-44M128 44l44-10" stroke="#9fcaff" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="172" cy="34" r="9" fill="#1669db"/></g>',
    package: '<g><rect x="120" y="54" width="80" height="80" rx="12" fill="#bcdcff"/><path d="M120 94h80M160 54v80M120 54L40 110M200 54l80 56" stroke="#1669db" stroke-width="2.4" fill="none"/></g>',
  };
  const inner = map[kind] || map.concept;
  return `<figure class="slide-visual"><svg viewBox="0 0 320 200" width="100%" role="img" aria-label="${e(caption || '图解')}">${inner}</svg><figcaption>${e(caption || '')}</figcaption></figure>`;
};

/* ---------- data-driven structure map（右栏图解：由本页真实内容生成） ----------
   原来的右栏是固定装饰图，与本页内容无关，看上去就是"空的"。
   这里改成读取本页 body 的真实标签，渲染成可读的结构图。 */
const firstSentence = s => {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^[^。！？；;.!?]{1,46}/);
  return m ? m[0] : t.slice(0, 46);
};
const mapItem = (i, label, sub) => `<li class="map-item"><span class="map-no">${String(i + 1).padStart(2, '0')}</span><div class="map-text"><b>${e(label)}</b>${sub ? `<span class="map-sub">${e(sub)}</span>` : ''}</div></li>`;

/* 从长文本里抽若干条短句，作为右栏"讲解要点" */
const keySentences = (text, n = 3) => {
  const parts = String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[。！？；])/)
    .map(s => s.trim())
    .filter(s => s.length >= 6);
  if (!parts.length) return [];
  const out = [];
  for (const p of parts) {
    if (out.length >= n) break;
    out.push(p.replace(/[。！？；]$/, ''));
  }
  return out;
};

/* 右栏结构速览：只保留"骨架"，不重复左栏正文
   —— 旧版把左栏内容原样再抄一遍，既冗余又把整页撑高。 */
function structureMap(slide) {
  const b = slide.body || {};
  const cap = slide.figureCaption || slide.title;
  let inner = '';
  switch (slide.kind) {
    case 'cards':
    case 'business':
      // 卡片类：只列标题骨架（标签 + 一句摘要），最多 6 条
      inner = `<ol class="map-list">${(b.cards || []).slice(0, 6).map((c, i) => mapItem(i, c.label, firstSentence(c.sub || c.body))).join('')}</ol>`;
      break;
    case 'panels':
      inner = `<div class="map-groups">${(b.panels || []).map(p => `<section class="map-group"><h3>${e(p.label)}</h3>${p.items && p.items.length ? `<ol class="map-list map-list-plain">${p.items.slice(0, 5).map((it, i) => mapItem(i, it[0], '')).join('')}</ol>` : `<p class="map-note">${e(firstSentence(p.body || ''))}</p>`}</section>`).join('')}</div>`;
      break;
    case 'table':
      // 表格类：只取表头 + 前 3 行
      inner = `<div class="map-grid">${(b.rows || []).slice(0, 4).map((row, i) => `<div class="map-row${i === 0 ? ' is-head' : ''}">${row.map((v, j) => `<span class="map-cell${j === 0 ? ' is-key' : ''}">${e(v)}</span>`).join('')}</div>`).join('')}</div>`;
      break;
    case 'steps':
      inner = `<ol class="map-list map-list-flow">${(b.steps || []).map((st, i) => mapItem(i, st[0], firstSentence(st[1]))).join('')}</ol>`;
      break;
    case 'case':
      inner = `<div class="map-chain"><div class="map-chain-item"><span class="map-no">01</span><div class="map-text"><b>${e(b.input_label || '输入')}</b><span class="map-sub">${e(firstSentence(b.sample_note || ''))}</span></div></div><div class="map-chain-item"><span class="map-no">02</span><div class="map-text"><b>${e(b.task_label || '任务')}</b><span class="map-sub">${e(firstSentence(b.task || ''))}</span></div></div><div class="map-chain-item"><span class="map-no">03</span><div class="map-text"><b>${e(b.output_label || '产出')}</b><span class="map-sub">${e(firstSentence((b.output_lines || [])[0] || ''))}</span></div></div></div>`;
      break;
    case 'formula':
      inner = `<div class="map-chain">${(b.terms || []).map((t, i) => `<div class="map-chain-item"><span class="map-no">${String(i + 1).padStart(2, '0')}</span><div class="map-text"><b>${e(t[0])}</b><span class="map-sub">${e(t[1] || '')}</span></div></div>`).join('')}</div>`;
      break;
    default:
      inner = `<p class="map-note">本页结构见左侧图解。</p>`;
  }
  return `<figure class="slide-visual slide-map"><p class="map-title">本页结构 · ${e(cap)}</p>${inner}</figure>`;
}

/* 右栏讲解面板：讲清楚"这一页要记住什么"
   用户明确要求右栏不能空、要有解释说明。
   内容全部来自本页真实数据（讲解要点 / 关键词 / 结论 / 自测问题），
   数量严格限量，保证右栏不把整页撑高。 */
function explainPanel(slide) {
  const blocks = [];
  const explain = keySentences((slide.explanation || {}).text, 3);
  if (explain.length) {
    blocks.push(`<section class="map-note-block"><p class="map-note-title">讲解要点</p><ul class="map-note-list">${explain.map(x => `<li>${e(x)}</li>`).join('')}</ul></section>`);
  }
  const kws = (slide.points || []).slice(0, 3);
  if (kws.length) {
    blocks.push(`<section class="map-note-block"><p class="map-note-title">关键词</p><div class="map-kw">${kws.map(k => `<span>${e(k)}</span>`).join('')}</div></section>`);
  }
  if (slide.takeaway) {
    blocks.push(`<section class="map-note-block"><p class="map-note-title">结论</p><p class="map-note">${e(slide.takeaway)}</p></section>`);
  }
  if (!blocks.length) return '';
  return `<figure class="slide-visual slide-explain"><p class="map-title">本页讲解 · 要记住什么</p>${blocks.join('')}</figure>`;
}

/* ---------- slide body renderers ---------- */
const cards = (arr, cls = '') => {
  // 卡片数量写进 class（cards-n3 / cards-n6 …），CSS 据此选列数。
  // 不能靠 :has(> .card:nth-child(n)) 判断 —— 箭头 .flow-arrow 也会占 nth-child 位。
  const n = arr.length;
  return `<div class="cards ${cls} cards-n${n}">${arr.map((q, i) => `<section class="card"><span class="step-number">${String(i + 1).padStart(2, '0')}</span><h2>${e(q.label)}</h2>${q.sub ? `<p class="card-sub">${e(q.sub)}</p>` : ''}<p>${lines(q.body || '')}</p></section>`).join('<span class="flow-arrow" aria-hidden="true">➜</span>')}</div>`;
};
const panels = arr => `<div class="two-panels">${arr.map(q => `<section class="panel"><h2>${e(q.label)}</h2><div class="panel-body">${q.items ? q.items.map(([a, b]) => `<div class="panel-item"><h3>${e(a)}</h3><p>${e(b)}</p></div>`).join('') : `<p>${e(q.body)}</p>`}</div></section>`).join('')}</div>`;
const table = (rows, cls = '') => `<table class="${cls}"><thead><tr>${rows[0].map(v => `<th scope="col">${lines(v)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(row => `<tr>${row.map((v, i) => i === 0 ? `<th scope="row">${lines(v)}</th>` : `<td>${lines(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const business = arr => `<div class="business-questions biz-n${arr.length}">${arr.map((q, i) => `<section class="business-question"><span class="step-number">${String(i + 1).padStart(2, '0')}</span><h2>${e(q.label)}</h2>${q.sub ? `<p class="card-sub">${e(q.sub)}</p>` : ''}<p>${e(q.body)}</p></section>`).join('')}</div>`;
const formula = (f, terms, arr) => `<section class="formula"><h2>核心公式</h2><p>${e(f)}</p><div>${terms.map(([en, zh]) => `<span><b>${e(en)}</b><small>${e(zh)}</small></span>`).join('')}</div></section>${cards(arr, 'progression')}`;
const caseSlide = s => `<div class="case-layout ticket-example"><section class="sample-input"><h2 class="case-label">${e(s.input_label)}</h2>${table(s.table, 'sample-table')}<p class="sample-note">${e(s.sample_note || '')}</p></section><div class="sample-delivery"><section class="panel sample-task"><h2>${e(s.task_label)}</h2><div class="panel-body"><p>${e(s.task)}</p></div></section><section class="panel sample-output"><h2>${e(s.output_label)}</h2><div class="panel-body">${s.output_lines.map(line => `<p>${e(line)}</p>`).join('')}</div></section></div></div>`;
const steps = arr => `<h2 class="diagram-label">流程：任务怎样推进</h2>${cards(arr.map(([label, body]) => ({ label, body })), 'five-steps')}`;
const pkg = s => `<div class="package-root">${e(s.root)}</div><div class="package-branches" aria-hidden="true"></div>${cards(s.cards, 'package-cards')}<p class="optional">${e(s.optional || '')}</p>`;

function renderBody(s) {
  const b = s.body || {};
  switch (s.kind) {
    case 'concept': return b.html || '';
    case 'cards': return cards(b.cards);
    case 'panels': return panels(b.panels);
    case 'table': return table(b.rows, b.cls || 'matrix');
    case 'business': return business(b.cards);
    case 'formula': return formula(b.formula, b.terms, b.cards);
    case 'case': return caseSlide(b);
    case 'steps': return steps(b.steps);
    case 'package': return pkg(b);
    default: return b.html || '';
  }
}

/* ---------- shared chrome ---------- */
const header = (active = '') => `<header class="site-header"><a class="brand" href="index.html#slide-cover">${e(course.shortTitle)}<span>${PRODUCER}</span></a><nav aria-label="课程学习导航"><a href="courses.html">课程目录</a><a href="index.html#slide-cover"${active === 'slides' ? ' aria-current="page"' : ''}>看课件</a><a href="practice.html#start"${active === 'practice' ? ' aria-current="page"' : ''}>动手做</a><details class="course-resources"><summary>学习资料</summary><div><a href="deep.html"${active === 'reading' ? ' aria-current="page"' : ''}>深入阅读（选读）</a><a href="poster.html">海报总览</a><a href="self-review.html">自测清单</a></div></details>${active === "slides" ? '<button id="fullscreen" type="button">全屏 F</button>' : ""}</nav></header>`;

const feedback = `<section class="course-feedback" id="course-feedback" data-feedback-course="${e(course.id)}" aria-labelledby="feedback-title"><div class="feedback-intro"><p class="lesson-label">一起把课程改得更好</p><h2 id="feedback-title">点赞、拍砖，或留一句话</h2><p>不用登录，也不用实名。哪里有用、哪里看不懂，都可以告诉我们。</p></div><div class="reactions"><button type="button" data-reaction="like" aria-pressed="false" disabled>👍 点赞 <span>—</span></button><button type="button" data-reaction="brick" aria-pressed="false" disabled>🧱 拍砖 <span>—</span></button></div><form class="comment-form"><fieldset><legend>你的反馈</legend><label for="comment-body">留言 <span>必填 · 最多 1000 字</span></label><textarea id="comment-body" name="body" required maxlength="1000" rows="4" placeholder="例如：这部分我还想看一个更具体的操作演示。"></textarea><div class="comment-optional"><div><label for="comment-name">称呼 <span>选填 · 会公开</span></label><input id="comment-name" name="name" maxlength="40" placeholder="昵称即可" autocomplete="nickname"></div><div><label for="comment-contact">联系方式 <span>选填 · 仅讲师可见</span></label><input id="comment-contact" name="contact" maxlength="200" placeholder="邮箱、微信或其他方便联系的方式" autocomplete="off"></div></div><p class="contact-note">留言和称呼会公开。选填联系方式只为方便讲师联系你，不会展示在页面上。</p><button type="submit" disabled>发布留言</button></fieldset></form><p class="feedback-status" data-feedback-status role="status">开启 JavaScript 后可参与互动。</p><ul class="comment-list" data-comments aria-label="近期留言"></ul><noscript><p>开启 JavaScript 后可点赞和发布留言。</p></noscript></section>`;

const contents = (coverTitle) => `<nav id="contents" aria-label="课件目录" hidden><a href="#slide-cover">01 ${e(coverTitle)}</a>${data.slides.map((s, i) => `<a href="#${e(s.id)}">${String(i + 2).padStart(2, '0')} ${e(s.title)}</a>`).join('')}<a href="#slide-ending">${String(data.slides.length + 2).padStart(2, '0')} 结语</a></nav>`;

/* ---------- slide section ---------- */
function lesson(slide, n, isCover) {
  if (isCover) {
    const c = data.cover;
    const info = (c.info || []).map(it => `<section class="cover-card"><h2>${e(it.label)}</h2>${it.list ? `<ul>${it.list.map(x => `<li>${e(x)}</li>`).join('')}</ul>` : `<p>${e(it.body || '')}</p>`}</section>`).join('');
    const route = (c.route || []).map((r, i) => `<div class="route-step"><span class="route-no">${String(i + 1).padStart(2, '0')}</span><div><b>${e(r.label)}</b><p>${e(r.body || '')}</p></div></div>`).join('');
    const routeBlock = route ? `<div class="cover-route"><p class="cover-route-label">学习路线</p><div class="route-grid">${route}</div></div>` : '';
    return `<section class="lesson active"><article class="slide active kind-cover" id="slide-cover" aria-labelledby="cover-title"><div class="slide-canvas"><div class="slide-header"><p class="eyebrow">${e(course.shortTitle)} 自学课件 <span>${pageLabel(1)}</span></p><h1 id="cover-title">${e(c.title)}</h1><p class="lead">${e(c.subtitle || '')}</p></div><div class="cover-body"><p class="cover-overview">${lines(c.overview || '')}</p><div class="cover-grid">${info}</div>${routeBlock}</div><footer class="slide-byline"><span>${CREDIT}</span></footer></div></article><aside class="explanation" aria-labelledby="cover-guide"><div class="explanation-heading"><h2 id="cover-guide">课程导览 <span>${pageLabel(1)}</span></h2><a href="practice.html#start">开始动手做</a></div><p>${lines(c.guide || '先快速浏览这门课讲什么，再进入正文逐页学习。')}</p></aside></section>`;
  }
  const exp = slide.explanation || {};
  /* 右栏：优先用"讲解面板"（要记住什么），无讲解数据时退回结构速览图 */
  const fig = slide.figure ? `<figure class="slide-visual">${slide.figure}<figcaption>${e(slide.figureCaption || '')}</figcaption></figure>` : (explainPanel(slide) || structureMap(slide));
  /* 底部信息合并为一块紧凑区：要点 + 提示（结论放在右栏，不重复） */
  const notes = [];
  if (slide.points && slide.points.length) notes.push(`<div class="note-row note-points"><span class="note-label">要点</span><div class="note-chips">${slide.points.map(p => `<span class="sp-chip">${e(p)}</span>`).join('')}</div></div>`);
  if (slide.tip) notes.push(`<div class="note-row note-tip"><span class="note-label">提示</span><span class="note-text">${e(slide.tip)}</span></div>`);
  const notesBlock = notes.length ? `<div class="slide-notes">${notes.join('')}</div>` : '';
  return `<section class="lesson"><article class="slide kind-${e(slide.kind)}" id="${e(slide.id)}" aria-labelledby="title-${n}"><div class="slide-canvas"><div class="slide-header"><div class="slide-head-main"><p class="eyebrow">${e(course.shortTitle)} 自学课件 <span>${pageLabel(n + 1)}</span></p><h1 id="title-${n}">${e(slide.title)}</h1>${slide.lead ? `<p class="lead">${e(slide.lead)}</p>` : ''}</div>${iconBadge(slide.kind)}</div><div class="slide-cols"><div class="diagram">${renderBody(slide)}</div>${fig}</div>${notesBlock}<footer class="slide-byline"><span>${CREDIT}</span></footer></div></article><aside class="explanation" aria-labelledby="explanation-${n}"><div class="explanation-heading"><h2 id="explanation-${n}">本页讲解 <span>${pageLabel(n + 1)}</span></h2>${exp.link ? `<a href="${e(exp.link.href)}">${e(exp.link.label)}</a>` : ''}</div><p>${lines(exp.text || '')}</p></aside></section>`;
}

function endingSlide() {
  const en = data.ending || {};
  const recap = (en.recap || []).map((r, i) => `<section class="ending-card"><span class="step-number">${String(i + 1).padStart(2, '0')}</span><h2>${e(r.label)}</h2><p>${e(r.body)}</p></section>`).join('');
  const next = [...(en.next || []).filter(x=>x.href!=='index.html#slide-cover'),...(course.nextCourse?[course.nextCourse]:[])].map(x => `<a class="ending-link" href="${e(x.href)}">${e(x.label)} →</a>`).join('');
  const linesHtml = (en.lines || []).map(l => `<p>${e(l)}</p>`).join('');
  const checks = (en.checks || []).map((c, i) => `<li><span class="ck-no">${String(i + 1).padStart(2, '0')}</span><div><b>${e(c.label)}</b><p>${e(c.body || '')}</p></div></li>`).join('');
  const checksBlock = checks ? `<div class="ending-checks"><p class="ending-checks-label">离岗前，用这三问验收</p><ul>${checks}</ul></div>` : '';
  return `<section class="lesson"><article class="slide kind-ending" id="slide-ending" aria-labelledby="ending-title"><div class="slide-canvas"><div class="slide-header"><div class="slide-head-main"><p class="eyebrow">${e(course.shortTitle)} 自学课件 <span>结语</span></p><h1 id="ending-title">${e(en.title || '把方法用起来')}</h1>${en.lead ? `<p class="lead">${e(en.lead)}</p>` : ''}</div>${iconBadge('concept')}</div><div class="ending-body"><p class="ending-lead">${linesHtml}</p><div class="ending-grid">${recap}</div>${checksBlock}${next ? `<div class="ending-next"><h2>下一步</h2><div class="ending-links">${next}</div></div>` : ''}</div><footer class="slide-byline"><span>${CREDIT}</span></footer></div></article><aside class="explanation" aria-labelledby="ending-guide"><div class="explanation-heading"><h2 id="ending-guide">本页讲解</h2><a href="practice.html#start">开始动手做</a></div><p>${e(en.lead || "把课件中的方法用于一次真实任务，再核对产出。")}</p></aside></section>`;
}

const articlesHtml = lesson(data.cover, 0, true) + data.slides.map((s, i) => lesson(s, i + 1, false)).join('') + endingSlide();

// Same 16:9 slide view as the supplied PDF; readable HTML remains available on mobile and as a transcript.
let slideNumber=0;
const articles=articlesHtml.replace(/(<article class="slide[^>]*>)([\s\S]*?)(<\/article>)/g,(_all,head,body,end)=>{
 const n=++slideNumber;
 return head+'<img class="fullscreen-preview" data-src="assets/slides/slide-'+String(n).padStart(2,'0')+'.webp" alt="课件第 '+n+' 页；文字版位于下方" width="1600" height="900"><p class="preview-status" role="status" hidden></p><div class="slide-content">'+body+'</div>'+end;
});
if(slideNumber!==totalPages)throw new Error('Slide count mismatch');
/* ---------- index.html ---------- */
const index = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(course.title)}：${e(data.cover.subtitle || '')}"><title>${e(course.title)}</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="course-deck.css"><script src="app.js" defer></script><script src="site-interactions.js" type="module"></script></head><body data-page-id="${e(course.id)}:slides"><a class="skip" href="#stage">跳到课件</a>${header('slides')}<main id="stage">${articles}<div class="deck-controls"><div class="deck-start"><a href="courses.html">课程首页</a><button id="first" type="button">第一页</button></div><button id="prev" type="button" aria-label="上一页">上一页</button><button id="contents-toggle" type="button" aria-expanded="false" aria-controls="contents">目录 <span id="page-counter" aria-live="polite">${pageLabel(1)}</span></button><button id="next" type="button" aria-label="下一页">下一页</button></div></main>${feedback}${contents(data.cover.title)}<noscript><p>已按顺序展示全部 ${totalPages} 页。开启 JavaScript 后可逐页切换。</p></noscript></body></html>`;

/* ---------- poster.html ---------- */
const poster = (() => {
  const p = data.poster || {};
  const topics = (p.topics || []).map(t => `<li>${e(t)}</li>`).join('');
  const outcomes = (p.outcomes || []).map(t => `<li>${e(t)}</li>`).join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(course.title)} 课程总览"><title>${e(course.title)} · 总览</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="course-deck.css"><script src="app.js" defer></script><script src="site-interactions.js" type="module"></script></head><body data-page-id="${e(course.id)}:poster"><a class="skip" href="#poster-main">跳到总览</a>${header()}<main class="poster-shell" id="poster-main"><div class="poster-heading"><p class="lesson-label">${e(course.format || 'AI 实践课程')}</p><h1>${e(course.title)}</h1><p>${e(p.tagline || data.cover.subtitle || '')}</p><p class="poster-byline">${CREDIT}</p></div><div class="poster-actions"><a class="course-start" href="index.html#slide-cover">看课件 →</a><a href="practice.html#start">动手做 →</a></div><section class="learning-route" aria-label="课程主题"><h2 style="font-size:22px;margin:0 0 14px">课程主题</h2><ul style="margin:0;padding-left:20px;line-height:2">${topics}</ul></section>${outcomes ? `<section class="metrics-note" style="margin-top:28px"><h2 style="font-size:22px;margin:0 0 14px">学完你能做到</h2><ul style="margin:0;padding-left:20px;line-height:2">${outcomes}</ul></section>` : ''}</main>${feedback}</body></html>`;
})();

/* ---------- practice.html (single column, rich) ---------- */
const practice = (() => {
  const pr = data.practice || { intro: '', tasks: [] };
  const allChecks = [];
  const tasks = pr.tasks.map((t, i) => {
    const checks = (t.checklist || []).map(c => { allChecks.push(c); return `<li>${e(c)}</li>`; }).join('');
    return `<section class="panel practice-task" id="task-${i + 1}"><div class="practice-task-head"><span class="task-no">${String(i + 1).padStart(2, '0')}</span><h2>${e(t.title)}</h2></div>${t.goal ? `<div class="task-goal"><b>目标</b><span>${e(t.goal)}</span></div>` : ''}<div class="task-steps">${t.steps.map(([a, b]) => `<div class="task-step"><h3>${e(a)}</h3><p>${e(b)}</p></div>`).join('')}</div>${t.example ? `<div class="task-example"><span class="ex-label">示例</span><p>${e(t.example)}</p></div>` : ''}${checks ? `<div class="task-check"><b>完成检查</b><ul>${checks}</ul></div>` : ''}${t.pitfalls ? `<div class="task-pitfalls"><b>常见坑</b><span>${e(t.pitfalls)}</span></div>` : ''}${t.note ? `<p class="sample-note">${e(t.note)}</p>` : ''}</section>`;
  }).join('');
  const checkAll = allChecks.length ? `<section class="panel practice-final" id="done"><h2>全部完成检查</h2><p>全部任务做完后，逐项确认；任意一项没过，回到对应课件页复习，或到反馈区留言。</p><ul class="task-check-all">${allChecks.map(c => `<li>${e(c)}</li>`).join('')}</ul><a class="course-start" href="index.html#course-feedback">交流与反馈 →</a></section>` : '';
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(course.title)} 动手练习"><title>动手做 · ${e(course.title)}</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="course-deck.css"><script src="app.js" defer></script><script src="site-interactions.js" type="module"></script></head><body data-page-id="${e(course.id)}:practice"><a class="skip" href="#practice-main">跳到练习</a>${header('practice')}<main class="practice-shell" id="practice-main"><span id="start" class="anchor-target" aria-hidden="true"></span><section class="review-intro"><p class="review-version">${e(course.version || '')} · ${e(course.date || '')}</p><h1>动手做</h1><p class="lead">${e(pr.intro || '跟着下面的任务，把课件里的方法用一遍。')}</p></section><section class="panel practice-prepare" id="prepare"><h2>开始前</h2><div class="panel-body"><p>阅读教材不用登录。动手操作需要你自己的千问办公账号；先打开 <a href="https://qwenwork.cn/" target="_blank" rel="noopener">千问办公官网</a>，选择网页端或客户端下载并登录。</p><p>先完成入口、PPT 和表格练习，再按已有权限体验钉钉与技能。</p><p>使用虚构或已脱敏的练习材料。功能入口可能随版本、套餐和企业授权不同；找不到入口时先查 <a href="https://docs.qwenwork.cn/" target="_blank" rel="noopener">官方帮助</a>，不要把未体验的项目标为完成。涉及发群、发布网页或定时推送时，先在测试范围确认内容与接收人。</p><p>学完保留成品、使用过的指令和未完成事项；自测清单在页面末尾。</p></div></section><nav class="practice-jumps" aria-label="跟练目录"><a href="#task-1">1. 准备环境，三端任选其一跑通</a><a href="#task-2">2. 第一份 PPT，用四步法一句话生成</a><a href="#task-3">3. 第一份 Excel，描述需求生成带公式的表</a><a href="#task-4">4. 打通钉钉，群聊变周报并发群</a><a href="#task-5">5. 沉淀复用，把好指令存成技能</a><a href="#done">完成检查</a></nav><div class="practice-flow">${tasks}${checkAll}</div></main>${feedback}</body></html>`;
})();

/* ---------- deep.html (reading + 参考链接) ---------- */
const deep = (() => {
  const rd = data.reading || { intro: '', sections: [] };
  const ref = (rd.references || []).map(r => `<li><a href="${e(r.href)}" target="_blank" rel="noopener">${e(r.label)}</a><span>${e(r.desc || '')}</span></li>`).join('');
  const sectionBody = s => `${s.paragraphs ? s.paragraphs.map(p => `<p>${lines(p)}</p>`).join('') : ''}${s.bullets ? `<ul class="reading-bullets">${s.bullets.map(b => `<li>${lines(b)}</li>`).join('')}</ul>` : ''}${s.links ? `<ul class="reading-inline">${s.links.map(l => `<li><a href="${e(l.href)}" target="_blank" rel="noopener">${e(l.label)}</a><span>${e(l.desc || '')}</span></li>`).join('')}</ul>` : ''}${s.subs ? s.subs.map(sub => `<p class="reading-sub">${e(sub.title)}</p>${sub.paragraphs ? sub.paragraphs.map(p => `<p>${lines(p)}</p>`).join('') : ''}${sub.bullets ? `<ul class="reading-bullets">${sub.bullets.map(b => `<li>${lines(b)}</li>`).join('')}</ul>` : ''}`).join('') : ''}`;
  const sections = rd.sections.map(s => `<section class="explanation reading-section" style="margin-bottom:30px"><div class="explanation-heading"><h2>${e(s.title)}</h2></div>${sectionBody(s)}</section>`).join('');
  const refsBlock = ref ? `<section class="explanation reading-refs"><div class="explanation-heading"><h2>参考链接（点击可访问 · 以官网实时信息为准）</h2></div><ul class="ref-list">${ref}</ul></section>` : '';
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(course.title)} 深入阅读"><title>深入阅读 · ${e(course.title)}</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="course-deck.css"><script src="app.js" defer></script><script src="site-interactions.js" type="module"></script></head><body data-page-id="${e(course.id)}:deep"><a class="skip" href="#reading-main">跳到阅读</a>${header('reading')}<main class="review-shell reading" id="reading-main"><section class="review-intro"><h1>深入阅读（选读）</h1><p class="lead">${e(rd.intro || '想进一步了解原理与边界，可以读这几节。')}</p></section>${sections}${refsBlock}</main>${feedback}</body></html>`;
})();

/* ---------- self-review.html ---------- */
const selfReview = (() => {
  const sr = data.selfReview || { intro: '', items: [], note: '' };
  const items = sr.items.map(t => `<li>${e(t)}</li>`).join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(course.title)} 自测清单"><title>自测清单 · ${e(course.title)}</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="course-deck.css"><script src="app.js" defer></script><script src="site-interactions.js" type="module"></script></head><body data-page-id="${e(course.id)}:self-review"><a class="skip" href="#review-main">跳到自测</a>${header()}<main class="review-shell" id="review-main"><section class="review-intro"><h1>自测清单</h1><p class="lead">${e(sr.intro || '对照下面的清单，确认自己已经掌握这门课。')}</p></section><ul class="self-list">${items}</ul>${sr.note ? `<p class="grading-note">${e(sr.note)}</p>` : ''}<a class="course-start" href="index.html#course-feedback" style="margin-top:24px">回到课件与反馈 →</a></main>${feedback}</body></html>`;
})();

/* ---------- courses.html ---------- */
const coursesPage = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(course.title)} 课程首页"><title>${e(course.title)}</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="course-deck.css"><script src="app.js" defer></script><script src="site-interactions.js" type="module"></script></head><body data-page-id="${e(course.id)}:home"><a class="skip" href="#stage">跳到课程</a>${header()}<main id="stage"><div class="portal-shell"><div class="portal-intro"><p class="lesson-label">${e(course.format || 'AI 实践课程')}</p><h1>${e(course.title)}</h1><p class="lead">${e(data.cover.subtitle || '')}</p><p>${lines(data.cover.overview || '')}</p></div><article class="course-row"><div class="course-summary"><p class="course-format">${e(course.format || '')}</p><h3>${e(course.title)}</h3><p>${e(data.cover.overview || '')}</p><p class="course-audience">${e(course.audience || '')}</p><a class="course-start" href="index.html#slide-cover">开始学习 →</a></div><nav class="learning-route" aria-label="学习路线"><a href="index.html#slide-cover"><b>看课件</b><span>图解概念与方法</span></a><a href="practice.html#start"><b>动手做</b><span>跟练任务</span></a><a href="deep.html"><b>深入阅读</b><span>选读</span></a><a href="poster.html"><b>总览</b><span>课程地图</span></a></nav></article></div></main>${feedback}</body></html>`;

/* ---------- write ---------- */
const dist = path.join(root, 'dist');
await fs.mkdir(dist, { recursive: true });
await fs.mkdir(path.join(dist, 'downloads'), { recursive: true });
const writes = { 'index.html': index, 'poster.html': poster, 'practice.html': practice, 'deep.html': deep, 'self-review.html': selfReview, 'courses.html': coursesPage };
for (const [name, html] of Object.entries(writes)) await fs.writeFile(path.join(dist, name), html.replace("</head>",'<link rel="stylesheet" href="ui-tokens.css"><link rel="stylesheet" href="course-shell.css"></head>'));
for (const name of ['style.css', 'app.js', 'site-interactions.js', 'ui-tokens.css', 'course-shell.css', 'community.css', 'course-deck.css']) {
  await fs.copyFile(path.join(root, 'src', name), path.join(dist, name));
}
// 主题素材（沿用老课 assets/theme.webp，保证自测页与课件页视觉一致）
if (existsSync(path.join(root, 'src', 'assets'))) {
  await fs.cp(path.join(root, 'src', 'assets'), path.join(dist, 'assets'), { recursive: true });
}
// 下载件（课件 PDF / PPTX，与老课 dist/downloads 同构）
if (existsSync(path.join(root, 'src', 'downloads'))) {
  await fs.cp(path.join(root, 'src', 'downloads'), path.join(dist, 'downloads'), { recursive: true });
}
console.log(`Built ${course.id}: ${totalPages}-page deck + poster/practice/reading/self-review/home (v3 illustrated).`);
