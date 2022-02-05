const KahootError = require("../classes/KahootError");

/**
 * 
 * @param {number} numberOfChoices 
 */
module.exports.getCorrectChoices = (numberOfChoices) => {
    const correctChoices = [];

    for (let i = 0; i < numberOfChoices; i++) {
        correctChoices.push(this.choices.default[i]);
    }

    return correctChoices;
}

module.exports.result = {
    /**
     * @param {{ username: string, kahoot_pin: any }} user
     * @param {*} question
     */
    status: (user, question) => {
        const words = [
            "Smart Genius?",
            "Way to go!",
            "That's fast!",
            "You're on fire!",
            "Super!",
        ]
        console.clear();
        console.log(`Username: ${user.username} | PIN: ${user.kahoot_pin}\n`);
        console.log(`Question ${Math.floor(question.questionIndex + 1)}:\n`);
        console.log(`${words[Math.floor(Math.random() * words.length)]} Waiting for others to answer...\n`);
    },
    /**
     * @param {{ username: string, kahoot_pin: any }} user
     * @param {*} question
     */
    quizEnd: (user, quiz) => {
        console.clear();
        const rankWords = [
            "Nice job!",
            "You topped the leaderboard!",

        ];
        const belowRankWords = [
            "Can you top it next time?",
            "At least you tried your best!",
            "Keep it up!",
        ];

        const words = quiz.rank < 5 ? rankWords : belowRankWords;
        const chosen = words[Math.floor(Math.random() * words.length)];
        console.clear()
        console.log(`Username: ${user.username} | PIN: ${user.kahoot_pin}\n`);
        console.log('Quiz ended!');
        console.log(`Your rank is ${quiz.rank}. ${chosen}`);
        console.log(`Your total score is: ${quiz.totalScore}`);
    }

}

module.exports.choices = {
    default: [
        {
            name: "🔺",
            value: 0,
        },
        {
            name: "🔷",
            value: 1,
        },
        {
            name: "🟡",
            value: 2,
        },
        {
            name: "🟩",
            value: 3,
        }
    ],
    boolean: [
        {
            name: "🔷 True",
            value: 0,
        },
        {
            name: "🔺 False",
            value: 1,
        }
    ]
}