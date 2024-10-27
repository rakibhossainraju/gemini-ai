import AIModel from "@Core/AIModel.ts";

const aiModel = new AIModel();
const decoder = new TextDecoder();
const encoder = new TextEncoder();

let promptText = "";
for await (const prompt of Deno.stdin.readable) {
  const text = decoder.decode(prompt).trim();
  if (text === "exit") {
    console.log("%cGood Bye :)", "color: yellow;");
    Deno.exit(0);
  } else if (text !== "send") {
    promptText += text;
  } else {
    const result = await aiModel.generateContentStream(promptText);
    for await (const chunk of result.stream) {
      // Set background color to green for response input
      await Deno.stdout.write(encoder.encode(`\x1b[32m${chunk.text()}\x1b[0m\n`));
    }
    promptText = "";
  }
}


// import * as readline from 'node:readline/promises';
// import { stdin as input, stdout as output } from 'node:process';
//
// const rl = readline.createInterface({ input, output });
//
// rl.on('line', (input: string) => {
//   console.log(`Received: ${input}`);
// });
//
// rl.on('line', (input: string) => {
//   console.log(input);
//   if (input.trim() === 'exit') {
//     console.log('Good Bye :)');
//     rl.close();
//   } else {
//     // Process the input
//     console.log(`You typed: \x1b[31m${input}\x1b[0m`); // Red text
//   }
// });
//
