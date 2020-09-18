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

async function start() {
  let lowPoint = 1;
  let highPoint = null;
  let computerLowPoint = lowPoint;
  let computerHighPoint = null;
  let activeGame = true;

  console.log("\n\nLet's play a game where we try to guess a secret number between 1 and N.\n")

  while (1) {
    highPoint = await ask("What number would you like for the high point of the guess range? ");
    if (highPoint > 1) {
      computerHighPoint = highPoint;
      break;
    }
    else {
      console.log("The number for the high end of the range must be greater than 1");
    }
  }

  let secretNumber = makeGuess(lowPoint, highPoint);
  console.log('The secret number is: ' + secretNumber + '\n');

  while (activeGame) {

    while (true) {

      // Human's turn
      guess = await ask("What is your guess? ");
      guess = parseInt(guess);

      if (guess === secretNumber) {
        console.log('Yes, it is ' + secretNumber + '! Human\'s Rule!!');
        process.exit();
      }
      else { // Computer's turn
        guess = makeGuess(computerLowPoint, computerHighPoint);
        console.log('My guess is: ' + guess);

        if (guess === secretNumber) {
          console.log('Yes, it is ' + secretNumber + '! Computer\'s Rule!!');
          process.exit();
        }
        else {
          direction = giveHint(guess, secretNumber);
          if (direction === 'higher') {
            computerLowPoint = guess + 1;
          }
          else if (direction === 'lower') {
            computerHighPoint = guess - 1;
          }
        }
      }
      console.log('Hint, the number is ' + direction);
    }
  }
}

start()
