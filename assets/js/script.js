//let parole1 = ["astronauta", "computer", "giocattolo", "cassaforte", "pianoforte"]; //array di palore
//let parole2 = ["natale", "città", "capodanno"]; //seconda array di palore
let parolaNascosta = ""; 
let pnArray;
let imagesArray = ["assets/img/imp1.png", "assets/img/imp2.png", "assets/img/imp3.png", "assets/img/imp4.png", 
"assets/img/imp5.png", "assets/img/imp6.png"]; //array contenente i path delle immagini per diegnare l'impiccato
let tries = 0;
let maxTries = 7; 
let guessedLettersCount = 0; //variabile per contare le lettere indovinate

//parolaNascosta = getRandomWordFromArray(parole1); //assegno la funzione a parolaNascosta per farle prelevare randomicamente una parola dall'array

fetch("https://random-word-api.herokuapp.com/word?lang=it&number=1")
.then(Response => Response.json())
.then(json => getRandomWordFromAPI(json[0])
)

async function getRandomWordFromAPI(hiddenWord) {
    parolaNascosta = hiddenWord;
    pnArray = parolaNascosta.split(""); //assegno la parola nascosta e splittata a pnArray
    createImg(); //richiamo le funzioni principali
    buildWordOnPage();
    buildKeyboard();
}

function createImg() { //creo la funzione per settare l'immagine principale all'inizio del gioco
    const hangman = document.createElement("img"); 
    hangman.classList = "img";
    hangman.src = "assets/img/imp0.png";
    hangman.setAttribute("id", "img"); //gli setto l'attribbuto id per poterlo usare nella sostituzione delle immagini
    document.querySelector("#image").appendChild(hangman); 
}

function buildWordOnPage() {
    for (let i = 0; i < pnArray.length; i++) {
        buildLetterOnPage(i); //funzione che costruisce lettera per lettera la parola nascosta in array
    }
}

function buildLetterOnPage(index) { //index è un paramentro della funzione invece quando la richiamo gli assegno il mio parametro effettivo (es i)
    let tempDiv = document.createElement("div"); //creo un elemento di tipo div e lo assengno a tempDiv
    tempDiv.classList.add("char");
    let tempP = document.createElement("p"); //creo un elemento di tipo p e lo assengno a tempP
    tempP.setAttribute("id", "lettera-" + index);
    tempP.innerText = "_"; //copro la porola con dei trattini anche nell'ispeziona
    tempDiv.appendChild(tempP);
    document.querySelector("#word").appendChild(tempDiv); 
}

function buildKeyboard() { 
    for (let i = 65; i <= 90; i++) {
        let lettera = String.fromCharCode(i);
        let tasto = document.createElement("button"); 
        tasto.classList.add("btn");
        tasto.dataset.lettera = lettera;
        tasto.innerText = lettera;
        tasto.addEventListener("click", (event) => { //richiamo così l'evento del click e richiamo la funzione
            gestisciClick(event);
        });
        document.querySelector("#keyboard").appendChild(tasto);
    }
}

function gestisciClick(event) {
    let button = event.target; //attribuisco a bottone l'evento
    button.disabled = true; //disabilto il bottone al momento del click
    controllo = checkLetterIsCorrect(button.getAttribute("data-lettera")); // prendo da bottone l'attributo
}

function checkLetterIsCorrect(selectedLetter) { //selectedLetter è un paramentro della funzione
    flag = false;
    for(i = 0; i < pnArray.length; i++) {
        let letter = pnArray[i]; //assegno a letter ogni lettera dell'array
        if (selectedLetter == letter.toUpperCase()) { //confronto tra la lettera selezzionata e le lettere della parola al maiuscolo
            showLetter(i, selectedLetter); //richiamo funzione dandogli i parametri i del for la lettera selezionata
            flag = true; 
            guessedLettersCount++; //incrementa il conteggio delle lettere indovinate
        }
    }
    checkIfWordIsCompleted(guessedLettersCount); //richiamo funzione dandole come paramentro il conteggio delle lettere indovinate
    if (!flag) { //entra se il flag è false
        drawhangman();
    }
}

function showLetter(index, letter) {
    let hiddenLetter = document.getElementById("lettera-" + index); //assegno alla lettera nascosta una ricerca tramite id
    hiddenLetter.innerText = letter; //assegno la lettera alla lettera nascosta per stamparla tramite id nel posto corretto
}

function drawhangman() {
    let image = document.getElementById('img');
    image.src = imagesArray[tries]; //do alla source di image l'array con i path e all'interno i tentativi
    tries++; //incremento i tentativi
    cheackTries(); //richiamo funzione che mi dice se ho finito i tentativi
}

function cheackTries() {
    if (tries == maxTries) { //confronto i miei tentativi con i tentativi massimi
        alert("Hai perso! - La parola era " + parolaNascosta);
        reset(); //richiamo la funzione del reset per ricominciare il gioco dopo l'ok dell'alert
    }
}

function checkIfWordIsCompleted(guessedLetters) { 
    setTimeout(() => { //per non far spuntare immediatamente l'alert
        if (guessedLetters == pnArray.length) {
            alert("Hai vinto! - La parola era " + parolaNascosta);
            reset(); 
        }
    }, 1000)
}

function reset() { //funzione per resettare la pagina
    window.location.reload();
}