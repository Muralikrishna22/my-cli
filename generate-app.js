#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs')
const path = require('path');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('./questions')

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
        console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
    } else {
        console.log(err);
    }
    process.exit(1);
}

async function main() {
    try {
        //  Clear the initial terminal screen
        clear();

        // Welcome screen to careers360 CLI
        console.log(
            chalk.blueBright(
                figlet.textSync('Careers360 CLI', { horizontalLayout: 'full' })
            )
        );

        // Inquirer call for all the question
        // const setupParameters = await inquirer.setupQuestions();
        // console.log(setupParameters);

        // Initialize the project
        console.log(
            chalk.greenBright(
                "\n\nInitializing Project...!!!!\n\n"
            )
        );

        execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);
        process.chdir(projectPath);
        // To set npm scope and registry
        execSync('npm config set @cnext:registry https://npm.careers360.com');
        console.log('\nInstalling dependencies...\n');
        // Install packages
        execSync('npm i --legacy-peer-deps');

        // Remove unneeded parts
        console.log('\nFinishing the setup\n');
        execSync('npx rimraf ./.git');
        fs.rm(path.join(projectPath, 'bin'), { recursive: true }, (err) => {
            if (err) {
                console.log(err)
            }
        });

        console.log(
            chalk.greenBright(
                "\nThe installation is done, this is ready to use !\n"
            )
        )
        console.log(
            chalk.greenBright(
                `\ncd ${projectName}`
            )
        )
        console.log(
            chalk.greenBright(
                `npm run dev`
            )
        )
        console.log(
            chalk.greenBright(
                `\nEnjoy Coding...! \n`
            )
        )

    } catch (error) {
        console.log(error);
    }
}
main();

// compScript