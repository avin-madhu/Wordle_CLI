#!usr/bin/env node 

//node module imported 
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

let PlayerName;

const sleep = (ms = 2000)=>  new Promise((r) => setTimeout(r, ms));

async function welcome()
{
    const rainbowTitle = chalkAnimation.rainbow(
        'Hey Welcome to Quiz Game Bruh!\n'
    );

    await sleep();
    rainbowTitle.stop();

    console.log(`${chalk.bgBlue('How to play')}
    I am a process on this computer.
    
    `);
}


async function askName()
{
    const ans = await inquirer.prompt({
        name: 'Player_Name',
        type: 'input',
        message: 'What is your name?',
        default(){
            return 'Player';
        }
    });
    PlayerName = ans.Player_Name;
}

async function handleAnswer(isCorrect)
{
    const spinner = createSpinner('Checking Answer...').start();
    await sleep();

    if(isCorrect) {
        spinner.success({text: 'Nice Work '});
    }
    else 
    {
        spinner.error({text: 'Game Over'});
        process.exit(1);
    }
}


async function Question()
{
    const ans = await inquirer.prompt({
        name: 'Question_1',
        type: 'list',
        message: 'How many side does a square have?',
        choices: [
            '1',
            '3',
            '6',
            '4',
        ],
    })

    return handleAnswer(ans.Question_1=='4');

}

function winner()
{
    console.clear();
    const msg = `Congrats ${PlayerName}`;

    figlet(msg, (err, data)=>{
        console.log(gradient.pastel.multiline(data));
    });
}

winner();






