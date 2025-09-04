// app.js — Boolean Games (6 mini-giochi)
(() => {
  'use strict';
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const rnd = n => Math.floor(Math.random()*n);
  const choice = arr => arr[rnd(arr.length)];
  function setText(id, txt){ $(id).textContent = txt; }

  const score = {
    total:0,
    best: parseInt(localStorage.getItem('booleanGames.best')||'0',10),
    add(n){ this.total+=n; if(this.total>this.best){ this.best=this.total; localStorage.setItem('booleanGames.best', String(this.best)); } updateScore(); }
  };
  function updateScore(){ const a=$('#scoreTotal'), b=$('#scoreBest'); if(a) a.textContent=String(score.total); if(b) b.textContent=String(score.best); }
  updateScore();
  window.resetBest = () => { localStorage.removeItem('booleanGames.best'); score.best=0; updateScore(); };

  function randomAST(vars=['A','B','C'], depth=0){
    if(depth>2) return {type:'var', name: choice(vars)};
    const t = choice(['var','not','and','or','xor','impl']);
    if(t==='var') return {type:'var', name: choice(vars)};
    if(t==='not') return {type:'not', x: randomAST(vars, depth+1)};
    const a = randomAST(vars, depth+1);
    const b = randomAST(vars, depth+1);
    return {type:t, a, b};
  }
  function evalAST(ast, env){
    switch(ast.type){
      case 'var': return !!env[ast.name];
      case 'not': return !evalAST(ast.x, env);
      case 'and': return evalAST(ast.a, env) && evalAST(ast.b, env);
      case 'or':  return evalAST(ast.a, env) || evalAST(ast.b, env);
      case 'xor': return !!(evalAST(ast.a, env) ^ evalAST(ast.b, env));
      case 'impl':return (!evalAST(ast.a, env)) || evalAST(ast.b, env);
    }
  }
  function astToString(ast){
    switch(ast.type){
      case 'var': return ast.name;
      case 'not': return '¬(' + astToString(ast.x) + ')';
      case 'and': return '(' + astToString(ast.a) + ' ∧ ' + astToString(ast.b) + ')';
      case 'or':  return '(' + astToString(ast.a) + ' ∨ ' + astToString(ast.b) + ')';
      case 'xor': return '(' + astToString(ast.a) + ' ⊕ ' + astToString(ast.b) + ')';
      case 'impl':return '(' + astToString(ast.a) + ' → ' + astToString(ast.b) + ')';
    }
  }
  function astAnnotated(ast, env){
    switch(ast.type){
      case 'var': return env[ast.name] ? 'T' : 'F';
      case 'not': return '¬(' + astAnnotated(ast.x, env) + ')';
      case 'and': return '(' + astAnnotated(ast.a, env) + ' ∧ ' + astAnnotated(ast.b, env) + ')';
      case 'or':  return '(' + astAnnotated(ast.a, env) + ' ∨ ' + astAnnotated(ast.b, env) + ')';
      case 'xor': return '(' + astAnnotated(ast.a, env) + ' ⊕ ' + astAnnotated(ast.b, env) + ')';
      case 'impl':return '(' + astAnnotated(ast.a, env) + ' → ' + astAnnotated(ast.b, env) + ')';
    }
  }

  const K_COLS = [[0,0],[0,1],[1,1],[1,0]];
  function idxToABC(idx){ const row=Math.floor(idx/4), col=idx%4; const [b,c]=K_COLS[col]; const a=row; return {A:!!a, B:!!b, C:!!c}; }
  function idxToABCD(idx){ const row=Math.floor(idx/4), col=idx%4; const [a,b]=K_COLS[row], [c,d]=K_COLS[col]; return {A:!!a, B:!!b, C:!!c, D:!!d}; }

  // 1) Verità o Falso
  const VF = {
    ast:null, env:null, ans:null,
    newRound(){
      this.ast = randomAST(['A','B','C']);
      this.env = {A:!!rnd(2),B:!!rnd(2),C:!!rnd(2)};
      this.ans = evalAST(this.ast, this.env);
      const e1=$('#vfExpr'), e2=$('#vfAssign');
      if(e1) e1.textContent = astToString(this.ast);
      if(e2) e2.textContent = `A=${this.env.A?1:0} B=${this.env.B?1:0} C=${this.env.C?1:0}`;
      const h=$('#vfHint'), f=$('#vfFeedback'); if(h) h.textContent=''; if(f) f.textContent='';
    },
    answer(val){
      const ok = (val===this.ans);
      const fb=$('#vfFeedback'); if(fb) fb.innerHTML = ok? '<span class="ok">Corretto! +1</span>' : '<span class="bad">Sbagliato</span>';
      if (ok) score.add(1);
      this.newRound();
    },
    hint(){ if(!this.ast) return; const hh=$('#vfHint'); if(hh) hh.textContent = 'Suggerimento: '+astAnnotated(this.ast, this.env); }
  };
  window.VF = VF; VF.newRound();

  // 2) K-map 3
  const KMAP = {
    ast:null, target:new Array(8).fill(0), player:new Array(8).fill(0),
    buildGrid(){
      const grid=$('#kmapGrid'); if(!grid) return;
      grid.innerHTML='';
      const head=t=>{const d=document.createElement('div'); d.className='khead mono'; d.textContent=t; return d;};
      const cell=i=>{const d=document.createElement('div'); d.className='kcell mono'; d.textContent='0'; d.addEventListener('click',()=>{this.player[i]^=1; d.textContent=this.player[i]?'1':'0'; d.classList.toggle('active', !!this.player[i]);}); return d;};
      grid.appendChild(head('A\\BC')); ['00','01','11','10'].forEach(s=>grid.appendChild(head(s)));
      grid.appendChild(head('A=0')); for(let c=0;c<4;c++) grid.appendChild(cell(c));
      grid.appendChild(head('A=1')); for(let c=0;c<4;c++) grid.appendChild(cell(4+c));
    },
    updateExpr(){ const el=$('#kmapExpr'); if(el) el.textContent = astToString(this.ast); },
    newPuzzle(){
      this.ast = randomAST(['A','B','C']); this.updateExpr();
      for(let i=0;i<8;i++){ const env=idxToABC(i); this.target[i]=evalAST(this.ast, env)?1:0; this.player[i]=0; }
      $$('#kmapGrid .kcell').forEach(d=>{d.textContent='0'; d.classList.remove('active');});
      const m=$('#kmapMsg'); if(m) m.textContent='Compila la mappa per coincidere con la funzione.';
    },
    hint(){
      for(let i=0;i<8;i++) if(this.player[i]!==this.target[i]){ this.player[i]=this.target[i]; const d=$$('#kmapGrid .kcell')[i]; d.textContent=this.player[i]?'1':'0'; d.classList.toggle('active', !!this.player[i]); const m=$('#kmapMsg'); if(m) m.textContent=`Hint: cella ${i} corretta.`; return; }
      const m=$('#kmapMsg'); if(m) m.textContent='Nessun hint disponibile.';
    },
    check(){
      let right=0; for(let i=0;i<8;i++) if(this.player[i]===this.target[i]) right++;
      const m=$('#kmapMsg');
      if(right===8){ if(m) m.innerHTML='<span class="ok">Perfetto! +3</span>'; score.add(3); this.newPuzzle(); }
      else if(m) m.textContent = `${right}/8 corrette. Continua!`;
    },
    solve(){ for(let i=0;i<8;i++) this.player[i]=this.target[i]; $$('#kmapGrid .kcell').forEach((d,i)=>{ d.textContent=this.player[i]?'1':'0'; d.classList.toggle('active', !!this.player[i]); }); const m=$('#kmapMsg'); if(m) m.textContent='Soluzione mostrata.'; },
    clear(){ this.player.fill(0); $$('#kmapGrid .kcell').forEach(d=>{ d.textContent='0'; d.classList.remove('active'); }); const m=$('#kmapMsg'); if(m) m.textContent='Mappa pulita.'; }
  };
  window.KMAP = KMAP; KMAP.buildGrid(); KMAP.newPuzzle();

  // 3) SAT 3-CNF
  function literalToString(lit){ const v=['A','B','C'][Math.abs(lit)-1]; return lit>0? v : '¬'+v; }
  function clauseToString(cl){ return '('+cl.map(literalToString).join(' ∨ ')+')'; }
  function evalClause(cl, env){ return cl.some(lit=>{ const v=['A','B','C'][Math.abs(lit)-1]; const val=env[v]; return lit>0 ? !!val : !val; }); }
  const SAT = {
    clauses:[], solution:{A:false,B:false,C:false}, env:{A:false,B:false,C:false},
    newPuzzle(){
      this.solution = {A:!!rnd(2), B:!!rnd(2), C:!!rnd(2)};
      this.env = {A:false,B:false,C:false};
      this.clauses = [];
      const lits=[1,2,3];
      for(let i=0;i<4;i++){
        const v = choice(lits);
        const sign = this.solution[['A','B','C'][v-1]] ? +1 : -1;
        let clause=[sign*v];
        const others=lits.filter(x=>x!==v);
        others.forEach(o=> clause.push( (rnd(2)?+1:-1) * o ));
        clause.sort(()=>Math.random()-0.5);
        this.clauses.push(clause);
      }
      this.render(); const s=$('#satMsg'); if(s) s.textContent='Imposta A,B,C per rendere tutte le clausole vere.';
    },
    render(){
      const a=$('#satA'), b=$('#satB'), c=$('#satC');
      if(a) a.checked=this.env.A; if(b) b.checked=this.env.B; if(c) c.checked=this.env.C;
      const box=$('#satClauses'); if(box) { box.innerHTML=''; const env=this.env; this.clauses.forEach(cl=>{ const ok=evalClause(cl,env); const div=document.createElement('div'); div.className='clause mono'+(ok?' ok':''); div.textContent=clauseToString(cl); box.appendChild(div); }); }
      const allOk=this.clauses.every(cl=>evalClause(cl,this.env));
      const s=$('#satMsg');
      if(allOk){ if(s) s.innerHTML='<span class="ok">Risolto! +2</span>'; score.add(2); setTimeout(()=>this.newPuzzle(),600); }
      else if(s) s.textContent='';
    },
    update(){ const a=$('#satA'), b=$('#satB'), c=$('#satC'); this.env.A=!!(a&&a.checked); this.env.B=!!(b&&b.checked); this.env.C=!!(c&&c.checked); this.render(); },
    hint(){ for(const v of ['A','B','C']){ if(this.env[v]!==this.solution[v]){ this.env[v]=this.solution[v]; this.render(); const s=$('#satMsg'); if(s) s.textContent=`Hint: imposta ${v} = ${this.solution[v]?1:0}`; return; } } const s=$('#satMsg'); if(s) s.textContent='Nessun hint disponibile.'; },
    reset(){ this.env={A:false,B:false,C:false}; this.render(); }
  };
  window.SAT = SAT; SAT.newPuzzle();

  // 4) K-map 4
  const KMAP4 = {
    ast:null, target:new Array(16).fill(0), player:new Array(16).fill(0),
    buildGrid(){
      const g=$('#kmap4Grid'); if(!g) return; g.innerHTML='';
      const head=t=>{const d=document.createElement('div'); d.className='khead mono'; d.textContent=t; return d;};
      const cell=i=>{const d=document.createElement('div'); d.className='kcell mono'; d.textContent='0'; d.addEventListener('click',()=>{this.player[i]^=1; d.textContent=this.player[i]?'1':'0'; d.classList.toggle('active', !!this.player[i]);}); return d;};
      g.appendChild(head('AB\\CD')); ['00','01','11','10'].forEach(s=>g.appendChild(head(s)));
      ['00','01','11','10'].forEach((r,ri)=>{ g.appendChild(head(r)); for(let c=0;c<4;c++) g.appendChild(cell(ri*4+c)); });
    },
    updateExpr(){ const el=$('#kmap4Expr'); if(el) el.textContent = astToString(this.ast); },
    newPuzzle(){
      this.ast = randomAST(['A','B','C','D']); this.updateExpr();
      for(let i=0;i<16;i++){ const env=idxToABCD(i); this.target[i]=evalAST(this.ast, env)?1:0; this.player[i]=0; }
      $$('#kmap4Grid .kcell').forEach(d=>{d.textContent='0'; d.classList.remove('active');});
      const m=$('#kmap4Msg'); if(m) m.textContent='Compila la mappa per coincidere con la funzione.';
    },
    hint(){
      for(let i=0;i<16;i++) if(this.player[i]!==this.target[i]){ this.player[i]=this.target[i]; const d=$$('#kmap4Grid .kcell')[i]; d.textContent=this.player[i]?'1':'0'; d.classList.toggle('active', !!this.player[i]); const m=$('#kmap4Msg'); if(m) m.textContent=`Hint: cella ${i} corretta.`; return; }
      const m=$('#kmap4Msg'); if(m) m.textContent='Nessun hint disponibile.';
    },
    check(){
      let right=0; for(let i=0;i<16;i++) if(this.player[i]===this.target[i]) right++;
      const m=$('#kmap4Msg');
      if(right===16){ if(m) m.innerHTML='<span class="ok">Perfetto! +5</span>'; score.add(5); this.newPuzzle(); }
      else if(m) m.textContent = `${right}/16 corrette. Continua!`;
    },
    solve(){ for(let i=0;i<16;i++) this.player[i]=this.target[i]; $$('#kmap4Grid .kcell').forEach((d,i)=>{ d.textContent=this.player[i]?'1':'0'; d.classList.toggle('active', !!this.player[i]); }); const m=$('#kmap4Msg'); if(m) m.textContent='Soluzione mostrata.'; },
    clear(){ this.player.fill(0); $$('#kmap4Grid .kcell').forEach(d=>{ d.textContent='0'; d.classList.remove('active'); }); const m=$('#kmap4Msg'); if(m) m.textContent='Mappa pulita.'; }
  };
  window.KMAP4 = KMAP4; KMAP4.buildGrid(); KMAP4.newPuzzle();

  // 5) Quine–McCluskey (≤4v)
  function toBin(n,w){ return n.toString(2).padStart(w,'0'); }
  function onesCount(s){ return (s.match(/1/g)||[]).length; }
  function canCombine(a,b){ let diff=0; for(let i=0;i<a.length;i++){ if(a[i]===b[i]) continue; if(a[i]!=='-' && b[i]!=='-') diff++; else return null; } return diff===1; }
  function combine(a,b){ let out=''; for(let i=0;i<a.length;i++){ if(a[i]===b[i]) out+=a[i]; else if(a[i]!=='-' && b[i]!=='-') out+='-'; else return null; } return out; }
  function maskCovers(mask, m){ const b=toBin(m, mask.length); for(let i=0;i<mask.length;i++){ if(mask[i]==='-') continue; if(mask[i]!==b[i]) return false; } return true; }
  function maskToTerm(mask, vars){ const t=[]; for(let i=0;i<mask.length;i++){ if(mask[i]==='-') continue; t.push(mask[i]==='1'? vars[i] : ('¬'+vars[i])); } return t.length? t.join(' ∧ ') : '1'; }
  const QM = {
    vars:['A','B','C','D'], minterms:[], dontcares:[], steps:'', result:'',
    newRandom(n=4){
      this.vars = ['A','B','C','D'].slice(0,n);
      const total = 1<<n;
      const ast = randomAST(this.vars);
      const mts=[];
      for(let m=0;m<total;m++){
        const env={}; this.vars.forEach((v,i)=> env[v]= !!((m>>((n-1)-i))&1));
        if(evalAST(ast, env)) mts.push(m);
      }
      if(mts.length===0 || mts.length===total) return this.newRandom(n);
      this.minterms=mts; this.dontcares=[]; this.compute();
    },
    compute(){
      const n=this.vars.length;
      const mts=[...this.minterms, ...this.dontcares];
      const steps=[];
      const groups = new Map();
      mts.forEach(m=>{ const s=toBin(m,n); const k=onesCount(s); if(!groups.has(k)) groups.set(k,[]); groups.get(k).push(s); });
      let lines=['Raggruppamento iniziale per numero di 1:'];
      Array.from(groups.keys()).sort((a,b)=>a-b).forEach(k=>{ lines.push('  '+k+': '+groups.get(k).join('  ')); });
      steps.push(lines.join('\n'));

      let current = new Set(mts.map(m=>toBin(m,n)));
      let primes = new Set(); let stage=1;
      while(true){
        const buckets={}; current.forEach(s=>{ const k=onesCount(s); (buckets[k] ||= []).push(s); });
        const used=new Set(); const combined=new Set(); const ks=Object.keys(buckets).map(Number).sort((a,b)=>a-b);
        const stageLines=['Combinazioni — Fase '+stage+':'];
        for(let i=0;i<ks.length-1;i++){ const A=buckets[ks[i]], B=buckets[ks[i+1]];
          for(const s1 of A) for(const s2 of B){ if(canCombine(s1,s2)){ const m=combine(s1,s2); combined.add(m); used.add(s1); used.add(s2); } } }
        const notUsed = Array.from(current).filter(s=>!used.has(s));
        if(notUsed.length){ stageLines.push('  Implicanti primi trovati: '+notUsed.sort().join('  ')); notUsed.forEach(s=>primes.add(s)); }
        else stageLines.push('  Nessun implicante primo nuovo in questa fase.');
        steps.push(stageLines.join('\n'));
        if(combined.size===0 || Array.from(combined).every(s=>current.has(s))) break;
        current = combined; stage++;
      }

      const primesList = Array.from(primes);
      const chart={}; primesList.forEach(pi=>chart[pi]=[]);
      this.minterms.forEach(m=>{ primesList.forEach(pi=>{ if(maskCovers(pi,m)) chart[pi].push(m); }); });
      lines=['\nTabella coperture (implicanti → minterms):']; Object.keys(chart).forEach(pi=> lines.push('  '+pi+' → '+JSON.stringify(chart[pi])));
      steps.push(lines.join('\n'));

      const mtToPis={}; Object.keys(chart).forEach(pi=>{ chart[pi].forEach(m=>{ (mtToPis[m] ||= []).push(pi); }); });
      const essential=new Set(); const covered=new Set();
      Object.keys(mtToPis).forEach(m=>{ const arr=mtToPis[m]; if(arr.length===1){ essential.add(arr[0]); chart[arr[0]].forEach(v=>covered.add(v)); } });
      if(essential.size) steps.push('Implicanti primi essenziali: '+Array.from(essential).sort().join('  ')); else steps.push('Nessun implicante primo essenziale unico.');

      let remaining = new Set(this.minterms.filter(m=>!covered.has(m)));
      const chosen = new Set(essential);
      while(remaining.size){
        let best=null, gain=-1;
        primesList.forEach(pi=>{ if(chosen.has(pi)) return; const g=chart[pi].filter(m=>remaining.has(m)).length; if(g>gain){ gain=g; best=pi; } });
        if(!best) break;
        chosen.add(best); chart[best].forEach(m=>remaining.delete(m));
      }
      steps.push('Scelta finale (copertura): '+Array.from(chosen).sort().join('  '));

      const terms = Array.from(chosen).map(pi=>maskToTerm(pi, this.vars));
      this.result = terms.length? terms.join(' ∨ ') : '0';
      this.steps = steps.join('\n\n');
      const m1=$('#qmMinterms'), m2=$('#qmDontcares'), r=$('#qmResult'), s=$('#qmSteps');
      if(m1) m1.textContent=this.minterms.join(', '); if(m2) m2.textContent=this.dontcares.length?('• DC: '+this.dontcares.join(', ')) : '';
      if(r) r.textContent=this.result; if(s) s.textContent=this.steps;
    },
    showSteps(){ const d=$('#qmStepsBox'); if(d) d.open=true; },
    copyResult(){ navigator.clipboard?.writeText(this.result); }
  };
  window.QM = QM; QM.newRandom(4);

  // 6) Circuiti logici
  const CIRCUIT = {
    nodes:[], counter:1, env:{A:false,B:false,C:false,D:false},
    reset(){ this.nodes=[]; this.counter=1; const c=$('#canvas'); if(c) c.innerHTML=''; this.populateOutSelect(); this.update(); },
    addGate(type){
      const id='G'+(this.counter++);
      const x=20+Math.random()*260, y=20+Math.random()*280;
      const node={id,type,a:null,b:null,x,y,value:false};
      this.nodes.push(node);
      const div=document.createElement('div');
      div.className='node'; div.style.left=x+'px'; div.style.top=y+'px'; div.dataset.id=id;
      div.innerHTML=`<div class="head"><span>${type}</span><span class="badge">${id}</span></div>
        <div class="body">
          <label>A:<select class="inA"></select></label>
          ${type!=='NOT'? '<label>B:<select class="inB"></select></label>' : ''}
          <span class="badge mono">out=<span class="val">0</span></span>
        </div>`;
      const canvas=$('#canvas'); if(canvas) canvas.appendChild(div);
      const fill=()=>{ const opts=['A','B','C','D', ...this.nodes.map(n=>n.id)]; div.querySelectorAll('select').forEach(sel=>{ const cur=sel.value; sel.innerHTML=opts.map(o=>`<option value="${o}">${o}</option>`).join(''); if(cur && opts.includes(cur)) sel.value=cur; }); };
      fill();
      const inA=div.querySelector('.inA'), inB=div.querySelector('.inB');
      if(inA) inA.addEventListener('change',()=>{node.a=inA.value; this.update();});
      if(inB) inB.addEventListener('change',()=>{node.b=inB.value; this.update();});
      node.a='A'; if(inA) inA.value='A'; if(node.type!=='NOT'){ node.b='B'; if(inB) inB.value='B'; }
      let ox=0,oy=0,sx=0,sy=0;
      div.addEventListener('pointerdown',e=>{div.setPointerCapture(e.pointerId); ox=parseFloat(div.style.left); oy=parseFloat(div.style.top); sx=e.clientX; sy=e.clientY;});
      div.addEventListener('pointermove',e=>{if(!sx&&!sy)return; div.style.left=(ox+(e.clientX-sx))+'px'; div.style.top=(oy+(e.clientY-sy))+'px';});
      div.addEventListener('pointerup',()=>{sx=0;sy=0;});
      $$('#canvas .node').forEach(n=>{ if(n===div) return; const opts=['A','B','C','D', ...this.nodes.map(nn=>nn.id)]; n.querySelectorAll('select').forEach(sel=>{ const cur=sel.value; sel.innerHTML=opts.map(o=>`<option value="${o}">${o}</option>`).join(''); if(cur && opts.includes(cur)) sel.value=cur; }); });
      this.populateOutSelect(); this.update();
    },
    resolveSignal(ref, seen=new Set()){
      if(['A','B','C','D'].includes(ref)) return !!this.env[ref];
      const node=this.nodes.find(n=>n.id===ref); if(!node) return false;
      if(seen.has(ref)) return false; seen.add(ref);
      const av=node.a ? this.resolveSignal(node.a, seen) : false;
      const bv=node.type==='NOT' ? false : (node.b ? this.resolveSignal(node.b, seen) : false);
      let out=false;
      switch(node.type){ case 'AND': out=av && bv; break; case 'OR': out=av || bv; break; case 'NOT': out=!av; break; case 'XOR': out=!!(av ^ bv); break; }
      node.value=out; const div=$(`#canvas .node[data-id="${node.id}"]`); if(div) div.querySelector('.val').textContent=out?'1':'0'; return out;
    },
    populateOutSelect(){ const sel=$('#outSelect'); if(!sel) return; const opts=['A','B','C','D', ...this.nodes.map(n=>n.id)]; sel.innerHTML=opts.map(o=>`<option value="${o}">${o}</option>`).join(''); },
    update(){
      const a=$('#inA'), b=$('#inB'), c=$('#inC'), d=$('#inD');
      this.env.A=!!(a&&a.checked); this.env.B=!!(b&&b.checked); this.env.C=!!(c&&c.checked); this.env.D=!!(d&&d.checked);
      const sel=$('#outSelect'); const target = sel? sel.value : 'A';
      const out = this.resolveSignal(target, new Set());
      const ov=$('#outValue'); if(ov) ov.textContent = `Output ${target} = ${out?1:0}`;
      const tt=$('#tt'); if(!tt) return;
      const rows=[];
      for(let m=0;m<16;m++){ const a=!!((m>>3)&1), b=!!((m>>2)&1), c=!!((m>>1)&1), d=!!(m&1); const env={A:a,B:b,C:c,D:d}; const old=this.env; this.env=env; const v=this.resolveSignal(target,new Set()); rows.push(`${a?1:0} ${b?1:0} ${c?1:0} ${d?1:0} | ${v?1:0}`); this.env=old; }
      tt.innerHTML = `<pre class="mono">A B C D | Y\n${rows.join('\n')}</pre>`;
    }
  };
  window.CIRCUIT = CIRCUIT; CIRCUIT.reset(); setTimeout(()=>{ const s=$('#outSelect'); if(s) s.value='A'; CIRCUIT.update(); }, 0);

})();