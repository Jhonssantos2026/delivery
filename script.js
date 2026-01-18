const cardapioItens = [
    { id: 1, categoria: "combos", nome: "Roda Gigante Box", descricao: "8 Mini Burgers + Batata com Cheddar e Bacon.", preco: 89.90, imagem: "./imagens/imagem01.jpg", destaque: true, tags: "familia grande festa" },
    { id: 2, categoria: "combos", nome: "Box Casal Premium", descricao: "2 Burgers + Anéis de Cebola + Batata.", preco: 64.90, imagem: "./imagens/imagem02.jpg", tags: "namorados dois" },
    { id: 3, categoria: "combos", nome: "Barca Ostentação", descricao: "4 Burgers + Nuggets + Batata Turbinada.", preco: 79.90, imagem: "./imagens/imagem03.jpg", destaque: true, tags: "frango" },
    { id: 4, categoria: "combos", nome: "Box Família", descricao: "4 Burgers Clássicos + Batata G.", preco: 72.90, imagem: "./imagens/imagem04.jpg" },
    { id: 5, categoria: "combos", nome: "Combo Galera", descricao: "6 Burgers + 2 Refris 1.5L.", preco: 95.00, imagem: "./imagens/imagem05.jpg", tags: "bebida" },
    { id: 6, categoria: "promocoes", nome: "Jantar Duplo", descricao: "2 X-Salada Bacon + Batata Ovos/Cheddar.", preco: 39.90, precoAntigo: 55.00, imagem: "./imagens/imagem06.jpg", tags: "barato" },
    { id: 7, categoria: "promocoes", nome: "Dupla Refri", descricao: "2 Cheeseburgers + Fritas + Coca 1.5L.", preco: 45.90, precoAntigo: 62.00, imagem: "./imagens/imagem07.jpg", destaque: true, tags: "coca refrigerante" },
    { id: 8, categoria: "promocoes", nome: "Trio Smash", descricao: "3 Smash Burgers Simples.", preco: 29.90, precoAntigo: 42.00, imagem: "./imagens/imagem08.jpg" },
    { id: 9, categoria: "promocoes", nome: "Oferta Individual", descricao: "1 Burger + Batata P + Refri Lata.", preco: 22.90, precoAntigo: 30.00, imagem: "./imagens/imagem09.jpg", tags: "sozinho" },
    { id: 10, categoria: "promocoes", nome: "Balde Frango", descricao: "500g de Frango Crocante.", preco: 35.00, precoAntigo: 45.00, imagem: "./imagens/imagem10.jpg", tags: "frango" },
    { id: 11, categoria: "destaques", nome: "Monster Cheddar", descricao: "Duplo Blend banhado no Cheddar.", preco: 34.90, imagem: "./imagens/imagem11.jpg", destaque: true, tags: "queijo gigante" },
    { id: 12, categoria: "destaques", nome: "Box 5 Amigos", descricao: "5 Burgers + Fritas Calabresa.", preco: 59.90, imagem: "./imagens/imagem12.jpg" },
    { id: 13, categoria: "destaques", nome: "Duplo Bacon", descricao: "Muito bacon e maionese verde.", preco: 32.90, imagem: "./imagens/imagem13.jpg", tags: "porco" },
    { id: 14, categoria: "destaques", nome: "Chicken Supreme", descricao: "Frango empanado e cream cheese.", preco: 26.90, imagem: "./imagens/imagem14.jpg", tags: "frango" },
    { id: 15, categoria: "destaques", nome: "Veggie Futuro", descricao: "Hambúrguer de plantas e rúcula.", preco: 34.90, imagem: "./imagens/imagem15.jpg", tags: "vegano vegetariano" }
];

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const NUMERO_ZAP = "5511913257453"; // Coloque seu número aqui

document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
    const containerGrade = document.getElementById('grade-produtos');
    
    // Se tiver grade (páginas internas), renderiza ela. Se não (home), renderiza carrossel.
    if (containerGrade) {
        renderizarGrade(containerGrade.getAttribute('data-categoria'));
    } else {
        renderizarCardapio(cardapioItens);
        inicializarScroll();
        inicializarBusca();
    }
});

/* Renderiza os carrosséis da Home */
function renderizarCardapio(lista) {
    const containers = { 
        combos: document.getElementById('container-combos'), 
        promocoes: document.getElementById('container-promocoes'), 
        destaques: document.getElementById('container-destaques') 
    };
    
    // Se não estiver na home, sai da função
    if(!containers.combos) return;

    Object.values(containers).forEach(c => c.innerHTML = '');
    
    if(lista.length === 0) { 
        document.getElementById('msg-sem-resultado').style.display = 'block'; 
        return; 
    }
    document.getElementById('msg-sem-resultado').style.display = 'none';

    lista.forEach(item => {
        const card = criarHTMLCard(item);
        if(item.categoria === 'combos' && containers.combos) containers.combos.innerHTML += card;
        if(item.categoria === 'promocoes' && containers.promocoes) containers.promocoes.innerHTML += card;
        if(item.categoria === 'destaques' && containers.destaques) containers.destaques.innerHTML += card;
    });
}

/* Renderiza a grade nas páginas específicas */
function renderizarGrade(categoriaAlvo) {
    const container = document.getElementById('grade-produtos');
    const itens = cardapioItens.filter(item => item.categoria === categoriaAlvo);
    container.innerHTML = itens.length === 0 ? '<h3 style="color:#fff;">Nenhum item encontrado.</h3>' : itens.map(criarHTMLCard).join('');
}

/* Cria o HTML do Card de Produto */
function criarHTMLCard(item) {
    const precoHTML = item.precoAntigo ? 
        `<div class="price-tag-promo"><span class="preco-antigo">R$ ${item.precoAntigo.toFixed(2)}</span><span class="preco-novo">R$ ${item.preco.toFixed(2)}</span></div>` : 
        `<div class="price-tag">R$ ${item.preco.toFixed(2)}</div>`;
        
    return `
        <div class="burger-card">
            ${item.destaque ? '<div class="ribbon">TOP</div>' : ''}
            <div class="card-image">
                <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
                ${precoHTML}
            </div>
            <div class="card-info">
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                <button class="btn-add" onclick="adicionarCarrinho(${item.id})">Adicionar</button>
            </div>
        </div>`;
}

/* Sistema de Busca */
function inicializarBusca() {
    const input = document.getElementById('input-busca');
    const btn = document.getElementById('btn-busca');
    if(!input) return;
    input.addEventListener('input', (e) => filtrarItens(e.target.value));
    btn.addEventListener('click', () => filtrarItens(input.value));
}

function filtrarItens(termo) {
    const termoLimpo = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    if(termoLimpo === "") { renderizarCardapio(cardapioItens); return; }
    const filtrados = cardapioItens.filter(item => (item.nome + item.descricao + item.tags).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(termoLimpo));
    renderizarCardapio(filtrados);
}
function limparBusca() { document.getElementById('input-busca').value = ""; filtrarItens(""); }

/* Scroll Horizontal (Setinhas) */
function inicializarScroll() {
    document.querySelectorAll('.row-container').forEach(cont => {
        const row = cont.querySelector('.netflix-row');
        cont.querySelector('.btn-left').onclick = () => row.scrollBy({ left: -300, behavior: 'smooth' });
        cont.querySelector('.btn-right').onclick = () => row.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

/* Funções do Menu e Carrinho */
function toggleMenu() { document.querySelector('.main-nav').classList.toggle('active'); }

function adicionarCarrinho(id) { 
    const item = cardapioItens.find(p => p.id === id); 
    carrinho.push(item); 
    salvarCarrinho(); 
    atualizarCarrinho(); 
}

function remover(i) { 
    carrinho.splice(i, 1); 
    salvarCarrinho(); 
    atualizarCarrinho(); 
}

function salvarCarrinho() { localStorage.setItem('carrinho', JSON.stringify(carrinho)); }

function atualizarCarrinho() {
    document.getElementById('contador-carrinho').innerText = carrinho.length;
    document.getElementById('lista-itens-carrinho').innerHTML = carrinho.map((item, i) => 
        `<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee; align-items:center;">
            <span>${item.nome}</span>
            <span>R$ ${item.preco.toFixed(2)} <i class="fas fa-trash" onclick="remover(${i})" style="color:red; cursor:pointer; margin-left:10px;"></i></span>
        </div>`
    ).join('');
    document.getElementById('total-carrinho').innerText = `R$ ${carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}`;
}

function toggleCarrinho() { document.getElementById('carrinho-modal').classList.toggle('aberto'); }

function finalizarPedidoWhatsapp() {
    const nome = document.getElementById('nome-cliente').value; 
    const end = document.getElementById('endereco-cliente').value; 
    const pag = document.getElementById('forma-pagamento').value;
    
    if(!nome || !end || carrinho.length === 0) return alert("Preencha todos os dados!");
    
    let msg = `*PEDIDO MORABURGER* 🍔\n\n*Cliente:* ${nome}\n*End:* ${end}\n\n*ITENS:*\n`;
    carrinho.forEach(i => msg += `- ${i.nome} (R$ ${i.preco.toFixed(2)})\n`);
    msg += `\n*Total:* R$ ${carrinho.reduce((acc, i) => acc + i.preco, 0).toFixed(2)}\n*Pagamento:* ${pag}`;
    
    carrinho = []; salvarCarrinho(); atualizarCarrinho(); 
    window.open(`https://wa.me/${NUMERO_ZAP}?text=${encodeURIComponent(msg)}`);
}

function toggleContato() { document.getElementById('modal-contato').classList.toggle('active'); }

/* FUNÇÃO ESSENCIAL PARA O MENU MOBILE VERTICAL */
function toggleDropdownMobile(event) {
    if (window.innerWidth <= 768) {
        event.preventDefault();
        // Acha o elemento pai (.dropdown) e alterna a classe 'ativo' para abrir o accordion
        event.target.closest('.dropdown').classList.toggle('ativo');
    }
}