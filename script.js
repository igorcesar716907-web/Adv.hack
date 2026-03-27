// Configurações do Jogo (Mesma lógica do C)
const min = 1;
const max = 20;
const totalTentativas = 3;

// Estado do Jogo
let num_sort = Math.floor(Math.random() * (max - min + 1)) + min;
let tentativasUsadas = 0;
let gameOver = false;

// Referências dos Elementos HTML
const outputArea = document.getElementById('terminal-output');
const userInput = document.getElementById('user-input');
const guessButton = document.getElementById('guess-btn');

// Função auxiliar para escrever na página (Terminal)
function writeToTerminal(message, type = 'info') {
    const newMessage = document.createElement('p');
    newMessage.classList.add(`msg-${type}`);
    newMessage.innerHTML = `> ${message}`;
    outputArea.appendChild(newMessage);
    
    // Rola o terminal para o final automaticamente
    outputArea.scrollTop = outputArea.scrollHeight;
}

// Início do Jogo
writeToTerminal("INICIALIZANDO PROTOCOLO DE ADIVINHAÇÃO...");
writeToTerminal(`Adivinhe números entre ${min} e ${max}`, 'info');
writeToTerminal(`Tentativas autorizadas: ${totalTentativas}`, 'info');

// Função principal do chute
function processarChute() {
    if (gameOver) return;

    const entrada = userInput.value;
    const num_user = parseInt(entrada);
    userInput.value = ''; 
    userInput.focus();

    // 1. VALIDAÇÃO COM PUNIÇÃO
    // Se não for número OU estiver fora do limite, punimos:
    if (isNaN(num_user) || num_user < min || num_user > max) {
        tentativasUsadas++; // <--- AQUI ESTÁ O DESCONTO DA TENTATIVA!
        let restante = totalTentativas - tentativasUsadas;

        if (isNaN(num_user)) {
            writeToTerminal("ERRO: Apenas números seu neandertal! Perdeu uma tentativa.", 'error');
        } else {
            writeToTerminal(`ERRO: Fora do intervalo (${min}-${max})! Perdeu uma tentativa.`, 'error');
        }

        verificarFimDeJogo(restante);
        return; // Para a execução aqui, mas a tentativa já foi cobrada
    }

    // 2. LÓGICA DE CHUTE CORRETO (Dentro das regras)
    tentativasUsadas++;
    let restante = totalTentativas - tentativasUsadas;

    if (num_user === num_sort) {
        writeToTerminal(`PARABÉNS!! O código era ${num_sort}`, 'win');
        finalizarJogo();
    } else {
        const dica = num_user > num_sort ? "MENOR" : "MAIOR";
        writeToTerminal(`ERRADO! O número é ${dica} que ${num_user}.`, 'lost');
        verificarFimDeJogo(restante);
    }
}

// Função auxiliar para não repetir código de "Game Over"
function verificarFimDeJogo(restante) {
    if (restante <= 0 && !gameOver) {
        writeToTerminal(`SISTEMA BLOQUEADO! O número era ${num_sort}.`, 'error');
        finalizarJogo();
    } else if (!gameOver) {
        writeToTerminal(`Tentativas restantes: ${restante}`, 'info')desabilitarr

// Função para encerrar o jogo e desabilitar entrada
function finalizarJogo() {
    gameOver = true;
    userInput.disabled = true;
    guessButton.innerHTML = "BLOQUEADO";
    guessButton.disabled = true;
}

// Eventos (Ouvir o clique do botão e a tecla ENTER)
guessButton.addEventListener('click', processarChute);

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        processarChute();
    }
});
