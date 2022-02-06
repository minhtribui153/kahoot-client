module.exports.startupQuestions = [
    {
        type: "input",
        name: "kahoot_pin",
        message: "Enter Kahoot Game PIN:",
        validate: (value) => {
            if (isNaN(value)) {
                return "Kahoot Game PIN must be a number";
            } else if (value.length < 6 || value.length > 7) {
                return "Enter a valid Kahoot Game PIN";
            } else {
                return true;
            }
        }
    },
    {
        type: "input",
        name: "username",
        message: "Enter username:",
        validate: (value) => {
            if (value.length > 15) {
                return "Username must not exceed 15 characters";
            } else if (value.length < 1) {
                return "Username required";
            } else {
                return true;
            }
        }
    }
];