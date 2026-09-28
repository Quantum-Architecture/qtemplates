/* QE — export de preuve au format du vérificateur public ledger-verify (JSON Lines, prev_hash, hash = SHA-256 du JSON canonique).
   Les nombres non entiers sont écrits en chaînes, pour que JavaScript et Python calculent exactement la même empreinte. */
(function(){
  function norm(v){ if(v===null||v===undefined) return null; if(Array.isArray(v)) return v.map(norm);
    if(typeof v==='object'){ const o={}; Object.keys(v).forEach(k=>{ if(v[k]!==undefined) o[k]=norm(v[k]); }); return o; }
    if(typeof v==='number') return Number.isFinite(v)?(Number.isInteger(v)?v:String(v)):null; return v; }
  function canon(v){ if(v===null) return 'null'; if(Array.isArray(v)) return '['+v.map(canon).join(',')+']';
    if(typeof v==='object') return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canon(v[k])).join(',')+'}'; return JSON.stringify(v); }
  async function sha(s){ const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''); }
  window.QE_PREUVE = async function(events){ let prev='0'.repeat(64), lines=[];
    for(let n=0;n<events.length;n++){ const e=events[n]; const rec=norm({seq:n,t:e.t||'',type:e.type||'',data:e.data||{},prev_hash:prev});
      const h=await sha(canon(rec)); rec.hash=h; lines.push(canon(rec)); prev=h; }
    return lines.join('\n')+(lines.length?'\n':''); };
  window.QE_PREUVE_EXPORT = async function(events,nom){ const txt=await window.QE_PREUVE(events);
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'application/x-ndjson'})); a.download=nom||'preuve.jsonl'; document.body.appendChild(a); a.click(); setTimeout(()=>a.remove(),500); return txt; };
})();
