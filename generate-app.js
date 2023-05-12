#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const clear = require('clear');
const figlet = require('figlet');

if (process.argv.length < 3) {
    console.log('You have to provide a name to your app.');
    console.log('For example:');
    console.log('    npx my-cli <project>');
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

// Cleanup function to delete the created folder
async function cleanup() {
    const chalk = await import('chalk');
    console.log(chalk.default.yellow('\nCleaning up...'));
    try {
        fs.rmSync(projectPath, { recursive: true, force: true });
        console.log(chalk.default.red('installation cancelled:'));
        console.log(chalk.default.green('Cleanup completed.'));
    } catch (err) {
        console.log(chalk.default.red('Error during cleanup:', err));
    }
    process.exit(1);
}


async function main() {
    try {
        clear();
        const chalk = await import('chalk');
        const ora = await import('ora');
        const inquirer = await import('inquirer');
        console.log(chalk.default.blue(figlet.textSync('Careers360 CLI', { horizontalLayout: 'full' })));
        // const setupParameters = await inquirer?.prompt([
        //     // your setup questions here
        // ]);
        console.log(chalk.default.blue("\n\nInitializing Project...!!!!\n\n"));

        const spinner = ora.default('Installing dependencies...').start();
        spinner.start()
        // execSync('npm config set @cnext:registry https://npm.careers360.com');
        execSync('npm i --legacy-peer-deps');
        spinner.succeed('Dependencies installed successfully!');

        // ...

        console.log(chalk.default.green("\nThe installation is done. This is ready to use!\n"));
        console.log(chalk.default.green(`\ncd ${projectName}`));
        console.log(chalk.default.green("npm run dev"));
        console.log(chalk.default.green("\nEnjoy Coding...! \n"));

    } catch (error) {
        try {
            // Handle the SIGINT signal (manually interrupting the process)
            process.on('SIGINT', cleanup);
        } catch {
            console.log(error)
        }
    }
}

main();
