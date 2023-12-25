#!usr/bin/env node 

import fs from 'fs';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

let secretWord;
let PlayerName;
let tries = 6;

// Function to read words from a file
function readWordsFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').map((word) => word.trim()).filter(Boolean);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }
}

// Function to generate a random word for the game
function generateSecretWord() {
  const words = readWordsFromFile('words.txt');
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

// Display a welcome message and introduce the basic rules.
async function welcome() {
  console.clear();

  // Print Wordle CLI text synchronously
  const Header = "Wordle CLI ";
  const headerText = await new Promise((resolve) => {
    figlet(Header, (err, data) => {
      resolve(data);
    });
  });

  console.log("\n\n");
  console.log(gradient.pastel.multiline(headerText));

  // Display game rules
  console.log(`${chalk.bgBlackBright.bold('How to play')}
    -> Enter a word to guess.
    -> You have 6 guesses.
    `);

  secretWord = generateSecretWord();
}


// Get the name of the player
async function askName() {
  const ans = await inquirer.prompt({
    name: 'Player_Name',
    type: 'input',
    message: 'What is your name?',
    default() {
      return 'Player';
    },
  });
  return ans.Player_Name;
}

// Function to generate clues for the given guess
function generateClues(word, secret) {

   const clues = [];

  const words = readWordsFromFile('words.txt');
  if(words.includes(word))
  {
    for (let i = 0; i < secret.length; i++) {
      if (word[i] === secret[i]) {
        clues.push(chalk.green(word[i])); // Correct letter in the correct position
      } else if (secret.includes(word[i])) {
        clues.push(chalk.yellow(word[i])); // Correct letter in the wrong position
      } else {
        clues.push(chalk.gray('_')); // Incorrect letter
      }
    }
    return clues.join(' ');
  }
  else
  {
    console.log("\nThe word is not in the word List\nTry Again\n");
  }


}

// Handle the player's guess
 async function handleGuess(word) {
  const spinner = createSpinner('Checking the word...').start();
  await sleep();

  const clues = generateClues(word, secretWord);

  if (word === secretWord) {
    spinner.success('');
    console.clear();
    const msg = `C o n g r a t s \t\t\t${PlayerName}`;

    figlet(msg, (err, data)=>{
        console.log(gradient.pastel.multiline(data));
    });
    console.log("\n\nYou Guessed the correct word\nThank you for playing!\n\n\n\n");
    process.exit(0);
  } else {
    spinner.error({ text: `Incorrect guess. Clues: ${clues}\n\n` });
    tries--;

    if (tries === 0) {
      console.log(chalk.red(`Sorry, you're out of attempts. The correct word was ${secretWord}.`));
      process.exit(1);
    }
  }
}

// Ask the player to make a guess
async function makeGuess() {
  const word = await inquirer.prompt({
    name: 'Get_word',
    type: 'input',
    message: `\n\nAttempt-${6 - tries + 1}: Guess the word:`,
    validate(input) {
      if (!input || input.trim() === '') {
        return 'Please enter a word.';
      }
      return true;
    },
  });

  return handleGuess(word.Get_word.toLowerCase());
}

// Main game loop
async function playWordle() {
  // PlayerName = await askName();
  while (tries > 0) {
    await makeGuess();
  }
}

// Start the game
await welcome();
playWordle();
