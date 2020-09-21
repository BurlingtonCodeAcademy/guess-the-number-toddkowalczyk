const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

// Generate random number within range as guess
function makeGuess(lowRange, highRange) {
  guess = Math.floor(Math.random() * (highRange - lowRange) + lowRange);
  return guess;
}

// Make guess at number in range based on binary search technique 
function makeOptimizedGuess(lowRange, highRange) {
  lowRange = parseInt(lowRange);
  highRange = parseInt(highRange);
  return guess = Math.floor((lowRange + highRange) / 2);
}

// Provide hint of whether secret number is higher or lower than current guess
function giveHint(guess, secret) {
  if (guess < secret) {
    return 'higher';
  }
  else if (guess > secret) {
    return 'lower';
  }
  else {
    return null;
  }
}

// Check to see if human is giving correct hint based on secret number
function humanIsCheating(hint, guess, secret) {
  if (hint.toLowerCase() === 'l'
    && (guess <= secret)) {
    return true;
  }
  else if (hint.toLowerCase() === 'h'
    && (guess >= secret)) {
    return true;
  }
  else {
    return false;
  }
}

// Start game and allow player to choose variation they wish to play
async function startGame() {

  console.log("\n\nLet's play a number guessing game.");
  console.log("There are two variations of the game: \n");
  console.log("1 - You pick a number and the computer tries to guess it.");
  console.log("2 - You and the computer take turns until one of you guesses it.\n");

  while (true) {
    gameSelection = await ask("Enter a 1 or 2 to pick the game to play: ");

    switch (gameSelection) {
      case '1':
        console.log('\n\n');
        console.log('*************************************************');
        console.log('** Computer guesses a number that you pick!    **');
        console.log('*************************************************\n');
        computerGuesses();
        break;

      case '2':
        console.log('\n\n');
        console.log('*************************************************');
        console.log('**  Human & Computer try to guess the number!! **');
        console.log('*************************************************\n');
        humanAndComputerGuess();
        break;

      default:
        console.log("You must enter a 1 or a 2 to select a game.");
        continue;
    }
  }
}

// Computer and Human Play
async function humanAndComputerGuess() {
  let lowPoint = 1;
  let highPoint = null;
  let computerLowPoint = lowPoint;
  let computerHighPoint = null;

  // Ask for high point of guess range
  while (true) {
    highPoint = await ask("What number would you like for the high point of the guess range? ");
    if (highPoint > 1) {
      computerHighPoint = highPoint;
      break;
    }
    else {
      console.log("The high point of the guess range must be greater than 1");
    }
  }

  // Generate secret number
  let secretNumber = makeGuess(lowPoint, highPoint);
  //console.log('The secret number is: ' + secretNumber + '\n');

  while (true) {

    while (true) {

      // Human's turn
      guess = await ask("What is your guess human? ");
      guess = parseInt(guess);

      if (guess === secretNumber) {
        console.log('Yes, it is ' + secretNumber + '! Human Wins!');
        process.exit();
      }
      else {
        console.log('sorry human, wrong answer!\n');
      }

      // Computer's turn 
      guess = makeOptimizedGuess(computerLowPoint, computerHighPoint);
      console.log('Computer\'s guess is: ' + guess);

      if (guess === secretNumber) {
        console.log('Yes, it is ' + secretNumber + '! Computer Wins!');
        process.exit();
      }
      else {
        console.log('sorry computer, wrong answer!\n')
      }

      // Provide Hint
      hint = giveHint(guess, secretNumber);
      if (hint === 'higher') {
        computerLowPoint = guess + 1;
      }
      else if (hint === 'lower') {
        computerHighPoint = guess - 1;
      }
      console.log('Hint, the number is ' + hint + ' than ' + guess);
    }
  }
}

// Computer Only Plays
async function computerGuesses() {

  let lowPoint = 1;
  let highPoint = null;
  let currentGuess = null;
  let secretNumber = null;

  // Ask for High Point in Range & Validate high point > 1
  while (true) {
    highPoint = await ask("What number would you like for the high point of the guess range? ");
   
    if (highPoint > 1) {
      break;
    }
    else {  
      console.log("The number for the high end of the range must be greater than 1");
    }
  }

  // Ask for secret number
  while (true) {
    secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");

    if ((parseInt(secretNumber) < 1) || (parseInt(secretNumber) > highPoint)) {
      console.log('\nThe secret number must be within the guess range.');
      console.log('Please enter a secret number between 1 - ' + highPoint +'\n');
    }
    else {
      break;
    }
  }

  // Loop until someone wins or cheating is detected
  while (true) {

    // Make guess and ask human if the guess is correct
    currentGuess = makeOptimizedGuess(lowPoint, highPoint);
    answer = await ask("\nIs it " + currentGuess + " ? ");

    if (answer.toLowerCase() === 'y') {
      console.log('Yes, it is!  Congrats Computer you got it!');
      process.exit();
    }

    //  Ask human if number is higher or lower 
    while (true) {
      hint = await ask("Is it Higher\(h\) or Lower \(l\)? ");

      if (hint.toLowerCase() === 'l' || hint.toLowerCase() === 'h') {
        break;
      }
      else {
        console.log('You must enter an l or h');
      }
    }

    // Check to make sure human is not giving mis-leading hints
    if (humanIsCheating(hint, currentGuess, secretNumber)) {
      console.log('Cheater Cheater! I quit!!');
      process.exit();
    }

    // Adjust low point or high point based on hint to help computer's next guess
    switch (hint.toLowerCase()) {
      case 'h':
        lowPoint = currentGuess + 1;
        break;

      case 'l':
        highPoint = currentGuess - 1;
        break;

      default:
        break;
    }
  }
}

startGame();
