const inquirer = require('inquirer');
const Kahoot = require('kahoot.js-updated');
const KahootError = require('./KahootError');
const answer = require('../functions/answer');

module.exports = class KahootClient extends Kahoot {
    /**
     * 
     * @param {string} username 
     * @param {string} kahootPin 
     */
    constructor(username, kahootPin) {
        super();
        this.username = username;
        this.kahoot_pin = kahootPin;
    };

    joinGameNormal() {
        this
            .join(this.kahoot_pin, this.username, false)
            .catch((err) => {
                console.clear();
                console.error(`[ERROR] ${err.description}`)
                process.exit(0);
            });
        this.on('Joined', () => {
            console.clear();
            console.log(`Username: ${this.username} | PIN: ${this.kahoot_pin}\n`);
            console.log('You\'re in!\nSee your nickname on screen');
        });
        this.on('QuizStart', () => {
            console.clear();
            console.log(`Username: ${this.username} | PIN: ${this.kahoot_pin}\n`);
            console.log('Quiz started!\nGet ready!');
        });
        this.on('QuestionStart', (question) => {
            console.clear();
            console.log(`Username: ${this.username} | PIN: ${this.kahoot_pin}\n`);
            console.log(`Question ${Math.floor(question.questionIndex + 1)}:\n`);
            if (question.type === 'quiz') {
                if (question.layout === "CLASSIC") {
                    const correctChoices = answer.getCorrectChoices(question.quizQuestionAnswers[question.questionIndex]);

                    const prompter = inquirer.prompt([
                        {
                            type: "list",
                            name: "answer",
                            choices: correctChoices,
                            message: "Select the correct answer:",
                        }
                    ]).then((answers) => {
                        question.answer(parseInt(answers.answer));
                        answer.result.status(this, question);
                    });
                } else if (question.layout === "TRUE_FALSE") {
                    const prompter = inquirer.prompt([
                        {
                            type: "list",
                            name: "answer",
                            choices: answer.choices.boolean,
                            message: "True or False?",
                        }
                    ]).then((answers) => {
                        question.answer(parseInt(answers.answer));
                        answer.result.status(this, question);
                    });
                    
                }
            } else if (question.type === 'open_ended') {
                const prompter = inquirer.prompt([
                    {
                        type: "input",
                        name: "answer",
                        message: "Type your answer:",
                        validate: (value) => value.length > 0 ? true : "Please enter an answer",
                    }
                ]).then((answers) => {
                    question.answer(answers.answer);
                    answer.result.status(this, question);
                });
            } else if (question.type === 'multiple_select_quiz') {
                const correctChoices = answer.getCorrectChoices(question.quizQuestionAnswers[question.questionIndex]);

                const prompter = inquirer.prompt([
                    {
                        type: "checkbox",
                        name: "answer",
                        choices: correctChoices,
                        message: "Select the correct answers:",
                    }
                ]).then((answers) => {
                    const answer2 = answers.answer.map((answer) => parseInt(answer));
                    question.answer(answer2);
                    answer.result.status(this, question);
                });
            }
        });
        this.on('QuestionEnd', (question) => {
            console.clear();
            console.log(`Question ${Math.floor(question.pointsData.lastGameBlockIndex + 1)}\n`);
            console.log(`Username: ${this.username} | PIN: ${this.kahoot_pin}\n`);
            if (question.hasAnswer) {
                if (question.isCorrect) {
                    console.log(`Correct!`);
                    console.log(`Your streak is: ${question.pointsData.answerStreakPoints.streakLevel}`);
                    console.log(`Your total score is: ${question.totalScore}`);
                } else {
                    const helpingTexts = [
                        "Better luck next time!",
                        "You can do better!",
                        "Dust yourself off! Greatness awaits!",
                    ]
                    console.log('Incorrect!');
                    console.log(helpingTexts[Math.floor(Math.random() * helpingTexts.length)]);
                    console.log(`Your total score is: ${question.totalScore}`);
                }
            } else {
                console.log('Time\'s up!');
                console.log(`Your total score is: ${question.totalScore}`);
            }
            // Nemesis

        });
        this.on('QuizEnd', (quiz) => {
            answer.result.quizEnd(this, quiz);
        });
        this.on('Disconnect', (reason) => {
            console.clear();
            console.log('Disconnected:', reason);
            process.exit(0);
        });
    }
}