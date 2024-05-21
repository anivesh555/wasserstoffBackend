// openaiSetup.js

const OpenAI = require('openai');

const openaiApiKey = process.env.OPENAIKEY ; // Replace with your actual API key
let openaiClient;
console.log(openaiApiKey)

try {
    openaiClient = new OpenAI({
        apiKey: process.env.OPENAIKEY, // This is the default and can be omitted
      });
} catch (error) {
    console.error('Error initializing OpenAI client:', error);
    process.exit(1); // Exit the process with a non-zero exit code to indicate failure
}

module.exports = openaiClient;
