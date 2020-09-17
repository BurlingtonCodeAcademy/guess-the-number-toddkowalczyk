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

async function start() {
  let lowPoint = 1;
  let highPoint = 100;
  let activeGame = true;
  let currentGuess = null;

  console.log("Let's play a game where you (human) make up a number and I (computer) try to guess it.")
  let secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
  console.log('You entered: ' + secretNumber);

  while (activeGame)
  {
    currentGuess = makeGuess(lowPoint, highPoint);
    answer = await ask("Is it " + currentGuess + " ?");
    
    if (answer.toLowerCase() === 'y') {
      console.log('Yes, it is!  Congrats!');
      process.exit();
    }
    else {
       direction = await ask("Is it Higher\(h\) or Lower \(l\)");   
    }

    if (direction.toLowerCase() === 'h') {
       lowPoint = currentGuess + 1;
    }
    else if (direction.toLowerCase() === 'l') {
       highPoint = currentGuess - 1;
    }
  }
}

start();
