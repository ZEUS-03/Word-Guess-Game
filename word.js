// import party from "party-js";

const letters = document.querySelectorAll(".character");
const spinny = document.querySelector(".info-bar");
const canvas = document.querySelector('#my-canvas');

const ANSWER_LENGTH = 5;
let done = false;
let ROUNDS = 6;

// console.log(letters)

// check if it's a valid letter using regex 
function isLetter(value) {
    return /^[a-zA-Z]$/.test(value);
}

// adding and removing show class from spinny class.
function setLoading(isLoading) {
    spinny.classList.toggle('show', isLoading);
}

// making a map to map number of each letter occured
function makeMap(array) {
    const obj = {};
    for(i=0; i<array.length; i++) {
        let word = array[i];
        if(obj[word]) {
            obj[word] += 1;
        }
        else {
            obj[word] = 1;
        }
    }
    return obj;
}

async function init() {
    let currentWord = '';
    let currentrow = 0;
    let isLoading = true;

    // getting the word-of-the-day using API call
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordSplit = word.split("");
    setLoading(false);
    isLoading = false;

    console.log(word);

    // to enter letters inside the boxes 
    function enterInput( keyPressed ) { 

        if (currentWord.length < ANSWER_LENGTH) {
            currentWord += keyPressed;
        } else {
            // replaced the last letter
            currentWord = currentWord.substring(0, currentWord.length - 1) + keyPressed;
        }
          
        letters[ANSWER_LENGTH * currentrow + currentWord.length - 1].innerText = keyPressed;
    }

    // function to deal with ENTER key.
    async function hitEnter () {
        
        if ( currentWord.length !== ANSWER_LENGTH ) {
            return;
        }

        setLoading(true);
        isLoading = true;

        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({word: currentWord})
        });

        const resObj = await res.json();
        const validWord = resObj.validWord;

        isLoading = false;
        setLoading(false);

        if (!validWord) {
            markInvalidWord();
            return;
        }

        const currentWordSplit = currentWord.split("");
        const map = makeMap(wordSplit);
        console.log(validWord);


        for ( i=0; i<ANSWER_LENGTH; i++ ) {
            if ( currentWordSplit[i] === wordSplit[i] ) {
                letters[ ANSWER_LENGTH * currentrow + i ].classList.add("correct");
                map[currentWordSplit[i]]--;
            } 
        }

        for ( i=0; i<ANSWER_LENGTH; i++ ) {
            if ( currentWordSplit[i] === wordSplit[i] ) {
                // Don't do anything
            } else if (wordSplit.includes(currentWordSplit[i]) && map[currentWordSplit[i]] > 0) {
                letters[ ANSWER_LENGTH * currentrow + i ].classList.add("close");
                map[currentWordSplit[i]]--;
            } else {
                letters[ ANSWER_LENGTH * currentrow + i ].classList.add("wrong");
            }
        }
        currentrow++;

        if ( currentrow === ROUNDS) {

            losingEvents();

        } else if (currentWord === word) {
            
            winningEvents();
        }
        currentWord = '';
    }
    // function for backspace
    function backSpace() {

        currentWord = currentWord.substring( 0, currentWord.length - 1 );
        letters[ANSWER_LENGTH * currentrow + currentWord.length].innerText = '';
    
    }

    function markInvalidWord() {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[currentrow * ANSWER_LENGTH + i].classList.remove("invalid");
    
            // repaint without the "invalid class" so we can then add it again
            setTimeout(
                () => letters[currentrow * ANSWER_LENGTH + i].classList.add("invalid"),
                10
            );
        }
    }

    // winning events
    function winningEvents() {

        document.querySelector(".popup").classList.add("show");
        const jsConfetti = new JSConfetti();
            jsConfetti.addConfetti(
                {
                emojis: ['🤯', '😎', '💥', '✨', '💫', '💕']
            });
        document.querySelector(".brand").classList.add("winner");
        document.querySelector(".close-popup").addEventListener("click", function() {
                document.querySelector(".popup").classList.remove("show");
        });
        done = true;
        return;
    }

    function losingEvents() {
        document.querySelector(".loss-heading").innerText = `Whoops! You lost😭. Answer is word: '${word}'`;
        const jsConfetti = new JSConfetti();
        
        jsConfetti.addConfetti({
            emojis: ['😭', '🥲', '💔', '🥹', '😢', '😿'],
            confettiRadius: 6,
        });
        document.querySelector(".popup-loss").classList.add("show");
        document.querySelector(".close-popup-loss").addEventListener("click", function() {
                document.querySelector(".popup-loss").classList.remove("show");
        });

        done = true;
    }

    document.addEventListener("keydown", function onKeyPress(event) {

        if (done || isLoading){
            return;
        }

        const keyPressed = event.key;
        // console.log(keyPressed);
       
        if (keyPressed === 'Enter') {
            hitEnter();
        } else if (keyPressed === 'Backspace') {
            backSpace();
        } else if (isLetter(keyPressed)){
            enterInput(keyPressed.toUpperCase());
        }
    })
}
init();