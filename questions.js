const inquirer = require('inquirer');

module.exports = {
    setupQuestions: () => {
        const questions = [
            {
                type: 'list',
                name: 'store',
                message: 'Do want store included:',
                choices: ['Yes', 'No'],
                default: 'Yes'
            },
            {
                type: 'list',
                name: 'SSR',
                message: 'Do want SSR:',
                choices: ['Yes', 'No'],
                default: 'Yes'
            },
        ];
        return inquirer.prompt(questions);
    },
};