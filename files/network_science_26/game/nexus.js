/* NEXUS · a network science campaign · shared engine (used by every level) */
const COL={cyan:'#38e1ff',mag:'#ff3d81',green:'#3dff9a',red:'#ff4d4d',amber:'#ffc23d',violet:'#b48cff',ink:'#e6f1ff',ink2:'#8fa6c2',dim:'#4c6079',line:'#1c2a3d',bg:'#070b12',bg2:'#0d1420'};
const KEY=LEVEL.key;
const store={ get(){ try{ return JSON.parse(localStorage.getItem(KEY))||null; }catch(e){ return null; } }, set(v){ try{ localStorage.setItem(KEY,JSON.stringify(v)); }catch(e){} } };
let S = store.get() || {xp:{}, at:0, best:0};
const save = ()=>store.set(S);
const totalXP = ()=>Object.values(S.xp).reduce((a,b)=>a+b,0);

/* ---------------- math typesetting (KaTeX, loaded on demand) ----------------
   In any text: $...$ inline, $$...$$ as a centred display formula.
   Inside JS strings every backslash must be doubled: '$\\frac{a}{b}$'.            */
const TEX={ready:false, opts:{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}], throwOnError:false, strict:false}};
(function(){ const V='https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/';
  const l=document.createElement('link'); l.rel='stylesheet'; l.href=V+'katex.min.css'; document.head.appendChild(l);
  const a=document.createElement('script'); a.src=V+'katex.min.js'; a.onload=()=>{ const b=document.createElement('script'); b.src=V+'contrib/auto-render.min.js';
    b.onload=()=>{ TEX.ready=true; tex(document.body); }; document.head.appendChild(b); }; document.head.appendChild(a); })();
function tex(node){ if(TEX.ready && node) try{ renderMathInElement(node, TEX.opts); }catch(e){} }

/* ---------------- debug mode: a code on every page, for page-by-page notes ----------------
   ?debug=1 turns it on (remembered), ?debug=0 turns it off. Code = L<level>-<scene>[-Q<item>]. */
const DBG=(()=>{ const q=new URLSearchParams(location.search);
  try{ if(q.get('debug')==='1') localStorage.setItem('nexus-debug','1'); if(q.get('debug')==='0') localStorage.removeItem('nexus-debug'); return localStorage.getItem('nexus-debug')==='1'; }
  catch(e){ return q.get('debug')==='1'; } })();
let dbgEl=null;
function dbg(extra){ if(!DBG) return;
  if(!dbgEl){ dbgEl=el('div','dbg'); document.body.appendChild(dbgEl);
    dbgEl.onclick=()=>{ try{ navigator.clipboard.writeText(dbgEl.dataset.code); }catch(e){} dbgEl.classList.add('copied'); setTimeout(()=>dbgEl.classList.remove('copied'),800); }; }
  const n=(LEVEL.key.match(/\d+/)||['0'])[0], sc=SCENES[idx];
  const code=`L${n}-${String(idx).padStart(2,'0')}${extra?'-'+extra:''}`;
  dbgEl.dataset.code=code; dbgEl.innerHTML=`<b>${code}</b> ${sc.kind}${sc.key?':'+sc.key:sc.anim?':'+sc.anim:''}`; }

/* ---------------- utilities ---------------- */
function rng(s){ return function(){ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const ease = t => t<0?0:t>1?1:t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const el=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };

// Fruchterman–Reingold layout, positions in an arbitrary box (fit to the canvas later)
function layout(n, edges, seed=1, iters=420, grav=.6){
  const R=rng(seed), p=Array.from({length:n},()=>[R(),R()]), k=Math.sqrt(1/n); let T=.12;
  for(let it=0; it<iters; it++){
    const d=p.map(()=>[0,0]);
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++){
      let dx=p[i][0]-p[j][0], dy=p[i][1]-p[j][1], dist=Math.max(1e-3,Math.hypot(dx,dy)), f=k*k/dist;
      dx/=dist; dy/=dist; d[i][0]+=dx*f; d[i][1]+=dy*f; d[j][0]-=dx*f; d[j][1]-=dy*f; }
    for(const [a,b,w] of edges){
      let dx=p[a][0]-p[b][0], dy=p[a][1]-p[b][1], dist=Math.max(1e-3,Math.hypot(dx,dy)), f=dist*dist/k*(w?Math.sqrt(w):1);
      dx/=dist; dy/=dist; d[a][0]-=dx*f; d[a][1]-=dy*f; d[b][0]+=dx*f; d[b][1]+=dy*f; }
    for(let i=0;i<n;i++){ d[i][0]-=(p[i][0]-.5)*k*grav; d[i][1]-=(p[i][1]-.5)*k*grav;
      const L=Math.hypot(d[i][0],d[i][1]); if(L>0){ const s=Math.min(L,T)/L; p[i][0]+=d[i][0]*s; p[i][1]+=d[i][1]*s; } }
    T*=.986;
  }
  return p;
}
// try several seeds and keep the layout whose closest pair of nodes is farthest apart (relative to its size)
function bestLayout(n, edges, tries=12, base=1){
  let best=null, score=-1;
  for(let k=0;k<tries;k++){ const p=layout(n,edges,base+k*7);
    let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity; for(const [x,y] of p){ x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y); }
    const S=Math.max(x1-x0,y1-y0); let m=Infinity; for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) m=Math.min(m,Math.hypot(p[i][0]-p[j][0],p[i][1]-p[j][1])/S);
    if(m>score){ score=m; best=p; } }
  return best;
}
// pull far-away stragglers (isolated nodes, small pieces) back towards the bulk, so the main component is not squeezed
function tame(P, q=.9, f=1.15){ const cx=P.reduce((a,p)=>a+p[0],0)/P.length, cy=P.reduce((a,p)=>a+p[1],0)/P.length;
  const ds=P.map(([x,y])=>Math.hypot(x-cx,y-cy)), r=[...ds].sort((a,b)=>a-b)[Math.floor(q*(ds.length-1))]*f;
  return P.map(([x,y],i)=>ds[i]>r?[cx+(x-cx)*r/ds[i], cy+(y-cy)*r/ds[i]]:[x,y]); }
// map a layout into a w×h box, keeping the aspect (a little stretch allowed)
function fit(pos, w, h, pad=26, stretch=1.35){
  let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;
  for(const [x,y] of pos){ x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y); }
  const sx=(w-2*pad)/((x1-x0)||1), sy=(h-2*pad)/((y1-y0)||1), s=Math.min(sx,sy), ax=Math.min(sx,s*stretch), ay=Math.min(sy,s*stretch);
  const ox=(w-(x1-x0)*ax)/2, oy=(h-(y1-y0)*ay)/2;
  return pos.map(([x,y])=>[ox+(x-x0)*ax, oy+(y-y0)*ay]);
}
// small preferential-attachment communities
function commNet(sizes, seed, inter){
  const R=rng(seed), edges=[], comm=[], birth=[]; let base=0; const has=new Set();
  const add=(a,b)=>{ const k=a<b?a+'-'+b:b+'-'+a; if(a===b||has.has(k)) return; has.add(k); edges.push([a,b]); };
  sizes.forEach((sz,c)=>{
    const rep=[];
    for(let i=0;i<sz;i++){ const v=base+i; comm[v]=c; birth[v]=i*sizes.length+c;
      if(i===1){ add(v,base); rep.push(v,base); }
      else if(i>1){ const m=R()<.35?2:1, t=new Set(); while(t.size<Math.min(m,i)) t.add(rep[Math.floor(R()*rep.length)]); for(const u of t){ add(v,u); rep.push(v,u); } } }
    base+=sz; });
  const n=base, deg=Array(n).fill(0); edges.forEach(([a,b])=>{deg[a]++;deg[b]++;});
  for(let k=0;k<inter;k++){ const c1=k%sizes.length, c2=(c1+1)%sizes.length;
    const pick=c=>{ const vs=d3range(n).filter(v=>comm[v]===c).sort((a,b)=>deg[b]-deg[a]); return vs[Math.floor(R()*Math.min(4,vs.length))]; };
    add(pick(c1),pick(c2)); }
  return {n, edges, comm, birth};
}
const d3range=n=>Array.from({length:n},(_,i)=>i);
const degrees=(n,edges)=>{ const d=Array(n).fill(0); edges.forEach(([a,b])=>{d[a]++;d[b]++;}); return d; };

/* ---------------- drawing ---------------- */
function dot(ctx,x,y,r,col,blur=10,alpha=1){ ctx.save(); ctx.globalAlpha=alpha; ctx.shadowColor=col; ctx.shadowBlur=blur; ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); ctx.restore(); }
function ring(ctx,x,y,r,col,lw=2,alpha=1){ ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.shadowColor=col; ctx.shadowBlur=8; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.stroke(); ctx.restore(); }
function seg(ctx,a,b,col,lw=1.5,alpha=1,dash){ ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle=col; ctx.lineWidth=lw; if(dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke(); ctx.restore(); }
function arrow(ctx,a,b,col,lw,alpha,rb){
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L, tip=[b[0]-ux*(rb+2), b[1]-uy*(rb+2)], hs=6+lw*1.5;
  seg(ctx,a,[tip[0]-ux*hs*.6,tip[1]-uy*hs*.6],col,lw,alpha);
  ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(tip[0],tip[1]);
  ctx.lineTo(tip[0]-ux*hs-uy*hs*.55, tip[1]-uy*hs+ux*hs*.55); ctx.lineTo(tip[0]-ux*hs+uy*hs*.55, tip[1]-uy*hs-ux*hs*.55); ctx.closePath(); ctx.fill(); ctx.restore();
}
function label(ctx,txt,x,y,col,size=12,align='center',font='Share Tech Mono'){ ctx.save(); ctx.font=`${size}px '${font}', monospace`; ctx.fillStyle=col; ctx.textAlign=align; ctx.textBaseline='middle'; ctx.shadowColor='#000'; ctx.shadowBlur=6; ctx.fillText(txt,x,y); ctx.restore(); }
function segDist(p,a,b){ const dx=b[0]-a[0], dy=b[1]-a[1], L2=dx*dx+dy*dy||1, t=clamp(((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L2,0,1); return Math.hypot(p[0]-a[0]-t*dx, p[1]-a[1]-t*dy); }

/* ---------------- graph helpers ---------------- */
const LAB='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const adjOf=(n,E)=>{ const a=Array.from({length:n},()=>[]); E.forEach(([x,y])=>{a[x].push(y);a[y].push(x);}); return a; };
const matOf=(n,E,dir)=>{ const M=Array.from({length:n},()=>Array(n).fill(0)); E.forEach(([x,y])=>{ M[x][y]=1; if(!dir) M[y][x]=1; }); return M; };
function bfs(adj,s){ const d=Array(adj.length).fill(-1), par=Array(adj.length).fill(-1); d[s]=0; const q=[s]; while(q.length){ const u=q.shift(); for(const x of adj[u]) if(d[x]<0){ d[x]=d[u]+1; par[x]=u; q.push(x); } } return {d,par}; }
function pathTo(par,t){ const p=[]; for(let v=t; v>=0; v=par[v]) p.unshift(v); return p; }
const ekey=(a,b)=>Math.min(a,b)+'-'+Math.max(a,b);
function nodeL(ctx,x,y,r,col,txt,tc=COL.bg){ dot(ctx,x,y,r,col,10); if(txt) label(ctx,txt,x,y+1,tc,Math.max(9,Math.round(r*1.05)),'center','Orbitron'); }
function inBox(P,R,pad=22,stretch=1.4){ return fit(P,R[2],R[3],pad,stretch).map(([x,y])=>[x+R[0],y+R[1]]); }
function title(ctx,txt,R,col=COL.dim){ label(ctx,txt,R[0]+10,R[1]+12,col,11,'left'); }
function drawMatrix(ctx,M,x0,y0,cs,L,hi){
  const n=M.length, fs=Math.max(10,Math.min(15,cs*.52));
  for(let i=0;i<n;i++){ label(ctx,L[i],x0+cs*(i+1.5),y0+cs*.5,COL.ink2,fs); label(ctx,L[i],x0+cs*.5,y0+cs*(i+1.5),COL.ink2,fs); }
  for(let i=0;i<n;i++) for(let j=0;j<n;j++){ const x=x0+cs*(j+1), y=y0+cs*(i+1), c=hi&&hi(i,j);
    if(c){ ctx.save(); ctx.fillStyle=c; ctx.globalAlpha=.85; ctx.fillRect(x+1,y+1,cs-2,cs-2); ctx.restore(); }
    ctx.save(); ctx.strokeStyle=COL.line; ctx.lineWidth=1; ctx.strokeRect(x+.5,y+.5,cs-1,cs-1); ctx.restore();
    label(ctx,String(M[i][j]),x+cs/2,y+cs/2+1,c?COL.bg:(M[i][j]?COL.cyan:COL.dim),fs); }
}
function tokens(ctx,x,y,parts,size=13){ ctx.save(); ctx.font=`${size}px 'Share Tech Mono', monospace`; ctx.textBaseline='middle';
  for(const {t,c} of parts){ ctx.fillStyle=c; ctx.fillText(t,x,y); x+=ctx.measureText(t).width; } ctx.restore(); }
function nearest(p,x,y,r=26){ let b=-1,bd=r; p.forEach((q,i)=>{ const d=Math.hypot(q[0]-x,q[1]-y); if(d<bd){bd=d;b=i;} }); return b; }


// connected components (union-find): label of each node, largest component
function comps(n, E){ const par=d3range(n), f=x=>{ while(par[x]!==x){ par[x]=par[par[x]]; x=par[x]; } return x; };
  E.forEach(([a,b])=>{ const A=f(a), B=f(b); if(A!==B) par[A]=B; });
  const size={}; for(let i=0;i<n;i++){ const r=f(i); size[r]=(size[r]||0)+1; }
  let big=-1, bs=0; for(const r in size) if(size[r]>bs){ bs=size[r]; big=+r; }
  return {lab:d3range(n).map(f), big, bigSize:bs, n:Object.keys(size).length}; }

/* ---------------- scene plumbing ---------------- */
const stage=document.getElementById('stage'), bNext=document.getElementById('bNext'), bBack=document.getElementById('bBack');
let cur=null, cleanups=[], idx=0;
function canvasIn(parent, onTap){
  const cv=document.createElement('canvas'); parent.appendChild(cv);
  const o={cv, ctx:cv.getContext('2d'), w:0, h:0, v:0};
  const ro=new ResizeObserver(()=>{ const r=parent.getBoundingClientRect(), d=window.devicePixelRatio||1; if(!r.width||!r.height) return;
    o.w=r.width; o.h=r.height; cv.width=Math.round(o.w*d); cv.height=Math.round(o.h*d); cv.style.width=o.w+'px'; cv.style.height=o.h+'px'; o.ctx.setTransform(d,0,0,d,0,0); o.v++; });
  ro.observe(parent); cleanups.push(()=>ro.disconnect());
  if(onTap) cv.addEventListener('pointerdown',e=>{ const r=cv.getBoundingClientRect(); onTap(e.clientX-r.left, e.clientY-r.top); });
  o.clear=()=>o.ctx.clearRect(0,0,o.w,o.h);
  return o;
}
function award(key, pts){
  if(key in S.xp) return false;
  S.xp[key]=pts; save(); updXP(pts); return true;
}
function updXP(pop){
  const x=document.getElementById('xp'); x.textContent=totalXP()+' XP';
  if(pop){ const p=el('span','pop','+'+pop); x.appendChild(p); setTimeout(()=>p.remove(),1300); }
}
function setNext(txt, enabled=true){ bNext.textContent=txt; bNext.disabled=!enabled; }
function typeLines(box, lines, done){
  // lines: strings; "VERA:" prefix gets the handler's colour
  let li=0, ci=0, finished=false; const token={}; cur.token=token;
  const html=()=>{ let s=''; for(let i=0;i<lines.length && i<=li;i++){ const full=lines[i], txt=i<li?full:full.slice(0,ci); s+=fmt(txt, full)+(i<li?'\n':''); } return s; };
  const fmt=(t,full)=>{ const esc=t.replace(/&/g,'&amp;').replace(/</g,'&lt;'); if(full.startsWith('VERA:')){ const n=Math.min(5,esc.length); return `<span class="v">${esc.slice(0,n)}</span>${esc.slice(n)}`; } return esc; };
  const finish=()=>{ if(finished) return; finished=true; li=lines.length; box.innerHTML=html()+'<span class="c"></span>'; done&&done(); };
  const tick=()=>{ if(cur.token!==token||finished) return;
    if(li>=lines.length){ finish(); return; }
    ci++; if(ci>lines[li].length){ li++; ci=0; box.innerHTML=html()+'<span class="c"></span>'; setTimeout(tick, li<lines.length?380:0); return; }
    box.innerHTML=html()+'<span class="c"></span>'; setTimeout(tick, lines[li][ci-1]===' '?8:20); };
  tick();
  return finish;
}

function go(i){
  cleanups.forEach(f=>f()); cleanups=[]; stage.innerHTML=''; stage.className=''; stage.scrollTop=0;
  idx=clamp(i,0,SCENES.length-1); S.at=idx; S.max=Math.max(S.max||0,idx); save(); closeJump();
  const sc=SCENES[idx]; cur={draw:null, token:null};
  document.body.classList.toggle('notop', sc.kind==='title');
  document.body.classList.toggle('nonav', sc.kind==='title'||sc.kind==='end');
  bBack.disabled = idx<=1;
  const prog=document.getElementById('prog'); prog.innerHTML='';
  for(let k=1;k<SCENES.length;k++){ const s=el('i'); if(k<idx) s.className='done'; if(k===idx) s.className='cur';
    if(k<=S.max && k!==idx){ s.classList.add('go'); s.title=sceneName(k); s.onclick=()=>go(k); } prog.appendChild(s); }
  document.getElementById('bMenu').style.visibility = S.max>1 ? 'visible' : 'hidden';
  updXP(); dbg();
  BUILD[sc.kind](sc);
  tex(stage);
}
function sceneName(k){ const sc=SCENES[k]; return sc.nm || (sc.title ? sc.title.charAt(0)+sc.title.slice(1).toLowerCase() : ''); }
function jumpList(box){ box.innerHTML='';
  for(let k=1;k<SCENES.length;k++){ const sc=SCENES[k], ch=!['story','card','end','title'].includes(sc.kind);
    const kk=sc.key||sc.kind, xp = Object.keys(S.xp).filter(k=>k===kk || (k.startsWith(kk) && /^\d+$/.test(k.slice(kk.length)))).reduce((a,k)=>a+S.xp[k],0);
    const b=el('button', k===idx?'here':null, `<span>${k}. ${sceneName(k)}</span><small>${k>S.max?'🔒':ch?(xp?'+'+xp+' XP':sc.kind==='boss'?'mission':'challenge'):''}</small>`);
    b.disabled = k>S.max; b.onclick=()=>go(k); box.appendChild(b); } }
const jump=document.getElementById('jump');
function openJump(){ jumpList(document.getElementById('jl')); jump.classList.add('on'); }
function closeJump(){ jump.classList.remove('on'); }
document.getElementById('bMenu').onclick=openJump;
document.getElementById('bJx').onclick=closeJump;
jump.addEventListener('click',e=>{ if(e.target===jump) closeJump(); });
bNext.onclick=()=>{ if(cur&&cur.onNext&&cur.onNext()===false) return; go(idx+1); };
bBack.onclick=()=>go(idx-1);
function loop(t){ if(cur&&cur.draw) cur.draw(t); requestAnimationFrame(loop); }
requestAnimationFrame(loop);

const BUILD={};

/* ---------------- TITLE ---------------- */
BUILD.title=()=>{
  stage.className='full';
  const box=el('div','title'); stage.appendChild(box);
  const C=canvasIn(box);
  const over=el('div','over');
  const has=S.at>1 || totalXP()>0;
  over.innerHTML=`<div class="chap">${LEVEL.chapter}</div><h1 class="logo">NEXUS</h1><div class="subt">${LEVEL.sub||'// a network science campaign'}</div>`;
  const b=el('button','start', has?'CONTINUE ▸':'START ▸'); b.onclick=()=>go(has?Math.max(1,S.at):1); over.appendChild(b);
  if(S.max>1){ const j=el('button',null,'☰ JUMP TO A PAGE'); j.style.cssText='min-height:46px;padding:0 20px;font-size:13px;color:var(--cyan);border-color:rgba(56,225,255,.5)'; j.onclick=openJump; over.appendChild(j); }
  if(has){ const r=el('button','reset','start again from scratch'); r.onclick=()=>{ S={xp:{},at:0,max:0,best:S.best||0}; save(); go(1); }; over.appendChild(r); }
  const all=el('a','reset','◂ all levels'); all.href='index.html'; all.style.marginTop='4px'; over.appendChild(all);
  box.appendChild(over);
  // a network grows from a single node; pulses run along the links
  let nodes=[], links=[], pulses=[], v=-1, t0=0, lastAdd=0, R=rng(7);
  cur.draw=t=>{
    const {ctx,w,h}=C; if(!w) return;
    if(C.v!==v){ v=C.v; nodes=[[w/2,h/2,0]]; links=[]; pulses=[]; t0=t; lastAdd=t; }
    const target=Math.round(w*h/5200);
    if(nodes.length<Math.min(140,target) && t-lastAdd>90){ lastAdd=t;
      for(let tries=0;tries<20;tries++){ const base=nodes[Math.floor(R()*nodes.length)], a=R()*7, d=34+R()*40, x=base[0]+Math.cos(a)*d, y=base[1]+Math.sin(a)*d;
        if(x<10||y<10||x>w-10||y>h-10) continue; if(nodes.some(n=>Math.hypot(n[0]-x,n[1]-y)<24)) continue;
        const id=nodes.length; nodes.push([x,y,t]);
        const near=nodes.slice(0,id).map((n,j)=>[Math.hypot(n[0]-x,n[1]-y),j]).sort((p,q)=>p[0]-q[0]);
        const m=R()<.3?2:1; for(let k=0;k<m&&k<near.length;k++) links.push([id,near[k][1],t]);
        break; } }
    if(links.length && R()<.08) { const L=links[Math.floor(R()*links.length)]; pulses.push([L[0],L[1],t, R()<.5]); }
    ctx.clearRect(0,0,w,h);
    for(const [a,b,tb] of links){ const k=clamp((t-tb)/400,0,1), A=nodes[a], B=nodes[b];
      seg(ctx,A,[lerp(A[0],B[0],k),lerp(A[1],B[1],k)],COL.cyan,1,.28); }
    pulses=pulses.filter(p=>t-p[2]<900);
    for(const [a,b,tp,rev] of pulses){ const k=(t-tp)/900, A=nodes[rev?b:a], B=nodes[rev?a:b]; dot(ctx,lerp(A[0],B[0],k),lerp(A[1],B[1],k),2.2,COL.mag,10,.9); }
    nodes.forEach(([x,y,tb],i)=>{ const k=clamp((t-tb)/300,0,1); dot(ctx,x,y,(i===0?5:2.8)*k,i===0?COL.mag:COL.cyan,i===0?18:8,.85); });
  };
};

/* ---------------- STORY ---------------- */
BUILD.story=sc=>{
  setNext(sc.next||'CONTINUE ▸', false);
  const box=el('div','story'); stage.appendChild(box);
  const bgw=el('div'); bgw.style.cssText='position:absolute;inset:0'; box.appendChild(bgw);
  const C=canvasIn(bgw);
  const term=el('div','term'); box.appendChild(term);
  const sk=el('button','skip','tap to skip'); sk.style.background='none'; sk.style.border='none'; box.appendChild(sk);
  const fin=typeLines(term, sc.lines, ()=>{ setNext(sc.next||'CONTINUE ▸', true); sk.style.visibility='hidden'; });
  box.addEventListener('click',()=>fin());
  // drifting background mesh
  const R=rng(3); let pts=null, v=-1;
  cur.draw=t=>{ const {ctx,w,h}=C; if(!w) return;
    if(C.v!==v){ v=C.v; pts=d3range(Math.round(w*h/9000)).map(()=>({x:R()*w,y:R()*h,vx:(R()-.5)*.15,vy:(R()-.5)*.15,ph:R()*7})); }
    ctx.clearRect(0,0,w,h);
    for(const p of pts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1; }
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){ const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y); if(d<90) seg(ctx,[pts[i].x,pts[i].y],[pts[j].x,pts[j].y],COL.cyan,1,.18*(1-d/90)); }
    for(const p of pts){ const g=.5+.5*Math.sin(t/900+p.ph); dot(ctx,p.x,p.y,1.8+g,g>.97?COL.mag:COL.cyan,6,.35+.4*g); }
  };
};

/* ---------------- CONCEPT CARDS ---------------- */
BUILD.card=sc=>{
  setNext('GOT IT ▸', true);
  stage.appendChild(el('div','h fade',`<small>// ${sc.tag}</small>${sc.title}`));
  stage.appendChild(el('div','vera fade',`<b>VERA:</b> ${sc.vera}`));
  const a=el('div','anim fade'); stage.appendChild(a);
  const cap=el('div','cap');
  const C=canvasIn(a); a.appendChild(cap);
  if(sc.pts){ const ul=el('ul','pts fade'); sc.pts.forEach(p=>ul.appendChild(el('li',null,p))); stage.appendChild(ul); }
  if(sc.extra){ stage.appendChild(el('div',(sc.extraCls||'')+' fade',sc.extra)); }
  ANIM[sc.anim](C, cap);
};
const ANIM={};

/* ---------------- shared end-of-level summary ---------------- */
function endSummary(box, xp, rank, learned, nextHref, nextLabel){
  S.done=true; save();
  box.innerHTML=`<div class="score fade"><div class="big">${xp}</div><div class="lab">XP earned in this level</div><div class="rank">${rank}</div></div>
    <div class="card fade"><h3>WHAT YOU LEARNED</h3><ul class="pts">${learned.map(l=>'<li>'+l+'</li>').join('')}</ul></div>
    <div class="card fade"><h3>REVISIT ANY PAGE</h3><div class="jl" id="eJl"></div></div>
    <div class="btnrow fade"><button id="eRe">↻ TITLE SCREEN</button>${nextHref?`<button class="btn-main" id="eNx">${nextLabel} ▸</button>`:`<button class="btn-main" disabled>${nextLabel}</button>`}</div>`;
  jumpList(document.getElementById('eJl')); tex(box);
  document.getElementById('eRe').onclick=()=>go(0);
  if(nextHref) document.getElementById('eNx').onclick=()=>{ location.href=nextHref; };
}
function start(){
  document.querySelector('.top .lv').textContent=LEVEL.label;
  const qs=new URLSearchParams(location.search);
  const bi=SCENES.findIndex(s=>s.kind==='boss');
  updXP(); go(qs.has('scene') ? +qs.get('scene') : qs.has('boss')&&bi>0 ? bi : 0);
}

/* ---------------- generic multi-step challenge ----------------
   sc = {kind:'steps', key, tag, title, vera, items:[{icon, sys, q, o:[...], a, why, pts,
         canvas:(C,t,st,answered)=>{}, tap:(x,y,st)=>({ok:true}|{no:'msg'}|null), h}]}
   Every item is worth `pts` (default 5) on the first try, 2 afterwards.                    */
BUILD.steps=sc=>{
  const key=sc.key, n=sc.items.length, all=sc.items.every((_,i)=>(key+i) in S.xp);
  setNext('NEXT ▸', all);
  stage.appendChild(el('div','h',`<small>// ${sc.tag}</small>${sc.title}`));
  if(sc.vera) stage.appendChild(el('div','vera',`<b>VERA:</b> ${sc.vera}`));
  const wrap=el('div'); stage.appendChild(wrap);
  let i=0;
  const show=()=>{
    const it=sc.items[i]; wrap.innerHTML=''; cur.draw=null; dbg('Q'+(i+1));
    const c=el('div','qcard fade');
    c.innerHTML = it.icon ? `<div class="qtop"><div class="qicon">${it.icon}</div><div><div class="qn">${sc.unit||'QUESTION'} ${i+1} / ${n}</div><div class="qsys">${it.sys||''}</div></div></div>`
                          : `<div class="qn">${sc.unit||'QUESTION'} ${i+1} / ${n}</div>`;
    c.appendChild(el('div','qtext',it.q));
    let first=true, answered=false; const st={}; const fb=el('div','fb');
    const right=()=>{ if(answered) return; answered=true; const pts=first?(it.pts||5):2, got=award(key+i,pts);
      fb.className='fb ok'; fb.innerHTML=`> right${it.why?': '+it.why:'.'} ${got?'<b>+'+pts+' XP</b>':''}`; tex(fb);
      const last=i===n-1, nb=el('button','btn-main', last?'ALL DONE ✓':'NEXT ▸'); nb.style.minHeight='48px';
      if(!last) nb.onclick=()=>{ i++; show(); stage.scrollTop=0; }; else { nb.disabled=true; setNext('NEXT ▸',true); }
      c.appendChild(nb); };
    const wrong=msg=>{ if(answered) return; first=false; fb.className='fb no'; fb.textContent='> '+(msg||'no. try again.'); };
    if(it.canvas){ const a=el('div','anim'); a.style.height=it.h||'min(36vh,300px)'; a.style.minHeight='220px'; c.appendChild(a);
      const C=canvasIn(a,(x,y)=>{ if(answered||!it.tap) return; if(C.w) it.canvas(C,performance.now(),st,answered); const r=it.tap(x,y,st,C); if(!r) return; if(r.ok) right(); else wrong(r.no); });
      cur.draw=t=>{ if(C.w) it.canvas(C,t,st,answered); }; }
    if(it.o){ const opts=el('div','opts'); it.o.forEach((o,k)=>{ const b=el('button',null,o); b.onclick=()=>{ if(answered) return;
        if(k===it.a){ b.className='ok'; right(); } else { b.className='no'; b.disabled=true; wrong(it.no&&it.no[k]); } }; opts.appendChild(b); }); c.appendChild(opts); }
    c.appendChild(fb); wrap.appendChild(c); tex(c); };
  show();
};
