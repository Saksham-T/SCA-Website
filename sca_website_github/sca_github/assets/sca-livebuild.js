/* ============================================================
   SCA — Web & Tech hero: "Live Build" animation
   Types the JSX in #code and reveals the matching preview block
   in #pv as each line completes. Honors prefers-reduced-motion.
   ============================================================ */
(function(){
  var code = document.getElementById('code');
  var pv   = document.getElementById('pv');
  var skel = document.getElementById('skel');
  if (!code || !pv) return;

  // Each line: tokens to type, and which preview block(s) to reveal on completion.
  var LINES = [
    { toks:[{t:'export default ',c:'c-kw'},{t:'function ',c:'c-kw'},{t:'CampaignPage',c:'c-fn'},{t:'() {',c:'c-pn'}] },
    { toks:[{t:'  return ',c:'c-kw'},{t:'(',c:'c-pn'}] },
    { toks:[{t:'    <Nav ',c:'c-tag'},{t:'brand',c:'c-attr'},{t:'=',c:'c-pn'},{t:'"brand"',c:'c-str'},{t:' links',c:'c-attr'},{t:'=',c:'c-pn'},{t:'{',c:'c-pn'},{t:'["Offer","Proof","Buy"]',c:'c-str'},{t:'}',c:'c-pn'},{t:' />',c:'c-tag'}], pv:0, skel:['0','0b'] },
    { toks:[{t:'    <Eyebrow>',c:'c-tag'},{t:'Campaign ready',c:'c-txt'},{t:'</Eyebrow>',c:'c-tag'}], pv:1 },
    { toks:[{t:'    <h1>',c:'c-tag'},{t:'A page built around the action.',c:'c-txt'},{t:'</h1>',c:'c-tag'}], pv:2, skel:['2'] },
    { toks:[{t:'    <p>',c:'c-tag'},{t:'One offer. Clean proof. Fast load.',c:'c-txt'},{t:'</p>',c:'c-tag'}], pv:3, skel:['3'] },
    { toks:[{t:'    <Button>',c:'c-tag'},{t:'Start the flow',c:'c-txt'},{t:'</Button>',c:'c-tag'}], pv:4, skel:['4'] },
    { toks:[{t:'    <ProductImage ',c:'c-tag'},{t:'src',c:'c-attr'},{t:'=',c:'c-pn'},{t:'"product.webp"',c:'c-str'},{t:' />',c:'c-tag'}], pv:5, skel:['5'] },
    { toks:[{t:'  )',c:'c-pn'}] },
    { toks:[{t:'}',c:'c-pn'}] }
  ];

  var caret = null;

  function build(){
    code.innerHTML = '';
    LINES.forEach(function(line){
      var row = document.createElement('span');
      row.className = 'row';
      line.spans = [];
      line.toks.forEach(function(tk){
        var s = document.createElement('span');
        s.className = 'tok ' + tk.c;
        s.textContent = tk.t;
        row.appendChild(s);
        line.spans.push(s);
      });
      row.appendChild(document.createTextNode('\n'));
      code.appendChild(row);
      line.row = row;
    });
    caret = document.createElement('span');
    caret.className = 'caret';
    code.appendChild(caret);
  }

  function showAll(){
    LINES.forEach(function(l){ l.spans.forEach(function(s){ s.style.opacity = 1; }); });
    pv.querySelectorAll('.pv-block').forEach(function(b){ b.classList.add('show'); });
    if (skel) skel.querySelectorAll('.sk').forEach(function(s){ s.classList.add('hide'); });
  }

  function reset(){
    LINES.forEach(function(l){ l.spans.forEach(function(s){ s.style.opacity = 0; }); });
    pv.querySelectorAll('.pv-block').forEach(function(b){ b.classList.remove('show'); });
    if (skel) skel.querySelectorAll('.sk').forEach(function(s){ s.classList.remove('hide'); });
  }

  var li = 0, ti = 0;
  function step(){
    if (li >= LINES.length){
      setTimeout(function(){ reset(); li = 0; ti = 0; setTimeout(step, 500); }, 3000);
      return;
    }
    var line = LINES[li];
    var span = line.spans[ti];
    span.style.opacity = 1;
    line.row.insertBefore(caret, span.nextSibling);
    ti++;
    if (ti >= line.spans.length){
      if (line.pv !== undefined){
        var blk = pv.querySelector('.pv-block[data-pv="'+line.pv+'"]');
        if (blk) blk.classList.add('show');
      }
      if (line.skel){
        line.skel.forEach(function(k){
          var s = skel && skel.querySelector('.sk[data-for="'+k+'"]');
          if (s) s.classList.add('hide');
        });
      }
      li++; ti = 0;
      setTimeout(step, 170);
    } else {
      setTimeout(step, 45 + Math.random()*48);
    }
  }

  build();

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce){
    showAll();
    return;
  }
  reset();
  setTimeout(step, 700);
})();
