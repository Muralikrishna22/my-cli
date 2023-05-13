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
const git_repo = "https://github.com/Muralikrishna22/ssr-source.git";

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

// questions to ask
const questions = [
    {
        type: 'list',
        name: 'SSR',
        message: 'Do want SSR:',
        choices: ['Yes', 'No'],
        default: 'Yes'
    },
    // {
    //     type: 'input',
    //     name: 'additionalInput1',
    //     message: 'Enter additional input 1:'
    //   },
    //   {
    //     type: 'input',
    //     name: 'additionalInput2',
    //     message: 'Enter additional input 2:'
    //   }
];


async function main() {
    try {
        clear();
        const chalk = await import('chalk');
        const ora = await import('ora');
        const inquirer = await import('inquirer');
        console.log(chalk.default.blue(figlet.textSync('Careers360 CLI', { horizontalLayout: 'full' })));
        try {
            const setupParameters = await inquirer.default.prompt(questions);
        } catch (error) {
            console.log(error)
        }

        console.log(chalk.default.blue("\n\nInitializing Project...!!!!\n\n"));

        const spinner = ora.default('Installing dependencies...').start();
        spinner.start()
        //  clone my boiler plate
        execSync(`git clone ${git_repo} ${projectPath}`);

        // Remove the Git folder
        execSync(`rm -rf ${path.join(projectPath, '.git')}`);

        // execSync('npm config set @cnext:registry https://npm.careers360.com');
        execSync('npm i --legacy-peer-deps', { cwd: projectPath });
        spinner.succeed('Dependencies installed successfully!');


        // Set up package name in package.json
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
        packageJson.name = projectName;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

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
