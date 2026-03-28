// Configurações Iniciais
const min = 1;
const max = 50;
let tent = 5;
let cont = 0;

// Função de Sorteio (Gerador de Caos)
function gerarNumero(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let num_sort = gerarNumero(min, max);
let num_morte = gerarNumero(min, max);

// Garantindo que não sejam iguais (Sua lógica do C)
while (num_morte === num_sort) {
    num_morte = gerarNumero(min, max);
}

const output = document.getElementById('output');
const input = document.getElementById('guess-input');
const btn = document.getElementById('guess-btn');

function adicionarMensagem(texto, classe) {
    const p = document.createElement('p');
    p.innerText = `> ${texto}`;
    p.className = classe;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight; // Scroll automático
}

function finalizarJogo() {
    input.disabled = true;
    btn.disabled = true;
    btn.innerText = "OFFLINE";
}

btn.addEventListener('click', () => {
    let num_user = parseInt(input.value);
    
    // Validação de entrada
    if (isNaN(num_user) || num_user < min || num_user > max) {
        adicionarMensagem(`ERRO: Digite de ${min} a ${max}!`, "msg-error");
        return;
    }

    cont++;
    let restante = tent - cont;

    // Lógica do Número da Morte
    if (num_user === num_morte) {
        adicionarMensagem(`SETOR CORROMPIDO! Você atingiu o número da morte: ${num_morte}`, "msg-death");
        adicionarMensagem(`O sistema colapsou. O alvo era ${num_sort}.`, "msg-error");
        finalizarJogo();
        return;
    }

    // Lógica de Vitória/Dicas
    if (num_user === num_sort) {
        adicionarMensagem(`ACESSO CONCEDIDO! Você acertou: ${num_sort}`, "msg-win");
        adicionarMensagem(`O número da morte era ${num_morte}. Sorte a sua.`, "msg-info");
        finalizarJogo();
    } else if (num_user > num_sort) {
        adicionarMensagem(`Chute ${num_user}: O alvo é MENOR. Restam ${restante}.`, "msg-info");
    } else {
        adicionarMensagem(`Chute ${num_user}: O alvo é MAIOR. Restam ${restante}.`, "msg-info");
    }

    if (cont >= tent && num_user !== num_sort) {
        adicionarMensagem(`TENTATIVAS ESGOTADAS. O alvo era ${num_sort}.`, "msg-error");
        adicionarMensagem(`O número da morte era ${num_morte}.`, "msg-info");
        finalizarJogo();
    }

    input.value = ""; // Limpa o campo
    input.focus();    // Volta o foco
});
