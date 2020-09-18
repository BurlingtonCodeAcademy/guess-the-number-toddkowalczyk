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
  let activeGame = true;

  console.log("\n\nLet's play a game where the computer picks a number\nbetween 1 and N and you try to guess it.\n")

  while (1) {
    highPoint = await ask("What number would you like for the high point of the guess range? ");
    if (highPoint > 1) {
      break;
    }
    else {
      console.log("The number for the high end of the range must be greater than 1");
    }
  }

 let secretNumber = makeGuess(lowPoint, highPoint);
 // console.log('The secret number is: ' + secretNumber + '\n');

  while (activeGame) {
    
    while (true) {
      guess = await ask("What is your guess? ");
      guess = parseInt(guess);

      if (guess === secretNumber) {
        console.log('Yes, it is! ' + secretNumber +' Congrats!');
        activeGame = false;
        process.exit();
      }
      else {
        console.log('Sorry that\'s not it.  Try again');
        console.log('Here is a hint, my secret number is ' + giveHint(guess, secretNumber));
      }
    }
  }
}

start()
