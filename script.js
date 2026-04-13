// CONFIGURAÇÕES (Baseadas no seu adv2.c)
const min = 1;
const max = 400;
const limiteTentativas = 5;
let tentativasRestantes = limiteTentativas;
let duplicar = 1; // Quantidade de firewalls (conforme seu C)
let firewalls = []; // Array para múltiplos firewalls
let token;
let ultimoChute = null;

const output = document.getElementById('output');
const input = document.getElementById('guess-input');
const btn = document.getElementById('guess-btn');
const rangeDisplay = document.getElementById('range-display');

// Lógica de sorteio e "evitarRng"
function inicializarSistema() {
   token = Math.floor(Math.random() * (max - min + 1)) + min;
   firewalls = []; // Limpa firewalls anteriores

    for (let i = 0; i < duplicar; i++) {
        let fw;
        do {
            fw = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (fw === token || firewalls.includes(fw)); // Lógica evitarRng
        firewalls.push(fw);
    }
    rangeDisplay.innerText = `[${min}-${max}]`;
    console.log(`LOG ACESSO: Token: ${token} | Firewalls (${duplicar}): ${firewalls.join(', ')}`);
}

// Efeito de digitação gradual (Terminal Real)
async function digitarTexto(texto, classe, delay = 20) {
    const p = document.createElement('p');
    p.className = classe;
    p.innerHTML = "> "; 
    output.appendChild(p);
    
    for (let i = 0; i < texto.length; i++) {
        p.innerHTML += texto.charAt(i);
        output.scrollTop = output.scrollHeight;
        await new Promise(res => setTimeout(res, delay));
    }
    output.scrollTop = output.scrollHeight;
}

async function processarChute() {
    const numUser = parseInt(input.value);
    const valorDigitado = input.value;
    input.value = ""; // Limpa para a próxima entrada
    // 1. Validação de repetição (O que faltava)

    if (numUser === ultimoChute) {
        await digitarTexto(`AVISO: O token ${numUser} já foi testado sequencialmente. Tente outro.`, "msg-error");
        return; 
    }

    // 1. Validação de Entrada
    if (isNaN(numUser) || numUser < 0 || numUser > max) {
        await digitarTexto(`ERRO DE SINTAXE: '${valorDigitado}' está fora do intervalo permitido.`, "msg-error");
        return;
    }

    ultimoChute = numUser;

    // 2. Comando de Saída (0)
    if (numUser === 0) {
        await digitarTexto("SISTEMA: Encerrando conexão com o servidor remoto...", "msg-info");
        finalizarJogo();
        return;
    }

    // 3. Condição de Derrota (Firewall)
    if (firewalls.includes(numUser)) {
        await digitarTexto(`[!!!] RASTREIO DETECTADO NO SETOR ${numUser}!`, "msg-death");
        salvarResultado("derrota");
        await digitarTexto("FIREWALL ATIVADO. ACESSO BLOQUEADO PERMANENTEMENTE.", "msg-death");
        finalizarJogo();
        return;
    }

    // 4. Condição de Vitória (Token Correto)
   if (numUser === token) {
        await digitarTexto(`ACESSO GARANTIDO. Validando token ${token}... OK!`, "msg-win");
        await digitarTexto("SISTEMA LIBERADO. Deseja iniciar nova sessão?", "msg-info");
        salavarResultado("vitória");
        // Prepara o botão para reiniciar em vez de chutar
        btn.innerText = "REINICIAR";
        btn.onclick = reiniciarSessao; 
        input.disabled = true;
        return;
    }

    // 5. Lógica de Dicas e Regeneração (Regra das 5 tentativas)
    tentativasRestantes--;
    
    if (tentativasRestantes > 0) {
        const direcao = numUser > token ? "MENOR" : "MAIOR";
        await digitarTexto(`Token incorreto. Alvo é ${direcao} que ${numUser}.`, "msg-info");
        await digitarTexto(`Restam ${tentativasRestantes} tentativas. Firewalls ativos: ${duplicar}`, "msg-info");
    } else {
        await digitarTexto("ALERTA: Protocolo de segurança ativado!", "msg-error");
        await digitarTexto("Regenerando Token e DUPLICANDO Firewall...", "msg-death");
        
        // Aplica a lógica do seu C: Dobra os firewalls até o limite
        duplicar = Math.min(duplicar * 2, 100); 
        tentativasRestantes = limiteTentativas;
        ultimoChute = null;
        inicializarSistema();
        
        await digitarTexto(`SISTEMA REINICIALIZADO. Atualmente com ${duplicar} firewalls.`, "msg-info");
    }
}

function finalizarJogo() {
    input.disabled = true;
    btn.disabled = true;
    btn.innerText = "OFFLINE";
}

// Listeners
btn.addEventListener('click', processarChute);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processarChute();
});

// Inicialização
window.onload = () => {
    inicializarSistema();
    digitarTexto("CONECTANDO AO SERVIDOR TECHCORP...", "msg-info");
    setTimeout(() => {
        digitarTexto(`Aguardando inserção de token de segurança [${min}-${max}] para login.`, "msg-info");
    }, 800);
};

//Reiniciar jogo
function reiniciarSessao() {
    // Reset de variáveis de estado
    tentativasRestantes = limiteTentativas;
    ultimoChute = null;
    input.disabled = false;
    input.value = "";
    
    // Volta o botão ao estado original
    btn.innerText = "EXECUTAR";
    btn.onclick = null; // Remove o override e volta ao listener padrão do addEventListener
    
    // Limpa o terminal para nova invasão (opcional, se quiser manter o histórico, remova a linha abaixo)
    output.innerHTML = ""; 
    
    // Gera novo cenário
    inicializarSistema();
    digitarTexto("SISTEMA REINICIALIZADO. Novo token de segurança gerado.", "msg-info");
    input.focus();
}

function salvarResultado(status) {
    const dataHora = new Date().toLocaleString();
    const logPartida = `
========= LOG DE ACESSO TECHCORP =========
DATA/HORA: ${dataHora}
RESULTADO: ${status === "vitoria" ? "ACESSO CONCEDIDO" : "SISTEMA BLOQUEADO"}
TOKEN ALVO: ${token}
FIREWALLS ATIVOS: ${duplicar} (${firewalls.join(", ")})
TENTATIVAS RESTANTES: ${tentativasRestantes}
==========================================
`;

    // Cria o arquivo TXT
    const blob = new Blob([logPartida], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = `log_acesso_${status}.txt`;
    a.click();
    
    window.URL.revokeObjectURL(url);
}