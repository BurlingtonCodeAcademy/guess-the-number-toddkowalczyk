const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

function makeGuess(lowRange, highRange) {
  guess = Math.floor(Math.random() * (highRange - lowRange) + lowRange);
  return guess;
}

function humanIsCheating(direction, guess, secret) {

  if (direction.toLowerCase() === 'l'
    && (guess <= secret)) {
    return true;
  }
  else if (direction.toLowerCase() === 'h'
    && (guess >= secret)) {
    return true;
  }
  else {
    return false;
  }
}

async function start() {
  let lowPoint = 1;
  let highPoint = null;
  let activeGame = true;
  let currentGuess = null;

  console.log("\n\nLet's play a game where you (human) make up a number\nbetween 1 and N and I (computer) try to guess it.\n")

  while (1) {
    highPoint = await ask("What number would you like for the high point of the guess range? ");
    if (highPoint > 1) {
      break;
    }
    else {
      console.log("The number for the high end of the range must be greater than 1");
    }
  }

  let secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
  console.log('You entered: ' + secretNumber + '\n');

  while (activeGame) {
    currentGuess = makeGuess(lowPoint, highPoint);

    while (true) {
      answer = await ask("Is it " + currentGuess + " ? ");

      if (answer.toLowerCase() === 'y') {
        console.log('Yes, it is!  Congrats!');
        process.exit();
      }
      else if (answer.toLowerCase() === 'n') {
        direction = await ask("Is it Higher\(h\) or Lower \(l\)? ");
        break;
      }
      else {
        console.log('You must answer with a y or n.  Please try again.');
      }
    }

    if (humanIsCheating(direction, currentGuess, secretNumber)) {
      console.log('Cheater Cheater! I quit!!');
      process.exit();
    }

    while (true) {
      if (direction.toLowerCase() === 'h') {
        lowPoint = currentGuess + 1;
        break;
      }
      else if (direction.toLowerCase() === 'l') {
        highPoint = currentGuess - 1;
        break;
      }
      else {
        console.log('You must enter an h or a l');
      }
    }
  }
}

start();
