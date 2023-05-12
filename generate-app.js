#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('./questions');
const ora = require('ora');

if (process.argv.length < 3) {
    console.log('You have to provide a name to your app.');
    console.log('For example :');
    console.log('    npx create-my-boilerplate my-app');
    process.exit(1);
}

const projectName = process.argv[2];
let currentPath = process.cwd();
currentPath = currentPath.replace(/(\s+)/g, '\\$1');
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/Muralikrishna22/my-cli.git";

try {
    fs.mkdirSync(projectPath);
} catch (err) {
    if (err.code === 'EEXIST') {
        console.log(`The file ${projectName} already exists in the current directory. Please give it another name.`);
    } else {
        console.log(err);
    }
    process.exit(1);
}

async function main() {
    try {
        clear();
        console.log(chalk.blueBright(figlet.textSync('Careers360 CLI', { horizontalLayout: 'full' })));
        const setupParameters = await inquirer.setupQuestions();
        console.log(chalk.greenBright("\n\nInitializing Project...!!!!\n\n"));

        const spinner = ora('Installing dependencies...').start();
        execSync('npm config set @cnext:registry https://npm.careers360.com');
        execSync('npm i --legacy-peer-deps');
        spinner.succeed('Dependencies installed successfully!');

        // ...

        console.log(
            chalk.greenBright(
                "\nThe installation is done, this is ready to use !\n"
            )
        );
        console.log(
            chalk.greenBright(
                `\ncd ${projectName}`
            )
        );
        console.log(
            chalk.greenBright(
                `npm run dev`
            )
        );
        console.log(
            chalk.greenBright(
                `\nEnjoy Coding...! \n`
            )
        );

    } catch (error) {
        console.log(error);
    }
}

main();
