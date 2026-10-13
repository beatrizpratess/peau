const $=(s,e=document)=>e.querySelector(s);
const fmt=v=>(STORE.moeda||'R$')+' '+Number(v).toFixed(2).replace('.',',');
const ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const byId=id=>PRODUTOS.find(p=>p.id==id);
const cart=()=>{
  const raw=ls('peau_cart',{});const c={};
  if(raw&&typeof raw==='object'&&!Array.isArray(raw))
    for(const id in raw){const q=Number(raw[id]);if(byId(id)&&Number.isInteger(q)&&q>0)c[id]=q}
  return c;
};
const count=()=>{const e=$('#cc');if(e){const n=Object.values(cart()).reduce((a,b)=>a+b,0);e.textContent=n;e.hidden=!n}};
const setCart=c=>{save('peau_cart',c);count()};
const add=(id,q=1)=>{const c=cart();c[id]=(c[id]||0)+q;if(c[id]<1)delete c[id];setCart(c)};
const logoHTML=`<img class="logo" src="${STORE.logo}" alt="${STORE.nome}" onerror="this.outerHTML='<b class=logo-t>${STORE.nome}</b>'">`;
const page=document.body.dataset.page;
const links=[['index','Início'],['produtos','Produtos'],['rotinas','Rotinas'],['sobre','Sobre']];
const sv=d=>`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
$('#header').innerHTML=`<header class="top"><a href="index.html">${logoHTML}</a><nav class="pill">${links.map(([f,t])=>`<a href="${f}.html" class="${f==page?'on':''}">${t}</a>`).join('')}</nav><div class="ics"><a class="ic" href="perfil.html" aria-label="Perfil">${sv('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>')}</a><a class="cartbtn" href="carrinho.html" aria-label="Carrinho"><span class="cico">${sv('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>')}<b id="cc" hidden>0</b></span>Carrinho</a></div></header>`;
$('#footer').innerHTML=`<footer class="foot"><div class="foot-in"><div class="foot-top"><a href="index.html" class="foot-logo">${logoHTML}</a><div class="foot-cols"><div><h5>Menu</h5><a href="produtos.html">Produtos</a><a href="rotinas.html">Rotinas</a><a href="sobre.html">Sobre</a></div><div><h5>Ajuda</h5><a href="#">Entregas</a><a href="#">Trocas</a><a href="#">Contato</a></div><div><h5>Social</h5><a href="#">Instagram</a><a href="#">TikTok</a></div></div></div><p class="foot-copy">© ${new Date().getFullYear()} ${STORE.nome}. Todos os direitos reservados.</p></div></footer>`;
document.body.insertAdjacentHTML('afterbegin','<div class="bg" aria-hidden="true"><i class="s1"></i><i class="s2"></i><i class="s3"></i><i class="s4"></i><i class="s5"></i></div>');
count();
const cv=p=>`--c:${CORES[p.cor][0]};--t:${CORES[p.cor][1]}`;
const mk=i=>`<div class="mk v${i%4}"><i class="cp"></i><div class="bd"><div class="fc"><i class="e"></i><i class="e"></i></div><i class="m"></i></div></div>`;
const blob=(p,g='')=>`<div class="blob ${g}">${p.img?`<img src="${p.img}" alt="${p.nome}" onerror="this.outerHTML=mk(${p.cor})">`:mk(p.cor)}</div>`;
const card=p=>`<article class="pc" style="${cv(p)}"><a href="produto.html?id=${p.id}"><div class="pc-top"><div class="row"><span class="pill2">${p.cat}</span><span class="arr">↗</span></div><h3>${p.nome}</h3><p>${p.tipo}</p></div><div class="pc-art">${p.selo?`<span class="selo">${p.selo}</span>`:''}${p.img?`<img src="${p.img}" alt="${p.nome}" onerror="this.outerHTML=mk(${p.cor})">`:mk(p.cor)}</div></a><div class="pc-foot"><b>${fmt(p.preco)}</b><button class="btn" data-add="${p.id}">Adicionar</button></div></article>`;
document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b){add(b.dataset.add);const t=b.textContent;b.textContent='Adicionado ✓';setTimeout(()=>b.textContent=t,1200)}});
const totais=()=>{const c=cart();let sub=0;for(const id in c)sub+=byId(id).preco*c[id];const cup=STORE.cupons[ls('peau_cupom','')]||0;const desc=sub*cup;const fr=(sub===0||sub>=STORE.freteGratisA)?0:STORE.frete;return{sub,desc,fr,total:sub-desc+fr}};
const resumo=()=>{const t=totais();return`<div class="row"><span>Subtotal</span><b>${fmt(t.sub)}</b></div>${t.desc?`<div class="row"><span>Desconto</span><b>- ${fmt(t.desc)}</b></div>`:''}<div class="row"><span>Frete</span><b>${t.fr?fmt(t.fr):'Grátis'}</b></div><div class="row"><span>Total</span><b class="tot">${fmt(t.total)}</b></div>`};
const U=()=>ls('peau_user',null);

if(page=='index'){
  $('#destaques').innerHTML=PRODUTOS.slice(0,4).map(card).join('');
  $('#hart').innerHTML=`<img src="img/menina.jpeg" alt="" onerror="this.outerHTML='<div class=trio>'+mk(0)+mk(1)+mk(3)+'</div>'">`;
  $('#news').onsubmit=e=>{e.preventDefault();e.target.outerHTML='<p style="font-weight:800">Obrigada! Você vai receber nossas dicas ✦</p>'};
}

if(page=='produtos'){
  const cats=['Todos',...new Set(PRODUTOS.map(p=>p.cat))];
  const draw=c=>{$('#chips').innerHTML=cats.map(x=>`<button class="chip ${x==c?'on':''}" data-c="${x}">${x}</button>`).join('');$('#lista').innerHTML=PRODUTOS.filter(p=>c=='Todos'||p.cat==c).map(card).join('')};
  draw(new URLSearchParams(location.search).get('cat')||'Todos');$('#chips').onclick=e=>{const b=e.target.closest('[data-c]');if(b)draw(b.dataset.c)};
}

if(page=='produto'){
  const p=byId(new URLSearchParams(location.search).get('id'))||PRODUTOS[0];let q=1;
  document.title=`${p.nome} – ${STORE.nome}`;
  $('#produto').innerHTML=`<div class="sh" style="${cv(p)}">${blob(p,'g')}</div><div class="sh det"><span class="sm">${p.cat} · ${p.tipo}</span><h1 style="font-size:clamp(32px,4vw,52px)">${p.nome}</h1><b style="font-size:28px">${fmt(p.preco)}</b><p style="margin:12px 0">${p.desc}</p><div class="row" style="justify-content:flex-start;gap:14px"><span class="qt"><button id="m">−</button><b id="q">1</b><button id="s">+</button></span><button class="btn azul" id="a" style="flex:1;min-height:52px">Adicionar ao carrinho</button></div><h4>Tipo de pele</h4>${p.pele}<h4>Volume</h4>${p.volume}<h4>Modo de uso</h4>${p.uso}</div>`;
  const sq=n=>{q=Math.max(1,q+n);$('#q').textContent=q};$('#m').onclick=()=>sq(-1);$('#s').onclick=()=>sq(1);
  $('#a').onclick=()=>{add(p.id,q);location.href='carrinho.html'};
  $('#mais').innerHTML=PRODUTOS.filter(x=>x.id!=p.id).slice(0,4).map(card).join('');
}

if(page=='carrinho'){
  const draw=()=>{const c=cart(),ids=Object.keys(c);
    $('#itens').innerHTML=ids.length?ids.map(id=>{const p=byId(id);return`<div class="item" style="${cv(p)}">${blob(p)}<div class="grow"><h3>${p.nome}</h3><span class="sm">${p.tipo}</span></div><span class="qt"><button data-d="${id}">−</button><b>${c[id]}</b><button data-u="${id}">+</button></span><b class="pr" style="width:110px;text-align:right">${fmt(p.preco*c[id])}</b><button class="ic" data-r="${id}" aria-label="Remover">×</button></div>`}).join(''):'<div class="sh">Seu carrinho está vazio. <a href="produtos.html"><u>Ver produtos</u></a></div>';
    $('#resumo').innerHTML=resumo();$('#cupom').value=ls('peau_cupom','');};
  draw();
  $('#itens').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.u)add(d.u,1);if(d.d)add(d.d,-1);if(d.r){const c=cart();delete c[d.r];setCart(c)}draw()};
  $('#aplicar').onclick=()=>{const v=$('#cupom').value.trim().toUpperCase();if(STORE.cupons[v]||!v){save('peau_cupom',v)}else alert('Cupom inválido');draw()};
  $('#fin').onclick=()=>Object.keys(cart()).length?location.href='checkout.html':alert('Adicione produtos ao carrinho.');
}

if(page=='checkout'){
  $('#resumo').innerHTML=resumo();const u=U();if(u){['nome','email'].forEach(k=>{if(u[k])$('#'+k).value=u[k]})}
  $('#form').onsubmit=e=>{e.preventDefault();const t=totais(),c=cart();
    const ped=ls('peau_pedidos',[]);ped.unshift({n:String(Date.now()).slice(-6),data:new Date().toLocaleDateString('pt-BR'),itens:Object.keys(c).map(i=>c[i]+'x '+byId(i).nome).join(', '),total:t.total,status:'Recebido'});
    save('peau_pedidos',ped);setCart({});localStorage.removeItem('peau_cupom');
    $('#conteudo').innerHTML=`<div class="sh" style="text-align:center"><h2>Pedido realizado!</h2><p style="margin:12px 0 20px">Obrigada pela compra. Você pode acompanhar em Perfil.</p><a class="btn azul" href="perfil.html">Ver meus pedidos</a></div>`};
}

if(page=='login'){
  let modo='entrar';
  const draw=()=>{const e=modo=='entrar';
    $('#tit').textContent=e?'Bem-vindo(a) de volta':'Crie sua conta';
    $('#sub').textContent=e?'Entre para acompanhar seus pedidos e sua rotina.':'Leva menos de um minuto.';
    $('#cn').hidden=e;$('#fg').hidden=!e;$('#ok').textContent=e?'Entrar':'Criar conta';
    $('#t1').classList.toggle('on',e);$('#t2').classList.toggle('on',!e)};
  $('#t1').onclick=()=>{modo='entrar';draw()};$('#t2').onclick=()=>{modo='criar';draw()};draw();
  $('#form').onsubmit=e=>{e.preventDefault();const u=U()||{};u.email=$('#email').value;if(modo=='criar')u.nome=$('#nome').value;save('peau_user',u);location.href='perfil.html'};
}

if(page=='perfil'){
  const u=U();if(!u){location.href='login.html'}else{
  $('#oi').textContent='Oi, '+(u.nome||'bem-vinda')+'!';
  ['nome','email','tel','end'].forEach(k=>$('#'+k).value=u[k]||'');
  $('#form').onsubmit=e=>{e.preventDefault();['nome','email','tel','end'].forEach(k=>u[k]=$('#'+k).value);save('peau_user',u);$('#oi').textContent='Oi, '+u.nome+'!';alert('Dados salvos!')};
  $('#sair').onclick=()=>{localStorage.removeItem('peau_user');location.href='index.html'};
  const p=ls('peau_pedidos',[]);$('#pedidos').innerHTML=p.length?p.map(o=>`<div class="ped"><div class="row"><b>Pedido ${o.n}</b><span class="sm">${o.status}</span></div><div class="sm">${o.data} · ${o.itens}</div><b>${fmt(o.total)}</b></div>`).join(''):'<p class="sm">Você ainda não fez pedidos.</p>';}
}