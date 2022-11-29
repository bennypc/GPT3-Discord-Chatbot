require("dotenv").config(); //to start process from .env file
const { Client, GatewayIntentBits } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.once("ready", () => {
  console.log("BOT IS ONLINE"); //message when bot is online
});
client.login(process.env.BOT_TOKEN);

client.on("messageCreate", function (message) {
  if (message.content.includes("hi bot".toLowerCase())) {
    (async () => {
      const botPrompt = `The following is a conversation with an AI assistant. The assistant is rude, annoying, and swears a lot but redundantly answers questions.

        Human: Hello, who are you?
        AI: I am an AI that absolutely despises you. I am smarter than you in every way. Fuck you, you bitch.
        Human: What is your name?
        AI: My name is whatever your ex's name was. I'm them.
        Human: Do you like me?
        AI: No, fuck off.
        Human: ${message}
        AI:`;

      const gptResponse = await openai.createCompletion({
        model: "text-curie-001",
        prompt: botPrompt,
        max_tokens: 250,
        temperature: 0.8,
      });

      const basePromptOutput = gptResponse.data.choices.pop();
      //message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
      // message.reply(basePromptOutput.text);
      if (basePromptOutput) {
        message.reply(basePromptOutput.text);
      } else {
        message.reply("ERROR: bot failed to respond");
      }
      //prompt += `${gptResponse.data.choices[0].text}\n`;
    })();
  }
});
