#!/usr/bin/env node
const { setup, startClient } = require('./handlers');

console.clear();
console.log('Welcome to Kahoot Client!\n');

setup().then((result) => {
    startClient(result);
})