module.exports = class KahootError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}