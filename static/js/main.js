const app = document.getElementById('app');
const message = document.getElementById('mensagem');
let settings = {};
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api = async (url, options={}) => {
  const response = await fetch(url, {headers:{'Content-Type':'application/json'}, ...options});
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(data.erro || 'Não foi possível concluir a operação.');
  return data;
};
function hero(eyebrow, line1, line2, text, card1='Juntos ', card2='Podemos mais!') {
  return `<section class="hero"><div class="wrap hero-in"><div><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(line1)} <span>${esc(line2)}</span></h1><p class="txt">${esc(text)}</p></div><div class="hero-card">${esc(card1)}<span>${esc(card2)}</span></div></div></section>`;
}
function card(p) {
  return `<a class="card cor-${esc(p.cor)}" href="/projetos/${Number(p.id)}"><div class="card-topo"><span class="ico">✦</span><div><h3>${esc(p.nome)}</h3><p>${esc(p.resumo)}</p></div></div><div class="card-base"><span class="pill">Saiba mais</span><span class="seta">→</span></div></a>`;
}
function flash(text, type='erro') { message.innerHTML = text ? `<p class="flash ${type}" role="status">${esc(text)}</p>` : ''; }
async function home() {
  const q = new URLSearchParams(location.search).get('q') || '';
  const projects = await api('/api/projetos'+(q ? '?q='+encodeURIComponent(q) : ''));
  app.innerHTML = hero('NOSSOS CURSOS','Conhecimento que','transforma vidas','Capacitação profissional para desenvolver habilidades, conquistar oportunidades e construir um futuro melhor.','Seu futuro ','começa aqui!')+
  `<form class="busca" action="/" method="get" role="search"><input type="search" name="q" value="${esc(q)}" placeholder="Buscar cursos..." aria-label="Buscar cursos"><button type="submit" aria-label="Buscar">→</button></form><main class="wrap" id="cursos"><h2>${q?'Resultados da busca':'Cursos em destaque'}</h2><p class="sub">Explore nossas áreas e encontre o curso ideal para você.</p><div class="grid">${projects.length?projects.map(card).join(''):`<p class="vazio">Nenhum curso encontrado para “${esc(q)}”. <a href="/">Ver todos</a></p>`}</div><section class="cta"><div><h3>Não encontrou o curso ideal?</h3><p>Fale conosco e tire suas dúvidas.</p></div><a class="btn" href="/contato">Fale conosco →</a></section></main>`;
}
async function project(id) {
  const p = await api('/api/projetos/'+id);
  const optional = (title, value) => value ? `<h3>${title}</h3><p>${esc(value)}</p>` : '';
  app.innerHTML = hero('PROJETO',p.nome,'',p.resumo||'')+`<main class="wrap detalhe"><section class="painel cor-${esc(p.cor)}"><h2>Sobre o projeto</h2><p>${esc(p.descricao)}</p>${optional('Objetivos',p.objetivos)}${optional('Público atendido',p.publico_atendido)}${optional('Ações realizadas',p.acoes_realizadas)}<a class="btn" href="/#cursos">← Voltar</a></section></main>`;
}
async function consultation() {
  const projects = await api('/api/projetos?consulta=1');
  const wa = `https://wa.me/${encodeURIComponent(settings.whatsapp||'')}?text=${encodeURIComponent('Olá! Gostaria de agendar uma consulta.')}`;
  app.innerHTML = hero('MARCAR CONSULTA','Cuidar de você','também é prioridade','Agende sua consulta de forma rápida e prática pelo WhatsApp. Nossa equipe está pronta para te atender e te orientar da melhor forma.','Seu bem-estar ','importa!')+`<main class="wrap consulta"><section class="painel"><div class="painel-topo"><span class="ico-svg">▦</span><h2>Agende sua consulta<br>pelo WhatsApp</h2></div><p>É rápido, fácil e seguro. Clique no botão abaixo e converse com a nossa equipe para escolher o melhor horário para você.</p><a class="btn btn-zap" target="_blank" rel="noopener" href="${wa}">☏ Agendar pelo WhatsApp →</a></section><aside class="lado">${projects.map(card).join('')}<a class="btn" href="/contato">Fale conosco →</a></aside></main>`;
}
async function contact() {
  const wa = `https://wa.me/${encodeURIComponent(settings.whatsapp||'')}`;
  app.innerHTML = hero('ONDE ESTAMOS!','Nossa localização','e formas de contato','Estamos aqui para te atender! Venha nos visitar, entre em contato ou faça uma doação.')+`<main class="wrap contato"><section class="painel"><div class="painel-topo"><span class="ico-svg">⌖</span><h2>Nossa localização</h2></div><p class="endereco">${esc(settings.endereco)}</p><a class="linha" target="_blank" rel="noopener" href="${wa}"><span class="linha-nome"><span class="ico-svg">☏</span> WhatsApp</span><span>→</span></a><a class="linha" target="_blank" rel="noopener" href="${esc(settings.instagram||'#')}"><span class="linha-nome"><span class="ico-svg">◎</span> Instagram</span><span>→</span></a></section><section class="painel"><h2>Gostaria de doar para gente?</h2><p>Sua doação faz toda diferença! Pode ser em dinheiro, alimentos, roupas ou outros itens.</p><a class="btn btn-grande" target="_blank" rel="noopener" href="${wa}?text=${encodeURIComponent('Olá! Gostaria de fazer uma doação.')}">Quero doar →</a></section></main>`;
}
function about() {
  app.innerHTML = hero('SOBRE NÓS','Acolher, capacitar','e transformar','Conheça a Reassocia e os projetos que levam oportunidades para a nossa comunidade.')+`<main class="wrap"><section class="painel"><h2>Quem somos</h2><p>A Reassocia é uma organização que atua em Jardim Catarina, São Gonçalo (RJ), com cursos de capacitação, ações de saúde e apoio à comunidade.</p><a class="btn" href="/#cursos">Conheça nossos projetos →</a></section></main>`;
}
async function adminList() {
  const rows = await api('/api/admin/projetos');
  app.innerHTML = `<main class="wrap admin"><div class="admin-topo"><h2>Projetos cadastrados</h2><a class="btn" href="/admin/projetos/novo">Novo projeto</a></div><div class="tabela-scroll"><table><thead><tr><th>Nome</th><th>Cor</th><th>Na home</th><th>Na consulta</th><th></th></tr></thead><tbody>${rows.length?rows.map(p=>`<tr><td>${esc(p.nome)}</td><td>${esc(p.cor)}</td><td>${p.destaque?'Sim':'Não'}</td><td>${p.na_consulta?'Sim':'Não'}</td><td><a href="/admin/projetos/${Number(p.id)}/editar">Editar</a></td></tr>`).join(''):'<tr><td colspan="5">Nenhum projeto cadastrado.</td></tr>'}</tbody></table></div></main>`;
}
async function adminForm(id=null) {
  const p = id ? await api('/api/projetos/'+id) : {cor:'roxo',destaque:1,na_consulta:0};
  const field=(name,label,tag='input')=>`<label>${label}${tag==='textarea'?`<textarea name="${name}" rows="3">${esc(p[name]||'')}</textarea>`:`<input name="${name}" maxlength="${name==='nome'?150:255}" value="${esc(p[name]||'')}" ${['nome'].includes(name)?'required':''}>`}</label>`;
  app.innerHTML = `<main class="wrap admin"><h2>${id?'Editar projeto':'Novo projeto'}</h2><form id="project-form" class="form" data-validar>${field('nome','Nome *')}${field('resumo','Resumo (aparece no card)')}${field('descricao','Descrição *','textarea')}${field('objetivos','Objetivos','textarea')}${field('publico_atendido','Público atendido')}${field('acoes_realizadas','Ações realizadas','textarea')}<label>Cor do card<select name="cor">${(settings.cores||['roxo','verde','laranja','azul','rosa']).map(c=>`<option value="${c}" ${p.cor===c?'selected':''}>${c[0].toUpperCase()+c.slice(1)}</option>`).join('')}</select></label><label class="check"><input type="checkbox" name="destaque" ${p.destaque?'checked':''}> Mostrar na página inicial</label><label class="check"><input type="checkbox" name="na_consulta" ${p.na_consulta?'checked':''}> Mostrar na página de consulta</label><div class="acoes"><button class="btn" type="submit">Salvar</button><a href="/admin/projetos">Cancelar</a></div></form></main>`;
  document.getElementById('project-form').addEventListener('submit', async e=>{
    e.preventDefault(); const f=e.currentTarget; const data=Object.fromEntries(new FormData(f)); data.destaque=f.elements.destaque.checked; data.na_consulta=f.elements.na_consulta.checked;
    try { await api(id?`/api/admin/projetos/${id}`:'/api/admin/projetos',{method:id?'PUT':'POST',body:JSON.stringify(data)}); location.href='/admin/projetos'; }
    catch(err){ flash(err.message); }
  });
}
async function start() {
  try {
    settings = await api('/api/config');
    document.getElementById('endereco').textContent=settings.endereco||'';
    document.getElementById('social').innerHTML=`<a href="${esc(settings.instagram||'#')}" target="_blank" rel="noopener" aria-label="Instagram">◎</a><a href="${esc(settings.facebook||'#')}" target="_blank" rel="noopener" aria-label="Facebook">f</a>`;
    const path=location.pathname;
    const projectMatch=path.match(/^\/projetos\/(\d+)\/?$/);
    const editMatch=path.match(/^\/admin\/projetos\/(\d+)\/editar\/?$/);
    if(projectMatch) await project(projectMatch[1]);
    else if(editMatch) await adminForm(editMatch[1]);
    else if(path==='/consulta') await consultation();
    else if(path==='/contato') await contact();
    else if(path==='/sobre') about();
    else if(path==='/admin/projetos') await adminList();
    else if(path==='/admin/projetos/novo') await adminForm();
    else await home();
  } catch(err) { app.innerHTML=`<main class="wrap"><section class="painel"><h2>Não foi possível carregar esta página</h2><p>${esc(err.message)}</p></section></main>`; }
}
start();
