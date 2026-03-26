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
    // Se o jogo acabou, não faz nada
    if (gameOver) return;

    // Pega e valida a entrada do usuário
    const num_user = parseInt(userInput.value);
    userInput.value = ''; // Limpa o campo para o próximo chute
    userInput.focus();    // Mantém o foco no campo

    // Validação 1: Não é um número
    if (isNaN(num_user)) {
        writeToTerminal("ERRO: Apenas números seu neandertal! Tentativa anulada.", 'error');
        return;
    }

    // Validação 2: Fora do intervalo
    if (num_user < min || num_user > max) {
        writeToTerminal(`ERRO: Fora do intervalo autorizado (${min}-${max}) seu mierda! Tentativa anulada.`, 'error');
        return;
    }

    // Lógica do Chute
    tentativasUsadas++;
    const restante = totalTentativas - tentativasUsadas;

    if (num_user === num_sort) {
        writeToTerminal("SISTEMA ACESSADO!", 'info');
        writeToTerminal(`PARABÉNS!! Você acertou! Código sorteado foi ${num_sort}`, 'win');
        finalizarJogo();
        return;
    } 
    
    // Errou
    if (num_user > num_sort) {
        writeToTerminal(`ACESSO NEGADO! Código sorteado é MENOR que ${num_user}.`, 'lost');
    } else {
        writeToTerminal(`ACESSO NEGADO! Código sorteado é MAIOR que ${num_user}.`, 'lost');
    }

    // Fim das tentativas
    if (restante > 0) {
        writeToTerminal(`Tentativas restantes: ${restante}`, 'info');
    } else {
        writeToTerminal("BLOQUEIO DO SISTEMA ATIVADO!", 'lost');
        writeToTerminal(`Todas as tentativas acabaram! O número era ${num_sort}, melhore!`, 'error');
        finalizarJogo();
    }
}

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
