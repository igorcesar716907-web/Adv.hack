// CONFIGURAÇÕES (Baseadas no seu adv2.c)
const min = 1;
const max = 100;
const limiteTentativas = 5;
let tentativasRestantes = limiteTentativas;
let token, firewall;

const output = document.getElementById('output');
const input = document.getElementById('guess-input');
const btn = document.getElementById('guess-btn');
const rangeDisplay = document.getElementById('range-display');

// Lógica de sorteio e "evitarRng"
function inicializarSistema() {
    token = Math.floor(Math.random() * (max - min + 1)) + min;
    firewall = Math.floor(Math.random() * (max - min + 1)) + min;
    
    while (firewall === token) {
        firewall = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    rangeDisplay.innerText = `[${min}-${max}]`;
    console.log(`LOG ACESSO: Token: ${token} | Firewall: ${firewall}`);
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
}

async function processarChute() {
    const numUser = parseInt(input.value);
    const valorDigitado = input.value;
    input.value = ""; // Limpa para a próxima entrada

    // 1. Validação de Entrada
    if (isNaN(numUser) || numUser < 0 || numUser > max) {
        await digitarTexto(`ERRO DE SINTAXE: '${valorDigitado}' está fora do intervalo permitido.`, "msg-error");
        return;
    }

    // 2. Comando de Saída (0)
    if (numUser === 0) {
        await digitarTexto("SISTEMA: Encerrando conexão com o servidor remoto...", "msg-info");
        finalizarJogo();
        return;
    }

    // 3. Condição de Derrota (Firewall)
    if (numUser === firewall) {
        await digitarTexto(`[!!!] RASTREIO DETECTADO NO SETOR ${firewall}!`, "msg-death");
        await digitarTexto("FIREWALL ATIVADO. ACESSO BLOQUEADO PERMANENTEMENTE.", "msg-death");
        finalizarJogo();
        return;
    }

    // 4. Condição de Vitória (Token Correto)
   if (numUser === token) {
        await digitarTexto(`ACESSO GARANTIDO. Validando token ${token}... OK!`, "msg-win");
        await digitarTexto("SISTEMA LIBERADO. Deseja iniciar nova sessão?", "msg-info");
        
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
        await digitarTexto(`Token incorreto. DICA: O valor real é ${direcao} que ${numUser}.`, "msg-info");
        await digitarTexto(`Tentativas de acesso restantes: ${tentativasRestantes}`, "msg-info");
    } else {
        await digitarTexto("ALERTA: Muitas tentativas falhas detectadas!", "msg-error");
        await digitarTexto("Protocolo de segurança: Regenerando Token e Firewall...", "msg-error");
        
        tentativasRestantes = limiteTentativas;
        inicializarSistema();
        
        await digitarTexto("SISTEMA REINICIALIZADO. Tente novamente.", "msg-info");
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
        digitarTexto("Aguardando inserção de token de segurança [1-100] para login.", "msg-info");
    }, 800);
};

//Reiniciar jogo
function reiniciarSessao() {
    // Reset de variáveis de estado
    tentativasRestantes = limiteTentativas;
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