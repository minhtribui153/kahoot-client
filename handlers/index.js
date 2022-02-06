const inquirer = require('inquirer');
const Kahoot = require('kahoot.js-updated');
const KahootError = require('../classes/KahootError');
const answer = require('../functions/answer');
const { startupQuestions } = require('../utils/questions');

module.exports.setup = () => {
    return inquirer.prompt(startupQuestions);
}

/**
 * 
 * @param {inquirer.Answers} result 
 */
module.exports.startClient = (result) => {
    const client = new Kahoot();
    client
        .join(result.kahoot_pin, result.username, false)
        .catch((err) => {
            throw new KahootError(err, "JOIN_FAILED");
        });
    client.on('Joined', () => {
        console.clear();
        console.log(`Username: ${result.username} | PIN: ${result.kahoot_pin}\n`);
        console.log('You\'re in!\nSee your nickname on screen');
    });
    client.on('QuizStart', () => {
        console.clear();
        console.log(`Username: ${result.username} | PIN: ${result.kahoot_pin}\n`);
        console.log('Quiz started!\nGet ready!');
    });
    client.on('QuestionStart', (question) => {
        console.clear();
        console.log(`Username: ${result.username} | PIN: ${result.kahoot_pin}\n`);
        console.log(`Question ${Math.floor(question.questionIndex + 1)}:\n`);
        if (question.type === 'quiz') {
            if (question.layout === "CLASSIC") {
                const correctChoices = answer.getCorrectChoices(question.quizQuestionAnswers[question.questionIndex]);

                inquirer.prompt([
                    {
                        type: "list",
                        name: "answer",
                        choices: correctChoices,
                        message: "Select the correct answer:",
                    }
                ]).then((answers) => {
                    question.answer(parseInt(answers.answer));
                    answer.result.status(result, question);
                });
            } else if (question.layout === "TRUE_FALSE") {
                inquirer.prompt([
                    {
                        type: "list",
                        name: "answer",
                        choices: answer.choices.boolean,
                        message: "True or False?",
                    }
                ]).then((answers) => {
                    question.answer(parseInt(answers.answer));
                    answer.result.status(result, question);
                });
            }
        } else if (question.type === 'open_ended') {
            inquirer.prompt([
                {
                    type: "input",
                    name: "answer",
                    message: "Type your answer:",
                    validate: (value) => value.length > 0 ? true : "Please enter an answer",
                }
            ]).then((answers) => {
                question.answer(answers.answer);
                answer.result.status(result, question);
            });
        } else if (question.type === 'multiple_select_quiz') {
            const correctChoices = answer.getCorrectChoices(question.quizQuestionAnswers[question.questionIndex]);

            inquirer.prompt([
                {
                    type: "checkbox",
                    name: "answer",
                    choices: correctChoices,
                    message: "Select the correct answers:",
                }
            ]).then((answers) => {
                const answer2 = answers.answer.map((answer) => parseInt(answer));
                question.answer(answer2);
                answer.result.status(result, question);
            });
        }
    });
    client.on('QuestionEnd', (question) => {
        console.clear();
        console.log(`Question ${Math.floor(question.pointsData.lastGameBlockIndex + 1)}\n`);
        console.log(`Username: ${result.username} | PIN: ${result.kahoot_pin}\n`);
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
    client.on('QuizEnd', (quiz) => {
        answer.result.quizEnd(result, quiz);
    });
    client.on('Disconnect', (reason) => {
        console.clear();
        console.log('Disconnected:', reason);
        process.exit(0);
    });
}