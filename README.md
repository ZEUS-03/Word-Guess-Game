# Word-Guess-Game
A Word Guessing game made with HTML, CSS and JavaScript which uses API to get the word and the user input word to validate the word.

## Functionality:

- In this game the player has to guess a random 5 letter word(valid word) and he/she has 6 chances to guess the word.

- If a letter exists in both the guessed word and the correct word and is on the right place, the box containing it will turn Green.

- If the letter exist in both the guessed word and the correct word but is not in the correct place, it's box will turn orange.

- If the letter does'nt exists in correct word, the box will turn grey.

- This game basically fetches a random 5 letter word from the API, Then takes input from the user.

- After getting a input when the user press enter, it'll validate the word.(Checks if that word exists or not) This is done by method 'POST'.

- API used for getting words is: https://words.dev-apis.com/word-of-the-day?random=1

- To validate our word API used is: https://words.dev-apis.com/validate-word

- Any Questions? Ask them away!!
