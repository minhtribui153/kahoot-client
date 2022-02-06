const inquirer = require('inquirer');
const KahootClient = require('../classes/KahootClient');
const { startupQuestions } = require('../utils/questions');

module.exports.setup = () => {
    return inquirer.prompt(startupQuestions);
}

/**
 * 
 * @param {inquirer.Answers} result 
 */
module.exports.startClient = (result) => {
    const client = new KahootClient(result.username, result.kahoot_pin);
    client.joinGameNormal();
}